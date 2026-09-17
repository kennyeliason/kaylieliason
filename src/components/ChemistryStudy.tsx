import { useState } from 'react';

type Mode = 'learn' | 'quiz' | 'density' | 'isotope' | 'stats';

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

type IsotopeLabRow = {
  id: string;
  given: Record<string, string>;
  answers: Record<string, string>;
};

const isotopeLabSets: IsotopeLabRow[][] = [
  [
    { id: 'calcium', given: { symbol: '⁴⁰Ca', atomic: '20', electrons: '20' }, answers: { isotope: 'Calcium-40', mass: '40', protons: '20', neutrons: '20' } },
    { id: 'chlorine', given: { symbol: '³⁵Cl', protons: '17', electrons: '17' }, answers: { isotope: 'Chlorine-35', mass: '35', atomic: '17', neutrons: '18' } },
    { id: 'iron', given: { symbol: '⁵⁶Fe', mass: '56', atomic: '26', electrons: '26' }, answers: { isotope: 'Iron-56', protons: '26', neutrons: '30' } },
  ],
  [
    { id: 'sodium', given: { symbol: '²³Na', atomic: '11', electrons: '11' }, answers: { isotope: 'Sodium-23', mass: '23', protons: '11', neutrons: '12' } },
    { id: 'oxygen', given: { symbol: '¹⁸O', protons: '8', electrons: '8' }, answers: { isotope: 'Oxygen-18', mass: '18', atomic: '8', neutrons: '10' } },
    { id: 'copper', given: { symbol: '⁶⁴Cu', mass: '64', atomic: '29', electrons: '29' }, answers: { isotope: 'Copper-64', protons: '29', neutrons: '35' } },
  ],
  [
    { id: 'magnesium', given: { symbol: '²⁴Mg', atomic: '12', electrons: '12' }, answers: { isotope: 'Magnesium-24', mass: '24', protons: '12', neutrons: '12' } },
    { id: 'nitrogen', given: { symbol: '¹⁵N', protons: '7', electrons: '7' }, answers: { isotope: 'Nitrogen-15', mass: '15', atomic: '7', neutrons: '8' } },
    { id: 'zinc', given: { symbol: '⁶⁵Zn', mass: '65', atomic: '30', electrons: '30' }, answers: { isotope: 'Zinc-65', protons: '30', neutrons: '35' } },
  ],
  [
    { id: 'potassium', given: { symbol: '³⁹K', atomic: '19', electrons: '19' }, answers: { isotope: 'Potassium-39', mass: '39', protons: '19', neutrons: '20' } },
    { id: 'sulfur', given: { symbol: '³²S', protons: '16', electrons: '16' }, answers: { isotope: 'Sulfur-32', mass: '32', atomic: '16', neutrons: '16' } },
    { id: 'bromine', given: { symbol: '⁸⁰Br', mass: '80', atomic: '35', electrons: '35' }, answers: { isotope: 'Bromine-80', protons: '35', neutrons: '45' } },
  ],
];

type AverageMassProblem = {
  id: string;
  prompt: string;
  answer: string;
};

const averageMassProblems: AverageMassProblem[] = [
  { id: 'carbon', prompt: '1. Carbon-12 has a mass of 12.00 amu and an abundance of 98.89%. Carbon-13 has a mass of 13.0034 amu and an abundance of 1.11%. Find the average atomic mass. Round to the hundredths place.', answer: '12.01 amu' },
  { id: 'argon', prompt: '2. Argon-36 has a mass of 35.9675 amu and abundance 0.34%; argon-38 has a mass of 37.9627 amu and abundance 0.063%; argon-40 has a mass of 39.9624 amu and abundance 99.60%. Find the average atomic mass. Round to the hundredths place.', answer: '39.95 amu' },
  { id: 'boron', prompt: '3. Element Z has isotopes with masses 10.0129 amu (19.80%) and 11.0093 amu (80.20%). Find its average atomic mass and identify the element using the periodic table.', answer: '10.81 amu, boron' },
  { id: 'silicon', prompt: '4. Silicon has an average atomic mass of 28.08 amu. Silicon-28 is 27.978 amu (92.2%), silicon-29 is 28.978 amu (4.67%), and the third isotope is 3.10%. Find the mass of the third isotope.', answer: '30.00 amu' },
];

