/**
 * ResumeSafe Lab — Phase 2 Code Analysis Target
 * File: src/lab/previewRenderer.ts
 *
 * Purpose:
 * Demonstrates the difference between an intentionally unsafe DOM sink
 * (`innerHTML`) and the fixed safe implementation (`textContent`).
 *
 * Safety Guarantee:
 * `neutralizeExecutableVectors` removes active script/event vectors before
 * rendering so that only harmless HTML formatting markers (such as <b>, <i>,
 * <u>, <mark>) can be observed in the DOM. Injected code is never executed.
 */

export function neutralizeExecutableVectors(rawInput: string): string {
  return rawInput
    .replace(/<\s*(script|iframe|object|embed|svg|math|template|style|link|meta|base)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '[BLOCKED_TAG]')
    .replace(/<\s*(script|iframe|object|embed|svg|math|template|style|link|meta|base)[^>]*\/?>/gi, '[BLOCKED_TAG]')
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, '')
    .replace(/\ssrcdoc\s*=\s*(['"]).*?\1/gi, '')
    .replace(/(?:javascript|vbscript)\s*:/gi, 'blocked-uri:')
    .replace(/data\s*:\s*text\/html/gi, 'blocked-data:');
}

/**
 * INTENTIONALLY UNSAFE DEMO PATTERN (for KAVACH Phase 2 identification)
 *
 * Why this pattern is flagged in code review:
 * Assigning user-controlled or URL-derived text directly to `element.innerHTML`
 * causes the browser to parse HTML tags into live DOM nodes rather than
 * treating the input as plain character data.
 *
 * Training Guard:
 * The input is pre-filtered through `neutralizeExecutableVectors` so harmless
 * text markers like `<mark>[KAVACH_HTML_MARKER]</mark>` or `<b>tag</b>` render
 * as HTML nodes for demonstration without ever executing scripts.
 */
export function renderBioUnsafe(container: HTMLElement, rawBioInput: string): string {
  const harmlessMarkerInput = neutralizeExecutableVectors(rawBioInput);

  // UNSAFE SINK: raw HTML string assignment to innerHTML
  container.innerHTML = harmlessMarkerInput;

  return container.innerHTML;
}

/**
 * FIXED SAFE VERSION (Remediation for Phase 2)
 *
 * Why this is safe:
 * `element.textContent` treats the entire string as literal text characters.
 * No HTML parser is invoked and no markup tags or DOM nodes are created.
 */
export function renderBioSafe(container: HTMLElement, rawBioInput: string): string {
  // SAFE SINK: literal text assignment via textContent
  container.textContent = rawBioInput;

  return container.textContent ?? '';
}
