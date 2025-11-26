import logo from "@assets/logo.webp";

export function Footer() {
  return (
    <footer className="bg-card relative overflow-hidden border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 relative z-0">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12">
          <div className="w-full md:w-auto">
            <h4 className="font-display text-5xl text-white mb-8 uppercase tracking-tighter">
              Let's Connect
            </h4>
            <ul className="space-y-4 text-2xl md:text-3xl">
              <li>
                <a
                  href="mailto:userskins@gmail.com"
                  style={{ fontFamily: 'Comic Relief, cursive' }}
                  className="hover:text-primary hover:pl-4 transition-all cursor-pointer flex items-center gap-4 group font-bold"
                  data-testid="link-email"
                >
                  <span className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Email
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/userskins"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontFamily: 'Comic Relief, cursive' }}
                  className="hover:text-primary hover:pl-4 transition-all cursor-pointer flex items-center gap-4 group font-bold"
                  data-testid="link-telegram"
                >
                  <span className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Telegram
                </a>
              </li>
              <li>
                <a
                  href="https://vk.com/userskins"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontFamily: 'Comic Relief, cursive' }}
                  className="hover:text-primary hover:pl-4 transition-all cursor-pointer flex items-center gap-4 group font-bold"
                  data-testid="link-vk"
                >
                  <span className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  VK
                </a>
              </li>
            </ul>
          </div>

          <div className="flex-1 flex justify-center md:justify-end">
            <img
              src={logo}
              alt="Logo"
              className="w-64 md:w-96 h-auto object-contain opacity-80 hover:opacity-100 transition-opacity transform rotate-3"
            />
          </div>
        </div>
      </div>

      {/* Large Background Text */}
      <div className="absolute -bottom-20 -right-20 pointer-events-none opacity-5 select-none">
        <span className="font-display text-[20rem] font-bold leading-none text-white">
          ME
        </span>
      </div>
    </footer>
  );
}
