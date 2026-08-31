import { useMemo, useState } from 'react';

type PanelKey = 'learn' | 'practice' | 'vocab';

type VocabularyCard = {
  term: string;
  definition: string;
  clue: string;
};

type ExamplePoint = {
  x: number;
  y: number;
};

type QuizQuestion = {
  prompt: string;
  choices: string[];
  answer: string;
  explanation: string;
};

type GuidedExample = {
  title: string;
  steps: string[];
  answer: string;
};

type MappingExample = {
  title: string;
  steps: string[];
  pairs: ExamplePoint[];
  answer: string;
};

type LearnSection = {
  key: string;
  title: string;
  preview: string;
  badge: string;
  bullets?: string[];
  steps?: string[];
  answer?: string;
  pairs?: ExamplePoint[];
  graphNote?: string;
};

type PracticePrompt = {
  prompt: string;
  hint: string;
  answer: string;
  answerFormat: string;
  acceptedAnswers: string[];
  teaching: string;
};

type MathLesson = {
  key: string;
  label: string;
  title: string;
  eyebrow: string;
  description: string;
  starterTalk: string[];
  rule: string;
  notes: string[];
  checkpoints: string[];
  mistakeAlerts: string[];
  notationExample: GuidedExample;
  mappingExample: MappingExample;
  guidedExamples: GuidedExample[];
  practicePrompts: PracticePrompt[];
  vocabulary: VocabularyCard[];
  examplePoints: ExamplePoint[];
  quiz: QuizQuestion[];
};

type LessonOption = {
  key: string;
  label: string;
  teaser: string;
  status: 'available' | 'soon';
  content?: MathLesson;
};

type MathUnit = {
  key: string;
  label: string;
  title: string;
  eyebrow: string;
  description: string;
  lessons: LessonOption[];
};

