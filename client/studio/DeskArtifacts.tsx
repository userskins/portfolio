import { ArrowUpRight } from 'lucide-react';

/** Compact CD jewel case with a rotating disc inside a transparent player. */
export function MotionRecord({ previewSrc, onOpen, total }: { previewSrc: string; onOpen: () => void; total: number }) {
  return <div className="motion-player" data-folder="animation" data-testid="motion-disc">
    <button type="button" className="motion-record-open" data-testid="open-motion"
      aria-label={`Открыть Motion — ${total} проекта`} title="Посмотреть Motion"
      onClick={event => { event.stopPropagation(); onOpen(); }}>
      <span className="motion-cd-case" aria-hidden="true">
        <span className="motion-cd-inlay"><span className="motion-cd-inlay-title">MOTION<span> / 03</span></span><span className="motion-cd-inlay-subtitle">VISUAL EXPERIMENTS<br />DG — SELECTED WORKS</span></span>
        <span className="motion-record"><span className="motion-record-spinning"><span className="motion-record-grooves" /><span className="motion-record-label"><span className="motion-record-art"><img src={previewSrc} alt="" draggable={false} /></span></span><span className="motion-record-spindle" /></span></span>
        <span className="motion-cd-hinge" /><span className="motion-cd-cover" />
        <span className="motion-cd-player-display">DISC 03 <span>●</span> LOOP</span>
      </span>
      <span className="motion-record-caption" aria-hidden="true">MOTION <ArrowUpRight size={13} /></span>
    </button>
    <span className="motion-record-index" aria-hidden="true">CD / 03 · VISUAL REEL</span>
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
