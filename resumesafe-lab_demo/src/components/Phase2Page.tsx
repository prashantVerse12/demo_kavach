import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import previewRendererSource from '../lab/previewRenderer.ts?raw';
import { PHASE_2_ANALYSIS_NOTES } from '../lab/phase2Notes';

interface Phase2PageProps {
  onNavigate: (path: string) => void;
}

export const Phase2Page: React.FC<Phase2PageProps> = ({ onNavigate }) => {
  const [copied, setCopied] = useState(false);

  const handleCopySource = async () => {
    try {
      await navigator.clipboard.writeText(previewRendererSource);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const lines = previewRendererSource.trimEnd().split('\n');

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="text-xs font-medium text-slate-500">
            KAVACH Phase 2 · Static &amp; Source Analysis Reference
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Phase 2 Source &amp; Analysis Notes</h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Provide <code className="font-mono text-xs text-slate-800">src/lab/previewRenderer.ts</code> and the notes
            below to KAVACH Phase 2 for code-level inspection.
          </p>
        </div>

        <a
          href="/preview?record=fake-02&mode=unsafe"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/preview?record=fake-02&mode=unsafe');
          }}
          className="rounded-lg bg-teal-700 px-4 py-2 text-xs font-medium text-white hover:bg-teal-800 whitespace-nowrap shrink-0"
        >
          Test Live Sink in Preview
        </a>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Source File: src/lab/previewRenderer.ts</h2>
            <p className="text-xs text-slate-500">
              {lines.length} lines · Contains both <code className="font-mono">renderBioUnsafe</code> and{' '}
              <code className="font-mono">renderBioSafe</code>
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopySource}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                <span>Copied Source</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Copy Source</span>
              </>
            )}
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-950 text-slate-100">
          <table className="w-full border-collapse font-mono text-xs leading-6">
            <tbody>
              {lines.map((lineText, index) => (
                <tr key={index} className="hover:bg-slate-900/70">
                  <td className="select-none border-r border-slate-800 px-3 py-0.5 text-right text-slate-500 tabular-nums w-12">
                    {index + 1}
                  </td>
                  <td className="px-4 py-0.5 whitespace-pre">{lineText || ' '}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {PHASE_2_ANALYSIS_NOTES.map((section) => (
          <div key={section.id} className="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
            <h3 className="text-base font-semibold text-slate-900">{section.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{section.summary}</p>
            <ul className="space-y-2 border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-700 list-disc pl-4">
              {section.details.map((detail, idx) => (
                <li key={idx}>{detail}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
};
