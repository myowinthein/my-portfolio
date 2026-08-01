import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useContext } from 'react';
import ContextProvider, { BlogContext } from './ContextProvider';

vi.mock('../hooks/AllBlogData', () => ({
  default: () => ({ blogsData: ['stub-post'], isLoading: false }),
}));

const Consumer = () => {
  const value = useContext(BlogContext);
  return <div data-testid="consumer">{value.isLoading ? 'loading' : value.blogsData[0]}</div>;
};

describe('ContextProvider', () => {
  it('provides the useAllBlogData value to descendants', () => {
    render(
      <ContextProvider>
        <Consumer />
      </ContextProvider>
    );
    expect(screen.getByTestId('consumer')).toHaveTextContent('stub-post');
  });

  it('renders its children', () => {
    render(
      <ContextProvider>
        <span>child content</span>
      </ContextProvider>
    );
    expect(screen.getByText('child content')).toBeInTheDocument();
  });
});
