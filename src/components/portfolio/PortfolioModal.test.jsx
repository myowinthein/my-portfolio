import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PortfolioModal from './PortfolioModal';

const baseProject = {
  product: 'Job Buddy',
  company: 'Acme Co',
  role: 'Technical Lead',
  description: ['First paragraph.', 'Second paragraph.'],
  media: [{ url: '/media/1.webp', type: 'image' }],
};

describe('PortfolioModal', () => {
  it('renders the project details, filling missing fields with N/A', () => {
    render(
      <PortfolioModal
        modalCategory="SaaS"
        modalProject={baseProject}
        setGetModal={vi.fn()}
      />
    );

    expect(screen.getByRole('heading', { name: 'Job Buddy' })).toBeInTheDocument();
    expect(screen.getByText('Acme Co')).toBeInTheDocument();
    expect(screen.getByText('Technical Lead')).toBeInTheDocument();
    expect(screen.getByText('SaaS')).toBeInTheDocument();
    expect(screen.getAllByText('N/A')).toHaveLength(3); // industry, type, preview
    expect(screen.getByText('First paragraph.')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph.')).toBeInTheDocument();
  });

  it('renders preview links joined with a separator when present', () => {
    render(
      <PortfolioModal
        modalCategory="SaaS"
        modalProject={{
          ...baseProject,
          preview: [
            { url: 'https://apps.apple.com/x', platform: 'App Store' },
            { url: 'https://play.google.com/x', platform: 'Google Play' },
          ],
        }}
        setGetModal={vi.fn()}
      />
    );

    expect(screen.getByText('App Store').closest('a')).toHaveAttribute('href', 'https://apps.apple.com/x');
    expect(screen.getByText('Google Play').closest('a')).toHaveAttribute('href', 'https://play.google.com/x');
    expect(screen.getByText('·')).toBeInTheDocument();
  });

  it('calls setGetModal(false) when the outside overlay is clicked', async () => {
    const user = userEvent.setup();
    const setGetModal = vi.fn();
    render(<PortfolioModal modalCategory="SaaS" modalProject={baseProject} setGetModal={setGetModal} />);

    await user.click(screen.getByRole('button', { name: 'Close modal' }));
    expect(setGetModal).toHaveBeenCalledWith(false);
  });

  it('calls setGetModal(false) when the close button is clicked', async () => {
    const user = userEvent.setup();
    const setGetModal = vi.fn();
    render(<PortfolioModal modalCategory="SaaS" modalProject={baseProject} setGetModal={setGetModal} />);

    await user.click(screen.getByAltText('close icon').closest('button'));
    expect(setGetModal).toHaveBeenCalledWith(false);
  });

  it('calls setGetModal(false) on Escape key', () => {
    const setGetModal = vi.fn();
    render(<PortfolioModal modalCategory="SaaS" modalProject={baseProject} setGetModal={setGetModal} />);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(setGetModal).toHaveBeenCalledWith(false);
  });

  it('renders into document.body via a portal', () => {
    render(<PortfolioModal modalCategory="SaaS" modalProject={baseProject} setGetModal={vi.fn()} />);
    expect(document.body.querySelector('.modal_portfolio')).not.toBeNull();
  });
});
