import { useState } from 'react';
import { ArrowUpRight, Pause, Play } from 'lucide-react';

/** A tactile artwork reel. The artwork is a still from the existing portfolio;
 *  the record itself moves until a real motion clip is supplied. */
export function MotionRecord({ previewSrc, onOpen, total }: { previewSrc: string; onOpen: () => void; total: number }) {
  const [spinning, setSpinning] = useState(true);
  return <div className={`motion-player ${spinning ? 'is-spinning' : 'is-paused'}`} data-folder="animation" data-testid="motion-disc">
    <button type="button" className="motion-record-open" data-testid="open-motion"
      aria-label={`Открыть Motion — ${total} проекта`} title="Посмотреть работы в движении"
      onClick={event => { event.stopPropagation(); onOpen(); }}>
      <span className="motion-record" aria-hidden="true">
        <span className="motion-record-spinning">
          <span className="motion-record-grooves" />
          <span className="motion-record-label"><span className="motion-record-art"><img src={previewSrc} alt="" draggable={false} /></span></span>
          <span className="motion-record-spindle" />
        </span>
      </span>
      <span className="motion-record-caption" aria-hidden="true">MOTION <ArrowUpRight size={13} /></span>
    </button>
    <span className="motion-record-index" aria-hidden="true">DG / 03 · VISUAL REEL</span>
    <button type="button" className="motion-spin-toggle" data-testid="motion-spin-toggle"
      title={spinning ? 'Остановить вращение' : 'Включить вращение'}
      aria-label={spinning ? 'Остановить вращение диска' : 'Включить вращение диска'}
      aria-pressed={spinning}
      onPointerDown={event => event.stopPropagation()}
      onClick={event => { event.stopPropagation(); setSpinning(value => !value); }}>
      {spinning ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
    </button>
  </div>;
}

export function MailEnvelope({ total, onOpen }: { total: number; onOpen: () => void }) {
  return <button type="button" className="mail-envelope" data-folder="email" data-testid="mail-envelope"
    aria-label={`Открыть Email и CRM — ${total} проектов`} title="Открыть Email + CRM"
    onClick={event => { event.stopPropagation(); onOpen(); }}>
    <span className="mail-envelope-shadow" aria-hidden="true" />
    <span className="mail-envelope-back" aria-hidden="true" />
    <span className="mail-envelope-letter" aria-hidden="true">
      <span className="mail-letter-number">DG / CORRESPONDENCE 02</span>
      <strong>EMAIL <span>+</span> CRM</strong>
      <span className="mail-letter-rule" />
      <span className="mail-letter-footer">{total} SELECTED CASES · 2021—26</span>
    </span>
    <span className="mail-envelope-flap" aria-hidden="true" />
    <span className="mail-envelope-pocket" aria-hidden="true" />
    <span className="mail-envelope-seal" aria-hidden="true">DG</span>
    <span className="mail-envelope-caption" aria-hidden="true">ОТКРЫТЬ ПИСЬМА <ArrowUpRight size={14} /></span>
  </button>;
}
