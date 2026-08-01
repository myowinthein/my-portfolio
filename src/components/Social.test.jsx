import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Social from './Social';
import { socialLinks } from '../config';

describe('Social', () => {
  it('renders a link for every configured social entry', () => {
    render(<Social />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(socialLinks.length);
  });

  it('links to the configured URLs with an icon of the configured class', () => {
    render(<Social />);
    socialLinks.forEach(({ link, iconName }) => {
      const anchor = document.querySelector(`a[href="${link}"]`);
      expect(anchor).not.toBeNull();
      expect(anchor.querySelector('i')).toHaveClass(...iconName.split(' '));
    });
  });

  it('opens links in a new tab safely', () => {
    render(<Social />);
    screen.getAllByRole('link').forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