// These prompts mirror the numbered Unit 3 study guide, followed by five
// small review questions for extra practice.
const unitThreePracticeQuestions: QuizQuestion[] = [
  { category: '1. Periodic Table', question: 'What are the names of the columns and rows of the periodic table?', choices: ['Columns are groups/families; rows are periods', 'Columns are periods; rows are groups/families', 'Columns are isotopes; rows are compounds', 'Columns are protons; rows are electrons'], answer: 'Columns are groups/families; rows are periods', explanation: 'This is exactly the organization named in the study guide.' },
  { category: '2. Neutral Atoms', question: 'Why is an atom electrically neutral?', choices: ['Positive protons equal negative electrons', 'Protons always equal neutrons', 'Electrons have no electric charge', 'The mass number is always even'], answer: 'Positive protons equal negative electrons', explanation: 'Equal positive and negative charges cancel out.' },
  { category: '3. Atomic Size', question: 'Which subatomic particles determine the size of an atom?', choices: ['The electrons in the electron cloud', 'The protons in the nucleus', 'The neutrons in the nucleus', 'The mass number alone'], answer: 'The electrons in the electron cloud', explanation: 'Protons and neutrons determine mass, while the electron cloud determines diameter.' },
  { category: '4. Isotopes', question: 'What is an isotope?', choices: ['An atom of the same element with a different number of neutrons', 'An atom of a new element with the same electrons', 'A compound made from the same element twice', 'A neutral atom with zero protons'], answer: 'An atom of the same element with a different number of neutrons', explanation: 'Same protons means the same element; different neutrons means a different isotope.' },
  { category: '5. Average Atomic Mass', question: 'How is the average atomic mass of an element calculated?', choices: ['Add each isotope mass multiplied by its decimal abundance', 'Add all isotope masses and divide by the number of periods', 'Subtract protons from each isotope mass', 'Use only the most common isotope mass'], answer: 'Add each isotope mass multiplied by its decimal abundance', explanation: 'Average atomic mass is a weighted average of naturally occurring isotopes.' },
  { category: '6. Particle Charges', question: 'What are the charges of a proton, neutron, and electron?', choices: ['Proton positive, neutron no charge, electron negative', 'Proton negative, neutron positive, electron no charge', 'Proton no charge, neutron negative, electron positive', 'All three particles have a positive charge'], answer: 'Proton positive, neutron no charge, electron negative', explanation: 'That is the charge pattern from the guide.' },
  { category: '7. Atomic Number', question: 'What does the atomic number of an element signify?', choices: ['The number of protons in its nucleus', 'The number of neutrons in its nucleus', 'The number of electrons lost in a reaction', 'The average mass of all isotopes'], answer: 'The number of protons in its nucleus', explanation: 'The proton count identifies the element.' },
  { category: '8. Mass Number', question: 'What does the atomic mass number signify?', choices: ['The number of protons and neutrons in the nucleus', 'The number of protons and electrons in the atom', 'The total electrons in the electron cloud', 'The group number on the periodic table'], answer: 'The number of protons and neutrons in the nucleus', explanation: 'Mass number is the total of protons plus neutrons.' },
  { category: '9. Isotope Review', question: 'What is common to all isotopes of an element?', choices: ['The same number of protons in the nucleus', 'The same number of neutrons in the nucleus', 'The same mass number for every isotope', 'The same number of energy levels'], answer: 'The same number of protons in the nucleus', explanation: 'Isotopes differ by neutrons, not by protons.' },
  { category: '10. Element Families', question: 'Which statement correctly places element families on the periodic table?', choices: ['Alkali metals first column; halogens second from right; noble gases last column', 'Halogens first column; noble gases second from right; alkali metals last column', 'Metalloids fill only the far-right column; all metals are in the bottom row', 'Alkaline earth metals are in the last column; noble gases are in the first'], answer: 'Alkali metals first column; halogens second from right; noble gases last column', explanation: 'Alkaline earth metals are in the second column, and metalloids sit between metals and nonmetals.' },
  { category: '11. Metals and Nonmetals', question: 'Which comparison of metals and nonmetals is correct?', choices: ['Metals conduct heat/electricity well; nonmetals are often poor conductors', 'Metals are always gases; nonmetals are always shiny solids', 'Metals have no luster; nonmetals are always ductile', 'Metals and nonmetals always have identical properties'], answer: 'Metals conduct heat/electricity well; nonmetals are often poor conductors', explanation: 'Metals are usually malleable, ductile, lustrous conductors; nonmetals are often brittle and poor conductors.' },
  { category: '12. Mendeleev', question: 'Who arranged elements into a table based on properties and predicted new elements?', choices: ['Dmitri Mendeleev', 'J. J. Thomson', 'Ernest Rutherford', 'John Dalton'], answer: 'Dmitri Mendeleev', explanation: 'Mendeleev used patterns to predict properties of undiscovered elements.' },
  { category: '13. Compounds', question: 'What must be true about a compound such as H₂O?', choices: ['Its elements are combined in a fixed ratio that cannot change', 'Its elements can be mixed in any ratio and stay the same compound', 'It contains only one kind of atom', 'It has the same mass number as every isotope'], answer: 'Its elements are combined in a fixed ratio that cannot change', explanation: 'Changing the ratio makes a different substance, such as hydrogen peroxide rather than water.' },
  { category: 'Extra Review', question: 'A neutral atom has atomic number 17 and mass number 35. How many neutrons does it have?', choices: ['18 neutrons', '17 neutrons', '35 neutrons', '52 neutrons'], answer: '18 neutrons', explanation: 'Neutrons = 35 − 17 = 18.' },
  { category: 'Extra Review', question: 'A neutral iron-56 atom has atomic number 26. How many electrons does it have?', choices: ['26 electrons', '30 electrons', '56 electrons', '82 electrons'], answer: '26 electrons', explanation: 'Neutral atoms have equal numbers of protons and electrons.' },
  { category: 'Extra Review', question: 'Why do isotopes of one element have different masses?', choices: ['They have different numbers of neutrons', 'They have different numbers of protons', 'They have different element symbols', 'They have different group numbers'], answer: 'They have different numbers of neutrons', explanation: 'The neutron count changes mass number while the proton count stays the same.' },
  { category: 'Extra Review', question: 'Which calculation shows the correct beginning of a weighted-average problem?', choices: ['Isotope mass × decimal abundance', 'Isotope mass + percent abundance', 'Atomic number ÷ mass number', 'Protons + electrons'], answer: 'Isotope mass × decimal abundance', explanation: 'Convert percent to decimal first, then multiply each isotope mass by that decimal.' },
  { category: 'Extra Review', question: 'A material is shiny, malleable, and conducts electricity. What type of element is it most likely?', choices: ['A metal', 'A nonmetal', 'A noble gas', 'An isotope'], answer: 'A metal', explanation: 'Those are common metal properties.' },
];

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
    title: 'Atoms, Elements, and Isotopes',
    description: 'Periodic-table structure, atomic particles, isotopes, charges, element families, compounds, and average atomic mass.',
    topics: [
      { title: 'Periodic Table Layout', label: 'Table', summary: 'Columns are groups or families; rows are periods.', details: ['Elements in a group share similar properties.', 'Periods run across the table from left to right.', 'The periodic table organizes elements so patterns are easier to see.'], example: 'Column 1 is the alkali metals; the far-right column is the noble gases.' },
      { title: 'Atomic Parts and Charge', label: 'Atoms', summary: 'Protons are positive, neutrons have no charge, and electrons are negative.', details: ['Atomic number equals the number of protons.', 'A neutral atom has the same number of protons and electrons.', 'Mass number equals protons plus neutrons.'], example: 'An atom with 17 protons and 17 electrons is neutral chlorine.' },
      { title: 'Isotopes', label: 'Isotopes', summary: 'Isotopes are the same element with different numbers of neutrons.', details: ['Same protons means the same element.', 'Different neutrons change the mass number.', 'Neutrons = mass number − atomic number.'], example: 'Chlorine-35 and chlorine-37 both have 17 protons but different neutrons.' },
      { title: 'Average Atomic Mass', label: 'Average', summary: 'Multiply each isotope mass by its decimal abundance, then add the products.', details: ['Convert every percent to a decimal first.', 'Use all naturally occurring isotopes in the calculation.', 'The final value is a weighted average, so common isotopes affect it more.'], example: '12.00(0.9889) + 13.0034(0.0111) gives carbon’s average atomic mass.' },
      { title: 'Element Families', label: 'Families', summary: 'Groups on the periodic table contain elements with similar properties.', details: ['Alkali metals are in the first column; alkaline earth metals are in the second.', 'Metalloids sit between metals and nonmetals.', 'Halogens are second from the right; noble gases are on the far right.'], example: 'Metals conduct heat and electricity well, while many nonmetals are poor conductors.' },
      { title: 'Compounds', label: 'Compounds', summary: 'Compounds use a fixed ratio of different atoms.', details: ['A compound is not a random mixture.', 'The ratio of atoms cannot change and still be the same compound.', 'A chemical formula shows that fixed ratio.'], example: 'H₂O is always two hydrogen atoms for every one oxygen atom.' },
    ],
    questions: [
      { category: 'Periodic Table', question: 'What are the vertical columns on the periodic table called?', choices: ['Groups or families', 'Periods or rows', 'Isotopes or ions', 'Protons or neutrons'], answer: 'Groups or families', explanation: 'Columns are groups, also called families.' },
      { category: 'Periodic Table', question: 'What are the horizontal rows on the periodic table called?', choices: ['Periods', 'Families', 'Nuclei', 'Isotopes'], answer: 'Periods', explanation: 'Rows run across the table and are called periods.' },
      { category: 'Atoms', question: 'Why does a neutral atom have no overall electric charge?', choices: ['Its positive protons equal its negative electrons', 'Its neutrons equal its electrons', 'It has no protons in its nucleus', 'It has the same mass as carbon'], answer: 'Its positive protons equal its negative electrons', explanation: 'Positive protons and negative electrons cancel when their counts are equal.' },
      { category: 'Atoms', question: 'Which particle has a positive charge?', choices: ['Proton', 'Electron', 'Neutron', 'Isotope'], answer: 'Proton', explanation: 'Protons are positive, electrons are negative, and neutrons are neutral.' },
      { category: 'Atoms', question: 'Which particle has no electrical charge?', choices: ['Neutron', 'Proton', 'Electron', 'Nucleus'], answer: 'Neutron', explanation: 'Neutrons have zero charge.' },
      { category: 'Atoms', question: 'Which particle has a negative charge?', choices: ['Electron', 'Proton', 'Neutron', 'Mass number'], answer: 'Electron', explanation: 'Electrons are the negatively charged particles in the electron cloud.' },
      { category: 'Atoms', question: 'What mostly determines an atom’s mass?', choices: ['The protons and neutrons in its nucleus', 'The electrons in its outer cloud', 'The color of the element symbol', 'The row where it appears'], answer: 'The protons and neutrons in its nucleus', explanation: 'Protons and neutrons have nearly all of an atom’s mass.' },
      { category: 'Atoms', question: 'What mainly determines the size or diameter of an atom?', choices: ['Its electron cloud', 'Its number of neutrons', 'Its atomic mass only', 'Its chemical formula'], answer: 'Its electron cloud', explanation: 'The electron cloud takes up most of an atom’s volume.' },
      { category: 'Isotopes', question: 'What is an isotope?', choices: ['Same element with a different number of neutrons', 'Different element with the same number of protons', 'Neutral atom with no electrons', 'Compound with a fixed atom ratio'], answer: 'Same element with a different number of neutrons', explanation: 'Isotopes keep the same protons but have different neutrons.' },
      { category: 'Isotopes', question: 'Why are chlorine-35 and chlorine-37 still both chlorine?', choices: ['They both have 17 protons', 'They both have 35 neutrons', 'They both have 37 electrons', 'They have identical masses'], answer: 'They both have 17 protons', explanation: 'The number of protons determines the element.' },
      { category: 'Atoms', question: 'What does an element’s atomic number tell you?', choices: ['The number of protons in the nucleus', 'The number of protons plus neutrons', 'The average isotope mass', 'The number of periods'], answer: 'The number of protons in the nucleus', explanation: 'Atomic number equals the number of protons.' },
      { category: 'Atoms', question: 'What is another name for the mass number?', choices: ['The total number of protons and neutrons', 'The total number of protons and electrons', 'The electron-cloud diameter', 'The average of all periods'], answer: 'The total number of protons and neutrons', explanation: 'Mass number counts the nucleus particles with significant mass.' },
      { category: 'Atoms', question: 'How do you calculate the number of neutrons?', choices: ['Mass number minus atomic number', 'Atomic number minus mass number', 'Mass number plus atomic number', 'Electrons minus protons'], answer: 'Mass number minus atomic number', explanation: 'Atomic number gives protons, so subtract it from mass number.' },
      { category: 'Atoms', question: 'A neutral calcium-40 atom has atomic number 20. How many electrons does it have?', choices: ['20 electrons', '40 electrons', '60 electrons', '20 neutrons'], answer: '20 electrons', explanation: 'A neutral atom has the same number of electrons and protons.' },
      { category: 'Atoms', question: 'How many neutrons are in chlorine-35 if its atomic number is 17?', choices: ['18 neutrons', '17 neutrons', '35 neutrons', '52 neutrons'], answer: '18 neutrons', explanation: '35 − 17 = 18 neutrons.' },
      { category: 'Atoms', question: 'How many neutrons are in iron-56 if its atomic number is 26?', choices: ['30 neutrons', '26 neutrons', '56 neutrons', '82 neutrons'], answer: '30 neutrons', explanation: '56 − 26 = 30 neutrons.' },
      { category: 'Average Atomic Mass', question: 'What is the first step when using a percent abundance in an average atomic mass problem?', choices: ['Convert the percent to a decimal', 'Add the percent to the isotope mass', 'Divide the mass by the percent', 'Round every mass to a whole number'], answer: 'Convert the percent to a decimal', explanation: 'For example, 98.89% becomes 0.9889.' },
      { category: 'Average Atomic Mass', question: 'Which expression correctly finds carbon’s average atomic mass using 12.00 amu at 98.89% and 13.0034 amu at 1.11%?', choices: ['12.00(0.9889) + 13.0034(0.0111)', '12.00(98.89) + 13.0034(1.11)', '12.00 + 13.0034 divided by 2', '98.89 + 1.11 multiplied by 12'], answer: '12.00(0.9889) + 13.0034(0.0111)', explanation: 'Multiply each mass by its decimal abundance, then add.' },
      { category: 'Average Atomic Mass', question: 'Why does the most abundant isotope affect average atomic mass the most?', choices: ['Its mass is multiplied by the largest decimal abundance', 'It always has the most protons', 'It is the only isotope with electrons', 'It has the smallest mass number'], answer: 'Its mass is multiplied by the largest decimal abundance', explanation: 'The weighted average gives common isotopes more influence.' },
      { category: 'Average Atomic Mass', question: 'An element has isotopes of 10.0129 amu at 19.80% and 11.0093 amu at 80.20%. Which element is this closest to on the periodic table?', choices: ['Boron', 'Carbon', 'Nitrogen', 'Oxygen'], answer: 'Boron', explanation: 'The weighted average is about 10.81 amu, which matches boron.' },
      { category: 'Families', question: 'Which group is the first column on the periodic table?', choices: ['Alkali metals', 'Alkaline earth metals', 'Halogens', 'Noble gases'], answer: 'Alkali metals', explanation: 'Alkali metals are in the first column.' },
      { category: 'Families', question: 'Which group is the second column on the periodic table?', choices: ['Alkaline earth metals', 'Alkali metals', 'Halogens', 'Noble gases'], answer: 'Alkaline earth metals', explanation: 'Alkaline earth metals are in the second column.' },
      { category: 'Families', question: 'Where are the halogens located on the periodic table?', choices: ['The second column from the right', 'The first column from the left', 'The center transition block', 'The very last row only'], answer: 'The second column from the right', explanation: 'Halogens are immediately left of the noble gases.' },
      { category: 'Families', question: 'Where are the noble gases located on the periodic table?', choices: ['The far-right column', 'The far-left column', 'The second column from the left', 'The bottom row only'], answer: 'The far-right column', explanation: 'Noble gases form the last group on the right.' },
      { category: 'Families', question: 'Where are metalloids generally found?', choices: ['Along the boundary between metals and nonmetals', 'Only in the far-right noble-gas column', 'Only in the first alkali-metal column', 'Only below the main periodic table'], answer: 'Along the boundary between metals and nonmetals', explanation: 'Metalloids sit between metals and nonmetals and share some properties of each.' },
      { category: 'Properties', question: 'Which property best describes most metals?', choices: ['Good conductors of heat and electricity', 'Brittle poor conductors at room temperature', 'Always gases with no shine', 'Always colorless and odorless'], answer: 'Good conductors of heat and electricity', explanation: 'Metals usually conduct heat and electricity well.' },
      { category: 'Properties', question: 'Which property best describes many nonmetals?', choices: ['Poor conductors that may be brittle or gaseous', 'Strong conductors with metallic shine', 'Always solid at high temperatures', 'Made only of positive protons'], answer: 'Poor conductors that may be brittle or gaseous', explanation: 'Many nonmetals are brittle solids or gases and conduct poorly.' },
      { category: 'Periodic Table', question: 'How did Mendeleev help develop the periodic table?', choices: ['He predicted properties of undiscovered elements from patterns', 'He discovered every element in the last column', 'He proved all atoms have one isotope', 'He created the first electron cloud'], answer: 'He predicted properties of undiscovered elements from patterns', explanation: 'Mendeleev used atomic-mass patterns to predict missing elements.' },
      { category: 'Compounds', question: 'What makes a substance a compound?', choices: ['Different elements bonded in a fixed ratio', 'One element with different isotopes', 'A mixture with changing amounts', 'A neutral atom with equal charges'], answer: 'Different elements bonded in a fixed ratio', explanation: 'A compound has a specific ratio of atoms that cannot change.' },
      { category: 'Compounds', question: 'Why is H₂O always the same compound?', choices: ['It always has two hydrogen atoms for one oxygen atom', 'It can use any number of hydrogen atoms', 'It contains only oxygen atoms', 'It has no ratio shown in its formula'], answer: 'It always has two hydrogen atoms for one oxygen atom', explanation: 'The subscripts show the fixed atom ratio in water.' },
      { category: 'Compounds', question: 'Which change would make H₂O no longer be water?', choices: ['Changing the ratio of hydrogen to oxygen atoms', 'Writing the formula in lowercase letters', 'Measuring the sample in a larger cup', 'Cooling the sample below room temperature'], answer: 'Changing the ratio of hydrogen to oxygen atoms', explanation: 'A different ratio creates a different substance.' },
      { category: 'Mixed Review', question: 'An atom has mass number 40 and atomic number 20. Which statement must be true?', choices: ['It has 20 protons and 20 neutrons', 'It has 40 protons and 20 electrons', 'It has 20 protons and 40 neutrons', 'It has 60 particles in the nucleus'], answer: 'It has 20 protons and 20 neutrons', explanation: 'Protons = 20 and neutrons = 40 − 20 = 20.' },
      { category: 'Mixed Review', question: 'An atom has 26 protons, 30 neutrons, and 26 electrons. Which isotope is it?', choices: ['Iron-56', 'Iron-26', 'Calcium-56', 'Chlorine-56'], answer: 'Iron-56', explanation: '26 protons identifies iron, and 26 + 30 gives mass number 56.' },
      { category: 'Mixed Review', question: 'Which detail identifies an atom as neutral?', choices: ['Its electron count equals its proton count', 'Its neutron count equals its electron count', 'Its mass number equals its electron count', 'Its isotope name has a hyphen'], answer: 'Its electron count equals its proton count', explanation: 'Equal positive and negative charges make the overall charge zero.' },
    ],
  },
];

