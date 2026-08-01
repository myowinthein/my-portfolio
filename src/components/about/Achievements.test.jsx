import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Achievements from './Achievements';
import { careerSince, totalExperiences, totalPlatformTypes, totalDeliveredProjects } from '../../config';

describe('Achievements', () => {
  it('renders all four stat boxes with their labels', () => {
    render(<Achievements />);
    expect(screen.getByText('years of')).toBeInTheDocument();
    expect(screen.getByText('career')).toBeInTheDocument();
    expect(screen.getByText('platform')).toBeInTheDocument();
    expect(screen.getByText('projects')).toBeInTheDocument();
  });

  it('shows a "+" suffix only on the stats flagged withPlus', () => {
    render(<Achievements />);
    const careerStat = screen.getByText(String(careerSince));
    expect(careerStat.querySelector('span')).toBeNull();

    const experienceStat = screen.getByText(String(totalExperiences));
    expect(experienceStat.querySelector('span')).toHaveTextContent('+');
  });

  it('renders the real config-driven numbers', () => {
    render(<Achievements />);
    expect(screen.getByText(String(totalExperiences))).toBeInTheDocument();
    expect(screen.getByText(String(careerSince))).toBeInTheDocument();
    expect(screen.getByText(String(totalPlatformTypes))).toBeInTheDocument();
    expect(screen.getByText(String(totalDeliveredProjects))).toBeInTheDocument();
  });
});
