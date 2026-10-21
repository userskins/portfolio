import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { galleryImages, projects, type Project } from "@/lib/data";
import heroLogo from "@assets/hero-logo.webp";
import "./CreativeDesk.css";

type Category = "all" | Project["tag"];

const categories: { id: Category; number: string; label: string; note: string }[] = [
  { id: "websites", number: "01", label: "Сайты", note: "web / digital" },
  { id: "design", number: "02", label: "Графика", note: "visual / print" },
  { id: "email", number: "03", label: "CRM & Email", note: "communications" },
  { id: "animation", number: "04", label: "Анимация", note: "motion / art" },
  { id: "all", number: "05", label: "Все проекты", note: "full archive" },
];

const artPrints = [
  { id: 32, caption: "АВТОРСКАЯ ГРАФИКА", year: "2023" },
  { id: 1, caption: "ВИЗУАЛЬНЫЕ СИСТЕМЫ", year: "2024" },
  { id: 17, caption: "АРХИВ ЭКСПЕРИМЕНТОВ", year: "2025" },
];

const imageForProject: Record<string, number> = {
  "05": 32,
  "07": 1,
};

function projectHost(url?: string) {
  if (!url) return "ARCHIVE";
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host.length > 24 ? host.slice(0, 22) + "…" : host;
  } catch {
    return "EXTERNAL LINK";
  }
}

