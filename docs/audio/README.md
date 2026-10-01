# Foley source and rebuild notes

The five everyday attacks use 18 short contact clips and two supporting layers in `web/public/audio`. They were edited from the **HQ preview MP3s** of the individually checked CC0 Freesound pages listed in [ASSET_CREDITS.csv](ASSET_CREDITS.csv). These are compressed previews, not original lossless source masters. The ledger records every shipped file, author, source page, edit, and SHA-256 hash; CC0 does not require public attribution, but the source links are published here for transparency.

`source-manifest.json` holds the reviewed URLs and trim points. To rebuild:

```bash
python3 scripts/build-foley.py
```

The script needs FFmpeg, NumPy, and SciPy. It downloads missing previews into ignored `audio-source/`, checks each source page for its displayed CC0 label, and writes the public clips and ledger. A rebuild can differ if a remote preview changes; compare hashes before shipping.

Automated checks established that all 20 files decode, their peaks are around −7 dBFS, measured onsets are 1–18 ms after decode, and their aggregate transfer size is 72 KiB. Those checks do **not** establish a safe summed true peak, distinctness by ear, material realism, or contact sync on a real device. The ledger's `approved_by` column therefore remains `pending listening review`; perform the blind listening and real-device checks in the [audio addendum](../ARCADE_AUDIO_ADDENDUM.md) before treating the mix as final.
