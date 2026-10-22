import { useEffect, useRef, useState, type ReactNode, type RefObject, type PointerEvent as ReactPointerEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { animate, motion, useDragControls, useMotionValue, useReducedMotion } from 'framer-motion';
import { Move, RotateCw } from 'lucide-react';

type SpinSession = {
  pointerId: number;
  centerX: number;
  centerY: number;
  lastAngle: number;
  at: number;
  velocity: number;
};

const angleTo = (x: number, y: number, cx: number, cy: number) => Math.atan2(y - cy, x - cx) * 180 / Math.PI;
const angleDelta = (next: number, previous: number) => ((next - previous + 540) % 360) - 180;

export function DeskItem({
  name, label, children, rotation = 0, order = 0, small, areaRef, onOpen, onRaise, extraClass = '',
}: {
  name: string;
  label: string;
  children: ReactNode;
  rotation?: number;
  order?: number;
  small: boolean;
  areaRef: RefObject<HTMLDivElement | null>;
  onOpen?: () => void;
  onRaise: () => number;
  extraClass?: string;
}) {
  const reduced = useReducedMotion();
  const controls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(small && !['loose-one', 'loose-two', 'pencil'].includes(name) ? 0 : rotation);
  const rootRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<SpinSession | null>(null);
  const spinAnimation = useRef<ReturnType<typeof animate> | null>(null);
  const lastGesture = useRef(0);
  const [z, setZ] = useState<number>();
  const [dragging, setDragging] = useState(false);
  const [rotating, setRotating] = useState(false);
  const raise = () => setZ(onRaise());

  useEffect(() => () => spinAnimation.current?.stop(), []);

  const rotateStart = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    event.preventDefault();
    event.stopPropagation();
    spinAnimation.current?.stop();
    const box = rootRef.current?.getBoundingClientRect();
    if (!box) return;
    const cx = box.left + box.width / 2;
    const cy = box.top + box.height / 2;
    spinRef.current = {
      pointerId: event.pointerId, centerX: cx, centerY: cy,
      lastAngle: angleTo(event.clientX, event.clientY, cx, cy), at: performance.now(), velocity: 0,
    };
    lastGesture.current = Date.now();
    raise();
    setRotating(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const rotateMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const session = spinRef.current;
    if (!session || session.pointerId !== event.pointerId) return;
    event.preventDefault();
    event.stopPropagation();
    const angle = angleTo(event.clientX, event.clientY, session.centerX, session.centerY);
    const step = angleDelta(angle, session.lastAngle);
    const now = performance.now();
    const deltaTime = Math.max(now - session.at, 8);
    if (Math.abs(step) > 0.01) rotate.set(rotate.get() + step);
    session.velocity = step / deltaTime;
    session.lastAngle = angle;
    session.at = now;
  };
  const rotateFinish = (event: ReactPointerEvent<HTMLButtonElement>, cancelled = false) => {
    const session = spinRef.current;
    if (!session || session.pointerId !== event.pointerId) return;
    event.stopPropagation();
    spinRef.current = null;
    lastGesture.current = Date.now();
    setRotating(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    // A flick gives paper and pencil a short, satisfying final twist.
    if (!cancelled && !reduced && Math.abs(session.velocity) > 0.16) {
      const follow = Math.max(-135, Math.min(135, session.velocity * 130));
      spinAnimation.current = animate(rotate, rotate.get() + follow, {
        type: 'spring', stiffness: 105, damping: 23,
      });
    }
  };
  const rotateKey = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    const step = event.shiftKey ? 45 : 15;
    const delta = event.key === 'ArrowRight' ? step
      : event.key === 'ArrowLeft' ? -step
      : event.key === 'Enter' || event.key === ' ' ? 90 : 0;
    if (!delta) return;
    event.preventDefault();
    event.stopPropagation();
    spinAnimation.current?.stop();
    raise();
    lastGesture.current = Date.now();
    spinAnimation.current = reduced
      ? null
      : animate(rotate, rotate.get() + delta, { type: 'spring', stiffness: 200, damping: 22 });
    if (reduced) rotate.set(rotate.get() + delta);
  };

  return (
    <motion.div
      ref={rootRef}
      className={`desk-object desk-item object-${name} ${extraClass}`}
      data-object={name}
      data-testid={`desk-item-${name}`}
      data-dragging={dragging}
      data-rotating={rotating}
      style={{ x, y, rotate, zIndex: z }}
      initial={reduced ? false : { opacity: 0, scale: .96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduced ? 0 : .62, delay: order * .045, ease: [.22, 1, .36, 1] }}
      whileHover={small || reduced || rotating || name === 'laptop' ? undefined : { scale: 1.025 }}
      drag
      dragListener={!small}
      dragControls={controls}
      dragConstraints={areaRef}
      dragMomentum={false}
      dragElastic={0.045}
      onPointerDown={() => raise()}
      onDragStart={() => { raise(); setDragging(true); lastGesture.current = Date.now(); }}
      onDragEnd={() => { setDragging(false); lastGesture.current = Date.now(); }}
      onClick={event => {
        if (event.target instanceof Element && event.target.closest('.desk-rotate-handle, .desk-move-handle')) return;
        if (onOpen && Date.now() - lastGesture.current > 260) onOpen();
      }}
    >
      {children}
      <button
        type="button"
        className="desk-rotate-handle"
        aria-label={`Вращать: ${label}. Потяните за ручку или нажимайте стрелки влево и вправо`}
        title={`Вращать ${label}: тяни по кругу, стрелки ← →, двойной клик — оборот`}
        data-testid={`rotate-${name}`}
        onPointerDown={rotateStart}
        onPointerMove={rotateMove}
        onPointerUp={event => rotateFinish(event)}
        onPointerCancel={event => rotateFinish(event, true)}
        onClick={event => event.stopPropagation()}
        onDoubleClick={event => {
          event.preventDefault();
          event.stopPropagation();
          spinAnimation.current?.stop();
          raise();
          lastGesture.current = Date.now();
          spinAnimation.current = animate(rotate, rotate.get() + 360, {
            duration: reduced ? .01 : 1.05, ease: [.12, .78, .17, 1],
          });
        }}
        onKeyDown={rotateKey}
      >
        <RotateCw size={17} strokeWidth={2.25} aria-hidden="true" />
      </button>
      {small && (
        <button
          type="button"
          className="desk-move-handle"
          aria-label={`Перемещать: ${label}. Потяните за ручку`}
          title={`Передвинуть ${label}`}
          data-testid={`move-${name}`}
          onPointerDown={event => {
            event.preventDefault();
            event.stopPropagation();
            raise();
            lastGesture.current = Date.now();
            controls.start(event, { snapToCursor: false });
          }}
          onClick={event => event.stopPropagation()}
        >
          <Move size={15} strokeWidth={2.2} aria-hidden="true" />
        </button>
      )}
    </motion.div>
  );
}
