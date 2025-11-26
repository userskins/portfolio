
import { motion } from "framer-motion";
import noiseTexture from '@assets/generated_images/dark_digital_noise_texture.png';
import heroLogo from '@assets/hero-logo.webp';

export function Hero() {
  return (
    <section className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-background z-0">
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

      <div className="relative z-10 text-center px-4 flex items-center justify-center">
        <motion.img
          src={heroLogo}
          alt="Dmitriy Gusev"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-2xl md:max-w-4xl h-auto object-contain"
        />
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
