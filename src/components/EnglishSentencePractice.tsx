import { useState } from 'react';

type SentenceType = 'Simple' | 'Compound' | 'Complex' | 'Compound-Complex';
type PracticeTab = 'structure' | 'vocab';

type Question = {
  sentence: string;
  answer: SentenceType;
  explanation: string;
};

type VocabEntry = {
  word: string;
  definition: string;
  example: string;
};

type VocabQuestion = {
  word: string;
  definition: string;
  example: string;
  options: string[];
};

const sentenceTypes: SentenceType[] = ['Simple', 'Compound', 'Complex', 'Compound-Complex'];
const QUESTION_COUNT = 24;
const QUESTIONS_PER_TYPE = QUESTION_COUNT / sentenceTypes.length;

const independentClauses = [
  { start: 'The dog barked loudly.', mid: 'the dog barked loudly' },
  { start: 'My little brother built a fort in the living room.', mid: 'my little brother built a fort in the living room' },
  { start: 'The bell rang at exactly noon.', mid: 'the bell rang at exactly noon' },
  { start: 'The class laughed at the joke.', mid: 'the class laughed at the joke' },
  { start: 'Dad washed the dishes after dinner.', mid: 'Dad washed the dishes after dinner' },
  { start: 'Mom packed snacks for the road trip.', mid: 'Mom packed snacks for the road trip' },
  { start: 'The sun disappeared behind the mountains.', mid: 'the sun disappeared behind the mountains' },
  { start: 'The teacher answered the question.', mid: 'the teacher answered the question' },
  { start: 'Mia read the chapter carefully.', mid: 'Mia read the chapter carefully' },
  { start: 'Noah took notes in the margin.', mid: 'Noah took notes in the margin' },
  { start: 'Jaden packed the water bottles.', mid: 'Jaden packed the water bottles' },
  { start: 'Ava filled the cooler with ice.', mid: 'Ava filled the cooler with ice' },
  { start: 'Kayli practiced her vocabulary words.', mid: 'Kayli practiced her vocabulary words' },
  { start: 'Our team practiced after school.', mid: 'our team practiced after school' },
  { start: 'The cookies smelled amazing.', mid: 'the cookies smelled amazing' },
  { start: 'The students lined up quietly.', mid: 'the students lined up quietly' },
  { start: 'The players ran onto the field.', mid: 'the players ran onto the field' },
  { start: 'The kids played cards by the window.', mid: 'the kids played cards by the window' },
  { start: 'The leaves drifted across the yard.', mid: 'the leaves drifted across the yard' },
  { start: 'The candles flickered in the dark.', mid: 'the candles flickered in the dark' },
  { start: 'We found our seats before sunset.', mid: 'we found our seats before sunset' },
  { start: 'I put on my shoes by the door.', mid: 'I put on my shoes by the door' },
  { start: 'She stayed calm during the test.', mid: 'she stayed calm during the test' },
  { start: 'They studied at home after practice.', mid: 'they studied at home after practice' },
  { start: 'We lit candles during the storm.', mid: 'we lit candles during the storm' },
  { start: 'I dried the plates on the rack.', mid: 'I dried the plates on the rack' },
  { start: 'The bus arrived right on time.', mid: 'the bus arrived right on time' },
  { start: 'The library opened early this morning.', mid: 'the library opened early this morning' },
];

const subordinateStarters = [
  'Because the rain started early',
  'Although I was tired',
  'When the movie ended',
  'If you call me later',
  'Since the library was closed',
  'After we ate dinner',
  'Even though the test was hard',
  'While the baby slept',
  'Before the concert began',
  'Unless you hurry',
  'When the timer beeped',
  'Because the power went out',
  'If the lights flicker',
  'Although the hallway was noisy',
];

