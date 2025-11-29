import { projects } from '@/lib/data';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function Projects() {
  const [selectedTag, setSelectedTag] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  
  const tags = [
    { id: 'all', label: 'Все проекты' },
    { id: 'design', label: 'Дизайн' },
    { id: 'animation', label: 'Анимация' },
    { id: 'email', label: 'Email-рассылки' },
    { id: 'websites', label: 'Сайты' },
  ];

  const filteredProjects = selectedTag === 'all' 
    ? projects 
    : projects.filter(p => p.tag === selectedTag);
  
  const displayedProjects = filteredProjects.slice(currentPage * 3, currentPage * 3 + 3);
  const hasPrevPage = currentPage > 0;
  const hasNextPage = currentPage * 3 + 3 < filteredProjects.length;
  const totalPages = Math.ceil(filteredProjects.length / 3);

  const handleTagChange = (tagId: string) => {
    setSelectedTag(tagId);
    setCurrentPage(0);
  };

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
            {project.tag === 'design' ? 'Дизайн' : project.tag === 'animation' ? 'Анимация' : project.tag === 'email' ? 'Email-рассылки' : 'Сайты'}
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
        <div className="mb-12">
          <h3 className="font-display text-5xl text-white uppercase tracking-tighter mb-6">
            Projects
          </h3>
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagChange(tag.id)}
                className={`px-4 py-2 border rounded-full text-sm font-mono transition-all ${
                  selectedTag === tag.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-white/20 text-white/70 hover:border-primary/50 hover:text-primary'
                }`}
                data-testid={`button-filter-${tag.id}`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {displayedProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} displayNumber={currentPage * 3 + index + 1} />
          ))}
        </div>

        <div className="mt-12 flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={!hasPrevPage}
            className={`p-2 border rounded-full transition-all ${
              hasPrevPage
                ? 'border-white/20 text-white hover:border-primary hover:text-primary cursor-pointer'
                : 'border-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          
          <span className="font-mono text-white/60 text-sm">
            {currentPage + 1} / {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={!hasNextPage}
            className={`p-2 border rounded-full transition-all ${
              hasNextPage
                ? 'border-white/20 text-white hover:border-primary hover:text-primary cursor-pointer'
                : 'border-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
