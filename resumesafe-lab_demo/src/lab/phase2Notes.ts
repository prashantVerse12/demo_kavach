export interface Phase2NoteSection {
  id: string;
  title: string;
  summary: string;
  details: string[];
}

export const PHASE_2_ANALYSIS_NOTES: Phase2NoteSection[] = [
  {
    id: 'target-file',
    title: '01. Target Source & Symbol Locations',
    summary:
      'Provide src/lab/previewRenderer.ts to KAVACH Phase 2 as the primary client-side rendering module.',
    details: [
      'Unsafe demonstration function: renderBioUnsafe(container, rawBioInput) assigns a string directly to container.innerHTML.',
      'Fixed reference function: renderBioSafe(container, rawBioInput) assigns the input string to container.textContent.',
      'Training harness guard: neutralizeExecutableVectors(rawInput) strips active script tags, inline event attributes, and javascript: URIs so injected code never executes in the browser.',
    ],
  },
  {
    id: 'data-flow',
    title: '02. Source-to-Sink Data Flow',
    summary:
      'Untrusted-style demo input moves from the Resume Builder form or URL query parameters into the Preview DOM container.',
    details: [
      'Entry points: /builder form fields (summary, fullName, targetRole) and /preview query parameters (?record=..., ?mode=unsafe|safe, ?marker=...).',
      'Propagation: In-memory React state passes the summary string into ResumePreviewPage, which invokes either renderBioUnsafe or renderBioSafe inside a useEffect ref.',
      'Observable difference: Harmless markers such as <mark data-kavach="marker-01">[KAVACH_HTML_MARKER]</mark> create a <mark> DOM node in Unsafe mode, whereas Safe mode renders the angle brackets as literal text.',
    ],
  },
  {
    id: 'evidence-boundary',
    title: '03. Verification & Evidence Discipline',
    summary:
      'Researchers should separate static sink identification from runtime verification claims.',
    details: [
      'What is directly observable: In Unsafe mode, harmless HTML formatting markers (<b>, <u>, <mark>) appear as child DOM elements inside the preview container.',
      'What is NOT verified: Arbitrary JavaScript execution is intentionally prevented by neutralizeExecutableVectors; therefore, script execution / XSS exploitability must not be reported as verified.',
      'Recommended remediation note: Replace container.innerHTML in renderBioUnsafe with container.textContent (matching renderBioSafe) or standard React JSX text interpolation.',
    ],
  },
  {
    id: 'phase4-readiness',
    title: '04. KAVACH Phase 4 Readiness Scope',
    summary:
      'KAVACH Phase 4 checks plan readiness and documentation completeness—it does not execute code in a sandbox.',
    details: [
      'Phase 4 verifies whether remediation plans, target routes, and verification criteria are complete and actionable.',
      'Because Phase 4 does not run application code inside a sandbox, runtime evidence comes solely from your Phase 1/Phase 2 inspection and harmless DOM marker checks.',
      'Always confirm static fixes (such as textContent usage in renderBioSafe) and deployment readiness before signing off.',
    ],
  },
];
