import { motion } from "framer-motion";
import { useState, useRef } from "react";
import boardImage from '@assets/доска_1764193532299.webp';
import sticker1 from '@assets/Group 2131328479_1764193971375.png';
import sticker2 from '@assets/собака-Photoroom_1764193971375.png';
import sticker3 from '@assets/Слой 19_1764193971375.png';
import sticker4 from '@assets/Слой 15_1764193971375.png';
import sticker5 from '@assets/11 копия_1764193971375.png';
import sticker6 from '@assets/Слой 21_1764193971376.png';
import sticker7 from '@assets/Слой 14_1764193971376.png';
import sticker8 from '@assets/Слой 16_1764193971376.png';
import sticker9 from '@assets/2_1764193971376.png';
import sticker10 from '@assets/Слой 18_1764193971376.png';
import sticker11 from '@assets/Слой 13_1764193971377.png';
import sticker12 from '@assets/Слой 17_1764193971377.png';
import sticker13 from '@assets/10_1764193971377.png';
import sticker14 from '@assets/Слой 5_1764193971377.png';
import sticker15 from '@assets/тэг_1764193971377.png';
import sticker16 from '@assets/Слой 20_1764193971378.png';
import { galleryImages, projects } from "@/lib/data";
import { useLanguage } from "@/hooks/useLanguage";

interface DraggableItem {
  id: string;
  x: number;
  y: number;
  rotation: number;
  src: string;
  type: 'sticker';
  width: number;
  height: number;
}

export function Pinboard() {
  const { language } = useLanguage();
  const [draggableItems, setDraggableItems] = useState<DraggableItem[]>([
    { id: 'sticker-1', x: 100, y: 80, rotation: -15, src: sticker1, type: 'sticker', width: 140, height: 140 },
    { id: 'sticker-2', x: 520, y: 120, rotation: 12, src: sticker2, type: 'sticker', width: 120, height: 140 },
    { id: 'sticker-3', x: 320, y: 60, rotation: -8, src: sticker3, type: 'sticker', width: 130, height: 160 },
    { id: 'sticker-4', x: 480, y: 280, rotation: 18, src: sticker4, type: 'sticker', width: 110, height: 100 },
    { id: 'sticker-5', x: 80, y: 320, rotation: -12, src: sticker5, type: 'sticker', width: 120, height: 180 },
    { id: 'sticker-6', x: 420, y: 340, rotation: 15, src: sticker6, type: 'sticker', width: 140, height: 150 },
    { id: 'sticker-7', x: 280, y: 320, rotation: -20, src: sticker7, type: 'sticker', width: 130, height: 130 },
    { id: 'sticker-8', x: 560, y: 380, rotation: 8, src: sticker8, type: 'sticker', width: 140, height: 100 },
    { id: 'sticker-9', x: 620, y: 140, rotation: 22, src: sticker9, type: 'sticker', width: 100, height: 150 },
    { id: 'sticker-10', x: 380, y: 220, rotation: -10, src: sticker10, type: 'sticker', width: 130, height: 140 },
    { id: 'sticker-11', x: 280, y: 160, rotation: 5, src: sticker11, type: 'sticker', width: 150, height: 100 },
    { id: 'sticker-12', x: 540, y: 240, rotation: -18, src: sticker12, type: 'sticker', width: 130, height: 100 },
    { id: 'sticker-13', x: 680, y: 280, rotation: 12, src: sticker13, type: 'sticker', width: 110, height: 170 },
    { id: 'sticker-14', x: 60, y: 140, rotation: -25, src: sticker14, type: 'sticker', width: 110, height: 220 },
    { id: 'sticker-15', x: 200, y: 280, rotation: 10, src: sticker15, type: 'sticker', width: 130, height: 90 },
    { id: 'sticker-16', x: 620, y: 440, rotation: -8, src: sticker16, type: 'sticker', width: 120, height: 110 },
  ]);
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
              x: Math.max(0, Math.min(mouseX - dragOffset.x, rect.width - 80)),
              y: Math.max(0, Math.min(mouseY - dragOffset.y, rect.height - 80)),
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

        {/* Draggable Stickers Container */}
        <div className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing">
          {draggableItems.map((item) => (
            <motion.div
              key={item.id}
              className="absolute"
              style={{
                left: `${item.x}px`,
                top: `${item.y}px`,
                width: `${item.width}px`,
                height: `${item.height}px`,
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

              {/* Sticker Image */}
              <motion.div
                className="w-full h-full rounded-sm overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing bg-white"
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
      <section className="py-32 px-6 md:px-12 border-t border-black/10 bg-white">
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
              className="font-display text-5xl md:text-6xl font-bold text-black mb-4"
            >
              My Latest Work
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="font-mono text-black/50 text-lg"
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
                <div className="relative overflow-hidden rounded-lg mb-6 bg-gray-100 border border-black/10 hover:border-primary/50 transition-all duration-300">
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full aspect-video object-cover"
                    animate={{
                      scale: hoveredId === project.id ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                    <span className="text-primary font-mono text-sm">View Case Study ⟢</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-black group-hover:text-primary transition-colors duration-300 mb-2">
                      {project.title}
                    </h3>
                    <p className="font-mono text-black/60 text-sm uppercase tracking-wide">
                      {project.category}
                    </p>
                  </div>
                  <span className="font-mono text-black/40 text-sm md:text-base whitespace-nowrap">
                    {project.year}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-32 px-6 md:px-12 border-t border-black/10 bg-white">
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
              className="font-display text-5xl md:text-6xl font-bold text-black mb-12"
            >
              My Story
            </motion.h2>

            <motion.div variants={itemVariants} className="space-y-6 font-mono text-black/70 leading-relaxed">
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
      <section className="py-32 px-6 md:px-12 border-t border-black/10 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="font-display text-5xl md:text-6xl font-bold text-black mb-6">
              Let's create something
              <br />
              <span className="text-primary">
                amazing together
              </span>
            </h2>
            <p className="font-mono text-black/60 text-lg max-w-2xl mx-auto mb-8">
              Have a project in mind? Let's discuss how I can help bring your vision to life.
            </p>
          </motion.div>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            href="mailto:userskins@gmail.com"
            className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-black font-display font-bold text-xl rounded-lg hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
          >
            Start a Project
            <span>⟢</span>
          </motion.a>
        </div>
      </section>
    </div>
  );
}
