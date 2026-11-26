/* ResumeSafe Lab same-site route manifest for KAVACH Phase 1 mapping.
 * Strictly static metadata; makes zero external requests and collects no user data.
 */
window.__RESUMESAFE_LAB_MANIFEST__ = {
  application: "ResumeSafe Lab",
  purpose: "Authorized KAVACH Phase 1 and Phase 2 training target",
  externalConnections: false,
  persistence: "none",
  pages: [
    "/",
    "/builder",
    "/preview",
    "/records",
    "/phase2"
  ],
  fakeEndpoints: [
    "/api/fake/status",
    "/api/fake/resumes",
    "/api/fake/templates",
    "/api/fake/echo-preview"
  ]
};
