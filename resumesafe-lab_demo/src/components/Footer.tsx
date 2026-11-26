import React from 'react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    onNavigate(href);
  };

  return (
    <footer className="border-t border-slate-200 bg-white mt-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-slate-700">ResumeSafe Lab</span>
          <span aria-hidden="true">·</span>
          <span>Authorized KAVACH training target</span>
          <span aria-hidden="true">·</span>
          <span>Fake records only, no external connections</span>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Home
          </a>
          <a
            href="/builder"
            onClick={(e) => handleLinkClick(e, '/builder')}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Builder
          </a>
          <a
            href="/preview"
            onClick={(e) => handleLinkClick(e, '/preview')}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Preview
          </a>
          <a
            href="/records"
            onClick={(e) => handleLinkClick(e, '/records')}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Fake Records
          </a>
          <a
            href="/phase2"
            onClick={(e) => handleLinkClick(e, '/phase2')}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Phase 2 Notes
          </a>
        </div>
      </div>
    </footer>
  );
};
