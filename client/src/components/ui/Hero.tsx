
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import noiseTexture from '@assets/generated_images/dark_digital_noise_texture.png';
import heroLogo from '@assets/hero-logo.webp';

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [logoOffset, setLogoOffset] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sectionRef.current) return;
    
    const rect = sectionRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate offset from center - logo follows cursor
    const offsetX = mouseX - centerX;
    const offsetY = mouseY - centerY;
    
    setLogoOffset({
      x: offsetX * 0.08,
      y: offsetY * 0.08
    });
  };

  const handleMouseLeave = () => {
    setLogoOffset({ x: 0, y: 0 });
  };

  return (
    <section 
      ref={sectionRef}
      className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-background z-0"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
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
          initial={{ 
            opacity: 1, 
            x: 0,
            y: 0
          }}
          animate={{ 
            opacity: 1, 
            x: logoOffset.x,
            y: logoOffset.y
          }}
          transition={{ 
            duration: 0.3,
            type: "spring",
            stiffness: 150,
            damping: 35
          }}
          whileHover={{ 
            rotate: 3,
            scale: 1.02
          }}
          className="w-full max-w-sm md:max-w-2xl h-auto object-contain cursor-pointer drop-shadow-[0_8px_16px_rgba(239,68,68,0.3)]"
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
