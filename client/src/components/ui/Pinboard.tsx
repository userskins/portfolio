import { motion } from "framer-motion";
import { useState } from "react";
import { galleryImages, projects } from "@/lib/data";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/lib/translations";

export function Pinboard() {
  const { language } = useLanguage();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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

  const selectedPhotos = galleryImages.slice(0, 8);

  return (
    <div className="relative w-full bg-black min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/40 via-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-500/20 via-primary/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center items-center px-6 md:px-12 pt-28 pb-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-6xl w-full"
          >
            {/* Greeting */}
            <motion.div variants={itemVariants} className="mb-8">
              <span className="font-mono text-xs md:text-sm tracking-widest text-primary/80 uppercase">
                👋 Howdy!
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] mb-8 max-w-5xl"
            >
              Meet your trusted{" "}
              <span className="bg-gradient-to-r from-primary via-purple-400 to-blue-400 bg-clip-text text-transparent">
                design partner
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={itemVariants}
              className="font-mono text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl mb-12"
            >
              Crafting strong brands and digital experiences for SaaS and creative projects.
              Specializing in graphic design, email design, and creative development.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-20">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-black font-display font-bold text-lg rounded-lg hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
              >
                Explore Work
                <span>⟢</span>
              </a>
              <a
                href="#about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-display font-bold text-lg rounded-lg hover:border-primary hover:text-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                My Story
              </a>
            </motion.div>
          </motion.div>

          {/* Featured Image Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-6xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {selectedPhotos.slice(0, 6).map((photo) => (
                <motion.div
                  key={photo.id}
                  variants={itemVariants}
                  className="relative overflow-hidden rounded-xl aspect-square bg-black/40 border border-white/10 hover:border-primary/50 cursor-pointer group"
                  onMouseEnter={() => setHoveredId(photo.id.toString())}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <motion.img
                    src={photo.src}
                    alt="Work"
                    className="w-full h-full object-cover"
                    animate={{
                      scale: hoveredId === photo.id.toString() ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-32 px-6 md:px-12 border-t border-white/10">
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
              {projects.slice(0, 6).map((project, idx) => (
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
        <section id="about" className="py-32 px-6 md:px-12 border-t border-white/10">
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
                  Every experience in my life is important and has taught me a lot. Growing up surrounded by creativity,
                  I discovered my passion for design and visual storytelling.
                </p>
                <p>
                  Over the years, I've worked with dynamic founders reinventing tomorrow—from YC startups to enterprises
                  and bootstrapped projects. My mission is to craft unique, consistent, and mature identities for brands
                  and products.
                </p>
                <p>
                  I believe design should be intentional, thoughtful, and rooted in understanding. Every project is an
                  opportunity to create something meaningful that resonates with users and stands the test of time.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6 md:px-12 border-t border-white/10">
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

        {/* Scroll Indicator */}
        <motion.div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <span className="font-mono text-xs tracking-widest text-white/40">SCROLL</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-0.5 h-8 bg-gradient-to-b from-primary to-transparent rounded-full"
          />
        </motion.div>
      </div>
    </div>
  );
}
