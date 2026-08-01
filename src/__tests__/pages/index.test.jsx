import { describe, it, expect } from 'vitest';
import HomeDark from '../../pages/home-dark';
import IndexPage from '../../pages/index';

describe('index page', () => {
  it('re-exports home-dark as the default export', () => {
    expect(IndexPage).toBe(HomeDark);
  });
});