const vocabEntries: VocabEntry[] = [
  {
    word: 'jaded',
    definition: 'worn out; dulled, as from overindulgence',
    example: 'Even the sun did not cheer our jaded spirits as we trudged through the snow.',
  },
  {
    word: 'jargon',
    definition: 'vocabulary distinctive to a particular group of people',
    example: 'While the jargon of the musicians first amused Sara, she later became irritated with its constant use.',
  },
  {
    word: 'judicious',
    definition: 'showing sound judgment',
    example: 'A judicious manager should treat everyone the same way and not show favoritism.',
  },
  {
    word: 'kindred',
    definition: 'related by birth; of like nature',
    example: 'The boy and his dog were kindred spirits who spent the day running and jumping in the woods.',
  },
  {
    word: 'knead',
    definition: 'to work dough or clay into a uniform mixture',
    example: 'It is easier to knead bread dough with an electric mixer than by hand.',
  },
  {
    word: 'lacerate',
    definition: 'to tear flesh jaggedly',
    example: 'Harsh criticism can cut into one\'s pride just as easily as a sharp knife can lacerate the skin.',
  },
  {
    word: 'lackadaisical',
    definition: 'uninterested; listless',
    example: 'The workers, usually lackadaisical by late afternoon, suddenly moved with great energy.',
  },
  {
    word: 'lackey',
    definition: 'a slavish follower',
    example: 'I will not deal with a lackey; I\'ll talk to the boss or no one.',
  },
  {
    word: 'laggard',
    definition: 'a slow person, especially one who falls behind',
    example: 'If you continue to be such a laggard, you\'ll never get out of school.',
  },
  {
    word: 'lament',
    definition: 'to mourn',
    example: 'Thousands of devoted fans lamented the death of the popular singer.',
  },
  {
    word: 'lampoon',
    definition: 'a written satire used to ridicule or attack someone',
    example: 'The lampoon he wrote in the school newspaper angered the football coach and the principal.',
  },
  {
    word: 'languish',
    definition: 'to become weak or feeble',
    example: 'When one becomes depressed, it is easy to languish and lose all hope.',
  },
  {
    word: 'lateral',
    definition: 'to the side',
    example: 'The quarterback made a lateral pass to the fullback.',
  },
  {
    word: 'lax',
    definition: 'careless or negligent',
    example: 'Don\'t become too lax in your studies, or you\'ll fail.',
  },
  {
    word: 'lethal',
    definition: 'deadly; fatal',
    example: 'Because the fumes from the lethal gas were overpowering, many people collapsed.',
  },
  {
    word: 'licentious',
    definition: 'morally unrestrained',
    example: 'Like St. Augustine, many people desire to give up a licentious life, but not just yet.',
  },
  {
    word: 'macabre',
    definition: 'horrible; grim',
    example: 'Dr. Jekyll\'s clean-cut features faded and were replaced by the macabre face of the hideous Mr. Hyde.',
  },
  {
    word: 'mandarin',
    definition: 'an influential person',
    example: 'There were nine classes of mandarins in the Chinese Empire.',
  },
  {
    word: 'martial',
    definition: 'warlike; military',
    example: 'After being defeated, the small country was ruled by martial law for several months.',
  },
  {
    word: 'melee',
    definition: 'a noisy, confused fight',
    example: 'By the time the police arrived, the melee was over.',
  },
  {
    word: 'mendicant',
    definition: 'a beggar',
    example: 'Although he was a mendicant, he begged not for himself but for the poor and hungry.',
  },
  {
    word: 'mesmerize',
    definition: 'to hypnotize',
    example: 'The exquisite music and spinning dancers mesmerized the audience.',
  },
  {
    word: 'minion',
    definition: 'a fawning, servile follower',
    example: 'Although only a minion who usually ran errands, on occasion he filled in for the "great one."',
  },
  {
    word: 'mitigate',
    definition: 'to make less severe; to become milder',
    example: 'The death of the two recruits did not serve to mitigate the rigors of our basic training.',
  },
  {
    word: 'modicum',
    definition: 'a small amount',
    example: 'A modicum of relief from the heat came in the form of a sudden shower.',
  },
  {
    word: 'nadir',
    definition: 'the lowest point',
    example: 'Because of the violence and inhumanity, many thought that civilization had reached its nadir during this period.',
  },
  {
    word: 'narcissistic',
    definition: 'conceited; having excessive self-love and self-absorption',
    example: 'The child star\'s narcissistic attitude kept her from having any friends.',
  },
  {
    word: 'nefarious',
    definition: 'very wicked',
    example: 'One of the most nefarious characters of the Old West was Billy the Kid.',
  },
  {
    word: 'nemesis',
    definition: 'someone or something a person cannot conquer; a hated enemy',
    example: 'Do you know the name of Sherlock Holmes\' nemesis?',
  },
  {
    word: 'neophyte',
    definition: 'a beginner',
    example: 'Although only a neophyte, she outshone the more seasoned performers.',
  },
];

const coordinatingConjunctions = ['and', 'but', 'so', 'or'];

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makeIndependentClause() {
  return pick(independentClauses);
}

function makeSimpleQuestion(): Question {
  const clause = makeIndependentClause();
  return {
    sentence: clause.start,
    answer: 'Simple',
    explanation: 'One independent clause only.',
  };
}