// Unit 3 Practice It follows the numbered study guide rather than the older
// question bank above.
studyUnits.find((unit) => unit.id === 'unit-3')!.questions = unitThreePracticeQuestions;

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
  const [isotopeInputs, setIsotopeInputs] = useState<Record<string, string>>({});
  const [isotopeChecked, setIsotopeChecked] = useState(false);
  const [isotopeSetIndex, setIsotopeSetIndex] = useState(0);
  const [averageInputs, setAverageInputs] = useState<Record<string, string>>({});
  const [averageChecked, setAverageChecked] = useState(false);
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

  function isotopeInputKey(rowId: string, field: string) {
    return `${rowId}-${field}`;
  }

  function normalizeLabAnswer(value: string) {
    return value
      .toLowerCase()
      .replace(/⁰/g, '0').replace(/¹/g, '1').replace(/²/g, '2').replace(/³/g, '3').replace(/⁴/g, '4')
      .replace(/⁵/g, '5').replace(/⁶/g, '6').replace(/⁷/g, '7').replace(/⁸/g, '8').replace(/⁹/g, '9')
      .replace(/[^a-z0-9]/g, '');
  }

  function isLabAnswerCorrect(row: IsotopeLabRow, field: string) {
    const input = isotopeInputs[isotopeInputKey(row.id, field)] || '';
    const expected = row.answers[field];
    return normalizeLabAnswer(input) === normalizeLabAnswer(expected);
  }

  function isAverageAnswerCorrect(problem: AverageMassProblem) {
    const input = normalizeLabAnswer(averageInputs[problem.id] || '');
    if (problem.id === 'boron') return input.includes('1081') && input.includes('boron');
    const expected = normalizeLabAnswer(problem.answer.replace('amu', ''));
    return input === expected || input === `${expected}amu`;
  }

  function resetIsotopeLab() {
    setIsotopeInputs({});
    setIsotopeChecked(false);
    setAverageInputs({});
    setAverageChecked(false);
    setIsotopeSetIndex((index) => (index + 1) % isotopeLabSets.length);
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
            {activeUnit.id === 'unit-3' && <button className={mode === 'isotope' ? 'active' : ''} type="button" onClick={() => setMode('isotope')}>Isotope Notation Lab</button>}
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

        {mode === 'isotope' && activeUnit.id === 'unit-3' && (
          <section className="panel isotope-lab">
            <div className="quiz-top">
              <div>
                <p className="eyebrow dark">Unit 3 Lab</p>
                <h2>Isotope Notation Lab</h2>
                <p className="lab-copy">Fill in the missing information. Remember: atomic number = protons, mass number = protons + neutrons, and a neutral atom has equal protons and electrons.</p>
              </div>
              <button className="small-button" type="button" onClick={resetIsotopeLab}>Start Over</button>
            </div>
            <div className="isotope-table-wrap">
              <table className="isotope-table">
                <thead>
                  <tr><th>Isotope</th><th>Symbol</th><th>Mass #</th><th>Atomic #</th><th>Protons</th><th>Neutrons</th><th>Electrons</th></tr>
                </thead>
                <tbody>
                  {isotopeLabSets[isotopeSetIndex].map((row) => (
                    <tr key={row.id}>
                      {(['isotope', 'symbol', 'mass', 'atomic', 'protons', 'neutrons', 'electrons'] as const).map((field) => {
                        const answer = row.answers[field];
                        const given = row.given[field];
                        const key = isotopeInputKey(row.id, field);
                        if (given) {
                          return <td className="given-cell" key={field}>{given}</td>;
                        }
                        if (answer) {
                          return <td key={field} className={isotopeChecked ? (isLabAnswerCorrect(row, field) ? 'right-cell' : 'wrong-cell') : ''}>
                            <input aria-label={`${row.id} ${field}`} value={isotopeInputs[key] || ''} onChange={(event) => setIsotopeInputs({ ...isotopeInputs, [key]: event.target.value })} placeholder={field === 'isotope' ? 'name-number' : 'type'} />
                            {isotopeChecked && !isLabAnswerCorrect(row, field) && <small>{answer}</small>}
                          </td>;
                        }
                        return <td key={field} />;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="lab-actions">
              <button className="lab-check" type="button" onClick={() => setIsotopeChecked(true)}>Check Lab</button>
              {isotopeChecked && <p>Green is correct. Red cells show the correct answer underneath.</p>}
            </div>
            <section className="average-mass-section">
              <div className="section-heading compact-heading">
                <p>Average Atomic Mass</p>
                <h3>Questions 1–4</h3>
              </div>
              <p className="lab-copy">Use <strong>isotope mass × decimal abundance</strong> for each isotope, then add the results. Type the final answer only.</p>
              <div className="average-problem-grid">
                {averageMassProblems.map((problem) => (
                  <article className="average-problem" key={problem.id}>
                    <p>{problem.prompt}</p>
                    <label>
                      Your answer
                      <input
                        aria-label={`Average atomic mass ${problem.id}`}
                        value={averageInputs[problem.id] || ''}
                        onChange={(event) => setAverageInputs({ ...averageInputs, [problem.id]: event.target.value })}
                        placeholder={problem.id === 'boron' ? 'Example: 10.81 amu, boron' : 'Example: 12.01 amu'}
                      />
                    </label>
                    {averageChecked && (
                      <strong className={isAverageAnswerCorrect(problem) ? 'average-right' : 'average-wrong'}>
                        {isAverageAnswerCorrect(problem) ? 'Correct' : `Correct answer: ${problem.answer}`}
                      </strong>
                    )}
                  </article>
                ))}
              </div>
              <div className="lab-actions">
                <button className="lab-check" type="button" onClick={() => setAverageChecked(true)}>Check Average Mass Answers</button>
              </div>
            </section>
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
          font-family: Arial, Helvetica, sans-serif;
          font-weight: 700;
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
          font-family: Arial, Helvetica, sans-serif;
          font-size: 1.62rem;
          line-height: 1.45;
          font-weight: 700;
          letter-spacing: 0;
        }

        .choices {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .choice {
          width: 100%;
          min-height: 7rem;
          padding: 1rem;
          border: 2px solid rgba(39, 78, 72, 0.12);
          border-radius: 16px;
          background: #fffdf7;
          color: #17211b;
          cursor: pointer;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 1.12rem;
          font-weight: 700;
          line-height: 1.5;
          letter-spacing: 0;
          text-align: left;
          display: flex;
          align-items: center;
        }

        @media (max-width: 640px) {
          .choices { grid-template-columns: 1fr; }
          .choice { min-height: 6.25rem; }
        }

        .choice.correct { border-color: #2d8b57; background: rgba(45, 139, 87, 0.12); }
        .choice.wrong { border-color: #c84b41; background: rgba(200, 75, 65, 0.12); }

        .lab-copy {
          max-width: 48rem;
          margin: 0.7rem 0 0;
          color: #405047;
          font-weight: 700;
          line-height: 1.5;
        }

        .isotope-table-wrap { overflow-x: auto; margin-top: 1.25rem; }
        .isotope-table { width: 100%; min-width: 760px; border-collapse: collapse; background: #fffdf7; }
        .isotope-table th, .isotope-table td { border: 1px solid rgba(39, 78, 72, 0.2); padding: 0.55rem; text-align: center; }
        .isotope-table th { background: #10524a; color: #fff9e9; font-size: 0.82rem; }
        .isotope-table input { width: 100%; min-width: 4.6rem; border: 1px solid rgba(39, 78, 72, 0.25); border-radius: 8px; padding: 0.5rem; color: #17211b; font: inherit; font-weight: 800; text-align: center; }
        .isotope-table small { display: block; margin-top: 0.35rem; color: #a93d34; font-weight: 900; }
        .isotope-table .given-cell { background: rgba(240, 138, 53, 0.13); color: #8f421e; font-weight: 900; }
        .isotope-table .right-cell { background: rgba(45, 139, 87, 0.14); }
        .isotope-table .wrong-cell { background: rgba(200, 75, 65, 0.12); }
        .lab-actions { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; margin-top: 1rem; }
        .lab-actions p { margin: 0; color: #405047; font-weight: 800; }
        .lab-check { border: 0; border-radius: 999px; padding: 0.8rem 1.15rem; background: linear-gradient(135deg, #10524a, #0a3934); color: #fff9e9; cursor: pointer; font-weight: 900; }
        .average-mass-section { margin-top: 2rem; padding-top: 1.6rem; border-top: 2px solid rgba(39, 78, 72, 0.14); }
        .compact-heading { margin-bottom: 0.3rem; }
        .compact-heading h3 { margin: 0; color: #17211b; font-size: clamp(1.35rem, 3vw, 1.8rem); }
        .average-problem-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin-top: 1.2rem; }
        .average-problem { padding: 1rem; border: 1px solid rgba(39, 78, 72, 0.16); border-radius: 16px; background: #fffdf7; }
        .average-problem p { margin: 0; color: #17211b; font-family: Arial, Helvetica, sans-serif; font-size: 1rem; font-weight: 700; line-height: 1.55; }
        .average-problem label { display: grid; gap: 0.4rem; margin-top: 0.9rem; color: #405047; font-family: Arial, Helvetica, sans-serif; font-size: 0.88rem; font-weight: 800; }
        .average-problem input { border: 1px solid rgba(39, 78, 72, 0.3); border-radius: 10px; padding: 0.65rem; color: #17211b; font: 700 1rem Arial, Helvetica, sans-serif; }
        .average-problem strong { display: block; margin-top: 0.7rem; font-family: Arial, Helvetica, sans-serif; }
        .average-right { color: #167444; }
        .average-wrong { color: #a93d34; }

        @media (max-width: 640px) {
          .average-problem-grid { grid-template-columns: 1fr; }
        }

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
