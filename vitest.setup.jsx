import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

// jsdom doesn't implement media playback; play() returns undefined instead
// of the Promise real browsers return, which breaks code that does
// video.play().catch(...). Stub both to no-ops so that code path is testable.
window.HTMLMediaElement.prototype.play = () => Promise.resolve();
window.HTMLMediaElement.prototype.pause = () => {};

// Next.js always wraps the app in <div id="__next">, which react-modal's
// Modal.setAppElement("#__next") call relies on for aria-hiding. RTL's bare
// render() doesn't recreate that shell, so add it once so the selector
// resolves the same way it does in production.
const nextRoot = document.createElement('div');
nextRoot.id = '__next';
document.body.appendChild(nextRoot);

// next/image requires build-time-generated width/height metadata that Next's
// webpack/SWC pipeline attaches to static imports; Vite (used by vitest)
// resolves them to a plain string instead, so next/image throws. Tests don't
// need Next's image optimization behavior, only that a src/alt got through.
vi.mock('next/image', () => ({
  default: ({ src, alt, loader, priority, fill, quality, placeholder, blurDataURL, unoptimized, ...rest }) => {
    const resolvedSrc = typeof src === 'string' ? src : src?.src;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={resolvedSrc} alt={alt} {...rest} />;
  },
}));
