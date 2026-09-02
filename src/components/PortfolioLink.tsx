export function PortfolioLink() {
  return (
    <a
      href="https://hema-sai.netlify.app/"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative inline-flex items-center gap-2 font-display font-semibold text-xs text-ink bg-gradient-to-r from-gold via-cream to-gold shine rounded-full pl-4 pr-3 py-1.5 shadow-lg shadow-gold/30 hover:scale-105 active:scale-95 transition-transform duration-200"
    >
      <span>Portfolio</span>
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-ink text-gold text-[10px]">
        👀
      </span>
      <span className="pointer-events-none absolute -top-2.5 -right-2 bg-accent text-cream text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md peek">
        take a look
      </span>
    </a>
  );
}
