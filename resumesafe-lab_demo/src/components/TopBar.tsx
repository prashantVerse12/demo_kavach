import React from 'react';

export type AppRoute = '/' | '/builder' | '/preview' | '/records' | '/phase2';

interface TopBarProps {
  currentRoute: AppRoute;
  onNavigate: (path: string) => void;
}

const NAV_ITEMS: Array<{ href: AppRoute; label: string }> = [
  { href: '/', label: 'Home' },
  { href: '/builder', label: 'Builder' },
  { href: '/preview', label: 'Preview' },
  { href: '/records', label: 'Fake Records' },
  { href: '/phase2', label: 'Phase 2 Notes' },
];

export const TopBar: React.FC<TopBarProps> = ({ currentRoute, onNavigate }) => {
  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    onNavigate(href);
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-4">
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, '/')}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
        >
          ResumeSafe Lab
        </a>

        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_ITEMS.map((item) => {
            const isActive = currentRoute === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                aria-current={isActive ? 'page' : undefined}
                className={`whitespace-nowrap shrink-0 py-1 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700 ${
                  isActive
                    ? 'text-teal-800 underline decoration-2 underline-offset-8'
                    : 'text-slate-600 hover:text-slate-900 hover:underline hover:underline-offset-8'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center shrink-0">
          <a
            href="/preview"
            onClick={(e) => handleLinkClick(e, '/preview')}
            className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-teal-800 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            Inspect Preview
          </a>
        </div>
      </div>

      <nav
        aria-label="Mobile navigation"
        className="flex md:hidden items-center gap-4 overflow-x-auto border-t border-slate-100 px-6 py-2.5 text-sm font-medium"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = currentRoute === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item.href)}
              aria-current={isActive ? 'page' : undefined}
              className={`whitespace-nowrap shrink-0 ${
                isActive ? 'text-teal-800 underline underline-offset-4' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </header>
  );
};
