import { useState } from 'react';

type Mode = 'learn' | 'quiz' | 'density' | 'stats';

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

type StudyUnit = {
  id: string;
  label: string;
  title: string;
  description: string;
  topics: LearnTopic[];
  questions: QuizQuestion[];
  hasDensityLab?: boolean;
};

type UnitStats = {
  attempts: number;
  correct: number;
  categories: Record<string, { attempts: number; correct: number }>;
};

type StatsRecord = Record<string, UnitStats>;

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
    question: 'A liquid has a mass of 40.5 g and a volume of 30.0 mL. What is its density?',
    choices: ['1.35 g/mL', '0.74 g/mL', '10.5 g/mL', '70.5 g/mL'],
    answer: '1.35 g/mL',
    explanation: 'Density = mass / volume, so 40.5 / 30.0 = 1.35 g/mL.',
  },
  {
    category: 'Density Lab',
    question: 'Blue has mass 27.0 g and volume 20.0 mL. What is its density?',
    choices: ['1.35 g/mL', '0.74 g/mL', '47.0 g/mL', '7.0 g/mL'],
    answer: '1.35 g/mL',
    explanation: 'Density = mass / volume, so 27.0 / 20.0 = 1.35 g/mL.',
  },
  {
    category: 'Density Lab',
    question: 'Yellow has mass 21.0 g and volume 30.0 mL. What is its density?',
    choices: ['0.70 g/mL', '1.43 g/mL', '51.0 g/mL', '9.0 g/mL'],
    answer: '0.70 g/mL',
    explanation: 'Density = mass / volume, so 21.0 / 30.0 = 0.70 g/mL.',
  },
  {
    category: 'Density Lab',
    question: 'If a mass vs volume line is steeper, what does that usually mean?',
    choices: ['The substance has a higher density', 'The substance has no volume', 'The substance is always a gas', 'The substance has lower mass every time'],
    answer: 'The substance has a higher density',
    explanation: 'On a mass vs volume graph, slope equals density, so a steeper line means a larger density.',
  },
  {
    category: 'Changes',
    question: 'Which change would best show a chemical change instead of a physical change?',
    choices: ['A new gas forms when two liquids are mixed', 'A pencil is snapped in half', 'Water freezes into ice', 'A rock is crushed into smaller pieces'],
    answer: 'A new gas forms when two liquids are mixed',
    explanation: 'A gas forming can be evidence that a new substance formed, which points to a chemical change.',
  },
  {
    category: 'Mixtures',
    question: 'Which example is most likely heterogeneous?',
    choices: ['Oil and water with visible layers', 'Salt fully dissolved in water', 'Clean air in a room', 'Sugar dissolved in tea'],
    answer: 'Oil and water with visible layers',
    explanation: 'Heterogeneous mixtures are not evenly mixed, so visible layers are a clue.',
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

const unitThreeTopics: LearnTopic[] = [
  {
    title: 'Average Atomic Mass',
    label: 'Isotopes',
    summary: 'Average atomic mass is the weighted average of all naturally occurring isotopes of an element.',
    details: [
      'Isotopes are atoms of the same element with different numbers of neutrons.',
      'Different neutrons means different mass numbers.',
      'To calculate average atomic mass, multiply each isotope mass by its abundance as a decimal, then add the results.',
    ],
    example: 'If an isotope is 75%, use 0.75 in the calculation, not 75.',
  },
  {
    title: 'Atomic Number and Mass Number',
    label: 'Atoms',
    summary: 'Atomic number tells protons. Mass number tells protons plus neutrons.',
    details: [
      'Atomic number = number of protons.',
      'In a neutral atom, protons = electrons.',
      'Mass number = protons + neutrons.',
      'Neutrons = mass number - atomic number.',
    ],
    example: 'Carbon-14 has 6 protons and 8 neutrons because 14 - 6 = 8.',
  },
  {
    title: 'Nuclear Chemistry',
    label: 'Nucleus',
    summary: 'Nuclear chemistry studies changes in the nucleus of atoms.',
    details: [
      'Chemical reactions involve electrons, but nuclear reactions involve the nucleus.',
      'A nucleus contains protons and neutrons.',
      'Changing protons changes the identity of the element.',
    ],
    example: 'Radioactive decay is nuclear because particles or energy come from the nucleus.',
  },
  {
    title: 'Mass Defect and Binding Energy',
    label: 'Energy',
    summary: 'Mass defect is missing mass that becomes nuclear binding energy.',
    details: [
      'Nuclear binding energy is the energy holding the nucleus together.',
      'Mass defect is the difference between the mass before and after the nucleus forms.',
      'Einstein\'s equation E = mc2 connects mass and energy.',
    ],
    example: 'A tiny amount of missing mass can equal a large amount of energy.',
  },
  {
    title: 'Radioactive Decay',
    label: 'Radiation',
    summary: 'Unstable nuclei release radiation to become more stable.',
    details: [
      'Radiation is released from the nucleus.',
      'Alpha, beta, and gamma are common types of nuclear radiation.',
      'A decay series shows an unstable isotope changing until it becomes stable.',
    ],
    example: 'A radioactive isotope may go through several decay steps before it becomes stable.',
  },
  {
    title: 'Half-Life',
    label: 'Radiation',
    summary: 'Half-life is the time required for half of an unstable isotope sample to decay.',
    details: [
      'After one half-life, half the radioactive sample remains.',
      'After two half-lives, one fourth remains.',
      'Eventually unstable isotopes decay into stable isotopes.',
    ],
    example: 'If 100 g becomes 50 g after one half-life, then 25 g remains after two half-lives.',
  },
  {
    title: 'Alpha, Beta, and Gamma',
    label: 'Radiation',
    summary: 'Alpha, beta, and gamma radiation are different in mass, charge, and penetration.',
    details: [
      'Alpha radiation is a helium nucleus and has low penetration.',
      'Beta radiation is an electron emitted when a neutron becomes a proton.',
      'Gamma radiation is high-energy electromagnetic radiation with no mass or charge.',
    ],
    example: 'Beta decay increases the atomic number by 1, but the mass number stays the same.',
  },
  {
    title: 'Practical Uses of Radiation',
    label: 'Uses',
    summary: 'Radiation can be used for dating materials and tracing movement.',
    details: [
      'Radioactive dating estimates age based on radioactive material present.',
      'Tracers are radioactive atoms placed into substances so movement can be followed.',
      'Tracers are widely used in medicine.',
    ],
    example: 'A medical tracer can help doctors follow where a substance moves in the body.',
  },
  {
    title: 'Fusion and Fission',
    label: 'Reactions',
    summary: 'Fusion combines small nuclei. Fission splits a large nucleus.',
    details: [
      'Fusion occurs when two or more small nuclei combine to form a larger nucleus and release energy.',
      'Fusion powers the Sun as hydrogen nuclei fuse into helium.',
      'Fission occurs when a large nucleus splits into two smaller nuclei.',
      'Nuclear power plants use controlled fission to generate electricity.',
    ],
    example: 'Control rods in a fission reactor absorb neutrons to slow the reaction.',
  },
  {
    title: 'Electromagnetic Radiation',
    label: 'Light',
    summary: 'Electromagnetic radiation travels as a wave moving at the speed of light.',
    details: [
      'The electromagnetic spectrum is the continuous range of electromagnetic radiation.',
      'Think of a rainbow as part of the spectrum.',
      'Wavelength, frequency, and energy are connected.',
    ],
    example: 'Shorter wavelength means higher frequency and higher energy.',
  },
  {
    title: 'Photoelectric Effect',
    label: 'Light',
    summary: 'The photoelectric effect is when light causes electrons to leave a metal.',
    details: [
      'Light shines on a metal and electrons are emitted.',
      'Only certain frequencies of light work for certain metals.',
      'This helped scientists conclude energy comes in packets called quanta or photons.',
    ],
    example: 'If the light does not have enough frequency, electrons will not be emitted.',
  },
  {
    title: 'Electron Transitions',
    label: 'Electrons',
    summary: 'Electrons move between energy levels by absorbing or releasing specific amounts of energy.',
    details: [
      'Energy must be absorbed to move an electron farther from the nucleus.',
      'Energy is released when an electron returns closer to the nucleus.',
      'Electron transitions produce bright-line spectra with definite wavelengths.',
    ],
    example: 'Higher energy means the electron is farther from the nucleus.',
  },
];

const unitThreeQuestions: QuizQuestion[] = [
  {
    category: 'Isotopes',
    question: 'What are isotopes?',
    choices: ['Atoms of the same element with different numbers of neutrons', 'Atoms of different elements with the same mass', 'Molecules with no protons', 'Electrons that leave a metal'],
    answer: 'Atoms of the same element with different numbers of neutrons',
    explanation: 'Isotopes have the same number of protons but different numbers of neutrons.',
  },
  {
    category: 'Isotopes',
    question: 'Carbon-12, carbon-13, and carbon-14 are isotopes because they have the same number of what?',
    choices: ['Protons', 'Neutrons', 'Mass numbers', 'Nuclei'],
    answer: 'Protons',
    explanation: 'The element stays carbon because the atomic number, or number of protons, stays the same.',
  },
  {
    category: 'Isotopes',
    question: 'What makes carbon-14 heavier than carbon-12?',
    choices: ['Carbon-14 has more neutrons', 'Carbon-14 has fewer protons', 'Carbon-14 has no electrons', 'Carbon-14 has a smaller nucleus'],
    answer: 'Carbon-14 has more neutrons',
    explanation: 'Isotopes differ by neutrons, so carbon-14 has more neutrons than carbon-12.',
  },
  {
    category: 'Average Atomic Mass',
    question: 'What is average atomic mass?',
    choices: ['The weighted average mass of naturally occurring isotopes', 'The mass of only the most common isotope', 'The number of protons in an atom', 'The number of electrons emitted by light'],
    answer: 'The weighted average mass of naturally occurring isotopes',
    explanation: 'Average atomic mass uses isotope masses and their natural abundances.',
  },
  {
    category: 'Average Atomic Mass',
    question: 'When using a percent abundance in an average atomic mass calculation, what should you do first?',
    choices: ['Convert the percent to a decimal', 'Add it directly as a whole number', 'Ignore isotope mass', 'Divide protons by neutrons'],
    answer: 'Convert the percent to a decimal',
    explanation: 'For example, 75% becomes 0.75 before multiplying.',
  },
  {
    category: 'Average Atomic Mass',
    question: 'If an isotope has a mass of 32 amu and an abundance of 95%, which expression is correct?',
    choices: ['32 x 0.95', '32 x 95', '95 / 32', '32 + 95'],
    answer: '32 x 0.95',
    explanation: 'Use the abundance as a decimal in the weighted average.',
  },
  {
    category: 'Atoms',
    question: 'What does atomic number tell you?',
    choices: ['The number of protons', 'The number of protons plus neutrons', 'The number of photons', 'The half-life of the atom'],
    answer: 'The number of protons',
    explanation: 'Atomic number equals protons.',
  },
  {
    category: 'Atoms',
    question: 'What does mass number equal?',
    choices: ['Protons plus neutrons', 'Protons plus electrons', 'Neutrons minus protons', 'Electrons plus photons'],
    answer: 'Protons plus neutrons',
    explanation: 'Mass number counts the particles in the nucleus with significant mass.',
  },
  {
    category: 'Atoms',
    question: 'How do you find neutrons if you know mass number and atomic number?',
    choices: ['Mass number - atomic number', 'Atomic number - mass number', 'Mass number + atomic number', 'Atomic number x mass number'],
    answer: 'Mass number - atomic number',
    explanation: 'Neutrons = mass number - protons, and atomic number gives protons.',
  },
  {
    category: 'Atoms',
    question: 'A neutral carbon atom has 6 protons. How many electrons does it have?',
    choices: ['6', '8', '12', '14'],
    answer: '6',
    explanation: 'A neutral atom has the same number of electrons and protons.',
  },
  {
    category: 'Nuclear Chemistry',
    question: 'What does nuclear chemistry focus on?',
    choices: ['Changes in the nucleus', 'Only changes in color', 'Only changes in volume', 'The movement of liquids in a test tube'],
    answer: 'Changes in the nucleus',
    explanation: 'Nuclear chemistry is about the nucleus, not just electron behavior.',
  },
  {
    category: 'Nuclear Energy',
    question: 'What is nuclear binding energy?',
    choices: ['Energy that holds the nucleus together', 'Energy that measures volume', 'Energy that stops all particles from moving', 'Energy from density calculations only'],
    answer: 'Energy that holds the nucleus together',
    explanation: 'Binding energy holds protons and neutrons together in the nucleus.',
  },
  {
    category: 'Nuclear Energy',
    question: 'What is mass defect?',
    choices: ['The difference between the mass before and after a nucleus forms', 'The total mass of a gas sample', 'The number of electrons in a neutral atom', 'The number of photons in light'],
    answer: 'The difference between the mass before and after a nucleus forms',
    explanation: 'Mass defect is connected to nuclear binding energy.',
  },
  {
    category: 'Nuclear Energy',
    question: 'Which equation connects mass and energy?',
    choices: ['E = mc2', 'D = m / V', 'V = m / D', 'n = mass - protons'],
    answer: 'E = mc2',
    explanation: 'Einstein\'s equation shows that mass can be converted into energy.',
  },
  {
    category: 'Radiation',
    question: 'What happens during radioactive decay?',
    choices: ['An unstable nucleus releases radiation to become more stable', 'A liquid always becomes less dense', 'A physical property changes without energy', 'An electron always disappears forever'],
    answer: 'An unstable nucleus releases radiation to become more stable',
    explanation: 'Radioactive decay helps unstable nuclei move toward stability.',
  },
  {
    category: 'Radiation',
    question: 'What is a decay series?',
    choices: ['A model showing a radioactive isotope changing until it becomes stable', 'A list of density formulas', 'A graph of mass versus volume', 'A list of homogeneous mixtures'],
    answer: 'A model showing a radioactive isotope changing until it becomes stable',
    explanation: 'A decay series tracks the steps from unstable isotope to stable isotope.',
  },
  {
    category: 'Radiation',
    question: 'What is half-life?',
    choices: ['The time required for half of an unstable isotope sample to decay', 'The time required for a liquid to boil', 'The number of protons in an atom', 'The distance between two wave crests'],
    answer: 'The time required for half of an unstable isotope sample to decay',
    explanation: 'Half-life tells how long it takes for half the radioactive material to decay.',
  },
  {
    category: 'Radiation',
    question: 'If 80 g of an isotope goes through one half-life, how much remains?',
    choices: ['40 g', '20 g', '80 g', '160 g'],
    answer: '40 g',
    explanation: 'One half-life cuts the amount in half.',
  },
  {
    category: 'Radiation',
    question: 'What is alpha radiation?',
    choices: ['A helium nucleus', 'A high-energy wave with no mass or charge', 'An electron emitted from the nucleus', 'A proton turning into an electron'],
    answer: 'A helium nucleus',
    explanation: 'Alpha particles contain 2 protons and 2 neutrons, like a helium nucleus.',
  },
  {
    category: 'Radiation',
    question: 'What happens to atomic number during beta decay?',
    choices: ['It increases by 1', 'It decreases by 2', 'It stays the same while mass increases by 4', 'It becomes zero'],
    answer: 'It increases by 1',
    explanation: 'In beta decay, a neutron changes into a proton, so atomic number increases.',
  },
  {
    category: 'Radiation',
    question: 'What is gamma radiation?',
    choices: ['High-energy electromagnetic radiation with no mass or charge', 'A helium nucleus', 'A whole atom with no electrons', 'A liquid with high density'],
    answer: 'High-energy electromagnetic radiation with no mass or charge',
    explanation: 'Gamma radiation is energy, not a particle with mass.',
  },
  {
    category: 'Radiation Uses',
    question: 'What does radioactive dating help scientists determine?',
    choices: ['Approximate age', 'Liquid density only', 'Exact color', 'The shape of a container'],
    answer: 'Approximate age',
    explanation: 'Radioactive dating uses radioactive material to estimate age.',
  },
  {
    category: 'Radiation Uses',
    question: 'What are tracers?',
    choices: ['Radioactive atoms incorporated into substances so movement can be followed', 'Pieces of metal that block all light', 'Liquids sorted by density', 'Stable atoms with no nucleus'],
    answer: 'Radioactive atoms incorporated into substances so movement can be followed',
    explanation: 'Tracers are useful because scientists can follow where they move.',
  },
  {
    category: 'Fusion and Fission',
    question: 'What is fusion?',
    choices: ['Small nuclei combine to form a larger nucleus and release energy', 'A large nucleus splits into smaller nuclei', 'A metal emits electrons because light shines on it', 'A sample loses half its mass by density'],
    answer: 'Small nuclei combine to form a larger nucleus and release energy',
    explanation: 'Fusion combines nuclei.',
  },
  {
    category: 'Fusion and Fission',
    question: 'What reaction powers the Sun?',
    choices: ['Fusion of hydrogen nuclei into helium', 'Fission of uranium in control rods', 'Beta decay of carbon isotopes', 'Photoelectric emission from metals'],
    answer: 'Fusion of hydrogen nuclei into helium',
    explanation: 'The Sun is powered by fusion.',
  },
  {
    category: 'Fusion and Fission',
    question: 'What is fission?',
    choices: ['A large nucleus splits into two smaller nuclei', 'Two small nuclei combine into one larger nucleus', 'A wave moves at the speed of light', 'An isotope becomes more abundant'],
    answer: 'A large nucleus splits into two smaller nuclei',
    explanation: 'Fission means splitting a nucleus.',
  },
  {
    category: 'Fusion and Fission',
    question: 'What do control rods do in a nuclear reactor?',
    choices: ['Absorb neutrons to slow the reaction', 'Increase liquid density', 'Make electrons leave metal', 'Turn photons into protons'],
    answer: 'Absorb neutrons to slow the reaction',
    explanation: 'Control rods help keep fission reactions controlled.',
  },
  {
    category: 'Light',
    question: 'How does electromagnetic radiation travel?',
    choices: ['As a wave moving at the speed of light', 'Only as a liquid through tubes', 'Only as a solid particle with mass', 'As density divided by volume'],
    answer: 'As a wave moving at the speed of light',
    explanation: 'Electromagnetic radiation propagates through space as a wave.',
  },
  {
    category: 'Light',
    question: 'What is the electromagnetic spectrum?',
    choices: ['A continuous range of frequencies of electromagnetic radiation', 'A list of isotope masses only', 'A graph of mass and volume', 'A series of liquid layers'],
    answer: 'A continuous range of frequencies of electromagnetic radiation',
    explanation: 'The spectrum includes a range of electromagnetic radiation frequencies.',
  },
  {
    category: 'Light',
    question: 'What is the photoelectric effect?',
    choices: ['Electrons are emitted from a metal when light shines on it', 'A nucleus splits into two nuclei', 'A liquid floats because it is less dense', 'An isotope loses half its sample'],
    answer: 'Electrons are emitted from a metal when light shines on it',
    explanation: 'The photoelectric effect helped show that energy comes in packets.',
  },
  {
    category: 'Light',
    question: 'What did the photoelectric effect help scientists conclude?',
    choices: ['Energy comes in packets called quanta or photons', 'All atoms have the same mass', 'Density equals volume divided by mass', 'Electrons never move between energy levels'],
    answer: 'Energy comes in packets called quanta or photons',
    explanation: 'Only certain frequencies working showed energy is quantized.',
  },
  {
    category: 'Light',
    question: 'Which relationship is correct?',
    choices: ['Shorter wavelength means higher frequency and higher energy', 'Shorter wavelength means lower energy', 'Longer wavelength means higher frequency', 'Frequency and energy are never related'],
    answer: 'Shorter wavelength means higher frequency and higher energy',
    explanation: 'The study guide notes connect shorter wavelength with higher frequency and higher energy.',
  },
  {
    category: 'Electrons',
    question: 'What must happen for an electron to move farther from the nucleus?',
    choices: ['Energy must be absorbed', 'Energy must be released', 'The atom must lose all protons', 'Density must decrease'],
    answer: 'Energy must be absorbed',
    explanation: 'Moving an electron away from the nucleus requires energy input.',
  },
  {
    category: 'Electrons',
    question: 'What happens when an electron returns closer to the nucleus?',
    choices: ['Energy is released', 'Energy is absorbed', 'The nucleus disappears', 'The atom becomes a liquid'],
    answer: 'Energy is released',
    explanation: 'Electrons release energy when they fall back to a lower energy level.',
  },
  {
    category: 'Electrons',
    question: 'What do electron transitions produce?',
    choices: ['Bright-line spectra with definite wavelengths', 'Only homogeneous mixtures', 'A density table', 'A layer of liquid in a test tube'],
    answer: 'Bright-line spectra with definite wavelengths',
    explanation: 'Electron jumps release or absorb definite amounts of energy, producing specific wavelengths.',
  },
];

const studyUnits: StudyUnit[] = [
  {
    id: 'unit-2',
    label: 'Unit 2',
    title: 'Matter and Density',
    description: 'Matter, physical and chemical properties, density, mixtures, metric units, states of matter, and the colored-liquid density lab.',
    topics: learnTopics,
    questions: quizQuestions,
    hasDensityLab: true,
  },
  {
    id: 'unit-3',
    label: 'Unit 3',
    title: 'Isotopes and Nuclear Chemistry',
    description: 'Average atomic mass, isotopes, radioactive decay, half-life, fusion, fission, electromagnetic radiation, and electron transitions.',
    topics: unitThreeTopics,
    questions: unitThreeQuestions,
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

function buildDeck(questions: QuizQuestion[]) {
  return shuffle(questions).slice(0, 10).map((question) => ({
    ...question,
    choices: shuffle(question.choices),
  }));
}

const statsStorageKey = 'chemistry-stats-v1';

function blankStats(): StatsRecord {
  return Object.fromEntries(studyUnits.map((unit) => [
    unit.id,
    { attempts: 0, correct: 0, categories: {} },
  ]));
}

function loadStats(): StatsRecord {
  if (typeof window === 'undefined') return blankStats();
  try {
    return { ...blankStats(), ...JSON.parse(window.localStorage.getItem(statsStorageKey) || '{}') };
  } catch {
    return blankStats();
  }
}

export default function ChemistryStudy() {
  const [mode, setMode] = useState<Mode>('learn');
  const [activeUnitId, setActiveUnitId] = useState('unit-2');
  const [openTopic, setOpenTopic] = useState(0);
  const [deck, setDeck] = useState(() => buildDeck(studyUnits[0].questions));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [showDensityAnswers, setShowDensityAnswers] = useState(false);
  const [stats, setStats] = useState<StatsRecord>(loadStats);

  const activeUnit = studyUnits.find((unit) => unit.id === activeUnitId) || studyUnits[0];
  const currentQuestion = deck[currentIndex];
  const isAnswered = selected !== '';
  const isCorrect = selected === currentQuestion.answer;

  function saveStats(nextStats: StatsRecord) {
    setStats(nextStats);
    window.localStorage.setItem(statsStorageKey, JSON.stringify(nextStats));
  }

  function startNewQuiz(unit = activeUnit) {
    setDeck(buildDeck(unit.questions));
    setCurrentIndex(0);
    setSelected('');
  }

  function switchUnit(unitId: string) {
    const nextUnit = studyUnits.find((unit) => unit.id === unitId) || studyUnits[0];
    setActiveUnitId(nextUnit.id);
    setMode('learn');
    setOpenTopic(0);
    startNewQuiz(nextUnit);
  }

  function answerQuestion(choice: string) {
    if (selected) return;
    const correct = choice === currentQuestion.answer;
    const unitStats = stats[activeUnit.id] || { attempts: 0, correct: 0, categories: {} };
    const categoryStats = unitStats.categories[currentQuestion.category] || { attempts: 0, correct: 0 };
    saveStats({
      ...stats,
      [activeUnit.id]: {
        attempts: unitStats.attempts + 1,
        correct: unitStats.correct + (correct ? 1 : 0),
        categories: {
          ...unitStats.categories,
          [currentQuestion.category]: {
            attempts: categoryStats.attempts + 1,
            correct: categoryStats.correct + (correct ? 1 : 0),
          },
        },
      },
    });
    setSelected(choice);
  }

  function resetStats() {
    const typed = window.prompt('Are you sure you want to reset chemistry stats? Type CHEM to reset.');
    if (typed === 'CHEM') saveStats(blankStats());
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
          <div className="hero-top">
            <div>
              <p className="eyebrow">Chemistry {activeUnit.label}</p>
              <h1>Chemistry Study Guide</h1>
            </div>
            <button className="stats-button" type="button" onClick={() => setMode('stats')}>Stats</button>
          </div>
          <p className="hero-copy">{activeUnit.description}</p>
          <div className="unit-row">
            {studyUnits.map((unit) => (
              <button className={activeUnit.id === unit.id ? 'active' : ''} key={unit.id} type="button" onClick={() => switchUnit(unit.id)}>
                {unit.label}
              </button>
            ))}
          </div>
          <div className="mode-row">
            <button className={mode === 'learn' ? 'active' : ''} type="button" onClick={() => setMode('learn')}>Learn It</button>
            <button className={mode === 'quiz' ? 'active' : ''} type="button" onClick={() => setMode('quiz')}>Practice It</button>
            {activeUnit.hasDensityLab && <button className={mode === 'density' ? 'active' : ''} type="button" onClick={() => setMode('density')}>Density Lab</button>}
          </div>
        </section>

        {mode === 'learn' && (
          <section className="panel">
            <div className="section-heading">
              <p>{activeUnit.label} Topics</p>
              <h2>Pick a card to study</h2>
            </div>
            <div className="learn-grid">
              {activeUnit.topics.map((topic, index) => {
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
                  onClick={() => answerQuestion(choice)}
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

        {mode === 'stats' && (
          <section className="panel">
            <div className="quiz-top">
              <div>
                <p className="eyebrow dark">Chemistry Stats</p>
                <h2>Progress by unit</h2>
              </div>
              <button className="small-button" type="button" onClick={resetStats}>Reset Stats</button>
            </div>
            <div className="stats-grid">
              {studyUnits.map((unit) => {
                const unitStats = stats[unit.id] || { attempts: 0, correct: 0, categories: {} };
                const percent = unitStats.attempts ? Math.round((unitStats.correct / unitStats.attempts) * 100) : 0;
                return (
                  <article className="stats-card" key={unit.id}>
                    <p>{unit.label}</p>
                    <strong>{unitStats.correct}/{unitStats.attempts}</strong>
                    <span>{percent}% correct</span>
                    {Object.entries(unitStats.categories).map(([category, categoryStats]) => (
                      <em key={category}>{category}: {categoryStats.correct}/{categoryStats.attempts}</em>
                    ))}
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {mode === 'density' && activeUnit.hasDensityLab && (
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

        .hero-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
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

        .unit-row, .mode-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .unit-row {
          margin-top: 1.35rem;
        }

        .mode-row {
          margin-top: 1.5rem;
        }

        button {
          font: inherit;
        }

        .unit-row button, .mode-row button, .small-button, .feedback button, .stats-button {
          border: 0;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.14);
          color: #fff9e9;
          cursor: pointer;
          font-weight: 900;
        }

        .unit-row button, .mode-row button {
          padding: 0.85rem 1.2rem;
          border: 1px solid rgba(255,255,255,0.25);
        }

        .unit-row button.active, .mode-row button.active, .small-button {
          background: linear-gradient(135deg, #f08a35, #d85621);
          color: #fff9e9;
        }

        .stats-button {
          padding: 0.7rem 0.95rem;
          background: rgba(255, 249, 233, 0.16);
          border: 1px solid rgba(255, 255, 255, 0.25);
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.85rem;
          margin-top: 1rem;
        }

        .stats-card {
          padding: 1rem;
          border: 1px solid rgba(39, 78, 72, 0.14);
          border-radius: 18px;
          background: #fffdf7;
        }

        .stats-card p {
          color: #bd6732;
          font-weight: 900;
        }

        .stats-card strong, .stats-card span, .stats-card em {
          display: block;
        }

        .stats-card strong {
          margin-top: 0.35rem;
          font-size: 2rem;
          line-height: 1;
        }

        .stats-card span {
          margin-top: 0.35rem;
          color: #506158;
          font-weight: 900;
        }

        .stats-card em {
          margin-top: 0.45rem;
          color: #506158;
          font-style: normal;
          line-height: 1.4;
        }

        @media (max-width: 720px) {
          .shell { width: min(100% - 0.85rem, 1040px); padding-top: 0.45rem; }
          .hero, .panel { border-radius: 18px; }
          .hero { padding: 1.25rem; }
          .panel { padding: 1rem; }
          .hero-top { align-items: flex-start; }
          .mode-row { display: grid; grid-template-columns: 1fr; }
          .quiz-top, .practice-header { align-items: flex-start; flex-direction: column; }
          .formula-grid, .liquid-grid, .stats-grid { grid-template-columns: 1fr; }
          .question { font-size: 1.35rem; }
        }
      `}</style>
    </div>
  );
}
