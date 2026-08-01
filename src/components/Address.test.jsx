import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Address from './Address';
import { email, address } from '../config';

describe('Address', () => {
  it('renders the configured address', () => {
    render(<Address />);
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText(address, { exact: false })).toBeInTheDocument();
  });

  it('renders a mailto link with the configured email', () => {
    render(<Address />);
    const link = screen.getByText(email).closest('a');
    expect(link).toHaveAttribute('href', `mailto:${email}`);
  });
});
