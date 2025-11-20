
import { motion } from "framer-motion";
import noiseTexture from '@assets/generated_images/dark_digital_noise_texture.png';

export function Hero() {
  return (
    <section className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-background">
      {/* Background Noise */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url(${noiseTexture})` }}
      />
      
      {/* Floating Grid Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-full h-[1px] bg-white/5" />
        <div className="absolute bottom-1/4 left-0 w-full h-[1px] bg-white/5" />
        <div className="absolute left-1/4 top-0 h-full w-[1px] bg-white/5" />
        <div className="absolute right-1/4 top-0 h-full w-[1px] bg-white/5" />
      </div>

      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="font-mono text-white text-sm tracking-[0.5em] mb-4 block bg-primary px-2 py-1 inline-block">
            HELLO MY NAME IS
          </span>
        </motion.div>

        <h1 
          className="font-display text-6xl md:text-9xl font-bold text-foreground tracking-widest leading-[0.9] mb-8 transform -rotate-2"
        >
          VISUAL
          <br />
          <span className="text-primary stroke-text" style={{ WebkitTextStroke: '2px var(--primary)', color: 'transparent' }}>
            ENGINEER
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex justify-center gap-8 font-mono text-xs md:text-sm text-white"
        >
          <span className="border-b-2 border-primary pb-1">// UI_DESIGN</span>
          <span className="border-b-2 border-primary pb-1">// ART_DIRECTION</span>
          <span className="border-b-2 border-primary pb-1">// CREATIVE_DEV</span>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-[1px] h-12 bg-primary" />
        <span className="font-mono text-[10px] tracking-widest text-primary">SCROLL</span>
      </motion.div>
    </section>
  );
}
