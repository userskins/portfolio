import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowUpRight, ArrowLeft, ArrowRight, X, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { projects, galleryImages, experiences, skills, education, aboutText, type Project } from '@/lib/data';
import nameSticker from '@assets/hero-logo.webp';
import signature from '@assets/logo.webp';
import './studio.css';
import './atelier.css';
import './ultralight.css';
import './tech.css';
import './showcase.css';
import './static-desk.css';
import { DeskItem } from './DeskItem';
import { MotionRecord, MailEnvelope } from './DeskArtifacts';
import './desk-artifacts.css';
import './artifacts-polish.css';
import { StudioCursor } from './StudioCursor';

type Category = Project['tag'];
type View = Category | 'all' | 'gallery' | 'about' | 'contact' | null;
const BASE = import.meta.env.BASE_URL;
const T = {
  desk: 'Рабочий стол', work: 'Проекты', gallery: 'Галерея', about: 'Обо мне', contact: 'Контакты',
  back: 'На стол', original: 'Открыть проект', prev: 'Предыдущий', next: 'Следующий', 
  intro: 'Дизайн. Сайты. CRM.', hint: 'Нажми на предмет, чтобы открыть раздел.',
  tapHint: 'Нажми на предмет, чтобы открыть раздел.', preview: 'Предпросмотр сайта',
  noPreview: 'Превью недоступно. Оригинал — по ссылке.', idea: 'Есть идея?', letsTalk: 'Давай обсудим.',
  realWork: 'Проекты и работы из моего архива.',
};
const folders: { id: Category; name: string; label: string; }[] = [
  { id: 'design', name: 'DESIGN', label: 'Дизайн' },
  { id: 'websites', name: 'WEBSITES', label: 'Сайты' },
  { id: 'email', name: 'EMAIL / CRM', label: 'Email / CRM' },
  { id: 'animation', name: 'MOTION', label: 'Анимация' },
];
const count = (tag: Category) => projects.filter(p => p.tag === tag).length;
const websites = projects.filter(p => p.tag === 'websites');
const WEBSITE_INTERVAL_MS = 4500;
const hoverDescriptions: Record<string, string> = { design: 'ДИЗАЙН / МАКЕТЫ И АЙДЕНТИКА', gallery: 'ГАЛЕРЕЯ / АВТОРСКИЕ РАБОТЫ', laptop: 'САЙТЫ / 7 ПРОЕКТОВ · АВТОПОКАЗ', email: 'РАССЫЛКИ / CRM-КОММУНИКАЦИИ', motion: 'АНИМАЦИЯ / ДВИЖЕНИЕ', about: 'ОБО МНЕ / ОПЫТ И НАВЫКИ', contact: 'КОНТАКТЫ / ОБСУДИМ ПРОЕКТ', pencil: 'КАРАНДАШ / ЭСКИЗ' };
const art = (id: number) => `${BASE}art/${id}.webp`;
// Only project-cover pairings identifiable in the original artwork.
const coverById: Record<string, number> = { '07b': 2, '07': 1, '06': 3, '05': 32 };
const uniqueGallery = galleryImages.filter((g, i, a) => a.findIndex(v => v.src === g.src) === i);
const cropClasses: Record<Category, string> = { design: 'design-cover', websites: 'web-cover', email: 'mail-cover', animation: 'motion-cover' };
function useSmallScreen() {
  const [small, setSmall] = useState(() => window.matchMedia('(max-width: 900px)').matches);
  useEffect(() => { const mq = window.matchMedia('(max-width: 900px)'); const update = () => setSmall(mq.matches); mq.addEventListener('change', update); return () => mq.removeEventListener('change', update); }, []);
  return small;
}
function Binder({ category, number, onOpen }: { category: Category; number: string; onOpen: () => void }) {
  const item = folders.find(f => f.id === category)!;
  const artwork = category === 'design' ? 32 : category === 'email' ? 33 : 27;
  return <button className={`binder ${cropClasses[category]}`} type="button" aria-label={`${item.label}: ${count(category)} projects`} data-folder={category} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onOpen(); } }}>
    <span className="binder-leaf leaf-back">{category === 'design' ? <span className="design-sheet design-sheet-back" aria-hidden="true" /> : <img src={art(34)} alt="" draggable={false} />}</span>
    <span className="binder-leaf leaf-middle">{category === 'design' ? <span className="design-sheet design-sheet-front" aria-hidden="true" /> : <img src={art(artwork)} alt="" draggable={false} />}</span>
    <span className="binder-front">
      {category === 'design' ? <span className="design-cover-graphic" aria-hidden="true"><span className="design-glyph-orbit" /><span className="design-glyph-slice" /><span className="design-glyph-cross" /></span> : <><span className="cover-art"><img src={art(artwork)} alt="" draggable={false} /></span><span className="cover-overprint" /></>}
      <span className="binder-meta">{category === 'design' ? <span>ЭСКИЗЫ И МАКЕТЫ</span> : <><span>DG / {number}</span><span>{count(category)} РАБОТ</span></>}</span>
      <span className="binder-title">{category === 'email' ? <>EMAIL<br />&amp; CRM</> : item.name}<span className="hand-star">*</span></span>
      <span className="binder-foot"><span>{item.label}</span><ArrowUpRight size={25} strokeWidth={1.4} /></span><span className="binder-spine" />
    </span><span className="tape binder-tape" aria-hidden="true" /><span className="hover-tag">ОТКРЫТЬ {item.label} <ArrowUpRight size={12} /></span>
  </button>;
}
function ProjectPreview({ project, className = '' }: { project: Project; className?: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const src = coverById[project.id] ? art(coverById[project.id]) : ['websites', 'email'].includes(project.tag) ? `${BASE}previews/${project.id}.jpg` : null;
  return <div className={`project-visual ${className} ${project.tag}`}>
    {src && failedSrc !== src ? <img key={src} src={src} alt={`${project.title} - preview`} onError={() => setFailedSrc(src)} draggable={false} /> : <div className="unavailable-preview">
      <img src={signature} alt="" /><span>{project.title}</span><small>{project.tag === 'websites' || project.tag === 'email' ? T.noPreview : project.category}</small>
    </div>}
  </div>;
}
function Laptop({ project, onOpen, onNext, onPrevious, onSelect, onInteraction, index, total, playing, enabled, onToggleAuto, onHoverChange, onFocusChange }: {
  project: Project; onOpen: () => void; onNext: () => void; onPrevious: () => void;
  onSelect: (index: number) => void; onInteraction: () => void;
  index: number; total: number; playing: boolean; enabled: boolean; onToggleAuto: () => void;
  onHoverChange: (hovered: boolean) => void; onFocusChange: (focused: boolean) => void;
}) {
  const reduceMotion = useReducedMotion();
  const [direction, setDirection] = useState(1);
  const swipeStart = useRef<number | null>(null);
  const swipeBlockUntil = useRef(0);

  const move = (delta: number) => {
    onInteraction();
    setDirection(delta);
    if (delta > 0) onNext();
    else onPrevious();
  };
  return (
    <div
      className="modern-laptop"
      data-testid="modern-laptop"
      data-auto-playing={playing}
      aria-label={"Интерактивный ноутбук с проектом " + project.title}
      onPointerEnter={event => { if (event.pointerType === 'mouse') onHoverChange(true); }}
      onPointerLeave={event => { if (event.pointerType === 'mouse') onHoverChange(false); }}
      onFocusCapture={() => onFocusChange(true)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) onFocusChange(false); }}
    >
      <div className="modern-laptop-lid">
        <span className="modern-laptop-camera" aria-hidden="true" />
        <div className="modern-laptop-screen">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={project.id}
              className="modern-screen-content"
              initial={reduceMotion ? false : { opacity: 0, x: direction * 42, scale: 1.035 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: direction * -34, scale: 0.985 }}
              transition={{ duration: reduceMotion ? 0 : 0.3, ease: [.22, 1, .36, 1] }}
            >
              <ProjectPreview project={project} />
            </motion.div>
          </AnimatePresence>
          <div className="modern-screen-shine" aria-hidden="true" />
          <div className="modern-auto-meter" aria-hidden="true"><span key={project.id + (playing ? '-play' : '-hold')} className={playing ? 'meter-running' : ''} /></div>
          <div className="modern-screen-index" aria-label="Быстрый выбор проекта">
            {websites.map((item, slide) => (
              <button key={item.id} type="button"
                className={'modern-screen-tick' + (slide === index ? ' is-current' : '') + (slide < 4 ? ' is-featured' : '')}
                aria-label={String(slide + 1).padStart(2, '0') + ': ' + item.title}
                aria-current={slide === index ? 'true' : undefined}
                title={item.title}
                onPointerDown={event => event.stopPropagation()}
                onClick={event => { event.stopPropagation(); onInteraction(); setDirection(slide > index ? 1 : -1); onSelect(slide); }}
                data-testid={'laptop-site-' + item.id}
              ><span /></button>
            ))}
          </div>
          <button
            type="button"
            className="modern-screen-open"
            data-testid="open-websites"
            onClick={(event) => { event.stopPropagation(); if (Date.now() > swipeBlockUntil.current) { onInteraction(); onOpen(); } }}
            onTouchStart={(event) => { swipeStart.current = event.touches[0]?.clientX ?? null; }}
            onTouchEnd={(event) => {
              const initialX = swipeStart.current;
              swipeStart.current = null;
              if (initialX === null) return;
              const distance = event.changedTouches[0].clientX - initialX;
              if (Math.abs(distance) < 42) return;
              if (event.cancelable) event.preventDefault();
              event.stopPropagation();
              swipeBlockUntil.current = Date.now() + 650;
              move(distance < 0 ? 1 : -1);
            }}
            aria-label={"Открыть проект " + project.title + ". На телефоне листайте свайпом."}
          >
            <span className="modern-screen-open-label">
              <span className="modern-open-prefix">№ {String(index + 1).padStart(2, "0")} / {project.year}</span>
              <strong>{project.title}</strong>
              <small>ОТКРЫТЬ <ArrowUpRight size={12} strokeWidth={2} /></small>
            </span>
          </button>
        </div>
        <span className="modern-laptop-bezel-wordmark" aria-hidden="true">DG / ПРОЕКТЫ И ИСТОРИИ</span>
      </div>
      <div className="modern-laptop-hinge" aria-hidden="true" />
      <div className="modern-laptop-deck" aria-hidden="true">
        <div className="modern-laptop-speaker modern-laptop-speaker-left" />
        <div className="modern-laptop-speaker modern-laptop-speaker-right" />
        <div className="modern-keyboard">
          {Array.from({ length: 49 }, (_, key) => <span key={key} className="modern-key" />)}
        </div>
        <div className="modern-trackpad" />
      </div>
      <div className="modern-laptop-edge" aria-hidden="true">
        <span />
      </div>
      <div className="atelier-laptop-pager modern-laptop-pager" aria-label="Переключение проектов на экране ноутбука" onPointerDown={(event) => event.stopPropagation()}>
        <button
          type="button"
          data-testid="laptop-prev"
          aria-label="Предыдущий сайт на экране"
          onClick={(event) => { event.stopPropagation(); move(-1); }}
        ><ChevronLeft size={17} strokeWidth={1.8} /></button>
        <span className="modern-page-count" aria-live="polite">
          <b>САЙТЫ</b> {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <button type="button" className="modern-auto-toggle" data-testid="laptop-auto-toggle"
          onClick={event => { event.stopPropagation(); onToggleAuto(); }}
          aria-pressed={!enabled}
          aria-label={enabled ? 'Остановить автоматическую смену сайтов' : 'Включить автоматическую смену сайтов'}
          title={enabled ? 'Остановить автопоказ' : 'Включить автопоказ'}
        >{enabled ? <Pause size={13} fill="currentColor" strokeWidth={2} /> : <Play size={13} fill="currentColor" strokeWidth={2} />}</button>
        <button
          type="button"
          data-testid="laptop-next"
          aria-label="Следующий сайт на экране"
          onClick={(event) => { event.stopPropagation(); move(1); }}
        ><ChevronRight size={17} strokeWidth={1.8} /></button>
      </div>
      <span className="modern-laptop-note" aria-hidden="true">нажми и смотри ↗</span>
    </div>
  );
}
function Studio() {
  const [view, setView] = useState<View>(null);
  const [selected, setSelected] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryFull, setGalleryFull] = useState(false);
  const [webIndex, setWebIndex] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [laptopHover, setLaptopHover] = useState(false);
  const [laptopFocus, setLaptopFocus] = useState(false);
  const [manualHold, setManualHold] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const manualHoldTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);
  const small = useSmallScreen();
  const reduced = useReducedMotion();
  const holder = useRef<HTMLDivElement>(null);
  const [sceneScale, setSceneScale] = useState(1);
  const open = (next: View) => { setSelected(0); setGalleryFull(false); setView(next); };
  const list = view === 'all' ? projects : projects.filter(p => p.tag === view);
  const active = list[Math.min(selected, Math.max(0, list.length - 1))];
  const title = view === 'all' ? 'ВСЕ ПРОЕКТЫ' : view === 'gallery' ? 'ГАЛЕРЕЯ РАБОТ' : view === 'about' ? 'ОБО МНЕ' : view === 'contact' ? 'НА СВЯЗИ' : folders.find(f => f.id === view)?.label.toUpperCase() ?? '';
  const firstWebsite = websites[webIndex] ?? websites[0];
  const pauseForInteraction = () => {
    setManualHold(true);
    if (manualHoldTimer.current) clearTimeout(manualHoldTimer.current);
    manualHoldTimer.current = setTimeout(() => { setManualHold(false); manualHoldTimer.current = null; }, 8000);
  };
  const changeWebsite = (direction: number) => setWebIndex(index => (index + direction + websites.length) % websites.length);
  const slideshowPlaying = autoplayEnabled && !laptopHover && !laptopFocus && !manualHold && !view && pageVisible && !reduced;
  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => { document.removeEventListener('visibilitychange', updateVisibility); if (manualHoldTimer.current) clearTimeout(manualHoldTimer.current); };
  }, []);
  useEffect(() => {
    if (!slideshowPlaying || websites.length < 2) return;
    const timer = setTimeout(() => setWebIndex(index => (index + 1) % websites.length), WEBSITE_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [slideshowPlaying, webIndex]);
  const openLaptop = () => { open('websites'); setSelected(webIndex); };
  const navigate = (delta: number) => {
    if (view === 'gallery') setGalleryIndex(i => (i + delta + uniqueGallery.length) % uniqueGallery.length);
    else if (list.length) setSelected(i => (i + delta + list.length) % list.length);
  };
  useEffect(() => {
    if (!holder.current || small) return;
    const element = holder.current;
    const resize = () => setSceneScale(Math.min(element.clientWidth / 1100, element.clientHeight / 820, 1.35));
    const observer = new ResizeObserver(resize); observer.observe(element); resize();
    return () => observer.disconnect();
  }, [small]);
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (['websites', 'design', 'email', 'animation', 'all', 'gallery', 'about', 'contact'].includes(hash)) open(hash as View);
  }, []);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (view || event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
      const element = event.target;
      if (element instanceof HTMLElement && (element.isContentEditable || ['INPUT','TEXTAREA','SELECT'].includes(element.tagName))) return;
      const shortcut: Record<string, View> = {'1':'design','2':'websites','3':'email','4':'animation','5':'gallery','6':'about','7':'contact'};
      if (Object.prototype.hasOwnProperty.call(shortcut, event.key)) {
        event.preventDefault();
        open(shortcut[event.key]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [view]);
  return <div className="studio-shell atelier-shell" data-theme="tech">
    <StudioCursor disabled={small || Boolean(reduced) || view !== null} />
    <svg className="noise-filter" aria-hidden="true"><filter id="paper-grain"><feTurbulence type="fractalNoise" baseFrequency=".76" numOctaves="3" stitchTiles="stitch" /></filter></svg>
    <div className="paper-grain" aria-hidden="true" />
    <a href="#studio-navigation" className="skip-link">{T.work}</a>
    <aside className="identity-rail">
      <div className="eyebrow">ДИЗАЙНЕР / СОЗДАЮ И ИССЛЕДУЮ</div>
      <button className="name-sticker" onClick={() => open(null)} aria-label={T.desk}><img src={nameSticker} alt="Dmitriy Gusev" draggable={false} /></button>
      <p className="intro-line">{T.intro}<br /><span>В дизайне с 2020-го. Ищу новое.</span></p><span className="red-underline" />
      <nav id="studio-navigation" className="rail-nav" aria-label="Portfolio navigation">
        {([{ title: T.desk, value: null }, { title: T.work, value: 'all' }, { title: T.gallery, value: 'gallery' }, { title: T.about, value: 'about' }, { title: T.contact, value: 'contact' }] as { title: string; value: View }[]).map((item, i) => <button key={i} onClick={() => open(item.value)} aria-current={view === item.value ? 'page' : undefined}><span>{String(i + 1).padStart(2, '0')}</span>{item.title}<ArrowUpRight size={14} /></button>)}
      </nav>
      <div className="rail-bottom"><p className="rail-note"><span className="rail-note-first">Идеи не сидят</span><span className="rail-note-second">на месте.</span><span className="rail-note-star" aria-hidden="true">*</span></p><div className="social-links"><a href="https://t.me/userskins" target="_blank" rel="noopener noreferrer">TG <ArrowUpRight size={11} /></a><a href="https://vk.com/userskins" target="_blank" rel="noopener noreferrer">VK <ArrowUpRight size={11} /></a><a href="mailto:userskins@gmail.com">MAIL <ArrowUpRight size={11} /></a></div></div>
    </aside>
    <main className="desk-area" aria-label={T.desk}>
      <div className="desk-topline"><span>ПОРТФОЛИО / ЖИВОЙ РАБОЧИЙ СТОЛ</span><span className="atelier-hover-status" aria-live="polite">{hoveredObject ? hoverDescriptions[hoveredObject] : 'ПОДВЕДИ КУРСОР ПОБЛИЖЕ'}</span><span className="tiny-cross">+</span><span>У ПРЕДМЕТОВ ЕСТЬ ИСТОРИИ</span></div>
      <div ref={holder} className="scene-holder" onPointerOver={event => { const object = event.target instanceof Element ? event.target.closest('[data-object]') : null; const name = object?.getAttribute('data-object') ?? null; setHoveredObject(current => current === name ? current : name); }} onPointerLeave={() => setHoveredObject(null)}>
        <div className="scene-scale" style={{ '--scene-scale': sceneScale } as CSSProperties}>
          <motion.div className={`scene-camera ${view ? 'camera-focused' : ''}`}>
            <div className="desk-scene">
              <span className="desk-handnote note-top" aria-hidden="true">чуть-чуть хаоса.<br />много дизайна.</span>
              <svg className="desk-doodle doodle-arrow" viewBox="0 0 160 70" aria-hidden="true"><path d="M3 8 C 39 47 80 54 145 45 M128 25 L148 45 L126 57" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
              <DeskItem name="design" label="Папка «Дизайн»" rotation={-10} order={1} small={small} onOpen={() => open('design')}><Binder category="design" number="01" onOpen={() => open('design')} /></DeskItem>
              <DeskItem name="gallery" label="Галерея работ" rotation={7} order={2} small={small} onOpen={() => open('gallery')}><button type="button" className="print-stack" data-testid="open-gallery" aria-label={T.gallery}><span className="print-under" /><span className="print-image"><img src={art(67)} alt="" draggable={false} /></span><span className="print-caption">ГАЛЕРЕЯ РАБОТ <span>01 / {uniqueGallery.length}</span></span><span className="paperclip" aria-hidden="true" /><span className="hover-tag">СМОТРЕТЬ ГАЛЕРЕЮ <ArrowUpRight size={12} /></span></button></DeskItem>
              <DeskItem name="laptop" label="Ноутбук с сайтами" rotation={12} order={3} small={small}><Laptop
                  project={firstWebsite}
                  onOpen={openLaptop}
                  onNext={() => changeWebsite(1)}
                  onPrevious={() => changeWebsite(-1)}
                  onSelect={setWebIndex}
                  onInteraction={pauseForInteraction}
                  index={webIndex} total={websites.length}
                  playing={Boolean(slideshowPlaying)} enabled={autoplayEnabled}
                  onToggleAuto={() => setAutoplayEnabled(v => !v)}
                  onHoverChange={setLaptopHover}
                  onFocusChange={setLaptopFocus}
                /></DeskItem>
              <DeskItem name="email" label="Конверт Email + CRM" rotation={-2} order={4} small={small} onOpen={() => open('email')}><MailEnvelope total={count('email')} onOpen={() => open('email')} /></DeskItem>
              <DeskItem name="motion" label="Диск Motion" rotation={-7} order={5} small={small} onOpen={() => open('animation')}><MotionRecord previewSrc={art(27)} total={count('animation')} onOpen={() => open('animation')} /></DeskItem>
              <DeskItem name="about" label="Блокнот" rotation={-6} order={6} small={small} onOpen={() => open('about')}><button className="about-notebook" aria-label={T.about} data-testid="open-about"><span className="notebook-holes" /><span className="notebook-head">ЗАМЕТКИ / 2020–2026</span><span className="notebook-title">{T.about}</span><span className="notebook-copy">VK / ВШЭ / ИТММ<br />ДИЗАЙН + ЛЮДИ + ИДЕИ</span><span className="notebook-sign">Dmitriy <ArrowUpRight size={24} /></span></button></DeskItem>
              <DeskItem name="contact" label="Карточка контактов" rotation={-12} order={7} small={small} onOpen={() => open('contact')}><button className="contact-card" aria-label={T.contact} data-testid="open-contact"><span>LET'S MAKE</span><strong>SOMETHING<br />MATTER.</strong><span>WRITE ME <ArrowUpRight size={20} /></span></button></DeskItem>
              <DeskItem name="pencil" label="Карандаш" extraClass="pencil" rotation={30} order={5} small={small}><span /></DeskItem><span className="desk-handnote note-bottom" aria-hidden="true">делаю<br /><u>со смыслом</u>.</span><span className="desk-star" aria-hidden="true">*</span>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="desk-bottomline"><span><span className="small-red-dot" />{small ? T.tapHint : T.hint}</span></div>
    </main>
    <Dialog.Root open={view !== null} onOpenChange={value => { if (!value) setView(null); }}>
      <AnimatePresence>
        {view !== null && <Dialog.Portal forceMount>
          <Dialog.Overlay forceMount asChild><motion.div className="reader-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .4 }} /></Dialog.Overlay>
          <Dialog.Content forceMount asChild aria-describedby="reader-description" onKeyDown={e => { if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return; if (e.key === 'ArrowRight') { e.preventDefault(); navigate(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); navigate(-1); } }}>
            <motion.section className={`reader reader-${view}`} initial={reduced ? false : { opacity: 0, y: 110, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: 85, rotate: 1 }} transition={{ duration: reduced ? 0 : .48, ease: [.22, 1, .36, 1] }}>
              <div className="reader-top"><Dialog.Close className="back-to-desk"><ArrowLeft size={17} />{T.back}</Dialog.Close><span>НАСТОЯЩИЕ РАБОТЫ / НИКАКИХ ШАБЛОНОВ</span><Dialog.Close className="close-reader" aria-label={T.back}><X size={25} /></Dialog.Close></div>
              <div className="reader-heading"><Dialog.Title>{title}<span className="hand-star">*</span></Dialog.Title><Dialog.Description id="reader-description">{T.realWork}</Dialog.Description></div>
              {active && <div className="case-layout">
                <div className="case-preview-column"><AnimatePresence mode="wait"><motion.div key={active.id} initial={reduced ? false : { opacity: 0, x: 28, rotate: 1 }} animate={{ opacity: 1, x: 0, rotate: 0 }} exit={{ opacity: 0, x: -25 }} transition={{ duration: .28 }} className="case-proof">
                  <div className="proof-meta"><span>РАБОТА {String(selected + 1).padStart(2, '0')}</span><span>{active.year} / {active.tag.toUpperCase()}</span></div><ProjectPreview project={active} />
                  <div className="proof-bottom"><span>{active.title}</span><span>DG / {active.id}</span></div>
                </motion.div></AnimatePresence>
                  <div className="case-controls"><button onClick={() => navigate(-1)} aria-label={T.prev}><ArrowLeft size={22} /></button><span aria-live="polite">{String(selected + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}</span><button onClick={() => navigate(1)} aria-label={T.next}><ArrowRight size={22} /></button><a href={active.url} target="_blank" rel="noopener noreferrer" className="original-link">{T.original}<ArrowUpRight size={18} /></a></div>
                </div>
                <div className="case-index"><div className="index-label">СОДЕРЖАНИЕ / {list.length} ПРОЕКТОВ</div>{view === 'all' && <div className="category-shortcuts">{folders.map(f => <button key={f.id} onClick={() => open(f.id)}>{f.name}</button>)}</div>}<div className="case-files">{list.map((p, i) => <button key={p.id} data-case={p.id} aria-pressed={i === selected} onClick={() => setSelected(i)}><span>{String(i + 1).padStart(2, '0')}</span><span><strong>{p.title}</strong><small>{p.category} / {p.year}</small></span><ArrowUpRight size={16} /></button>)}</div><p className="index-handnote">ideas into<br />real things.</p></div>
              </div>}
              {view === 'gallery' && <div className="gallery-reader">{galleryFull ? <><button className="gallery-grid-back" onClick={() => setGalleryFull(false)}><ArrowLeft size={15} />ALL IMAGES</button><div className="gallery-lightbox"><button aria-label={T.prev} onClick={() => navigate(-1)}><ArrowLeft size={28} /></button><img src={uniqueGallery[galleryIndex].src} alt={`Artwork ${uniqueGallery[galleryIndex].id}`} /><button aria-label={T.next} onClick={() => navigate(1)}><ArrowRight size={28} /></button></div><div className="gallery-counter">{galleryIndex + 1} / {uniqueGallery.length}</div></> : <div className="gallery-wall">{uniqueGallery.map((g, i) => <button key={g.id} onClick={() => { setGalleryIndex(i); setGalleryFull(true); }} aria-label={`Open artwork ${g.id}`} style={{ '--r': `${(i % 5 - 2) * 1.5}deg` } as CSSProperties}><img src={art(g.id === 41 ? 42 : g.id)} alt={`Artwork ${g.id}`} loading="lazy" /><span>{String(i + 1).padStart(2, '0')}<ArrowUpRight size={14} /></span></button>)}</div>}</div>}
              {view === 'about' && <div className="about-reader"><div className="bio-sheet"><img className="bio-sticker" src={nameSticker} alt="Dmitriy Gusev" /><p>{aboutText}</p><h3>TOOLS &amp; THINKING</h3><div className="skill-labels">{[...skills.advanced, ...skills.intermediate].map(s => <span key={s}>{s}</span>)}</div></div><div className="experience-sheet"><h3>EXPERIENCE</h3>{experiences.map((exp, i) => <article key={i}><span>{exp.period}</span><h4>{exp.company}</h4><p>{exp.role}</p><ul>{exp.description.map(s => <li key={s}>{s}</li>)}</ul></article>)}<h3>EDUCATION</h3>{education.map(edu => <article key={edu.university}><span>{edu.year}</span><h4>{edu.university}</h4><p>{edu.degree}</p></article>)}</div></div>}
              {view === 'contact' && <div className="contact-reader"><span className="contact-hand">{T.idea}</span><h3>{T.letsTalk}</h3><div className="contact-options"><a href="mailto:userskins@gmail.com"><span>01 / EMAIL</span>userskins@gmail.com<ArrowUpRight /></a><a href="https://t.me/userskins" target="_blank" rel="noopener noreferrer"><span>02 / TELEGRAM</span>@userskins<ArrowUpRight /></a><a href="https://vk.com/userskins" target="_blank" rel="noopener noreferrer"><span>03 / VK</span>userskins<ArrowUpRight /></a></div><img src={signature} alt="" /></div>}
              <div className="reader-footer"><span>ДМИТРИЙ ГУСЕВ / ИЗБРАННЫЕ РАБОТЫ</span><span>ДИЗАЙН — ЭТО ДЕЙСТВИЕ.</span></div>
            </motion.section>
          </Dialog.Content>
        </Dialog.Portal>}
      </AnimatePresence>
    </Dialog.Root>
  </div>;
}
createRoot(document.getElementById('studio-root')!).render(<Studio />);
