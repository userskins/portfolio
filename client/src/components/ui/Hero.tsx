
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/lib/translations";

export function Hero() {
  const { language } = useLanguage();
  
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-gradient-to-br from-background via-background to-[#0f0805] z-0 pt-20">
      {/* Gradient orbs background */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none opacity-30" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none opacity-20" />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '4rem 4rem'
        }} />
      </div>

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <span className="inline-block font-mono text-xs md:text-sm tracking-[0.3em] text-primary/80 uppercase">
            ✨ {t('hero.greeting', language)}
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
          className="font-display text-7xl md:text-8xl lg:text-9xl font-bold text-foreground leading-[1.1] mb-6 md:mb-8"
        >
          {t('hero.firstName', language)}
          <br />
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t('hero.lastName', language)}
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 font-mono text-xs md:text-sm text-white/70 mb-12"
        >
          <span className="relative overflow-hidden group">
            <span className="relative">
              <span className="text-primary">■</span> GRAPHIC_DESIGN
            </span>
            <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-primary to-transparent group-hover:w-full transition-all duration-500" />
          </span>
          <span className="relative overflow-hidden group">
            <span className="relative">
              <span className="text-primary">■</span> EMAIL_DESIGN
            </span>
            <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-primary to-transparent group-hover:w-full transition-all duration-500" />
          </span>
          <span className="relative overflow-hidden group">
            <span className="relative">
              <span className="text-primary">■</span> CREATIVE_DEV
            </span>
            <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-primary to-transparent group-hover:w-full transition-all duration-500" />
          </span>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
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
    </section>
  );
}
