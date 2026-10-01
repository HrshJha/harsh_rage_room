"""Rebuild the game-ready CC0 Foley clips from the reviewed Freesound previews."""
from __future__ import annotations
import csv
import hashlib
import json
import subprocess
import urllib.request
from pathlib import Path

import numpy as np
from scipy.signal import butter, sosfilt

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / 'docs/audio/source-manifest.json').read_text())
SOURCE_DIR = ROOT / 'audio-source'
DEST = ROOT / 'web/public/audio'
SOURCE_DIR.mkdir(exist_ok=True)


def get_source(source: dict) -> Path:
    path = SOURCE_DIR / f"{source['name']}-{source['source_id']}.mp3"
    if not path.exists():
        req = urllib.request.Request(source['source_url'], headers={'User-Agent': 'Mozilla/5.0'})
        page = urllib.request.urlopen(req, timeout=30).read().decode('utf8', 'ignore')
        if 'Creative Commons 0' not in page:
            raise RuntimeError(f"License must be rechecked: {source['source_url']}")
        req = urllib.request.Request(source['preview_url'], headers={'User-Agent': 'Mozilla/5.0'})
        path.write_bytes(urllib.request.urlopen(req, timeout=60).read())
    return path


def decode(path: Path) -> np.ndarray:
    data = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(path), '-ar', '48000', '-ac', '1', '-f', 'f32le', '-'])
    return np.frombuffer(data, dtype=np.float32).copy()


sources = {s['name']: s for s in DATA['sources']}
decoded = {name: decode(get_source(s)) for name, s in sources.items()}
rows = []
for clip in DATA['clips']:
    source = sources[clip['source']]
    signal = decoded[clip['source']]
    peak = clip['peak_seconds']
    begin = max(0, int((peak - 0.018) * 48000))
    end = min(len(signal), int((peak + clip['tail_seconds']) * 48000))
    sample = signal[begin:end].copy()
    if len(sample) < 2400:
        raise RuntimeError(f"Clip too short: {clip['file']}")
    sample = sosfilt(butter(2, 60, 'highpass', fs=48000, output='sos'), sample)
    sample = sosfilt(butter(2, clip['lowpass_hz'], 'lowpass', fs=48000, output='sos'), sample)
    sample /= max(np.max(np.abs(sample)), 1e-5)
    sample *= 0.45  # approximately -7 dBFS sample peak; the game bus sets the final mix
    fade_in = min(len(sample), 240)
    fade_out = min(len(sample), 2200)
    sample[:fade_in] *= np.linspace(0, 1, fade_in, dtype=np.float32)
    sample[-fade_out:] *= np.linspace(1, 0, fade_out, dtype=np.float32)
    target = DEST / clip['file']
    target.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'f32le', '-ar', '48000', '-ac', '1', '-i', 'pipe:0', '-c:a', 'libmp3lame', '-q:a', '4', str(target)], input=sample.astype(np.float32).tobytes(), check=True)
    rows.append({
        'asset_id': clip['file'], 'local_file': str(target.relative_to(ROOT)),
        'source_type': 'Freesound CC0 preview', 'source_url': source['source_url'],
        'creator': source['author'], 'license_name': 'CC0 1.0', 'license_version': '1.0',
        'download_date': DATA['verified_on'], 'modifications': f"trim around {peak}s; mono; EQ; fade; MP3 encode",
        'attribution_required': 'no', 'public_credit_text': f"{source['author']} — {source['source_url']}",
        'approved_by': 'pending listening review', 'sha256': hashlib.sha256(target.read_bytes()).hexdigest(),
    })
ledger = ROOT / 'docs/audio/ASSET_CREDITS.csv'
with ledger.open('w', newline='') as handle:
    writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
    writer.writeheader()
    writer.writerows(rows)
print(f"Built {len(rows)} Foley clips ({sum((DEST / x['file']).stat().st_size for x in DATA['clips']) / 1024:.1f} KiB).")
