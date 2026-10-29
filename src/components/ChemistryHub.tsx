import { useEffect, useRef, useState } from "react";

type Question = {
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
};
type GameStat = { correct: number; attempts: number };

const unit5Questions: Question[] = [
  {
    question: "What do all electromagnetic waves have in common?",
    choices: [
      "They travel at the speed of light in a vacuum",
      "They have the same wavelength",
      "They have the same frequency",
      "They need matter to travel",
    ],
    answer: "They travel at the speed of light in a vacuum",
    explanation:
      "All electromagnetic waves travel at the speed of light in a vacuum.",
  },
  {
    question:
      "What equation connects the speed of light, frequency, and wavelength?",
    choices: ["c = λν", "E = mc²", "PV = nRT", "m = dV"],
    answer: "c = λν",
    explanation:
      "c is the speed of light, λ is wavelength, and ν is frequency.",
  },
  {
    question: "A frequency of 6.9 × 10¹⁷ s⁻¹ has a wavelength closest to…",
    choices: [
      "4.35 × 10⁻¹⁰ m",
      "4.35 × 10¹⁰ m",
      "2.07 × 10⁻²⁶ m",
      "6.9 × 10¹⁷ m",
    ],
    answer: "4.35 × 10⁻¹⁰ m",
    explanation: "λ = c ÷ ν = 3.00 × 10⁸ ÷ 6.9 × 10¹⁷.",
  },
  {
    question:
      "Which kind of radiation has a very short wavelength and high frequency?",
    choices: ["X-rays", "Radio waves", "Microwaves", "Infrared waves"],
    answer: "X-rays",
    explanation:
      "X-rays have much shorter wavelengths and higher frequencies than radio, microwave, or infrared waves.",
  },
  {
    question: "What is a photon?",
    choices: [
      "A quantum of electromagnetic energy",
      "A negatively charged atom",
      "An orbital in the p sublevel",
      "A measurement of wavelength",
    ],
    answer: "A quantum of electromagnetic energy",
    explanation:
      "A photon is one packet, or quantum, of electromagnetic energy.",
  },
  {
    question: "Which formula finds the energy of one photon?",
    choices: ["E = hν", "c = λν", "2n²", "E = mc²"],
    answer: "E = hν",
    explanation: "Photon energy equals Planck’s constant times frequency.",
  },
  {
    question: "If frequency increases, what happens to wavelength?",
    choices: [
      "It decreases",
      "It increases",
      "It stays the same",
      "It becomes zero",
    ],
    answer: "It decreases",
    explanation: "Frequency and wavelength are inversely related.",
  },
  {
    question: "Which type of radiation has the longest wavelength?",
    choices: ["Radio waves", "Visible light", "X-rays", "Gamma rays"],
    answer: "Radio waves",
    explanation:
      "Radio waves are at the long-wavelength end of the electromagnetic spectrum.",
  },
  {
    question: "Which type of radiation has the greatest energy?",
    choices: ["Gamma rays", "Radio waves", "Microwaves", "Infrared waves"],
    answer: "Gamma rays",
    explanation: "Gamma rays have the greatest frequency and energy.",
  },
  {
    question: "What is an orbital?",
    choices: [
      "A region where an electron is likely to be found",
      "The path an electron travels in a circle",
      "A positively charged particle",
      "A type of ion",
    ],
    answer: "A region where an electron is likely to be found",
    explanation: "Orbitals show probable locations, not a fixed circular path.",
  },
  {
    question: "How many electrons can one s orbital hold?",
    choices: ["2", "1", "6", "10"],
    answer: "2",
    explanation: "One orbital holds at most two electrons.",
  },
  {
    question: "How many orbitals are in a p sublevel?",
    choices: ["3", "1", "5", "7"],
    answer: "3",
    explanation: "The p sublevel has three orbitals.",
  },
  {
    question: "How many electrons can a full p sublevel hold?",
    choices: ["6", "2", "3", "10"],
    answer: "6",
    explanation: "Three p orbitals × two electrons each = six electrons.",
  },
  {
    question: "What does the formula 2n² tell you?",
    choices: [
      "The maximum electrons in an energy level",
      "The number of neutrons in an atom",
      "The wavelength of light",
      "The atomic radius",
    ],
    answer: "The maximum electrons in an energy level",
    explanation:
      "Use 2n² to find the maximum electrons in a principal energy level.",
  },
  {
    question: "How many electrons can the second energy level hold?",
    choices: ["8", "2", "18", "32"],
    answer: "8",
    explanation: "2(2²) = 8 electrons.",
  },
  {
    question: "What is the first ionization energy?",
    choices: [
      "Energy required to remove an electron from an atom",
      "Energy released when an electron is added",
      "Energy needed to fill a p orbital",
      "Energy of a neutron",
    ],
    answer: "Energy required to remove an electron from an atom",
    explanation:
      "Ionization energy measures how hard it is to remove an electron.",
  },
  {
    question: "What is electron affinity?",
    choices: [
      "The energy change when an atom gains an electron",
      "Energy needed to remove an electron",
      "The size of an atom",
      "The number of valence electrons",
    ],
    answer: "The energy change when an atom gains an electron",
    explanation: "Electron affinity is connected to adding an electron.",
  },
  {
    question:
      "How does atomic radius change across a period from left to right?",
    choices: [
      "It decreases",
      "It increases",
      "It stays identical",
      "It becomes negative",
    ],
    answer: "It decreases",
    explanation:
      "More protons pull the electrons closer as you move across a period.",
  },
  {
    question: "How does atomic radius change down a group?",
    choices: [
      "It increases",
      "It decreases",
      "It stays identical",
      "It becomes zero",
    ],
    answer: "It increases",
    explanation: "More energy levels are added down a group.",
  },
  {
    question: "A positive ion is called a…",
    choices: ["Cation", "Anion", "Photon", "Isotope"],
    answer: "Cation",
    explanation: "A cation has a positive charge because it lost electrons.",
  },
  {
    question: "A negative ion is called an…",
    choices: ["Anion", "Cation", "Orbital", "Nucleus"],
    answer: "Anion",
    explanation: "An anion has a negative charge because it gained electrons.",
  },
  {
    question:
      "Which electrons are usually gained or lost when a compound forms?",
    choices: ["Valence electrons", "Core electrons", "Neutrons", "Protons"],
    answer: "Valence electrons",
    explanation:
      "Valence electrons are the outer electrons involved in bonding.",
  },
  {
    question: "What is an atom in its ground state?",
    choices: [
      "Its lowest-energy, most stable state",
      "An atom with no electrons",
      "An atom that absorbed energy",
      "A positive ion",
    ],
    answer: "Its lowest-energy, most stable state",
    explanation: "Ground state is the lowest possible energy arrangement.",
  },
  {
    question:
      "When an electron moves from ground state to excited state, energy is…",
    choices: ["Absorbed", "Released", "Destroyed", "Turned into neutrons"],
    answer: "Absorbed",
    explanation: "An electron must absorb energy to move higher.",
  },
  {
    question:
      "When an electron falls from an excited state to ground state, energy is…",
    choices: ["Released", "Absorbed", "Destroyed", "Changed into protons"],
    answer: "Released",
    explanation: "Moving down to a lower level releases energy as light.",
  },
  {
    question: "How is a line spectrum produced?",
    choices: [
      "Electrons release light while moving from excited to lower levels",
      "Protons move between orbitals",
      "Atoms gain neutrons",
      "Wavelength becomes constant",
    ],
    answer: "Electrons release light while moving from excited to lower levels",
    explanation: "Each energy jump releases a specific amount of light energy.",
  },
  {
    question: "Which electron configuration is nitrogen?",
    choices: ["1s² 2s² 2p³", "1s² 2s² 2p⁶", "1s² 2s¹", "1s² 2s² 2p⁵"],
    answer: "1s² 2s² 2p³",
    explanation: "Nitrogen has 7 electrons: 2 + 2 + 3.",
  },
  {
    question: "How many valence electrons does nitrogen have?",
    choices: ["5", "3", "7", "2"],
    answer: "5",
    explanation: "Nitrogen’s outer level has 2s² 2p³: five valence electrons.",
  },
  {
    question: "What ion does nitrogen most commonly form?",
    choices: ["N³⁻", "N³⁺", "N⁻", "N²⁺"],
    answer: "N³⁻",
    explanation: "Nitrogen gains three electrons to reach a full outer level.",
  },
  {
    question: "How many electrons does nitrogen gain to become stable?",
    choices: ["3", "1", "2", "5"],
    answer: "3",
    explanation:
      "Nitrogen has five valence electrons and needs three more for an octet.",
  },
  {
    question: "What is the electron configuration for N³⁻?",
    choices: ["1s² 2s² 2p⁶", "1s² 2s² 2p³", "1s² 2s² 2p⁵", "1s² 2s¹"],
    answer: "1s² 2s² 2p⁶",
    explanation: "N³⁻ has 10 electrons, the same configuration as neon.",
  },
  {
    question: "Which is nitrogen’s noble-gas configuration?",
    choices: ["[He] 2s² 2p³", "[Ne] 3s²", "[He] 2s² 2p⁶", "[Ar] 4s²"],
    answer: "[He] 2s² 2p³",
    explanation:
      "Start from helium, then add nitrogen’s remaining five electrons.",
  },
  {
    question: "What does a Lewis dot diagram show?",
    choices: [
      "Valence electrons",
      "All neutrons",
      "Electron wavelengths",
      "Atomic radius",
    ],
    answer: "Valence electrons",
    explanation: "Lewis dots show the outer electrons used in bonding.",
  },
  {
    question: "Which statement correctly compares wavelength and frequency?",
    choices: [
      "Wavelength measures distance; frequency measures cycles per second",
      "Both measure time",
      "Both measure distance",
      "Frequency measures mass",
    ],
    answer:
      "Wavelength measures distance; frequency measures cycles per second",
    explanation: "Wavelength is a length; frequency counts waves each second.",
  },
];

const exactUnit5Questions: Question[] = [
  {
    question: "What do all electromagnetic energy waves have in common?",
    choices: [
      "They all travel at the speed of light in a vacuum",
      "They all have the same wavelength in a vacuum",
      "They all have the same frequency in a vacuum",
      "They need matter in order to travel",
    ],
    answer: "They all travel at the speed of light in a vacuum",
    explanation:
      "All electromagnetic waves travel through a vacuum at the speed of light.",
  },
  {
    question: "What is the speed of light?",
    choices: [
      "3.00 × 10⁸ m/s",
      "3.00 × 10⁶ m/s",
      "3.00 × 10¹⁰ m/s",
      "3.00 × 10⁸ km/s",
    ],
    answer: "3.00 × 10⁸ m/s",
    explanation: "c = 3.00 × 10⁸ m/s.",
  },
  {
    question:
      "What is the formula relating speed of light, frequency, and wavelength?",
    choices: ["c = λν", "E = hν", "E = mc²", "2n²"],
    answer: "c = λν",
    explanation: "c is speed of light, λ is wavelength, and ν is frequency.",
  },
  {
    question: "What is an orbital?",
    choices: [
      "A three-dimensional space where an electron might be found",
      "A three-dimensional path an electron always follows",
      "A central region containing all the protons",
      "A positively charged atom after electron loss",
    ],
    answer: "A three-dimensional space where an electron might be found",
    explanation: "Orbitals show likely electron locations.",
  },
  {
    question: "What is a photon?",
    choices: [
      "A quantum of electromagnetic energy",
      "A negatively charged atom",
      "A proton in the nucleus",
      "A measurement of wavelength",
    ],
    answer: "A quantum of electromagnetic energy",
    explanation: "A photon is a packet of electromagnetic energy.",
  },
  {
    question: "What is the difference between wavelength and frequency?",
    choices: [
      "Wavelength measures distance; frequency measures waves passing a point each second",
      "Wavelength measures time; frequency measures distance per second",
      "They both measure the number of waves each second",
      "Frequency measures the mass carried by each wave",
    ],
    answer:
      "Wavelength measures distance; frequency measures waves passing a point each second",
    explanation: "Wavelength is distance. Frequency is waves per second.",
  },
  {
    question: "What is the formula for the energy of a photon?",
    choices: ["E = hν", "c = λν", "E = mc²", "2n²"],
    answer: "E = hν",
    explanation: "E is energy, h is Planck’s constant, and ν is frequency.",
  },
  {
    question: "How is a line spectrum produced?",
    choices: [
      "Energy is released as an electron moves from an excited state to the ground state",
      "Energy is absorbed as an electron moves to a higher state",
      "Neutrons are gained as atoms form an ion",
      "A proton changes position inside the nucleus",
    ],
    answer:
      "Energy is released as an electron moves from an excited state to the ground state",
    explanation: "Each electron drop gives off a specific amount of light.",
  },
  {
    question: "What is electronegativity?",
    choices: [
      "The ability of an atom to attract an electron",
      "The energy required to remove an electron from an atom",
      "The size of an atom measured from nucleus outward",
      "The number of neutrons found inside an atom",
    ],
    answer: "The ability of an atom to attract an electron",
    explanation: "Electronegativity is an atom’s pull on electrons.",
  },
  {
    question: "What is first ionization energy?",
    choices: [
      "The amount of energy required to remove an electron from an atom",
      "The amount of energy released when an electron is added",
      "The amount of energy needed to fill a p orbital",
      "The amount of energy stored in one neutron",
    ],
    answer: "The amount of energy required to remove an electron from an atom",
    explanation: "Ionization energy means removing an electron.",
  },
  {
    question: "How many electrons can fill the s and p orbitals?",
    choices: [
      "s: 2; p: 6; combined: 8",
      "s: 1; p: 3; combined: 4",
      "s: 2; p: 3; combined: 5",
      "s: 6; p: 2; combined: 8",
    ],
    answer: "s: 2; p: 6; combined: 8",
    explanation: "The s sublevel holds 2 and the p sublevel holds 6.",
  },
  {
    question: "How many electrons can each energy level hold?",
    choices: ["2n²", "n²", "2n", "n + 2"],
    answer: "2n²",
    explanation: "n is the energy-level number.",
  },
  {
    question: "How many electrons are in the s and p orbitals of a noble gas?",
    choices: [
      "s has 2 and p has 6, for 8 total",
      "s has 1 and p has 3, for 4 total",
      "s has 2 and p has 3, for 5 total",
      "s has 6 and p has 2, for 8 total",
    ],
    answer: "s has 2 and p has 6, for 8 total",
    explanation: "A full s and p outer level has 8 electrons.",
  },
  {
    question:
      "What is the difference between the ground state and excited state?",
    choices: [
      "Ground state is lowest and stable; excited state has absorbed energy and moved higher",
      "Ground state is highest and unstable; excited state is lowest",
      "Ground state has no electrons; excited state has extra protons",
      "They both describe the same electron energy level",
    ],
    answer:
      "Ground state is lowest and stable; excited state has absorbed energy and moved higher",
    explanation: "Electrons absorb energy to enter an excited state.",
  },
  {
    question: "What happens when an electron changes states?",
    choices: [
      "It absorbs energy going up and releases energy coming down",
      "It releases energy going up and absorbs energy coming down",
      "It changes into a proton as it moves to another level",
      "Nothing changes in the atom’s energy at all",
    ],
    answer: "It absorbs energy going up and releases energy coming down",
    explanation:
      "Ground → excited absorbs energy. Excited → ground releases energy.",
  },
  {
    question: "What is an atom’s radius?",
    choices: [
      "Half the distance between nuclei of two identical bonded atoms",
      "The distance around an electron",
      "The number of energy levels in an atom",
      "The distance between protons and neutrons",
    ],
    answer: "Half the distance between nuclei of two identical bonded atoms",
    explanation: "Atomic radius uses two identical bonded atoms.",
  },
  {
    question: "How does atomic radius change across a period and down a group?",
    choices: [
      "It decreases left to right and increases top to bottom",
      "It increases left to right and decreases top to bottom",
      "It increases in both directions",
      "It decreases in both directions",
    ],
    answer: "It decreases left to right and increases top to bottom",
    explanation:
      "Across a period nuclear pull increases; down a group more levels are added.",
  },
  {
    question: "What are the two types of ions?",
    choices: [
      "Cation (+) and anion (−)",
      "Cation (−) and anion (+)",
      "Photon and orbital",
      "Proton and neutron",
    ],
    answer: "Cation (+) and anion (−)",
    explanation: "Cations are positive; anions are negative.",
  },
  {
    question: "Which electrons can be lost or gained when a compound forms?",
    choices: ["Valence electrons", "Core electrons", "Neutrons", "Protons"],
    answer: "Valence electrons",
    explanation: "Valence electrons are the outer electrons used in bonding.",
  },
  {
    question: "What are valence electrons?",
    choices: [
      "Outermost energy-level electrons that can be lost, gained, or shared when bonds form",
      "Innermost energy-level electrons that remain inside the atom",
      "Electrons that cannot ever be gained, lost, or shared",
      "The number of protons found in an atom’s nucleus",
    ],
    answer:
      "Outermost energy-level electrons that can be lost, gained, or shared when bonds form",
    explanation: "Valence electrons are involved in bonds.",
  },
  {
    question:
      "Find the wavelength of light with a frequency of 6.90 × 10¹⁷ s⁻¹.",
    choices: [
      "4.35 × 10⁻¹⁰ m",
      "4.35 × 10¹⁰ m",
      "2.07 × 10⁻²⁶ m",
      "6.90 × 10¹⁷ m",
    ],
    answer: "4.35 × 10⁻¹⁰ m",
    explanation: "λ = c ÷ ν.",
  },
  {
    question:
      "Find the energy of a photon with a frequency of 3.12 × 10¹⁶ s⁻¹.",
    choices: [
      "2.07 × 10⁻¹⁷ J",
      "9.36 × 10²⁴ J",
      "4.81 × 10⁻³⁵ J",
      "1.04 × 10⁻⁸ J",
    ],
    answer: "2.07 × 10⁻¹⁷ J",
    explanation: "E = hν.",
  },
  {
    question:
      "Find the frequency of light with a wavelength of 1.78 × 10⁻¹⁵ m.",
    choices: [
      "1.69 × 10²³ s⁻¹",
      "5.34 × 10⁻⁷ s⁻¹",
      "2.68 × 10⁸ s⁻¹",
      "1.78 × 10⁻¹⁵ s⁻¹",
    ],
    answer: "1.69 × 10²³ s⁻¹",
    explanation: "ν = c ÷ λ.",
  },
  {
    question:
      "Find the frequency of a wave with a wavelength of 7.05 × 10¹⁶ m.",
    choices: [
      "4.26 × 10⁻⁹ s⁻¹",
      "4.26 × 10²⁴ s⁻¹",
      "2.12 × 10⁸ s⁻¹",
      "7.05 × 10¹⁶ s⁻¹",
    ],
    answer: "4.26 × 10⁻⁹ s⁻¹",
    explanation: "ν = c ÷ λ.",
  },
  {
    question:
      "Find the energy of a photon with a wavelength of 7.65 × 10⁻¹⁸ m.",
    choices: [
      "2.60 × 10⁻⁸ J",
      "3.92 × 10²⁵ J",
      "7.65 × 10⁻¹⁸ J",
      "2.60 × 10⁻²⁶ J",
    ],
    answer: "2.60 × 10⁻⁸ J",
    explanation: "Find frequency first, then use E = hν.",
  },
  {
    question: "Find the frequency of light with a wavelength of 4.00 × 10⁻⁷ m.",
    choices: [
      "7.50 × 10¹⁴ s⁻¹",
      "1.20 × 10² s⁻¹",
      "7.50 × 10⁻¹⁴ s⁻¹",
      "4.00 × 10¹⁵ s⁻¹",
    ],
    answer: "7.50 × 10¹⁴ s⁻¹",
    explanation: "ν = c ÷ λ.",
  },
  {
    question:
      "Find the energy of a photon with a frequency of 5.00 × 10¹⁴ s⁻¹.",
    choices: [
      "3.32 × 10⁻¹⁹ J",
      "1.50 × 10²³ J",
      "6.63 × 10⁻³⁴ J",
      "1.66 × 10⁻²⁶ J",
    ],
    answer: "3.32 × 10⁻¹⁹ J",
    explanation: "E = hν.",
  },
  {
    question:
      "Find the wavelength of light with a frequency of 3.00 × 10⁸ s⁻¹.",
    choices: ["1.00 m", "1.00 × 10⁻¹⁶ m", "9.00 × 10¹⁶ m", "3.00 × 10⁸ m"],
    answer: "1.00 m",
    explanation: "λ = c ÷ ν.",
  },
  {
    question:
      "Find the energy of a photon with a frequency of 9.00 × 10¹⁶ s⁻¹.",
    choices: [
      "5.97 × 10⁻¹⁷ J",
      "1.36 × 10⁻²⁵ J",
      "2.70 × 10²⁵ J",
      "9.00 × 10¹⁶ J",
    ],
    answer: "5.97 × 10⁻¹⁷ J",
    explanation: "E = hν.",
  },
  {
    question: "Find the frequency of light with a wavelength of 2.00 × 10⁻⁶ m.",
    choices: [
      "1.50 × 10¹⁴ s⁻¹",
      "6.00 × 10² m",
      "1.50 × 10⁻¹⁴ s⁻¹",
      "2.00 × 10⁻⁶ s⁻¹",
    ],
    answer: "1.50 × 10¹⁴ s⁻¹",
    explanation: "ν = c ÷ λ.",
  },
];

