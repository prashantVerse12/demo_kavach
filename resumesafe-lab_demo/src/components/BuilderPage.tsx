import React, { useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import {
  FAKE_RESUME_RECORDS,
  FAKE_TEMPLATES,
  HARMLESS_MARKER_PRESETS,
  type FakeResumeRecord,
  type RenderMode,
  type TemplateStyle,
} from '../lab/fakeRecords';

interface BuilderPageProps {
  draft: FakeResumeRecord;
  renderMode: RenderMode;
  onUpdateDraft: (nextDraft: FakeResumeRecord, nextMode: RenderMode) => void;
  onNavigate: (path: string) => void;
}

export const BuilderPage: React.FC<BuilderPageProps> = ({
  draft,
  renderMode,
  onUpdateDraft,
  onNavigate,
}) => {
  const [formDraft, setFormDraft] = useState<FakeResumeRecord>(draft);
  const [skillsText, setSkillsText] = useState(draft.skills.join(', '));
  const [mode, setMode] = useState<RenderMode>(renderMode);
  const [endpointOutput, setEndpointOutput] = useState<string | null>(null);
  const [endpointLoading, setEndpointLoading] = useState(false);

  const handleLoadFakeRecord = (recordId: string) => {
    const matched = FAKE_RESUME_RECORDS.find((item) => item.id === recordId);
    if (!matched) return;
    setFormDraft(matched);
    setSkillsText(matched.skills.join(', '));
    onUpdateDraft(matched, mode);
  };

  const handleApplyMarkerPreset = (value: string) => {
    setFormDraft((prev) => ({
      ...prev,
      summary: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedSkills = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updated: FakeResumeRecord = {
      ...formDraft,
      skills: parsedSkills.length > 0 ? parsedSkills : ['Static Analysis'],
    };

    onUpdateDraft(updated, mode);
    onNavigate(`/preview?record=${encodeURIComponent(updated.id)}&mode=${encodeURIComponent(mode)}`);
  };

  const handleReset = () => {
    const baseline = FAKE_RESUME_RECORDS[0];
    setFormDraft(baseline);
    setSkillsText(baseline.skills.join(', '));
    setMode('safe');
    setEndpointOutput(null);
    onUpdateDraft(baseline, 'safe');
  };

  const handleCheckFakeEndpoint = async () => {
    setEndpointLoading(true);
    try {
      const response = await fetch('/api/fake/echo-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordId: formDraft.id, mode }),
      });
      if (!response.ok) {
        throw new Error('Static host fallback');
      }
      const data = await response.json();
      setEndpointOutput(JSON.stringify(data, null, 2));
    } catch {
      setEndpointOutput(
        JSON.stringify(
          {
            stored: false,
            demoOnly: true,
            recordId: formDraft.id,
            mode,
            note: 'Static preview fallback: no user data was saved or sent externally.',
          },
          null,
          2
        )
      );
    } finally {
      setEndpointLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="text-xs font-medium text-slate-500">
            Same-Site Form Surface · In-Memory Only
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Resume Builder</h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Edit synthetic resume fields or insert harmless text markers to compare how the Preview page handles{' '}
            <code className="font-mono text-xs text-slate-800">innerHTML</code> versus{' '}
            <code className="font-mono text-xs text-slate-800">textContent</code>.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Reset Fake Draft</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <form
          action="/preview"
          method="GET"
          onSubmit={handleSubmit}
          className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-6 space-y-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5 text-xs font-medium text-slate-700">
              <span>Load Fake Fixture</span>
              <select
                name="record"
                value={formDraft.id}
                onChange={(e) => handleLoadFakeRecord(e.target.value)}
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
              <span>Preview Render Sink</span>
              <select
                name="mode"
                value={mode}
                onChange={(e) => setMode(e.target.value === 'unsafe' ? 'unsafe' : 'safe')}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-700 focus:outline-none"
              >
                <option value="safe">Safe Fix (textContent)</option>
                <option value="unsafe">Unsafe Demo (innerHTML)</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5 text-xs font-medium text-slate-700">
              <span>Candidate Display Name (Fake)</span>
              <input
                type="text"
                name="fullName"
                value={formDraft.fullName}
                onChange={(e) => setFormDraft({ ...formDraft, fullName: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-teal-700 focus:outline-none"
                required
              />
            </label>

            <label className="block space-y-1.5 text-xs font-medium text-slate-700">
              <span>Target Role</span>
              <input
                type="text"
                name="targetRole"
                value={formDraft.targetRole}
                onChange={(e) => setFormDraft({ ...formDraft, targetRole: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-teal-700 focus:outline-none"
                required
              />
            </label>

            <label className="block space-y-1.5 text-xs font-medium text-slate-700">
              <span>Synthetic Email (.example.invalid)</span>
              <input
                type="email"
                name="email"
                value={formDraft.email}
                onChange={(e) => setFormDraft({ ...formDraft, email: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-teal-700 focus:outline-none"
              />
            </label>

            <label className="block space-y-1.5 text-xs font-medium text-slate-700">
              <span>Layout Template</span>
              <select
                name="template"
                value={formDraft.template}
                onChange={(e) => setFormDraft({ ...formDraft, template: e.target.value as TemplateStyle })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-700 focus:outline-none"
              >
                {FAKE_TEMPLATES.map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="space-y-2">
            <label className="block space-y-1.5 text-xs font-medium text-slate-700">
              <span>Professional Summary (DOM Sink Target Field)</span>
              <textarea
                name="summary"
                rows={4}
                value={formDraft.summary}
                onChange={(e) => setFormDraft({ ...formDraft, summary: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs leading-relaxed text-slate-900 focus:border-teal-700 focus:outline-none"
              />
            </label>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-500 mr-1">Insert harmless preset:</span>
              {HARMLESS_MARKER_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyMarkerPreset(preset.value)}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 whitespace-nowrap shrink-0"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <label className="block space-y-1.5 text-xs font-medium text-slate-700">
            <span>Skills (Comma-separated)</span>
            <input
              type="text"
              name="skills"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-teal-700 focus:outline-none"
            />
          </label>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
            <p className="text-xs text-slate-500">
              Updates in-memory preview state only. No data is stored or transmitted externally.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCheckFakeEndpoint}
                disabled={endpointLoading}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
              >
                {endpointLoading ? 'Checking...' : 'Ping Fake Endpoint'}
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 whitespace-nowrap shrink-0"
              >
                <span>Update Preview</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </form>

        <aside className="lg:col-span-4 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">Harmless Marker Presets</h2>
            <div className="space-y-4 divide-y divide-slate-100">
              {HARMLESS_MARKER_PRESETS.map((preset) => (
                <div key={preset.id} className="pt-3 first:pt-0 space-y-1.5">
                  <div className="text-xs font-semibold text-slate-800">{preset.label}</div>
                  <p className="text-xs leading-relaxed text-slate-600">{preset.description}</p>
                  <code className="block rounded bg-slate-50 p-2 font-mono text-[11px] text-slate-700 break-all">
                    {preset.value}
                  </code>
                </div>
              ))}
            </div>
          </div>

          {endpointOutput && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <div className="text-xs font-semibold text-slate-900">
                Response from /api/fake/echo-preview
              </div>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-xs text-slate-100">
                {endpointOutput}
              </pre>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
