import { useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, FolderOpen, Grip, MonitorPlay, X } from "lucide-react";
import { projects, type Project } from "@/lib/data";
import { useIsMobile } from "@/hooks/use-mobile";
import "./ProjectsWorkspace.css";

type FolderId = "websites" | "design" | "email" | "animation" | "all";

const folders: { id: FolderId; label: string; filename: string; extension: string }[] = [
  { id: "websites", label: "Сайты", filename: "WEB", extension: ".html" },
  { id: "design", label: "Дизайн", filename: "DESIGN", extension: ".psd" },
  { id: "email", label: "Email", filename: "CRM", extension: ".eml" },
  { id: "animation", label: "Анимация", filename: "MOTION", extension: ".mov" },
  { id: "all", label: "Все работы", filename: "ALL FILES", extension: ".*" },
];

const extensions: Record<Project["tag"], string> = {
  websites: ".HTML",
  design: ".PSD",
  email: ".EML",
  animation: ".MOV",
};

function FolderIcon({ number }: { number: string }) {
  return (
    <div className="dg-folder-art" aria-hidden="true">
      <div className="dg-folder-sheet">
        <span className="font-mono text-[8px] font-bold tracking-widest text-black/55">ARCHIVE</span>
        <span className="mt-1 h-[2px] w-8 bg-primary" />
      </div>
      <div className="dg-folder-pocket" />
      <span className="dg-folder-number">{number}</span>
    </div>
  );
}

function FilePoster({ project, compact = false }: { project: Project; compact?: boolean }) {
  return (
    <div className={`relative flex h-full flex-col justify-between overflow-hidden border-2 border-black bg-[#f2f0e9] text-black ${compact ? "min-h-0 p-3 sm:p-5" : "min-h-[260px] p-5 sm:p-7"}`}>
      <div className="pointer-events-none absolute -right-20 -top-14 h-56 w-56 rotate-12 border-[25px] border-primary" />
      <div className="pointer-events-none absolute -bottom-20 left-[32%] h-52 w-16 -rotate-[28deg] bg-black/10" />
      <div className="relative flex items-start justify-between gap-2 border-b-2 border-black pb-3 font-mono text-[10px] font-bold uppercase">
        <span>DG / ARCHIVE</span>
        <span>{project.year} — {extensions[project.tag]}</span>
      </div>
      <div className={`relative max-w-md ${compact ? "my-2 sm:my-4" : "my-7"}`}>
        <span className={`mb-3 bg-primary px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${compact ? "hidden sm:inline-block" : "inline-block"}`}>
          {project.category}
        </span>
        <h4
          style={{ fontFamily: "'Comic Relief', cursive" }}
          className={`break-words font-bold leading-[1.2] ${compact ? "text-sm sm:text-2xl" : "text-xl sm:text-3xl"}`}
        >
          {project.title}
        </h4>
      </div>
      <div className={`relative justify-between gap-3 border-t-2 border-black pt-3 font-mono text-[10px] uppercase tracking-wider ${compact ? "hidden sm:flex" : "flex"}`}>
        <span>PROJECT FILE / #{project.id}</span>
        <span>OPEN ORIGINAL ↗</span>
      </div>
    </div>
  );
}

function LaptopPreview({
  project,
  live,
  onToggleLive,
}: {
  project: Project;
  live: boolean;
  onToggleLive: () => void;
}) {
  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-wide">
        <span className="font-bold text-black">WEB DISPLAY / 01</span>
        <button
          type="button"
          onClick={onToggleLive}
          aria-pressed={live}
          className="border border-black bg-[#f2f0e9] px-3 py-1.5 font-bold text-black transition-colors hover:bg-primary"
        >
          {live ? "← Постер проекта" : "Живой сайт ↗"}
        </button>
      </div>
      <div className="mx-auto w-full max-w-[680px]">
        <div className="relative rounded-t-xl border-[9px] border-b-[12px] border-[#1c1c1e] bg-[#1c1c1e] shadow-[0_14px_25px_rgba(0,0,0,.3)]">
          <span className="absolute -top-[6px] left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-[#626262]" />
          <div className="relative aspect-[16/10] overflow-hidden bg-[#f2f0e9]">
            {live ? (
              <div className="relative h-full w-full bg-[#111]">
                <iframe
                  key={project.id}
                  src={project.url}
                  title={`Предпросмотр сайта: ${project.title}`}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  sandbox="allow-forms allow-same-origin allow-scripts"
                  className="absolute inset-0 h-full w-full border-0"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/90 px-2 py-1.5 font-mono text-[9px] text-white/80">
                  Если сайт не отображается — откройте оригинал по кнопке ниже
                </div>
              </div>
            ) : (
              <FilePoster project={project} compact />
            )}
          </div>
        </div>
        <div
          aria-hidden="true"
          className="mx-auto h-5 w-[108%] -translate-x-[3.7%] border border-[#a0a0a0] bg-[#c7c7c7]"
          style={{ clipPath: "polygon(8% 0%,92% 0%,100% 100%,0% 100%)" }}
        />
        <div aria-hidden="true" className="mx-auto h-[5px] w-[108%] -translate-x-[3.7%] rounded-b-[50%] bg-[#666]" />
      </div>
      <p className="mt-5 text-center font-mono text-[10px] leading-relaxed text-black/60">
        Постер — авторская карточка, не скриншот сайта. Live-просмотр зависит от настроек проекта.
      </p>
    </div>
  );
}

