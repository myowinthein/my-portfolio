import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Portfolio from './Portfolio';

describe('Portfolio', () => {
  it('renders a tab for every portfolio category', () => {
    render(<Portfolio />);
    expect(screen.getByRole('tab', { name: 'Education' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Commerce Platforms' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'eGovernment Systems' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Civic Platforms' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Business Applications' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Experiments & Hackathons' })).toBeInTheDocument();
  });

  it('shows the first category\'s projects by default, with no modal open', () => {
    render(<Portfolio />);
    expect(screen.getByText('StudyMe Portal')).toBeInTheDocument();
    expect(document.body.querySelector('.modal_portfolio')).toBeNull();
  });

  it('opens the modal for the clicked project, then closes it', async () => {
    const user = userEvent.setup();
    render(<Portfolio />);

    await user.click(screen.getByText('StudyMe Portal'));

    expect(document.body.querySelector('.modal_portfolio')).not.toBeNull();
    expect(screen.getByRole('heading', { name: 'StudyMe Portal' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close modal' }));
    expect(document.body.querySelector('.modal_portfolio')).toBeNull();
  });

  it('opens a project via keyboard (Enter)', async () => {
    const user = userEvent.setup();
    render(<Portfolio />);

    screen.getByText('StudyMe Portal').closest('.project-item').focus();
    await user.keyboard('{Enter}');

    expect(document.body.querySelector('.modal_portfolio')).not.toBeNull();
  });
});