type Unit6StudyItem = {
  prompt: string;
  answer: string;
  explanation: string;
  topic: string;
};

const unit6Items: Unit6StudyItem[] = [
  { prompt: "Write the formula for sulfur tetroxide.", answer: "SO₄", explanation: "No prefix on sulfur means 1 sulfur; tetra- means 4 oxygens.", topic: "Molecular Formulas" },
  { prompt: "Write the formula for phosphorus trifluoride.", answer: "PF₃", explanation: "Tri- means 3 fluorines.", topic: "Molecular Formulas" },
  { prompt: "Write the formula for iodine monobromide.", answer: "IBr", explanation: "Mono- means 1 bromine.", topic: "Molecular Formulas" },
  { prompt: "Write the formula for silicon tetrahydride.", answer: "SiH₄", explanation: "Tetra- means 4 hydrogens.", topic: "Molecular Formulas" },
  { prompt: "Write the formula for selenium dioxide.", answer: "SeO₂", explanation: "Di- means 2 oxygens.", topic: "Molecular Formulas" },
  { prompt: "Write the formula for oxygen dichloride.", answer: "OCl₂", explanation: "Di- means 2 chlorines.", topic: "Molecular Formulas" },
  { prompt: "Write the formula for bromine pentachloride.", answer: "BrCl₅", explanation: "Penta- means 5 chlorines.", topic: "Molecular Formulas" },
  { prompt: "Write the formula for oxygen difluoride.", answer: "OF₂", explanation: "Di- means 2 fluorines.", topic: "Molecular Formulas" },
  { prompt: "Write the formula for phosphorus pentachloride.", answer: "PCl₅", explanation: "Penta- means 5 chlorines.", topic: "Molecular Formulas" },
  { prompt: "Write the formula for nitrogen monoxide.", answer: "NO", explanation: "Mono- means 1 oxygen.", topic: "Molecular Formulas" },
  { prompt: "Write the formula for dinitrogen tetroxide.", answer: "N₂O₄", explanation: "Di- means 2 nitrogens; tetra- means 4 oxygens.", topic: "Molecular Formulas" },
  { prompt: "Write the formula for diphosphorus pentoxide.", answer: "P₂O₅", explanation: "Di- means 2 phosphorus atoms; penta- means 5 oxygens.", topic: "Molecular Formulas" },
  { prompt: "Write the formula for disulfur difluoride.", answer: "S₂F₂", explanation: "Di- means 2 of each element.", topic: "Molecular Formulas" },
  { prompt: "Write the formula for tetraphosphorus trisulfide.", answer: "P₄S₃", explanation: "Tetra- means 4 phosphorus atoms; tri- means 3 sulfurs.", topic: "Molecular Formulas" },
  { prompt: "Write the formula for dinitrogen tetrachloride.", answer: "N₂Cl₄", explanation: "Di- means 2 nitrogens; tetra- means 4 chlorines.", topic: "Molecular Formulas" },
  { prompt: "Name the covalent compound CO₂.", answer: "carbon dioxide", explanation: "One carbon does not use mono-. Two oxygens is dioxide.", topic: "Molecular Names" },
  { prompt: "Name the covalent compound SO₃.", answer: "sulfur trioxide", explanation: "Three oxygens is trioxide.", topic: "Molecular Names" },
  { prompt: "Name the covalent compound N₂O₃.", answer: "dinitrogen trioxide", explanation: "Di- is 2 nitrogen atoms; tri- is 3 oxygens.", topic: "Molecular Names" },
  { prompt: "Name the covalent compound N₂O₅.", answer: "dinitrogen pentoxide", explanation: "Di- is 2 nitrogen atoms; penta- plus oxide becomes pentoxide.", topic: "Molecular Names" },
  { prompt: "Name the covalent compound PCl₃.", answer: "phosphorus trichloride", explanation: "Three chlorines is trichloride.", topic: "Molecular Names" },
  { prompt: "Name the covalent compound NH₃.", answer: "nitrogen trihydride", explanation: "Three hydrogens is trihydride.", topic: "Molecular Names" },
  { prompt: "Name the covalent compound SCl₆.", answer: "sulfur hexachloride", explanation: "Six chlorines is hexachloride.", topic: "Molecular Names" },
  { prompt: "Name the covalent compound P₂O₅.", answer: "diphosphorus pentoxide", explanation: "Di- is 2 phosphorus atoms; penta- plus oxide becomes pentoxide.", topic: "Molecular Names" },
  { prompt: "Name the covalent compound CCl₄.", answer: "carbon tetrachloride", explanation: "Four chlorines is tetrachloride.", topic: "Molecular Names" },
  { prompt: "Name the covalent compound SiO₂.", answer: "silicon dioxide", explanation: "Two oxygens is dioxide.", topic: "Molecular Names" },
  { prompt: "Name the covalent compound CS₂.", answer: "carbon disulfide", explanation: "Two sulfurs is disulfide.", topic: "Molecular Names" },
  { prompt: "Name the covalent compound PBr₃.", answer: "phosphorus tribromide", explanation: "Three bromines is tribromide.", topic: "Molecular Names" },
  { prompt: "Name the covalent compound P₄O₁₀.", answer: "tetraphosphorus decoxide", explanation: "Tetra- is 4 phosphorus atoms; deca- plus oxide becomes decoxide.", topic: "Molecular Names" },
  { prompt: "Name the covalent compound As₂O₃.", answer: "diarsenic trioxide", explanation: "Di- is 2 arsenic atoms; tri- is 3 oxygens.", topic: "Molecular Names" },
  { prompt: "Name the covalent compound Cl₂O₇.", answer: "dichlorine heptoxide", explanation: "Di- is 2 chlorines; hepta- plus oxide becomes heptoxide.", topic: "Molecular Names" },
  { prompt: "Name the acid HNO₃.", answer: "nitric acid", explanation: "Nitrate (ending -ate) becomes nitric acid.", topic: "Acid Names" },
  { prompt: "Name the acid HCl.", answer: "hydrochloric acid", explanation: "A binary acid uses hydro- plus the root chlor- plus -ic acid.", topic: "Acid Names" },
  { prompt: "Name the acid HC₂H₃O₂.", answer: "acetic acid", explanation: "HC₂H₃O₂ is acetic acid.", topic: "Acid Names" },
  { prompt: "Name the acid HBr.", answer: "hydrobromic acid", explanation: "A binary acid uses hydro- plus the root brom- plus -ic acid.", topic: "Acid Names" },
  { prompt: "Name the acid HNO₂.", answer: "nitrous acid", explanation: "Nitrite (ending -ite) becomes nitrous acid.", topic: "Acid Names" },
  { prompt: "Write the formula for sulfuric acid.", answer: "H₂SO₄", explanation: "Sulfuric acid has the formula H₂SO₄.", topic: "Acid Formulas" },
  { prompt: "Write the formula for hydrofluoric acid.", answer: "HF", explanation: "Hydrofluoric acid has the formula HF.", topic: "Acid Formulas" },
  { prompt: "Write the formula for phosphorous acid.", answer: "H₃PO₃", explanation: "Phosphorous acid has the formula H₃PO₃.", topic: "Acid Formulas" },
  { prompt: "Write the formula for carbonic acid.", answer: "H₂CO₃", explanation: "Carbonic acid has the formula H₂CO₃.", topic: "Acid Formulas" },
  { prompt: "Write the formula for hydrosulfuric acid.", answer: "H₂S", explanation: "Hydrosulfuric acid has the formula H₂S.", topic: "Acid Formulas" },
];

const games = [
  ["Flashcards", "Flip to reveal"],
  ["Quiz", "Multiple choice"],
  ["Orbital Lab", "Build electron arrows"],
  ["Match", "Pair Q&A"],
  ["Millionaire", "Rising stakes"],
  ["Jeopardy", "Pick points"],
  ["Bomb", "Defuse or boom!"],
  ["Snake", "Eat & grow"],
  ["My Stats", "See progress"],
];

const jeopardyBoard = [
  { title: "EM WAVES", indexes: [0, 1, 2, 3, 4] },
  { title: "LIGHT ENERGY", indexes: [5, 6, 7, 8, 24] },
  { title: "ORBITALS", indexes: [9, 10, 11, 12, 13] },
  { title: "ATOMIC TRENDS", indexes: [14, 15, 16, 17, 18] },
  { title: "IONS & NITROGEN", indexes: [19, 20, 21, 22, 26] },
];

const unit6JeopardyBoard = [
  { title: "FORMULAS I", indexes: [0, 1, 2, 3, 4] },
  { title: "FORMULAS II", indexes: [5, 6, 7, 8, 9] },
  { title: "COMPOUND NAMES", indexes: [15, 16, 17, 18, 19] },
  { title: "ACID NAMES", indexes: [30, 31, 32, 33, 34] },
  { title: "ACID FORMULAS", indexes: [35, 36, 37, 38, 39] },
];

const millionaireLevels = [
  "$100",
  "$200",
  "$300",
  "$500",
  "$1,000",
  "$2,000",
  "$4,000",
  "$8,000",
  "$16,000",
  "$32,000",
  "$64,000",
  "$125,000",
  "$250,000",
  "$500,000",
  "$1,000,000",
];

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);
const shuffleChoices = (question: Question): Question => ({
  ...question,
  choices: shuffle(question.choices),
});
const buildMultipleChoiceQuestions = (items: Unit6StudyItem[]): Question[] =>
  items.map((item) => ({
    question: item.prompt,
    answer: item.answer,
    explanation: item.explanation,
    choices: [
      item.answer,
      ...items
        .filter(
          (candidate) =>
            candidate.topic === item.topic && candidate.answer !== item.answer,
        )
        .slice(0, 3)
        .map((candidate) => candidate.answer),
    ],
  }));
const unit6Questions = buildMultipleChoiceQuestions(unit6Items);
const makeBombSet = (questionSet: Question[]) =>
  shuffle(questionSet).slice(0, 10).map(shuffleChoices);
const makeGameSet = (questionSet: Question[]) =>
  shuffle(questionSet).map(shuffleChoices);
const chemistryTopics = [
  "Electromagnetic Energy & Light",
  "Electrons & Energy Levels",
  "Atomic Structure & Trends",
  "Ions & Valence Electrons",
  "Molecular Formulas",
  "Molecular Names",
  "Acid Names",
  "Acid Formulas",
];
const topicForQuestion = (question: Question) => {
  const unit6Item = unit6Items.find((item) => item.prompt === question.question);
  if (unit6Item) return unit6Item.topic;
  const index = exactUnit5Questions.findIndex(
    (item) => item.question === question.question,
  );
  if (index <= 7 || index >= 20) return "Electromagnetic Energy & Light";
  if (index <= 14) return "Electrons & Energy Levels";
  if (index <= 18) return "Atomic Structure & Trends";
  return "Ions & Valence Electrons";
};

