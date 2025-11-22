import { projects } from '@/lib/data';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

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

        <div className="space-y-8 w-full mb-12">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="group border-b border-white/10 pb-8 last:border-b-0"
            >
              <div className="flex items-start justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h4 style={{ fontFamily: 'Comic Relief, cursive' }} className="text-2xl md:text-3xl text-white group-hover:text-primary transition-colors font-bold">
                      {project.title}
                    </h4>
                    <span className="text-sm font-mono text-white/60 uppercase tracking-wider">
                      {project.year}
                    </span>
                  </div>
                  <p className="text-white/70 font-mono text-sm mb-4">
                    {project.category}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      // TODO: Add project view functionality
                    }}
                    data-testid="link-project-view"
                    className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-white/60 group-hover:text-primary group-hover:border-primary transition-all hover:translate-x-1 hover:translate-y-[-1px]"
                  >
                    <ExternalLink size={20} strokeWidth={1.5} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
