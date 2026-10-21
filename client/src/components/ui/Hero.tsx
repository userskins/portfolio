import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Asterisk } from "lucide-react";
import heroLogo from "@assets/hero-logo.webp";

export function Hero() {
  return (
    <section id="top" className="relative min-h-[92svh] overflow-hidden bg-background flex items-center px-6 md:px-12 pt-28 pb-20">
      <div className="absolute inset-0 pointer-events-none opacity-[.16]" style={{backgroundImage:"linear-gradient(to right, rgba(255,255,255,.13) 1px, transparent 1px)", backgroundSize:"calc(100% / 6) 100%"}} />
      <div className="absolute -right-24 top-16 size-[35rem] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="flex justify-between items-center border-b border-white/20 pb-5 mb-14 md:mb-20 font-mono text-[11px] uppercase tracking-[.16em] text-white/60">
          <span>Independent creative portfolio / 2026</span>
          <span className="hidden sm:block">Design × Digital × Motion</span>
        </div>
        <div className="grid lg:grid-cols-[1fr_.48fr] gap-14 lg:gap-8 items-center">
          <div>
            <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.55}} className="text-primary font-mono text-xs tracking-[.3em] uppercase mb-7 flex items-center gap-2"><Asterisk size={15}/> Дизайнер цифровых коммуникаций</motion.p>
            <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.75,delay:.08}} className="font-display text-[clamp(3.1rem,8vw,7.6rem)] leading-[.99] tracking-[-.08em] font-semibold text-white">
              ДМИТРИЙ<br/><span className="text-primary">ГУСЕВ</span><span className="text-primary">.</span>
            </motion.h1>
            <motion.p initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.65,delay:.2}} className="mt-9 text-white/65 text-base md:text-xl max-w-[35rem] leading-relaxed">Создаю выразительный дизайн для брендов и цифровых продуктов. Визуальные системы, сайты, CRM-коммуникации и эксперименты с формой.</motion.p>
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6,delay:.3}} className="flex flex-wrap gap-3 mt-10">
              <a href="#projects" className="inline-flex items-center gap-4 rounded-full bg-primary text-background font-semibold text-sm px-7 py-4 hover:bg-white transition-colors">Смотреть проекты <ArrowUpRight size={18}/></a>
              <a href="#contact" className="inline-flex items-center gap-4 rounded-full border border-white/25 text-white text-sm px-7 py-4 hover:border-primary hover:text-primary transition-colors">Обсудить проект <ArrowUpRight size={18}/></a>
            </motion.div>
          </div>
          <motion.div initial={{opacity:0,scale:.93,rotate:4}} animate={{opacity:1,scale:1,rotate:-3}} transition={{duration:1,delay:.2}} className="relative hidden lg:flex items-center justify-center aspect-square rounded-[2rem] border border-white/15 bg-[radial-gradient(circle_at_30%_30%,rgba(251,139,110,.19),transparent_65%)]">
            <div className="absolute inset-6 border border-dashed border-white/15 rounded-[1.3rem]"/>
            <img src={heroLogo} alt="Фирменный знак Дмитрия Гусева" className="relative z-10 w-4/5 h-4/5 object-contain drop-shadow-[0_10px_28px_rgba(0,0,0,.45)]" />
            <span className="absolute bottom-8 left-8 text-[11px] tracking-wider text-white/50 font-mono">FIG. 01 / VISUAL IDENTITY</span>
          </motion.div>
        </div>
        <div className="mt-20 md:mt-28 flex justify-between items-end border-t border-white/15 pt-5">
          <span className="font-mono text-[11px] tracking-[.14em] uppercase text-white/45">Scroll to explore</span>
          <a href="#projects" aria-label="Перейти к проектам" className="rounded-full border border-white/25 p-3 text-white hover:text-primary hover:border-primary transition-colors"><ArrowDownRight size={20}/></a>
        </div>
      </div>
    </section>
  );
}