function DoodleArrow({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 94" fill="none" aria-hidden="true">
      <path d="M7 30C58 8 76 80 135 55c29-12 38-23 68-21" stroke="#f00000" strokeWidth="3" strokeLinecap="round" />
      <path d="M184 18 209 33 189 56" stroke="#f00000" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DeskScreen({
  project,
  live,
}: {
  project: Project;
  live: boolean;
}) {
  const isWebsite = project.tag === "websites";
  const imageIndex = imageForProject[project.id];
  const asset = imageIndex ? galleryImages.find((image) => image.id === imageIndex)?.src : undefined;

  return (
    <div className="cc-screen">
      <AnimatePresence mode="wait" initial={false}>
        {live && isWebsite && project.url ? (
          <motion.div
            className="cc-screen-live"
            key={"live-" + project.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: .25 }}
          >
            <iframe
              src={project.url}
              title={"Сайт проекта: " + project.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              sandbox="allow-forms allow-same-origin allow-scripts"
            />
            <span className="cc-live-caption">Live view / некоторые сайты запрещают встраивание</span>
          </motion.div>
        ) : (
          <motion.div
            className={"cc-screen-poster cc-screen-poster--" + project.tag}
            key={"poster-" + project.id}
            initial={{ opacity: 0, scale: 1.09, x: 24 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, x: -22, scale: .97 }}
            transition={{ duration: .36, ease: [.22, 1, .36, 1] }}
          >
            {asset ? <img className="cc-screen-poster-art" src={asset} alt="" /> : null}
            <div className="cc-screen-poster-shade" />
            <div className="cc-screen-browser">
              <span>USERSKINS / ARCHIVE</span>
              <span>{projectHost(project.url)}</span>
            </div>
            <div className="cc-screen-title-block">
              <span className="cc-screen-kicker">ОТКРЫТЫЙ ФАЙЛ / #{project.id}</span>
              <h3>{project.title}</h3>
              <p>{project.category}</p>
            </div>
            <div className="cc-screen-poster-bottom">
              <span>{project.year}</span>
              <span className="cc-screen-asterisk">✳</span>
              <span>{isWebsite ? "WEBSITE" : "CASE STUDY"}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Laptop({
  project,
  live,
}: {
  project: Project;
  live: boolean;
}) {
  return (
    <div className="cc-laptop" aria-label={"Мини-ноутбук с проектом " + project.title}>
      <div className="cc-laptop-lid">
        <i className="cc-laptop-camera" aria-hidden="true" />
        <DeskScreen project={project} live={live} />
      </div>
      <div className="cc-laptop-base" aria-hidden="true">
        <div className="cc-laptop-keys" />
        <div className="cc-laptop-trackpad" />
      </div>
      <div className="cc-laptop-edge" aria-hidden="true" />
    </div>
  );
}

function GalleryLightbox({
  index,
  setIndex,
}: {
  index: number | null;
  setIndex: (value: number | null) => void;
}) {
  useEffect(() => {
    if (index === null) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIndex(null);
      if (event.key === "ArrowLeft") setIndex((index + artPrints.length - 1) % artPrints.length);
      if (event.key === "ArrowRight") setIndex((index + 1) % artPrints.length);
    };
    document.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [index, setIndex]);

  if (typeof document === "undefined") return null;
  const item = index === null ? null : artPrints[index];
  const src = item ? galleryImages.find((image) => image.id === item.id)?.src : null;

  return createPortal(
    <AnimatePresence>
      {item && src ? (
        <motion.div
          className="cc-lightbox"
          key="creative-gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={"Работа из галереи №" + item.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIndex(null)}
        >
          <div className="cc-lightbox-top">
            <span>USERSKINS / ART ARCHIVE / {String(item.id).padStart(2, "0")}</span>
            <button type="button" onClick={() => setIndex(null)} aria-label="Закрыть изображение"><X size={24} /></button>
          </div>
          <div className="cc-lightbox-image" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="cc-lightbox-arrow"
              aria-label="Предыдущая работа"
              onClick={() => setIndex((index! + artPrints.length - 1) % artPrints.length)}
            ><ChevronLeft size={28} /></button>
            <img src={src} alt={item.caption} />
            <button
              type="button"
              className="cc-lightbox-arrow"
              aria-label="Следующая работа"
              onClick={() => setIndex((index! + 1) % artPrints.length)}
            ><ChevronRight size={28} /></button>
          </div>
          <div className="cc-lightbox-bottom">
            <span>{item.caption} / {item.year}</span>
            <span>{index! + 1} / {artPrints.length}</span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

export function CreativeDesk() {
  const [category, setCategory] = useState<Category>("websites");
  const [selectedId, setSelectedId] = useState("17");
  const [live, setLive] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const deskRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();

  const visible = useMemo(
    () => category === "all" ? projects : projects.filter((project) => project.tag === category),
    [category]
  );
  const selectedIndex = Math.max(0, visible.findIndex((project) => project.id === selectedId));
  const selected = visible[selectedIndex] ?? projects[0];
  const categoryInfo = categories.find((item) => item.id === category) ?? categories[0];

  const chooseCategory = (next: Category) => {
    const first = next === "all" ? projects[0] : projects.find((project) => project.tag === next);
    setCategory(next);
    setSelectedId(first?.id ?? projects[0].id);
    setLive(false);
  };

  const chooseProject = (next: Project) => {
    setSelectedId(next.id);
    setLive(false);
  };

  const goProject = (offset: number) => {
    if (!visible.length) return;
    const index = (selectedIndex + offset + visible.length) % visible.length;
    chooseProject(visible[index]);
  };

  return (
    <>
      <section id="projects" className="cc-section">
        <div className="cc-desk" ref={deskRef}>
          <div className="cc-topline">
            <span><b>USERSKINS</b> <i>©</i> &nbsp;/&nbsp; PERSONAL CREATIVE ARCHIVE</span>
            <span className="cc-topline-year">Nº 001 / 2026 &nbsp; • &nbsp; SCROLL TO EXPLORE</span>
          </div>
          <div className="cc-composition">
            <aside className="cc-identity">
              <div className="cc-index-label"><span className="cc-red-dot" /> CREATIVE WORKSPACE — 01</div>
              <motion.img
                className="cc-main-sticker"
                src={heroLogo}
                alt="Привет! Меня зовут Дмитрий Гусев"
                initial={reduceMotion ? false : { opacity: 0, rotate: -6, y: 24 }}
                animate={{ opacity: 1, rotate: -3, y: 0 }}
                transition={{ duration: .65 }}
              />
              <p className="cc-identity-about">ДИЗАЙН / WEB / CRM / MOTION.<br />ИДЕИ, КОТОРЫЕ РАБОТАЮТ.</p>
              <div className="cc-name-rule" />
              <div className="cc-side-note">наведи.<br />потрогай.<br />полистай.<span>↗</span></div>
              <h1 className="cc-display-title">МОИ<br />РАБОТЫ<span>✳</span></h1>
              <p className="cc-lead">Здесь всё можно исследовать: открыть категорию, разложить проекты и заглянуть в ноутбук.</p>
              <div className="cc-category-header">ВЫБЕРИ ПАПКУ / <span>01—05</span></div>
              <nav className="cc-categories" aria-label="Категории проектов">
                {categories.map((item) => {
                  const count = item.id === "all" ? projects.length : projects.filter((p) => p.tag === item.id).length;
                  const active = category === item.id;
                  return (
                    <motion.button
                      type="button"
                      key={item.id}
                      className={"cc-category " + (active ? "cc-category--active" : "")}
                      onClick={() => chooseCategory(item.id)}
                      aria-pressed={active}
                      whileHover={reduceMotion ? undefined : { x: 5 }}
                      data-testid={"creative-category-" + item.id}
                    >
                      <span className="cc-cat-number">{item.number}</span>
                      <span className="cc-cat-title">{item.label}</span>
                      <span className="cc-cat-count">/{String(count).padStart(2, "0")}</span>
                      <ArrowUpRight className="cc-cat-arrow" size={16} />
                    </motion.button>
                  );
                })}
              </nav>
              <div className="cc-identity-signature">
                <a href="https://t.me/userskins" target="_blank" rel="noopener noreferrer">TG ↗</a>
                <a href="mailto:userskins@gmail.com">MAIL ↗</a>
                <span>EST. 2020</span>
              </div>
            </aside>

            <div className="cc-art-area" aria-label="Настоящие графические работы из портфолио">
              <span className="cc-desk-pencil cc-desk-pencil--top" aria-hidden="true" />
              <span className="cc-annotation cc-annotation--top">SELECTED / VISUAL NOTES</span>
              <span className="cc-tape cc-tape--a" aria-hidden="true" />
              <span className="cc-tape cc-tape--b" aria-hidden="true" />
              <motion.button
                className="cc-print cc-print--back"
                type="button"
                drag={!isMobile && !reduceMotion}
                dragConstraints={deskRef}
                dragMomentum={false}
                whileHover={reduceMotion ? undefined : { rotate: -2, scale: 1.045, zIndex: 15 }}
                whileDrag={{ scale: 1.05, zIndex: 25 }}
                onClick={() => setLightboxIndex(1)}
                aria-label="Открыть графическую работу из галереи №1"
              >
                <img src={galleryImages[0].src} alt="Авторская графическая работа: день рождения ИТММ" draggable={false} />
                <span>VISUAL ARCHIVE / 2024</span>
              </motion.button>
              <motion.button
                className="cc-print cc-print--front"
                type="button"
                drag={!isMobile && !reduceMotion}
                dragConstraints={deskRef}
                dragMomentum={false}
                whileHover={reduceMotion ? undefined : { rotate: 0, scale: 1.045, zIndex: 18 }}
                whileDrag={{ scale: 1.05, zIndex: 25 }}
                onClick={() => setLightboxIndex(0)}
                aria-label="Открыть работу С закрытыми глазами"
              >
                <img src={galleryImages[31].src} alt="Плакат С закрытыми глазами" draggable={false} />
                <span>PRINT / SELECTED 01</span>
              </motion.button>
              <motion.button
                className="cc-print cc-print--small"
                type="button"
                drag={!isMobile && !reduceMotion}
                dragConstraints={deskRef}
                dragMomentum={false}
                whileHover={reduceMotion ? undefined : { rotate: 0, scale: 1.08, zIndex: 19 }}
                whileDrag={{ scale: 1.05, zIndex: 25 }}
                onClick={() => setLightboxIndex(2)}
                aria-label="Открыть экспериментальную графическую работу"
              >
                <img src={galleryImages[16].src} alt="Экспериментальная графика с мобильным телефоном" draggable={false} />
                <span>VISUAL / 2025</span>
              </motion.button>
              <div className="cc-notepad" aria-hidden="true">
                <span>KEEP</span><strong>MAKING<br />THINGS.</strong><i>✳</i>
              </div>
              <div className="cc-art-pen" aria-hidden="true" />
              <DoodleArrow className="cc-arrow-doodle" />
              <p className="cc-handwriting">Это не просто<br />список проектов.</p>
              <span className="cc-scribble-star" aria-hidden="true">✳</span>
            </div>

            <div className="cc-device-area">
              <div className="cc-device-overline">
                <span>02 / OPEN ON DESKTOP</span>
                <span>{categoryInfo.note}</span>
              </div>
              <div className="cc-device-decoration" aria-hidden="true">NEW<br />WORK</div>
              <Laptop project={selected} live={live} />
              <div className="cc-laptop-controls">
                <div className="cc-laptop-counter">
                  <span>PROJECT / {String(selectedIndex + 1).padStart(2, "0")}</span>
                  <span>OF {String(visible.length).padStart(2, "0")}</span>
                </div>
                <div className="cc-arrows">
                  <button type="button" onClick={() => goProject(-1)} aria-label="Предыдущий проект" data-testid="creative-prev"><ChevronLeft size={21}/></button>
                  <button type="button" onClick={() => goProject(1)} aria-label="Следующий проект" data-testid="creative-next"><ChevronRight size={21}/></button>
                </div>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  className="cc-current-file"
                  key={selected.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: .22 }}
                >
                  <div className="cc-current-top"><span>FILE / {selected.id}</span><span>{selected.year}</span></div>
                  <h2>{selected.title}</h2>
                  <p>{selected.category}</p>
                  <div className="cc-current-actions">
                    <a
                      href={selected.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cc-open-button"
                      data-testid="creative-open-original"
                    >ОТКРЫТЬ ПРОЕКТ <ArrowUpRight size={17}/></a>
                    {selected.tag === "websites" ? (
                      <button type="button" className="cc-live-button" onClick={() => setLive((value) => !value)} aria-pressed={live}>
                        {live ? <><ArrowLeft size={16} /> К ОБЛОЖКЕ</> : <><ExternalLink size={16} /> LIVE-ЭКРАН</>}
                      </button>
                    ) : null}
                  </div>
                </motion.div>
              </AnimatePresence>
              <span className="cc-laptop-handnote">листай проекты<br />← &nbsp;&nbsp; →</span>
            </div>
          </div>

          <div id="archive" className="cc-contact-sheet">
            <div className="cc-contact-head">
              <span><b>03 / АРХИВ</b> &nbsp;—&nbsp; {categoryInfo.label.toUpperCase()}</span>
              <span>{visible.length} SELECTED FILES <ArrowDownRight size={15}/></span>
            </div>
            <div className="cc-file-list">
              {visible.map((project, index) => (
                <button
                  type="button"
                  key={project.id}
                  className={"cc-file-item " + (selected.id === project.id ? "cc-file-item--active" : "")}
                  onMouseEnter={() => { if (!isMobile) chooseProject(project); }}
                  onFocus={() => chooseProject(project)}
                  onClick={() => {
                    chooseProject(project);
                    if (isMobile) {
                      document.querySelector(".cc-device-area")?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  aria-pressed={selected.id === project.id}
                  data-testid={"creative-file-" + project.id}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{project.title}</span>
                  <small>{project.year}</small>
                  <ArrowUpRight size={16}/>
                </button>
              ))}
            </div>
            <div className="cc-contact-footer">
              <span>ВСЕ РАБОТЫ / ОРИГИНАЛЬНЫЕ МАТЕРИАЛЫ</span>
              <a href="#gallery">ГАЛЕРЕЯ РАБОТ <ArrowUpRight size={14}/></a>
            </div>
          </div>
        </div>
        <div className="cc-section-end">
          <span>АРХИВ ЗАКРЫТ? НЕТ. ДАЛЬШЕ БОЛЬШЕ.</span>
          <a href="#cv">ЛИСТАЙ НИЖЕ <ArrowDownRight size={19}/></a>
        </div>
      </section>
      <GalleryLightbox index={lightboxIndex} setIndex={setLightboxIndex} />
    </>
  );
}
