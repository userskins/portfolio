
import { Link } from "wouter";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center mix-blend-difference text-white">
      <Link href="/">
        <a className="font-display font-bold text-2xl tracking-tighter hover:text-primary transition-colors">
          NOISE_LAB
        </a>
      </Link>

      <div className="hidden md:flex gap-12 font-mono text-sm tracking-widest">
        {['WORK', 'ABOUT', 'CONTACT'].map((item) => (
          <a 
            key={item} 
            href={`#${item.toLowerCase()}`}
            className="relative group overflow-hidden"
          >
            <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
              {item}
            </span>
            <span className="absolute top-0 left-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-primary">
              {item}
            </span>
          </a>
        ))}
      </div>

      <div className="font-mono text-xs opacity-50">
        [SYS.READY]
      </div>
    </nav>
  );
}
