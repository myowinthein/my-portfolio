import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Education from './Education';

describe('Education', () => {
  it('renders every education entry', () => {
    render(<Education />);
    expect(screen.getByText('BSc (Hons) Computing, First Class Honours')).toBeInTheDocument();
    expect(screen.getByText('Certified Laravel Developer')).toBeInTheDocument();
    expect(screen.getByText('Level 5 Diploma in Computing')).toBeInTheDocument();
    expect(screen.getByText('Bachelor of Technology in Electrical Power Engineering')).toBeInTheDocument();
  });

  it('only renders a details paragraph when details is non-empty', () => {
    render(<Education />);
    expect(screen.getByText(/Remote study via KMD College/)).toBeInTheDocument();

    const noDetailsEntry = screen
      .getByText('Bachelor of Technology in Electrical Power Engineering')
      .closest('.edu-row');
    expect(noDetailsEntry.querySelector('.edu-row__detail')).toBeNull();
  });

  it('only renders a "Verify Certificate" link when a link is present', () => {
    render(<Education />);
    const links = screen.getAllByText('Verify Certificate');
    expect(links).toHaveLength(1);
    expect(links[0].closest('a')).toHaveAttribute(
      'href',
      'https://verifier.certificationforlaravel.org/bbc220bc-7159-4ff9-baf7-6289f3dcf4d3'
    );
  });
});
