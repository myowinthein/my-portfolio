import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFound from '../../pages/404';

describe('404', () => {
  it('renders the not-found message and a link back home', () => {
    render(<NotFound />);
    expect(screen.getByText('404!')).toBeInTheDocument();
    expect(screen.getByText('The page you are looking for could not be found.')).toBeInTheDocument();
    expect(screen.getByText('BACK TO HOME').closest('a')).toHaveAttribute('href', '/');
  });
});
