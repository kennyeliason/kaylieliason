import { useState } from 'react';

type Mode = 'learn' | 'quiz' | 'density';

type LearnTopic = {
  title: string;
  label: string;
  summary: string;
  details: string[];
  example: string;
};

type QuizQuestion = {
  category: string;
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
};

type DensityProblem = {
  prompt: string;
  setup: string;
  answer: string;
};

const learnTopics: LearnTopic[] = [
  {
    title: 'Physical Properties',
    label: 'Properties',
    summary: 'A physical property can be observed without changing what the substance is.',
    details: [
      'Physical properties describe what a substance is like right now.',
      'You can observe or measure them without making a new substance.',
      'Color, mass, volume, density, melting point, and boiling point are physical properties.',
    ],
    example: 'If you say a liquid is blue or has a density of 1.35 g/mL, you are describing physical properties.',
  },
  {
    title: 'Chemical Properties',
    label: 'Properties',
    summary: 'A chemical property describes how a substance can change into a new substance.',
    details: [
      'Chemical properties are about what a substance can do during a chemical reaction.',
      'A substance must change into something new for the chemical property to show.',
      'Flammability, rusting, and reacting with another chemical are chemical properties.',
    ],
    example: 'If a metal can rust, that is a chemical property because rust is a new substance.',
  },
  {
    title: 'Physical Changes',
    label: 'Changes',
    summary: 'A physical change changes appearance or form, but not the substance itself.',
    details: [
      'The material is still the same substance after the change.',
      'Changes in size, shape, state, or form are usually physical changes.',
      'Melting, freezing, cutting, crushing, and dissolving are common physical changes.',
    ],
    example: 'Ice melting into water is physical because it is still H2O.',
  },
  {
    title: 'Chemical Changes',
    label: 'Changes',
    summary: 'A chemical change creates a new substance.',
    details: [
      'The old substance changes into something different.',
      'Clues can include gas bubbles, color change, temperature change, light, smell, or a solid forming.',
      'Burning, rusting, cooking, and souring milk are chemical changes.',
    ],
    example: 'Wood burning is chemical because ash, smoke, and gases are new substances.',
  },
  {
    title: 'Matter',
    label: 'Basics',
    summary: 'Matter is anything that has mass and takes up space.',
    details: [
      'Mass means how much matter is in something.',
      'Taking up space means it has volume.',
      'Solids, liquids, and gases are all matter.',
    ],
    example: 'Air counts as matter because it has mass and takes up space, even though you cannot always see it.',
  },
  {
    title: 'Density',
    label: 'Calculations',
    summary: 'Density tells how much mass is packed into a certain volume.',
    details: [
      'Use Density = Mass / Volume.',
      'Use Mass = Density x Volume when the question asks for mass.',
      'Use Volume = Mass / Density when the question asks for volume.',
      'Common units in this study guide are g/mL or g/cm3.',
    ],
    example: 'A sample with 85.0 g and 116 mL has density 85.0 / 116 = 0.733 g/mL.',
  },
  {
    title: 'Extensive vs Intensive',
    label: 'Properties',
    summary: 'Extensive depends on amount. Intensive does not.',
    details: [
      'Extensive properties change when the amount of matter changes.',
      'Mass and volume are extensive because more sample means more mass or volume.',
      'Intensive properties stay the same no matter how much sample you have.',
      'Density, color, and temperature are intensive properties.',
    ],
    example: 'A small cup and a big bottle of the same liquid can have different volumes but the same density.',
  },
  {
    title: 'Mixtures',
    label: 'Mixtures',
    summary: 'Homogeneous mixtures are even throughout. Heterogeneous mixtures are not.',
    details: [
      'A homogeneous mixture looks evenly mixed throughout.',
      'A heterogeneous mixture has different parts you can see or separate.',
      'The prefix homo means same or even. Hetero means different.',
    ],
    example: 'Salt water is homogeneous. Trail mix is heterogeneous.',
  },
  {
    title: 'Metric Symbols',
    label: 'Units',
    summary: 'Know the symbols for mass, volume, length, and density.',
    details: [
      'Mass is usually measured in grams, written as g.',
      'Volume is often measured in milliliters, written as mL, or cubic centimeters, written as cm3.',
      'Length is measured in meters, written as m.',
      'Density is often written as g/mL or g/cm3.',
    ],
    example: 'If the problem says 168 mL and 0.755 g/mL, mL is volume and g/mL is density.',
  },
  {
    title: 'Kinetic-Molecular Theory',
    label: 'Particles',
    summary: 'Matter is made of tiny particles that are constantly moving.',
    details: [
      'All matter is made of tiny particles.',
      'Those particles are always moving, even when the object looks still.',
      'Particle motion helps explain the difference between solids, liquids, and gases.',
    ],
    example: 'Gas particles move freely and spread out, which is why gas has no fixed shape or volume.',
  },
  {
    title: 'Compounds',
    label: 'Basics',
    summary: 'A compound is made of two or more different elements chemically bonded together.',
    details: [
      'A compound is not just a mixture.',
      'The elements are chemically bonded.',
      'Compounds have properties that can be different from the elements that make them.',
    ],
    example: 'Water is a compound because hydrogen and oxygen are chemically bonded together.',
  },
  {
    title: 'States of Matter',
    label: 'States',
    summary: 'Solids, liquids, and gases differ by shape and volume.',
    details: [
      'A solid has a fixed shape and fixed volume.',
      'A liquid has a fixed volume but takes the shape of its container.',
      'A gas has no fixed shape and no fixed volume.',
    ],
    example: 'Water in a cup keeps its volume but takes the cup shape, so it is a liquid.',
  },
  {
    title: 'Mass vs Weight',
    label: 'Basics',
    summary: 'Mass is amount of matter. Weight is the force of gravity on that matter.',
    details: [
      'Mass does not depend on gravity.',
      'Weight changes if gravity changes.',
      'In this unit, density problems usually use mass in grams.',
    ],
    example: 'An object would weigh less on the Moon, but its mass would stay the same.',
  },
  {
    title: 'Graphing Density',
    label: 'Density Lab',
    summary: 'On a mass vs volume graph, the slope of the line is the density.',
    details: [
      'Put volume on the x-axis and mass on the y-axis.',
      'The slope formula is (y2 - y1) / (x2 - x1).',
      'Because y is mass and x is volume, slope equals mass / volume.',
      'The steeper the line, the higher the density.',
    ],
    example: 'Blue has density 1.35 g/mL, green has 1.00 g/mL, and yellow has 0.70 g/mL.',
  },
  {
    title: 'Layering Liquids',
    label: 'Density Lab',
    summary: 'Liquids layer by density: most dense on bottom, least dense on top.',
    details: [
      'Compare the density numbers.',
      'The largest density sinks to the bottom.',
      'The smallest density floats on the top.',
      'For the worksheet, blue is most dense, green is middle, and yellow is least dense.',
    ],
    example: 'In the test tube, the order from top to bottom is yellow, green, blue.',
  },
];

