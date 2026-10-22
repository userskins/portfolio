import { type ReactNode, type PointerEvent as ReactPointerEvent } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

/** Subtle cursor-follow movement: maximum 7px, always springs back.
 *  Desk items cannot be dragged, rotated, or rearranged. */
export function DeskItem({
  name, children, rotation = 0, order = 0, small, onOpen, extraClass = '',
}: {
  name: string;
  label?: string;
  children: ReactNode;
  rotation?: number;
  order?: number;
  small: boolean;
  onOpen?: () => void;
  extraClass?: string;
}) {
  const reduced = useReducedMotion();
  const xTarget = useMotionValue(0);
  const yTarget = useMotionValue(0);
  const x = useSpring(xTarget, { stiffness: 190, damping: 25, mass: 0.45 });
  const y = useSpring(yTarget, { stiffness: 190, damping: 25, mass: 0.45 });
  const interactive = !small && !reduced && name !== 'pencil';
  const travel = name === 'laptop' ? 1.5 : 7;

  const followPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!interactive || event.pointerType !== 'mouse') return;
    const box = event.currentTarget.getBoundingClientRect();
    const halfWidth = Math.max(1, box.width / 2);
    const halfHeight = Math.max(1, box.height / 2);
    const fx = (event.clientX - box.left - halfWidth) / halfWidth;
    const fy = (event.clientY - box.top - halfHeight) / halfHeight;
    xTarget.set(Math.max(-travel, Math.min(travel, fx * travel)));
    yTarget.set(Math.max(-travel, Math.min(travel, fy * travel)));
  };
  const settle = () => { xTarget.set(0); yTarget.set(0); };

  return (
    <motion.div
      className={`desk-object desk-item object-${name} ${extraClass}`}
      data-object={name}
      data-testid={`desk-item-${name}`}
      data-hover-travel={interactive ? travel : 0}
      style={{ x, y, rotate: small ? 0 : rotation }}
      initial={reduced ? false : { opacity: 0, scale: .96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduced ? 0 : .62, delay: order * .045, ease: [.22, 1, .36, 1] }}
      onPointerMove={followPointer}
      onPointerLeave={settle}
      onPointerCancel={settle}
      onBlur={settle}
      onClick={onOpen ? () => onOpen() : undefined}
    >{children}</motion.div>
  );
}
