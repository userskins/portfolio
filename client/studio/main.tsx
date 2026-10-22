import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowUpRight, ArrowLeft, ArrowRight, X, RotateCcw } from 'lucide-react';
import { projects, galleryImages, experiences, skills, education, aboutText, type Project } from '@/lib/data';
import nameSticker from '@assets/hero-logo.webp';
import signature from '@assets/logo.webp';
import './studio.css';

type Category = Project['tag'];
type View = Category | 'all' | 'gallery' | 'about' | 'contact' | null;
const BASE = import.meta.env.BASE_URL;
const T = {
  desk: 'Рабочий стол', work: 'Проекты', gallery: 'Галерея', about: 'Обо мне', contact: 'Контакты',
  back: 'На стол', original: 'Открыть проект', prev: 'Предыдущий', next: 'Следующий', reset: 'Собрать стол',
  intro: 'Дизайн. Сайты. CRM.', hint: 'Двигай предметы. Нажимай, чтобы открыть.',
  tapHint: 'Нажми на предмет, чтобы открыть.', preview: 'Предпросмотр сайта',
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
function Draggable({ name, children, rotation = 0, order = 0, small, onOpen }: {
  name: string; children: ReactNode; rotation?: number; order?: number; small: boolean; onOpen?: () => void;
}) {
  const lastDrag = useRef(0);
  const [raised, setRaised] = useState(false);
  const reduced = useReducedMotion();
  return <motion.div className={`desk-object object-${name}`} style={{ zIndex: raised ? 35 : undefined }}
    initial={reduced ? false : { opacity: 0, y: 28, rotate: rotation - 3 }}
    animate={{ opacity: 1, y: 0, rotate: small ? 0 : rotation }}
    transition={{ duration: .75, delay: order * .055, ease: [.22, 1, .36, 1] }}
    whileHover={small || reduced ? undefined : { rotate: rotation + 2, scale: 1.035 }}
    whileDrag={{ scale: 1.055, cursor: 'grabbing' }}
    drag={!small} dragMomentum={false} dragElastic={.06}
    dragConstraints={{ left: -95, right: 95, top: -65, bottom: 65 }}
    onDragStart={() => setRaised(true)} onDragEnd={() => { lastDrag.current = Date.now(); setRaised(false); }}
    onClick={() => { if (onOpen && Date.now() - lastDrag.current > 180) onOpen(); }} data-object={name}
  >{children}</motion.div>;
}
function Binder({ category, number, onOpen }: { category: Category; number: string; onOpen: () => void }) {
  const item = folders.find(f => f.id === category)!;
  const artwork = category === 'design' ? 32 : category === 'email' ? 33 : 27;
  return <button className={`binder ${cropClasses[category]}`} type="button" aria-label={`${item.label}: ${count(category)} projects`} data-folder={category} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onOpen(); } }}>
    <span className="binder-leaf leaf-back"><img src={art(category === 'design' ? 3 : 34)} alt="" draggable={false} /></span>
    <span className="binder-leaf leaf-middle"><img src={art(artwork)} alt="" draggable={false} /></span>
    <span className="binder-front">
      <span className="cover-art"><img src={art(artwork)} alt="" draggable={false} /></span><span className="cover-overprint" />
      <span className="binder-meta"><span>DG / {number}</span><span>{count(category)} CASES</span></span>
      <span className="binder-title">{category === 'email' ? <>EMAIL<br />&amp; CRM</> : item.name}<span className="hand-star">*</span></span>
      <span className="binder-foot"><span>{item.label}</span><ArrowUpRight size={25} strokeWidth={1.4} /></span><span className="binder-spine" />
    </span><span className="tape binder-tape" aria-hidden="true" /><span className="hover-tag">OPEN {item.name} <ArrowUpRight size={12} /></span>
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
function Laptop({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const rows = ['ESC F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 F11', '1 2 3 4 5 6 7 8 9 0 - +', 'Q W E R T Y U I O P [ ]', 'A S D F G H J K L : " ENTER', 'SHIFT Z X C V B N M , . / SHIFT'];
  return <div className="laptop">
    <button className="laptop-lid" type="button" onClick={e => { e.stopPropagation(); onOpen(); }} aria-label={folders[1].label} data-testid="open-websites">
      <span className="webcam" /><span className="laptop-display"><ProjectPreview project={project} /><span className="screen-caption">WEB / {count('websites')} CASES <ArrowUpRight size={16} /></span></span><span className="laptop-brand">MADE OF IDEAS.</span>
    </button><div className="laptop-hinge" />
    <div className="laptop-base" aria-hidden="true"><div className="speaker speaker-left" /><div className="speaker speaker-right" />
      <div className="keyboard">{rows.map((row, i) => <div key={i} className="key-row">{row.split(' ').map((key, j) => <span key={j} className={key.length > 2 ? 'wide-key' : ''}>{key}</span>)}</div>)}<div className="key-row final-row"><span>fn</span><span>ctrl</span><span>alt</span><span>cmd</span><span className="space-key" /><span>cmd</span><span>alt</span><span> &lt; </span><span> &gt; </span></div></div>
      <div className="trackpad" /><span className="laptop-decal">NOT<br />A TEMPLATE<span> *</span></span>
    </div><span className="laptop-front-edge" />
  </div>;
}
function Studio() {
  const [view, setView] = useState<View>(null);
  const [selected, setSelected] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryFull, setGalleryFull] = useState(false);
  const [reset, setReset] = useState(0);
  const small = useSmallScreen();
  const reduced = useReducedMotion();
  const holder = useRef<HTMLDivElement>(null);
  const [sceneScale, setSceneScale] = useState(1);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 65, damping: 25 }), sy = useSpring(y, { stiffness: 65, damping: 25 });
  const open = (next: View) => { setSelected(0); setGalleryFull(false); setView(next); };
  const list = view === 'all' ? projects : projects.filter(p => p.tag === view);
  const active = list[Math.min(selected, Math.max(0, list.length - 1))];
  const title = view === 'all' ? 'ALL PROJECTS' : view === 'gallery' ? 'VISUAL DIARY' : view === 'about' ? 'ABOUT ME' : view === 'contact' ? 'LET\'S TALK' : folders.find(f => f.id === view)?.name ?? '';
  const firstWebsite = projects.find(p => p.tag === 'websites')!;
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
  return <div className="studio-shell">
    <svg className="noise-filter" aria-hidden="true"><filter id="paper-grain"><feTurbulence type="fractalNoise" baseFrequency=".76" numOctaves="3" stitchTiles="stitch" /></filter></svg>
    <div className="paper-grain" aria-hidden="true" />
    <a href="#studio-navigation" className="skip-link">{T.work}</a>
    <aside className="identity-rail">
      <div className="eyebrow">DESIGNER / CREATIVE EXPLORER</div>
      <button className="name-sticker" onClick={() => open(null)} aria-label={T.desk}><img src={nameSticker} alt="Dmitriy Gusev" draggable={false} /></button>
      <p className="intro-line">{T.intro}<br /><span>Since 2020. Always curious.</span></p><span className="red-underline" />
      <nav id="studio-navigation" className="rail-nav" aria-label="Portfolio navigation">
        {([{ title: T.desk, value: null }, { title: T.work, value: 'all' }, { title: T.gallery, value: 'gallery' }, { title: T.about, value: 'about' }, { title: T.contact, value: 'contact' }] as { title: string; value: View }[]).map((item, i) => <button key={i} onClick={() => open(item.value)} aria-current={view === item.value ? 'page' : undefined}><span>{String(i + 1).padStart(2, '0')}</span>{item.title}<ArrowUpRight size={14} /></button>)}
      </nav>
      <div className="rail-bottom"><p className="rail-note">Good ideas<br />don't sit still.<span>*</span></p><div className="social-links"><a href="https://t.me/userskins" target="_blank" rel="noopener noreferrer">TG <ArrowUpRight size={11} /></a><a href="https://vk.com/userskins" target="_blank" rel="noopener noreferrer">VK <ArrowUpRight size={11} /></a><a href="mailto:userskins@gmail.com">MAIL <ArrowUpRight size={11} /></a></div></div>
    </aside>
    <main className="desk-area" aria-label={T.desk}>
      <div className="desk-topline"><span>PORTFOLIO / WORK IN PROGRESS</span><span className="tiny-cross">+</span><span>OBJECTS WITH STORIES</span></div>
      <div ref={holder} className="scene-holder" onPointerMove={e => { if (small || reduced || view) return; const rect = e.currentTarget.getBoundingClientRect(); x.set(((e.clientX - rect.left) / rect.width - .5) * -12); y.set(((e.clientY - rect.top) / rect.height - .5) * -9); }} onPointerLeave={() => { x.set(0); y.set(0); }}>
        <div className="scene-scale" style={{ '--scene-scale': sceneScale } as CSSProperties}>
          <motion.div className={`scene-camera ${view ? 'camera-focused' : ''}`} style={{ x: small || reduced ? 0 : sx, y: small || reduced ? 0 : sy }}>
            <div className="desk-scene" key={reset}>
              <span className="desk-handnote note-top" aria-hidden="true">a little bit of chaos.<br />a lot of design.</span>
              <svg className="desk-doodle doodle-arrow" viewBox="0 0 160 70" aria-hidden="true"><path d="M3 8 C 39 47 80 54 145 45 M128 25 L148 45 L126 57" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
              <div className="loose-paper loose-one" aria-hidden="true"><img src={art(27)} alt="" /></div>
              <div className="loose-paper loose-two" aria-hidden="true"><img src={art(34)} alt="" /></div>
              <Draggable name="design" rotation={-10} order={1} small={small} onOpen={() => open('design')}><Binder category="design" number="01" onOpen={() => open('design')} /></Draggable>
              <Draggable name="gallery" rotation={7} order={2} small={small} onOpen={() => open('gallery')}><button type="button" className="print-stack" data-testid="open-gallery" aria-label={T.gallery}><span className="print-under" /><span className="print-image"><img src={art(67)} alt="" draggable={false} /></span><span className="print-caption">VISUAL DIARY <span>01 / {uniqueGallery.length}</span></span><span className="paperclip" aria-hidden="true" /><span className="hover-tag">EXPLORE THE ARCHIVE <ArrowUpRight size={12} /></span></button></Draggable>
              <Draggable name="laptop" rotation={12} order={3} small={small}><Laptop project={firstWebsite} onOpen={() => open('websites')} /></Draggable>
              <Draggable name="email" rotation={5} order={4} small={small} onOpen={() => open('email')}><Binder category="email" number="02" onOpen={() => open('email')} /></Draggable>
              <Draggable name="motion" rotation={-7} order={5} small={small} onOpen={() => open('animation')}><Binder category="animation" number="03" onOpen={() => open('animation')} /></Draggable>
              <Draggable name="about" rotation={-6} order={6} small={small} onOpen={() => open('about')}><button className="about-notebook" aria-label={T.about} data-testid="open-about"><span className="notebook-holes" /><span className="notebook-head">NOTES / 2020 - 2026</span><span className="notebook-title">{T.about}</span><span className="notebook-copy">VK / HSE / DESIGN<br />ART + DIGITAL + PEOPLE</span><span className="notebook-sign">Dmitriy <ArrowUpRight size={24} /></span></button></Draggable>
              <Draggable name="contact" rotation={-12} order={7} small={small} onOpen={() => open('contact')}><button className="contact-card" aria-label={T.contact} data-testid="open-contact"><span>LET'S MAKE</span><strong>SOMETHING<br />MATTER.</strong><span>WRITE ME <ArrowUpRight size={20} /></span></button></Draggable>
              <div className="pencil" aria-hidden="true"><span /></div><span className="desk-handnote note-bottom" aria-hidden="true">make it<br /><u>mean</u> something.</span><span className="desk-star" aria-hidden="true">*</span>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="desk-bottomline"><span><span className="small-red-dot" />{small ? T.tapHint : T.hint}</span><button onClick={() => setReset(i => i + 1)} aria-label={T.reset}><RotateCcw size={13} />{T.reset}</button></div>
    </main>
    <Dialog.Root open={view !== null} onOpenChange={value => { if (!value) setView(null); }}>
      <AnimatePresence>
        {view !== null && <Dialog.Portal forceMount>
          <Dialog.Overlay forceMount asChild><motion.div className="reader-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .4 }} /></Dialog.Overlay>
          <Dialog.Content forceMount asChild aria-describedby="reader-description" onKeyDown={e => { if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return; if (e.key === 'ArrowRight') { e.preventDefault(); navigate(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); navigate(-1); } }}>
            <motion.section className={`reader reader-${view}`} initial={reduced ? false : { opacity: 0, y: 110, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: 85, rotate: 1 }} transition={{ duration: reduced ? 0 : .48, ease: [.22, 1, .36, 1] }}>
              <div className="reader-top"><Dialog.Close className="back-to-desk"><ArrowLeft size={17} />{T.back}</Dialog.Close><span>THE WORK / NOT THE TEMPLATE.</span><Dialog.Close className="close-reader" aria-label={T.back}><X size={25} /></Dialog.Close></div>
              <div className="reader-heading"><Dialog.Title>{title}<span className="hand-star">*</span></Dialog.Title><Dialog.Description id="reader-description">{T.realWork}</Dialog.Description></div>
              {active && <div className="case-layout">
                <div className="case-preview-column"><AnimatePresence mode="wait"><motion.div key={active.id} initial={reduced ? false : { opacity: 0, x: 28, rotate: 1 }} animate={{ opacity: 1, x: 0, rotate: 0 }} exit={{ opacity: 0, x: -25 }} transition={{ duration: .28 }} className="case-proof">
                  <div className="proof-meta"><span>FIG. {String(selected + 1).padStart(2, '0')}</span><span>{active.year} / {active.tag.toUpperCase()}</span></div><ProjectPreview project={active} />
                  <div className="proof-bottom"><span>{active.title}</span><span>DG / {active.id}</span></div>
                </motion.div></AnimatePresence>
                  <div className="case-controls"><button onClick={() => navigate(-1)} aria-label={T.prev}><ArrowLeft size={22} /></button><span aria-live="polite">{String(selected + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}</span><button onClick={() => navigate(1)} aria-label={T.next}><ArrowRight size={22} /></button><a href={active.url} target="_blank" rel="noopener noreferrer" className="original-link">{T.original}<ArrowUpRight size={18} /></a></div>
                </div>
                <div className="case-index"><div className="index-label">CONTENTS / {list.length} PROJECTS</div>{view === 'all' && <div className="category-shortcuts">{folders.map(f => <button key={f.id} onClick={() => open(f.id)}>{f.name}</button>)}</div>}<div className="case-files">{list.map((p, i) => <button key={p.id} data-case={p.id} aria-pressed={i === selected} onClick={() => setSelected(i)}><span>{String(i + 1).padStart(2, '0')}</span><span><strong>{p.title}</strong><small>{p.category} / {p.year}</small></span><ArrowUpRight size={16} /></button>)}</div><p className="index-handnote">ideas into<br />real things.</p></div>
              </div>}
              {view === 'gallery' && <div className="gallery-reader">{galleryFull ? <><button className="gallery-grid-back" onClick={() => setGalleryFull(false)}><ArrowLeft size={15} />ALL IMAGES</button><div className="gallery-lightbox"><button aria-label={T.prev} onClick={() => navigate(-1)}><ArrowLeft size={28} /></button><img src={uniqueGallery[galleryIndex].src} alt={`Artwork ${uniqueGallery[galleryIndex].id}`} /><button aria-label={T.next} onClick={() => navigate(1)}><ArrowRight size={28} /></button></div><div className="gallery-counter">{galleryIndex + 1} / {uniqueGallery.length}</div></> : <div className="gallery-wall">{uniqueGallery.map((g, i) => <button key={g.id} onClick={() => { setGalleryIndex(i); setGalleryFull(true); }} aria-label={`Open artwork ${g.id}`} style={{ '--r': `${(i % 5 - 2) * 1.5}deg` } as CSSProperties}><img src={art(g.id === 41 ? 42 : g.id)} alt={`Artwork ${g.id}`} loading="lazy" /><span>{String(i + 1).padStart(2, '0')}<ArrowUpRight size={14} /></span></button>)}</div>}</div>}
              {view === 'about' && <div className="about-reader"><div className="bio-sheet"><img className="bio-sticker" src={nameSticker} alt="Dmitriy Gusev" /><p>{aboutText}</p><h3>TOOLS &amp; THINKING</h3><div className="skill-labels">{[...skills.advanced, ...skills.intermediate].map(s => <span key={s}>{s}</span>)}</div></div><div className="experience-sheet"><h3>EXPERIENCE</h3>{experiences.map((exp, i) => <article key={i}><span>{exp.period}</span><h4>{exp.company}</h4><p>{exp.role}</p><ul>{exp.description.map(s => <li key={s}>{s}</li>)}</ul></article>)}<h3>EDUCATION</h3>{education.map(edu => <article key={edu.university}><span>{edu.year}</span><h4>{edu.university}</h4><p>{edu.degree}</p></article>)}</div></div>}
              {view === 'contact' && <div className="contact-reader"><span className="contact-hand">{T.idea}</span><h3>{T.letsTalk}</h3><div className="contact-options"><a href="mailto:userskins@gmail.com"><span>01 / EMAIL</span>userskins@gmail.com<ArrowUpRight /></a><a href="https://t.me/userskins" target="_blank" rel="noopener noreferrer"><span>02 / TELEGRAM</span>@userskins<ArrowUpRight /></a><a href="https://vk.com/userskins" target="_blank" rel="noopener noreferrer"><span>03 / VK</span>userskins<ArrowUpRight /></a></div><img src={signature} alt="" /></div>}
              <div className="reader-footer"><span>DMITRIY GUSEV / SELECTED WORK</span><span>DESIGN IS A VERB.</span></div>
            </motion.section>
          </Dialog.Content>
        </Dialog.Portal>}
      </AnimatePresence>
    </Dialog.Root>
  </div>;
}
createRoot(document.getElementById('studio-root')!).render(<Studio />);
