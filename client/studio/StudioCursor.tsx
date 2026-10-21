import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type CursorKind = 'MOVE' | 'ОТКРЫТЬ' | 'ЛИСТАТЬ' | 'СМОТРЕТЬ' | 'ДВИГАТЬ';

export function StudioCursor({ disabled }: { disabled: boolean }) {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const slowX = useSpring(x, { stiffness: 380, damping: 31, mass: .65 });
  const slowY = useSpring(y, { stiffness: 380, damping: 31, mass: .65 });
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState<CursorKind>('MOVE');
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (disabled || !finePointer) {
      setVisible(false);
      return;
    }

    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target instanceof Element ? event.target : null;
      const inScene = Boolean(target?.closest('.scene-holder'));
      setVisible((current) => current === inScene ? current : inScene);
      if (!inScene) return;
      let next: CursorKind = 'MOVE';
      if (target?.closest('.atelier-laptop-pager')) next = 'ЛИСТАТЬ';
      else if (target?.closest('.print-stack')) next = 'СМОТРЕТЬ';
      else if (target?.closest('[data-object]')) next = pressed ? 'ДВИГАТЬ' : 'ОТКРЫТЬ';
      setLabel((current) => current === next ? current : next);
    };
    const down = (event: PointerEvent) => {
      if (!(event.target instanceof Element && event.target.closest('.scene-holder'))) return;
      setPressed(true);
      setLabel('ДВИГАТЬ');
    };
    const up = () => { setPressed(false); };
    const leave = () => setVisible(false);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
    window.addEventListener('blur', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('blur', leave);
    };
  }, [disabled, x, y, pressed]);

  if (disabled) return null;
  return (
    <motion.div
      className="atelier-cursor"
      data-visible={visible}
      data-label={label}
      aria-hidden="true"
      style={{ x: slowX, y: slowY }}
    >
      <div className={'atelier-cursor-ring' + (pressed ? ' is-pressed' : '')}>
        <span>{label}</span>
      </div>
      <div className="atelier-cursor-dot" />
    </motion.div>
  );
}
