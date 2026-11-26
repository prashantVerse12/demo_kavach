import React, { useEffect, useState } from 'react';
import { FAKE_RESUME_RECORDS, type FakeResumeRecord } from '../lab/fakeRecords';

interface RecordsPageProps {
  onSelectRecord: (record: FakeResumeRecord) => void;
  onNavigate: (path: string) => void;
}

export const RecordsPage: React.FC<RecordsPageProps> = ({ onSelectRecord, onNavigate }) => {
  const [records, setRecords] = useState<FakeResumeRecord[]>(FAKE_RESUME_RECORDS);
  const [loading, setLoading] = useState(true);
  const [rawJson, setRawJson] = useState<string | null>(null);
  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/fake/resumes')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load fake endpoint');
        return res.json();
      })
      .then((payload) => {
        if (!active) return;
        if (Array.isArray(payload.records)) {
          setRecords(payload.records);
        }
        setRawJson(JSON.stringify(payload, null, 2));
      })
      .catch(() => {
        if (!active) return;
        setRecords(FAKE_RESUME_RECORDS);
        setRawJson(JSON.stringify({ demoOnly: true, records: FAKE_RESUME_RECORDS }, null, 2));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleOpenIn = (
    event: React.MouseEvent<HTMLAnchorElement>,
    record: FakeResumeRecord,
    targetPath: string
  ) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    onSelectRecord(record);
    onNavigate(targetPath);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="text-xs font-medium text-slate-500">
            Same-Origin Fixture Feed · GET /api/fake/resumes
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Fake Candidate Records</h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Synthetic profiles provided strictly for KAVACH Phase 1 route discovery and Phase 2 DOM marker testing. Zero
            real personal information is included.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowJson((prev) => !prev)}
          className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
        >
          {showJson ? 'Hide Endpoint JSON' : 'Show Endpoint JSON'}
        </button>
      </div>

      {showJson && rawJson && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-mono">/api/fake/resumes</span>
            <span>Read-only synthetic payload</span>
          </div>
          <pre className="max-h-72 overflow-auto rounded-lg bg-slate-900 p-4 font-mono text-xs text-slate-100">
            {rawJson}
          </pre>
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
          Loading synthetic records from /api/fake/resumes...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
                <th className="px-4 py-3">Record ID</th>
                <th className="px-4 py-3">Fake Candidate</th>
                <th className="px-4 py-3">Role &amp; Template</th>
                <th className="px-4 py-3">Summary Fixture</th>
                <th className="px-4 py-3 text-right">Same-Site Links</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors align-top">
                  <td className="px-4 py-4 font-mono text-xs text-slate-700 whitespace-nowrap">{rec.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-900">{rec.fullName}</div>
                    <div className="font-mono text-xs text-slate-500">{rec.email}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-slate-800">{rec.targetRole}</div>
                    <div className="font-mono text-xs text-slate-500">{rec.template}</div>
                  </td>
                  <td className="px-4 py-4 max-w-md font-mono text-xs text-slate-700 break-words">{rec.summary}</td>
                  <td className="px-4 py-4 text-right whitespace-nowrap space-x-4">
                    <a
                      href={`/builder?record=${encodeURIComponent(rec.id)}`}
                      onClick={(e) => handleOpenIn(e, rec, `/builder?record=${encodeURIComponent(rec.id)}`)}
                      className="text-xs font-medium text-slate-700 hover:text-slate-900 hover:underline underline-offset-4"
                    >
                      Builder
                    </a>
                    <a
                      href={`/preview?record=${encodeURIComponent(rec.id)}&mode=unsafe`}
                      onClick={(e) =>
                        handleOpenIn(e, rec, `/preview?record=${encodeURIComponent(rec.id)}&mode=unsafe`)
                      }
                      className="text-xs font-medium text-teal-800 hover:underline underline-offset-4"
                    >
                      Preview Unsafe
                    </a>
                    <a
                      href={`/preview?record=${encodeURIComponent(rec.id)}&mode=safe`}
                      onClick={(e) => handleOpenIn(e, rec, `/preview?record=${encodeURIComponent(rec.id)}&mode=safe`)}
                      className="text-xs font-medium text-emerald-800 hover:underline underline-offset-4"
                    >
                      Preview Safe
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
