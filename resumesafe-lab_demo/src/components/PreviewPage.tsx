import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import {
  FAKE_RESUME_RECORDS,
  HARMLESS_MARKER_PRESETS,
  type FakeResumeRecord,
  type RenderMode,
} from '../lab/fakeRecords';
import { renderBioSafe, renderBioUnsafe } from '../lab/previewRenderer';

interface PreviewPageProps {
  draft: FakeResumeRecord;
  renderMode: RenderMode;
  onChangeMode: (nextMode: RenderMode) => void;
  onSelectRecord: (record: FakeResumeRecord) => void;
  onUpdateSummary: (nextSummary: string) => void;
  onNavigate: (path: string) => void;
}

interface DomSnapshot {
  sinkName: string;
  observedInnerHtml: string;
  observedTextContent: string;
  childElementCount: number;
}

export const PreviewPage: React.FC<PreviewPageProps> = ({
  draft,
  renderMode,
  onChangeMode,
  onSelectRecord,
  onUpdateSummary,
  onNavigate,
}) => {
  const bioContainerRef = useRef<HTMLDivElement | null>(null);
  const [domSnapshot, setDomSnapshot] = useState<DomSnapshot>({
    sinkName: renderMode === 'unsafe' ? 'renderBioUnsafe (innerHTML)' : 'renderBioSafe (textContent)',
    observedInnerHtml: '',
    observedTextContent: '',
    childElementCount: 0,
  });

  useEffect(() => {
    const container = bioContainerRef.current;
    if (!container) return;

    if (renderMode === 'unsafe') {
      renderBioUnsafe(container, draft.summary);
    } else {
      renderBioSafe(container, draft.summary);
    }

    setDomSnapshot({
      sinkName: renderMode === 'unsafe' ? 'renderBioUnsafe (innerHTML)' : 'renderBioSafe (textContent)',
      observedInnerHtml: container.innerHTML,
      observedTextContent: container.textContent ?? '',
      childElementCount: container.children.length,
    });
  }, [draft.summary, renderMode]);

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    onNavigate(href);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="text-xs font-medium text-slate-500">
            DOM Sink Comparison · Harmless Marker Demonstration
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Resume Preview</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div role="group" aria-label="Rendering sink mode" className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => onChangeMode('safe')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                renderMode === 'safe'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Safe (textContent)
            </button>
            <button
              type="button"
              onClick={() => onChangeMode('unsafe')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                renderMode === 'unsafe'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unsafe Demo (innerHTML)
            </button>
          </div>

          <a
            href="/builder"
            onClick={(e) => handleLinkClick(e, '/builder')}
            className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
          >
            Edit in Builder
          </a>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-xs">
        <div className="flex items-center gap-2">
          {renderMode === 'unsafe' ? (
            <>
              <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0" aria-hidden="true" />
              <span className="font-semibold text-amber-900">Unsafe Demo Mode Active:</span>
              <span className="text-slate-600">
                Calls <code className="font-mono text-slate-800">renderBioUnsafe</code> (
                <code className="font-mono text-slate-800">innerHTML</code>). Harmless HTML tags parse into DOM nodes;
                active scripts remain blocked.
              </span>
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" aria-hidden="true" />
              <span className="font-semibold text-emerald-900">Safe Fixed Mode Active:</span>
              <span className="text-slate-600">
                Calls <code className="font-mono text-slate-800">renderBioSafe</code> (
                <code className="font-mono text-slate-800">textContent</code>). All markup renders strictly as plain
                text characters.
              </span>
            </>
          )}
        </div>

        <a
          href="/phase2"
          onClick={(e) => handleLinkClick(e, '/phase2')}
          className="font-medium text-teal-800 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
        >
          Inspect Source File
        </a>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <article className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-8 space-y-7">
          <header
            className={`border-b border-slate-200 pb-6 space-y-2 ${
              draft.template === 'technical-brief' ? 'font-mono' : ''
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span>Synthetic Resume Document</span>
              <span className="font-mono">{draft.template}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">{draft.fullName}</h2>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span className="font-medium text-slate-800">{draft.targetRole}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-xs">{draft.email}</span>
              <span aria-hidden="true">·</span>
              <span>{draft.location}</span>
            </div>
          </header>

          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold tracking-wide text-slate-500">
                Professional Summary (Target DOM Container)
              </h3>
              <span className="font-mono text-[11px] text-slate-500">{domSnapshot.sinkName}</span>
            </div>

            <div
              ref={bioContainerRef}
              data-testid="resume-bio-sink"
              className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 text-sm leading-relaxed text-slate-800"
            />
          </section>

          <div className={draft.template === 'compact-grid' ? 'grid grid-cols-1 gap-6 sm:grid-cols-2' : 'space-y-7'}>
            <section className="space-y-2.5">
              <h3 className="text-xs font-semibold tracking-wide text-slate-500">Core Skills</h3>
              <p className="text-sm text-slate-700">{draft.skills.join(' · ')}</p>
            </section>

            <section className="space-y-3">
              <h3 className="text-xs font-semibold tracking-wide text-slate-500">Synthetic Experience</h3>
              <div className="divide-y divide-slate-100">
                {draft.experience.map((exp, idx) => (
                  <div key={`${exp.role}-${idx}`} className="py-3 first:pt-0 last:pb-0 space-y-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-900">{exp.role}</span>
                      <span className="font-mono text-xs text-slate-500 tabular-nums">{exp.period}</span>
                    </div>
                    <div className="text-xs font-medium text-slate-600">{exp.organization}</div>
                    <p className="text-sm text-slate-700">{exp.highlight}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </article>

        <aside className="lg:col-span-5 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">DOM Inspection Readout</h2>
              <span className="font-mono text-xs text-slate-600 tabular-nums">
                Child nodes: {domSnapshot.childElementCount}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="font-medium text-slate-600">Observed container.innerHTML</div>
                <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] text-slate-800 whitespace-pre-wrap break-all">
                  {domSnapshot.observedInnerHtml}
                </pre>
              </div>

              <div className="space-y-1">
                <div className="font-medium text-slate-600">Observed container.textContent</div>
                <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] text-slate-800 whitespace-pre-wrap break-all">
                  {domSnapshot.observedTextContent}
                </pre>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-500">
              When <code className="font-mono text-slate-700">Child nodes &gt; 0</code> in Unsafe Demo mode, harmless
              markup tags were parsed as HTML elements. In Safe mode,{' '}
              <code className="font-mono text-slate-700">Child nodes</code> remains{' '}
              <code className="font-mono text-slate-700 tabular-nums">0</code> because{' '}
              <code className="font-mono text-slate-700">textContent</code> escapes everything as text.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">Quick Marker Switcher</h2>
            <div className="flex flex-col gap-2">
              {HARMLESS_MARKER_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onUpdateSummary(preset.value)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-medium text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">Switch Fake Record</h2>
            <div className="flex flex-col gap-2 text-xs">
              {FAKE_RESUME_RECORDS.map((rec) => (
                <a
                  key={rec.id}
                  href={`/preview?record=${encodeURIComponent(rec.id)}&mode=${encodeURIComponent(renderMode)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectRecord(rec);
                    onNavigate(`/preview?record=${encodeURIComponent(rec.id)}&mode=${encodeURIComponent(renderMode)}`);
                  }}
                  className={`rounded-lg border px-3 py-2 font-medium transition-colors ${
                    draft.id === rec.id
                      ? 'border-teal-700 bg-teal-50/50 text-teal-900'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {rec.label}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
