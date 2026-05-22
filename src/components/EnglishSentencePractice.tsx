import { useState } from 'react';

type SentenceType = 'Simple' | 'Compound' | 'Complex' | 'Compound-Complex';
type FigurativeType = 'Simile' | 'Metaphor' | 'Personification' | 'Hyperbole' | 'Idiom';
type PracticeTab = 'structure' | 'figurative' | 'vocab';

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

type FigurativeQuestion = {
  sentence: string;
  answer: FigurativeType;
  explanation: string;
};

const sentenceTypes: SentenceType[] = ['Simple', 'Compound', 'Complex', 'Compound-Complex'];
const figurativeTypes: FigurativeType[] = ['Simile', 'Metaphor', 'Personification', 'Hyperbole', 'Idiom'];
const QUESTION_COUNT = 24;
const QUESTIONS_PER_TYPE = QUESTION_COUNT / sentenceTypes.length;
const FIGURATIVE_QUESTION_COUNT = 20;
const FIGURATIVE_PER_TYPE = FIGURATIVE_QUESTION_COUNT / figurativeTypes.length;

const simpleQuestions: Question[] = [
  { sentence: 'The dog barked at the mail carrier.', answer: 'Simple', explanation: 'One independent clause only.' },
  { sentence: 'Kayli reviewed her notes before class.', answer: 'Simple', explanation: 'One independent clause only.' },
  { sentence: 'The bus arrived right on time.', answer: 'Simple', explanation: 'One independent clause only.' },
  { sentence: 'My little brother built a fort in the living room.', answer: 'Simple', explanation: 'One independent clause only.' },
  { sentence: 'The cookies smelled amazing.', answer: 'Simple', explanation: 'One independent clause only.' },
  { sentence: 'We found our seats before sunset.', answer: 'Simple', explanation: 'One independent clause only.' },
  { sentence: 'The players ran onto the field.', answer: 'Simple', explanation: 'One independent clause only.' },
  { sentence: 'Mia read the chapter carefully.', answer: 'Simple', explanation: 'One independent clause only.' },
  { sentence: 'The library opened early this morning.', answer: 'Simple', explanation: 'One independent clause only.' },
  { sentence: 'The candles flickered in the dark.', answer: 'Simple', explanation: 'One independent clause only.' },
  { sentence: 'Our team practiced after school.', answer: 'Simple', explanation: 'One independent clause only.' },
  { sentence: 'The students lined up quietly.', answer: 'Simple', explanation: 'One independent clause only.' },
];

const compoundQuestions: Question[] = [
  { sentence: 'The bell rang, and everyone hurried to class.', answer: 'Compound', explanation: 'Two independent clauses joined by a comma and a coordinating conjunction.' },
  { sentence: 'I studied for the test, but I still felt nervous.', answer: 'Compound', explanation: 'Two independent clauses joined by a comma and a coordinating conjunction.' },
  { sentence: 'Mom packed snacks, and Dad filled the cooler.', answer: 'Compound', explanation: 'Two independent clauses joined by a comma and a coordinating conjunction.' },
  { sentence: 'The sun set behind the mountains, and the sky turned orange.', answer: 'Compound', explanation: 'Two independent clauses joined by a comma and a coordinating conjunction.' },
  { sentence: 'Noah finished his homework, so he turned on the game.', answer: 'Compound', explanation: 'Two independent clauses joined by a comma and a coordinating conjunction.' },
  { sentence: 'The rain stopped, but the sidewalk stayed wet.', answer: 'Compound', explanation: 'Two independent clauses joined by a comma and a coordinating conjunction.' },
  { sentence: 'The teacher asked a question, and the class answered together.', answer: 'Compound', explanation: 'Two independent clauses joined by a comma and a coordinating conjunction.' },
  { sentence: 'We could leave now, or we could wait for the rest of the group.', answer: 'Compound', explanation: 'Two independent clauses joined by a comma and a coordinating conjunction.' },
  { sentence: 'The movie ended, and everyone clapped.', answer: 'Compound', explanation: 'Two independent clauses joined by a comma and a coordinating conjunction.' },
  { sentence: 'Ava brought the drinks, and Jaden carried the chairs.', answer: 'Compound', explanation: 'Two independent clauses joined by a comma and a coordinating conjunction.' },
  { sentence: 'The hallway was noisy, but she stayed focused.', answer: 'Compound', explanation: 'Two independent clauses joined by a comma and a coordinating conjunction.' },
  { sentence: 'I set an alarm, so I would not miss the bus.', answer: 'Compound', explanation: 'Two independent clauses joined by a comma and a coordinating conjunction.' },
];

