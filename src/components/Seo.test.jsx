import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import SEO from './Seo';
import { position, metaTitle, metaDescription } from '../config';

// next/head only flushes into document.head inside Next's own router/app
// context; under bare RTL rendering it renders nothing. Mock it as a
// passthrough so its children land in the test container instead, where
// SEO's own title/meta computation can actually be inspected.
vi.mock('next/head', () => ({
  default: ({ children }) => <div data-testid="head">{children}</div>,
}));

describe('SEO', () => {
  it('uses the default meta title when no pageTitle is given', () => {
    const { getByTestId } = render(<SEO />);
    expect(getByTestId('head').querySelector('title')).toHaveTextContent(metaTitle);
  });

  it('builds a "{pageTitle} | {position}" title when pageTitle is given', () => {
    const { getByTestId } = render(<SEO pageTitle="Blog" />);
    expect(getByTestId('head').querySelector('title')).toHaveTextContent(`Blog | ${position}`);
  });

  it('sets the meta description', () => {
    const { getByTestId } = render(<SEO />);
    expect(getByTestId('head').querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      metaDescription
    );
  });
});
