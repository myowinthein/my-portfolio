import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Skills from './Skills';

const icon = { src: '/icon.svg', width: 24, height: 24 };

const skillSets = [
  { title: 'Group 1', skills: [{ icon, name: 'Skill A', core: true }] },
  { title: 'Group 2', skills: [{ icon, name: 'Skill B' }] },
  { title: 'Group 3', skills: [{ icon, name: 'Skill C' }] },
  { title: 'Group 4', skills: [{ icon, name: 'Skill D' }] },
  { title: 'Group 5', skills: [{ icon, name: 'Skill E' }] },
];

describe('Skills', () => {
  it('shows only the first 4 groups by default', () => {
    render(<Skills skillSets={skillSets} />);
    expect(screen.getByText('Group 1')).toBeInTheDocument();
    expect(screen.getByText('Group 4')).toBeInTheDocument();
    expect(screen.queryByText('Group 5')).not.toBeInTheDocument();
    expect(screen.getByText('Show more skills')).toBeInTheDocument();
  });

  it('reveals the remaining groups after clicking "Show more skills"', async () => {
    const user = userEvent.setup();
    render(<Skills skillSets={skillSets} />);

    await user.click(screen.getByText('Show more skills'));

    expect(screen.getByText('Group 5')).toBeInTheDocument();
    expect(screen.getByText('Show less')).toBeInTheDocument();
  });

  it('renders a crown badge only for skills flagged core', () => {
    render(<Skills skillSets={skillSets} />);
    const skillA = screen.getByText('Skill A').closest('.col-6');
    const skillB = screen.getByText('Skill B').closest('.col-6');
    expect(skillA.querySelector('.skill-crown-badge')).not.toBeNull();
    expect(skillB.querySelector('.skill-crown-badge')).toBeNull();
  });
});
