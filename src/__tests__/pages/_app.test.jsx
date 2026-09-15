import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Aos from 'aos';
import MyApp from '../../pages/_app';

vi.mock('aos', () => ({ default: { init: vi.fn() } }));
vi.mock('react-animated-cursor', () => ({
  default: ({ innerStyle, outerStyle }) => <div data-testid="cursor"
    data-inner-z={innerStyle?.zIndex} data-outer-z={outerStyle?.zIndex} />,
}));
vi.mock('@vercel/analytics/react', () => ({ Analytics: () => <div data-testid="analytics" /> }));
vi.mock('../../hooks/AllBlogData', () => ({
  default: () => ({ blogsData: [], isLoading: false, singleData: {}, isOpen: false, setIsOpen: vi.fn(), handleBlogsData: vi.fn() }),
}));

const StubComponent = ({ label }) => <div data-testid="page">{label}</div>;

describe('MyApp', () => {
  it('initializes AOS on mount', () => {
    render(<MyApp Component={StubComponent} pageProps={{ label: 'hi' }} />);
    expect(Aos.init).toHaveBeenCalledWith({ duration: 1200 });
  });

  it('renders the page Component with pageProps', () => {
    render(<MyApp Component={StubComponent} pageProps={{ label: 'hello world' }} />);
    expect(screen.getByTestId('page')).toHaveTextContent('hello world');
  });

  it('renders the animated cursor and analytics', () => {
    render(<MyApp Component={StubComponent} pageProps={{}} />);
    expect(screen.getByTestId('cursor')).toHaveAttribute('data-inner-z', '3000');
    expect(screen.getByTestId('cursor')).toHaveAttribute('data-outer-z', '3000');
    expect(screen.getByTestId('analytics')).toBeInTheDocument();
  });
});
