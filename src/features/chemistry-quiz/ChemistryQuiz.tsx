import { useState } from 'react';
import { BookOpen, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { Panel } from '../../components/common/Panel';
import { restartQuizSession, QuizQuestionKind, QuizSession, submitQuizAnswer, advanceQuizSession } from './quiz-engine';
import './ChemistryQuiz.css';

const QUESTION_TYPES: { kind: QuizQuestionKind; label: string }[] = [
  { kind: 'identify-symbol', label: 'Element from symbol' },
  { kind: 'identify-name', label: 'Symbol from element name' },
  { kind: 'identify-number', label: 'Element from atomic number' },
  { kind: 'atomic-structure', label: 'Atomic structure basics' },
  { kind: 'electron-configuration', label: 'Dataset electron configuration' },
];

export function ChemistryQuiz() {
  const [selectedKinds, setSelectedKinds] = useState<QuizQuestionKind[]>(QUESTION_TYPES.map(({ kind }) => kind));
  const [session, setSession] = useState<QuizSession | null>(null);

  const start = () => setSession(restartQuizSession(selectedKinds));
  const current = session?.questions[session.currentIndex];

  return <Panel title="Chemistry quiz" subtitle="Practice element facts and introductory atomic structure" icon={<BookOpen size={18} />}>
    <div className="chemistry-quiz">
      {!session ? <>
        <p className="quiz-intro">Choose question types to include. Each selected type contributes up to three questions.</p>
        <fieldset className="quiz-type-list">
          <legend>Question types</legend>
          {QUESTION_TYPES.map(({ kind, label }) => <label key={kind} className="quiz-type-option">
            <input type="checkbox" checked={selectedKinds.includes(kind)} onChange={(event) => setSelectedKinds((currentKinds) => event.target.checked ? [...currentKinds, kind] : currentKinds.filter((currentKind) => currentKind !== kind))} />
            <span>{label}</span>
          </label>)}
        </fieldset>
        <button type="button" className="quiz-primary-button" onClick={start} disabled={selectedKinds.length === 0}>Start quiz</button>
      </> : <>
        <div className="quiz-session-topline">
          <p aria-live="polite">{session.status === 'complete' ? 'Quiz complete' : `Question ${session.currentIndex + 1} of ${session.questions.length}`}</p>
          <p aria-live="polite">Score: <strong>{session.score}{session.status === 'complete' ? ` / ${session.questions.length}` : ''}</strong></p>
        </div>
        {session.status === 'complete' ? <div className="quiz-complete" role="status">
          <CheckCircle2 size={22} aria-hidden="true" />
          <p>You scored {session.score} out of {session.questions.length}.</p>
        </div> : current && <>
          <progress className="quiz-progress" value={session.currentIndex + Number(session.selectedAnswer !== null)} max={session.questions.length} aria-label="Quiz progress" />
          <fieldset className="quiz-question" disabled={session.selectedAnswer !== null}>
            <legend>{current.prompt}</legend>
            {current.options.map((option) => {
              const isAnswer = option === current.answer;
              const isSelected = option === session.selectedAnswer;
              const className = session.selectedAnswer === null ? '' : isAnswer ? 'quiz-choice--correct' : isSelected ? 'quiz-choice--incorrect' : '';
              return <label className={`quiz-choice ${className}`} key={option}>
                <input type="radio" name="chemistry-quiz-answer" value={option} checked={isSelected} onChange={() => setSession((active) => active ? submitQuizAnswer(active, option) : active)} />
                <span>{option}</span>
              </label>;
            })}
          </fieldset>
          {session.selectedAnswer !== null && <div className={`quiz-feedback ${session.wasCorrect ? 'quiz-feedback--correct' : 'quiz-feedback--incorrect'}`} role="status">
            {session.wasCorrect ? <CheckCircle2 size={18} aria-hidden="true" /> : <XCircle size={18} aria-hidden="true" />}
            <p><strong>{session.wasCorrect ? 'Correct.' : 'Not quite.'}</strong> {current?.explanation}</p>
          </div>}
          <div className="quiz-actions">
            <button type="button" className="quiz-secondary-button" onClick={start}><RotateCcw size={15} /> Restart quiz</button>
            <button type="button" className="quiz-primary-button" disabled={session.selectedAnswer === null} onClick={() => setSession((active) => active ? advanceQuizSession(active) : active)}>
              {session.currentIndex === session.questions.length - 1 ? 'Finish quiz' : 'Next question'}
            </button>
          </div>
        </>}
        {session.status === 'complete' && <button type="button" className="quiz-primary-button" onClick={start}><RotateCcw size={15} /> Play again</button>}
      </>}
    </div>
  </Panel>;
}