const quizQuestions: QuizQuestion[] = [
  {
    category: 'Properties',
    question: 'Which statement describes a physical property?',
    choices: ['It can be observed without changing the substance', 'It always creates a new substance', 'It only happens during burning', 'It tells how gravity pulls on an object'],
    answer: 'It can be observed without changing the substance',
    explanation: 'A physical property describes a substance without turning it into something new.',
  },
  {
    category: 'Properties',
    question: 'Which one is a chemical property?',
    choices: ['Ability to rust', 'Mass', 'Volume', 'Color'],
    answer: 'Ability to rust',
    explanation: 'Rusting creates a new substance, so the ability to rust is a chemical property.',
  },
  {
    category: 'Changes',
    question: 'What is the biggest clue that a chemical change happened?',
    choices: ['A new substance formed', 'The object changed shape', 'The object was cut smaller', 'The substance changed from solid to liquid'],
    answer: 'A new substance formed',
    explanation: 'Chemical changes create new substances.',
  },
  {
    category: 'Changes',
    question: 'Which example is a physical change?',
    choices: ['Ice melting', 'Wood burning', 'Iron rusting', 'Milk souring'],
    answer: 'Ice melting',
    explanation: 'Melting changes state, but the substance is still water.',
  },
  {
    category: 'Matter',
    question: 'What is matter?',
    choices: ['Anything that has mass and takes up space', 'Anything that is always solid', 'Anything that has no volume', 'Anything that cannot change'],
    answer: 'Anything that has mass and takes up space',
    explanation: 'Matter has mass and volume.',
  },
  {
    category: 'Density',
    question: 'What does density measure?',
    choices: ['How much mass is packed into a certain volume', 'How hard gravity pulls on an object', 'How long an object is', 'How fast particles completely stop moving'],
    answer: 'How much mass is packed into a certain volume',
    explanation: 'Density compares mass to volume.',
  },
  {
    category: 'Density',
    question: 'Which formula finds density?',
    choices: ['Density = Mass / Volume', 'Density = Volume / Mass', 'Density = Mass x Volume', 'Density = Weight / Length'],
    answer: 'Density = Mass / Volume',
    explanation: 'Density is mass divided by volume.',
  },
  {
    category: 'Density',
    question: 'A sample has mass 85.0 g and volume 116 mL. What is its density?',
    choices: ['0.733 g/mL', '1.36 g/mL', '31.0 g/mL', '9860 g/mL'],
    answer: '0.733 g/mL',
    explanation: '85.0 divided by 116 equals about 0.733 g/mL.',
  },
  {
    category: 'Density',
    question: 'A liquid has volume 168 mL and density 0.755 g/mL. What is its mass?',
    choices: ['127 g', '222 g', '0.00449 g', '168.755 g'],
    answer: '127 g',
    explanation: 'Mass = density x volume, so 0.755 x 168 = 126.84, which rounds to 127 g.',
  },
  {
    category: 'Density',
    question: 'A sample has density 2.85 g/mL and mass 52.0 g. What is its volume?',
    choices: ['18.3 mL', '148 mL', '54.85 mL', '0.0548 mL'],
    answer: '18.3 mL',
    explanation: 'Volume = mass / density, so 52.0 / 2.85 = 18.3 mL.',
  },
  {
    category: 'Extensive and Intensive',
    question: 'Which property is extensive?',
    choices: ['Mass', 'Density', 'Color', 'Temperature'],
    answer: 'Mass',
    explanation: 'Mass depends on how much matter there is, so it is extensive.',
  },
  {
    category: 'Extensive and Intensive',
    question: 'Which property is intensive?',
    choices: ['Density', 'Mass', 'Volume', 'Amount of matter'],
    answer: 'Density',
    explanation: 'Density does not depend on the amount of sample.',
  },
  {
    category: 'Mixtures',
    question: 'What is a homogeneous mixture?',
    choices: ['A mixture that is evenly mixed throughout', 'A mixture with different visible parts', 'A pure compound only', 'A substance that always burns'],
    answer: 'A mixture that is evenly mixed throughout',
    explanation: 'Homogeneous means evenly mixed throughout.',
  },
  {
    category: 'Mixtures',
    question: 'What is a heterogeneous mixture?',
    choices: ['A mixture with different parts that are not evenly mixed', 'A mixture that looks the same throughout', 'A single chemically bonded substance', 'A liquid with no mass'],
    answer: 'A mixture with different parts that are not evenly mixed',
    explanation: 'Heterogeneous mixtures are not evenly mixed.',
  },
  {
    category: 'Units',
    question: 'Which symbol is usually used for grams?',
    choices: ['g', 'mL', 'cm3', 'm'],
    answer: 'g',
    explanation: 'Mass is often measured in grams, written as g.',
  },
  {
    category: 'Units',
    question: 'Which unit would most likely measure volume in this study guide?',
    choices: ['mL', 'g', 'm', 'g/mL'],
    answer: 'mL',
    explanation: 'Milliliters measure volume.',
  },
  {
    category: 'Units',
    question: 'Which unit would most likely measure density?',
    choices: ['g/mL', 'mL', 'g', 'm'],
    answer: 'g/mL',
    explanation: 'Density compares grams of mass to milliliters of volume.',
  },
  {
    category: 'Particles',
    question: 'What does the kinetic-molecular theory say about matter?',
    choices: ['Matter is made of tiny particles that are constantly moving', 'Matter is only made of liquids', 'Particles stop moving inside solids forever', 'Only gases are made of particles'],
    answer: 'Matter is made of tiny particles that are constantly moving',
    explanation: 'The study guide definition says matter is made of tiny particles that are constantly moving.',
  },
  {
    category: 'Compounds',
    question: 'What is a compound?',
    choices: ['A substance made of two or more different elements chemically bonded together', 'A mixture with parts you can always see', 'Any object that has mass only', 'A physical property that depends on amount'],
    answer: 'A substance made of two or more different elements chemically bonded together',
    explanation: 'Compounds are chemically bonded, not just mixed.',
  },
  {
    category: 'States',
    question: 'Which state of matter has fixed shape and fixed volume?',
    choices: ['Solid', 'Liquid', 'Gas', 'Mixture'],
    answer: 'Solid',
    explanation: 'A solid keeps its shape and volume.',
  },
  {
    category: 'States',
    question: 'Which state has fixed volume but takes the shape of its container?',
    choices: ['Liquid', 'Solid', 'Gas', 'Compound'],
    answer: 'Liquid',
    explanation: 'A liquid keeps volume but changes shape to fit its container.',
  },
  {
    category: 'States',
    question: 'Which state has no fixed shape or volume?',
    choices: ['Gas', 'Liquid', 'Solid', 'Element'],
    answer: 'Gas',
    explanation: 'Gas particles spread out, so gas has no fixed shape or volume.',
  },
  {
    category: 'Mass and Weight',
    question: 'What is mass?',
    choices: ['The amount of matter in an object', 'The force of gravity on an object', 'The space an object takes up', 'The ability to react chemically'],
    answer: 'The amount of matter in an object',
    explanation: 'Mass is amount of matter.',
  },
  {
    category: 'Mass and Weight',
    question: 'What is weight?',
    choices: ['The force of gravity acting on an object', 'The amount of matter in an object', 'The density of a liquid', 'The volume of a solid'],
    answer: 'The force of gravity acting on an object',
    explanation: 'Weight depends on gravity.',
  },
  {
    category: 'Density Lab',
    question: 'On a mass vs volume graph, what does the slope represent?',
    choices: ['Density', 'Weight', 'Length', 'Chemical change'],
    answer: 'Density',
    explanation: 'Slope is rise over run, or mass divided by volume, so it equals density.',
  },
  {
    category: 'Density Lab',
    question: 'Blue is 1.35 g/mL, green is 1.00 g/mL, and yellow is 0.70 g/mL. Which liquid is most dense?',
    choices: ['Blue', 'Green', 'Yellow', 'They are all equal'],
    answer: 'Blue',
    explanation: 'Blue has density 1.35 g/mL, which is higher than green and yellow.',
  },
  {
    category: 'Density Lab',
    question: 'Blue is 1.35 g/mL, green is 1.00 g/mL, and yellow is 0.70 g/mL. Which liquid is least dense?',
    choices: ['Yellow', 'Green', 'Blue', 'They are all equal'],
    answer: 'Yellow',
    explanation: 'Yellow has density 0.70 g/mL, which is the smallest.',
  },
  {
    category: 'Density Lab',
    question: 'If blue is 1.35 g/mL, green is 1.00 g/mL, and yellow is 0.70 g/mL, which liquid should be on the bottom of a test tube?',
    choices: ['Blue', 'Green', 'Yellow', 'Whichever is poured first'],
    answer: 'Blue',
    explanation: 'The most dense liquid sinks to the bottom.',
  },
  {
    category: 'Density Lab',
    question: 'Using the densities blue = 1.35 g/mL, green = 1.00 g/mL, and yellow = 0.70 g/mL, what is the correct top-to-bottom layer order?',
    choices: ['Yellow, green, blue', 'Blue, green, yellow', 'Green, yellow, blue', 'Yellow, blue, green'],
    answer: 'Yellow, green, blue',
    explanation: 'Least dense is top and most dense is bottom, so yellow is top and blue is bottom.',
  },
  {
    category: 'Density Lab',
    question: 'Which density matches the green liquid table?',
    choices: ['1.00 g/mL', '1.35 g/mL', '0.70 g/mL', '2.85 g/mL'],
    answer: '1.00 g/mL',
    explanation: 'Green has 10 g / 10 mL, 20 g / 20 mL, and 30 g / 30 mL, so density is 1.00 g/mL.',
  },
];