export function Projects() {
  const [activeFolder, setActiveFolder] = useState<FolderId>("websites");
  const [activeIndex, setActiveIndex] = useState(0);
  const [windowOpen, setWindowOpen] = useState(true);
  const [live, setLive] = useState(false);
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();
  const desktopRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const visible = activeFolder === "all"
    ? projects
    : projects.filter((project) => project.tag === activeFolder);
  const activeProject = visible[activeIndex] ?? visible[0];
  const folder = folders.find((item) => item.id === activeFolder) ?? folders[0];

  const selectFolder = (id: FolderId) => {
    setActiveFolder(id);
    setActiveIndex(0);
    setWindowOpen(true);
    setLive(false);
  };

  const selectProject = (index: number) => {
    setActiveIndex(index);
    setLive(false);
  };

  const navigate = (direction: number) => {
    if (!visible.length) return;
    setActiveIndex((previous) => (previous + direction + visible.length) % visible.length);
    setLive(false);
  };

  return (
    <section id="projects" className="relative overflow-hidden border-t border-white/10 bg-card px-4 py-24 sm:px-6 md:px-12">
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-5xl uppercase tracking-tighter text-white md:text-7xl">
              PROJECTS<span className="text-primary">.</span>
            </h2>
            <p className="mt-4 max-w-xl font-mono text-xs leading-relaxed text-white/60 sm:text-sm">
              Не просто список работ. Это мой рабочий стол: выбирайте папку, открывайте файлы, листайте проекты.
            </p>
          </div>
          <div className="-rotate-3 border-2 border-primary px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
            [ {projects.length} files available ]
          </div>
        </div>

        <div
          ref={desktopRef}
          className="dg-desk relative isolate overflow-hidden"
        >
          <div aria-hidden="true" className="dg-desk-folio">DG//26</div>

          <div className="dg-desk-bar flex min-h-14 items-center justify-between gap-3 px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[.09em] sm:px-7 sm:text-xs">
            <span className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 bg-primary" />
              USER SKINS <span className="hidden sm:inline text-black/35">// INTERACTIVE ARCHIVE</span>
            </span>
            <span className="hidden md:inline text-black/40">MOVE / CLICK / OPEN</span>
            <span className="border border-black px-2 py-1 text-[10px]">DESK / 26</span>
          </div>

          <div className="dg-desk-grid grid gap-8 p-4 pb-14 pt-7 sm:p-8 sm:pb-14 lg:min-h-[735px] lg:grid-cols-[244px_minmax(0,1fr)] lg:gap-10 lg:px-9">
            <aside className="dg-desk-left relative min-w-0 self-start">
              <div className="mb-5 flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-black/55">
                <span className="dg-desk-small-rule" /> 01 / SELECT FOLDER
              </div>
              <div aria-label="Папки проектов" className="grid grid-cols-3 gap-x-2 gap-y-4 sm:grid-cols-5 lg:grid-cols-2 lg:gap-x-3 lg:gap-y-8">
              {folders.map((item, index) => {
                const count = item.id === "all" ? projects.length : projects.filter((project) => project.tag === item.id).length;
                const active = activeFolder === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectFolder(item.id)}
                    aria-pressed={active}
                    data-testid={`folder-${item.id}`}
                    data-active={active}
                    className="dg-desk-folder group"
                  >
                    <FolderIcon number={String(index + 1).padStart(2, "0")} />
                    <span className={`block font-mono text-[10px] font-bold leading-tight sm:text-[11px] ${active ? "text-[#f00000]" : "text-[#111]"}`}>
                      {item.filename}<span className="text-black/45">{item.extension}</span>
                    </span>
                    <span className="block font-mono text-[10px] text-black/50">
                      {count} {count === 1 ? "файл" : "файлов"}
                    </span>
                    <span className="dg-folder-tooltip">
                      <strong>{item.label.toUpperCase()} / {count} FILES</strong>
                      {(item.id === "all" ? projects : projects.filter((project) => project.tag === item.id))
                        .slice(0, 2)
                        .map((project) => (
                          <span key={project.id} className="block truncate">{project.title}</span>
                        ))}
                    </span>
                  </button>
                );
              })}
              </div>
              <div className="mt-6 hidden lg:flex flex-col items-start gap-7">
                <span className="dg-desk-sticker">HANDLE WITH<br />CREATIVITY ↗</span>
                <p className="max-w-[205px] border-l-2 border-black pl-3 font-mono text-[10px] leading-relaxed text-black/55">
                  КЛИКНИ ПО ПАПКЕ.<br />ВЫБЕРИ ФАЙЛ.<br />ЛИСТАЙ СВОЙ КАТАЛОГ.
                </p>
              </div>
            </aside>

            <div className="relative min-w-0 self-start">
              <AnimatePresence mode="wait">
                {windowOpen ? (
                  <motion.div
                    key="project-window"
                    drag={!isMobile}
                    dragListener={false}
                    dragControls={dragControls}
                    dragConstraints={desktopRef}
                    dragMomentum={false}
                    initial={reduceMotion ? false : { opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: .97 }}
                    transition={{ duration: .22 }}
                    className="dg-desk-window relative z-20"
                    onKeyDown={(event) => {
                      if (event.target !== event.currentTarget) return;
                      if (event.key === "ArrowRight") navigate(1);
                      if (event.key === "ArrowLeft") navigate(-1);
                      if (event.key === "Escape") setWindowOpen(false);
                    }}
                    tabIndex={0}
                    role="region"
                    aria-label="Окно просмотра проектов"
                  >
                    <div className="dg-window-bar flex min-h-14 items-center gap-2 px-3 py-2 sm:px-5">
                      <span className="h-3 w-3 shrink-0 rounded-full bg-primary" />
                      <span className="h-3 w-3 shrink-0 rounded-full border border-white/60 bg-[#fafafa]" />
                      <span className="min-w-0 flex-1 truncate font-mono text-[10px] font-bold uppercase tracking-wide sm:text-xs">
                        DG / {folder.filename} / {visible.length} FILES
                      </span>
                      <button
                        type="button"
                        onPointerDown={(event) => { if (!isMobile) dragControls.start(event); }}
                        title="Перетащить окно"
                        aria-label="Перетащить окно"
                        className="hidden cursor-grab border border-white/50 p-1.5 hover:bg-primary hover:text-black active:cursor-grabbing lg:inline-flex"
                      >
                        <Grip size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setWindowOpen(false)}
                        aria-label="Закрыть окно"
                        className="border border-white/50 bg-[#f40000] p-1.5 text-white hover:bg-white hover:text-black"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="grid min-w-0 lg:grid-cols-[36%_minmax(0,1fr)]">
                      <div className="dg-window-list min-w-0 border-b-2 border-black lg:border-b-0 lg:border-r-2">
                        <div className="flex items-center justify-between gap-2 border-b border-black/20 px-4 py-3 font-mono text-[10px] font-bold uppercase sm:px-5">
                          <span>FILES / {folder.filename}</span>
                          <span>{visible.length} ITEMS</span>
                        </div>
                        <div className="max-h-[230px] overflow-y-auto overscroll-contain lg:max-h-[500px]">
                          {visible.map((project, index) => (
                            <button
                              type="button"
                              key={project.id}
                              onClick={() => selectProject(index)}
                              aria-pressed={index === activeIndex}
                              data-testid={`project-file-${project.id}`}
                              className={`flex w-full items-start gap-3 border-b border-black/15 px-4 py-4 text-left transition-colors hover:bg-primary/20 sm:px-5 ${index === activeIndex ? "bg-primary/25" : "bg-transparent"}`}
                            >
                              <span className="min-w-6 pt-0.5 font-mono text-[10px] font-bold text-black/45">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span style={{ fontFamily: "'Comic Relief', cursive" }} className="block break-words text-sm font-bold leading-snug text-black">
                                  {project.title}
                                </span>
                                <span className="mt-1 block font-mono text-[10px] uppercase text-black/55">
                                  {project.year} / {extensions[project.tag]}
                                </span>
                              </span>
                              {index === activeIndex && <span className="mt-1 h-2 w-2 shrink-0 bg-primary" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="dg-window-preview min-w-0 p-4 sm:p-6">
                        {activeProject && (
                          <>
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-black/20 pb-4">
                              <div className="font-mono text-[10px] font-bold uppercase text-black/60">
                                FILE #{activeProject.id} / {activeProject.year}
                              </div>
                              <div className="bg-primary px-2 py-1 font-mono text-[10px] font-bold uppercase">
                                {folder.filename}
                              </div>
                            </div>

                            {activeProject.tag === "websites" ? (
                              <LaptopPreview
                                project={activeProject}
                                live={live}
                                onToggleLive={() => setLive((value) => !value)}
                              />
                            ) : (
                              <FilePoster project={activeProject} />
                            )}

                            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t-2 border-black pt-4">
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => navigate(-1)}
                                  aria-label="Предыдущий проект"
                                  data-testid="project-previous"
                                  className="border-2 border-black p-2 transition-colors hover:bg-primary"
                                ><ChevronLeft size={21} /></button>
                                <span className="min-w-[65px] text-center font-mono text-xs font-bold">
                                  {String(activeIndex + 1).padStart(2, "0")} / {String(visible.length).padStart(2, "0")}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => navigate(1)}
                                  aria-label="Следующий проект"
                                  data-testid="project-next"
                                  className="border-2 border-black p-2 transition-colors hover:bg-primary"
                                ><ChevronRight size={21} /></button>
                              </div>
                              {activeProject.url ? (
                                <a
                                  href={activeProject.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  data-testid="project-open-original"
                                  className="inline-flex items-center gap-2 bg-black px-4 py-3 font-mono text-[11px] font-bold uppercase text-white transition-colors hover:bg-primary hover:text-black"
                                >
                                  Открыть проект <ArrowUpRight size={17} />
                                </a>
                              ) : (
                                <span className="font-mono text-[11px] uppercase text-black/50">Ссылка готовится</span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="closed-window"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex min-h-[470px] flex-col items-center justify-center border-2 border-dashed border-black/30 bg-white/70 p-8 text-center text-black"
                  >
                    <FolderOpen size={60} strokeWidth={1} className="mb-5 text-primary" />
                    <p className="font-display text-3xl uppercase">Папка закрыта</p>
                    <p className="mt-3 max-w-xs font-mono text-xs leading-relaxed text-black/55">
                      Нажмите на папку слева или откройте рабочее окно снова.
                    </p>
                    <button
                      onClick={() => setWindowOpen(true)}
                      type="button"
                      className="mt-6 flex items-center gap-2 border-2 border-black bg-black px-5 py-3 font-mono text-xs font-bold uppercase text-white hover:bg-primary hover:text-black"
                    >
                      <MonitorPlay size={16} /> Открыть окно
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              <span
                aria-hidden="true"
                style={{ fontFamily: "'Permanent Marker', cursive" }}
                className="pointer-events-none absolute -bottom-9 right-1 hidden -rotate-6 text-xl text-primary lg:block"
              >
                click / explore ↗
              </span>
            </div>
          </div>
          <div className="dg-desk-bottom relative flex flex-wrap justify-between gap-3 px-4 py-4 font-mono text-[10px] font-bold uppercase tracking-wider sm:px-7">
            <span>DESKTOP // USER: SKINS</span>
            <span>ALL WORKS © 2026</span>
          </div>
        </div>

        <p className="mt-5 flex items-center gap-3 font-mono text-xs text-white/50">
          <span className="h-[1px] w-7 bg-primary" />
          Откройте папку — выберите файл — листайте стрелками. На телефоне всё работает касанием.
        </p>
      </div>
    </section>
  );
}
