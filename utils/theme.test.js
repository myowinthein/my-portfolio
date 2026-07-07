import { describe, it, expect, vi, beforeEach } from 'vitest';
import handleSwitchValue from './theme';

let bodyClassList;

beforeEach(() => {
  bodyClassList = { add: vi.fn(), remove: vi.fn() };
  global.localStorage = { setItem: vi.fn() };
  global.document = { body: { classList: bodyClassList } };
});

describe('handleSwitchValue', () => {
  it('applies the dark theme when value is truthy', () => {
    handleSwitchValue(true);
    expect(localStorage.setItem).toHaveBeenCalledWith('theme-color', 'dark');
    expect(bodyClassList.add).toHaveBeenCalledWith('dark');
    expect(bodyClassList.remove).toHaveBeenCalledWith('light');
  });

  it('applies the light theme when value is falsy', () => {
    handleSwitchValue(false);
    expect(localStorage.setItem).toHaveBeenCalledWith('theme-color', 'light');
    expect(bodyClassList.add).toHaveBeenCalledWith('light');
    expect(bodyClassList.remove).toHaveBeenCalledWith('dark');
  });
});
