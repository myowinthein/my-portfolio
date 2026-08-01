import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomeDark from '../../pages/home-dark';
import { menuLabels } from '../../config';

vi.mock('../../hooks/useData', () => ({
  default: () => ({
    blogsData: [],
    isLoading: false,
    singleData: {},
    isOpen: false,
    setIsOpen: vi.fn(),
    handleBlogsData: vi.fn(),
  }),
}));

describe('HomeDark', () => {
  it('renders a tab for every menu item', () => {
    render(<HomeDark />);
    Object.values(menuLabels).forEach((label) => {
      expect(screen.getByRole('tab', { name: label })).toBeInTheDocument();
    });
  });

  it('shows the Work tab content after clicking it', async () => {
    const user = userEvent.setup();
    render(<HomeDark />);

    await user.click(screen.getByRole('tab', { name: menuLabels.work }));

    expect(screen.getByText('selected')).toBeInTheDocument();
  });

  it('shows the Contact tab content, including Address and Social', async () => {
    const user = userEvent.setup();
    render(<HomeDark />);

    await user.click(screen.getByRole('tab', { name: menuLabels.contact }));

    expect(screen.getByText(/LET.S CONNECT/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('YOUR NAME')).toBeInTheDocument();
  });
});
