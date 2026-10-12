import { describe, expect, it } from 'vitest';
import { ELEMENTS } from '../../../data/elements';
import { advanceQuizSession, createQuizSession, restartQuizSession, submitQuizAnswer } from '../quiz-engine';

describe('chemistry quiz engine', () => {
  it('generates usable questions with randomized, answer-containing options', () => {
    const session = createQuizSession(['identify-symbol', 'atomic-structure'], ELEMENTS, () => 0.37, 2)!;
    expect(session.questions).toHaveLength(4);
    for (const question of session.questions) {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.options).toContain(question.answer);
    }
  });

  it('validates answers, counts one score per question, and completes progress', () => {
    const initial = createQuizSession(['identify-number'], ELEMENTS, () => 0.21, 1)!;
    const question = initial.questions[0]!;
    expect(submitQuizAnswer(initial, 'not an option')).toBe(initial);
    const wrong = question.options.find((option) => option !== question.answer)!;
    const answeredWrong = submitQuizAnswer(initial, wrong);
    expect(answeredWrong.score).toBe(0);
    expect(answeredWrong.wasCorrect).toBe(false);
    expect(submitQuizAnswer(answeredWrong, question.answer)).toBe(answeredWrong); // No double scoring.

    const answeredCorrect = submitQuizAnswer(initial, question.answer);
    expect(answeredCorrect.score).toBe(1);
    expect(advanceQuizSession(answeredCorrect).status).toBe('complete');
  });

  it('omits electron-configuration questions when the dataset cannot supply enough choices', () => {
    const sparse = ELEMENTS.slice(0, 8).map((element, index) => index === 0 ? { ...element, electronConfiguration: '' } : element);
    const session = createQuizSession(['electron-configuration'], sparse, () => 0.4, 10)!;
    expect(session.questions.every((question) => question.prompt.includes('According to the bundled dataset'))).toBe(true);
    expect(session.questions.some((question) => question.id.endsWith('-1'))).toBe(false);
  });

  it('restarts with zero score and no selected response', () => {
    const initial = createQuizSession(['atomic-structure'], ELEMENTS, () => 0.3, 1)!;
    const answered = submitQuizAnswer(initial, initial.questions[0]!.answer);
    const restarted = restartQuizSession(['atomic-structure'], ELEMENTS, () => 0.6, 1)!;
    expect(answered.score).toBe(1);
    expect(restarted.score).toBe(0);
    expect(restarted.selectedAnswer).toBeNull();
    expect(restarted.currentIndex).toBe(0);
    expect(restarted.status).toBe('active');
  });
});