function makeCompoundQuestion(): Question {
  const firstClause = makeIndependentClause();
  let secondClause = makeIndependentClause();
  while (secondClause.start === firstClause.start) {
    secondClause = makeIndependentClause();
  }

  return {
    sentence: `${firstClause.start.slice(0, -1)}, ${pick(coordinatingConjunctions)} ${secondClause.mid}.`,
    answer: 'Compound',
    explanation: 'Two independent clauses joined by a comma and a coordinating conjunction.',
  };
}

function makeComplexQuestion(): Question {
  const clause = makeIndependentClause();
  return {
    sentence: `${pick(subordinateStarters)}, ${clause.mid}.`,
    answer: 'Complex',
    explanation: 'One dependent clause plus one independent clause.',
  };
}

function makeCompoundComplexQuestion(): Question {
  const firstClause = makeIndependentClause();
  let secondClause = makeIndependentClause();
  while (secondClause.start === firstClause.start) {
    secondClause = makeIndependentClause();
  }

  return {
    sentence: `${pick(subordinateStarters)}, ${firstClause.mid}, ${pick(coordinatingConjunctions)} ${secondClause.mid}.`,
    answer: 'Compound-Complex',
    explanation: 'It has one dependent clause and two independent clauses.',
  };
}

function buildDeck() {
  const freshQuestions: Question[] = [];

  for (let i = 0; i < QUESTIONS_PER_TYPE; i += 1) {
    freshQuestions.push(makeSimpleQuestion());
    freshQuestions.push(makeCompoundQuestion());
    freshQuestions.push(makeComplexQuestion());
    freshQuestions.push(makeCompoundComplexQuestion());
  }

  return shuffle(freshQuestions);
}

function buildVocabDeck() {
  return shuffle(vocabEntries).map((entry) => {
    const wrongOptions = shuffle(
      vocabEntries
        .filter((candidate) => candidate.word !== entry.word)
        .map((candidate) => candidate.definition),
    ).slice(0, 3);

    return {
      word: entry.word,
      definition: entry.definition,
      example: entry.example,
      options: shuffle([entry.definition, ...wrongOptions]),
    };
  });
}

