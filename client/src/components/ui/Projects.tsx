import { projects } from '@/lib/data';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function Projects() {
  const [selectedTag, setSelectedTag] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  
  const tags = [
    { id: 'all', label: 'Все проекты' },
    { id: 'design', label: 'Дизайн' },
    { id: 'animation', label: 'Анимация' },
    { id: 'email', label: 'Email-рассылки' },
  ];

  const displayedProjects = projects.slice(currentPage * 4, currentPage * 4 + 4);
  const hasNextPage = currentPage * 4 + 4 < projects.length;
  const firstHalf = displayedProjects.slice(0, 2);
  const secondHalf = displayedProjects.slice(2, 4);

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
        <div className="pt-3 mt-3 border-t border-white/10">
          <span className="inline-block px-2 py-1 bg-white/5 border border-white/20 text-white/70 text-xs font-mono rounded">
            {project.tag === 'design' ? 'Дизайн' : 'Анимация'}
          </span>
        </div>
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
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setSelectedTag(tag.id)}
                className={`px-4 py-2 border rounded-full text-sm font-mono transition-all ${
                  selectedTag === tag.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-white/20 text-white/70 hover:border-primary/50 hover:text-primary'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {firstHalf.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} displayNumber={currentPage * 4 + index * 2 + 1} />
            ))}
          </div>
          <div className="space-y-6">
            {secondHalf.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index + 2} displayNumber={currentPage * 4 + index * 2 + 2} />
            ))}
          </div>
        </div>

        {hasNextPage && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="flex items-center gap-2 px-6 py-3 border border-white/20 text-white hover:border-primary hover:text-primary transition-all group"
            >
              <span className="font-mono text-sm">Ещё проекты</span>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