const UNITS: MathUnit[] = [
  {
    key: 'unit-2',
    label: 'Unit 2',
    title: 'Relations and Functions',
    eyebrow: 'Algebra 2 Honors',
    description:
      'Pick your unit first, then choose the lesson you want. Lesson 1 is ready now, and Lesson 2 already has a slot waiting for it.',
    lessons: [
      {
        key: 'relations-functions-lesson-1',
        label: 'Lesson 1',
        teaser: 'Basics, function notation, and relation mapping',
        status: 'available',
        content: {
          key: 'relations-functions-lesson-1',
          label: 'Lesson 1',
          title: 'Relations and Functions',
          eyebrow: 'Algebra 2 Honors Unit 2',
          description:
            'This lesson starts from the very beginning. It teaches what the words mean, what to look at first, how to solve the f(x) thing, and how to turn a relation into a mapping.',
          starterTalk: [
            'In this unit, most problems are really asking you to match inputs with outputs.',
            'If you can tell what goes in, what comes out, and whether one input is trying to have two answers, you are already doing the important part.',
            'We are going to keep it super simple: look at x, look at y, then ask one small question at a time.',
          ],
          rule: 'For the graph in the notes page, the pattern is y = x - 2.',
          notes: [
            'An ordered pair looks like this: (x, y). The first number is x. The second number is y.',
            'A relation is just a group of ordered pairs.',
            'Domain is a fancy word for all the x-values.',
            'Range is a fancy word for all the y-values.',
            'A function means one input can only have one output.',
            'In f(x), x goes in and f(x) comes out.',
          ],
          checkpoints: [
            'Step 1: Find the x-values. Those are the inputs.',
            'Step 2: Find the y-values. Those are the outputs.',
            'Step 3: If the question asks for domain, list the x-values.',
            'Step 4: If the question asks for range, list the y-values.',
            'Step 5: If the question asks “is it a function?”, check whether any x-value repeats with a different y-value.',
            'Step 6: If the question asks for f(3) or f(-2), replace x with that number and solve.',
            'Step 7: If the question asks for a mapping, draw arrows from each x-value to its matching y-value.',
          ],
          mistakeAlerts: [
            'Do not mix up domain and range. Domain = x-values. Range = y-values.',
            'Do not look at y-values first when checking if it is a function. Check the x-values first.',
            'Repeated y-values are okay. Repeated x-values with different y-values are the problem.',
            'If you feel lost, go back to the ordered pairs and separate first numbers from second numbers.',
            'In f(4), the 4 replaces x. Do not multiply f times 4.',
          ],
          notationExample: {
            title: 'How to solve the f(x) equation thing',
            steps: [
              'Look at the rule f(x) = x + 4.',
              'If the problem asks for f(3), replace x with 3.',
              'Now the rule says 3 + 4.',
              'Solve it: 3 + 4 = 7.',
              'So f(3) = 7.',
            ],
            answer: 'f(3) = 7',
          },
          mappingExample: {
            title: 'How to make a mapping for a relation',
            steps: [
              'Start with the ordered pairs (1, 4), (2, 5), (3, 6).',
              'Put the x-values on one side: 1, 2, 3.',
              'Put the y-values on the other side: 4, 5, 6.',
              'Draw an arrow from each x-value to the y-value in the same ordered pair.',
            ],
            pairs: [
              { x: 1, y: 4 },
              { x: 2, y: 5 },
              { x: 3, y: 6 },
            ],
            answer: '1 -> 4, 2 -> 5, 3 -> 6',
          },
          guidedExamples: [
            {
              title: 'First learn how to read an ordered pair',
              steps: [
                'Look at (3, 8).',
                'The first number is x, so x = 3.',
                'The second number is y, so y = 8.',
                'That means 3 is the input and 8 is the output.',
              ],
              answer: 'In (3, 8), input = 3 and output = 8',
            },
            {
              title: 'Now find the domain and range',
              steps: [
                'Look at the ordered pairs (1, 4), (2, 5), (3, 6).',
                'Take only the first numbers: 1, 2, 3.',
                'Those first numbers are the x-values, so they are the domain.',
                'Now take the second numbers: 4, 5, 6.',
                'Those second numbers are the y-values, so they are the range.',
              ],
              answer: 'Domain = {1, 2, 3}, Range = {4, 5, 6}',
            },
            {
              title: 'How to tell if it is a function',
              steps: [
                'Look at the pairs (2, 7), (3, 8), (2, 9).',
                'Ignore the y-values for one second and only read the x-values: 2, 3, 2.',
                'The x-value 2 shows up twice.',
                'Now check whether it is matched with the same y-value both times. It is not: one goes to 7 and one goes to 9.',
                'That means one input is trying to have two answers, so it is not a function.',
              ],
              answer: 'Not a function',
            },
            {
              title: 'Use the rule y = x - 2',
              steps: [
                'Plug in x = 5.',
                'Subtract 2 from 5.',
                'That gives y = 3.',
                'So the ordered pair is (5, 3).',
              ],
              answer: '(5, 3)',
            },
          ],
          practicePrompts: [
            {
              prompt: 'Find the domain and range of (0, 2), (1, 4), (2, 6).',
              hint: 'Take the x-values for the domain and the y-values for the range.',
              answer: 'Domain = {0, 1, 2}; Range = {2, 4, 6}',
              answerFormat: 'Domain = {x-values}; Range = {y-values}',
              acceptedAnswers: [
                'domain = {0, 1, 2}; range = {2, 4, 6}',
                'domain={0,1,2};range={2,4,6}',
                '{0,1,2} and {2,4,6}',
                'domain {0, 1, 2} range {2, 4, 6}',
              ],
              teaching: 'Start by separating inputs from outputs. The x-values are the domain, and the y-values are the range.',
            },
            {
              prompt: 'Is (4, 1), (5, 2), (4, 3) a function?',
              hint: 'Check whether one x-value is paired with two different y-values.',
              answer: 'No. The input 4 has two outputs: 1 and 3.',
              answerFormat: 'Not a function',
              acceptedAnswers: [
                'no',
                'not a function',
                'no, it is not a function',
                'no the input 4 has two outputs',
                'input 4 has two outputs',
              ],
              teaching: 'Look only at the x-values first. Since 4 is matched with both 1 and 3, one input has two outputs, so it is not a function.',
            },
            {
              prompt: 'Use y = x - 2. What is y when x = 9?',
              hint: 'Substitute 9 for x and subtract 2.',
              answer: '7',
              answerFormat: 'number only',
              acceptedAnswers: ['7', 'y = 7'],
              teaching: 'Plug the x-value into the rule. Replace x with 9, then do 9 - 2 to get 7.',
            },
            {
              prompt: 'Use y = x - 2. What ordered pair do you get when x = -1?',
              hint: 'Start with -1, then subtract 2 more.',
              answer: '(-1, -3)',
              answerFormat: '(x, y)',
              acceptedAnswers: [
                '(-1, -3)',
                '(-1,-3)',
                '-1, -3',
                '-1,-3',
              ],
              teaching: 'Use the rule first: y = -1 - 2, so y = -3. Then write the ordered pair as (x, y) = (-1, -3).',
            },
            {
              prompt: 'If f(x) = x + 4, what is f(6)?',
              hint: 'Replace x with 6, then solve.',
              answer: '10',
              answerFormat: 'number only',
              acceptedAnswers: ['10', 'f(6) = 10', '10.0'],
              teaching: 'Write 6 in place of x. That gives 6 + 4, which equals 10.',
            },
            {
              prompt: 'Make the mapping for (2, 5), (4, 7), (6, 9).',
              hint: 'Each x-value points to the y-value in the same ordered pair.',
              answer: '2 -> 5, 4 -> 7, 6 -> 9',
              answerFormat: 'x -> y, x -> y, x -> y',
              acceptedAnswers: [
                '2 -> 5, 4 -> 7, 6 -> 9',
                '2→5 4→7 6→9',
                '2 to 5 4 to 7 6 to 9',
                '2 maps to 5, 4 maps to 7, 6 maps to 9',
              ],
              teaching: 'Read each ordered pair one at a time. The first number points to the second number, so 2 goes to 5, 4 goes to 7, and 6 goes to 9.',
            },
          ],
          vocabulary: [
            {
              term: 'Relation',
              definition: 'A set of ordered pairs, inputs, and outputs.',
              clue: 'Think: a list of x and y partners.',
            },
            {
              term: 'Domain',
              definition: 'All of the input values, or x-values.',
              clue: 'Domain = what goes in.',
            },
            {
              term: 'Range',
              definition: 'All of the output values, or y-values.',
              clue: 'Range = what comes out.',
            },
            {
              term: 'Function',
              definition: 'A relation where each input has exactly one output.',
              clue: 'One x cannot point to two different y-values.',
            },
            {
              term: 'Vertical Line Test',
              definition: 'If a vertical line hits the graph more than once, it is not a function.',
              clue: 'More than one hit means not a function.',
            },
            {
              term: 'Function Notation',
              definition: 'f(x) names a function and shows the output for input x.',
              clue: 'Read it as “f of x,” not “f times x.”',
            },
            {
              term: 'Independent Variable',
              definition: 'The input value, usually x.',
              clue: 'It stands on its own first.',
            },
            {
              term: 'Dependent Variable',
              definition: 'The output value, usually y or f(x).',
              clue: 'It depends on the input.',
            },
          ],
          examplePoints: [
            { x: -3, y: -5 },
            { x: -2, y: -4 },
            { x: -1, y: -3 },
            { x: 0, y: -2 },
            { x: 1, y: -1 },
            { x: 2, y: 0 },
            { x: 3, y: 1 },
            { x: 4, y: 2 },
            { x: 5, y: 3 },
          ],
          quiz: [
            {
              prompt: 'What is the domain of a relation?',
              choices: ['All x-values', 'All y-values', 'Only the positive numbers', 'The rule of the graph'],
              answer: 'All x-values',
              explanation: 'The domain is the set of every input, which means every x-value.',
            },
            {
              prompt: 'What is the range of the ordered pairs (2, 5), (3, 6), (4, 7)?',
              choices: ['2, 3, 4', '5, 6, 7', '2, 5, 7', '3, 4, 5'],
              answer: '5, 6, 7',
              explanation: 'The range is made from the y-values, so use 5, 6, and 7.',
            },
            {
              prompt: 'Which statement makes a relation a function?',
              choices: [
                'Each input has exactly one output',
                'Each output has exactly one input',
                'The graph must be a line',
                'All numbers must be positive',
              ],
              answer: 'Each input has exactly one output',
              explanation: 'A function is about inputs. One x can only match one y.',
            },
            {
              prompt: 'If a vertical line crosses a graph in two places, what do you know?',
              choices: ['It is a function', 'It is not a function', 'It has no domain', 'It has no range'],
              answer: 'It is not a function',
              explanation: 'Two hits on one vertical line means one x has more than one y-value.',
            },
            {
              prompt: 'In f(x), which value is the input?',
              choices: ['f', 'x', 'y', 'the slope'],
              answer: 'x',
              explanation: 'The x-value is the input. The output is written as f(x).',
            },
            {
              prompt: 'If f(x) = x + 4, what is f(2)?',
              choices: ['2', '4', '6', '8'],
              answer: '6',
              explanation: 'Replace x with 2. Then solve 2 + 4 = 6.',
            },
            {
              prompt: 'For the table pattern y = x - 2, what is y when x = 6?',
              choices: ['8', '6', '4', '-4'],
              answer: '4',
              explanation: 'Substitute 6 for x: 6 - 2 = 4.',
            },
            {
              prompt: 'Which list is a relation that is NOT a function?',
              choices: ['(1, 2), (2, 3), (3, 4)', '(4, 1), (4, 2), (5, 3)', '(0, 0), (1, 1), (2, 2)', '(2, 5), (3, 6), (4, 7)'],
              answer: '(4, 1), (4, 2), (5, 3)',
              explanation: 'The input 4 is paired with two different outputs, so it fails the function rule.',
            },
            {
              prompt: 'Which mapping matches the relation (1, 3), (2, 4)?',
              choices: ['1 -> 3 and 2 -> 4', '1 -> 2 and 3 -> 4', '3 -> 1 and 4 -> 2', '1 -> 4 and 2 -> 3'],
              answer: '1 -> 3 and 2 -> 4',
              explanation: 'A mapping keeps the first number as the input and the second number as the output.',
            },
            {
              prompt: 'Which variable is usually the dependent variable?',
              choices: ['x', 'y', 'input', 'domain'],
              answer: 'y',
              explanation: 'The dependent variable is usually y because it depends on the input x.',
            },
          ],
        },
      },
      {
        key: 'relations-functions-lesson-2',
        label: 'Lesson 2',
        teaser: 'Waiting for the next notes',
        status: 'soon',
      },
    ],
  },
];