export default function EnglishSentencePractice() {
  const [activeTab, setActiveTab] = useState<PracticeTab>('structure');
  const [deck, setDeck] = useState(() => buildDeck());
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<SentenceType | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [vocabDeck, setVocabDeck] = useState(() => buildVocabDeck());
  const [vocabIndex, setVocabIndex] = useState(0);
  const [vocabSelected, setVocabSelected] = useState<string | null>(null);
  const [vocabCorrectCount, setVocabCorrectCount] = useState(0);
  const [vocabStreak, setVocabStreak] = useState(0);

  const current = deck[index];
  const isDone = index >= deck.length;
  const isCorrect = selected === current?.answer;
  const answered = selected !== null;
  const progress = deck.length === 0 ? 0 : Math.round((index / deck.length) * 100);

  const currentVocab = vocabDeck[vocabIndex];
  const vocabDone = vocabIndex >= vocabDeck.length;
  const vocabIsCorrect = vocabSelected === currentVocab?.definition;
  const vocabAnswered = vocabSelected !== null;
  const vocabProgress = vocabDeck.length === 0 ? 0 : Math.round((vocabIndex / vocabDeck.length) * 100);

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
    setDeck(buildDeck());
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setStreak(0);
  }

  function handleVocabAnswer(choice: string) {
    if (vocabAnswered || !currentVocab) return;
    setVocabSelected(choice);
    if (choice === currentVocab.definition) {
      setVocabCorrectCount((count) => count + 1);
      setVocabStreak((count) => count + 1);
      return;
    }
    setVocabStreak(0);
  }

  function nextVocabQuestion() {
    if (!vocabAnswered) return;
    setVocabSelected(null);
    setVocabIndex((value) => value + 1);
  }

  function restartVocab() {
    setVocabDeck(buildVocabDeck());
    setVocabIndex(0);
    setVocabSelected(null);
    setVocabCorrectCount(0);
    setVocabStreak(0);
  }

  return (
    <div className="english-app">
      <div className="glow glow-a" />
      <div className="glow glow-b" />

      <main className="shell">
        <section className="hero">
          <div className="tab-row">
            <button
              className={activeTab === 'structure' ? 'tab-bubble active' : 'tab-bubble'}
              onClick={() => setActiveTab('structure')}
            >
              Sentence Structure
            </button>
            <button
              className={activeTab === 'vocab' ? 'tab-bubble active' : 'tab-bubble'}
              onClick={() => setActiveTab('vocab')}
            >
              Vocab Words
            </button>
          </div>

          <div className="eyebrow">
            {activeTab === 'structure' ? 'Sentence Structure' : 'Vocab Words'}
          </div>
          <h1>
            {activeTab === 'structure' ? 'Sentence Structure Trainer' : 'Vocab Words Trainer'}
          </h1>
          <p className="hero-copy">
            {activeTab === 'structure'
              ? 'Read each sentence and choose whether it is simple, compound, complex, or compound-complex.'
              : 'Choose the correct meaning for each word, then use the example sentence to lock it in.'}
          </p>

          {activeTab === 'structure' && (
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
          )}
        </section>

        {activeTab === 'structure' ? (
          <section className="board">
            <div className="stats">
              <div className="stat-chip">Score: {correctCount}/{deck.length}</div>
              <div className="stat-chip">Streak: {streak}</div>
              <div className="stat-chip">Progress: {progress}%</div>
            </div>

            <div className="progress-track" aria-hidden="true">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>

            {isDone ? (
              <div className="result-card">
                <p className="result-label">Finished</p>
                <h2>You got {correctCount} out of {deck.length}</h2>
                <p className="result-copy">
                  {correctCount === deck.length
                    ? 'Perfect. You crushed it.'
                    : correctCount >= deck.length * 0.8
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
        ) : (
          <section className="board">
            <div className="stats">
              <div className="stat-chip">Score: {vocabCorrectCount}/{vocabDeck.length}</div>
              <div className="stat-chip">Streak: {vocabStreak}</div>
              <div className="stat-chip">Progress: {vocabProgress}%</div>
            </div>

            <div className="progress-track" aria-hidden="true">
              <div className="progress-fill" style={{ width: `${vocabProgress}%` }} />
            </div>

            {vocabDone ? (
              <div className="result-card">
                <p className="result-label">Finished</p>
                <h2>You got {vocabCorrectCount} out of {vocabDeck.length}</h2>
                <p className="result-copy">
                  {vocabCorrectCount === vocabDeck.length
                    ? 'Perfect. You know these words cold.'
                    : vocabCorrectCount >= vocabDeck.length * 0.8
                      ? 'Nice work. One more round and these should stick.'
                      : 'Run it again and pay extra attention to the example sentences.'}
                </p>
                <button className="primary-btn" onClick={restartVocab}>Try Again</button>
              </div>
            ) : (
              <div className="question-card">
                <div className="question-topline">Word {vocabIndex + 1} of {vocabDeck.length}</div>
                <p className="sentence vocab-word">{currentVocab.word}</p>

                <div className="answer-grid">
                  {currentVocab.options.map((option) => {
                    let className = 'answer-btn';
                    if (vocabAnswered && option === currentVocab.definition) className += ' correct';
                    if (vocabAnswered && vocabSelected === option && option !== currentVocab.definition) className += ' wrong';

                    return (
                      <button
                        key={option}
                        className={className}
                        onClick={() => handleVocabAnswer(option)}
                        disabled={vocabAnswered}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {vocabAnswered && (
                  <div className={vocabIsCorrect ? 'feedback success' : 'feedback error'}>
                    <p className="feedback-title">
                      {vocabIsCorrect ? 'Correct' : `Not quite. ${currentVocab.word} means ${currentVocab.definition}.`}
                    </p>
                    <p className="feedback-copy"><strong>Example:</strong> {currentVocab.example}</p>
                    <button className="primary-btn" onClick={nextVocabQuestion}>
                      {vocabIndex === vocabDeck.length - 1 ? 'See Score' : 'Next Word'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
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

        .tab-row {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .tab-bubble {
          border: 1px solid rgba(167, 103, 57, 0.18);
          background: rgba(255, 255, 255, 0.72);
          color: #9b4d1f;
          padding: 0.8rem 1.15rem;
          border-radius: 999px;
          font: inherit;
          font-weight: 800;
          cursor: pointer;
          transition: transform 160ms ease, background 160ms ease, box-shadow 160ms ease;
        }

        .tab-bubble:hover {
          transform: translateY(-1px);
        }

        .tab-bubble.active {
          background: linear-gradient(135deg, #ff9d6c 0%, #ffbf7d 100%);
          color: #fffaf3;
          box-shadow: 0 12px 24px rgba(155, 77, 31, 0.2);
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

        .vocab-word {
          text-transform: lowercase;
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
          text-align: left;
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
