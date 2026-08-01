import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import useAllBlogData from './AllBlogData';

vi.mock('react-toastify', () => ({
  toast: { error: vi.fn() },
}));

const jsonResponse = (data) => ({ json: () => Promise.resolve(data) });

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
  toast.error.mockClear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useAllBlogData', () => {
  it('parses a successful feed response into display-ready blog items', async () => {
    fetch.mockResolvedValueOnce(jsonResponse({
      items: [{
        guid: 'post-1',
        title: 'My Post',
        author: 'Martin',
        pubDate: '2026-03-05 12:00:00',
        categories: ['Backend', 'AWS'],
        thumbnail: '',
        description: '<p>Hello world</p><img src="https://medium.com/_/stat?x=1">',
      }],
    }));

    const { result } = renderHook(() => useAllBlogData());
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.blogsData).toHaveLength(1);
    const post = result.current.blogsData[0];
    expect(post.id).toBe('post-1');
    expect(post.link).toBe('post-1');
    expect(post.title).toBe('My Post');
    expect(post.tag).toBe('Backend, AWS');
    expect(post.description).toBe('<p>Hello world</p>');
    expect(post.preview).toBe('Hello world');
  });

  it('falls back to extracting an <img> src from the description when there is no thumbnail', async () => {
    fetch.mockResolvedValueOnce(jsonResponse({
      items: [{
        guid: 'post-2',
        title: 'No Thumbnail',
        author: 'Martin',
        pubDate: '2026-03-05 12:00:00',
        categories: [],
        thumbnail: '',
        description: '<img src="https://cdn.example.com/cover.png">body text',
      }],
    }));

    const { result } = renderHook(() => useAllBlogData());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.blogsData[0].img).toBe('https://cdn.example.com/cover.png');
  });

  it('uses the thumbnail field when present, without touching the description', async () => {
    fetch.mockResolvedValueOnce(jsonResponse({
      items: [{
        guid: 'post-3',
        title: 'Has Thumbnail',
        author: 'Martin',
        pubDate: '2026-03-05 12:00:00',
        categories: [],
        thumbnail: 'https://cdn.example.com/thumb.png',
        description: 'plain text, no markup',
      }],
    }));

    const { result } = renderHook(() => useAllBlogData());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.blogsData[0].img).toBe('https://cdn.example.com/thumb.png');
  });

  it('truncates the preview to 200 characters of plain text', async () => {
    const longText = 'a'.repeat(300);
    fetch.mockResolvedValueOnce(jsonResponse({
      items: [{
        guid: 'post-4',
        title: 'Long Post',
        author: 'Martin',
        pubDate: '2026-03-05 12:00:00',
        categories: [],
        thumbnail: '',
        description: `<p>${longText}</p>`,
      }],
    }));

    const { result } = renderHook(() => useAllBlogData());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.blogsData[0].preview).toHaveLength(200);
  });

  it('shows an error toast and stops loading when the response has no items', async () => {
    fetch.mockResolvedValueOnce(jsonResponse({}));

    const { result } = renderHook(() => useAllBlogData());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.blogsData).toEqual([]);
    expect(toast.error).toHaveBeenCalledWith('Failed to fetch blogs!', expect.anything());
  });

  it('shows an error toast and stops loading when the fetch rejects', async () => {
    fetch.mockRejectedValueOnce(new Error('network down'));

    const { result } = renderHook(() => useAllBlogData());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(toast.error).toHaveBeenCalledWith('Failed to fetch blogs!', expect.anything());
  });

  it('does not show an error toast when the fetch is aborted', async () => {
    const abortError = new Error('aborted');
    abortError.name = 'AbortError';
    fetch.mockRejectedValueOnce(abortError);

    const { result } = renderHook(() => useAllBlogData());
    await waitFor(() => expect(result.current.blogsData).toEqual([]));

    expect(toast.error).not.toHaveBeenCalled();
  });

  it('aborts the in-flight request on unmount', () => {
    const abortSpy = vi.spyOn(AbortController.prototype, 'abort');
    fetch.mockReturnValueOnce(new Promise(() => {}));

    const { unmount } = renderHook(() => useAllBlogData());
    unmount();

    expect(abortSpy).toHaveBeenCalled();
    abortSpy.mockRestore();
  });

  it('handleBlogsData selects the matching post and opens the modal', async () => {
    fetch.mockResolvedValueOnce(jsonResponse({
      items: [{
        guid: 'post-5',
        title: 'Selectable',
        author: 'Martin',
        pubDate: '2026-03-05 12:00:00',
        categories: [],
        thumbnail: '',
        description: 'text',
      }],
    }));

    const { result } = renderHook(() => useAllBlogData());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.handleBlogsData('post-5'));

    expect(result.current.isOpen).toBe(true);
    expect(result.current.singleData.title).toBe('Selectable');
  });
});