const complexQuestions: Question[] = [
  { sentence: 'Because the rain started early, the game was delayed.', answer: 'Complex', explanation: 'One dependent clause plus one independent clause.' },
  { sentence: 'Although I was tired, I finished my homework.', answer: 'Complex', explanation: 'One dependent clause plus one independent clause.' },
  { sentence: 'When the movie ended, we walked to the car.', answer: 'Complex', explanation: 'One dependent clause plus one independent clause.' },
  { sentence: 'If you call me later, I will explain the assignment.', answer: 'Complex', explanation: 'One dependent clause plus one independent clause.' },
  { sentence: 'Since the library was closed, we studied at home.', answer: 'Complex', explanation: 'One dependent clause plus one independent clause.' },
  { sentence: 'After we ate dinner, Dad washed the dishes.', answer: 'Complex', explanation: 'One dependent clause plus one independent clause.' },
  { sentence: 'Even though the test was hard, she stayed calm.', answer: 'Complex', explanation: 'One dependent clause plus one independent clause.' },
  { sentence: 'While the baby slept, Mom folded the laundry.', answer: 'Complex', explanation: 'One dependent clause plus one independent clause.' },
  { sentence: 'Before the concert began, we found our seats.', answer: 'Complex', explanation: 'One dependent clause plus one independent clause.' },
  { sentence: 'Unless you hurry, the bus will leave without us.', answer: 'Complex', explanation: 'One dependent clause plus one independent clause.' },
  { sentence: 'When the timer beeped, the cookies were ready.', answer: 'Complex', explanation: 'One dependent clause plus one independent clause.' },
  { sentence: 'Because the power went out, we lit candles in the kitchen.', answer: 'Complex', explanation: 'One dependent clause plus one independent clause.' },
];

const compoundComplexQuestions: Question[] = [
  { sentence: 'Because the rain started early, the game was delayed, and the fans opened their umbrellas.', answer: 'Compound-Complex', explanation: 'It has one dependent clause and two independent clauses.' },
  { sentence: 'Although I was tired, I finished my homework, and I packed my bag for tomorrow.', answer: 'Compound-Complex', explanation: 'It has one dependent clause and two independent clauses.' },
  { sentence: 'When the movie ended, we walked to the car, but Dad went back for his jacket.', answer: 'Compound-Complex', explanation: 'It has one dependent clause and two independent clauses.' },
  { sentence: 'If you call me later, I will explain the assignment, and I will send you my notes.', answer: 'Compound-Complex', explanation: 'It has one dependent clause and two independent clauses.' },
  { sentence: 'Since the library was closed, we studied at home, and we met online to compare answers.', answer: 'Compound-Complex', explanation: 'It has one dependent clause and two independent clauses.' },
  { sentence: 'After we ate dinner, Dad washed the dishes, and Mom packed tomorrow\'s lunches.', answer: 'Compound-Complex', explanation: 'It has one dependent clause and two independent clauses.' },
  { sentence: 'Even though the test was hard, she stayed calm, and she finished on time.', answer: 'Compound-Complex', explanation: 'It has one dependent clause and two independent clauses.' },
  { sentence: 'While the baby slept, Mom folded the laundry, and I cleaned the kitchen table.', answer: 'Compound-Complex', explanation: 'It has one dependent clause and two independent clauses.' },
  { sentence: 'Before the concert began, we found our seats, and we bought drinks for the show.', answer: 'Compound-Complex', explanation: 'It has one dependent clause and two independent clauses.' },
  { sentence: 'Unless you hurry, the bus will leave without us, and we will miss first period.', answer: 'Compound-Complex', explanation: 'It has one dependent clause and two independent clauses.' },
  { sentence: 'When the timer beeped, the cookies were ready, and the whole kitchen smelled amazing.', answer: 'Compound-Complex', explanation: 'It has one dependent clause and two independent clauses.' },
  { sentence: 'Because the power went out, we lit candles in the kitchen, and we played cards by the window.', answer: 'Compound-Complex', explanation: 'It has one dependent clause and two independent clauses.' },
];

