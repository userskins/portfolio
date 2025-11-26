import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/ui/Hero";
import { CV } from "@/components/ui/CV";
import { Gallery } from "@/components/ui/Gallery";
import { Projects } from "@/components/ui/Projects";
import { aboutText } from "@/lib/data";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white relative">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-0"
        style={{ scaleX }}
      />

      <Navbar />

      <main>
        <Hero />
        <CV />

        {/* Gallery Section */}
        <section
          id="gallery"
          className="py-24 px-6 md:px-12 bg-card relative overflow-hidden border-t border-white/10"
        >
          <div className="max-w-7xl mx-auto relative z-0">
            <div className="mb-16">
              <h3 className="font-display text-4xl md:text-5xl text-white uppercase tracking-tighter">
                Галерея
              </h3>
            </div>
            <Gallery />
          </div>
        </section>

        <Projects />

        {/* About Section */}
        <section
          id="about"
          className="py-24 px-6 md:px-12 bg-card relative overflow-hidden scroll-mt-20 z-0 border-t border-white/10"
        >
          <div id="contact" className="absolute top-0 left-0" />
          <div className="max-w-7xl mx-auto relative z-0">
            <div className="mb-24">
              <h2 className="font-display text-5xl text-white mb-8 uppercase tracking-tighter">
                Обо Мне
              </h2>

              <p className="font-mono text-xl md:text-2xl leading-relaxed text-white/90 max-w-5xl lg:max-w-6xl">
                {aboutText}
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Scroll To Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-y-1 hover:shadow-none transition-all"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
