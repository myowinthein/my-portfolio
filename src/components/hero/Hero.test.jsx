import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Hero from './Hero';
import { firstName, lastName, position, resumeURL, roleTags, summary } from '../../config';

describe('Hero', () => {
  it('renders the full name and position', () => {
    render(<Hero />);
    expect(screen.getByText(`${firstName} ${lastName}`)).toBeInTheDocument();
    expect(screen.getByText(position)).toBeInTheDocument();
  });

  it('renders every role tag', () => {
    render(<Hero />);
    roleTags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('renders every summary paragraph', () => {
    render(<Hero />);
    summary.forEach((paragraph) => {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    });
  });

  it('links the resume button to the configured resume URL', () => {
    render(<Hero />);
    expect(screen.getByText('View Resume').closest('a')).toHaveAttribute('href', resumeURL);
  });
});
