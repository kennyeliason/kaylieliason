import { useState } from 'react';

type SentenceType = 'Simple' | 'Compound' | 'Complex' | 'Compound-Complex';

type Question = {
  sentence: string;
  answer: SentenceType;
  explanation: string;
};

const sentenceTypes: SentenceType[] = ['Simple', 'Compound', 'Complex', 'Compound-Complex'];

const questions: Question[] = [
  {
    sentence: 'The dog barked loudly.',
    answer: 'Simple',
    explanation: 'One independent clause only.',
  },
  {
    sentence: 'I finished my homework, and I cleaned my room.',
    answer: 'Compound',
    explanation: 'Two independent clauses joined by a comma and a coordinating conjunction.',
  },
  {
    sentence: 'Because the rain started early, the game was canceled.',
    answer: 'Complex',
    explanation: 'One dependent clause plus one independent clause.',
  },
  {
    sentence: 'Although I was tired, I studied for the quiz, and I passed it.',
    answer: 'Compound-Complex',
    explanation: 'It has a dependent clause and two independent clauses.',
  },
  {
    sentence: 'My little brother built a fort in the living room.',
    answer: 'Simple',
    explanation: 'This is a single complete thought.',
  },
  {
    sentence: 'The bell rang, but the teacher kept talking.',
    answer: 'Compound',
    explanation: 'Two independent clauses joined by a comma and but.',
  },
  {
    sentence: 'When the movie ended, everyone stood up.',
    answer: 'Complex',
    explanation: 'The sentence starts with a dependent clause followed by an independent clause.',
  },
  {
    sentence: 'If you call me later, I will answer, and we can study together.',
    answer: 'Compound-Complex',
    explanation: 'There is one dependent clause and two independent clauses.',
  },
  {
    sentence: 'The cookies smelled amazing.',
    answer: 'Simple',
    explanation: 'Only one independent clause appears here.',
  },
  {
    sentence: 'I wanted to go outside, so I put on my shoes.',
    answer: 'Compound',
    explanation: 'Two independent clauses joined by so.',
  },
  {
    sentence: 'Since the library was closed, we studied at home.',
    answer: 'Complex',
    explanation: 'It has one dependent clause and one independent clause.',
  },
  {
    sentence: 'After we ate dinner, Dad washed the dishes, and I dried them.',
    answer: 'Compound-Complex',
    explanation: 'One dependent clause plus two independent clauses.',
  },
  {
    sentence: 'Our team practiced after school.',
    answer: 'Simple',
    explanation: 'It contains one subject-predicate pair that stands alone.',
  },
  {
    sentence: 'Mia read the chapter, and Noah took notes.',
    answer: 'Compound',
    explanation: 'Both sides could stand alone as sentences.',
  },
  {
    sentence: 'Even though the test was hard, she stayed calm.',
    answer: 'Complex',
    explanation: 'The opening clause cannot stand alone, but the second clause can.',
  },
  {
    sentence: 'While the baby slept, Mom folded laundry, and Dad made lunch.',
    answer: 'Compound-Complex',
    explanation: 'It includes one dependent clause and two independent clauses.',
  },
  {
    sentence: 'The sun disappeared behind the mountains.',
    answer: 'Simple',
    explanation: 'Just one independent clause.',
  },
  {
    sentence: 'We could leave now, or we could wait until sunset.',
    answer: 'Compound',
    explanation: 'Two independent clauses are joined by or.',
  },
  {
    sentence: 'Before the concert began, we found our seats.',
    answer: 'Complex',
    explanation: 'Before the concert began is dependent; we found our seats is independent.',
  },
  {
    sentence: 'Because the power went out, we lit candles, and we played cards.',
    answer: 'Compound-Complex',
    explanation: 'One dependent clause and two independent clauses are present.',
  },
  {
    sentence: 'The class laughed at the joke.',
    answer: 'Simple',
    explanation: 'One complete thought.',
  },
  {
    sentence: 'Jaden packed snacks, and Ava filled the water bottles.',
    answer: 'Compound',
    explanation: 'These are two independent clauses joined correctly.',
  },
  {
    sentence: 'Unless you hurry, you will miss the bus.',
    answer: 'Complex',
    explanation: 'Unless you hurry is dependent; the rest is independent.',
  },
  {
    sentence: 'When the timer beeped, I took the cookies out, and my sister set them on the rack.',
    answer: 'Compound-Complex',
    explanation: 'There is one dependent clause and two independent clauses.',
  },
];

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function EnglishSentencePractice() {
  const [deck, setDeck] = useState(() => shuffle(questions));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<SentenceType | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);

  const current = deck[index];
  const isDone = index >= deck.length;
  const isCorrect = selected === current?.answer;
  const answered = selected !== null;
  const progress = deck.length === 0 ? 0 : Math.round((index / deck.length) * 100);

  function handleAnswer(choice: SentenceType) {
    if (answered || !current) return;
    setSelected(choice);
    if (choice === current.answer) {
      setCorrectCount((count) => count + 1);
      setStreak((count) => count + 1);
      return;
    }
    setStreak(0);
  }

  function nextQuestion() {
    if (!answered) return;
    setSelected(null);
    setIndex((value) => value + 1);
  }

  function restart() {
    setDeck(shuffle(questions));
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setStreak(0);
  }

  return (
    <div className="english-app">
      <div className="glow glow-a" />
      <div className="glow glow-b" />

      <main className="shell">
        <section className="hero">
          <div className="eyebrow">English Practice</div>
          <h1>Sentence Type Trainer</h1>
          <p className="hero-copy">
            Read each sentence and choose whether it is simple, compound, complex, or
            compound-complex.
          </p>

          <div className="hint-grid">
            <div className="hint-card">
              <strong>Simple</strong>
              <span>1 independent clause</span>
            </div>
            <div className="hint-card">
              <strong>Compound</strong>
              <span>2 independent clauses</span>
            </div>
            <div className="hint-card">
              <strong>Complex</strong>
              <span>1 independent + 1 dependent clause</span>
            </div>
            <div className="hint-card">
              <strong>Compound-Complex</strong>
              <span>2 independent + 1 dependent clause</span>
            </div>
          </div>
        </section>

        <section className="board">
          <div className="stats">
            <div className="stat-chip">Score: {correctCount}/{questions.length}</div>
            <div className="stat-chip">Streak: {streak}</div>
            <div className="stat-chip">Progress: {progress}%</div>
          </div>

          <div className="progress-track" aria-hidden="true">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          {isDone ? (
            <div className="result-card">
              <p className="result-label">Finished</p>
              <h2>You got {correctCount} out of {questions.length}</h2>
              <p className="result-copy">
                {correctCount === questions.length
                  ? 'Perfect. You crushed it.'
                  : correctCount >= questions.length * 0.8
                    ? 'Nice work. You are in solid shape.'
                    : 'Run it again once or twice and the patterns will start to stick.'}
              </p>
              <button className="primary-btn" onClick={restart}>Try Again</button>
            </div>
          ) : (
            <div className="question-card">
              <div className="question-topline">Question {index + 1} of {deck.length}</div>
              <p className="sentence">{current.sentence}</p>

              <div className="answer-grid">
                {sentenceTypes.map((type) => {
                  let className = 'answer-btn';
                  if (answered && type === current.answer) className += ' correct';
                  if (answered && selected === type && type !== current.answer) className += ' wrong';

                  return (
                    <button
                      key={type}
                      className={className}
                      onClick={() => handleAnswer(type)}
                      disabled={answered}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className={isCorrect ? 'feedback success' : 'feedback error'}>
                  <p className="feedback-title">
                    {isCorrect ? 'Correct' : `Not quite. The answer is ${current.answer}.`}
                  </p>
                  <p className="feedback-copy">{current.explanation}</p>
                  <button className="primary-btn" onClick={nextQuestion}>
                    {index === deck.length - 1 ? 'See Score' : 'Next Sentence'}
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Manrope:wght@400;500;700;800&display=swap');

        :global(body) {
          margin: 0;
          min-height: 100vh;
          background:
            radial-gradient(circle at top, rgba(255, 244, 196, 0.9), transparent 28%),
            radial-gradient(circle at 80% 20%, rgba(255, 170, 144, 0.45), transparent 25%),
            linear-gradient(160deg, #fff7ec 0%, #ffe8d2 45%, #ffd7b8 100%);
          color: #3c2c1c;
        }

        .english-app {
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          font-family: 'Manrope', sans-serif;
        }

        .glow {
          position: fixed;
          border-radius: 999px;
          filter: blur(40px);
          opacity: 0.5;
          pointer-events: none;
        }

        .glow-a {
          width: 18rem;
          height: 18rem;
          background: rgba(255, 123, 90, 0.32);
          top: -4rem;
          left: -3rem;
        }

        .glow-b {
          width: 22rem;
          height: 22rem;
          background: rgba(255, 214, 102, 0.26);
          right: -5rem;
          bottom: -4rem;
        }

        .shell {
          position: relative;
          z-index: 1;
          max-width: 58rem;
          margin: 0 auto;
          padding: 2rem 1rem 3rem;
        }

        .hero {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .eyebrow {
          display: inline-block;
          padding: 0.45rem 0.8rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(167, 103, 57, 0.18);
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #9b4d1f;
        }

        h1 {
          margin: 0.9rem 0 0.6rem;
          font-family: 'Fredoka', sans-serif;
          font-size: clamp(2.3rem, 7vw, 4.6rem);
          line-height: 0.95;
          color: #7c2d12;
        }

        .hero-copy {
          max-width: 38rem;
          margin: 0 auto;
          font-size: 1rem;
          line-height: 1.6;
          color: #6c4a2e;
        }

        .hint-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.8rem;
          margin-top: 1.4rem;
        }

        .hint-card,
        .question-card,
        .result-card,
        .board {
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(167, 103, 57, 0.16);
          box-shadow: 0 18px 45px rgba(122, 63, 24, 0.12);
        }

        .hint-card {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          padding: 1rem;
          border-radius: 1.1rem;
          text-align: left;
        }

        .hint-card strong {
          font-size: 1rem;
          color: #7c2d12;
        }

        .hint-card span {
          font-size: 0.92rem;
          color: #7a5a3d;
        }

        .board {
          padding: 1rem;
          border-radius: 1.6rem;
        }

        .stats {
          display: flex;
          flex-wrap: wrap;
          gap: 0.7rem;
          margin-bottom: 0.9rem;
        }

        .stat-chip {
          padding: 0.65rem 0.9rem;
          border-radius: 999px;
          background: #fff8f0;
          border: 1px solid rgba(167, 103, 57, 0.15);
          font-weight: 700;
          font-size: 0.92rem;
          color: #7c2d12;
        }

        .progress-track {
          height: 0.8rem;
          border-radius: 999px;
          background: rgba(255, 233, 211, 0.9);
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .progress-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #fb923c, #f97316, #ea580c);
          transition: width 180ms ease;
        }

        .question-card,
        .result-card {
          border-radius: 1.4rem;
          padding: 1.2rem;
        }

        .question-topline,
        .result-label {
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #b45309;
        }

        .sentence {
          margin: 0.9rem 0 1rem;
          font-size: clamp(1.3rem, 4vw, 2rem);
          line-height: 1.4;
          font-weight: 800;
          color: #3c2c1c;
        }

        .answer-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.8rem;
        }

        .answer-btn,
        .primary-btn {
          border: 0;
          cursor: pointer;
          font: inherit;
          transition: transform 140ms ease, box-shadow 140ms ease, background 140ms ease;
        }

        .answer-btn {
          min-height: 4rem;
          padding: 1rem;
          border-radius: 1.1rem;
          background: linear-gradient(180deg, #fffdf8 0%, #fff2e3 100%);
          border: 1px solid rgba(167, 103, 57, 0.18);
          font-weight: 800;
          font-size: 1rem;
          color: #7c2d12;
          box-shadow: inset 0 -4px 0 rgba(234, 88, 12, 0.08);
        }

        .answer-btn:hover:enabled,
        .primary-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(122, 63, 24, 0.12);
        }

        .answer-btn.correct {
          background: linear-gradient(180deg, #dcfce7 0%, #bbf7d0 100%);
          color: #166534;
        }

        .answer-btn.wrong {
          background: linear-gradient(180deg, #fee2e2 0%, #fecaca 100%);
          color: #991b1b;
        }

        .answer-btn:disabled {
          cursor: default;
        }

        .feedback {
          margin-top: 1rem;
          padding: 1rem;
          border-radius: 1rem;
        }

        .feedback.success {
          background: rgba(220, 252, 231, 0.72);
          border: 1px solid rgba(34, 197, 94, 0.18);
        }

        .feedback.error {
          background: rgba(254, 226, 226, 0.72);
          border: 1px solid rgba(239, 68, 68, 0.18);
        }

        .feedback-title {
          margin: 0 0 0.35rem;
          font-weight: 800;
        }

        .feedback-copy,
        .result-copy {
          margin: 0;
          line-height: 1.6;
          color: #5b4330;
        }

        .primary-btn {
          margin-top: 0.9rem;
          padding: 0.95rem 1.1rem;
          border-radius: 999px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          font-weight: 800;
        }

        .result-card h2 {
          margin: 0.55rem 0;
          font-family: 'Fredoka', sans-serif;
          color: #7c2d12;
          font-size: clamp(1.8rem, 5vw, 2.6rem);
        }

        @media (max-width: 640px) {
          .shell {
            padding: 1rem 0.8rem 2rem;
          }

          .hint-grid,
          .answer-grid {
            grid-template-columns: 1fr;
          }

          .board,
          .question-card,
          .result-card {
            border-radius: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
