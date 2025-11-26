import { projects } from '@/lib/data';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export function Projects() {
  const firstHalf = projects.slice(0, 4);
  const secondHalf = projects.slice(4, 8);

  const ProjectCard = ({ project, index, displayNumber }: { project: typeof projects[0]; index: number; displayNumber: number }) => (
    <motion.a
      href="#"
      onClick={(e) => e.preventDefault()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group block p-6 border border-white/10 hover:border-primary/50 transition-all hover:bg-white/5"
      data-testid={`link-project-${project.id}`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <span className="font-mono text-white/60 text-sm font-medium tracking-wider">
          {String(displayNumber).padStart(2, '0')}
        </span>
        <ArrowUpRight 
          size={16} 
          className="text-white/40 group-hover:text-primary transition-colors flex-shrink-0"
          strokeWidth={1.5}
        />
      </div>
      <h4 className="text-white group-hover:text-primary transition-colors mb-3 uppercase font-bold text-sm">
        {project.title}
      </h4>
      <div className="space-y-2">
        <p className="text-white/70 font-mono text-xs">
          {project.category}
        </p>
        <p className="text-white/60 font-mono text-xs">
          {project.year}
        </p>
      </div>
    </motion.a>
  );

  return (
    <section 
      id="projects"
      className="py-24 px-6 md:px-12 bg-card relative overflow-hidden border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto relative z-0 w-full">
        <div className="mb-24">
          <h3 className="font-display text-5xl text-white uppercase tracking-tighter mb-6">
            Projects
          </h3>
          <div className="flex gap-3 flex-wrap">
            <span className="px-4 py-2 border border-white/20 text-white/70 text-sm font-mono rounded-full hover:border-primary/50 hover:text-primary transition-all cursor-default">
              Дизайн
            </span>
            <span className="px-4 py-2 border border-white/20 text-white/70 text-sm font-mono rounded-full hover:border-primary/50 hover:text-primary transition-all cursor-default">
              Анимация
            </span>
            <span className="px-4 py-2 border border-white/20 text-white/70 text-sm font-mono rounded-full hover:border-primary/50 hover:text-primary transition-all cursor-default">
              Email-рассылки
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {firstHalf.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} displayNumber={index * 2 + 1} />
            ))}
          </div>
          <div className="space-y-6">
            {secondHalf.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index + 4} displayNumber={index * 2 + 2} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
