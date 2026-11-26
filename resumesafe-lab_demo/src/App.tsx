import { useCallback, useEffect, useState } from 'react';
import { BuilderPage } from './components/BuilderPage';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { Phase2Page } from './components/Phase2Page';
import { PreviewPage } from './components/PreviewPage';
import { RecordsPage } from './components/RecordsPage';
import { TopBar, type AppRoute } from './components/TopBar';
import { FAKE_RESUME_RECORDS, type FakeResumeRecord, type RenderMode } from './lab/fakeRecords';

function normalizeRoute(pathname: string): AppRoute {
  if (pathname === '/builder') return '/builder';
  if (pathname === '/preview') return '/preview';
  if (pathname === '/records') return '/records';
  if (pathname === '/phase2') return '/phase2';
  return '/';
}

function readParamsFromLocation(): {
  route: AppRoute;
  recordId: string | null;
  mode: RenderMode | null;
} {
  const url = new URL(window.location.href);
  const route = normalizeRoute(url.pathname);
  const recordId = url.searchParams.get('record');
  const rawMode = url.searchParams.get('mode');
  const mode: RenderMode | null = rawMode === 'unsafe' ? 'unsafe' : rawMode === 'safe' ? 'safe' : null;
  return { route, recordId, mode };
}

export default function App() {
  const initial = readParamsFromLocation();
  const initialRecord =
    FAKE_RESUME_RECORDS.find((item) => item.id === initial.recordId) ?? FAKE_RESUME_RECORDS[0];

  const [route, setRoute] = useState<AppRoute>(initial.route);
  const [draft, setDraft] = useState<FakeResumeRecord>(initialRecord);
  const [renderMode, setRenderMode] = useState<RenderMode>(initial.mode ?? 'safe');

  const syncFromLocation = useCallback(() => {
    const parsed = readParamsFromLocation();
    setRoute(parsed.route);
    if (parsed.recordId) {
      const matched = FAKE_RESUME_RECORDS.find((item) => item.id === parsed.recordId);
      if (matched) {
        setDraft(matched);
      }
    }
    if (parsed.mode) {
      setRenderMode(parsed.mode);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('popstate', syncFromLocation);
    return () => window.removeEventListener('popstate', syncFromLocation);
  }, [syncFromLocation]);

  const navigate = useCallback((targetPath: string) => {
    const targetUrl = new URL(targetPath, window.location.origin);
    if (targetUrl.origin !== window.location.origin) {
      return;
    }
    window.history.pushState({}, '', targetUrl.pathname + targetUrl.search);
    const nextRoute = normalizeRoute(targetUrl.pathname);
    setRoute(nextRoute);

    const recordParam = targetUrl.searchParams.get('record');
    if (recordParam) {
      const matched = FAKE_RESUME_RECORDS.find((item) => item.id === recordParam);
      if (matched) {
        setDraft(matched);
      }
    }

    const modeParam = targetUrl.searchParams.get('mode');
    if (modeParam === 'unsafe' || modeParam === 'safe') {
      setRenderMode(modeParam);
    }

    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const handleUpdateDraft = (nextDraft: FakeResumeRecord, nextMode: RenderMode) => {
    setDraft(nextDraft);
    setRenderMode(nextMode);
  };

  const handleChangeMode = (nextMode: RenderMode) => {
    setRenderMode(nextMode);
    if (route === '/preview') {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', nextMode);
      window.history.replaceState({}, '', url.pathname + url.search);
    }
  };

  const handleUpdateSummary = (nextSummary: string) => {
    setDraft((prev) => ({
      ...prev,
      summary: nextSummary,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <TopBar currentRoute={route} onNavigate={navigate} />

      <main className="flex-1">
        {route === '/' && <HomePage onNavigate={navigate} />}
        {route === '/builder' && (
          <BuilderPage
            draft={draft}
            renderMode={renderMode}
            onUpdateDraft={handleUpdateDraft}
            onNavigate={navigate}
          />
        )}
        {route === '/preview' && (
          <PreviewPage
            draft={draft}
            renderMode={renderMode}
            onChangeMode={handleChangeMode}
            onSelectRecord={setDraft}
            onUpdateSummary={handleUpdateSummary}
            onNavigate={navigate}
          />
        )}
        {route === '/records' && <RecordsPage onSelectRecord={setDraft} onNavigate={navigate} />}
        {route === '/phase2' && <Phase2Page onNavigate={navigate} />}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
}
