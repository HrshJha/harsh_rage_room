import type { Certificate } from '../core/store';
function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  max: number,
  line: number,
) {
  const words = text.split(' ');
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width > max && current) {
      ctx.fillText(current, x, y);
      y += line;
      current = word;
    } else current = next;
  }
  ctx.fillText(current, x, y);
  return y + line;
}
export async function renderCertificate(data: Certificate, story = false): Promise<Blob> {
  await document.fonts.ready;
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = story ? 1920 : 1350;
  const c = canvas.getContext('2d');
  if (!c) throw new Error('Canvas unavailable');
  const h = canvas.height,
    offset = story ? 220 : 0;
  c.fillStyle = '#f7edcf';
  c.fillRect(0, 0, 1080, h);
  c.strokeStyle = '#352431';
  c.lineWidth = 4;
  c.strokeRect(38, 38, 1004, h - 76);
  c.lineWidth = 1;
  c.strokeRect(50, 50, 980, h - 100);
  c.textAlign = 'center';
  c.fillStyle = '#352431';
  c.font = '18px Rubik, sans-serif';
  c.fillText('THE SUPREME COURT OF ANNOYANCE', 540, 110 + offset);
  c.font = '32px Bangers, Impact';
  c.fillText('HARSH RAGE ROOM', 540, 155 + offset);
  c.font = '28px Rubik, sans-serif';
  c.fillText('THIS IS TO CERTIFY THAT', 540, 225 + offset);
  c.font = '85px Bangers, Impact';
  wrap(
    c,
    data.kind === 'kindness'
      ? 'CERTIFICATE OF UNNECESSARY KINDNESS'
      : 'CERTIFICATE OF VIRTUAL REVENGE',
    540,
    322 + offset,
    890,
    94,
  );
  c.font = '46px Bangers, Impact';
  c.fillText(data.name.toUpperCase(), 540, 575 + offset);
  c.font = '22px Rubik, sans-serif';
  c.fillText(
    data.kind === 'kindness'
      ? 'chose kindness. We are still investigating.'
      : 'has successfully humbled one (1) Harsh.',
    540,
    621 + offset,
  );
  c.strokeStyle = '#d0bda1';
  c.beginPath();
  c.moveTo(120, 669 + offset);
  c.lineTo(960, 669 + offset);
  c.stroke();
  const stats =
    data.kind === 'kindness'
      ? [
          [String(data.compliments.length), 'KIND WORDS'],
          ['100%', 'GOOD HUMAN'],
          ['0', 'REGRETS'],
        ]
      : [
          [String(data.stats.attacks), 'ATTACKS'],
          [String(data.stats.score), 'ANGER SCORE'],
          [`${Math.round(data.stats.accuracy * 100)}%`, 'ACCURACY'],
        ];
  stats.forEach(([v, k], i) => {
    const x = 230 + i * 310;
    c.font = '58px Bangers, Impact';
    c.fillText(v, x, 748 + offset);
    c.font = '15px Rubik, sans-serif';
    c.fillText(k, x, 783 + offset);
  });
  c.font = '16px Rubik, sans-serif';
  c.fillText('THE SENTENCE', 540, 866 + offset);
  c.font = '37px Bangers, Impact';
  wrap(c, data.sentence, 540, 918 + offset, 820, 45);
  c.save();
  c.translate(760, 1090 + offset);
  c.rotate(-0.15);
  c.strokeStyle = '#c34d43';
  c.fillStyle = '#c34d43';
  c.lineWidth = 5;
  c.strokeRect(-175, -51, 350, 102);
  c.font = '30px Bangers, Impact';
  c.fillText('VERIFIED BY NOBODY', 0, 10);
  c.restore();
  c.fillStyle = '#352431';
  c.font = 'italic 28px Georgia';
  c.fillText('Chota Sher', 254, 1085 + offset);
  c.font = '13px Rubik, sans-serif';
  c.fillText('OFFICIAL WITNESS & TATTLETALE', 254, 1113 + offset);
  c.font = '14px Rubik, sans-serif';
  c.fillText(`${data.serial}  •  ${data.date} IST`, 540, h - 130);
  c.fillText('NO HARSHES WERE HARMED. HIS EGO? DIFFERENT STORY.', 540, h - 98);
  return await new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('PNG generation failed'))),
      'image/png',
    ),
  );
}
export async function shareCertificate(data: Certificate, story = false, download = false) {
  const blob = await renderCertificate(data, story),
    file = new File([blob], `${data.serial}${story ? '-story' : ''}.png`, { type: 'image/png' });
  if (!download && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'Harsh Rage Room',
        text: 'Justice has been served. Verified by nobody.',
      });
      return 'shared';
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') return 'cancelled';
    }
  }
  const url = URL.createObjectURL(blob),
    a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
  return 'downloaded';
}
