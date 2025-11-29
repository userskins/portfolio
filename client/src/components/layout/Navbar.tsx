
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from '@assets/logo.webp';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = ['CV', 'GALLERY', 'PROJECTS', 'ABOUT', 'CONTACT'];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-background/80 backdrop-blur-sm border-b border-white/10">
      {/* Desktop Logo */}
      <a 
        href="https://userskins.art"
        target="_blank"
        rel="noreferrer"
        className="hidden md:block hover:scale-105 transition-transform"
      >
        <img src={logo} alt="Logo" className="h-10 w-auto object-contain" />
      </a>

      {/* Mobile Est. Text */}
      <div className="md:hidden font-mono text-xs text-primary">
        [EST. 2020]
      </div>

      <div className="hidden md:flex gap-12 font-mono text-sm tracking-widest text-white">
        {navItems.map((item) => (
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

      {/* Desktop Est. Text */}
      <div className="hidden md:block font-mono text-xs text-primary">
        [EST. 2020]
      </div>

      {/* Mobile Menu Button */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden text-white hover:text-primary transition-colors"
        data-testid="button-mobile-menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-sm border-b border-white/10 md:hidden">
          <div className="flex flex-col gap-4 p-6 font-mono text-sm tracking-widest text-white">
            {navItems.map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-primary transition-colors"
                data-testid={`link-mobile-${item.toLowerCase()}`}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
