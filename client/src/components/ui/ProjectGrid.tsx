
import { projects } from "@/lib/data";
import { ProjectCard } from "./ProjectCard";

export function ProjectGrid() {
  return (
    <section id="work" className="w-full bg-background py-24 px-4 md:px-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-6">
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white">
            SELECTED_WORKS
          </h2>
          <span className="font-mono text-primary hidden md:block">
            [INDEX: {projects.length}]
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[500px]">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
