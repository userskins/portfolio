import { Menu, X, ArrowUpRight } from "lucide-react";
import { useState } from "react";

const links = [
  {label:"Проекты",href:"#projects"},
  {label:"Галерея",href:"#gallery"},
  {label:"Опыт",href:"#cv"},
  {label:"Обо мне",href:"#about"},
];

export function Navbar() {
  const [open,setOpen] = useState(false);
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#101115]/90 backdrop-blur-xl">
      <div className="max-w-[1480px] mx-auto px-6 md:px-12 min-h-[76px] flex items-center justify-between gap-6">
        <a href="#top" onClick={()=>setOpen(false)} className="font-display text-lg tracking-[-.09em] font-bold text-white">DG<span className="text-primary">.</span><span className="font-mono text-[10px] tracking-[.05em] ml-3 font-normal text-white/50 hidden sm:inline">PORTFOLIO</span></a>
        <div className="hidden md:flex items-center gap-8">{links.map(l=><a key={l.href} href={l.href} className="text-sm text-white/65 hover:text-primary transition-colors">{l.label}</a>)}</div>
        <a href="#contact" className="hidden md:inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm text-white hover:text-primary hover:border-primary transition-colors">Связаться <ArrowUpRight size={16}/></a>
        <button className="md:hidden p-2 text-white" aria-label={open?"Закрыть меню":"Открыть меню"} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X size={24}/>:<Menu size={24}/>}</button>
      </div>
      {open && <div className="md:hidden border-t border-white/10 bg-[#101115] px-6 py-5 flex flex-col gap-5">{[...links,{label:"Связаться",href:"#contact"}].map(l=><a key={l.href} href={l.href} onClick={()=>setOpen(false)} className="text-lg text-white/80">{l.label}</a>)}</div>}
    </nav>
  );
}
