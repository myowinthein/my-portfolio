import { describe, it, expect } from 'vitest';
import { sentenceCase } from './text';

describe('sentenceCase', () => {
  it('uppercases only the first character and lowercases the rest', () => {
    expect(sentenceCase('Senior Software Engineer')).toBe('Senior software engineer');
  });

  it('handles already-lowercase input', () => {
    expect(sentenceCase('hello world')).toBe('Hello world');
  });

  it('handles all-uppercase input', () => {
    expect(sentenceCase('HELLO WORLD')).toBe('Hello world');
  });

  it('returns empty string unchanged', () => {
    expect(sentenceCase('')).toBe('');
  });

  it('returns null and undefined unchanged', () => {
    expect(sentenceCase(null)).toBe(null);
    expect(sentenceCase(undefined)).toBe(undefined);
  });

  it('handles single-character input', () => {
    expect(sentenceCase('a')).toBe('A');
    expect(sentenceCase('A')).toBe('A');
  });
});
