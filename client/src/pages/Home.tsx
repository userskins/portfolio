
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/ui/Hero";
import { ProjectGrid } from "@/components/ui/ProjectGrid";
import { motion, useScroll, useSpring } from "framer-motion";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-black">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[100]"
        style={{ scaleX }}
      />
      
      <Navbar />
      
      <main>
        <Hero />
        <ProjectGrid />
        
        {/* About / Footer Section */}
        <section id="about" className="py-24 px-6 md:px-12 border-t border-white/10 bg-card relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <span className="font-mono text-primary text-sm mb-8 block">// ABOUT_ME</span>
            
            <p className="font-display text-2xl md:text-4xl leading-tight mb-12 text-white/90">
              I CRAFT DIGITAL EXPERIENCES AT THE INTERSECTION OF <span className="text-primary">DESIGN</span> AND <span className="text-primary">TECHNOLOGY</span>. 
              SPECIALIZING IN BRUTALIST AESTHETICS AND MICRO-INTERACTIONS.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 font-mono text-sm text-muted-foreground">
              <div>
                <h4 className="text-white mb-4">CONTACT</h4>
                <ul className="space-y-2">
                  <li className="hover:text-primary cursor-pointer">EMAIL</li>
                  <li className="hover:text-primary cursor-pointer">TWITTER</li>
                  <li className="hover:text-primary cursor-pointer">INSTAGRAM</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white mb-4">SERVICES</h4>
                <ul className="space-y-2">
                  <li>ART DIRECTION</li>
                  <li>UI/UX DESIGN</li>
                  <li>FRONTEND DEV</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Large Background Text */}
          <div className="absolute -bottom-20 -right-20 pointer-events-none opacity-5">
            <span className="font-display text-[20rem] font-bold leading-none">LAB</span>
          </div>
        </section>
      </main>
    </div>
  );
}
