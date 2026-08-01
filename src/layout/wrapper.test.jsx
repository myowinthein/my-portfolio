import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Wrapper from './wrapper';

const RECAPTCHA_SRC = 'https://www.google.com/recaptcha/api.js';

beforeEach(() => {
  document.querySelectorAll(`script[src="${RECAPTCHA_SRC}"]`).forEach((el) => el.remove());
});

describe('Wrapper', () => {
  it('renders its children', () => {
    render(<Wrapper><div>child content</div></Wrapper>);
    expect(screen.getByText('child content')).toBeInTheDocument();
  });

  it('injects the reCAPTCHA script on mount', () => {
    render(<Wrapper><div /></Wrapper>);
    expect(document.querySelector(`script[src="${RECAPTCHA_SRC}"]`)).not.toBeNull();
  });

  it('does not inject a duplicate script if one already exists', () => {
    const existing = document.createElement('script');
    existing.src = RECAPTCHA_SRC;
    document.body.appendChild(existing);

    render(<Wrapper><div /></Wrapper>);

    expect(document.querySelectorAll(`script[src="${RECAPTCHA_SRC}"]`)).toHaveLength(1);
  });

  it('removes the script it added on unmount', () => {
    const { unmount } = render(<Wrapper><div /></Wrapper>);
    expect(document.querySelector(`script[src="${RECAPTCHA_SRC}"]`)).not.toBeNull();

    unmount();
    expect(document.querySelector(`script[src="${RECAPTCHA_SRC}"]`)).toBeNull();
  });
});
