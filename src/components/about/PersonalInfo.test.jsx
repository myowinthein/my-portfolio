import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PersonalInfo from './PersonalInfo';
import { address, timezone, languages, focus, workPreference } from '../../config';

describe('PersonalInfo', () => {
  it('renders all four info rows with their labels', () => {
    render(<PersonalInfo />);
    expect(screen.getByText('Location:')).toBeInTheDocument();
    expect(screen.getByText('Languages:')).toBeInTheDocument();
    expect(screen.getByText('Focus:')).toBeInTheDocument();
    expect(screen.getByText('Work Preference:')).toBeInTheDocument();
  });

  it('combines address and timezone into the Location value', () => {
    render(<PersonalInfo />);
    expect(screen.getByText(`${address} (${timezone})`)).toBeInTheDocument();
  });

  it('renders the remaining config-driven values', () => {
    render(<PersonalInfo />);
    expect(screen.getByText(languages)).toBeInTheDocument();
    expect(screen.getByText(focus)).toBeInTheDocument();
    expect(screen.getByText(workPreference)).toBeInTheDocument();
  });
});