const densityProblems: DensityProblem[] = [
  {
    prompt: 'What is the density of an element if a sample has a mass of 85.0 g and a volume of 116 mL?',
    setup: 'Density = Mass / Volume = 85.0 g / 116 mL',
    answer: '0.733 g/mL',
  },
  {
    prompt: 'What is the mass of 168 mL of a liquid if its density is 0.755 g/mL?',
    setup: 'Mass = Density x Volume = 0.755 g/mL x 168 mL',
    answer: '127 g',
  },
  {
    prompt: 'If a sample has a density of 2.85 g/mL and a mass of 52.0 g, calculate its volume.',
    setup: 'Volume = Mass / Density = 52.0 g / 2.85 g/mL',
    answer: '18.3 mL',
  },
];

const liquidData = [
  { name: 'Blue', density: '1.35 g/mL', points: '(10, 13.5), (20, 27.0), (30, 40.5)', placement: 'Bottom layer' },
  { name: 'Green', density: '1.00 g/mL', points: '(10, 10.0), (20, 20.0), (30, 30.0)', placement: 'Middle layer' },
  { name: 'Yellow', density: '0.70 g/mL', points: '(10, 7.0), (20, 14.0), (30, 21.0)', placement: 'Top layer' },
];

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildDeck() {
  return shuffle(quizQuestions).slice(0, 10).map((question) => ({
    ...question,
    choices: shuffle(question.choices),
  }));
}

