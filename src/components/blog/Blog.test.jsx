import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useData from '../../hooks/useData';
import Blog from './Blog';

vi.mock('../../hooks/useData');

const baseState = {
  blogsData: [],
  isLoading: false,
  singleData: {},
  isOpen: false,
  setIsOpen: vi.fn(),
  handleBlogsData: vi.fn(),
};

beforeEach(() => {
  useData.mockReturnValue(baseState);
});

describe('Blog', () => {
  it('shows a loading spinner while isLoading is true', () => {
    useData.mockReturnValue({ ...baseState, isLoading: true });
    render(<Blog />);
    expect(document.querySelector('.blog-loading')).not.toBeNull();
  });

  it('renders a card for each blog post once loaded', () => {
    useData.mockReturnValue({
      ...baseState,
      blogsData: [
        { id: '1', title: 'Post One', preview: 'Preview one', img: '/a.png' },
        { id: '2', title: 'Post Two', preview: 'Preview two', img: '/b.png' },
      ],
    });
    render(<Blog />);
    expect(screen.getByText('Post One')).toBeInTheDocument();
    expect(screen.getByText('Post Two')).toBeInTheDocument();
    expect(screen.getByText('Preview one')).toBeInTheDocument();
  });

  it('opens a post by calling handleBlogsData with its id', async () => {
    const handleBlogsData = vi.fn();
    useData.mockReturnValue({
      ...baseState,
      blogsData: [{ id: 'post-1', title: 'Post One', preview: 'Preview', img: '/a.png' }],
      handleBlogsData,
    });
    const user = userEvent.setup();
    render(<Blog />);

    await user.click(screen.getByText('Post One'));
    expect(handleBlogsData).toHaveBeenCalledWith('post-1');
  });

  it('renders the open post\'s details in the modal', () => {
    useData.mockReturnValue({
      ...baseState,
      isOpen: true,
      singleData: {
        title: 'My Post',
        author: 'Martin',
        date: '5 March 2026, 12:00 PM',
        tag: 'Backend',
        description: '<p>Hello</p>',
        link: 'https://myowinthein.medium.com/my-post',
      },
    });
    render(<Blog />);

    expect(screen.getByRole('heading', { name: 'My Post' })).toBeInTheDocument();
    expect(screen.getByText('Martin', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Backend', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Continue reading on', { exact: false }).querySelector('a')).toHaveAttribute(
      'href',
      'https://myowinthein.medium.com/my-post'
    );
  });

  it('calls setIsOpen(false) when the modal close button is clicked', async () => {
    const setIsOpen = vi.fn();
    useData.mockReturnValue({
      ...baseState,
      isOpen: true,
      singleData: { title: 'My Post' },
      setIsOpen,
    });
    const user = userEvent.setup();
    render(<Blog />);

    await user.click(screen.getByAltText('close icon').closest('button'));
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  it('strips a Medium tracking-pixel image from the open excerpt on first open', () => {
    // Regression test: react-modal mounts its portal content one render
    // after Blog's own effects run, so a plain useEffect([isOpen, singleData])
    // alone would miss this on the actual first open (excerptRef.current was
    // still null when it fired). The callback ref (setExcerptRef) is what
    // makes this synchronous.
    useData.mockReturnValue({
      ...baseState,
      isOpen: true,
      singleData: {
        title: 'My Post',
        description: '<p>Hello</p><img src="https://medium.com/_/stat?x=1">',
      },
    });
    render(<Blog />);

    expect(document.querySelector('img[src*="medium.com/_/stat"]')).toBeNull();
  });

  it('strips a Medium tracking-pixel image when switching to a new post while already open', () => {
    useData.mockReturnValue({
      ...baseState,
      isOpen: true,
      singleData: { title: 'First Post', description: '<p>First</p>' },
    });
    const { rerender } = render(<Blog />);

    useData.mockReturnValue({
      ...baseState,
      isOpen: true,
      singleData: {
        title: 'Second Post',
        description: '<p>Second</p><img src="https://medium.com/_/stat?x=2">',
      },
    });
    rerender(<Blog />);

    expect(document.querySelector('img[src*="medium.com/_/stat"]')).toBeNull();
  });

  it('sanitizes the open post description before rendering it', () => {
    useData.mockReturnValue({
      ...baseState,
      isOpen: true,
      singleData: {
        title: 'My Post',
        description: '<p>Hello</p><script>alert(1)</script><img src="x.png" onerror="alert(2)">',
      },
    });
    render(<Blog />);

    expect(document.querySelector('script')).toBeNull();
    expect(document.querySelector('img[src="x.png"]')).not.toHaveAttribute('onerror');
  });
});
