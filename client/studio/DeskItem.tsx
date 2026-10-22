import { type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/** Fixed, clickable desk objects. No dragging or spinning of desk items. */
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
  return (
    <motion.div
      className={`desk-object desk-item object-${name} ${extraClass}`}
      data-object={name}
      data-testid={`desk-item-${name}`}
      style={{ rotate: small ? 0 : rotation }}
      initial={reduced ? false : { opacity: 0, scale: .96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduced ? 0 : .62, delay: order * .045, ease: [.22, 1, .36, 1] }}
      onClick={onOpen ? () => onOpen() : undefined}
    >{children}</motion.div>
  );
}
