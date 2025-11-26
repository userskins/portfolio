import { motion } from "framer-motion";
import { useState } from "react";
import { galleryImages } from "@/lib/data";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/lib/translations";

export function Pinboard() {
  const { language } = useLanguage();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Select gallery images for the hero grid
  const selectedPhotos = galleryImages.slice(0, 6);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <section className="relative w-full min-h-screen bg-white overflow-hidden pt-28 pb-20">
      {/* Main Hero Content */}
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-20"
        >
          {/* Greeting */}
          <motion.div variants={itemVariants} className="mb-12">
            <span className="font-mono text-xs md:text-sm tracking-widest text-primary/60 uppercase">
              ✨ {t('hero.greeting', language)}
            </span>
          </motion.div>

          {/* Main Title with mixed styling */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-[1.2] mb-16 max-w-5xl"
          >
            We design digital
            <br />
            <span className="italic font-light text-primary">
              experiences that
            </span>
            <br />
            embody wisdom and
            <br />
            feel natural
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="font-mono text-base md:text-lg text-black/70 leading-relaxed max-w-2xl mb-12"
          >
            Crafting thoughtful design and creative direction. Specializing in
            graphic design, email design, and creative development.
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={itemVariants}>
            <a
              href="#about"
              className="inline-flex items-center gap-3 font-mono text-sm tracking-wider text-black hover:text-primary transition-colors duration-300 border-b-2 border-black hover:border-primary pb-2"
            >
              EXPLORE WORK
              <span className="text-xl">⟢</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Image Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-24"
        >
          {selectedPhotos.map((photo, idx) => (
            <motion.div
              key={photo.id}
              variants={itemVariants}
              className="relative overflow-hidden bg-black/5 aspect-square rounded-lg cursor-pointer group"
              onMouseEnter={() => setHoveredId(photo.id.toString())}
              onMouseLeave={() => setHoveredId(null)}
            >
              <motion.img
                src={photo.src}
                alt="Gallery"
                className="w-full h-full object-cover"
                animate={{
                  scale: hoveredId === photo.id.toString() ? 1.05 : 1,
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />

              {/* Overlay */}
              <motion.div
                className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"
                animate={{
                  backgroundColor: hoveredId === photo.id.toString() ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0)',
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="border-t border-black/10 pt-20"
        >
          <motion.h2
            variants={itemVariants}
            className="font-display text-4xl md:text-5xl font-bold text-black mb-16"
          >
            Experience
          </motion.h2>

          <motion.div variants={containerVariants} className="space-y-8">
            {[
              {
                role: "Creative Direction Lead",
                period: "2024 - Present",
                description: "Leading design and creative vision across multiple disciplines"
              },
              {
                role: "Graphic & Email Designer",
                period: "2022 - 2024",
                description: "Crafted distinctive visual identities and engaging email campaigns"
              },
              {
                role: "Design & Motion Specialist",
                period: "2020 - 2022",
                description: "Pioneered animation and motion design concepts"
              },
              {
                role: "Digital Designer",
                period: "2018 - 2020",
                description: "Developed comprehensive digital design systems"
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="group pb-8 border-b border-black/10 last:border-b-0 hover:bg-black/2 px-4 py-4 rounded-lg transition-colors duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <h3 className="font-display text-xl md:text-2xl font-bold text-black group-hover:text-primary transition-colors duration-300">
                    {item.role}
                  </h3>
                  <span className="font-mono text-sm text-black/50 mt-2 md:mt-0">
                    {item.period}
                  </span>
                </div>
                <p className="font-mono text-black/60">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <span className="font-mono text-xs tracking-widest text-black/40">SCROLL</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-0.5 h-8 bg-gradient-to-b from-black to-transparent rounded-full"
        />
      </motion.div>
    </section>
  );
}
