import { projects } from '@/lib/data';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export function Projects() {
  return (
    <section 
      id="projects"
      className="py-24 px-6 md:px-12 bg-card relative overflow-hidden border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto relative z-0 w-full">
        <div className="mb-24">
          <h3 className="font-display text-5xl text-white uppercase tracking-tighter">
            Projects
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
          {projects.map((project, index) => (
            <motion.a
              key={project.id}
              href="#"
              onClick={(e) => e.preventDefault()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="group flex items-center justify-between gap-4 py-4 border-b border-white/10 hover:border-primary/50 transition-colors"
              data-testid={`link-project-${project.id}`}
            >
              <div className="flex items-center gap-6 flex-1 min-w-0">
                <span className="font-mono text-white/60 text-sm font-medium tracking-wider whitespace-nowrap">
                  {String(projects.length - index).padStart(2, '0')}
                </span>
                <h4 className="text-white group-hover:text-primary transition-colors truncate">
                  {project.title}
                </h4>
              </div>
              <ArrowUpRight 
                size={18} 
                className="text-white/40 group-hover:text-primary transition-colors flex-shrink-0"
                strokeWidth={1.5}
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
