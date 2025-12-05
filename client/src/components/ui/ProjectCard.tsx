import { motion } from "framer-motion";
import { Project } from "@/lib/data";
import { useState } from "react";
import { ProjectModal } from "./ProjectModal";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <motion.div
        className={`relative group cursor-pointer overflow-hidden border border-white/10 bg-card/50 hover:border-primary/50 transition-colors duration-500 ${
          project.size === 'large' ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1 md:row-span-1'
        }`}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        onClick={handleCardClick}
      >
        <div className="aspect-[3/4] md:aspect-auto md:h-full w-full overflow-hidden relative">
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
          
          {/* Content */}
          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              <span className="font-mono text-xs text-primary border border-primary px-2 py-1">
                {project.id}
              </span>
              <span className="font-mono text-xs text-white/60">{project.year}</span>
            </div>

            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h3 
                style={{ fontFamily: 'Comic Relief, cursive' }}
                className="text-2xl md:text-4xl font-bold text-white mb-2 group-hover:text-primary transition-colors"
              >
                {project.title}
              </h3>
              <p className="font-mono text-xs text-white/60 uppercase tracking-wider">
                {project.category}
              </p>
            </div>
          </div>

          {/* Glitch Overlay Effect on Hover */}
          <div className="absolute inset-0 bg-primary/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-100 pointer-events-none" />
        </div>
      </motion.div>
      <ProjectModal project={project} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
