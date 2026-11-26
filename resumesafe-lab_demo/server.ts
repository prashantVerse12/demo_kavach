import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

const FAKE_STATUS_PAYLOAD = {
  service: 'ResumeSafe Lab',
  mode: 'authorized-training-target',
  externalRequests: false,
  persistence: 'none',
  dataPolicy: 'fake-records-only',
  sameSiteRoutes: ['/', '/builder', '/preview', '/records', '/phase2'],
  fakeEndpoints: [
    '/api/fake/status',
    '/api/fake/resumes',
    '/api/fake/templates',
    '/api/fake/echo-preview',
  ],
};

const FAKE_RESUMES_PAYLOAD = [
  {
    id: 'fake-01',
    label: 'Fake Record 01 — Baseline Analyst',
    fullName: 'Aarav Deshmukh (Fake Record)',
    targetRole: 'Junior Security Researcher',
    email: 'aarav.fake01@example.invalid',
    location: 'Bengaluru, IN (Synthetic)',
    template: 'classic-editorial',
    summary:
      'Aspiring application security analyst practicing static code review and DOM sink identification with synthetic test profiles.',
    skills: ['Static Analysis', 'DOM Inspection', 'HTTP Mapping', 'Technical Writing'],
    experience: [
      {
        role: 'AppSec Intern (Fictional)',
        organization: 'Northstar Training Lab (Fake Org)',
        period: '2025 — 2026',
        highlight: 'Cataloged same-site routes and documented safe textContent migration steps.',
      },
    ],
  },
  {
    id: 'fake-02',
    label: 'Fake Record 02 — Marker Comparison',
    fullName: 'Meera Nair (Fake Record)',
    targetRole: 'Frontend Quality Engineer',
    email: 'meera.fake02@example.invalid',
    location: 'Kochi, IN (Synthetic)',
    template: 'technical-brief',
    summary:
      'Frontend engineer verifying <mark data-kavach="marker-02">[KAVACH_DEMO_MARKER]</mark> output across <b>innerHTML</b> and textContent sinks.',
    skills: ['TypeScript', 'Browser DOM APIs', 'Accessibility', 'Regression Audits'],
    experience: [
      {
        role: 'UI Reliability Trainee (Fictional)',
        organization: 'CivicWeb Sandbox (Fake Org)',
        period: '2024 — 2026',
        highlight: 'Replaced legacy HTML string concatenation with textContent bindings across profile views.',
      },
    ],
  },
  {
    id: 'fake-03',
    label: 'Fake Record 03 — Compact Brief',
    fullName: 'Rohan Kulkarni (Fake Record)',
    targetRole: 'Platform Documentation Lead',
    email: 'rohan.fake03@example.invalid',
    location: 'Pune, IN (Synthetic)',
    template: 'compact-grid',
    summary:
      'Technical writer building reproducible training guides with <u>[HARMLESS_TRACE_TAG]</u> markers and zero external dependencies.',
    skills: ['Threat Modeling Notes', 'Markdown Specs', 'Route Inventory', 'Verification Logs'],
    experience: [
      {
        role: 'Lab Maintainer (Fictional)',
        organization: 'Horizon Cyber Range (Fake Org)',
        period: '2023 — 2026',
        highlight: 'Maintained air-gapped training targets with synthetic JSON fixtures only.',
      },
    ],
  },
  {
    id: 'fake-04',
    label: 'Fake Record 04 — Clean Template',
    fullName: 'Ananya Verma (Fake Record)',
    targetRole: 'Systems Verification Specialist',
    email: 'ananya.fake04@example.invalid',
    location: 'Hyderabad, IN (Synthetic)',
    template: 'classic-editorial',
    summary:
      'Verification engineer focused on evidence-based reporting where findings require reproducible DOM observation.',
    skills: ['Evidence Verification', 'Code Auditing', 'React State Flow', 'Node.js Tooling'],
    experience: [
      {
        role: 'Audit Fellow (Fictional)',
        organization: 'Meridian Testbed (Fake Org)',
        period: '2025 — 2026',
        highlight: 'Authored Phase 2 review checklists pairing vulnerable sinks with drop-in textContent fixes.',
      },
    ],
  },
];

const FAKE_TEMPLATES_PAYLOAD = [
  {
    id: 'classic-editorial',
    name: 'Classic Editorial',
    description: 'Single-column document layout with clear typographic hierarchy.',
  },
  {
    id: 'technical-brief',
    name: 'Technical Brief',
    description: 'Structured two-part header with monospace metadata row.',
  },
  {
    id: 'compact-grid',
    name: 'Compact Grid',
    description: 'Condensed skills and experience layout for quick inspection.',
  },
];

async function createAppServer(): Promise<void> {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '16kb' }));

  // Fake read-only API routes for KAVACH Phase 1 site mapping
  app.get('/api/fake/status', (_req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json(FAKE_STATUS_PAYLOAD);
  });

  app.get('/api/fake/resumes', (_req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json({
      demoOnly: true,
      stored: false,
      count: FAKE_RESUMES_PAYLOAD.length,
      records: FAKE_RESUMES_PAYLOAD,
    });
  });

  app.get('/api/fake/templates', (_req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json({
      demoOnly: true,
      templates: FAKE_TEMPLATES_PAYLOAD,
    });
  });

  // Stateless fake endpoint: validates shape only, stores nothing, forwards nothing
  app.post('/api/fake/echo-preview', (req: Request, res: Response) => {
    const body = typeof req.body === 'object' && req.body !== null ? req.body : {};
    const recordId = typeof body.recordId === 'string' ? body.recordId.slice(0, 40) : 'custom-draft';
    const mode = body.mode === 'unsafe' ? 'unsafe' : 'safe';

    res.status(200).json({
      stored: false,
      demoOnly: true,
      recordId,
      mode,
      note: 'Fake endpoint response: no user data was saved, logged, or sent externally.',
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir, { index: false }));

    app.get('*', (_req: Request, res: Response) => {
      const indexPath = path.join(distDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`ResumeSafe Lab listening on http://${HOST}:${PORT}`);
  });
}

createAppServer().catch((err) => {
  console.error('Failed to start ResumeSafe Lab server:', err);
  process.exit(1);
});
