import { ArrowUpRight } from 'lucide-react';

/** One handmade CD label; the actual artwork spins inside the jewel case. */
export function MotionRecord({ previewSrc, onOpen, total }: { previewSrc: string; onOpen: () => void; total: number }) {
  return <div className="motion-player" data-folder="animation" data-testid="motion-disc">
    <button type="button" className="motion-record-open" data-testid="open-motion"
      aria-label={`Открыть Motion — ${total} проекта`} title="Смотреть анимацию"
      onClick={event => { event.stopPropagation(); onOpen(); }}>
      <span className="motion-cd-case" aria-hidden="true">
        <span className="motion-cd-inlay" /><img className="real-cd-image" data-testid="real-cd-image" src={`${import.meta.env.BASE_URL}real/cd-case.webp`} alt="" draggable={false} /><span className="real-cd-spin-glint" />
        <span className="motion-record"><span className="motion-record-spinning"><span className="motion-record-grooves" /><span className="motion-record-label"><span className="motion-record-art"><img src={previewSrc} alt="" draggable={false} /></span></span><span className="motion-record-spindle" /></span></span>
        <span className="motion-cd-hinge" /><span className="motion-cd-cover" />
      </span>
      <span className="motion-record-caption" aria-hidden="true">motion.</span>
    </button>
  </div>;
}

export function MailEnvelope({ total, onOpen }: { total: number; onOpen: () => void }) {
  return <button type="button" className="mail-envelope" data-folder="email" data-testid="mail-envelope"
    aria-label={`Открыть Email и CRM — ${total} проектов`} title="Рассылки и CRM"
    onClick={event => { event.stopPropagation(); onOpen(); }}>
    <img className="real-envelope-image real-envelope-closed" data-testid="real-envelope-closed" src={`${import.meta.env.BASE_URL}real/envelope-closed.webp`} alt="" draggable={false} />
    <img className="real-envelope-image real-envelope-open" data-testid="real-envelope-open" src={`${import.meta.env.BASE_URL}real/envelope-open.webp`} alt="" draggable={false} />
    <span className="real-envelope-letter-title" aria-hidden="true">email<br /><em>+ crm</em></span>
    <span className="mail-envelope-shadow" aria-hidden="true" />
    <span className="mail-envelope-back" aria-hidden="true" />
    <span className="mail-envelope-letter" aria-hidden="true">
      <strong>email<br /><span>+ crm</span></strong>
      <span className="mail-letter-rule" />
    </span>
    <span className="mail-envelope-flap" aria-hidden="true" />
    <span className="mail-envelope-pocket" aria-hidden="true" />
    <span className="mail-envelope-seal" aria-hidden="true" />
    <span className="mail-envelope-caption" aria-hidden="true">письма <ArrowUpRight size={14} /></span>
  </button>;
}
