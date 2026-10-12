import { ElementData } from '../../types/element';
import { ELEMENTS } from '../../data/elements';

export type QuizQuestionKind =
  | 'identify-symbol'
  | 'identify-name'
  | 'identify-number'
  | 'atomic-structure'
  | 'electron-configuration';

export interface QuizQuestion {
  id: string;
  kind: QuizQuestionKind;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface QuizSession {
  questions: QuizQuestion[];
  currentIndex: number;
  score: number;
  selectedAnswer: string | null;
  wasCorrect: boolean | null;
  status: 'active' | 'complete';
}

export function shuffle<T>(items: T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1));
    const current = result[index]!;
    result[index] = result[swapIndex]!;
    result[swapIndex] = current;
  }
  return result;
}

function createElementQuestion(
  kind: QuizQuestionKind,
  element: ElementData,
  elements: ElementData[],
  random: () => number,
): QuizQuestion | null {
  const eligible = elements.filter((candidate) => candidate.atomicNumber !== element.atomicNumber);
  if (kind === 'identify-symbol') {
    const answer = element.name;
    const options = [answer, ...shuffle(eligible.map((candidate) => candidate.name), random).slice(0, 3)];
    return { id: `${kind}-${element.atomicNumber}`, kind, prompt: `Which element has the symbol ${element.symbol}?`, options: shuffle(options, random), answer, explanation: `${element.symbol} is the chemical symbol for ${element.name}.` };
  }
  if (kind === 'identify-name') {
    const answer = element.symbol;
    const options = [answer, ...shuffle(eligible.map((candidate) => candidate.symbol), random).slice(0, 3)];
    return { id: `${kind}-${element.atomicNumber}`, kind, prompt: `What is the chemical symbol for ${element.name}?`, options: shuffle(options, random), answer, explanation: `The bundled element record lists ${element.symbol} as the symbol for ${element.name}.` };
  }
  if (kind === 'identify-number') {
    const answer = `${element.name} (${element.symbol})`;
    const options = [answer, ...shuffle(eligible.map((candidate) => `${candidate.name} (${candidate.symbol})`), random).slice(0, 3)];
    return { id: `${kind}-${element.atomicNumber}`, kind, prompt: `Which element has atomic number ${element.atomicNumber}?`, options: shuffle(options, random), answer, explanation: `Atomic number ${element.atomicNumber} identifies ${element.name} (${element.symbol}) in the bundled dataset.` };
  }
  if (kind === 'electron-configuration') {
    const configuration = element.electronConfiguration.trim();
    if (!configuration) return null;
    const answer = configuration;
    const distractors = [...new Set(shuffle(eligible.map((candidate) => candidate.electronConfiguration.trim()).filter(Boolean), random))]
      .filter((candidate) => candidate !== answer).slice(0, 3);
    if (distractors.length < 3) return null;
    const options = shuffle([answer, ...distractors], random);
    return { id: `${kind}-${element.atomicNumber}`, kind, prompt: `According to the bundled dataset, which neutral electron configuration is listed for ${element.name} (${element.symbol})?`, options, answer, explanation: `The element record lists ${answer}. This question checks the dataset value; it is not independently calculated here.` };
  }
  return null;
}

const STRUCTURE_QUESTIONS: QuizQuestion[] = [
  { id: 'structure-atomic-number', kind: 'atomic-structure', prompt: 'What does an element’s atomic number count?', options: ['Protons in its nucleus', 'Protons plus neutrons', 'Electrons in every possible ion', 'Occupied electron shells'], answer: 'Protons in its nucleus', explanation: 'Atomic number equals proton count and defines the element.' },
  { id: 'structure-mass-number', kind: 'atomic-structure', prompt: 'For a particular isotope, how is mass number defined?', options: ['Protons plus neutrons', 'Protons plus electrons', 'Neutrons minus protons', 'The element’s average atomic mass'], answer: 'Protons plus neutrons', explanation: 'Mass number is the integer total of protons and neutrons for that nuclide.' },
  { id: 'structure-neutral', kind: 'atomic-structure', prompt: 'When is an atom electrically neutral?', options: ['When proton and electron counts are equal', 'When neutron and electron counts are equal', 'When it has no neutrons', 'When its mass number is even'], answer: 'When proton and electron counts are equal', explanation: 'Protons contribute +1 charge and electrons −1; equal counts give net charge zero.' },
];

export function createQuizSession(
  kinds: QuizQuestionKind[],
  elements: ElementData[] = ELEMENTS,
  random: () => number = Math.random,
  questionsPerKind = 3,
): QuizSession | null {
  if (kinds.length === 0) return null;
  const questions: QuizQuestion[] = [];
  for (const kind of new Set(kinds)) {
    if (kind === 'atomic-structure') {
      const randomizedStructureQuestions = STRUCTURE_QUESTIONS.map((question) => ({ ...question, options: shuffle(question.options, random) }));
      questions.push(...shuffle(randomizedStructureQuestions, random).slice(0, questionsPerKind));
      continue;
    }
    const candidates = shuffle(elements, random)
      .map((element) => createElementQuestion(kind, element, elements, random))
      .filter((question): question is QuizQuestion => question !== null);
    questions.push(...candidates.slice(0, questionsPerKind));
  }
  if (questions.length === 0) return null;
  return { questions: shuffle(questions, random), currentIndex: 0, score: 0, selectedAnswer: null, wasCorrect: null, status: 'active' };
}

export function restartQuizSession(
  kinds: QuizQuestionKind[],
  elements: ElementData[] = ELEMENTS,
  random: () => number = Math.random,
  questionsPerKind = 3,
): QuizSession | null {
  return createQuizSession(kinds, elements, random, questionsPerKind);
}

export function submitQuizAnswer(session: QuizSession, answer: string): QuizSession {
  if (session.status !== 'active' || session.selectedAnswer !== null) return session;
  const current = session.questions[session.currentIndex];
  if (!current || !current.options.includes(answer)) return session;
  const wasCorrect = answer === current.answer;
  return { ...session, selectedAnswer: answer, wasCorrect, score: session.score + Number(wasCorrect) };
}

export function advanceQuizSession(session: QuizSession): QuizSession {
  if (session.status !== 'active' || session.selectedAnswer === null) return session;
  if (session.currentIndex >= session.questions.length - 1) return { ...session, status: 'complete' };
  return { ...session, currentIndex: session.currentIndex + 1, selectedAnswer: null, wasCorrect: null };
}
