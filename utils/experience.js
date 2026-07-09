// Years of experience since a career start year, minus any gap years.
// Kept as a pure helper so the arithmetic used in config.js is unit-testable.
export const experienceYears = (careerStartYear, gapYears = 0, now = new Date()) =>
  now.getFullYear() - careerStartYear - gapYears;