function getFirstAvailableLessonKey(unit: MathUnit) {
  return unit.lessons.find((lesson) => lesson.status === 'available' && lesson.content)?.key ?? '';
}

function getLessonContent(unit: MathUnit, lessonKey: string) {
  const selectedLesson = unit.lessons.find(
    (lesson) => lesson.key === lessonKey && lesson.status === 'available' && lesson.content,
  );
  const fallbackLesson = unit.lessons.find(
    (lesson) => lesson.status === 'available' && lesson.content,
  );
  return (selectedLesson ?? fallbackLesson)?.content as MathLesson;
}

const DEFAULT_UNIT = UNITS[0];
const DEFAULT_LESSON_KEY = getFirstAvailableLessonKey(DEFAULT_UNIT);

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function MathPractice() {
  const [activeUnitKey, setActiveUnitKey] = useState(DEFAULT_UNIT.key);
  const [activeLessonKey, setActiveLessonKey] = useState(DEFAULT_LESSON_KEY);
  const [activePanel, setActivePanel] = useState<PanelKey>('learn');
  const [openLearnSection, setOpenLearnSection] = useState('range-domain');
  const [vocabReveal, setVocabReveal] = useState<Record<string, boolean>>({});
  const [quizDeck, setQuizDeck] = useState(() =>
    getLessonContent(DEFAULT_UNIT, DEFAULT_LESSON_KEY).quiz.map((question) => ({
      ...question,
      choices: shuffle(question.choices),
    })),
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceInput, setPracticeInput] = useState('');
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [practiceCorrect, setPracticeCorrect] = useState(false);

  const activeUnit = useMemo(
    () => UNITS.find((unit) => unit.key === activeUnitKey) ?? DEFAULT_UNIT,
    [activeUnitKey],
  );

  const activeLessonOption = useMemo(
    () =>
      activeUnit.lessons.find(
        (lesson) => lesson.key === activeLessonKey && lesson.status === 'available' && lesson.content,
      ) ??
      activeUnit.lessons.find((lesson) => lesson.status === 'available' && lesson.content),
    [activeLessonKey, activeUnit],
  );

  const activeLesson = activeLessonOption?.content ?? getLessonContent(activeUnit, activeLessonKey);

  const currentQuestion = quizDeck[questionIndex];
  const currentPractice = activeLesson.practicePrompts[practiceIndex];
  const answered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === currentQuestion?.answer;
  const progress = quizDeck.length === 0 ? 0 : Math.round((questionIndex / quizDeck.length) * 100);
  const practiceProgress = activeLesson.practicePrompts.length === 0 ? 0 : Math.round((practiceIndex / activeLesson.practicePrompts.length) * 100);
  const learnSections: LearnSection[] = [
    {
      key: 'range-domain',
      title: 'How to find range and domain',
      preview: 'Grab the x-values for domain and the y-values for range.',
      badge: 'Start here',
      bullets: [
        activeLesson.notes[0],
        activeLesson.notes[2],
        activeLesson.notes[3],
        'Example: for (1, 4), (2, 5), (3, 6), domain = {1, 2, 3} and range = {4, 5, 6}.',
      ],
    },
    {
      key: 'map-relations',
      title: 'How to map relations',
      preview: 'Put inputs on one side, outputs on the other, then draw arrows.',
      badge: 'Mapping',
      steps: activeLesson.mappingExample.steps,
      answer: activeLesson.mappingExample.answer,
      pairs: activeLesson.mappingExample.pairs,
    },
    {
      key: 'recognize-function',
      title: 'How to recognize a function',
      preview: 'One input can only have one output.',
      badge: 'Function rule',
      bullets: [
        activeLesson.notes[4],
        'Check the x-values first, not the y-values.',
        'If one x-value matches two different y-values, it is not a function.',
        'Repeated y-values are okay. Repeated x-values with different outputs are the problem.',
      ],
    },
    {
      key: 'table-of-rules',
      title: 'Creating a table of rules',
      preview: 'Plug x-values into the rule and fill in the y-column.',
      badge: activeLesson.rule,
      bullets: [
        'Start with the rule.',
        'Pick an x-value.',
        'Substitute the x-value into the rule.',
        'Solve for y and write the ordered pair in the table.',
      ],
      graphNote: 'Use the rule y = x - 2. If x = 5, then y = 3, so the point is (5, 3).',
    },
    {
      key: 'vertical-line-test',
      title: 'Vertical line test',
      preview: 'If one vertical line hits the graph twice, it is not a function.',
      badge: 'Graph check',
      bullets: [
        'Imagine a straight vertical line moving across the graph.',
        'If it touches the graph only once at every spot, it passes.',
        'If it touches the graph more than once in one place, it fails.',
        activeLesson.vocabulary.find((card) => card.term === 'Vertical Line Test')?.definition ?? '',
      ].filter(Boolean),
    },
    {
      key: 'writing-functions',
      title: 'Writing functions',
      preview: 'Write the rule so each input has exactly one output.',
      badge: 'Rule writing',
      bullets: [
        'Functions are often written like y = x - 2 or f(x) = x + 4.',
        'The expression on the right tells you what to do to x.',
        'After you write the rule, test it with an x-value to make sure it works.',
        'If the same x would give two different answers, it is not a valid function rule.',
      ],
    },
    {
      key: 'function-notation',
      title: 'Function notation',
      preview: 'f(x) means the output of a function when x goes in.',
      badge: 'Read the symbol',
      bullets: [
        activeLesson.notes[5],
        'Read f(x) as "f of x."',
        'The x inside the parentheses is the input.',
        'The answer you get is the output.',
      ],
    },
    {
      key: 'fx-equations',
      title: 'f(x) equations',
      preview: 'Replace x with the number you are given, then solve.',
      badge: 'Plug it in',
      steps: activeLesson.notationExample.steps,
      answer: activeLesson.notationExample.answer,
    },
  ];

  function normalizeAnswer(value: string) {
    return value
      .toLowerCase()
      .replace(/->|=>|→/g, ' to ')
      .replace(/[(){}[\];:=]/g, ' ')
      .replace(/,/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function matchesPracticeAnswer(guess: string, answer: string) {
    const normalizedGuess = normalizeAnswer(guess);
    const normalizedAnswer = normalizeAnswer(answer);

    return (
      normalizedGuess === normalizedAnswer ||
      normalizedGuess.includes(normalizedAnswer) ||
      normalizedAnswer.includes(normalizedGuess)
    );
  }

  function switchUnit(unitKey: string) {
    const unit = UNITS.find((entry) => entry.key === unitKey) ?? DEFAULT_UNIT;
    const lessonKey = getFirstAvailableLessonKey(unit);

    setActiveUnitKey(unit.key);
    setActiveLessonKey(lessonKey);
    setActivePanel('learn');
    setOpenLearnSection('range-domain');
    setVocabReveal({});
    restartQuiz(unit.key, lessonKey);
    restartPractice(unit.key, lessonKey);
  }

  function switchLesson(lessonKey: string) {
    const lesson = activeUnit.lessons.find(
      (entry) => entry.key === lessonKey && entry.status === 'available' && entry.content,
    );
    if (!lesson) return;

    setActiveLessonKey(lessonKey);
    setActivePanel('learn');
    setOpenLearnSection('range-domain');
    setVocabReveal({});
    restartQuiz(activeUnit.key, lessonKey);
    restartPractice(activeUnit.key, lessonKey);
  }

  function restartQuiz(unitKey = activeUnit.key, lessonKey = activeLesson.key) {
    const unit = UNITS.find((entry) => entry.key === unitKey) ?? DEFAULT_UNIT;
    const lesson = getLessonContent(unit, lessonKey);
    setQuizDeck(
      lesson.quiz.map((question) => ({
        ...question,
        choices: shuffle(question.choices),
      })),
    );
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setCorrectCount(0);
    setFinished(false);
  }

  function handleAnswer(choice: string) {
    if (answered || finished) return;
    setSelectedAnswer(choice);
    if (choice === currentQuestion.answer) {
      setCorrectCount((count) => count + 1);
    }
  }

  function nextQuestion() {
    if (questionIndex === quizDeck.length - 1) {
      setFinished(true);
      return;
    }

    setQuestionIndex((index) => index + 1);
    setSelectedAnswer(null);
  }

  function toggleVocab(term: string) {
    setVocabReveal((current) => ({
      ...current,
      [term]: !current[term],
    }));
  }

  function restartPractice(unitKey = activeUnit.key, lessonKey = activeLesson.key) {
    const unit = UNITS.find((entry) => entry.key === unitKey) ?? DEFAULT_UNIT;
    const lesson = getLessonContent(unit, lessonKey);
    setPracticeIndex(0);
    setPracticeInput('');
    setPracticeSubmitted(false);
    setPracticeCorrect(false);
    if (lesson.practicePrompts.length === 0) {
      setPracticeIndex(0);
    }
  }

  function submitPracticeAnswer() {
    if (practiceSubmitted) return;
    const guess = practiceInput.trim();
    if (!guess) return;

    const isMatch = currentPractice.acceptedAnswers.some(
      (answer) => matchesPracticeAnswer(guess, answer),
    );

    setPracticeCorrect(isMatch);
    setPracticeSubmitted(true);
  }

  function nextPractice() {
    const nextIndex = (practiceIndex + 1) % activeLesson.practicePrompts.length;
    setPracticeIndex(nextIndex);
    setPracticeInput('');
    setPracticeSubmitted(false);
    setPracticeCorrect(false);
  }

  return (
    <div className="math-app">
      <div className="glow glow-a" />
      <div className="glow glow-b" />

      <main className="shell">
        <section className="hero">
          <div className="topic-row">
            {UNITS.map((unit) => (
              <button
                key={unit.key}
                className={unit.key === activeUnit.key ? 'topic-bubble active' : 'topic-bubble'}
                onClick={() => switchUnit(unit.key)}
              >
                {unit.label}
              </button>
            ))}
            <div className="topic-bubble muted">More topics soon</div>
          </div>

          <div className="lesson-row">
            {activeUnit.lessons.map((lesson) => (
              <button
                key={lesson.key}
                className={lesson.key === activeLesson.key ? 'lesson-bubble active' : 'lesson-bubble'}
                onClick={() => switchLesson(lesson.key)}
                disabled={lesson.status !== 'available'}
                type="button"
              >
                <strong>{lesson.label}</strong>
                <span>{lesson.teaser}</span>
              </button>
            ))}
          </div>

          <div className="panel-row">
            <button
              className={activePanel === 'learn' ? 'tab-bubble active' : 'tab-bubble'}
              onClick={() => setActivePanel('learn')}
            >
              Learn It
            </button>
            <button
              className={activePanel === 'practice' ? 'tab-bubble active' : 'tab-bubble'}
              onClick={() => setActivePanel('practice')}
            >
              Practice It
            </button>
            <button
              className={activePanel === 'vocab' ? 'tab-bubble active' : 'tab-bubble'}
              onClick={() => setActivePanel('vocab')}
            >
              Vocabulary
            </button>
          </div>

          <div className="eyebrow">{activeUnit.eyebrow}</div>
          <h1>{activeUnit.title}</h1>
          <p className="hero-copy">{activeUnit.description}</p>
          <p className="hero-mini">{activeLesson.label}: {activeLesson.description}</p>
        </section>

        {activePanel === 'learn' && (
          <section className="stack">
            <div className="board">
              <div className="section-head">
                <div>
                  <p className="section-label">Learn It</p>
                  <h2>Tap a topic to open it</h2>
                </div>
                <div className="graph-badge">8 lesson sections</div>
              </div>

              <div className="learn-grid">
                {learnSections.map((section) => {
                  const expanded = openLearnSection === section.key;

                  return (
                    <button
                      key={section.key}
                      className={expanded ? 'learn-card expanded' : 'learn-card'}
                      type="button"
                      onClick={() => setOpenLearnSection(expanded ? '' : section.key)}
                    >
                      <div className="learn-card-top">
                        <div>
                          <p className="learn-badge">{section.badge}</p>
                          <h3>{section.title}</h3>
                        </div>
                        <span className="learn-toggle">{expanded ? '−' : '+'}</span>
                      </div>
                      <p className="learn-preview">{section.preview}</p>

                      {expanded && (
                        <div className="learn-detail">
                          {section.bullets && (
                            <ul className="learn-list">
                              {section.bullets.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          )}

                          {section.steps && (
                            <ol className="step-list">
                              {section.steps.map((step) => (
                                <li key={step}>{step}</li>
                              ))}
                            </ol>
                          )}

                          {section.pairs && (
                            <div className="mapping-mini">
                              {section.pairs.map((pair) => (
                                <div className="mapping-row-item" key={`${pair.x}-${pair.y}`}>
                                  <span className="mapping-pill">{pair.x}</span>
                                  <span className="mapping-arrow">→</span>
                                  <span className="mapping-pill output">{pair.y}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {section.graphNote && (
                            <div className="graph-note">
                              <strong>Example:</strong> {section.graphNote}
                            </div>
                          )}

                          {section.answer && <p className="answer-line"><strong>Answer:</strong> {section.answer}</p>}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {activePanel === 'practice' && (
          <section className="stack">
            <div className="board">
              <div className="section-head">
                <div>
                  <p className="section-label">Guided Practice</p>
                  <h2>See the steps before you try it</h2>
                </div>
                <div className="rule-pill">Worked examples</div>
              </div>

              <div className="practice-stack">
                {activeLesson.guidedExamples.map((example) => (
                  <article className="practice-card" key={example.title}>
                    <h3>{example.title}</h3>
                    <ol className="step-list">
                      {example.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                    <p className="answer-line"><strong>Answer:</strong> {example.answer}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="board">
              <div className="section-head">
                <div>
                  <p className="section-label">Try It</p>
                  <h2>Type your answer and get feedback</h2>
                </div>
                <div className="graph-badge">Like a tutor</div>
              </div>

              <div className="stats">
                <div className="stat-chip">Practice {practiceIndex + 1}/{activeLesson.practicePrompts.length}</div>
                <div className="stat-chip">Progress: {practiceProgress}%</div>
              </div>

              <div className="progress-track" aria-hidden="true">
                <div className="progress-fill" style={{ width: `${practiceProgress}%` }} />
              </div>

              <article className="practice-card practice-card-live">
                <p className="practice-number">Your Turn</p>
                <h3>{currentPractice.prompt}</h3>

                <label className="answer-label" htmlFor="practice-answer">Type your answer</label>
                <input
                  id="practice-answer"
                  className="practice-input"
                  type="text"
                  value={practiceInput}
                  onChange={(event) => setPracticeInput(event.target.value)}
                  placeholder="Type your answer here"
                  disabled={practiceSubmitted}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      submitPracticeAnswer();
                    }
                  }}
                />
                <p className="answer-example"><strong>Format:</strong> {currentPractice.answerFormat}</p>

                {!practiceSubmitted ? (
                  <button
                    className="primary-btn"
                    onClick={submitPracticeAnswer}
                    disabled={practiceInput.trim().length === 0}
                  >
                    Check Answer
                  </button>
                ) : (
                  <div className={practiceCorrect ? 'feedback success' : 'feedback error'}>
                    <p className="feedback-title">
                      {practiceCorrect ? 'Correct.' : 'Not correct. Here is what to fix.'}
                    </p>
                    <p className="feedback-copy">
                      {practiceCorrect ? 'That answer works. Try the next one.' : currentPractice.teaching}
                    </p>
                    <p className="answer-line"><strong>Answer:</strong> {currentPractice.answer}</p>
                    <button className="primary-btn" onClick={nextPractice}>
                      Try Another
                    </button>
                  </div>
                )}
              </article>
            </div>
          </section>
        )}

        {activePanel === 'vocab' && (
          <section className="board">
            <div className="section-head">
              <div>
                <p className="section-label">Vocabulary</p>
                <h2>Tap a card to reveal the meaning</h2>
              </div>
              <div className="rule-pill">8 key terms</div>
            </div>

            <div className="vocab-grid">
              {activeLesson.vocabulary.map((card) => {
                const shown = Boolean(vocabReveal[card.term]);
                return (
                  <button
                    key={card.term}
                    className={shown ? 'vocab-card revealed' : 'vocab-card'}
                    onClick={() => toggleVocab(card.term)}
                  >
                    <span className="vocab-term">{card.term}</span>
                    <span className="vocab-body">
                      {shown ? card.definition : card.clue}
                    </span>
                    <span className="vocab-tap">{shown ? 'Tap to hide' : 'Tap to reveal'}</span>
                  </button>
                );
              })}
            </div>

            <div className="section-head quiz-section-head">
              <div>
                <p className="section-label">Quick Check</p>
                <h2>Do a few questions after the vocab cards</h2>
              </div>
              <div className="rule-pill">Mini quiz</div>
            </div>

            <div className="stats">
              <div className="stat-chip">Score: {correctCount}/{quizDeck.length}</div>
              <div className="stat-chip">Question: {Math.min(questionIndex + 1, quizDeck.length)}/{quizDeck.length}</div>
              <div className="stat-chip">Progress: {finished ? 100 : progress}%</div>
            </div>

            <div className="progress-track" aria-hidden="true">
              <div className="progress-fill" style={{ width: `${finished ? 100 : progress}%` }} />
            </div>

            {finished ? (
              <div className="result-card">
                <p className="result-label">Finished</p>
                <h2>You got {correctCount} out of {quizDeck.length}</h2>
                <p className="result-copy">
                  {correctCount === quizDeck.length
                    ? 'All answers were correct.'
                    : correctCount >= quizDeck.length * 0.75
                      ? 'Most answers were correct. Review the ones you missed.'
                      : 'Review domain, range, and function rules, then try again.'}
                </p>
                <button className="primary-btn" onClick={() => restartQuiz()}>Try Again</button>
              </div>
            ) : (
              <div className="question-card question-card-embedded">
                <div className="question-topline">Quick Check</div>
                <p className="sentence">{currentQuestion.prompt}</p>

                <div className="answer-grid">
                  {currentQuestion.choices.map((choice) => {
                    let className = 'answer-btn';
                    if (answered && choice === currentQuestion.answer) className += ' correct';
                    if (answered && selectedAnswer === choice && choice !== currentQuestion.answer) className += ' wrong';

                    return (
                      <button
                        key={choice}
                        className={className}
                        onClick={() => handleAnswer(choice)}
                        disabled={answered}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>

                {answered && (
                  <div className={isCorrect ? 'feedback success' : 'feedback error'}>
                    <p className="feedback-title">
                      {isCorrect ? 'Correct' : `Not quite. The answer is ${currentQuestion.answer}.`}
                    </p>
                    <p className="feedback-copy">{currentQuestion.explanation}</p>
                    <button className="primary-btn" onClick={nextQuestion}>
                      {questionIndex === quizDeck.length - 1 ? 'See Score' : 'Next Question'}
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
            radial-gradient(circle at top, rgba(191, 219, 254, 0.95), transparent 30%),
            radial-gradient(circle at 85% 18%, rgba(167, 243, 208, 0.42), transparent 26%),
            linear-gradient(160deg, #eef7ff 0%, #dff3ff 42%, #d4fae5 100%);
          color: #1f3252;
        }

        .math-app {
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          font-family: 'Manrope', sans-serif;
        }

        .glow {
          position: fixed;
          border-radius: 999px;
          filter: blur(44px);
          opacity: 0.52;
          pointer-events: none;
        }

        .glow-a {
          width: 18rem;
          height: 18rem;
          background: rgba(96, 165, 250, 0.28);
          top: -4rem;
          left: -3rem;
        }

        .glow-b {
          width: 21rem;
          height: 21rem;
          background: rgba(52, 211, 153, 0.22);
          right: -5rem;
          bottom: -4rem;
        }

        .shell {
          position: relative;
          z-index: 1;
          max-width: 62rem;
          margin: 0 auto;
          padding: 2rem 1rem 3rem;
        }

        .hero {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .topic-row,
        .lesson-row,
        .panel-row,
        .stats {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .topic-row {
          margin-bottom: 0.9rem;
        }

        .lesson-row {
          margin-bottom: 1rem;
        }

        .panel-row {
          margin-bottom: 1rem;
        }

        .topic-bubble,
        .lesson-bubble,
        .tab-bubble,
        .vocab-card,
        .answer-btn,
        .primary-btn {
          border: 0;
          font: inherit;
          transition: transform 150ms ease, box-shadow 150ms ease, background 150ms ease;
        }

        .topic-bubble,
        .lesson-bubble,
        .tab-bubble,
        .vocab-card,
        .answer-btn,
        .primary-btn {
          cursor: pointer;
        }

        .topic-bubble,
        .tab-bubble {
          padding: 0.8rem 1.15rem;
          border-radius: 999px;
          font-weight: 800;
          border: 1px solid rgba(59, 130, 246, 0.16);
          background: rgba(255, 255, 255, 0.78);
          color: #21518f;
        }

        .lesson-bubble {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-width: 13rem;
          padding: 0.9rem 1rem;
          border-radius: 1.2rem;
          text-align: left;
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(59, 130, 246, 0.14);
          color: #21518f;
          box-shadow: 0 10px 24px rgba(32, 83, 133, 0.08);
        }

        .lesson-bubble strong {
          font-size: 0.98rem;
        }

        .lesson-bubble span {
          margin-top: 0.25rem;
          font-size: 0.85rem;
          line-height: 1.45;
          color: #5d7c99;
        }

        .topic-bubble.active,
        .lesson-bubble.active,
        .tab-bubble.active {
          background: linear-gradient(135deg, #38bdf8 0%, #2563eb 100%);
          color: #f8fbff;
          box-shadow: 0 12px 24px rgba(37, 99, 235, 0.2);
        }

        .lesson-bubble.active span {
          color: rgba(248, 251, 255, 0.85);
        }

        .topic-bubble.muted {
          color: #5d87a5;
          cursor: default;
        }

        .topic-bubble:hover,
        .lesson-bubble:hover:enabled,
        .tab-bubble:hover,
        .vocab-card:hover,
        .answer-btn:hover:enabled,
        .primary-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(32, 83, 133, 0.12);
        }

        .lesson-bubble:disabled {
          cursor: not-allowed;
          opacity: 0.72;
          background: rgba(255, 255, 255, 0.55);
          box-shadow: none;
        }

        .eyebrow,
        .section-label,
        .question-topline,
        .result-label {
          display: inline-block;
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #1d4ed8;
        }

        .eyebrow {
          padding: 0.45rem 0.8rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(59, 130, 246, 0.14);
        }

        h1 {
          margin: 0.9rem 0 0.6rem;
          font-family: 'Fredoka', sans-serif;
          font-size: clamp(2.35rem, 7vw, 4.7rem);
          line-height: 0.95;
          color: #153b72;
        }

        h2 {
          margin: 0.25rem 0 0;
          font-family: 'Fredoka', sans-serif;
          font-size: clamp(1.55rem, 4vw, 2.2rem);
          color: #18457f;
        }

        .hero-copy,
        .hero-mini,
        .feedback-copy,
        .result-copy,
        .graph-copy,
        .table-copy {
          line-height: 1.6;
          color: #456380;
        }

        .hero-copy {
          max-width: 40rem;
          margin: 0 auto;
        }

        .hero-mini {
          max-width: 44rem;
          margin: 0.7rem auto 0;
          font-weight: 700;
        }

        .stack {
          display: grid;
          gap: 1rem;
        }

        .board,
        .hint-card,
        .practice-card,
        .graph-card,
        .table-card,
        .mapping-card,
        .question-card,
        .result-card,
        .vocab-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(59, 130, 246, 0.12);
          box-shadow: 0 18px 45px rgba(32, 83, 133, 0.12);
        }

        .board {
          padding: 1rem;
          border-radius: 1.6rem;
        }

        .section-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.8rem;
          margin-bottom: 1rem;
        }

        .rule-pill,
        .graph-badge,
        .stat-chip {
          padding: 0.7rem 0.95rem;
          border-radius: 999px;
          background: #f6fbff;
          border: 1px solid rgba(59, 130, 246, 0.14);
          font-weight: 800;
          color: #205387;
        }

        .hint-grid,
        .learn-grid,
        .vocab-grid,
        .answer-grid,
        .example-grid {
          display: grid;
          gap: 0.8rem;
        }

        .practice-stack {
          display: grid;
          gap: 0.8rem;
        }

        .hint-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .learn-grid,
        .vocab-grid,
        .answer-grid,
        .example-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .learn-grid {
          align-items: start;
        }

        .hint-card {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 1rem;
          border-radius: 1.1rem;
          text-align: left;
        }

        .hint-card strong,
        .practice-card strong,
        .graph-copy strong,
        .table-copy strong {
          color: #18457f;
        }

        .hint-card span {
          color: #456380;
          line-height: 1.55;
        }

        .graph-card,
        .learn-card,
        .practice-card,
        .table-card,
        .mapping-card,
        .question-card,
        .result-card,
        .vocab-card {
          border-radius: 1.35rem;
          padding: 1.1rem;
        }

        .graph-frame {
          position: relative;
          height: 19rem;
          border-radius: 1.1rem;
          overflow: hidden;
          background:
            linear-gradient(rgba(113, 165, 214, 0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(113, 165, 214, 0.12) 1px, transparent 1px),
            linear-gradient(180deg, #ffffff 0%, #f3fbff 100%);
          background-size: 2rem 2rem, 2rem 2rem, auto;
        }

        .practice-card h3 {
          margin: 0;
          font-size: 1.1rem;
          color: #1f3252;
        }

        .learn-card {
          display: block;
          width: 100%;
          padding: 1.15rem;
          border-radius: 1.35rem;
          text-align: left;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(241, 249, 255, 0.92) 100%);
        }

        .learn-card.expanded {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(236, 253, 245, 0.95) 100%);
          border-color: rgba(16, 185, 129, 0.2);
        }

        .learn-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.8rem;
        }

        .learn-card h3 {
          margin: 0.15rem 0 0;
          font-size: 1.15rem;
          color: #163b6a;
        }

        .learn-badge {
          margin: 0;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #1d4ed8;
        }

        .learn-toggle {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          width: 2rem;
          height: 2rem;
          border-radius: 999px;
          background: rgba(219, 234, 254, 0.9);
          color: #1d4ed8;
          font-size: 1.3rem;
          font-weight: 800;
          flex-shrink: 0;
        }

        .learn-preview {
          margin: 0.75rem 0 0;
          line-height: 1.6;
          color: #456380;
          font-weight: 700;
        }

        .learn-detail {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(59, 130, 246, 0.12);
        }

        .learn-list {
          margin: 0;
          padding-left: 1.2rem;
          color: #456380;
          line-height: 1.7;
        }

        .mapping-mini {
          display: grid;
          gap: 0.7rem;
          margin-top: 0.9rem;
        }

        .graph-note {
          margin-top: 0.9rem;
          padding: 0.85rem 0.95rem;
          border-radius: 1rem;
          background: rgba(219, 234, 254, 0.75);
          color: #244667;
          line-height: 1.6;
        }

        .practice-card-live {
          max-width: 42rem;
          margin: 0 auto;
        }

        .mapping-card {
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: linear-gradient(180deg, #ffffff 0%, #effaf6 100%);
        }

        .mapping-head,
        .mapping-row-item {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
          align-items: center;
          gap: 0.8rem;
        }

        .mapping-head {
          padding-bottom: 0.8rem;
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #217260;
        }

        .mapping-stack {
          display: grid;
          gap: 0.8rem;
        }

        .mapping-pill {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          min-height: 3rem;
          padding: 0.6rem 0.85rem;
          border-radius: 999px;
          background: rgba(219, 234, 254, 0.9);
          color: #18457f;
          font-weight: 800;
        }

        .mapping-pill.output {
          background: rgba(220, 252, 231, 0.92);
          color: #166534;
        }

        .mapping-arrow {
          font-size: 1.45rem;
          font-weight: 800;
          color: #10b981;
        }

        .step-list {
          margin: 0.8rem 0 0;
          padding-left: 1.2rem;
          color: #456380;
          line-height: 1.7;
        }

        .practice-number {
          margin: 0 0 0.45rem;
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #1d4ed8;
        }

        .answer-line {
          margin: 0.8rem 0 0;
          line-height: 1.6;
          color: #456380;
        }

        .answer-example {
          margin: 0.7rem 0 0;
          padding: 0.8rem 0.95rem;
          border-radius: 0.95rem;
          background: rgba(219, 234, 254, 0.8);
          border: 1px dashed rgba(37, 99, 235, 0.28);
          color: #244667;
          line-height: 1.5;
        }

        .quiz-section-head {
          margin-top: 2rem;
        }

        .question-card-embedded {
          margin-top: 1rem;
        }

        .answer-label {
          display: block;
          margin-top: 1rem;
          font-size: 0.88rem;
          font-weight: 800;
          color: #205387;
        }

        .practice-input {
          width: 100%;
          margin-top: 0.45rem;
          padding: 0.95rem 1rem;
          border-radius: 1rem;
          border: 1px solid rgba(59, 130, 246, 0.2);
          background: rgba(255, 255, 255, 0.95);
          color: #1f3252;
          font: inherit;
          font-size: 1rem;
          box-sizing: border-box;
        }

        .practice-input:focus {
          outline: 2px solid rgba(37, 99, 235, 0.25);
          border-color: rgba(37, 99, 235, 0.45);
        }

        .primary-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .axis {
          position: absolute;
          background: rgba(29, 78, 216, 0.55);
        }

        .axis-x {
          left: 0;
          right: 0;
          top: 50%;
          height: 2px;
        }

        .axis-y {
          top: 0;
          bottom: 0;
          left: 50%;
          width: 2px;
        }

        .graph-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .table-card table {
          width: 100%;
          border-collapse: collapse;
          font-weight: 700;
          overflow: hidden;
          border-radius: 1rem;
        }

        .table-card th,
        .table-card td {
          padding: 0.8rem 0.75rem;
          text-align: center;
          border-bottom: 1px solid rgba(59, 130, 246, 0.1);
        }

        .table-card th {
          color: #18457f;
          background: rgba(191, 219, 254, 0.35);
        }

        .table-card td {
          color: #2f5b86;
          background: rgba(255, 255, 255, 0.86);
        }

        .table-card tr:last-child td {
          border-bottom: 0;
        }

        .vocab-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-height: 11rem;
          text-align: left;
          background: linear-gradient(180deg, #ffffff 0%, #f5fbff 100%);
        }

        .vocab-card.revealed {
          background: linear-gradient(180deg, #dcfce7 0%, #ecfdf5 100%);
        }

        .vocab-term {
          font-family: 'Fredoka', sans-serif;
          font-size: 1.45rem;
          color: #18457f;
        }

        .vocab-body {
          margin-top: 0.7rem;
          line-height: 1.6;
          color: #456380;
          font-weight: 700;
        }

        .vocab-tap {
          margin-top: auto;
          padding-top: 1rem;
          font-size: 0.85rem;
          font-weight: 800;
          color: #1d4ed8;
        }

        .progress-track {
          height: 0.8rem;
          border-radius: 999px;
          background: rgba(191, 219, 254, 0.55);
          overflow: hidden;
          margin: 1rem 0;
        }

        .progress-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #38bdf8, #2563eb, #10b981);
          transition: width 180ms ease;
        }

        .sentence {
          margin: 0.85rem 0 1rem;
          font-size: clamp(1.3rem, 4vw, 2rem);
          line-height: 1.4;
          font-weight: 800;
          color: #1f3252;
        }

        .answer-btn {
          min-height: 4rem;
          padding: 1rem;
          border-radius: 1.1rem;
          background: linear-gradient(180deg, #ffffff 0%, #eef8ff 100%);
          border: 1px solid rgba(59, 130, 246, 0.16);
          font-weight: 800;
          font-size: 1rem;
          color: #18457f;
          box-shadow: inset 0 -4px 0 rgba(37, 99, 235, 0.08);
          text-align: left;
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
          color: #18457f;
        }

        .primary-btn {
          margin-top: 0.9rem;
          padding: 0.95rem 1.1rem;
          border-radius: 999px;
          background: linear-gradient(135deg, #2563eb, #10b981);
          color: white;
          font-weight: 800;
        }

        .result-card h2 {
          margin: 0.55rem 0;
        }

        @media (max-width: 720px) {
          .shell {
            padding: 1rem 0.8rem 2rem;
          }

          .hint-grid,
          .learn-grid,
          .vocab-grid,
          .answer-grid,
          .example-grid {
            grid-template-columns: 1fr;
          }

          .lesson-bubble {
            min-width: min(100%, 18rem);
          }

          .section-head {
            flex-direction: column;
          }

          .board,
          .graph-card,
          .table-card,
          .question-card,
          .result-card,
          .vocab-card {
            border-radius: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
