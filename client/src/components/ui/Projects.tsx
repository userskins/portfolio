import { projects } from '@/lib/data';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ProjectModal } from './ProjectModal';

export function Projects() {
  const [selectedTag, setSelectedTag] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const baseTagsMap = {
    'design': 'Дизайн',
    'animation': 'Анимация',
    'email': 'Email-рассылки',
    'websites': 'Сайты',
  };

  const getTagCount = (tagId: string) => {
    if (tagId === 'all') return projects.length;
    return projects.filter(p => p.tag === tagId).length;
  };

  // Sort tags by count (descending), then alphabetically
  const sortedTagIds = Object.keys(baseTagsMap)
    .sort((a, b) => {
      const countA = getTagCount(a);
      const countB = getTagCount(b);
      if (countA !== countB) {
        return countB - countA; // Higher count first
      }
      return baseTagsMap[a as keyof typeof baseTagsMap].localeCompare(baseTagsMap[b as keyof typeof baseTagsMap]); // Alphabetical
    });

  const tags = [
    { id: 'all', label: 'Все проекты' },
    ...sortedTagIds.map(id => ({ id, label: baseTagsMap[id as keyof typeof baseTagsMap] })),
  ];

  const filteredProjects = selectedTag === 'all' 
    ? projects 
    : projects.filter(p => p.tag === selectedTag);
  
  const itemsPerPage = isMobile ? 3 : 4;
  const displayedProjects = filteredProjects.slice(currentPage * itemsPerPage, currentPage * itemsPerPage + itemsPerPage);
  const hasPrevPage = currentPage > 0;
  const hasNextPage = currentPage * itemsPerPage + itemsPerPage < filteredProjects.length;
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const firstHalf = displayedProjects.slice(0, Math.ceil(displayedProjects.length / 2));
  const secondHalf = displayedProjects.slice(Math.ceil(displayedProjects.length / 2));

  const handleTagChange = (tagId: string) => {
    setSelectedTag(tagId);
    setCurrentPage(0);
  };

  const handleProjectClick = (project: typeof projects[0]) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const ProjectCard = ({ project, index, displayNumber }: { project: typeof projects[0]; index: number; displayNumber: number }) => (
    <motion.button
      onClick={() => handleProjectClick(project)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.2 }}
      className="group block w-full text-left p-6 border border-white/10 hover:border-primary/50 transition-all hover:bg-white/5 bg-transparent cursor-pointer"
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
      <h4 
        style={{ fontFamily: 'Comic Relief, cursive' }}
        className="text-white group-hover:text-primary transition-colors mb-3 uppercase font-bold text-sm"
      >
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
    </motion.button>
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
            {tags.map((tag) => {
              const hasProjects = getTagCount(tag.id) > 0;
              return (
                <button
                  key={tag.id}
                  onClick={() => handleTagChange(tag.id)}
                  disabled={!hasProjects}
                  className={`px-4 py-2 border rounded-full text-sm font-mono transition-all ${
                    !hasProjects
                      ? 'border-white/10 text-white/30 cursor-not-allowed opacity-40'
                      : selectedTag === tag.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-white/20 text-white/70 hover:border-primary/50 hover:text-primary'
                  }`}
                  data-testid={`button-filter-${tag.id}`}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>

        {isMobile ? (
          <div className="grid grid-cols-1 gap-6">
            {displayedProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} displayNumber={currentPage * itemsPerPage + index + 1} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 auto-rows-fr">
            {displayedProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} displayNumber={currentPage * itemsPerPage + index + 1} />
            ))}
          </div>
        )}

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

      <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
