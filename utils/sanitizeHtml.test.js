import { describe, it, expect } from 'vitest';
import { sanitizeHtml } from './sanitizeHtml';

describe('sanitizeHtml', () => {
  it('leaves ordinary markup untouched', () => {
    expect(sanitizeHtml('<p>Hello <b>world</b></p>')).toBe('<p>Hello <b>world</b></p>');
  });

  it('removes script tags', () => {
    expect(sanitizeHtml('<p>Hi</p><script>alert(1)</script>')).toBe('<p>Hi</p>');
  });

  it('removes inline event handler attributes', () => {
    expect(sanitizeHtml('<img src="x.png" onerror="alert(1)">')).toBe('<img src="x.png">');
    expect(sanitizeHtml("<div onclick='doBad()'>click</div>")).toBe('<div>click</div>');
  });

  it('neutralizes javascript: URIs', () => {
    expect(sanitizeHtml('<a href="javascript:alert(1)">link</a>')).toBe('<a href="#">link</a>');
  });

  it('returns falsy input unchanged', () => {
    expect(sanitizeHtml('')).toBe('');
    expect(sanitizeHtml(undefined)).toBe(undefined);
    expect(sanitizeHtml(null)).toBe(null);
  });
});
