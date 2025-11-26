
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import noiseTexture from '@assets/generated_images/dark_digital_noise_texture.png';
import heroLogo from '@assets/hero-logo.webp';

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const updateLogoPosition = () => {
      setLogoPosition((prev) => ({
        x: prev.x + (mousePosition.x - prev.x) * 0.15,
        y: prev.y + (mousePosition.y - prev.y) * 0.15,
      }));
      animationFrameRef.current = requestAnimationFrame(updateLogoPosition);
    };

    animationFrameRef.current = requestAnimationFrame(updateLogoPosition);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mousePosition]);

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

      <div className="relative z-10 text-center px-4 flex items-center justify-center pointer-events-none">
        <motion.img
          src={heroLogo}
          alt="Dmitriy Gusev"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          style={{
            position: "fixed",
            left: logoPosition.x,
            top: logoPosition.y,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 9999,
          }}
          className="w-32 md:w-48 h-auto object-contain drop-shadow-[0_8px_16px_rgba(239,68,68,0.3)]"
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