export default function ChemistryStudy() {
  const [mode, setMode] = useState<Mode>('learn');
  const [openTopic, setOpenTopic] = useState(0);
  const [deck, setDeck] = useState(buildDeck);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [showDensityAnswers, setShowDensityAnswers] = useState(false);

  const currentQuestion = deck[currentIndex];
  const isAnswered = selected !== '';
  const isCorrect = selected === currentQuestion.answer;

  function startNewQuiz() {
    setDeck(buildDeck());
    setCurrentIndex(0);
    setSelected('');
  }

  function nextQuestion() {
    if (currentIndex === deck.length - 1) {
      startNewQuiz();
      return;
    }
    setCurrentIndex((index) => index + 1);
    setSelected('');
  }

  return (
    <div className="chemistry-page">
      <main className="shell">
        <section className="hero">
          <p className="eyebrow">Chemistry Unit 2</p>
          <h1>Chemistry Study Guide</h1>
          <p className="hero-copy">Matter, properties, changes, density, mixtures, states of matter, and the colored-liquid density lab.</p>
          <div className="mode-row">
            <button className={mode === 'learn' ? 'active' : ''} type="button" onClick={() => setMode('learn')}>Learn It</button>
            <button className={mode === 'quiz' ? 'active' : ''} type="button" onClick={() => setMode('quiz')}>Practice It</button>
            <button className={mode === 'density' ? 'active' : ''} type="button" onClick={() => setMode('density')}>Density Lab</button>
          </div>
        </section>

        {mode === 'learn' && (
          <section className="panel">
            <div className="section-heading">
              <p>Unit 2 Topics</p>
              <h2>Pick a card to study</h2>
            </div>
            <div className="learn-grid">
              {learnTopics.map((topic, index) => {
                const expanded = openTopic === index;
                return (
                  <button
                    className={`learn-card ${expanded ? 'expanded' : ''}`}
                    key={topic.title}
                    type="button"
                    onClick={() => setOpenTopic(index)}
                  >
                    <span className="topic-label">{topic.label}</span>
                    <strong>{topic.title}</strong>
                    <span>{topic.summary}</span>
                    {expanded && (
                      <div className="topic-detail">
                        <ul>
                          {topic.details.map((detail) => <li key={detail}>{detail}</li>)}
                        </ul>
                        <p>{topic.example}</p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {mode === 'quiz' && (
          <section className="panel">
            <div className="quiz-top">
              <div>
                <p className="eyebrow dark">Question {currentIndex + 1} of {deck.length}</p>
                <h2>{currentQuestion.category}</h2>
              </div>
              <button className="small-button" type="button" onClick={startNewQuiz}>New Set</button>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }} />
            </div>
            <p className="question">{currentQuestion.question}</p>
            <div className="choices">
              {currentQuestion.choices.map((choice) => (
                <button
                  className={`choice ${isAnswered && choice === currentQuestion.answer ? 'correct' : ''} ${isAnswered && choice === selected && choice !== currentQuestion.answer ? 'wrong' : ''}`}
                  disabled={isAnswered}
                  key={choice}
                  type="button"
                  onClick={() => setSelected(choice)}
                >
                  {choice}
                </button>
              ))}
            </div>
            {isAnswered && (
              <div className={`feedback ${isCorrect ? 'right' : 'wrong'}`}>
                <strong>{isCorrect ? 'Correct' : 'Not quite'}</strong>
                <p>{currentQuestion.explanation}</p>
                <button type="button" onClick={nextQuestion}>{currentIndex === deck.length - 1 ? 'New Set' : 'Next Question'}</button>
              </div>
            )}
          </section>
        )}

        {mode === 'density' && (
          <section className="panel">
            <div className="section-heading">
              <p>Density Lab</p>
              <h2>Calculate, graph, then layer</h2>
            </div>
            <div className="formula-grid">
              <div><strong>Density</strong><span>D = mass / volume</span></div>
              <div><strong>Mass</strong><span>m = density x volume</span></div>
              <div><strong>Volume</strong><span>V = mass / density</span></div>
              <div><strong>Slope</strong><span>(y2 - y1) / (x2 - x1)</span></div>
            </div>
            <div className="liquid-grid">
              {liquidData.map((liquid) => (
                <article className={`liquid-card ${liquid.name.toLowerCase()}`} key={liquid.name}>
                  <p>{liquid.name}</p>
                  <strong>{liquid.density}</strong>
                  <span>{liquid.points}</span>
                  <em>{liquid.placement}</em>
                </article>
              ))}
            </div>
            <div className="layer-card">
              <h3>Layer order</h3>
              <p>Most dense goes on bottom. Least dense goes on top.</p>
              <div className="tube">
                <span className="yellow">Yellow: 0.70 g/mL</span>
                <span className="green">Green: 1.00 g/mL</span>
                <span className="blue">Blue: 1.35 g/mL</span>
              </div>
            </div>
            <div className="practice-list">
              <div className="practice-header">
                <h3>Worksheet Problems</h3>
                <button className="small-button" type="button" onClick={() => setShowDensityAnswers((value) => !value)}>
                  {showDensityAnswers ? 'Hide Answers' : 'Show Answers'}
                </button>
              </div>
              {densityProblems.map((problem, index) => (
                <article className="density-problem" key={problem.prompt}>
                  <strong>{index + 1}. {problem.prompt}</strong>
                  {showDensityAnswers && (
                    <>
                      <span>{problem.setup}</span>
                      <p>{problem.answer}</p>
                    </>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
      <style>{`
        * { box-sizing: border-box; }

        .chemistry-page {
          min-height: 100vh;
          color: #17211b;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background:
            linear-gradient(135deg, rgba(205, 237, 232, 0.95), rgba(248, 244, 226, 0.92)),
            radial-gradient(circle at top right, rgba(236, 126, 58, 0.18), transparent 36%);
        }

        .shell {
          width: min(1040px, calc(100% - 1.25rem));
          margin: 0 auto;
          padding: 1.25rem 0 3rem;
        }

        .hero, .panel {
          border: 1px solid rgba(39, 78, 72, 0.16);
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.86);
          box-shadow: 0 22px 60px rgba(37, 64, 57, 0.15);
        }

        .hero {
          padding: 2rem;
          background:
            linear-gradient(135deg, rgba(16, 82, 74, 0.96), rgba(23, 57, 73, 0.94)),
            linear-gradient(180deg, rgba(255,255,255,0.08), transparent);
          color: #fff9e9;
        }

        .eyebrow {
          margin: 0;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #ffd18a;
        }

        .eyebrow.dark { color: #bd6732; }

        h1, h2, h3, p { margin: 0; }

        h1 {
          margin-top: 0.5rem;
          font-size: clamp(2.5rem, 5vw, 4.4rem);
          line-height: 1;
          letter-spacing: 0;
        }

        .hero-copy {
          max-width: 45rem;
          margin-top: 0.9rem;
          font-size: 1.18rem;
          line-height: 1.55;
          color: rgba(255, 249, 233, 0.9);
        }

        .mode-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        button {
          font: inherit;
        }

        .mode-row button, .small-button, .feedback button {
          border: 0;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.14);
          color: #fff9e9;
          cursor: pointer;
          font-weight: 900;
        }

        .mode-row button {
          padding: 0.85rem 1.2rem;
          border: 1px solid rgba(255,255,255,0.25);
        }

        .mode-row button.active, .small-button {
          background: linear-gradient(135deg, #f08a35, #d85621);
          color: #fff9e9;
        }

        .panel {
          margin-top: 1rem;
          padding: 1.4rem;
        }

        .section-heading p {
          color: #bd6732;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .section-heading h2, .quiz-top h2 {
          margin-top: 0.25rem;
          font-size: clamp(1.6rem, 3vw, 2.3rem);
          letter-spacing: 0;
        }

        .learn-grid {
          display: grid;
          gap: 0.85rem;
          margin-top: 1rem;
        }

        .learn-card {
          width: 100%;
          min-height: 8.5rem;
          padding: 1.1rem;
          border: 1px solid rgba(39, 78, 72, 0.16);
          border-radius: 18px;
          background: #fffdf7;
          color: #17211b;
          text-align: left;
          cursor: pointer;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .learn-card:hover { transform: translateY(-2px); }
        .learn-card.expanded { border-color: rgba(216, 86, 33, 0.4); background: #fff8ed; }

        .topic-label {
          display: inline-flex;
          margin-bottom: 0.6rem;
          padding: 0.32rem 0.55rem;
          border-radius: 999px;
          background: rgba(16, 82, 74, 0.1);
          color: #10524a;
          font-size: 0.74rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .learn-card strong {
          display: block;
          font-size: 1.35rem;
          line-height: 1.15;
        }

        .learn-card > span:not(.topic-label) {
          display: block;
          margin-top: 0.5rem;
          font-size: 1rem;
          line-height: 1.45;
          color: #506158;
        }

        .topic-detail {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(39, 78, 72, 0.12);
        }

        .topic-detail ul {
          margin: 0;
          padding-left: 1.2rem;
        }

        .topic-detail li, .topic-detail p {
          font-size: 1.05rem;
          line-height: 1.55;
          color: #26372f;
        }

        .topic-detail p {
          margin-top: 0.9rem;
          padding: 0.85rem;
          border-radius: 14px;
          background: rgba(16, 82, 74, 0.08);
          font-weight: 800;
        }

        .quiz-top, .practice-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .small-button {
          flex: 0 0 auto;
          padding: 0.75rem 1rem;
        }

        .progress-track {
          height: 12px;
          margin-top: 1rem;
          border-radius: 999px;
          background: rgba(16, 82, 74, 0.12);
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #10524a, #f08a35);
        }

        .question {
          margin-top: 1rem;
          font-size: 1.55rem;
          line-height: 1.35;
          font-weight: 900;
        }

        .choices {
          display: grid;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .choice {
          width: 100%;
          padding: 1rem;
          border: 2px solid rgba(39, 78, 72, 0.12);
          border-radius: 16px;
          background: #fffdf7;
          color: #17211b;
          cursor: pointer;
          font-weight: 850;
          line-height: 1.4;
          text-align: left;
        }

        .choice.correct { border-color: #2d8b57; background: rgba(45, 139, 87, 0.12); }
        .choice.wrong { border-color: #c84b41; background: rgba(200, 75, 65, 0.12); }

        .feedback {
          margin-top: 1rem;
          padding: 1rem;
          border-radius: 18px;
          background: rgba(16, 82, 74, 0.08);
        }

        .feedback.wrong { background: rgba(200, 75, 65, 0.1); }
        .feedback strong { display: block; font-size: 1.1rem; }
        .feedback p { margin-top: 0.35rem; line-height: 1.55; color: #405047; }
        .feedback button { margin-top: 0.9rem; padding: 0.75rem 1rem; background: linear-gradient(135deg, #f08a35, #d85621); }

        .formula-grid, .liquid-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.85rem;
          margin-top: 1rem;
        }

        .formula-grid div, .liquid-card, .layer-card, .density-problem {
          border: 1px solid rgba(39, 78, 72, 0.14);
          border-radius: 18px;
          background: #fffdf7;
          padding: 1rem;
        }

        .formula-grid strong, .formula-grid span, .liquid-card p, .liquid-card strong, .liquid-card span, .liquid-card em {
          display: block;
        }

        .formula-grid strong, .liquid-card p {
          color: #10524a;
          font-weight: 900;
        }

        .formula-grid span {
          margin-top: 0.35rem;
          color: #506158;
          font-weight: 800;
        }

        .liquid-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .liquid-card strong { margin-top: 0.35rem; font-size: 1.55rem; }
        .liquid-card span, .liquid-card em { margin-top: 0.45rem; color: #506158; font-style: normal; line-height: 1.45; }
        .liquid-card.blue { border-color: rgba(44, 98, 185, 0.3); }
        .liquid-card.green { border-color: rgba(36, 136, 83, 0.3); }
        .liquid-card.yellow { border-color: rgba(226, 179, 44, 0.45); }

        .layer-card {
          margin-top: 1rem;
        }

        .layer-card p {
          margin-top: 0.35rem;
          color: #506158;
          line-height: 1.5;
        }

        .tube {
          display: grid;
          margin-top: 0.9rem;
          overflow: hidden;
          border-radius: 18px;
          border: 2px solid rgba(39, 78, 72, 0.25);
        }

        .tube span {
          padding: 0.9rem 1rem;
          font-weight: 900;
        }

        .tube .yellow { background: #ffe27a; }
        .tube .green { background: #80d89d; }
        .tube .blue { background: #75a6f2; }

        .practice-list {
          display: grid;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .density-problem strong, .density-problem span, .density-problem p {
          display: block;
        }

        .density-problem strong {
          line-height: 1.45;
        }

        .density-problem span {
          margin-top: 0.65rem;
          color: #506158;
          font-weight: 800;
        }

        .density-problem p {
          margin-top: 0.3rem;
          color: #10524a;
          font-size: 1.2rem;
          font-weight: 900;
        }

        @media (max-width: 720px) {
          .shell { width: min(100% - 0.85rem, 1040px); padding-top: 0.45rem; }
          .hero, .panel { border-radius: 18px; }
          .hero { padding: 1.25rem; }
          .panel { padding: 1rem; }
          .mode-row { display: grid; grid-template-columns: 1fr; }
          .quiz-top, .practice-header { align-items: flex-start; flex-direction: column; }
          .formula-grid, .liquid-grid { grid-template-columns: 1fr; }
          .question { font-size: 1.35rem; }
        }
      `}</style>
    </div>
  );
}
