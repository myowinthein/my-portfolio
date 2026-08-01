// Strips the most common injection vectors from feed-sourced HTML before it
// is rendered via dangerouslySetInnerHTML: <script> tags, inline event
// handler attributes, and javascript: URIs. Not a full HTML sanitizer —
// scoped to what a compromised/misconfigured RSS proxy could plausibly
// return, not arbitrary untrusted user input.
export function sanitizeHtml(html) {
  if (!html) return html;
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/(\s(?:href|src))\s*=\s*"javascript:[^"]*"/gi, '$1="#"')
    .replace(/(\s(?:href|src))\s*=\s*'javascript:[^']*'/gi, "$1='#'");
}
