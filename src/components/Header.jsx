
export default function Header({ theme, toggleTheme }) {
  return (
    <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 transition-colors duration-200 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-3">
        {/* Premium Markdown Logo */}
        <svg viewBox="0 0 32 32" className="h-9 w-9 shrink-0 filter drop-shadow-[0_2px_8px_rgba(139,92,246,0.3)] dark:drop-shadow-[0_2px_8px_rgba(139,92,246,0.15)]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          <rect x="1" y="1" width="30" height="30" rx="8" fill="url(#logoGrad)" />
          <path
            d="M8 21V11l3.5 3.5L15 11v10"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 13v5M23 15.5L20 18.5L17 15.5"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div>
          <span className="bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-xl font-bold tracking-tight text-transparent dark:from-white dark:to-zinc-300">
            MarkView
          </span>
          <span className="ml-2 rounded-md bg-brand-50 px-1.5 py-0.5 text-xs font-semibold text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
            Viewer
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Accessibility-friendly Theme Toggle */}
        <button
          onClick={toggleTheme}
          type="button"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="group relative flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white"
        >
          {theme === 'dark' ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 rotate-0 transition-transform duration-300 group-hover:scale-110"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 rotate-0 transition-transform duration-300 group-hover:scale-110"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
