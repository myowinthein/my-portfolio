import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SwitchDark from './SwitchDark';

beforeEach(() => {
  localStorage.clear();
  document.body.className = '';
});

describe('SwitchDark', () => {
  it('defaults to the dark theme when no preference is stored', () => {
    render(<SwitchDark />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    expect(screen.getByRole('checkbox').closest('label')).not.toHaveClass('active');
  });

  it('restores the light theme from localStorage on mount', () => {
    localStorage.setItem('theme-color', 'light');
    render(<SwitchDark />);

    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(screen.getByRole('checkbox').closest('label')).toHaveClass('active');
    expect(document.body.classList.contains('light')).toBe(true);
  });

  it('switches to light on toggle and updates the body class', async () => {
    const user = userEvent.setup();
    render(<SwitchDark />);

    await user.click(screen.getByRole('checkbox'));

    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(document.body.classList.contains('light')).toBe(true);
    expect(localStorage.getItem('theme-color')).toBe('light');
  });

  it('switches back to dark on a second toggle', async () => {
    const user = userEvent.setup();
    render(<SwitchDark />);

    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('checkbox'));

    expect(screen.getByRole('checkbox')).not.toBeChecked();
    expect(document.body.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme-color')).toBe('dark');
  });
});
