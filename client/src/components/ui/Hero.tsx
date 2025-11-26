
import { motion } from "framer-motion";
import noiseTexture from '@assets/generated_images/dark_digital_noise_texture.png';
import heroBg from '@assets/hero-bg.png';

export function Hero() {
  return (
    <section className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-background z-0">
      {/* Background Noise */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url(${noiseTexture})` }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <img 
          src={heroBg} 
          alt="Hero" 
          className="max-w-4xl w-full h-auto object-contain"
        />
      </motion.div>

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
