import { motion } from "framer-motion";
import { useState, useRef } from "react";
import boardImage from '@assets/доска_1764193532299.webp';
import { galleryImages, projects } from "@/lib/data";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/lib/translations";

interface DraggableItem {
  id: string;
  x: number;
  y: number;
  rotation: number;
  src?: string;
  type: 'photo' | 'text';
  content?: string;
}

export function Pinboard() {
  const { language } = useLanguage();
  const [draggableItems, setDraggableItems] = useState<DraggableItem[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleMouseDown = (e: React.MouseEvent, itemId: string) => {
    if (e.button !== 0) return;
    setDraggedId(itemId);
    
    const item = draggableItems.find(i => i.id === itemId);
    if (!item || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setDragOffset({
      x: mouseX - item.x,
      y: mouseY - item.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedId || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setDraggableItems(items =>
      items.map(item =>
        item.id === draggedId
          ? {
              ...item,
              x: Math.max(0, Math.min(mouseX - dragOffset.x, rect.width - 150)),
              y: Math.max(0, Math.min(mouseY - dragOffset.y, rect.height - 150)),
            }
          : item
      )
    );
  };

  const handleMouseUp = () => {
    setDraggedId(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="relative w-full bg-black min-h-screen overflow-hidden">
      {/* Cork Board Hero Section */}
      <section
        className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        ref={containerRef}
      >
        {/* Cork Board Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${boardImage})` }}
        />

        {/* Cork Board Texture Overlay */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, #c19a6b 0%, transparent 2%),
            radial-gradient(circle at 60% 70%, #d4a574 0%, transparent 3%),
            radial-gradient(circle at 30% 30%, #b8956a 0%, transparent 2%),
            radial-gradient(circle at 80% 20%, #c19a6b 0%, transparent 2%)
          `,
          backgroundSize: '200px 200px'
        }} />

        {/* Draggable Items Container */}
        <div className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing">
          {draggableItems.map((item) => (
            <motion.div
              key={item.id}
              className="absolute"
              style={{
                left: `${item.x}px`,
                top: `${item.y}px`,
                width: item.type === 'photo' ? '180px' : '160px',
                height: item.type === 'photo' ? '220px' : '80px',
              }}
              animate={{
                rotateZ: item.rotation,
              }}
              onMouseDown={(e) => handleMouseDown(e, item.id)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Pin */}
              <motion.div
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full shadow-lg z-20 border-2 border-red-600 cursor-grab"
                animate={{
                  scale: hoveredId === item.id ? 1.2 : 1,
                  y: hoveredId === item.id ? -8 : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              />

              {item.type === 'photo' && item.src ? (
                // Photo Card
                <motion.div
                  className="w-full h-full rounded-sm overflow-hidden shadow-2xl border-4 border-white bg-white cursor-grab active:cursor-grabbing"
                  animate={{
                    boxShadow: hoveredId === item.id
                      ? '0 20px 40px rgba(0,0,0,0.3)'
                      : '0 10px 25px rgba(0,0,0,0.2)',
                    y: hoveredId === item.id ? -4 : 0,
                  }}
                >
                  <img
                    src={item.src}
                    alt="Sticker"
                    className="w-full h-full object-cover pointer-events-none"
                  />
                </motion.div>
              ) : (
                // Text Sticker
                <motion.div
                  className="w-full h-full flex items-center justify-center rounded-lg font-display font-bold text-center px-2 py-4 shadow-xl border-2 text-black cursor-grab active:cursor-grabbing"
                  style={{
                    backgroundColor: '#FFE5B4',
                    borderColor: '#DC7633',
                  }}
                  animate={{
                    boxShadow: hoveredId === item.id
                      ? '0 15px 35px rgba(0,0,0,0.25)'
                      : '0 8px 20px rgba(0,0,0,0.15)',
                    y: hoveredId === item.id ? -4 : 0,
                  }}
                >
                  <span className="text-xs md:text-sm leading-tight pointer-events-none">
                    {item.content}
                  </span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none z-20"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <span className="font-mono text-xs tracking-widest text-white/60">SCROLL</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-0.5 h-8 bg-gradient-to-b from-white to-transparent rounded-full"
          />
        </motion.div>
      </section>

      {/* Projects Section */}
      <section className="py-32 px-6 md:px-12 border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mb-20"
          >
            <motion.h2
              variants={itemVariants}
              className="font-display text-5xl md:text-6xl font-bold text-white mb-4"
            >
              My Latest Work
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="font-mono text-white/50 text-lg"
            >
              From 2020 'til today
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-8"
          >
            {projects.slice(0, 6).map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className="group cursor-pointer"
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative overflow-hidden rounded-lg mb-6 bg-black/40 border border-white/10 hover:border-primary/50 transition-all duration-300">
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full aspect-video object-cover"
                    animate={{
                      scale: hoveredId === project.id ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                    <span className="text-primary font-mono text-sm">View Case Study ⟢</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-white group-hover:text-primary transition-colors duration-300 mb-2">
                      {project.title}
                    </h3>
                    <p className="font-mono text-white/60 text-sm uppercase tracking-wide">
                      {project.category}
                    </p>
                  </div>
                  <span className="font-mono text-white/40 text-sm md:text-base whitespace-nowrap">
                    {project.year}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-32 px-6 md:px-12 border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-3xl"
          >
            <motion.h2
              variants={itemVariants}
              className="font-display text-5xl md:text-6xl font-bold text-white mb-12"
            >
              My Story
            </motion.h2>

            <motion.div variants={itemVariants} className="space-y-6 font-mono text-white/70 leading-relaxed">
              <p>
                Every experience in my life is important and has taught me a lot. Crafting beautiful digital experiences
                through graphic design, email design, and creative development.
              </p>
              <p>
                My mission is to create unique, thoughtful, and engaging designs that resonate with users and help brands
                stand out in a crowded digital landscape.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 md:px-12 border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="font-display text-5xl md:text-6xl font-bold text-white mb-6">
              Let's create something
              <br />
              <span className="bg-gradient-to-r from-primary via-purple-400 to-blue-400 bg-clip-text text-transparent">
                amazing together
              </span>
            </h2>
            <p className="font-mono text-white/60 text-lg max-w-2xl mx-auto mb-8">
              Have a project in mind? Let's discuss how I can help bring your vision to life.
            </p>
          </motion.div>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            href="mailto:userskins@gmail.com"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-primary to-purple-500 text-black font-display font-bold text-xl rounded-lg hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
          >
            Start a Project
            <span>⟢</span>
          </motion.a>
        </div>
      </section>
    </div>
  );
}
