import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChemistryQuiz } from '../ChemistryQuiz';

describe('ChemistryQuiz', () => {
  it('tracks answer feedback and score, then restarts the session', () => {
    render(<ChemistryQuiz />);
    const typeOptions = screen.getAllByRole('checkbox');
    typeOptions.forEach((option) => fireEvent.click(option));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Atomic structure basics' }));
    fireEvent.click(screen.getByRole('button', { name: 'Start quiz' }));
    expect(screen.getByText(/Question 1 of 3/)).toBeInTheDocument();

    const answer = screen.getAllByRole('radio')[0]!;
    fireEvent.click(answer);
    expect(screen.getByRole('status')).toHaveTextContent(/Correct\.|Not quite\./);
    expect(screen.getByText((_, element) => element?.tagName === 'P' && element.textContent?.startsWith('Score:') === true)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Restart quiz' }));
    expect(screen.getByText(/Question 1 of 3/)).toBeInTheDocument();
    expect(screen.getByText((_, element) => element?.tagName === 'P' && element.textContent?.trim() === 'Score: 0')).toBeInTheDocument();
  });
});
