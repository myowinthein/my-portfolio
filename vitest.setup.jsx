import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

// next/image requires build-time-generated width/height metadata that Next's
// webpack/SWC pipeline attaches to static imports; Vite (used by vitest)
// resolves them to a plain string instead, so next/image throws. Tests don't
// need Next's image optimization behavior, only that a src/alt got through.
vi.mock('next/image', () => ({
  default: ({ src, alt, ...rest }) => {
    const resolvedSrc = typeof src === 'string' ? src : src?.src;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={resolvedSrc} alt={alt} {...rest} />;
  },
}));
