export type RenderMode = 'unsafe' | 'safe';
export type TemplateStyle = 'classic-editorial' | 'technical-brief' | 'compact-grid';

export interface FakeResumeRecord {
  id: string;
  label: string;
  fullName: string;
  targetRole: string;
  email: string;
  location: string;
  template: TemplateStyle;
  summary: string;
  skills: string[];
  experience: Array<{
    role: string;
    organization: string;
    period: string;
    highlight: string;
  }>;
}

export interface MarkerPreset {
  id: string;
  label: string;
  description: string;
  value: string;
}

export const HARMLESS_MARKER_PRESETS: MarkerPreset[] = [
  {
    id: 'baseline-plain',
    label: 'Plain Text Baseline',
    description: 'Standard candidate summary without markup tags.',
    value:
      'Systems analyst focused on reproducible test environments, documentation hygiene, and read-only audit workflows.',
  },
  {
    id: 'kavach-mark',
    label: 'Harmless <mark> Marker',
    description: 'Uses a safe <mark> tag to show DOM interpretation in Unsafe mode vs literal text in Safe mode.',
    value:
      'Candidate summary with <mark data-kavach="marker-01">[KAVACH_HTML_MARKER]</mark> for DOM sink comparison.',
  },
  {
    id: 'kavach-bold',
    label: 'Harmless <b> & <u> Marker',
    description: 'Demonstrates inline formatting tags rendered as HTML nodes in innerHTML mode.',
    value:
      'Security trainee testing <b>[UNESCAPED_BOLD_MARKER]</b> and <u>[DOM_SINK_TRACE]</u> without script execution.',
  },
];

export const FAKE_RESUME_RECORDS: FakeResumeRecord[] = [
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

export interface FakeTemplateMeta {
  id: TemplateStyle;
  name: string;
  description: string;
}

export const FAKE_TEMPLATES: FakeTemplateMeta[] = [
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
