import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/ui/Hero";
import { CV } from "@/components/ui/CV";
import { Gallery } from "@/components/ui/Gallery";
import { Projects } from "@/components/ui/Projects";
import { aboutText } from "@/lib/data";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import logo from "@assets/тэг_1763676137900.png";
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
                Gallery
              </h3>
            </div>
            <Gallery />
          </div>
        </section>

        <Projects />

        {/* About / Contact Section */}
        <section
          id="about"
          className="py-24 px-6 md:px-12 bg-card relative overflow-hidden scroll-mt-20 z-0 border-t border-white/10"
        >
          <div id="contact" className="absolute top-0 left-0" />
          <div className="max-w-7xl mx-auto relative z-0">
            <div className="mb-24">
              <h2 className="font-display text-5xl text-white mb-8 uppercase tracking-tighter">
                About Me
              </h2>

              <p className="font-mono text-xl md:text-2xl leading-relaxed text-white/90 max-w-5xl lg:max-w-6xl">
                {aboutText}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* Contact Block */}
          <div className="max-w-7xl mx-auto relative z-0">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 pt-12">
              <div className="w-full md:w-1/2">
                <h4 className="font-display text-5xl text-white mb-8 uppercase tracking-tighter">
                  Let's Connect
                </h4>
                <ul className="space-y-4 text-2xl md:text-3xl">
                  <li>
                    <a
                      href="mailto:userskins@gmail.com"
                      style={{ fontFamily: 'Comic Relief, cursive' }}
                      className="hover:text-primary hover:pl-4 transition-all cursor-pointer flex items-center gap-4 group font-bold"
                    >
                      <span className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      Email
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://t.me/userskins"
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontFamily: 'Comic Relief, cursive' }}
                      className="hover:text-primary hover:pl-4 transition-all cursor-pointer flex items-center gap-4 group font-bold"
                    >
                      <span className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      Telegram
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://vk.com/userskins"
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontFamily: 'Comic Relief, cursive' }}
                      className="hover:text-primary hover:pl-4 transition-all cursor-pointer flex items-center gap-4 group font-bold"
                    >
                      <span className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      VK
                    </a>
                  </li>
                </ul>
              </div>

              <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                <img
                  src={logo}
                  alt="Logo"
                  className="w-64 md:w-96 h-auto object-contain opacity-80 hover:opacity-100 transition-opacity transform rotate-3"
                />
              </div>
            </div>
          </div>

          {/* Large Background Text */}
          <div className="absolute -bottom-20 -right-20 pointer-events-none opacity-5 select-none">
            <span className="font-display text-[20rem] font-bold leading-none text-white">
              ME
            </span>
          </div>
        </section>
      </main>

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
