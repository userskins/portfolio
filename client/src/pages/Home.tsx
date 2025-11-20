
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/ui/Hero";
import { ProjectGrid } from "@/components/ui/ProjectGrid";
import { CV } from "@/components/ui/CV";
import { aboutText } from "@/lib/data";
import { motion, useScroll, useSpring } from "framer-motion";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[100]"
        style={{ scaleX }}
      />
      
      <Navbar />
      
      <main>
        <Hero />
        <CV />
        <ProjectGrid />
        
        {/* About / Footer Section */}
        <section id="about" className="py-24 px-6 md:px-12 border-t border-white/10 bg-card relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <span className="font-mono text-primary text-sm mb-8 block bg-white/10 inline-block px-2 py-1">// ABOUT_ME</span>
            
            <p className="font-display text-xl md:text-3xl leading-relaxed mb-12 text-white/90 whitespace-pre-line">
              {aboutText}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 font-mono text-sm text-muted-foreground">
              <div>
                <h4 className="text-white mb-4 border-b border-primary inline-block">CONTACT</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="mailto:userskins@gmail.com" className="hover:text-primary cursor-pointer transition-colors">
                      EMAIL
                    </a>
                  </li>
                  <li>
                    <a href="https://t.me/userskins" target="_blank" rel="noreferrer" className="hover:text-primary cursor-pointer transition-colors">
                      TELEGRAM
                    </a>
                  </li>
                  <li>
                    <a href="https://vk.com/userskins" target="_blank" rel="noreferrer" className="hover:text-primary cursor-pointer transition-colors">
                      VK
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white mb-4 border-b border-primary inline-block">SERVICES</h4>
                <ul className="space-y-2">
                  <li>GRAPHIC DESIGN</li>
                  <li>EMAIL NEWSLETTERS</li>
                  <li>CREATIVE DEV</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Large Background Text */}
          <div className="absolute -bottom-20 -right-20 pointer-events-none opacity-5 select-none">
            <span className="font-display text-[20rem] font-bold leading-none text-white">ME</span>
          </div>
        </section>
      </main>
    </div>
  );
}
