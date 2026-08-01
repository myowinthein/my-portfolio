import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from './index';
import { resumeURL } from '../../config';

describe('About', () => {
  it('renders the section headings and composed sub-sections', () => {
    render(<About />);
    expect(screen.getByText('personal info')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Technical Skills')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();
  });

  it('links the resume button to the configured resume URL', () => {
    render(<About />);
    expect(screen.getByText('View Resume').closest('a')).toHaveAttribute('href', resumeURL);
  });
});