const figurativeQuestions: FigurativeQuestion[] = [
  { sentence: 'Her smile was as bright as the sun.', answer: 'Simile', explanation: 'This is a simile because it compares two unlike things using "as."' },
  { sentence: 'The classroom was a zoo after lunch.', answer: 'Metaphor', explanation: 'This is a metaphor because it directly says one thing is another.' },
  { sentence: 'The wind whispered through the trees.', answer: 'Personification', explanation: 'This is personification because the wind is given a human action.' },
  { sentence: 'I have told you a million times to clean your room.', answer: 'Hyperbole', explanation: 'This is hyperbole because it uses obvious exaggeration.' },
  { sentence: 'After the surprise quiz, Kayli said it was a piece of cake.', answer: 'Idiom', explanation: 'This is an idiom because the phrase means something other than its literal words.' },
  { sentence: 'He ran like lightning to catch the bus.', answer: 'Simile', explanation: 'This is a simile because it compares his speed to lightning using "like."' },
  { sentence: 'Time is a thief that steals our weekends.', answer: 'Metaphor', explanation: 'This is a metaphor because it says time is a thief without using "like" or "as."' },
  { sentence: 'The alarm clock screamed at 6:00 a.m.', answer: 'Personification', explanation: 'This is personification because the alarm clock is described as if it can scream.' },
  { sentence: 'This backpack weighs a ton.', answer: 'Hyperbole', explanation: 'This is hyperbole because the speaker exaggerates the backpack\'s weight.' },
  { sentence: 'When the project finally worked, we were on cloud nine.', answer: 'Idiom', explanation: 'This is an idiom because "on cloud nine" means very happy, not literally in the sky.' },
  { sentence: 'The lake was as smooth as glass.', answer: 'Simile', explanation: 'This is a simile because it compares the lake to glass using "as."' },
  { sentence: 'My little brother is a tornado when he cleans his room.', answer: 'Metaphor', explanation: 'This is a metaphor because it directly compares him to a tornado.' },
  { sentence: 'The moon followed us home.', answer: 'Personification', explanation: 'This is personification because the moon is given the human ability to follow.' },
  { sentence: 'I waited forever for the bell to ring.', answer: 'Hyperbole', explanation: 'This is hyperbole because "forever" is an exaggeration.' },
  { sentence: 'Before the game, our coach told us to keep our eyes peeled.', answer: 'Idiom', explanation: 'This is an idiom because it means to watch carefully, not literally peel your eyes.' },
  { sentence: 'The baby slept like a rock.', answer: 'Simile', explanation: 'This is a simile because it uses "like" to make a comparison.' },
  { sentence: 'Her voice was music to the audience.', answer: 'Metaphor', explanation: 'This is a metaphor because it directly compares her voice to music.' },
  { sentence: 'The old floorboards groaned under our feet.', answer: 'Personification', explanation: 'This is personification because the floorboards are given a human-like action.' },
  { sentence: 'I am starving to death after practice.', answer: 'Hyperbole', explanation: 'This is hyperbole because the speaker exaggerates how hungry they feel.' },
  { sentence: 'When the teacher changed the deadline, the whole class breathed a sigh of relief.', answer: 'Idiom', explanation: 'This is an idiom because the phrase means everyone felt relieved.' },
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

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function takeRandom<T>(items: T[], count: number) {
  return shuffle(items).slice(0, count);
}

function buildDeck() {
  return shuffle([
    ...takeRandom(simpleQuestions, QUESTIONS_PER_TYPE),
    ...takeRandom(compoundQuestions, QUESTIONS_PER_TYPE),
    ...takeRandom(complexQuestions, QUESTIONS_PER_TYPE),
    ...takeRandom(compoundComplexQuestions, QUESTIONS_PER_TYPE),
  ]);
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

function buildFigurativeDeck() {
  const grouped = figurativeTypes.flatMap((type) =>
    takeRandom(
      figurativeQuestions.filter((question) => question.answer === type),
      FIGURATIVE_PER_TYPE,
    ),
  );

  return shuffle(grouped).map((entry) => ({
    ...entry,
    options: shuffle(figurativeTypes),
  }));
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
  const [figurativeDeck, setFigurativeDeck] = useState(() => buildFigurativeDeck());
  const [figurativeIndex, setFigurativeIndex] = useState(0);
  const [figurativeSelected, setFigurativeSelected] = useState<FigurativeType | null>(null);
  const [figurativeCorrectCount, setFigurativeCorrectCount] = useState(0);
  const [figurativeStreak, setFigurativeStreak] = useState(0);

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
  const currentFigurative = figurativeDeck[figurativeIndex];
  const figurativeDone = figurativeIndex >= figurativeDeck.length;
  const figurativeIsCorrect = figurativeSelected === currentFigurative?.answer;
  const figurativeAnswered = figurativeSelected !== null;
  const figurativeProgress = figurativeDeck.length === 0 ? 0 : Math.round((figurativeIndex / figurativeDeck.length) * 100);

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

  function handleFigurativeAnswer(choice: FigurativeType) {
    if (figurativeAnswered || !currentFigurative) return;
    setFigurativeSelected(choice);
    if (choice === currentFigurative.answer) {
      setFigurativeCorrectCount((count) => count + 1);
      setFigurativeStreak((count) => count + 1);
      return;
    }
    setFigurativeStreak(0);
  }

  function nextFigurativeQuestion() {
    if (!figurativeAnswered) return;
    setFigurativeSelected(null);
    setFigurativeIndex((value) => value + 1);
  }

  function restartFigurative() {
    setFigurativeDeck(buildFigurativeDeck());
    setFigurativeIndex(0);
    setFigurativeSelected(null);
    setFigurativeCorrectCount(0);
    setFigurativeStreak(0);
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
              className={activeTab === 'figurative' ? 'tab-bubble active' : 'tab-bubble'}
              onClick={() => setActiveTab('figurative')}
            >
              Figurative Language
            </button>
            <button
              className={activeTab === 'vocab' ? 'tab-bubble active' : 'tab-bubble'}
              onClick={() => setActiveTab('vocab')}
            >
              Vocab Words
            </button>
          </div>

          <div className="eyebrow">
            {activeTab === 'structure'
              ? 'Sentence Structure'
              : activeTab === 'figurative'
                ? 'Figurative Language'
                : 'Vocab Words'}
          </div>
          <h1>
            {activeTab === 'structure'
              ? 'Sentence Structure Trainer'
              : activeTab === 'figurative'
                ? 'Figurative Language Trainer'
                : 'Vocab Words Trainer'}
          </h1>
          <p className="hero-copy">
            {activeTab === 'structure'
              ? 'Read each sentence and choose whether it is simple, compound, complex, or compound-complex.'
              : activeTab === 'figurative'
                ? 'Read each sentence and choose which type of figurative language it uses.'
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

          {activeTab === 'figurative' && (
            <div className="hint-grid">
              <div className="hint-card">
                <strong>Simile</strong>
                <span>Comparison using like or as</span>
              </div>
              <div className="hint-card">
                <strong>Metaphor</strong>
                <span>Direct comparison without like or as</span>
              </div>
              <div className="hint-card">
                <strong>Personification</strong>
                <span>Gives human traits to nonhuman things</span>
              </div>
              <div className="hint-card">
                <strong>Hyperbole</strong>
                <span>Extreme exaggeration</span>
              </div>
              <div className="hint-card hint-card-wide">
                <strong>Idiom</strong>
                <span>A phrase that means something different from the literal words</span>
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
        ) : activeTab === 'figurative' ? (
          <section className="board">
            <div className="stats">
              <div className="stat-chip">Score: {figurativeCorrectCount}/{figurativeDeck.length}</div>
              <div className="stat-chip">Streak: {figurativeStreak}</div>
              <div className="stat-chip">Progress: {figurativeProgress}%</div>
            </div>

            <div className="progress-track" aria-hidden="true">
              <div className="progress-fill" style={{ width: `${figurativeProgress}%` }} />
            </div>

            {figurativeDone ? (
              <div className="result-card">
                <p className="result-label">Finished</p>
                <h2>You got {figurativeCorrectCount} out of {figurativeDeck.length}</h2>
                <p className="result-copy">
                  {figurativeCorrectCount === figurativeDeck.length
                    ? 'Perfect. You spotted every one.'
                    : figurativeCorrectCount >= figurativeDeck.length * 0.8
                      ? 'Nice work. You are catching the patterns.'
                      : 'Run it again and focus on the clue words in each sentence.'}
                </p>
                <button className="primary-btn" onClick={restartFigurative}>Try Again</button>
              </div>
            ) : (
              <div className="question-card">
                <div className="question-topline">Question {figurativeIndex + 1} of {figurativeDeck.length}</div>
                <p className="sentence">{currentFigurative.sentence}</p>

                <div className="answer-grid answer-grid-figurative">
                  {currentFigurative.options.map((type) => {
                    let className = 'answer-btn';
                    if (figurativeAnswered && type === currentFigurative.answer) className += ' correct';
                    if (figurativeAnswered && figurativeSelected === type && type !== currentFigurative.answer) className += ' wrong';

                    return (
                      <button
                        key={type}
                        className={className}
                        onClick={() => handleFigurativeAnswer(type)}
                        disabled={figurativeAnswered}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>

                {figurativeAnswered && (
                  <div className={figurativeIsCorrect ? 'feedback success' : 'feedback error'}>
                    <p className="feedback-title">
                      {figurativeIsCorrect ? 'Correct' : `Not quite. The answer is ${currentFigurative.answer}.`}
                    </p>
                    <p className="feedback-copy">{currentFigurative.explanation}</p>
                    <button className="primary-btn" onClick={nextFigurativeQuestion}>
                      {figurativeIndex === figurativeDeck.length - 1 ? 'See Score' : 'Next Sentence'}
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

        .hint-card-wide {
          grid-column: 1 / -1;
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

        .answer-grid-figurative {
          grid-template-columns: repeat(3, minmax(0, 1fr));
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
          .answer-grid,
          .answer-grid-figurative {
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
