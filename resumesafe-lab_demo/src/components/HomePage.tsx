import React, { useState } from 'react';
import { ArrowRight, Code2, FileText, ShieldCheck } from 'lucide-react';
import { FAKE_RESUME_RECORDS } from '../lab/fakeRecords';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

const ROUTE_INVENTORY = [
  { path: '/', kind: 'Page', purpose: 'Lab overview, same-site link index, and quick lookup form' },
  { path: '/builder', kind: 'Page + Form', purpose: 'In-memory resume editor with harmless marker presets' },
  { path: '/preview', kind: 'Page + DOM Sink', purpose: 'Side-by-side unsafe innerHTML vs safe textContent preview' },
  { path: '/records', kind: 'Page + Data', purpose: 'Synthetic candidate fixtures loaded from fake endpoint' },
  { path: '/phase2', kind: 'Page + Source', purpose: 'Verbatim src/lab/previewRenderer.ts source and audit notes' },
  { path: '/api/fake/status', kind: 'Fake GET JSON', purpose: 'Static lab capability and route manifest response' },
  { path: '/api/fake/resumes', kind: 'Fake GET JSON', purpose: 'Returns 4 synthetic candidate records from memory' },
  { path: '/api/fake/templates', kind: 'Fake GET JSON', purpose: 'Returns 3 fake resume layout template definitions' },
  { path: '/lab-manifest.js', kind: 'Same-Site Script', purpose: 'Declares window.__RESUMESAFE_LAB_MANIFEST__ locally' },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [selectedRecordId, setSelectedRecordId] = useState(FAKE_RESUME_RECORDS[0].id);
  const [selectedMode, setSelectedMode] = useState<'safe' | 'unsafe'>('safe');

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    onNavigate(href);
  };

  const handleQuickLaunch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onNavigate(`/preview?record=${encodeURIComponent(selectedRecordId)}&mode=${encodeURIComponent(selectedMode)}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-16">
      <section className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
              <span>Authorized Training Target</span>
              <span aria-hidden="true">·</span>
              <span>KAVACH Phase 1 &amp; Phase 2</span>
              <span aria-hidden="true">·</span>
              <span>Fake Data Only</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15] [text-wrap:balance]">
              Safe, reproducible resume workbench for site mapping and DOM analysis
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-slate-600">
              ResumeSafe Lab provides deterministic same-site routes, synthetic candidate records, and an isolated{' '}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm text-slate-800">innerHTML</code> versus{' '}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm text-slate-800">textContent</code> comparison.
              All forms stay in browser memory, active script execution is blocked, and zero external requests are made.
            </p>
          </div>

          <form
            action="/preview"
            method="GET"
            onSubmit={handleQuickLaunch}
            className="rounded-xl border border-slate-200 bg-white p-6 space-y-4"
          >
            <div className="text-sm font-semibold text-slate-900">Quick Preview Launcher</div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block space-y-1.5 text-xs font-medium text-slate-700">
                <span>Fake Candidate Record</span>
                <select
                  name="record"
                  value={selectedRecordId}
                  onChange={(e) => setSelectedRecordId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-700 focus:outline-none"
                >
                  {FAKE_RESUME_RECORDS.map((rec) => (
                    <option key={rec.id} value={rec.id}>
                      {rec.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-1.5 text-xs font-medium text-slate-700">
                <span>DOM Rendering Mode</span>
                <select
                  name="mode"
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value === 'unsafe' ? 'unsafe' : 'safe')}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-700 focus:outline-none"
                >
                  <option value="safe">Safe (textContent)</option>
                  <option value="unsafe">Unsafe Demo (innerHTML)</option>
                </select>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-800 whitespace-nowrap shrink-0"
              >
                <span>Open Preview</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <a
                href="/builder"
                onClick={(e) => handleLinkClick(e, '/builder')}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
              >
                Edit in Builder
              </a>
            </div>
          </form>
        </div>

        <aside className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-slate-900">Training Boundary &amp; Safeguards</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              Built specifically for researcher walkthroughs and automated Phase 1 / Phase 2 evaluation without live
              infrastructure risk.
            </p>

            <dl className="divide-y divide-slate-100 border-t border-b border-slate-100 text-sm">
              <div className="flex items-center justify-between py-3">
                <dt className="text-slate-600">External network calls</dt>
                <dd className="font-mono font-medium text-slate-900 tabular-nums">0 (Same-origin only)</dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-slate-600">Persistent database writes</dt>
                <dd className="font-mono font-medium text-slate-900 tabular-nums">None (In-memory)</dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-slate-600">Fake candidate fixtures</dt>
                <dd className="font-mono font-medium text-slate-900 tabular-nums">4 Synthetic records</dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-slate-600">Script execution policy</dt>
                <dd className="font-mono font-medium text-slate-900">Blocked by harness</dd>
              </div>
            </dl>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2 text-sm">
            <a
              href="/phase2"
              onClick={(e) => handleLinkClick(e, '/phase2')}
              className="inline-flex items-center gap-1.5 font-medium text-teal-800 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              <Code2 className="h-4 w-4" aria-hidden="true" />
              <span>View Phase 2 Source</span>
            </a>

            <a
              href="/records"
              onClick={(e) => handleLinkClick(e, '/records')}
              className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              <span>Browse Fake Records</span>
            </a>
          </div>
        </aside>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">01. Same-Site Mapping Surface (Phase 1)</h2>
            <p className="text-sm text-slate-600">
              All pages, forms, same-site scripts, and read-only fake endpoints exposed under this origin.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 tabular-nums">9 mapped targets</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Surface Type</th>
                <th className="px-4 py-3">Role in Demo</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ROUTE_INVENTORY.map((item) => {
                const isPageRoute = item.kind.startsWith('Page');
                return (
                  <tr key={item.path} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-900 whitespace-nowrap">{item.path}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{item.kind}</td>
                    <td className="px-4 py-3 text-slate-700">{item.purpose}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {isPageRoute ? (
                        <a
                          href={item.path}
                          onClick={(e) => handleLinkClick(e, item.path)}
                          className="text-xs font-medium text-teal-800 hover:underline underline-offset-4"
                        >
                          Open Page
                        </a>
                      ) : (
                        <a
                          href={item.path}
                          className="text-xs font-medium text-slate-700 hover:text-slate-900 hover:underline underline-offset-4"
                        >
                          Inspect JSON/JS
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">02. Unsafe Rendering Pattern</h3>
            <span className="text-xs font-mono font-medium text-amber-800">innerHTML sink</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            In <code className="font-mono text-xs text-slate-800">renderBioUnsafe</code>, the candidate summary string is
            assigned to <code className="font-mono text-xs text-slate-800">container.innerHTML</code>. Harmless formatting
            tags such as <code className="font-mono text-xs text-slate-800">&lt;mark&gt;</code> are parsed into DOM
            elements, while executable script vectors remain blocked.
          </p>
          <div className="pt-2">
            <a
              href="/preview?record=fake-02&mode=unsafe"
              onClick={(e) => handleLinkClick(e, '/preview?record=fake-02&mode=unsafe')}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-800 hover:underline underline-offset-4"
            >
              <span>Inspect Unsafe Marker Output</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">03. Safe Fixed Pattern</h3>
            <span className="inline-flex items-center gap-1 text-xs font-mono font-medium text-emerald-800">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              textContent sink
            </span>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            In <code className="font-mono text-xs text-slate-800">renderBioSafe</code>, the exact same input string is
            assigned to <code className="font-mono text-xs text-slate-800">container.textContent</code>. Every character,
            including angle brackets, renders strictly as literal text with zero child DOM nodes created.
          </p>
          <div className="pt-2">
            <a
              href="/preview?record=fake-02&mode=safe"
              onClick={(e) => handleLinkClick(e, '/preview?record=fake-02&mode=safe')}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-800 hover:underline underline-offset-4"
            >
              <span>Inspect Safe textContent Output</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