function BombGame({
  question,
  questionIndex,
  choice,
  checked,
  onChoose,
  onCheck,
  onNext,
  onExpire,
}: {
  question: Question;
  questionIndex: number;
  choice: string | null;
  checked: boolean;
  onChoose: (answer: string) => void;
  onCheck: () => void;
  onNext: () => void;
  onExpire: (timedOut?: boolean) => void;
}) {
  const [seconds, setSeconds] = useState(30);
  useEffect(() => {
    if (checked) return;
    setSeconds(30);
    const timer = window.setInterval(
      () =>
        setSeconds((current) => {
          if (current <= 1) {
            window.clearInterval(timer);
            window.setTimeout(() => onExpire(true), 0);
            return 0;
          }
          return current - 1;
        }),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [questionIndex, checked]);
  return (
    <>
      <div style={styles.gameName}>BOMB</div>
      <div style={styles.bombTimer}>{seconds}s</div>
      <div style={styles.progress}>
        Question {questionIndex + 1} of 10 · Defuse it before time runs out
      </div>
      <h2 style={styles.question}>{question.question}</h2>
      <div style={styles.choices}>
        {question.choices.map((answer) => (
          <button
            key={answer}
            onClick={() => !checked && onChoose(answer)}
            style={{
              ...styles.choice,
              ...(choice === answer
                ? checked
                  ? answer === question.answer
                    ? styles.correct
                    : styles.incorrect
                  : styles.selected
                : {}),
            }}
          >
            {answer}
          </button>
        ))}
        {checked && choice && (
          <p style={styles.explanation}>
            {choice === question.answer ? (
              "Defused! "
            ) : (
              <>
                Not quite.{" "}
                <strong>Correct answer: {question.answer}.</strong>{" "}
              </>
            )}
            {question.explanation}
          </p>
        )}
        {!checked ? (
          <button
            disabled={!choice}
            style={{
              ...styles.closeButton,
              opacity: choice ? 1 : 0.45,
              cursor: choice ? "pointer" : "default",
            }}
            onClick={onCheck}
          >
            Check Answer
          </button>
        ) : (
          <button style={styles.closeButton} onClick={onNext}>
            Next question
          </button>
        )}
      </div>
    </>
  );
}

function MatchGame({ questions, onComplete }: { questions: Question[]; onComplete: (matches: number, attempts: number) => void }) {
  const [cards] = useState(() => shuffle(questions.slice(0, 10).flatMap((question, id) => [
    { id, side: "question", text: question.question },
    { id, side: "answer", text: question.answer },
  ])));
  const [selected, setSelected] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);

  const chooseCard = (index: number) => {
    if (selected.includes(index) || matched.includes(cards[index].id)) return;
    // Leave a wrong pair face-up so it can be read. A third tap turns both over
    // and starts the next try with that card.
    if (selected.length === 2) {
      setSelected([index]);
      return;
    }
    const nextSelected = [...selected, index];
    setSelected(nextSelected);
    if (nextSelected.length !== 2) return;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    const [first, second] = nextSelected.map(cardIndex => cards[cardIndex]);
    if (first.id === second.id && first.side !== second.side) {
      const nextMatches = [...matched, first.id];
      setMatched(nextMatches);
      setSelected([]);
      if (nextMatches.length === 10) onComplete(10, 10);
    }
  };

  return <>
    <div style={styles.gameName}>MATCH</div>
    <p style={styles.modalText}>Flip two cards to match each question with its answer.</p>
    <div style={styles.matchProgress}>{matched.length} of 10 matches · {attempts} tries</div>
    <div style={styles.matchGrid}>{cards.map((card, index) => {
      const isMatched = matched.includes(card.id);
      const isOpen = selected.includes(index) || isMatched;
      return <button key={`${card.id}-${card.side}`} onClick={() => chooseCard(index)} style={{...styles.matchCard,...(isOpen ? styles.matchCardOpen : {}),...(isMatched ? styles.matchCardMatched : {})}}>
        {isOpen ? <><small style={styles.matchSide}>{card.side === "question" ? "QUESTION" : "ANSWER"}</small><span>{card.text}</span></> : <strong style={styles.matchBack}>?</strong>}
      </button>;
    })}</div>
  </>;
}

type SnakePoint = { x: number; y: number };

function SnakeGame({ questions }: { questions: Question[] }) {
  const [body, setBody] = useState<SnakePoint[]>([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState<"up" | "down" | "left" | "right">("right");
  const directionRef = useRef<"up" | "down" | "left" | "right">("right");
  const [food, setFood] = useState<SnakePoint>({ x: 15, y: 10 });
  const [running, setRunning] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [questionOpen, setQuestionOpen] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [wrongAnswer, setWrongAnswer] = useState(false);
  const question = questions[questionIndex % questions.length];

  const changeDirection = (next: "up" | "down" | "left" | "right") => {
    const opposite = { up: "down", down: "up", left: "right", right: "left" } as const;
    if (opposite[next] === directionRef.current) return;
    directionRef.current = next;
    setDirection(next);
  };
  const newFood = (snake: SnakePoint[]) => {
    let next: SnakePoint;
    do {
      next = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
    } while (snake.some((part) => part.x === next.x && part.y === next.y));
    return next;
  };
  const restart = () => {
    const fresh = [{ x: 10, y: 10 }];
    setBody(fresh);
    directionRef.current = "right";
    setDirection("right");
    setFood({ x: 15, y: 10 });
    setRunning(true);
    setGameOver(false);
    setScore(0);
    setQuestionOpen(false);
    setQuestionIndex(0);
    setWrongAnswer(false);
  };

  useEffect(() => {
    if (!running || questionOpen) return;
    const timer = window.setTimeout(() => {
      setBody((current) => {
        const head = current[0];
        const next = { ...head };
        if (directionRef.current === "up") next.y -= 1;
        if (directionRef.current === "down") next.y += 1;
        if (directionRef.current === "left") next.x -= 1;
        if (directionRef.current === "right") next.x += 1;
        if (next.x < 0 || next.x >= 20 || next.y < 0 || next.y >= 20 || current.some((part) => part.x === next.x && part.y === next.y)) {
          setRunning(false);
          setGameOver(true);
          return current;
        }
        if (next.x === food.x && next.y === food.y) {
          setQuestionOpen(true);
          return [next, ...current];
        }
        return [next, ...current.slice(0, -1)];
      });
    }, 150);
    return () => window.clearTimeout(timer);
  }, [running, body, questionOpen, food]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const controls: Record<string, "up" | "down" | "left" | "right"> = {
        ArrowUp: "up", w: "up", ArrowDown: "down", s: "down", ArrowLeft: "left", a: "left", ArrowRight: "right", d: "right",
      };
      const next = controls[event.key];
      if (!next || questionOpen || gameOver) return;
      event.preventDefault();
      changeDirection(next);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [questionOpen, gameOver]);

  if (gameOver) {
    return (
      <>
        <div style={styles.gameName}>SNAKE</div>
        <h2 style={styles.modalTitle}>Game Over!</h2>
        <p style={styles.modalText}>Score: {score} · Length: {body.length}</p>
        <button style={styles.closeButton} onClick={restart}>Play Again</button>
      </>
    );
  }

  return (
    <>
      <div style={styles.gameName}>SNAKE</div>
      <div style={styles.snakeScore}><span>Length: <strong>{body.length}</strong></span><span>Score: <strong>{score}</strong></span></div>
      {questionOpen ? (
        <div style={styles.snakeQuestion}>
          <strong style={styles.snakeTag}>Answer to grow!</strong>
          <h2 style={styles.question}>{question.question}</h2>
          <div style={styles.choices}>
            {question.choices.map((answer) => (
              <button key={answer} style={styles.choice} onClick={() => {
                if (answer === question.answer) {
                  setScore((current) => current + 10);
                  setFood(newFood(body));
                  setQuestionIndex((current) => current + 1);
                  setQuestionOpen(false);
                } else {
                  setWrongAnswer(true);
                  setRunning(false);
                  setGameOver(true);
                }
              }}>{answer}</button>
            ))}
          </div>
          {wrongAnswer && <p style={styles.explanation}>Correct answer: {question.answer}</p>}
        </div>
      ) : (
        <>
          <div style={styles.snakeBoard}>
            {Array.from({ length: 400 }).map((_, index) => {
              const x = index % 20;
              const y = Math.floor(index / 20);
              const isHead = body[0]?.x === x && body[0]?.y === y;
              const isBody = body.slice(1).some((part) => part.x === x && part.y === y);
              const isFood = food.x === x && food.y === y;
              return <div key={index} style={{ ...styles.snakeCell, ...(isHead ? styles.snakeHead : isBody ? styles.snakeBody : isFood ? styles.snakeFood : {}) }} />;
            })}
          </div>
          <div style={styles.snakeControls}>
            <span /> <button onClick={() => changeDirection("up")}>↑</button> <span />
            <button onClick={() => changeDirection("left")}>←</button> <span style={styles.snakeDirection}>{direction[0].toUpperCase()}</span> <button onClick={() => changeDirection("right")}>→</button>
            <span /> <button onClick={() => changeDirection("down")}>↓</button> <span />
          </div>
          <p style={styles.snakeHint}>Use the arrow keys or buttons. Eat the red dot, then answer a question to grow.</p>
        </>
      )}
    </>
  );
}

function MillionaireGame({
  question,
  questionIndex,
  choice,
  checked,
  onChoose,
  onCheck,
  onNext,
}: {
  question: Question;
  questionIndex: number;
  choice: string | null;
  checked: boolean;
  onChoose: (answer: string) => void;
  onCheck: () => void;
  onNext: () => void;
}) {
  return (
    <div style={styles.millionaireLayout}>
      <aside style={styles.moneyLadder}>
        {[...millionaireLevels].reverse().map((amount, reverseIndex) => {
          const level = millionaireLevels.length - reverseIndex - 1;
          const isMilestone = level === 4 || level === 9;
          return (
            <div
              key={amount}
              style={{
                ...styles.moneyStep,
                ...(level === questionIndex ? styles.moneyStepActive : {}),
                ...(isMilestone && level !== questionIndex
                  ? styles.moneyMilestone
                  : {}),
              }}
            >
              <span>{level + 1}</span>
              <strong>{amount}</strong>
            </div>
          );
        })}
      </aside>
      <div style={styles.millionaireQuestion}>
        <div style={styles.gameName}>MILLIONAIRE</div>
        <div style={styles.progress}>Question {questionIndex + 1} of 15</div>
        <h2 style={styles.question}>{question.question}</h2>
        <div style={styles.choices}>
          {question.choices.map((answer) => (
            <button
              key={answer}
              onClick={() => !checked && onChoose(answer)}
              style={{
                ...styles.choice,
                ...(choice === answer
                  ? checked
                    ? answer === question.answer
                      ? styles.correct
                      : styles.incorrect
                    : styles.selected
                  : {}),
              }}
            >
              {answer}
            </button>
          ))}
          {checked && choice && (
            <p style={styles.explanation}>
              {choice === question.answer ? (
                "Correct! "
              ) : (
                <>
                  Not quite.{" "}
                  <strong>Correct answer: {question.answer}.</strong>{" "}
                </>
              )}
              {question.explanation}
            </p>
          )}
          {!checked ? (
            <button
              disabled={!choice}
              style={{
                ...styles.closeButton,
                opacity: choice ? 1 : 0.45,
                cursor: choice ? "pointer" : "default",
              }}
              onClick={onCheck}
            >
              Check Answer
            </button>
          ) : (
            <button style={styles.closeButton} onClick={onNext}>
              {questionIndex === millionaireLevels.length - 1
                ? "Play again"
                : "Next question"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

type OrbitalElement = {
  name: string;
  symbol: string;
  dots: number;
  dotPositions: string[];
  longhand: string;
  noble: string;
  initial: string[][];
  gain: number;
  ion: string;
  configuration: string;
};
const orbitalElements: OrbitalElement[] = [
  {
    name: "Nitrogen",
    symbol: "N",
    dots: 5,
    dotPositions: ["dotTopA", "dotTopB", "dotLeftA", "dotRightA", "dotBottomA"],
    longhand: "1s² 2s² 2p³",
    noble: "[He] 2s² 2p³",
    initial: [["↑"], ["↑"], ["↑"]],
    gain: 3,
    ion: "N³⁻",
    configuration: "1s² 2s² 2p⁶",
  },
  {
    name: "Oxygen",
    symbol: "O",
    dots: 6,
    dotPositions: [
      "dotTopA",
      "dotTopB",
      "dotLeftA",
      "dotRightA",
      "dotRightB",
      "dotBottomA",
    ],
    longhand: "1s² 2s² 2p⁴",
    noble: "[He] 2s² 2p⁴",
    initial: [["↑", "↓"], ["↑"], ["↑"]],
    gain: 2,
    ion: "O²⁻",
    configuration: "1s² 2s² 2p⁶",
  },
  {
    name: "Chlorine",
    symbol: "Cl",
    dots: 7,
    dotPositions: [
      "dotTopA",
      "dotTopB",
      "dotLeftA",
      "dotRightA",
      "dotRightB",
      "dotBottomA",
      "dotBottomB",
    ],
    longhand: "1s² 2s² 2p⁶ 3s² 3p⁵",
    noble: "[Ne] 3s² 3p⁵",
    initial: [["↑", "↓"], ["↑", "↓"], ["↑"]],
    gain: 1,
    ion: "Cl⁻",
    configuration: "1s² 2s² 2p⁶ 3s² 3p⁶",
  },
  {
    name: "Bromine",
    symbol: "Br",
    dots: 7,
    dotPositions: [
      "dotTopA",
      "dotTopB",
      "dotLeftA",
      "dotRightA",
      "dotRightB",
      "dotBottomA",
      "dotBottomB",
    ],
    longhand: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p⁵",
    noble: "[Ar] 4s² 3d¹⁰ 4p⁵",
    initial: [["↑", "↓"], ["↑", "↓"], ["↑"]],
    gain: 1,
    ion: "Br⁻",
    configuration: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p⁶",
  },
  {
    name: "Rubidium",
    symbol: "Rb",
    dots: 1,
    dotPositions: ["dotTopA"],
    longhand: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p⁶ 5s¹",
    noble: "[Kr] 5s¹",
    initial: [["↑"]],
    gain: 1,
    ion: "Rb⁺",
    configuration: "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p⁶",
  },
];

function LewisDot({ element }: { element: OrbitalElement }) {
  return (
    <div
      style={styles.lewisBox}
      aria-label={`${element.name} Lewis dot notation`}
    >
      <strong style={styles.lewisSymbol}>{element.symbol}</strong>
      {element.dotPositions.map((position, index) => (
        <i
          key={index}
          style={{ ...styles.lewisDot, ...(styles[position] || {}) }}
        >
          •
        </i>
      ))}
    </div>
  );
}

const orbitalOrder = [
  ["1s", 1],
  ["2s", 1],
  ["2p", 3],
  ["3s", 1],
  ["3p", 3],
  ["4s", 1],
  ["3d", 5],
  ["4p", 3],
  ["5s", 1],
] as const;
const atomicElectrons: Record<string, number> = { N: 7, O: 8, Cl: 17, Br: 35, Rb: 37 };
const normalizeElectronAnswer = (value: string) =>
  value
    .toLowerCase()
    .replace(
      /[¹²³⁴⁵⁶⁷⁸⁹⁰]/g,
      (digit) =>
        ({
          "¹": "1",
          "²": "2",
          "³": "3",
          "⁴": "4",
          "⁵": "5",
          "⁶": "6",
          "⁷": "7",
          "⁸": "8",
          "⁹": "9",
          "⁰": "0",
        })[digit] || digit,
    )
    .replace(/[\s^]/g, "");

function ExponentBubbles({
  labels,
  values,
  onChange,
  core,
  coreValue,
  onCoreChange,
}: {
  labels: string[];
  values: Record<string, string>;
  onChange: (label: string, value: string) => void;
  core?: string;
  coreValue?: string;
  onCoreChange?: (value: string) => void;
}) {
  return (
    <div style={styles.configBubbles}>
      {core && (
        <>
          <span>[</span>
          <input
            aria-label="Noble gas"
            maxLength={2}
            value={coreValue || ""}
            onChange={(event) =>
              onCoreChange?.(event.target.value.replace(/[^A-Za-z]/g, ""))
            }
            style={styles.coreInput}
          />
          <span>]</span>
        </>
      )}
      {labels.map((label) => {
        const [base = "", exponent = ""] = (values[label] || "|").split("|");
        return (
          <label key={label} style={styles.configPiece}>
            <input
              aria-label={`${label} orbital`}
              maxLength={2}
              value={base}
              onChange={(event) =>
                onChange(
                  label,
                  `${event.target.value.replace(/[^A-Za-z0-9]/g, "")}|${exponent}`,
                )
              }
              style={styles.baseBubble}
            />
            <input
              aria-label={`${label} exponent`}
              inputMode="numeric"
              maxLength={2}
              value={exponent}
              onChange={(event) =>
                onChange(
                  label,
                  `${base}|${event.target.value.replace(/[^0-9]/g, "")}`,
                )
              }
              style={styles.exponentBubble}
            />
          </label>
        );
      })}
    </div>
  );
}

function WorksheetOrbitalLab() {
  const [setIndex, setSetIndex] = useState(() =>
    Math.floor(Math.random() * orbitalElements.length),
  );
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [longhandBubbles, setLonghandBubbles] = useState<
    Record<string, string>
  >({});
  const [nobleBubbles, setNobleBubbles] = useState<Record<string, string>>({});
  const [nobleCore, setNobleCore] = useState("");
  const [finalBubbles, setFinalBubbles] = useState<Record<string, string>>({});
  const [longhand, setLonghand] = useState("");
  const [noble, setNoble] = useState("");
  const [partThree, setPartThree] = useState("");
  const [gainLose, setGainLose] = useState("");
  const [amount, setAmount] = useState("");
  const [ion, setIon] = useState("");
  const [newConfiguration, setNewConfiguration] = useState("");
  const [checked, setChecked] = useState(false);
  const element = orbitalElements[setIndex];
  let remaining = atomicElectrons[element.symbol];
  const expected: Record<string, boolean> = {};
  orbitalOrder.forEach(([label, slotCount]) => {
    // Follow Hund's rule: place one ↑ in each orbital before pairing with ↓.
    for (let slot = 0; slot < slotCount; slot++) {
      const upKey = `${label}-${slot}-up`;
      if (remaining > 0) {
        expected[upKey] = true;
        remaining--;
      }
    }
    for (let slot = 0; slot < slotCount; slot++) {
      const downKey = `${label}-${slot}-down`;
      if (remaining > 0) {
        expected[downKey] = true;
        remaining--;
      }
    }
  });
  const isCorrect =
    Object.keys(expected).every((key) => Boolean(selected[key])) &&
    Object.entries(selected)
      .filter(([, isSelected]) => isSelected)
      .every(([key]) => expected[key]);
  const reset = (next: number) => {
    setSetIndex(next);
    setSelected({});
    setLonghandBubbles({});
    setNobleBubbles({});
    setNobleCore("");
    setFinalBubbles({});
    setLonghand("");
    setNoble("");
    setPartThree("");
    setGainLose("");
    setAmount("");
    setIon("");
    setNewConfiguration("");
    setChecked(false);
  };
  const isRb = element.symbol === "Rb";
  const isBr = element.symbol === "Br";
  const outerPLabel = isRb ? "5s" : isBr ? "4p" : element.symbol === "Cl" ? "3p" : "2p";
  const longhandLabels = isRb
    ? ["1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p", "5s"]
    : isBr
      ? ["1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p"]
      : element.symbol === "Cl"
        ? ["1s", "2s", "2p", "3s", "3p"]
        : ["1s", "2s", "2p"];
  const longhandExpected = isRb
    ? ["2", "2", "6", "2", "6", "2", "10", "6", "1"]
    : isBr
      ? ["2", "2", "6", "2", "6", "2", "10", "5"]
      : element.symbol === "N"
        ? ["2", "2", "3"]
        : element.symbol === "O"
          ? ["2", "2", "4"]
          : ["2", "2", "6", "2", "5"];
  const nobleCoreExpected = isRb ? "kr" : isBr ? "ar" : element.symbol === "Cl" ? "ne" : "he";
  const nobleLabels = isRb ? ["5s"] : isBr ? ["4s", "3d", "4p"] : element.symbol === "Cl" ? ["3s", "3p"] : ["2s", "2p"];
  const nobleExpected = isRb ? ["1"] : isBr ? ["2", "10", "5"] : element.symbol === "N" ? ["2", "3"] : element.symbol === "O" ? ["2", "4"] : ["2", "5"];
  const finalLabels = isRb
    ? ["1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p"]
    : isBr
      ? ["1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p"]
      : element.symbol === "Cl"
        ? ["1s", "2s", "2p", "3s", "3p"]
        : ["1s", "2s", "2p"];
  const finalExpected = isRb || isBr
    ? ["2", "2", "6", "2", "6", "2", "10", "6"]
    : element.symbol === "Cl"
      ? ["2", "2", "6", "2", "6"]
      : ["2", "2", "6"];
  const bubblesMatch = (
    values: Record<string, string>,
    labels: string[],
    expectedValues: string[],
  ) =>
    labels.every(
      (label, index) => values[label] === `${label}|${expectedValues[index]}`,
    );
  const longhandCorrect = bubblesMatch(
    longhandBubbles,
    longhandLabels,
    longhandExpected,
  );
  const nobleCorrect =
    nobleCore.toLowerCase() === nobleCoreExpected &&
    bubblesMatch(nobleBubbles, nobleLabels, nobleExpected);
  const finalCorrect = bubblesMatch(finalBubbles, finalLabels, finalExpected);
  const questionChecks = [
    partThree === outerPLabel,
    gainLose === (isRb ? "lose" : "gain"),
    amount === String(element.gain),
    ion === element.ion,
  ];
  const allCorrect =
    isCorrect &&
    longhandCorrect &&
    nobleCorrect &&
    finalCorrect &&
    questionChecks.every(Boolean);
  const orbitalNotation = (
    <div style={styles.notationRow}>
      <b>c)</b>
      <div style={styles.orbitalRail}>
        {orbitalOrder.map(([label, slotCount]) => (
          <div key={label} style={styles.orbitalRailGroup}>
            {Array.from({ length: slotCount }, (_, slot) => (
              <div key={slot} style={styles.orbitalLine}>
                <button
                  onClick={() =>
                    !checked &&
                    setSelected((current) => ({
                      ...current,
                      [`${label}-${slot}-up`]: !current[`${label}-${slot}-up`],
                    }))
                  }
                  style={{
                    ...styles.arrowGlyph,
                    ...(selected[`${label}-${slot}-up`]
                      ? styles.arrowBlack
                      : {}),
                  }}
                >
                  ↑
                </button>
                <button
                  onClick={() =>
                    !checked &&
                    setSelected((current) => ({
                      ...current,
                      [`${label}-${slot}-down`]:
                        !current[`${label}-${slot}-down`],
                    }))
                  }
                  style={{
                    ...styles.arrowGlyph,
                    ...(selected[`${label}-${slot}-down`]
                      ? styles.arrowBlack
                      : {}),
                  }}
                >
                  ↓
                </button>
              </div>
            ))}
            <small style={styles.orbitalUnderLabel}>{label}</small>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <>
      <div style={styles.gameName}>ORBITAL LAB</div>
      <p style={styles.modalText}>
        Fill in a and b with the exponent bubbles, then build part c exactly
        like the worksheet.
      </p>
      <div style={styles.worksheet}>
        <div style={styles.worksheetTop}>
          <div>
            <h2 style={styles.orbitalHeading}>1. {element.symbol}</h2>
            <div style={styles.answerLine}>
              <b>a)</b>
              <span>Longhand:</span>
              <ExponentBubbles
                labels={longhandLabels}
                values={longhandBubbles}
                onChange={(label, value) =>
                  !checked &&
                  setLonghandBubbles((current) => ({
                    ...current,
                    [label]: value,
                  }))
                }
              />
            </div>
            <div style={styles.answerLine}>
              <b>b)</b>
              <span>Noble gas:</span>
              <ExponentBubbles
                core={`${nobleCoreExpected[0].toUpperCase()}${nobleCoreExpected.slice(1)}`}
                coreValue={nobleCore}
                onCoreChange={(value) => !checked && setNobleCore(value)}
                labels={nobleLabels}
                values={nobleBubbles}
                onChange={(label, value) =>
                  !checked &&
                  setNobleBubbles((current) => ({ ...current, [label]: value }))
                }
              />
            </div>
          </div>
          <div>
            <h2 style={styles.orbitalHeading}>2. Lewis Dot</h2>
            <LewisDot element={element} />
          </div>
        </div>
        {orbitalNotation}
      </div>
      <p style={styles.orbitalHint}>
        Gray arrows turn black when you click them. Click again to remove one.
      </p>
      <div style={styles.labQuestions}>
        <p style={styles.labLabel}>
          3. Which sublevel would {element.name} gain or lose electrons in?
        </p>
        <div style={styles.labOptions}>
          {[outerPLabel, "1s", "2s", "3d"].map((option) => (
            <button
              key={option}
              disabled={checked}
              onClick={() => setPartThree(option)}
              style={{
                ...styles.labOption,
                ...(partThree === option ? styles.selected : {}),
              }}
            >
              {option}
            </button>
          ))}
        </div>
        <p style={styles.labLabel}>
          4. Does this atom gain or lose electrons to become an ion?
        </p>
        <div style={styles.labOptions}>
          {["gain", "lose"].map((option) => (
            <button
              key={option}
              disabled={checked}
              onClick={() => setGainLose(option)}
              style={{
                ...styles.labOption,
                ...(gainLose === option ? styles.selected : {}),
              }}
            >
              {option}
            </button>
          ))}
        </div>
        <p style={styles.labLabel}>5. How many electrons are gained or lost?</p>
        <div style={styles.labOptions}>
          {[1, 2, 3].map((number) => (
            <button
              key={number}
              disabled={checked}
              onClick={() => setAmount(String(number))}
              style={{
                ...styles.labOption,
                ...(amount === String(number) ? styles.selected : {}),
              }}
            >
              {number}
            </button>
          ))}
        </div>
        <p style={styles.labLabel}>6. Write the symbol for the ion.</p>
        <div style={styles.labOptions}>
          {[
            element.ion,
            `${element.symbol}³⁺`,
            `${element.symbol}⁺`,
            `${element.symbol}²⁺`,
          ]
            .filter((value, index, array) => array.indexOf(value) === index)
            .map((option) => (
              <button
                key={option}
                disabled={checked}
                onClick={() => setIon(option)}
                style={{
                  ...styles.labOption,
                  ...(ion === option ? styles.selected : {}),
                }}
              >
                {option}
              </button>
            ))}
        </div>
        <p style={styles.labLabel}>
          7. Write the new electron configuration for the ion.
        </p>
        <ExponentBubbles
          labels={finalLabels}
          values={finalBubbles}
          onChange={(label, value) =>
            !checked &&
            setFinalBubbles((current) => ({ ...current, [label]: value }))
          }
        />
      </div>
      {!checked ? (
        <button style={styles.closeButton} onClick={() => setChecked(true)}>
          Check Lab
        </button>
      ) : (
        <>
          <div style={styles.labResults}>
            <strong style={allCorrect ? styles.resultGood : styles.resultNeedsWork}>
              {allCorrect
                ? "Perfect — every part is correct!"
                : "Here is exactly what to fix:"}
            </strong>
            {[
              ["a) Longhand", longhandCorrect, element.longhand],
              ["b) Noble gas", nobleCorrect, element.noble],
              ["c) Orbital notation", isCorrect, "Use one ↑ in each orbital line before adding ↓ arrows."],
              ["3", questionChecks[0], outerPLabel],
              ["4", questionChecks[1], isRb ? "lose" : "gain"],
              ["5", questionChecks[2], String(element.gain)],
              ["6", questionChecks[3], element.ion],
              ["7", finalCorrect, element.configuration],
            ].map(([label, correct, answer]) => (
              <div key={String(label)} style={correct ? styles.resultRowGood : styles.resultRowBad}>
                <strong>{correct ? "✓" : "✕"} {label}</strong>
                {!correct && <span>Correct answer: {answer}</span>}
              </div>
            ))}
          </div>
          <button
            style={styles.closeButton}
            onClick={() => reset((setIndex + 1) % orbitalElements.length)}
          >
            Next element
          </button>
        </>
      )}
    </>
  );
  return (
    <>
      <div style={styles.gameName}>ORBITAL LAB</div>
      <p style={styles.modalText}>
        Answer a and b yourself, then build part c exactly like the worksheet by
        clicking the thin gray arrows you want to use.
      </p>
      <div style={styles.worksheet}>
        <div style={styles.worksheetTop}>
          <div>
            <h2 style={styles.orbitalHeading}>1. {element.symbol}</h2>
            <label style={styles.answerLine}>
              <b>a)</b>
              <span>Longhand:</span>
              <input
                disabled={checked}
                value={longhand}
                onChange={(event) => setLonghand(event.target.value)}
                placeholder="Type electron configuration"
                style={styles.orbitalInput}
              />
            </label>
            <label style={styles.answerLine}>
              <b>b)</b>
              <span>Noble gas:</span>
              <input
                disabled={checked}
                value={noble}
                onChange={(event) => setNoble(event.target.value)}
                placeholder="Type noble gas configuration"
                style={styles.orbitalInput}
              />
            </label>
          </div>
          <div>
            <h2 style={styles.orbitalHeading}>2. Lewis Dot</h2>
            <LewisDot element={element} />
          </div>
        </div>
        <div style={styles.notationRow}>
          <b>c)</b>
          <div style={styles.orbitalRail}>
            {orbitalOrder.map(([label, slotCount]) => (
              <div key={label} style={styles.orbitalRailGroup}>
                {Array.from({ length: slotCount }, (_, slot) => (
                  <div key={slot} style={styles.orbitalLine}>
                    <button
                      onClick={() =>
                        !checked &&
                        setSelected((current) => ({
                          ...current,
                          [`${label}-${slot}-up`]:
                            !current[`${label}-${slot}-up`],
                        }))
                      }
                      style={{
                        ...styles.arrowGlyph,
                        ...(selected[`${label}-${slot}-up`]
                          ? styles.arrowBlack
                          : {}),
                      }}
                    >
                      ↑
                    </button>
                    <button
                      onClick={() =>
                        !checked &&
                        setSelected((current) => ({
                          ...current,
                          [`${label}-${slot}-down`]:
                            !current[`${label}-${slot}-down`],
                        }))
                      }
                      style={{
                        ...styles.arrowGlyph,
                        ...(selected[`${label}-${slot}-down`]
                          ? styles.arrowBlack
                          : {}),
                      }}
                    >
                      ↓
                    </button>
                  </div>
                ))}
                <small style={styles.orbitalUnderLabel}>{label}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p style={styles.orbitalHint}>
        Gray arrows turn black when you click them. Click again to remove one.
      </p>
      <div style={styles.labQuestions}>
        <p style={styles.labLabel}>
          3. Which sublevel would {element.name} gain or lose electrons in?
        </p>
        <div style={styles.labOptions}>
          {[outerPLabel, "1s", "2s", "3d"].map((option) => (
            <button
              key={option}
              disabled={checked}
              onClick={() => setPartThree(option)}
              style={{
                ...styles.labOption,
                ...(partThree === option ? styles.selected : {}),
              }}
            >
              {option}
            </button>
          ))}
        </div>
        <p style={styles.labLabel}>
          4. Does this atom gain or lose electrons to become an ion?
        </p>
        <div style={styles.labOptions}>
          {["gain", "lose"].map((option) => (
            <button
              key={option}
              disabled={checked}
              onClick={() => setGainLose(option)}
              style={{
                ...styles.labOption,
                ...(gainLose === option ? styles.selected : {}),
              }}
            >
              {option}
            </button>
          ))}
        </div>
        <p style={styles.labLabel}>5. How many electrons are gained or lost?</p>
        <div style={styles.labOptions}>
          {[1, 2, 3].map((number) => (
            <button
              key={number}
              disabled={checked}
              onClick={() => setAmount(String(number))}
              style={{
                ...styles.labOption,
                ...(amount === String(number) ? styles.selected : {}),
              }}
            >
              {number}
            </button>
          ))}
        </div>
        <p style={styles.labLabel}>6. Write the symbol for the ion.</p>
        <div style={styles.labOptions}>
          {[
            element.ion,
            `${element.symbol}³⁺`,
            `${element.symbol}⁺`,
            `${element.symbol}²⁺`,
          ]
            .filter((value, index, array) => array.indexOf(value) === index)
            .map((option) => (
              <button
                key={option}
                disabled={checked}
                onClick={() => setIon(option)}
                style={{
                  ...styles.labOption,
                  ...(ion === option ? styles.selected : {}),
                }}
              >
                {option}
              </button>
            ))}
        </div>
        <p style={styles.labLabel}>
          7. Write the new electron configuration for the ion.
        </p>
        <input
          disabled={checked}
          value={newConfiguration}
          onChange={(event) => setNewConfiguration(event.target.value)}
          placeholder="Type new electron configuration"
          style={styles.orbitalInput}
        />
      </div>
      {!checked ? (
        <button style={styles.closeButton} onClick={() => setChecked(true)}>
          Check Lab
        </button>
      ) : (
        <>
          <p style={styles.explanation}>
            {allCorrect ? (
              "Perfect — all of parts a–c and questions 3–7 are correct!"
            ) : (
              <>
                Not quite. Correct answers: a){" "}
                <strong>{element.longhand}</strong>, b){" "}
                <strong>{element.noble}</strong>, 3){" "}
                <strong>{outerPLabel}</strong>, 4) <strong>gain</strong>, 5){" "}
                <strong>{element.gain}</strong>, 6){" "}
                <strong>{element.ion}</strong>, 7){" "}
                <strong>{element.configuration}</strong>.
              </>
            )}
          </p>
          <button
            style={styles.closeButton}
            onClick={() => reset((setIndex + 1) % orbitalElements.length)}
          >
            Next element
          </button>
        </>
      )}
    </>
  );
  return (
    <>
      <div style={styles.gameName}>ORBITAL LAB</div>
      <p style={styles.modalText}>
        Build the orbital notation exactly like the worksheet. Every thin gray
        arrow is clickable—click only the arrows that belong for this atom.
      </p>
      <div style={styles.worksheet}>
        <div style={styles.worksheetTop}>
          <div>
            <h2 style={styles.orbitalHeading}>1. {element.symbol}</h2>
            <p style={styles.notationRow}>
              <b>a)</b> Longhand: <strong>{element.longhand}</strong>
            </p>
            <p style={styles.notationRow}>
              <b>b)</b> Noble gas: <strong>{element.noble}</strong>
            </p>
          </div>
          <div>
            <h2 style={styles.orbitalHeading}>2. Lewis Dot</h2>
            <LewisDot element={element} />
          </div>
        </div>
        <div style={styles.notationRow}>
          <b>c)</b>
          <div style={styles.orbitalRail}>
            {orbitalOrder.map(([label, slotCount]) => (
              <div key={label} style={styles.orbitalRailGroup}>
                {Array.from({ length: slotCount }, (_, slot) => (
                  <div key={slot} style={styles.orbitalLine}>
                    <button
                      onClick={() =>
                        !checked &&
                        setSelected((current) => ({
                          ...current,
                          [`${label}-${slot}-up`]:
                            !current[`${label}-${slot}-up`],
                        }))
                      }
                      style={{
                        ...styles.arrowGlyph,
                        ...(selected[`${label}-${slot}-up`]
                          ? styles.arrowBlack
                          : {}),
                      }}
                    >
                      ↑
                    </button>
                    <button
                      onClick={() =>
                        !checked &&
                        setSelected((current) => ({
                          ...current,
                          [`${label}-${slot}-down`]:
                            !current[`${label}-${slot}-down`],
                        }))
                      }
                      style={{
                        ...styles.arrowGlyph,
                        ...(selected[`${label}-${slot}-down`]
                          ? styles.arrowBlack
                          : {}),
                      }}
                    >
                      ↓
                    </button>
                  </div>
                ))}
                <small style={styles.orbitalUnderLabel}>{label}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p style={styles.orbitalHint}>
        The arrows begin light gray. Click one and it turns black. You can click
        it again to remove it.
      </p>
      {!checked ? (
        <button style={styles.closeButton} onClick={() => setChecked(true)}>
          Check orbital notation
        </button>
      ) : (
        <>
          <p style={styles.explanation}>
            {isCorrect ? (
              "Correct! That orbital notation matches the atom."
            ) : (
              <>
                Not quite. Use the electron configuration above to decide which
                arrows should be black.{" "}
                <strong>
                  {element.name} has {atomicElectrons[element.symbol]} total
                  electrons.
                </strong>
              </>
            )}
          </p>
          <button
            style={styles.closeButton}
            onClick={() => reset((setIndex + 1) % orbitalElements.length)}
          >
            Next element
          </button>
        </>
      )}
    </>
  );
}

function OrbitalLab() {
  return <WorksheetOrbitalLab />;
  const [setIndex, setSetIndex] = useState(0);
  const [arrow, setArrow] = useState<"↑" | "↓">("↓");
  const [orbitals, setOrbitals] = useState<string[][]>(() =>
    orbitalElements[0].initial.map((box) => [...box]),
  );
  const [gainLose, setGainLose] = useState("");
  const [amount, setAmount] = useState("");
  const [ion, setIon] = useState("");
  const [configuration, setConfiguration] = useState("");
  const [checked, setChecked] = useState(false);
  const element = orbitalElements[setIndex];
  const reset = (nextIndex: number) => {
    const next = orbitalElements[nextIndex];
    setSetIndex(nextIndex);
    setOrbitals(next.initial.map((box) => [...box]));
    setGainLose("");
    setAmount("");
    setIon("");
    setConfiguration("");
    setChecked(false);
  };
  const addDownArrow = (boxIndex: number) => {
    if (checked) return;
    setOrbitals((current) =>
      current.map((box, index) =>
        index !== boxIndex || box.includes("↓") || box.length === 2
          ? box
          : [...box, "↓"],
      ),
    );
  };
  const addArrow = addDownArrow;
  const arrowsCorrect = orbitals.every(
    (box) => box.includes("↑") && box.includes("↓"),
  );
  const correct =
    arrowsCorrect &&
    gainLose === "gain" &&
    amount === String(element.gain) &&
    ion === element.ion &&
    configuration === element.configuration;
  const filledGroups =
    element.symbol === "Cl"
      ? [
          ["1s", 1],
          ["2s", 1],
          ["2p", 3],
          ["3s", 1],
        ]
      : [
          ["1s", 1],
          ["2s", 1],
        ];
  const outerPLabel = element.symbol === "Cl" ? "3p" : "2p";
  return (
    <>
      <div style={styles.gameName}>ORBITAL LAB</div>
      <p style={styles.modalText}>
        This is the same setup as your worksheet. Click the gray ↓ arrows in the
        last p sublevel to add electrons.
      </p>
      <div style={styles.notationPaper}>
        <h2 style={styles.orbitalHeading}>1. {element.symbol}</h2>
        <div style={styles.notationRow}>
          <b>a)</b>
          <span>{element.longhand}</span>
        </div>
        <div style={styles.notationRow}>
          <b>b)</b>
          <span>{element.noble}</span>
        </div>
        <div style={styles.notationRow}>
          <b>c)</b>
          <div style={styles.orbitalSequence}>
            {filledGroups.map(([label, count]) => (
              <div key={label as string} style={styles.orbitalGroup}>
                {Array.from({ length: count as number }, (_, index) => (
                  <div key={index} style={styles.orbitalBox}>
                    <span style={styles.blackArrow}>↑</span>
                    <span style={styles.blackArrow}>↓</span>
                  </div>
                ))}
                <small>{label}</small>
              </div>
            ))}
            <div
              style={{ ...styles.orbitalGroup, ...styles.activeOrbitalGroup }}
            >
              {orbitals.map((box, index) => (
                <div key={index} style={styles.orbitalBox}>
                  <span style={styles.blackArrow}>↑</span>
                  {box.includes("↓") ? (
                    <span style={styles.blackArrow}>↓</span>
                  ) : (
                    <button
                      aria-label={`Add down arrow to ${outerPLabel} orbital ${index + 1}`}
                      onClick={() => addDownArrow(index)}
                      style={styles.grayArrow}
                    >
                      ↓
                    </button>
                  )}
                </div>
              ))}
              <small>{outerPLabel}</small>
            </div>
            <div style={styles.orbitalRest}>
              <span>—</span>
              <span>—</span>
              <span>—</span>
              <span>—</span>
              <small>
                {element.symbol === "Cl"
                  ? "4s · 3d · 4p"
                  : "3s · 3p · 4s · 3d · 4p"}
              </small>
            </div>
          </div>
        </div>
        <p style={styles.orbitalHint}>
          Gray arrows are the missing electrons. Click them to turn them black.
        </p>
      </div>
      <div style={styles.orbitalLabGrid}>
        <div>
          <h2 style={styles.orbitalHeading}>{element.name} · Lewis Dot</h2>
          <LewisDot element={element} />
          <p style={styles.orbitalHint}>
            {element.name} has {element.dots} valence electrons.
          </p>
        </div>
      </div>
      <div style={styles.labQuestions}>
        <p style={styles.labLabel}>
          3. Where would {element.name} gain or lose electrons?
        </p>
        <p style={styles.labAnswer}>
          In the highlighted outer {outerPLabel} boxes above.
        </p>
        <p style={styles.labLabel}>
          4. Does this atom gain or lose electrons to become an ion?
        </p>
        <div style={styles.labOptions}>
          {["gain", "lose"].map((option) => (
            <button
              key={option}
              onClick={() => !checked && setGainLose(option)}
              style={{
                ...styles.labOption,
                ...(gainLose === option ? styles.selected : {}),
              }}
            >
              {option}
            </button>
          ))}
        </div>
        <p style={styles.labLabel}>5. How many electrons are gained or lost?</p>
        <div style={styles.labOptions}>
          {[1, 2, 3].map((number) => (
            <button
              key={number}
              onClick={() => !checked && setAmount(String(number))}
              style={{
                ...styles.labOption,
                ...(amount === String(number) ? styles.selected : {}),
              }}
            >
              {number}
            </button>
          ))}
        </div>
        <p style={styles.labLabel}>6. Write the symbol for the ion.</p>
        <div style={styles.labOptions}>
          {[
            element.ion,
            `${element.symbol}³⁺`,
            `${element.symbol}⁺`,
            `${element.symbol}²⁺`,
          ]
            .filter((value, index, array) => array.indexOf(value) === index)
            .map((option) => (
              <button
                key={option}
                onClick={() => !checked && setIon(option)}
                style={{
                  ...styles.labOption,
                  ...(ion === option ? styles.selected : {}),
                }}
              >
                {option}
              </button>
            ))}
        </div>
        <p style={styles.labLabel}>
          7. Write the new electron configuration for the ion.
        </p>
        <div style={styles.labOptions}>
          {shuffle([
            element.configuration,
            "1s² 2s² 2p³",
            "1s² 2s² 2p⁵",
            "1s² 2s¹",
          ]).map((option) => (
            <button
              key={option}
              onClick={() => !checked && setConfiguration(option)}
              style={{
                ...styles.labOption,
                ...(configuration === option ? styles.selected : {}),
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      {!checked ? (
        <button style={styles.closeButton} onClick={() => setChecked(true)}>
          Check Lab
        </button>
      ) : (
        <>
          <p style={styles.explanation}>
            {correct ? (
              "Perfect — you filled the orbital and answered all five parts correctly!"
            ) : (
              <>
                Almost. {element.name}{" "}
                <strong>gains {element.gain} electrons</strong>, becomes{" "}
                <strong>{element.ion}</strong>, and has the configuration{" "}
                <strong>{element.configuration}</strong>. The outer p boxes
                should each have ↑↓.
              </>
            )}
          </p>
          <button
            style={styles.closeButton}
            onClick={() => reset((setIndex + 1) % orbitalElements.length)}
          >
            Next element
          </button>
        </>
      )}
    </>
  );
  return (
    <>
      <div style={styles.gameName}>ORBITAL LAB</div>
      <p style={styles.modalText}>
        Click each gray arrow to turn it black and fill the outer p orbital.
        Then answer questions 3–7.
      </p>
      <div style={styles.orbitalLabGrid}>
        <div>
          <h2 style={styles.orbitalHeading}>{element.name} · Lewis Dot</h2>
          <LewisDot element={element} />
          <p style={styles.orbitalHint}>
            {element.name} has {element.dots} valence electrons.
          </p>
        </div>
        <div>
          <h2 style={styles.orbitalHeading}>Fill the outer p orbital</h2>
          <div style={styles.orbitalBoxes}>
            {orbitals.map((box, index) => (
              <div key={index} style={styles.orbitalBox}>
                <span style={styles.blackArrow}>↑</span>
                {box.includes("↓") ? (
                  <span style={styles.blackArrow}>↓</span>
                ) : (
                  <button
                    aria-label={`Add down arrow to p orbital ${index + 1}`}
                    onClick={() => addDownArrow(index)}
                    style={styles.grayArrow}
                  >
                    ↓
                  </button>
                )}
              </div>
            ))}
          </div>
          <div style={styles.orbitalLabels}>
            <span>p</span>
            <span>p</span>
            <span>p</span>
          </div>
          <p style={styles.orbitalHint}>
            Tap every gray ↓ arrow so each box has ↑↓.
          </p>
        </div>
      </div>
      <div style={styles.labQuestions}>
        <p style={styles.labLabel}>
          3. Where would {element.name} gain or lose electrons?
        </p>
        <p style={styles.labAnswer}>In the outer p orbital boxes above.</p>
        <p style={styles.labLabel}>
          4. Does this atom gain or lose electrons to become an ion?
        </p>
        <div style={styles.labOptions}>
          {["gain", "lose"].map((option) => (
            <button
              key={option}
              onClick={() => !checked && setGainLose(option)}
              style={{
                ...styles.labOption,
                ...(gainLose === option ? styles.selected : {}),
              }}
            >
              {option}
            </button>
          ))}
        </div>
        <p style={styles.labLabel}>5. How many electrons are gained or lost?</p>
        <div style={styles.labOptions}>
          {[1, 2, 3].map((number) => (
            <button
              key={number}
              onClick={() => !checked && setAmount(String(number))}
              style={{
                ...styles.labOption,
                ...(amount === String(number) ? styles.selected : {}),
              }}
            >
              {number}
            </button>
          ))}
        </div>
        <p style={styles.labLabel}>6. Write the symbol for the ion.</p>
        <div style={styles.labOptions}>
          {[
            element.ion,
            `${element.symbol}³⁺`,
            `${element.symbol}⁺`,
            `${element.symbol}²⁺`,
          ]
            .filter((value, index, array) => array.indexOf(value) === index)
            .map((option) => (
              <button
                key={option}
                onClick={() => !checked && setIon(option)}
                style={{
                  ...styles.labOption,
                  ...(ion === option ? styles.selected : {}),
                }}
              >
                {option}
              </button>
            ))}
        </div>
        <p style={styles.labLabel}>
          7. Write the new electron configuration for the ion.
        </p>
        <div style={styles.labOptions}>
          {shuffle([
            element.configuration,
            "1s² 2s² 2p³",
            "1s² 2s² 2p⁵",
            "1s² 2s¹",
          ]).map((option) => (
            <button
              key={option}
              onClick={() => !checked && setConfiguration(option)}
              style={{
                ...styles.labOption,
                ...(configuration === option ? styles.selected : {}),
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      {!checked ? (
        <button style={styles.closeButton} onClick={() => setChecked(true)}>
          Check Lab
        </button>
      ) : (
        <>
          <p style={styles.explanation}>
            {correct ? (
              "Perfect — you filled the orbital and answered all five parts correctly!"
            ) : (
              <>
                Almost. {element.name}{" "}
                <strong>gains {element.gain} electrons</strong>, becomes{" "}
                <strong>{element.ion}</strong>, and has the configuration{" "}
                <strong>{element.configuration}</strong>. The outer p boxes
                should each have ↑↓.
              </>
            )}
          </p>
          <button
            style={styles.closeButton}
            onClick={() => reset((setIndex + 1) % orbitalElements.length)}
          >
            Next element
          </button>
        </>
      )}
    </>
  );
  return (
    <>
      <div style={styles.gameName}>ORBITAL LAB</div>
      <p style={styles.modalText}>
        Use the Lewis dot picture and the orbital diagram to answer questions
        3–7. Tap an arrow, then tap an outer p box to add that electron.
      </p>
      <div style={styles.orbitalLabGrid}>
        <div>
          <h2 style={styles.orbitalHeading}>{element.name} · Lewis Dot</h2>
          <LewisDot element={element} />
          <p style={styles.orbitalHint}>
            {element.name} has {element.dots} valence electrons.
          </p>
        </div>
        <div>
          <h2 style={styles.orbitalHeading}>Fill the outer p orbital</h2>
          <div style={styles.arrowPicker}>
            <button
              onClick={() => setArrow("↑")}
              style={{
                ...styles.arrowButton,
                ...(arrow === "↑" ? styles.arrowActive : {}),
              }}
            >
              ↑ add up
            </button>
            <button
              onClick={() => setArrow("↓")}
              style={{
                ...styles.arrowButton,
                ...(arrow === "↓" ? styles.arrowActive : {}),
              }}
            >
              ↓ add down
            </button>
          </div>
          <div style={styles.orbitalBoxes}>
            {orbitals.map((box, index) => (
              <button
                key={index}
                onClick={() => addArrow(index)}
                style={styles.orbitalBox}
              >
                {box.map((mark, markIndex) => (
                  <span key={markIndex}>{mark}</span>
                ))}
              </button>
            ))}
          </div>
          <div style={styles.orbitalLabels}>
            <span>p</span>
            <span>p</span>
            <span>p</span>
          </div>
          <p style={styles.orbitalHint}>
            Make a full outer level before checking.
          </p>
        </div>
      </div>
      <div style={styles.labQuestions}>
        <p style={styles.labLabel}>
          3. Where would {element.name} gain or lose electrons?
        </p>
        <p style={styles.labAnswer}>In the outer p orbital boxes above.</p>
        <p style={styles.labLabel}>
          4. Does this atom gain or lose electrons to become an ion?
        </p>
        <div style={styles.labOptions}>
          {["gain", "lose"].map((option) => (
            <button
              key={option}
              onClick={() => !checked && setGainLose(option)}
              style={{
                ...styles.labOption,
                ...(gainLose === option ? styles.selected : {}),
              }}
            >
              {option}
            </button>
          ))}
        </div>
        <p style={styles.labLabel}>5. How many electrons are gained or lost?</p>
        <div style={styles.labOptions}>
          {[1, 2, 3].map((number) => (
            <button
              key={number}
              onClick={() => !checked && setAmount(String(number))}
              style={{
                ...styles.labOption,
                ...(amount === String(number) ? styles.selected : {}),
              }}
            >
              {number}
            </button>
          ))}
        </div>
        <p style={styles.labLabel}>6. Write the symbol for the ion.</p>
        <div style={styles.labOptions}>
          {[
            element.ion,
            `${element.symbol}³⁺`,
            `${element.symbol}⁺`,
            `${element.symbol}²⁺`,
          ]
            .filter((value, index, array) => array.indexOf(value) === index)
            .map((option) => (
              <button
                key={option}
                onClick={() => !checked && setIon(option)}
                style={{
                  ...styles.labOption,
                  ...(ion === option ? styles.selected : {}),
                }}
              >
                {option}
              </button>
            ))}
        </div>
        <p style={styles.labLabel}>
          7. Write the new electron configuration for the ion.
        </p>
        <div style={styles.labOptions}>
          {shuffle([
            element.configuration,
            "1s² 2s² 2p³",
            "1s² 2s² 2p⁵",
            "1s² 2s¹",
          ]).map((option) => (
            <button
              key={option}
              onClick={() => !checked && setConfiguration(option)}
              style={{
                ...styles.labOption,
                ...(configuration === option ? styles.selected : {}),
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      {!checked ? (
        <button style={styles.closeButton} onClick={() => setChecked(true)}>
          Check Lab
        </button>
      ) : (
        <>
          <p style={styles.explanation}>
            {correct ? (
              "Perfect — you filled the orbital and answered all five parts correctly!"
            ) : (
              <>
                Almost. {element.name}{" "}
                <strong>gains {element.gain} electrons</strong>, becomes{" "}
                <strong>{element.ion}</strong>, and has the configuration{" "}
                <strong>{element.configuration}</strong>. The outer p boxes
                should each have ↑↓.
              </>
            )}
          </p>
          <button
            style={styles.closeButton}
            onClick={() => reset((setIndex + 1) % orbitalElements.length)}
          >
            Next element
          </button>
        </>
      )}
    </>
  );
}

function StatsScreen({
  stats,
  resetOpen,
  resetCode,
  onCodeChange,
  onOpenReset,
  onCancelReset,
  onReset,
}: {
  stats: Record<string, GameStat>;
  resetOpen: boolean;
  resetCode: string;
  onCodeChange: (value: string) => void;
  onOpenReset: () => void;
  onCancelReset: () => void;
  onReset: () => void;
}) {
  return (
    <>
      <h2 style={styles.modalTitle}>My Stats</h2>
      <p style={styles.modalText}>Your score for each topic.</p>
      <div style={styles.statsGrid}>
        {chemistryTopics.map((name) => {
          const stat = stats[name] || { correct: 0, attempts: 0 };
          const percent = stat.attempts
            ? Math.round((stat.correct / stat.attempts) * 100)
            : 0;
          return (
            <div key={name} style={styles.statCard}>
              <strong>{name}</strong>
              <span style={styles.statPercent}>
                {stat.attempts ? `${percent}%` : "—"}
              </span>
              <small>
                {stat.attempts
                  ? `${stat.correct} / ${stat.attempts} correct`
                  : "Not studied yet"}
              </small>
            </div>
          );
        })}
      </div>
      <button style={styles.resetStatsButton} onClick={onOpenReset}>
        Reset Stats
      </button>
      {resetOpen && (
        <div style={styles.resetBubble}>
          <h3 style={styles.resetTitle}>Reset all your stats?</h3>
          <p style={styles.modalText}>
            Type <strong>XRAY</strong> to clear every topic score.
          </p>
          <input
            value={resetCode}
            onChange={(event) => onCodeChange(event.target.value)}
            placeholder="Type XRAY"
            style={styles.resetInput}
          />
          <div style={styles.resetActions}>
            <button style={styles.cancelButton} onClick={onCancelReset}>
              Cancel
            </button>
            <button
              disabled={resetCode !== "XRAY"}
              style={{
                ...styles.resetConfirmButton,
                opacity: resetCode === "XRAY" ? 1 : 0.45,
              }}
              onClick={onReset}
            >
              Clear Stats
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function GameEndScreen({
  game,
  correct,
  attempts,
  onPlayAgain,
  onBackHome,
  exploded = false,
}: {
  game: string;
  correct: number;
  attempts: number;
  onPlayAgain: () => void;
  onBackHome: () => void;
  exploded?: boolean;
}) {
  return (
    <>
      <h2 style={styles.modalTitle}>
        {exploded
          ? "💥 Bomb Exploded!"
          : game === "Bomb"
            ? "💣 Bomb Defused!"
            : `${game} Complete!`}
      </h2>
      <div style={styles.statsNumber}>
        {attempts ? `${correct}/${attempts}` : "10"}
      </div>
      <p style={styles.modalText}>
        {attempts
          ? `${correct} correct out of ${attempts} questions`
          : "10 cards reviewed"}
      </p>
      <div style={styles.endActions}>
        <button style={styles.closeButton} onClick={onPlayAgain}>
          Play Again
        </button>
        <button style={styles.resetStatsButton} onClick={onBackHome}>
          Back to Home
        </button>
      </div>
    </>
  );
}

function useDraggablePanel() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const start = useRef<{ x: number; y: number } | null>(null);
  const startOffset = useRef({ x: 0, y: 0 });
  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    start.current = { x: event.clientX, y: event.clientY };
    startOffset.current = offset;
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!start.current) return;
    setOffset({
      x: startOffset.current.x + event.clientX - start.current.x,
      y: startOffset.current.y + event.clientY - start.current.y,
    });
  };
  const onPointerUp = () => {
    start.current = null;
  };
  return {
    panelStyle: { transform: `translate(${offset.x}px, ${offset.y}px)` },
    dragProps: { onPointerDown, onPointerMove, onPointerUp },
  };
}

function EquationCheatSheet({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const { panelStyle, dragProps } = useDraggablePanel();
  const rows = [
    ["Frequency", "Wavelength", "λ = c / ν"],
    ["Wavelength", "Frequency", "ν = c / λ"],
    ["Frequency", "Energy", "E = hν"],
    ["Energy", "Frequency", "ν = E / h"],
    ["Wavelength", "Energy", "E = hc / λ"],
    ["Energy", "Wavelength", "λ = hc / E"],
  ];
  return (
    <div style={styles.cheatDock}>
      {open && (
        <aside style={{ ...styles.cheatSheet, ...panelStyle }} aria-label="Equation cheat sheet">
          <div style={styles.panelDragHandle} {...dragProps}>
            <button
              type="button"
              aria-label="Close equation cheat sheet"
              style={styles.panelClose}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={onToggle}
            >
              ×
            </button>
            <strong style={styles.cheatTitle}>Equation Cheat Sheet</strong>
            <span style={styles.dragHint}>Drag me</span>
          </div>
          <div style={styles.cheatHeader}>
            <span>Given</span><span>Find</span><span>Equation</span>
          </div>
          {rows.map(([given, find, equation]) => (
            <div key={equation} style={styles.cheatRow}>
              <span>{given}</span><span>{find}</span><em>{equation}</em>
            </div>
          ))}
        </aside>
      )}
      {!open && <button style={styles.cheatButton} onClick={onToggle}>Equation Cheat Sheet</button>}
    </div>
  );
}

function ChemistryCalculator({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  const { panelStyle, dragProps } = useDraggablePanel();
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const add = (value: string) => {
    setExpression((current) => current + value);
    setResult("");
  };
  const calculate = () => {
    if (!expression) return;
    try {
      if (!/^[0-9+\-*/().^\s]+$/.test(expression)) throw new Error("Invalid input");
      const value = Function(`"use strict"; return (${expression.replaceAll("^", "**")})`)();
      if (!Number.isFinite(value)) throw new Error("Invalid result");
      setResult(Number(value).toExponential(6).replace("e+", " × 10^"));
    } catch {
      setResult("Check your equation");
    }
  };
  const keys = [
    ["7", "7"], ["8", "8"], ["9", "9"], ["÷", "/"],
    ["4", "4"], ["5", "5"], ["6", "6"], ["×", "*"],
    ["1", "1"], ["2", "2"], ["3", "3"], ["−", "-"],
    ["0", "0"], [".", "."], ["+", "+"], ["=", "="],
  ];
  return (
    <div style={styles.calculatorDock}>
      {open && (
        <aside style={{ ...styles.calculator, ...panelStyle }} aria-label="Chemistry calculator">
          <div style={styles.panelDragHandle} {...dragProps}>
            <button
              type="button"
              aria-label="Close chemistry calculator"
              style={styles.panelClose}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={onToggle}
            >
              ×
            </button>
            <strong style={styles.calculatorTitle}>Chem Calculator</strong>
            <span style={styles.dragHint}>Drag me</span>
          </div>
          <div style={styles.calculatorDisplay} aria-live="polite">
            <span>{expression || "0"}</span>
            {result && <small>{result}</small>}
          </div>
          <div style={styles.calculatorKeys}>
            <button style={styles.calcSpecial} onClick={() => add("3*10^8")}>C = 3 × 10⁸</button>
            <button style={styles.calcSpecial} onClick={() => add("6.63*10^-34")}>H = 6.63 × 10⁻³⁴</button>
            <button style={styles.calcSpecial} onClick={() => add("10^(")}>10^()</button>
            <button style={styles.calcSpecial} onClick={() => add("(")}>(</button>
            <button style={styles.calcSpecial} onClick={() => add(")")}>)</button>
            {keys.map(([label, value]) => (
              <button
                key={label}
                style={label === "=" ? styles.calcEquals : styles.calcKey}
                onClick={() => (value === "=" ? calculate() : add(value))}
              >
                {label}
              </button>
            ))}
            <button style={styles.calcWideKey} onClick={() => { setExpression(""); setResult(""); }}>Clear</button>
            <button style={styles.calcWideKey} onClick={() => { setExpression((current) => current.slice(0, -1)); setResult(""); }}>Delete</button>
          </div>
        </aside>
      )}
      {!open && <button style={styles.cheatButton} onClick={onToggle}>Chem Calculator</button>}
    </div>
  );
}

export default function ChemistryHub() {
  const [selectedUnit, setSelectedUnit] = useState("Unit 1");
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [choice, setChoice] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [jeopardyQuestion, setJeopardyQuestion] = useState<number | null>(null);
  const [jeopardyUsed, setJeopardyUsed] = useState<number[]>([]);
  const [bombSet, setBombSet] = useState<Question[]>([]);
  const [gameQuestionSet, setGameQuestionSet] = useState<Question[]>([]);
  const [matchRound, setMatchRound] = useState(0);
  const [jeopardySet, setJeopardySet] = useState<Question[]>([]);
  const [bombComplete, setBombComplete] = useState(false);
  const [bombExploded, setBombExploded] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameStats, setGameStats] = useState<Record<string, GameStat>>({});
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [resetStatsOpen, setResetStatsOpen] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const questions =
    selectedUnit === "Unit 5"
      ? exactUnit5Questions
      : selectedUnit === "Unit 6"
        ? unit6Questions
        : [];
  const activeJeopardyBoard =
    selectedUnit === "Unit 6" ? unit6JeopardyBoard : jeopardyBoard;
  const currentQuestion =
    selectedGame && selectedGame !== "Bomb"
      ? gameQuestionSet[questionIndex]
      : questions[questionIndex % Math.max(questions.length, 1)];
  const playable =
    selectedGame !== "My Stats" && selectedGame !== "Orbital Lab";
  const openGame = (game: string) => {
    setSelectedGame(game);
    setQuestionIndex(0);
    setShowAnswer(false);
    setChoice(null);
    setChecked(false);
    setJeopardyQuestion(null);
    setJeopardyUsed([]);
    setBombComplete(false);
    setBombExploded(false);
    setGameComplete(false);
    setCorrectCount(0);
    setAttemptCount(0);
    if (game === "Match") setMatchRound((round) => round + 1);
    if (questions.length) {
      setGameQuestionSet(makeGameSet(questions));
      setJeopardySet(questions.map(shuffleChoices));
    }
    if (game === "Bomb" && questions.length) setBombSet(makeBombSet(questions));
  };
  const next = () => {
    const limit = selectedGame === "Quiz" ? questions.length : selectedGame === "Millionaire" ? 15 : 10;
    if (questionIndex >= limit - 1) {
      setGameComplete(true);
      setChoice(null);
      setChecked(false);
      return;
    }
    setQuestionIndex((i) => (i + 1) % questions.length);
    setShowAnswer(false);
    setChoice(null);
    setChecked(false);
  };
  const recordResult = (game: string, isCorrect: boolean) =>
    setGameStats((current) => ({
      ...current,
      [game]: {
        correct: (current[game]?.correct || 0) + (isCorrect ? 1 : 0),
        attempts: (current[game]?.attempts || 0) + 1,
      },
    }));
  const checkAnswer = () => {
    if (!choice || checked) return;
    setChecked(true);
    setAttemptCount((count) => count + 1);
    if (choice === currentQuestion.answer)
      setCorrectCount((count) => count + 1);
    recordResult(
      topicForQuestion(currentQuestion),
      choice === currentQuestion.answer,
    );
    if (selectedGame === "Millionaire" && choice !== currentQuestion.answer)
      setGameComplete(true);
  };
  const bombQuestion = bombSet[questionIndex];
  const checkBombAnswer = () => {
    if (!choice || checked || !bombQuestion) return;
    setChecked(true);
    setAttemptCount((count) => count + 1);
    const isCorrect = choice === bombQuestion.answer;
    if (isCorrect) setCorrectCount((count) => count + 1);
    recordResult(
      topicForQuestion(bombQuestion),
      isCorrect,
    );
    if (!isCorrect) setBombExploded(true);
  };
  const nextBomb = (timedOut = false) => {
    if (timedOut) {
      setBombExploded(true);
      setChoice(null);
      setChecked(false);
      return;
    }
    if (questionIndex === 9) {
      setBombComplete(true);
      setChoice(null);
      setChecked(false);
      return;
    }
    next();
  };
  const explodeBomb = () => {
    setBombExploded(true);
    setChoice(null);
    setChecked(false);
  };
  useEffect(() => {
    if (selectedGame === "Jeopardy" && jeopardyUsed.length === 25)
      setGameComplete(true);
    if (selectedGame === "Millionaire" && questionIndex === 14 && checked)
      setGameComplete(true);
  }, [selectedGame, jeopardyUsed.length, questionIndex, checked]);
  useEffect(() => {
    const saved = window.localStorage.getItem("chemistry-game-stats");
    if (saved) setGameStats(JSON.parse(saved));
    setStatsLoaded(true);
  }, []);
  useEffect(() => {
    if (statsLoaded)
      window.localStorage.setItem(
        "chemistry-game-stats",
        JSON.stringify(gameStats),
      );
  }, [gameStats, statsLoaded]);

  return (
    <main style={styles.page}>
      <style>{`*{box-sizing:border-box}.chem-game-card:hover{transform:translateY(-5px);box-shadow:0 18px 34px rgba(13,148,136,.25)!important}.chem-game-card:focus-visible{outline:4px solid #99f6e4;outline-offset:3px}`}</style>
      {!selectedGame ? (
        <section style={styles.shell}>
          <header style={styles.header}>
            <h1 style={styles.title}>Chemistry Study Guide</h1>
          </header>
          <div style={styles.unitRow}>
            {["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5", "Unit 6"].map((unit) => (
              <button
                key={unit}
                onClick={() => { setSelectedUnit(unit); setCheatSheetOpen(false); setCalculatorOpen(false); }}
                style={{
                  ...styles.unitButton,
                  ...(selectedUnit === unit ? styles.activeUnit : {}),
                }}
              >
                {unit}
              </button>
            ))}
          </div>
          <div style={styles.unitStatus}>
            {selectedUnit} ·{" "}
            {questions.length
              ? `${questions.length} questions ready`
              : "Study guide coming soon"}
          </div>
          <section style={styles.grid}>
            {(selectedUnit === "Unit 5"
              ? games
              : games.filter(([name]) => name !== "Orbital Lab")
            ).map(([name, detail]) => {
              const darkTealGame = [
                "Millionaire",
                "Jeopardy",
                "Bomb",
                "Snake",
              ].includes(name);
              return (
              <button
                className="chem-game-card"
                key={name}
                onClick={() => openGame(name)}
                style={{
                  ...styles.card,
                  ...(darkTealGame ? styles.darkCard : {}),
                }}
              >
                <span
                  style={{
                    ...styles.cardTitle,
                    ...(darkTealGame ? styles.lightText : {}),
                  }}
                >
                  {name}
                </span>
                <span
                  style={{
                    ...styles.cardDetail,
                    ...(darkTealGame ? styles.darkCardDetail : {}),
                  }}
                >
                  {detail}
                </span>
              </button>
              );
            })}
          </section>
        </section>
      ) : (
        <section style={styles.gameScreen}>
          <button
            style={styles.backArrow}
            onClick={() => setSelectedGame(null)}
          >
            ← Back to Home
          </button>
          <section style={styles.modal}>
            <div style={styles.modalLabel}>
              {selectedUnit.toUpperCase()} · {selectedGame.toUpperCase()}
            </div>
            {(gameComplete || bombComplete || bombExploded) && (
              <div style={styles.gameEndOverlay}>
                <div style={styles.endCard}>
                  <GameEndScreen
                    game={selectedGame || "Game"}
                    correct={correctCount}
                    attempts={attemptCount}
                    exploded={bombExploded}
                    onPlayAgain={() => openGame(selectedGame!)}
                    onBackHome={() => setSelectedGame(null)}
                  />
                </div>
              </div>
            )}
            {selectedGame === "Orbital Lab" && <OrbitalLab />}
            {selectedGame === "Jeopardy" && questions.length ? (
              <>
                {jeopardyQuestion === null ? (
                  <>
                    <h2 style={styles.gameName}>JEOPARDY</h2>
                    <p style={styles.modalText}>Pick a point value.</p>
                    <div style={styles.jeopardyBoard}>
                      {activeJeopardyBoard.map((category) => (
                        <div key={category.title} style={styles.jeopardyColumn}>
                          <div style={styles.jeopardyHeader}>
                            {category.title}
                          </div>
                          {category.indexes.map((index, row) => {
                            const value = (row + 1) * 100;
                            const used = jeopardyUsed.includes(index);
                            return (
                              <button
                                key={index}
                                disabled={used}
                                onClick={() => {
                                  setJeopardyQuestion(index);
                                  setChoice(null);
                                  setChecked(false);
                                }}
                                style={{
                                  ...styles.jeopardyTile,
                                  ...(used ? styles.jeopardyUsed : {}),
                                }}
                              >
                                {used ? "" : `$${value}`}
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  (() => {
                    const question =
                      jeopardySet[jeopardyQuestion] ||
                      questions[jeopardyQuestion];
                    return (
                      <>
                        <button
                          style={styles.boardArrow}
                          onClick={() => {
                            setJeopardyQuestion(null);
                            setChoice(null);
                            setChecked(false);
                          }}
                        >
                          ← Back to Board
                        </button>
                        <div style={styles.gameName}>JEOPARDY</div>
                        <div style={styles.progress}>
                          $
                          {((activeJeopardyBoard
                            .flatMap((c) => c.indexes)
                            .indexOf(jeopardyQuestion) %
                            5) +
                            1) *
                            100}{" "}
                          QUESTION
                        </div>
                        <h2 style={styles.question}>{question.question}</h2>
                        <div style={styles.choices}>
                          {question.choices.map((answer) => (
                            <button
                              key={answer}
                              onClick={() => !checked && setChoice(answer)}
                              style={{
                                ...styles.choice,
                                ...(choice === answer
                                  ? checked
                                    ? answer === question.answer
                                      ? styles.correct
                                      : styles.incorrect
                                    : styles.selected
                                  : {}),
                              }}
                            >
                              {answer}
                            </button>
                          ))}
                          {checked && choice && (
                            <p style={styles.explanation}>
                              {choice === question.answer ? (
                                "Correct! "
                              ) : (
                                <>
                                  Not quite.{" "}
                                  <strong>
                                    Correct answer: {question.answer}.
                                  </strong>{" "}
                                </>
                              )}
                              {question.explanation}
                            </p>
                          )}
                          {!checked ? (
                            <button
                              disabled={!choice}
                              style={{
                                ...styles.closeButton,
                                opacity: choice ? 1 : 0.45,
                                cursor: choice ? "pointer" : "default",
                              }}
                              onClick={() => {
                                if (!choice) return;
                                setChecked(true);
                                setAttemptCount((count) => count + 1);
                                if (choice === question.answer)
                                  setCorrectCount((count) => count + 1);
                                recordResult(
                                  topicForQuestion(question),
                                  choice === question.answer,
                                );
                              }}
                            >
                              Check Answer
                            </button>
                          ) : (
                            <button
                              style={styles.closeButton}
                              onClick={() => {
                                setJeopardyUsed((used) => [
                                  ...used,
                                  jeopardyQuestion,
                                ]);
                                setJeopardyQuestion(null);
                              }}
                            >
                              Back to Board
                            </button>
                          )}
                        </div>
                      </>
                    );
                  })()
                )}
              </>
            ) : selectedGame === "Snake" && questions.length ? (
              <SnakeGame questions={makeGameSet(questions)} />
            ) : selectedGame === "Match" && questions.length ? (
              <MatchGame
                key={matchRound}
                questions={makeGameSet(questions)}
                onComplete={(matches, tries) => {
                  setCorrectCount(matches);
                  setAttemptCount(tries);
                  setGameComplete(true);
                }}
              />
            ) : selectedGame === "Millionaire" && questions.length ? (
              <MillionaireGame
                question={currentQuestion!}
                questionIndex={questionIndex}
                choice={choice}
                checked={checked}
                onChoose={setChoice}
                onCheck={checkAnswer}
                onNext={() =>
                  questionIndex === millionaireLevels.length - 1
                    ? (setQuestionIndex(0), setChoice(null), setChecked(false))
                    : next()
                }
              />
            ) : selectedGame === "Bomb" && bombQuestion ? (
              bombComplete ? (
                <>
                  <h2 style={styles.modalTitle}>Bomb round complete!</h2>
                  <p style={styles.modalText}>
                    You made it through all 10 questions.
                  </p>
                  <button
                    style={styles.closeButton}
                    onClick={() => {
                      setBombSet(makeBombSet(questions));
                      setBombComplete(false);
                      setQuestionIndex(0);
                      setChoice(null);
                      setChecked(false);
                    }}
                  >
                    New 10 questions
                  </button>
                </>
              ) : (
                <BombGame
                  question={bombQuestion}
                  questionIndex={questionIndex}
                  choice={choice}
                  checked={checked}
                  onChoose={setChoice}
                  onCheck={checkBombAnswer}
                  onNext={nextBomb}
                  onExpire={nextBomb}
                />
              )
            ) : selectedGame === "My Stats" ? (
              <StatsScreen
                stats={gameStats}
                resetOpen={resetStatsOpen}
                resetCode={resetCode}
                onCodeChange={setResetCode}
                onOpenReset={() => setResetStatsOpen(true)}
                onCancelReset={() => {
                  setResetStatsOpen(false);
                  setResetCode("");
                }}
                onReset={() => {
                  setGameStats({});
                  setResetStatsOpen(false);
                  setResetCode("");
                }}
              />
            ) : questions.length === 0 ? (
              <>
                <h2 style={styles.modalTitle}>Ready for your study guide</h2>
                <p style={styles.modalText}>
                  There aren’t any questions in this unit yet.
                </p>
              </>
            ) : playable && currentQuestion ? (
              <>
                <div style={styles.gameName}>{selectedGame}</div>
                <div style={styles.progress}>
                  Question {questionIndex + 1} of {questions.length}
                </div>
                <h2 style={styles.question}>{currentQuestion.question}</h2>
                {selectedGame === "Flashcards" ? (
                  <>
                    <button
                      style={styles.flipButton}
                      onClick={() => setShowAnswer(!showAnswer)}
                    >
                      {showAnswer ? currentQuestion.answer : "Tap to flip"}
                    </button>
                    {showAnswer && (
                      <>
                        <p style={styles.explanation}>
                          {currentQuestion.explanation}
                        </p>
                        <button style={styles.closeButton} onClick={next}>
                          Next question
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div style={styles.choices}>
                    {currentQuestion.choices.map((answer) => (
                      <button
                        key={answer}
                        onClick={() => !checked && setChoice(answer)}
                        style={{
                          ...styles.choice,
                          ...(choice === answer
                            ? checked
                              ? answer === currentQuestion.answer
                                ? styles.correct
                                : styles.incorrect
                              : styles.selected
                            : {}),
                        }}
                      >
                        {answer}
                      </button>
                    ))}
                    {checked && choice && (
                      <p style={styles.explanation}>
                        {choice === currentQuestion.answer ? (
                          "Correct! "
                        ) : (
                          <>
                            Not quite.{" "}
                            <strong>
                              Correct answer: {currentQuestion.answer}.
                            </strong>{" "}
                          </>
                        )}
                        {currentQuestion.explanation}
                      </p>
                    )}
                    {!checked ? (
                      <button
                        disabled={!choice}
                        style={{
                          ...styles.closeButton,
                          opacity: choice ? 1 : 0.45,
                          cursor: choice ? "pointer" : "default",
                        }}
                        onClick={checkAnswer}
                      >
                        Check Answer
                      </button>
                    ) : (
                      <button style={styles.closeButton} onClick={next}>
                        Next question
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : null}
          </section>
        </section>
      )}
      {selectedUnit === "Unit 5" && (
        <>
          <EquationCheatSheet
            open={cheatSheetOpen}
            onToggle={() => setCheatSheetOpen((open) => !open)}
          />
          <ChemistryCalculator
            open={calculatorOpen}
            onToggle={() => setCalculatorOpen((open) => !open)}
          />
        </>
      )}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "48px 20px 64px",
    color: "#123b3a",
    fontFamily: '"Montserrat", sans-serif',
    background:
      "radial-gradient(circle at top left,#ccfbf1 0%,transparent 34%),linear-gradient(135deg,#ecfdf5 0%,#ecfeff 48%,#d1fae5 100%)",
  },
  shell: { width: "min(1080px,100%)", margin: "0 auto" },
  header: { textAlign: "center", margin: "8px auto 28px" },
  title: {
    margin: 0,
    fontFamily: "Londrina Solid, Impact, sans-serif",
    fontWeight: 900,
    fontSize: "clamp(42px,7vw,72px)",
    lineHeight: 1,
    letterSpacing: "1px",
    color: "#115e59",
  },
  unitRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    margin: "0 auto 10px",
  },
  unitButton: {
    padding: "10px 20px",
    borderRadius: 999,
    border: "2px solid #99f6e4",
    background: "rgba(255,255,255,.78)",
    color: "#0f766e",
    fontWeight: 800,
    fontSize: 14,
    cursor: "pointer",
  },
  activeUnit: { background: "#0f766e", borderColor: "#0f766e", color: "#fff" },
  unitStatus: {
    textAlign: "center",
    color: "#40706c",
    fontSize: 13,
    fontWeight: 700,
    minHeight: 30,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,minmax(0,1fr))",
    gap: 16,
  },
  card: {
    minHeight: 175,
    padding: 24,
    border: 0,
    borderRadius: 22,
    textAlign: "left",
    cursor: "pointer",
    transition: "transform .2s ease,box-shadow .2s ease",
    background: "linear-gradient(140deg,#fff 0%,#f0fdfa 100%)",
    boxShadow: "0 7px 18px rgba(13,148,136,.13)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "end",
  },
  darkCard: {
    background: "linear-gradient(140deg,#115e59 0%,#0f766e 56%,#0891b2 100%)",
    boxShadow: "0 7px 18px rgba(15,118,110,.25)",
  },
  cardTitle: {
    color: "#0f766e",
    fontSize: 22,
    fontWeight: 900,
    letterSpacing: "-.5px",
  },
  lightText: { color: "#fff" },
  cardDetail: { marginTop: 5, color: "#5f7f7c", fontSize: 14, fontWeight: 600 },
  darkCardDetail: { color: "#bff7ef" },
  gameScreen: {
    width: "min(1120px,100%)",
    margin: "0 auto",
    minHeight: "calc(100vh - 112px)",
  },
  backArrow: {
    border: 0,
    background: "transparent",
    color: "#0f766e",
    fontSize: 18,
    fontWeight: 900,
    cursor: "pointer",
    padding: "4px 0 30px",
  },
  modal: {
    width: "min(1000px,100%)",
    margin: "0 auto",
    background: "#fff",
    padding: "42px 48px",
    borderRadius: 30,
    textAlign: "center",
    boxShadow: "0 20px 50px rgba(4,47,46,.16)",
  },
  boardArrow: {
    display: "block",
    border: 0,
    background: "transparent",
    color: "#0f766e",
    fontFamily: "Montserrat,sans-serif",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
    padding: 0,
    margin: "-14px 0 18px",
  },
  modalLabel: {
    color: "#0f766e",
    fontSize: 14,
    letterSpacing: 1.5,
    fontWeight: 900,
  },
  modalTitle: { margin: "12px 0", color: "#115e59", fontSize: 32 },
  modalText: {
    color: "#557673",
    lineHeight: 1.6,
    margin: "0 0 24px",
    fontSize: 17,
  },
  gameName: {
    fontFamily: "Londrina Solid,Impact,sans-serif",
    color: "#115e59",
    fontSize: 28,
    letterSpacing: 1,
  },
  progress: { color: "#0f766e", fontWeight: 800, fontSize: 15, marginTop: 14 },
  question: {
    color: "#163f3b",
    fontSize: 30,
    lineHeight: 1.28,
    margin: "20px 0 26px",
  },
  choices: { display: "grid", gap: 12, textAlign: "left" },
  matchProgress: { color: "#0f766e", fontWeight: 850, margin: "-10px 0 16px" },
  matchGrid: { display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 10 },
  matchCard: { minHeight: 118, border: 0, borderRadius: 14, padding: "11px", background: "linear-gradient(145deg,#115e59,#0f766e)", color: "#d1fae5", cursor: "pointer", display: "grid", alignContent: "center", gap: 7, textAlign: "left", fontFamily: "Montserrat,sans-serif", fontSize: 13, fontWeight: 750, lineHeight: 1.3 },
  matchCardOpen: { background: "#f0fdfa", color: "#163f3b", border: "2px solid #99f6e4" },
  matchCardMatched: { background: "#dcfce7", color: "#166534", border: "2px solid #22c55e", cursor: "default" },
  matchBack: { display: "grid", placeItems: "center", fontFamily: "Londrina Solid,Impact,sans-serif", fontSize: 42, textAlign: "center" },
  matchSide: { color: "#0f766e", fontSize: 10, letterSpacing: 1.1, fontWeight: 900 },
  choice: {
    cursor: "pointer",
    background: "#f0fdfa",
    border: "2px solid #ccfbf1",
    borderRadius: 14,
    padding: "15px 17px",
    color: "#17433f",
    fontSize: 18,
    textAlign: "left",
    fontWeight: 650,
  },
  selected: { background: "#ccfbf1", borderColor: "#0f766e" },
  correct: { background: "#dcfce7", borderColor: "#22c55e" },
  incorrect: { background: "#fee2e2", borderColor: "#f87171" },
  flipButton: {
    width: "100%",
    border: "2px solid #99f6e4",
    background: "#f0fdfa",
    borderRadius: 16,
    padding: "26px 18px",
    color: "#115e59",
    fontSize: 22,
    fontWeight: 800,
    cursor: "pointer",
  },
  explanation: {
    color: "#35645f",
    lineHeight: 1.55,
    fontSize: 16,
    margin: "16px 0",
  },
  closeButton: {
    border: 0,
    borderRadius: 14,
    background: "linear-gradient(135deg,#0f766e,#0891b2)",
    color: "#fff",
    padding: "14px 22px",
    fontSize: 17,
    fontWeight: 800,
    cursor: "pointer",
    marginTop: 20,
  },
  statsNumber: {
    fontFamily: "Londrina Solid,Impact,sans-serif",
    fontSize: 76,
    color: "#0f766e",
    lineHeight: 1,
  },
  jeopardyBoard: {
    display: "grid",
    gridTemplateColumns: "repeat(5,minmax(120px,1fr))",
    gap: 8,
    overflowX: "auto",
    paddingBottom: 5,
  },
  jeopardyColumn: { display: "grid", gap: 8, minWidth: 120 },
  jeopardyHeader: {
    background: "#115e59",
    color: "#fff",
    borderRadius: 10,
    padding: "14px 6px",
    fontWeight: 900,
    fontSize: 13,
  },
  jeopardyTile: {
    border: 0,
    borderRadius: 10,
    minHeight: 66,
    cursor: "pointer",
    fontFamily: "Londrina Solid,Impact,sans-serif",
    fontSize: 31,
    color: "#fef08a",
    background: "#0f766e",
  },
  jeopardyUsed: { background: "#e6fffb", color: "#d1faf4", cursor: "default" },
  millionaireLayout: {
    display: "grid",
    gridTemplateColumns: "230px minmax(0,1fr)",
    gap: 36,
    alignItems: "center",
    textAlign: "left",
  },
  moneyLadder: {
    background: "linear-gradient(160deg,#064e3b,#115e59 55%,#0f766e)",
    borderRadius: 22,
    padding: "15px 14px",
    display: "grid",
    gap: 3,
    boxShadow: "inset 0 1px rgba(255,255,255,.18)",
  },
  moneyStep: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 9,
    padding: "5px 12px",
    color: "#d1fae5",
    fontSize: 15,
    fontWeight: 800,
  },
  moneyMilestone: { color: "#fef08a" },
  moneyStepActive: {
    background: "#2dd4bf",
    color: "#073b35",
    boxShadow: "0 4px 12px rgba(0,0,0,.18)",
  },
  millionaireQuestion: { minWidth: 0 },
  bombTimer: {
    fontFamily: "Londrina Solid,Impact,sans-serif",
    margin: "12px auto 0",
    width: 82,
    height: 82,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    background: "#dc2626",
    color: "#fff",
    fontSize: 32,
    boxShadow: "0 7px 16px rgba(220,38,38,.28)",
  },
  snakeScore: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "linear-gradient(135deg,#166534,#22c55e)",
    color: "#dcfce7",
    padding: "12px 20px",
    borderRadius: 12,
    margin: "14px 0 16px",
    fontSize: 14,
  },
  snakeBoard: {
    display: "grid",
    gridTemplateColumns: "repeat(20,1fr)",
    gap: 1,
    background: "#166534",
    padding: 4,
    borderRadius: 8,
    aspectRatio: "1",
    width: "min(400px,100%)",
    margin: "0 auto",
  },
  snakeCell: { background: "#dcfce7", borderRadius: 2, aspectRatio: "1" },
  snakeHead: { background: "#166534", borderRadius: 4 },
  snakeBody: { background: "#22c55e" },
  snakeFood: { background: "#ef4444", borderRadius: "50%" },
  snakeControls: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 8,
    maxWidth: 200,
    margin: "16px auto 0",
  },
  snakeDirection: {
    background: "#166534",
    borderRadius: 8,
    display: "grid",
    placeItems: "center",
    color: "#fff",
    fontSize: 14,
    fontWeight: 800,
  },
  snakeHint: { textAlign: "center", color: "#557673", fontSize: 12, marginTop: 8 },
  snakeQuestion: { background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,.15)" },
  snakeTag: {
    display: "inline-block",
    background: "#22c55e",
    color: "#fff",
    padding: "4px 12px",
    borderRadius: 12,
    fontSize: 13,
  },
  orbitalLabGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: 22,
    textAlign: "center",
    padding: "8px 0 20px",
  },
  orbitalHeading: {
    fontFamily: "Londrina Solid,Impact,sans-serif",
    fontSize: 25,
    color: "#115e59",
    margin: "8px 0 12px",
  },
  lewisBox: {
    position: "relative",
    margin: "0 auto",
    width: 132,
    height: 108,
    border: "3px solid #115e59",
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    background: "#f0fdfa",
  },
  lewisSymbol: {
    fontFamily: "Londrina Solid,Impact,sans-serif",
    fontSize: 52,
    color: "#163f3b",
  },
  lewisDot: {
    position: "absolute",
    fontSize: 27,
    lineHeight: 1,
    color: "#115e59",
    fontStyle: "normal",
    fontWeight: 900,
  },
  dottopleft: { top: 2, left: 38 },
  dottopright: { top: 2, right: 38 },
  dotrighttop: { top: 29, right: 8 },
  dotrightbottom: { bottom: 29, right: 8 },
  dotbottomright: { bottom: 1, right: 38 },
  dotbottomleft: { bottom: 1, left: 38 },
  dotleftbottom: { bottom: 29, left: 8 },
  dotlefttop: { top: 29, left: 8 },
  orbitalHint: {
    margin: "10px 0 0",
    color: "#557673",
    fontSize: 14,
    fontWeight: 650,
  },
  arrowPicker: {
    display: "flex",
    justifyContent: "center",
    gap: 8,
    margin: "0 0 14px",
  },
  arrowButton: {
    border: "2px solid #99f6e4",
    background: "#fff",
    color: "#115e59",
    borderRadius: 10,
    padding: "8px 12px",
    fontWeight: 900,
    cursor: "pointer",
  },
  arrowActive: { background: "#ccfbf1", borderColor: "#0f766e" },
  orbitalBoxes: { display: "flex", justifyContent: "center", gap: 10 },
  orbitalBox: {
    width: 66,
    height: 54,
    border: "3px solid #115e59",
    borderRadius: 8,
    background: "#fff",
    color: "#163f3b",
    fontSize: 28,
    fontWeight: 900,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  orbitalLabels: {
    display: "flex",
    justifyContent: "center",
    gap: 52,
    color: "#557673",
    fontWeight: 800,
    marginTop: 5,
  },
  labQuestions: {
    textAlign: "left",
    borderTop: "2px solid #ccfbf1",
    paddingTop: 20,
  },
  labLabel: { fontWeight: 850, color: "#163f3b", margin: "18px 0 8px" },
  labAnswer: { margin: "0", color: "#557673", fontSize: 15 },
  labOptions: { display: "flex", gap: 8, flexWrap: "wrap" },
  labOption: {
    border: "2px solid #99f6e4",
    background: "#fff",
    borderRadius: 10,
    padding: "9px 12px",
    color: "#17433f",
    fontWeight: 750,
    cursor: "pointer",
  },
  labResults: {
    display: "grid",
    gap: 8,
    margin: "20px 0 0",
    padding: 16,
    border: "2px solid #ccfbf1",
    borderRadius: 16,
    textAlign: "left",
  },
  resultGood: { color: "#15803d", fontSize: 17 },
  resultNeedsWork: { color: "#b45309", fontSize: 17 },
  resultRowGood: {
    display: "flex",
    gap: 8,
    color: "#15803d",
    fontSize: 15,
  },
  resultRowBad: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    color: "#b91c1c",
    fontSize: 15,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
    gap: 12,
    textAlign: "left",
  },
  statCard: {
    padding: 16,
    borderRadius: 16,
    border: "2px solid #ccfbf1",
    background: "#f0fdfa",
    display: "grid",
    gap: 6,
    color: "#115e59",
  },
  statPercent: {
    fontFamily: "Londrina Solid,Impact,sans-serif",
    fontSize: 36,
    lineHeight: 1,
    color: "#0f766e",
  },
  resetStatsButton: {
    marginTop: 24,
    border: "2px solid #0f766e",
    borderRadius: 12,
    padding: "11px 16px",
    background: "#fff",
    color: "#0f766e",
    fontWeight: 900,
    fontSize: 15,
    cursor: "pointer",
  },
  resetBubble: {
    margin: "24px auto 0",
    padding: 22,
    borderRadius: 18,
    background: "#ecfdf5",
    border: "2px solid #99f6e4",
    maxWidth: 440,
  },
  resetTitle: {
    margin: "0 0 8px",
    fontFamily: "Londrina Solid,Impact,sans-serif",
    fontSize: 28,
    color: "#115e59",
  },
  resetInput: {
    width: "100%",
    border: "2px solid #99f6e4",
    borderRadius: 10,
    padding: "12px 14px",
    fontFamily: "Montserrat,sans-serif",
    fontSize: 16,
    outline: "none",
  },
  resetActions: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    marginTop: 14,
  },
  cancelButton: {
    border: 0,
    borderRadius: 10,
    padding: "11px 14px",
    background: "#d1fae5",
    color: "#115e59",
    fontWeight: 800,
    cursor: "pointer",
  },
  resetConfirmButton: {
    border: 0,
    borderRadius: 10,
    padding: "11px 14px",
    background: "#dc2626",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },
  worksheet: {
    textAlign: "left",
    padding: "10px 0 22px",
    borderBottom: "2px solid #ccfbf1",
  },
  worksheetTop: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 28,
    alignItems: "start",
  },
  answerLine: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    margin: "13px 0",
    fontSize: 20,
    color: "#163f3b",
    flexWrap: "wrap",
  },
  configBubbles: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    flexWrap: "wrap",
  },
  configPiece: {
    display: "inline-flex",
    alignItems: "flex-start",
    gap: 4,
    fontWeight: 800,
  },
  baseBubble: {
    width: 60,
    height: 42,
    border: "2px solid #99f6e4",
    borderRadius: 9,
    background: "#f0fdfa",
    padding: "2px 5px",
    textAlign: "center",
    fontFamily: "Montserrat,sans-serif",
    fontSize: 18,
    fontWeight: 800,
    color: "#163f3b",
    outline: "none",
  },
  exponentBubble: {
    width: 36,
    height: 27,
    border: "2px solid #99f6e4",
    borderRadius: 8,
    background: "#f0fdfa",
    padding: "1px 3px",
    textAlign: "center",
    fontFamily: "Montserrat,sans-serif",
    fontSize: 16,
    fontWeight: 800,
    color: "#163f3b",
    outline: "none",
    transform: "translateY(-11px)",
  },
  coreBubble: { fontWeight: 850 },
  coreInput: {
    width: 44,
    height: 38,
    border: "2px solid #99f6e4",
    borderRadius: 9,
    background: "#f0fdfa",
    padding: "1px 3px",
    textAlign: "center",
    fontFamily: "Montserrat,sans-serif",
    fontSize: 17,
    fontWeight: 800,
    color: "#163f3b",
    outline: "none",
  },
  orbitalInput: {
    minWidth: 260,
    flex: "1 1 280px",
    border: 0,
    borderBottom: "2px solid #0f766e",
    background: "transparent",
    padding: "6px 4px",
    fontFamily: "Montserrat,sans-serif",
    fontSize: 17,
    color: "#163f3b",
    outline: "none",
  },
  notationPaper: {
    textAlign: "left",
    padding: "8px 0 22px",
    borderBottom: "2px solid #ccfbf1",
  },
  notationRow: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    margin: "13px 0",
    fontSize: 20,
    color: "#163f3b",
  },
  orbitalRail: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    flexWrap: "wrap",
    paddingTop: 3,
  },
  orbitalRailGroup: {
    display: "flex",
    gap: 6,
    position: "relative",
    paddingBottom: 24,
  },
  orbitalLine: {
    width: 48,
    height: 45,
    borderBottom: "3px solid #163f3b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  },
  orbitalUnderLabel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    textAlign: "center",
    color: "#163f3b",
    fontWeight: 850,
    fontSize: 13,
  },
  arrowGlyph: {
    border: 0,
    padding: 0,
    background: "transparent",
    color: "#cbd5d3",
    fontSize: 23,
    fontWeight: 900,
    cursor: "pointer",
    lineHeight: 1,
  },
  arrowBlack: { color: "#111827" },
  orbitalSequence: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  orbitalGroup: {
    display: "flex",
    gap: 5,
    alignItems: "flex-start",
    position: "relative",
    paddingBottom: 24,
  },
  activeOrbitalGroup: {
    border: "2px dashed #2dd4bf",
    borderRadius: 10,
    padding: "5px 7px 29px",
    marginTop: -5,
  },
  orbitalRest: {
    display: "flex",
    gap: 11,
    alignItems: "flex-start",
    position: "relative",
    color: "#557673",
    fontSize: 28,
    paddingBottom: 24,
  },
  dotTopA: { top: 0, left: "42%" },
  dotTopB: { top: 0, left: "58%" },
  dotRightA: { top: "37%", right: 1 },
  dotRightB: { top: "58%", right: 1 },
  dotBottomA: { bottom: 0, left: "42%" },
  dotBottomB: { bottom: 0, left: "58%" },
  dotLeftA: { top: "48%", left: 1 },
  dotLeftB: { top: "64%", left: 1 },
  blackArrow: {
    color: "#163f3b",
    fontSize: 28,
    fontWeight: 900,
    lineHeight: 1,
  },
  grayArrow: {
    border: 0,
    background: "transparent",
    padding: 0,
    color: "#b7c8c6",
    fontSize: 28,
    fontWeight: 900,
    lineHeight: 1,
    cursor: "pointer",
  },
  gameEndOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 20,
    display: "grid",
    placeItems: "center",
    padding: 20,
    background: "rgba(4,47,46,.38)",
  },
  endCard: {
    width: "min(480px,100%)",
    padding: "42px 32px",
    borderRadius: 28,
    background: "#fff",
    textAlign: "center",
    boxShadow: "0 24px 64px rgba(4,47,46,.32)",
  },
  endActions: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  cheatDock: {
    position: "fixed",
    right: 20,
    top: 20,
    zIndex: 31,
    display: "grid",
    justifyItems: "end",
    gap: 10,
  },
  calculatorDock: {
    position: "fixed",
    right: 20,
    top: 72,
    zIndex: 31,
    display: "grid",
    justifyItems: "end",
    gap: 10,
  },
  cheatButton: {
    border: 0,
    borderRadius: 999,
    padding: "12px 17px",
    background: "linear-gradient(135deg,#0f766e,#0891b2)",
    color: "#fff",
    fontFamily: "Montserrat,sans-serif",
    fontWeight: 850,
    fontSize: 14,
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(15,118,110,.28)",
  },
  cheatSheet: {
    width: "min(470px,calc(100vw - 40px))",
    minWidth: 285,
    minHeight: 220,
    padding: 16,
    borderRadius: 18,
    background: "#fff",
    border: "2px solid #99f6e4",
    boxShadow: "0 18px 48px rgba(4,47,46,.26)",
    color: "#163f3b",
    resize: "both",
    overflow: "auto",
  },
  cheatTitle: {
    display: "block",
    fontFamily: "Londrina Solid,Impact,sans-serif",
    fontSize: 24,
    color: "#115e59",
    marginBottom: 10,
  },
  cheatHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 8,
    padding: "7px 0",
    borderBottom: "2px solid #ccfbf1",
    color: "#0f766e",
    fontWeight: 850,
    fontSize: 12,
  },
  cheatRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 8,
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #d9f5ef",
    fontSize: 13,
    lineHeight: 1.25,
  },
  calculator: {
    width: "min(330px,calc(100vw - 40px))",
    minWidth: 285,
    minHeight: 350,
    padding: 16,
    borderRadius: 18,
    background: "#fff",
    border: "2px solid #99f6e4",
    boxShadow: "0 18px 48px rgba(4,47,46,.26)",
    color: "#163f3b",
    resize: "both",
    overflow: "auto",
  },
  panelDragHandle: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    touchAction: "none",
    cursor: "grab",
    userSelect: "none",
    paddingLeft: 30,
  },
  panelClose: {
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
    border: 0,
    background: "transparent",
    color: "#0f766e",
    fontSize: 28,
    lineHeight: 1,
    fontWeight: 900,
    cursor: "pointer",
    padding: "2px 5px",
  },
  dragHint: {
    flex: "0 0 auto",
    color: "#0f766e",
    border: "1px solid #99f6e4",
    borderRadius: 999,
    padding: "4px 8px",
    fontSize: 11,
    fontWeight: 850,
  },
  calculatorTitle: {
    display: "block",
    fontFamily: "Londrina Solid,Impact,sans-serif",
    fontSize: 24,
    color: "#115e59",
    marginBottom: 10,
  },
  calculatorDisplay: {
    minHeight: 66,
    borderRadius: 12,
    padding: "10px 12px",
    background: "#ecfdf5",
    border: "2px solid #ccfbf1",
    color: "#134e4a",
    fontFamily: "ui-monospace,SFMono-Regular,Menlo,monospace",
    fontSize: 18,
    fontWeight: 800,
    overflowWrap: "anywhere",
    display: "grid",
    alignContent: "center",
    gap: 4,
    marginBottom: 10,
  },
  calculatorKeys: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 7 },
  calcKey: {
    border: "2px solid #ccfbf1",
    borderRadius: 10,
    padding: "11px 4px",
    background: "#f0fdfa",
    color: "#115e59",
    fontSize: 17,
    fontWeight: 900,
    cursor: "pointer",
  },
  calcEquals: {
    border: 0,
    borderRadius: 10,
    padding: "11px 4px",
    background: "linear-gradient(135deg,#0f766e,#0891b2)",
    color: "#fff",
    fontSize: 17,
    fontWeight: 900,
    cursor: "pointer",
  },
  calcSpecial: {
    gridColumn: "span 2",
    border: "2px solid #99f6e4",
    borderRadius: 10,
    padding: "9px 5px",
    background: "#ccfbf1",
    color: "#115e59",
    fontSize: 12,
    fontWeight: 900,
    cursor: "pointer",
  },
  calcWideKey: {
    gridColumn: "span 2",
    border: "2px solid #ccfbf1",
    borderRadius: 10,
    padding: "9px 5px",
    background: "#fff",
    color: "#0f766e",
    fontSize: 13,
    fontWeight: 850,
    cursor: "pointer",
  },
};
