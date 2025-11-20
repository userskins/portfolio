
import { Link } from "wouter";
import logo from '@assets/тэг_1763676137900.png';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-background/80 backdrop-blur-sm border-b border-white/10">
      <Link href="/">
        <a className="block hover:scale-105 transition-transform">
          <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
        </a>
      </Link>

      <div className="hidden md:flex gap-12 font-mono text-sm tracking-widest text-white">
        {['CV', 'GALLERY', 'ABOUT', 'CONTACT'].map((item) => (
          <a 
            key={item} 
            href={`#${item.toLowerCase()}`}
            className="relative group overflow-hidden hover:text-primary transition-colors"
          >
            <span className="inline-block">
              {item}
            </span>
          </a>
        ))}
      </div>

      <div className="font-mono text-xs text-primary">
        [EST. 2020]
      </div>
    </nav>
  );
}
