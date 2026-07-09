import { describe, it, expect } from 'vitest';
import { experienceYears } from './experience';

describe('experienceYears', () => {
  it('subtracts the start year and gap years from the current year', () => {
    const now = new Date('2026-01-01T00:00:00Z');
    expect(experienceYears(2013, 1, now)).toBe(12);
  });

  it('defaults gap years to zero', () => {
    const now = new Date('2026-01-01T00:00:00Z');
    expect(experienceYears(2013, undefined, now)).toBe(13);
  });

  it('bumps by one when the year rolls over', () => {
    expect(experienceYears(2013, 1, new Date('2026-12-31T00:00:00Z'))).toBe(12);
    expect(experienceYears(2013, 1, new Date('2027-01-01T00:00:00Z'))).toBe(13);
  });
});
