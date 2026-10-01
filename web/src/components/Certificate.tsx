import { useState } from 'react';
import { useGame } from '../core/store';
import { Icon } from './Icon';
import { Lion } from './Lion';
import { shareCertificate } from '../share/certificate';
import { finalReport, beginSession } from '../net/client';
export default function Certificate() {
  const data = useGame((s) => s.certificate),
    [story, setStory] = useState(false),
    [status, setStatus] = useState(''),
    [busy, setBusy] = useState(false);
  if (!data) return null;
  const share = async (download = false) => {
    setBusy(true);
    try {
      const result = await shareCertificate(data, story, download);
      setStatus(
        result === 'cancelled'
          ? 'Share cancelled. Your certificate is still here.'
          : result === 'shared'
            ? 'Shared. The group chat will never be the same.'
            : 'Certificate downloaded. Frame it irresponsibly.',
      );
      if (result !== 'cancelled') finalReport(true);
    } catch {
      setStatus('Couldn’t export the image. A screenshot is equally official.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="certificate-scene scene-content">
      <div className="certificate-intro">
        <div className="eyebrow">YOUR REVENGE ARC IS COMPLETE</div>
        <h1>
          {data.kind === 'kindness' ? 'KINDNESS' : 'JUSTICE'},<br />
          <span className="yellow-text">SERVED.</span>
        </h1>
        <p className="hero-subtitle">
          A completely unofficial document.
          <br />A very real sense of satisfaction.
        </p>
        <div className="format-toggle" role="group" aria-label="Certificate format">
          <button
            className={!story ? 'selected' : ''}
            aria-pressed={!story}
            onClick={() => setStory(false)}
          >
            POST · 4:5
          </button>
          <button
            className={story ? 'selected' : ''}
            aria-pressed={story}
            onClick={() => setStory(true)}
          >
            STORY · 9:16
          </button>
        </div>
        <button className="button yellow full-width" onClick={() => share()} disabled={busy}>
          <Icon name="share" /> {busy ? 'STAMPING THE PAPERWORK…' : 'SHARE YOUR CERTIFICATE'}{' '}
          <Icon name="arrow" />
        </button>
        <button className="button outline full-width" onClick={() => share(true)} disabled={busy}>
          <Icon name="download" /> DOWNLOAD PNG
        </button>
        <p className="share-status" role="status">
          {status || 'Made for the group chat. Approved by no one.'}
        </p>
        <div className="replay-actions">
          <button
            className="text-button"
            onClick={() => {
              finalReport(false, true);
              const s = useGame.getState();
              useGame.setState({ round: s.round + 1, landedAt: Date.now() });
              s.start(s.fight.anger);
              void beginSession();
            }}
          >
            <Icon name="repeat" /> ANOTHER ROUND
          </button>
          <button
            className="text-button"
            onClick={() => {
              finalReport(false, true);
              useGame.setState({ selectedCompliments: [], round: 1 });
              useGame.getState().setScene('intro');
            }}
          >
            START OVER <Icon name="arrow" size={15} />
          </button>
        </div>
      </div>
      <div className={`certificate-paper ${story ? 'story-preview' : ''}`}>
        <div className="paper-inner">
          <span className="cert-authority">THE SUPREME COURT OF ANNOYANCE</span>
          <Lion />
          <div className="cert-subtitle">CERTIFICATE OF</div>
          <h2>
            {data.kind === 'kindness' ? (
              <>
                UNNECESSARY
                <br />
                KINDNESS
              </>
            ) : (
              <>
                VIRTUAL
                <br />
                REVENGE
              </>
            )}
          </h2>
          <div className="cert-star-line">✦ ━━━━━━━━━ ✦ ━━━━━━━━━ ✦</div>
          <p>This is to certify that</p>
          <h3>{data.name}</h3>
          <p>
            {data.kind === 'kindness'
              ? 'chose kindness. We are still investigating.'
              : 'has successfully humbled one (1) Harsh.'}
          </p>
          <div className="cert-stats">
            {(data.kind === 'kindness'
              ? [
                  [data.compliments.length, 'KIND WORDS'],
                  ['100%', 'GOOD HUMAN'],
                  [0, 'REGRETS'],
                ]
              : [
                  [data.stats.attacks, 'ATTACKS'],
                  [data.stats.score, 'ANGER SCORE'],
                  [`${Math.round(data.stats.accuracy * 100)}%`, 'ACCURACY'],
                ]
            ).map(([v, l]) => (
              <div key={l}>
                <strong>{v}</strong>
                <span>{l}</span>
              </div>
            ))}
          </div>
          <div className="cert-sentence">
            <span>THE SENTENCE</span>
            <strong>{data.sentence}</strong>
          </div>
          <div className="cert-signatures">
            <div>
              <em>Chota Sher</em>
              <span>OFFICIAL WITNESS</span>
            </div>
            <div className="cert-stamp">
              VERIFIED
              <br />
              BY NOBODY
            </div>
          </div>
          <div className="cert-serial">
            {data.serial} <span>{data.date} · IST</span>
          </div>
          <span className="cert-disclaimer">NO HARSHES WERE HARMED. HIS EGO? DIFFERENT STORY.</span>
        </div>
      </div>
    </div>
  );
}
