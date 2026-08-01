import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Experience from './Experience';

describe('Experience', () => {
  it('shows only the first 3 companies by default', () => {
    render(<Experience />);
    expect(screen.getByText(/StudyMe, Australia/)).toBeInTheDocument();
    expect(screen.getByText(/Snappymob, Malaysia/)).toBeInTheDocument();
    expect(screen.getByText(/Nexlabs · Yangon/)).toBeInTheDocument();
    expect(screen.queryByText(/Global Wave Technology/)).not.toBeInTheDocument();
    expect(screen.getByText('Show earlier experience')).toBeInTheDocument();
  });

  it('reveals earlier experience after clicking the toggle button', async () => {
    const user = userEvent.setup();
    render(<Experience />);

    await user.click(screen.getByText('Show earlier experience'));

    expect(screen.getByText(/Global Wave Technology/)).toBeInTheDocument();
    expect(screen.getByText('Show less')).toBeInTheDocument();
  });

  it('renders every position held at a multi-position company', () => {
    render(<Experience />);
    expect(screen.getByText('Head of Engineering (FastForward Product Initiative)')).toBeInTheDocument();
    expect(screen.getByText('Frontend & CMS Team Lead')).toBeInTheDocument();
    expect(screen.getByText('Senior Full Stack Developer')).toBeInTheDocument();
    expect(screen.getByText('Senior PHP Developer')).toBeInTheDocument();
  });

  it('collapses back to 3 companies after toggling twice', async () => {
    const user = userEvent.setup();
    render(<Experience />);

    await user.click(screen.getByText('Show earlier experience'));
    await user.click(screen.getByText('Show less'));

    expect(screen.queryByText(/Global Wave Technology/)).not.toBeInTheDocument();
    expect(screen.getByText('Show earlier experience')).toBeInTheDocument();
  });
});
