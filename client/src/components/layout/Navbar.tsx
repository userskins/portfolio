
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from '@assets/тэг_1763676137900.png';
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/lib/translations";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  const navItems = [
    { key: 'cv', label: t('nav.cv', language) },
    { key: 'gallery', label: t('nav.gallery', language) },
    { key: 'projects', label: t('nav.projects', language) },
    { key: 'about', label: t('nav.about', language) },
    { key: 'contact', label: t('nav.contact', language) },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-background/80 backdrop-blur-sm border-b border-white/10">
      <a 
        href="https://userskins.art"
        target="_blank"
        rel="noreferrer"
        className="block hover:scale-105 transition-transform"
      >
        <img src={logo} alt="Logo" className="h-10 w-auto object-contain" />
      </a>

      <div className="hidden md:flex gap-12 font-mono text-sm tracking-widest text-white">
        {navItems.map((item) => (
          <a 
            key={item.key} 
            href={`#${item.key.toLowerCase()}`}
            className="relative group overflow-hidden hover:text-primary transition-colors"
          >
            <span className="inline-block">
              {item.label}
            </span>
          </a>
        ))}
      </div>

      <div className="hidden md:flex gap-4 items-center">
        <div className="font-mono text-xs text-primary">
          {t('nav.established', language)}
        </div>
        <div className="border-l border-white/20 pl-4">
          <div className="flex gap-2">
            <button
              onClick={() => setLanguage('en')}
              className={`font-mono text-xs px-2 py-1 rounded transition-colors ${
                language === 'en' 
                  ? 'bg-primary text-white' 
                  : 'text-white/60 hover:text-white'
              }`}
              data-testid="button-lang-en"
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ru')}
              className={`font-mono text-xs px-2 py-1 rounded transition-colors ${
                language === 'ru' 
                  ? 'bg-primary text-white' 
                  : 'text-white/60 hover:text-white'
              }`}
              data-testid="button-lang-ru"
            >
              РУ
            </button>
          </div>
        </div>
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
                key={item.key}
                href={`#${item.key.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-primary transition-colors"
                data-testid={`link-mobile-${item.key.toLowerCase()}`}
              >
                {item.label}
              </a>
            ))}
            <div className="border-t border-white/10 pt-4 mt-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setLanguage('en')}
                  className={`font-mono text-xs px-3 py-2 rounded transition-colors flex-1 ${
                    language === 'en' 
                      ? 'bg-primary text-white' 
                      : 'text-white/60 hover:text-white'
                  }`}
                  data-testid="button-lang-en-mobile"
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('ru')}
                  className={`font-mono text-xs px-3 py-2 rounded transition-colors flex-1 ${
                    language === 'ru' 
                      ? 'bg-primary text-white' 
                      : 'text-white/60 hover:text-white'
                  }`}
                  data-testid="button-lang-ru-mobile"
                >
                  РУ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
