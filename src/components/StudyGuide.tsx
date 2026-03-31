

import { useState, useCallback, useEffect, useRef } from 'react';

// Unit definitions
const units = [
  { key: 'All', label: 'All Units' },
  { key: 'Unit 9', label: 'Unit 9: Cell Structure & Transport' },
  { key: 'Unit 10', label: 'Unit 10: Photosynthesis & Calvin Cycle' },
  { key: 'Unit 11', label: 'Unit 11: Introduction to Genetics' },
  { key: 'Unit 12', label: 'Unit 12: DNA & Protein Synthesis' },
  { key: 'Roots', label: 'Word Roots' },
];

// Theme colors per unit
const unitThemes: {[key: string]: {primary: string, primaryLight: string, primaryDark: string, gradient: string, bgGradient: string, accent: string, accentLight: string, emojis: string[], shadow: string}} = {
  'All': {
    primary: '#ec4899', primaryLight: '#f472b6', primaryDark: '#db2777',
    gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
    bgGradient: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fff1f2 100%)',
    accent: '#ec4899', accentLight: '#fce7f3',
    emojis: ['📚', '🧬', '🔬', '🌱', '🧫', '☀️'],
    shadow: 'rgba(236,72,153,0.3)',
  },
  'Unit 9': {
    primary: '#8b5cf6', primaryLight: '#a78bfa', primaryDark: '#7c3aed',
    gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    bgGradient: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #f3e8ff 100%)',
    accent: '#8b5cf6', accentLight: '#ede9fe',
    emojis: ['🔬', '🧫', '🦠', '🫧'],
    shadow: 'rgba(139,92,246,0.3)',
  },
  'Unit 10': {
    primary: '#22c55e', primaryLight: '#4ade80', primaryDark: '#16a34a',
    gradient: 'linear-gradient(135deg, #22c55e, #4ade80)',
    bgGradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #ecfdf5 100%)',
    accent: '#22c55e', accentLight: '#dcfce7',
    emojis: ['🌱', '🌿', '☀️', '🍃', '🌻'],
    shadow: 'rgba(34,197,94,0.3)',
  },
  'Unit 11': {
    primary: '#3b82f6', primaryLight: '#60a5fa', primaryDark: '#2563eb',
    gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    bgGradient: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #e0f2fe 100%)',
    accent: '#3b82f6', accentLight: '#dbeafe',
    emojis: ['🧑‍🧑‍🧒‍🧒', '🧬', '🫛', '🧑‍🧑‍🧒‍🧒'],
    shadow: 'rgba(59,130,246,0.3)',
  },
  'Unit 12': {
    primary: '#ef4444', primaryLight: '#f87171', primaryDark: '#dc2626',
    gradient: 'linear-gradient(135deg, #ef4444, #f87171)',
    bgGradient: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 50%, #fecaca 100%)',
    accent: '#ef4444', accentLight: '#fee2e2',
    emojis: ['🧬', '🔬', '🧪', '🔗'],
    shadow: 'rgba(239,68,68,0.3)',
  },
  'Roots': {
    primary: '#f59e0b', primaryLight: '#fbbf24', primaryDark: '#d97706',
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    bgGradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fff7ed 100%)',
    accent: '#f59e0b', accentLight: '#fef3c7',
    emojis: ['📖', '🔤', '✏️', '🧩'],
    shadow: 'rgba(245,158,11,0.3)',
  },
};

// Biology Cell Test Questions - organized by topic and unit
const questions = [
  // Cell Theory & Scientists
  { id: 1, unit: 'Unit 9', topic: 'Cell Theory', q: 'Which of the following is one of the three principles of the Cell Theory?', a: 'All cells arise from pre-existing cells', wrong: ['Cells can spontaneously generate from non-living matter', 'Only animal cells arise from other cells', 'Cells are created from proteins in the environment'] },
  { id: 28, unit: 'Unit 9', topic: 'Cell Theory', q: 'Which scientist is credited with first observing cells while studying cork?', a: 'Robert Hooke', wrong: ['Anton van Leeuwenhoek', 'Matthias Schleiden', 'Rudolf Virchow'] },
  { id: 7, unit: 'Unit 9', topic: 'Cell Theory', q: 'Which observation tells a scientist that an organism is a eukaryote?', a: 'The organism has membrane-bound organelles', wrong: ['The organism has ribosomes', 'The organism has a cell membrane', 'The organism contains DNA'] },
  { id: 8, unit: 'Unit 9', topic: 'Cell Theory', q: 'Which statement is NOT true of prokaryotic cells?', a: 'They have membrane-bound organelles', wrong: ['They have ribosomes', 'They contain DNA', 'They have a cell membrane'] },
  { id: 38, unit: 'Unit 9', topic: 'Cell Theory', q: 'All of the following are part of a prokaryotic cell EXCEPT...', a: 'Endoplasmic reticulum', wrong: ['Ribosomes', 'Cell membrane', 'Cytoplasm'] },
  { id: 30, unit: 'Unit 9', topic: 'Cell Theory', q: 'According to the endosymbiotic theory, which organelles have their own DNA?', a: 'Mitochondria and chloroplasts', wrong: ['Ribosomes and lysosomes', 'Golgi apparatus and endoplasmic reticulum', 'Nucleus and vacuoles'] },
  
  // Organelles
  { id: 3, unit: 'Unit 9', topic: 'Organelles', q: 'Which organelle is directly responsible for producing proteins?', a: 'Ribosome', wrong: ['Golgi apparatus', 'Rough endoplasmic reticulum', 'Nucleus'] },
  { id: 5, unit: 'Unit 9', topic: 'Organelles', q: 'Which organelle contains digestive enzymes and recycles waste in animal cells?', a: 'Lysosome', wrong: ['Peroxisome', 'Vacuole', 'Golgi apparatus'] },
  { id: 6, unit: 'Unit 9', topic: 'Organelles', q: 'Which organelle is known as the powerhouse of the cell?', a: 'Mitochondrion', wrong: ['Chloroplast', 'Ribosome', 'Nucleus'] },
  { id: 17, unit: 'Unit 9', topic: 'Organelles', q: 'Which organelle modifies, packages, and ships proteins?', a: 'Golgi apparatus', wrong: ['Rough endoplasmic reticulum', 'Lysosome', 'Smooth endoplasmic reticulum'] },
  { id: 18, unit: 'Unit 9', topic: 'Organelles', q: 'Which organelle is responsible for movement in some cells?', a: 'Flagella', wrong: ['Cytoskeleton', 'Smooth endoplasmic reticulum', 'Centrioles'] },
  { id: 19, unit: 'Unit 9', topic: 'Organelles', q: 'Which structure provides support and shape for the cell?', a: 'Cytoskeleton', wrong: ['Cell membrane', 'Cell wall', 'Endoplasmic reticulum'] },
  { id: 21, unit: 'Unit 9', topic: 'Organelles', q: 'Which organelle controls the cell\'s activities and contains DNA?', a: 'Nucleus', wrong: ['Mitochondrion', 'Ribosome', 'Nucleolus'] },
  { id: 22, unit: 'Unit 9', topic: 'Organelles', q: 'What is the function of the large central vacuole in plant cells?', a: 'Storage of water and maintenance of turgor pressure', wrong: ['Production of proteins and lipids', 'Digestion of cellular waste and debris', 'Energy production through cellular respiration'] },
  { id: 33, unit: 'Unit 9', topic: 'Organelles', q: 'Which structure is found in all eukaryotic cells?', a: 'Mitochondria', wrong: ['Chloroplasts', 'Cell wall', 'Central vacuole'] },
  { id: 34, unit: 'Unit 9', topic: 'Organelles', q: 'Which disease is caused by a defect in lysosomes?', a: 'Tay-Sachs disease', wrong: ['Cystic fibrosis', 'Sickle cell anemia', 'Down syndrome'] },
  { id: 40, unit: 'Unit 9', topic: 'Organelles', q: 'What is the function of the mitochondrion?', a: 'ATP production', wrong: ['Protein synthesis', 'Photosynthesis', 'Lipid storage'] },
  { id: 42, unit: 'Unit 9', topic: 'Organelles', q: 'Which structure is NOT found in all cells?', a: 'Cell wall', wrong: ['Cell membrane', 'Ribosomes', 'DNA'] },
  
  // Cell Membrane
  { id: 10, unit: 'Unit 9', topic: 'Cell Membrane', q: 'What is the main function of the cell membrane?', a: 'To regulate what enters and exits the cell', wrong: ['To provide rigid structural support', 'To produce energy for the cell', 'To store genetic information'] },
  { id: 11, unit: 'Unit 9', topic: 'Cell Membrane', q: 'Channels and pumps found in the cell membrane are primarily made of...', a: 'Proteins', wrong: ['Phospholipids', 'Carbohydrates', 'Cholesterol'] },
  { id: 25, unit: 'Unit 9', topic: 'Cell Membrane', q: 'Which structure regulates what enters and exits the cell?', a: 'Cell membrane', wrong: ['Cell wall', 'Nuclear envelope', 'Cytoskeleton'] },
  
  // Transport - Passive
  { id: 4, unit: 'Unit 9', topic: 'Passive Transport', q: 'Substances that travel by facilitated diffusion...', a: 'Move passively through specific channels from high to low concentration', wrong: ['Require ATP to move through the membrane', 'Move from low to high concentration through channels', 'Pass directly through the phospholipid bilayer without assistance'] },
  { id: 12, unit: 'Unit 9', topic: 'Passive Transport', q: 'What happens when two sucrose solutions of different concentrations are separated by a semipermeable membrane?', a: 'The solvent (water) moves from high to low concentration', wrong: ['The sucrose molecules pass through to equalize concentration', 'The solvent moves from low to high concentration', 'Both sucrose and water move equally across the membrane'] },
  { id: 16, unit: 'Unit 9', topic: 'Passive Transport', q: 'The diffusion of water across a selectively permeable membrane is called...', a: 'Osmosis', wrong: ['Facilitated diffusion', 'Active transport', 'Endocytosis'] },
  { id: 23, unit: 'Unit 9', topic: 'Passive Transport', q: 'Which molecule crosses a semipermeable membrane during osmosis?', a: 'Water', wrong: ['Glucose', 'Sodium ions', 'Proteins'] },
  { id: 27, unit: 'Unit 9', topic: 'Passive Transport', q: 'The net movement of molecules from high to low concentration is called...', a: 'Diffusion', wrong: ['Osmosis', 'Active transport', 'Exocytosis'] },
  
  // Transport - Active
  { id: 2, unit: 'Unit 9', topic: 'Active Transport', q: 'Which of the following is true of active transport?', a: 'It moves molecules against the concentration gradient', wrong: ['It does not require energy from the cell', 'It moves molecules from high to low concentration', 'It only occurs in plant cells'] },
  { id: 13, unit: 'Unit 9', topic: 'Active Transport', q: 'What is the primary energy-carrying molecule in cells?', a: 'ATP', wrong: ['NADPH', 'ADP', 'Glucose'] },
  { id: 29, unit: 'Unit 9', topic: 'Active Transport', q: 'Which process requires ATP to move substances across the cell membrane?', a: 'Active transport', wrong: ['Osmosis', 'Facilitated diffusion', 'Simple diffusion'] },
  { id: 31, unit: 'Unit 9', topic: 'Active Transport', q: 'What energy molecule do cells use for active transport?', a: 'ATP', wrong: ['NADH', 'GTP', 'FADH₂'] },
  { id: 43, unit: 'Unit 9', topic: 'Active Transport', q: 'Which statement is true about active transport?', a: 'It moves substances from low to high concentration', wrong: ['It moves substances from high to low concentration', 'It does not require any cellular energy', 'It only moves water molecules'] },
  { id: 20, unit: 'Unit 9', topic: 'Active Transport', q: 'The process by which a vesicle fuses with the cell membrane and releases its contents outside the cell is called...', a: 'Exocytosis', wrong: ['Endocytosis', 'Phagocytosis', 'Pinocytosis'] },
  { id: 37, unit: 'Unit 9', topic: 'Active Transport', q: 'The process by which a vesicle is formed at the plasma membrane to bring substances into the cell is called...', a: 'Endocytosis', wrong: ['Exocytosis', 'Facilitated diffusion', 'Osmosis'] },
  
  // Solutions
  { id: 9, unit: 'Unit 9', topic: 'Solutions', q: 'Which type of solution will cause cells to swell and burst?', a: 'Hypotonic', wrong: ['Hypertonic', 'Isotonic', 'Saturated'] },
  { id: 14, unit: 'Unit 9', topic: 'Solutions', q: 'If the solution outside a cell has a lower solute concentration than inside the cell, the solution is considered...', a: 'Hypotonic', wrong: ['Hypertonic', 'Isotonic', 'Concentrated'] },
  { id: 15, unit: 'Unit 9', topic: 'Solutions', q: 'What will happen to a cell placed in a hypertonic solution?', a: 'It will shrink', wrong: ['It will swell and burst', 'It will stay the same size', 'It will divide more quickly'] },
  { id: 24, unit: 'Unit 9', topic: 'Solutions', q: 'Which type of solution will cause a cell to shrink or shrivel?', a: 'Hypertonic', wrong: ['Hypotonic', 'Isotonic', 'Dilute'] },
  { id: 32, unit: 'Unit 9', topic: 'Solutions', q: 'Why does wilted lettuce become crisp when placed in cold water?', a: 'Water enters the lettuce cells by osmosis', wrong: ['Water exits the lettuce cells by diffusion', 'Cold temperature causes the cell walls to harden', 'Nutrients are absorbed through active transport'] },
  { id: 35, unit: 'Unit 9', topic: 'Solutions', q: 'What will occur if a cell is placed in an isotonic solution?', a: 'Water will move equally in and out of the cell', wrong: ['Water will rush into the cell causing it to swell', 'Water will leave the cell causing it to shrink', 'No water molecules will cross the membrane'] },
  { id: 39, unit: 'Unit 9', topic: 'Solutions', q: 'What kind of solution has equal solute concentrations inside and outside the cell?', a: 'Isotonic', wrong: ['Hypotonic', 'Hypertonic', 'Homeostatic'] },
  
  // Terms
  { id: 26, unit: 'Unit 9', topic: 'Terms', q: 'What is the term for a molecule that attracts water?', a: 'Hydrophilic', wrong: ['Hydrophobic', 'Amphipathic', 'Hygroscopic'] },
  { id: 36, unit: 'Unit 9', topic: 'Terms', q: 'What is the term for a molecule that repels water?', a: 'Hydrophobic', wrong: ['Hydrophilic', 'Amphipathic', 'Lipophilic'] },

  // Unit 10 Test Questions
  { id: 44, unit: 'Unit 10', topic: 'Calvin Cycle', q: 'The Calvin cycle occurs in the...', a: 'Stroma', wrong: ['Inner membrane', 'Cytoplasm', 'Thylakoid'] },
  { id: 45, unit: 'Unit 10', topic: 'Cellular Respiration', q: 'Cellular respiration primarily occurs in the...', a: 'Mitochondria', wrong: ['Chloroplast', 'Nucleus', 'Ribosome'] },
  { id: 46, unit: 'Unit 10', topic: 'Photosynthesis', q: 'The energy in sunlight is converted into ___ energy during photosynthesis.', a: 'Chemical', wrong: ['Thermal', 'Nuclear', 'Mechanical'] },
  { id: 47, unit: 'Unit 10', topic: 'Key Molecules', q: 'ATP contains...', a: '3 phosphates', wrong: ['4 phosphates', '2 phosphates', '1 phosphate'] },
  { id: 48, unit: 'Unit 10', topic: 'Cellular Respiration', q: 'During respiration, energy stored in glucose is converted into...', a: 'Chemical energy in ATP', wrong: ['Light energy', 'Heat only', 'Nuclear energy'] },
  { id: 49, unit: 'Unit 10', topic: 'Cellular Respiration', q: 'When you lose weight through exercise, most of the mass leaves your body as...', a: 'Carbon dioxide exhaled', wrong: ['Sweat', 'Muscle', 'Heat'] },
  { id: 50, unit: 'Unit 10', topic: 'Energy & Organisms', q: 'Organisms that make their own food using sunlight or chemicals are called...', a: 'Autotrophs', wrong: ['Heterotrophs', 'Decomposers', 'Consumers'] },
  { id: 51, unit: 'Unit 10', topic: 'Cellular Respiration', q: 'Which process releases energy?', a: 'Cellular respiration', wrong: ['Calvin cycle', 'Photosynthesis', 'Transpiration'] },
  { id: 52, unit: 'Unit 10', topic: 'Cellular Respiration', q: 'The purpose of cellular respiration is to...', a: 'Produce ATP from glucose', wrong: ['Make oxygen', 'Store sunlight', 'Make carbon dioxide'] },
  { id: 53, unit: 'Unit 10', topic: 'Cellular Respiration', q: 'Which scenario would decrease cellular respiration rate?', a: 'Lack of oxygen', wrong: ['More oxygen available', 'Increased exercise', 'More glucose available'] },
  { id: 54, unit: 'Unit 10', topic: 'Cellular Respiration', q: 'The products of cellular respiration are...', a: 'Carbon dioxide, water, and ATP', wrong: ['Oxygen and ATP', 'Oxygen and glucose', 'Glucose and ATP'] },
  { id: 55, unit: 'Unit 10', topic: 'Energy & Organisms', q: 'Energy flow in living systems begins with...', a: 'Sunlight', wrong: ['ATP', 'Oxygen', 'Glucose'] },
  { id: 56, unit: 'Unit 10', topic: 'Photosynthesis', q: 'Photosynthesis takes place in the...', a: 'Chloroplast', wrong: ['Nucleus', 'Ribosome', 'Mitochondria'] },
  { id: 57, unit: 'Unit 10', topic: 'Light Reactions', q: 'The molecule released as a product of the light-dependent reaction is...', a: 'Oxygen', wrong: ['ATP', 'Glucose', 'Carbon dioxide'] },
  { id: 58, unit: 'Unit 10', topic: 'Energy & Organisms', q: 'Potential energy is...', a: 'Stored energy', wrong: ['Heat energy', 'Energy of motion', 'Light energy'] },
  { id: 59, unit: 'Unit 10', topic: 'Cell Biology', q: 'Which statement best explains the relationship between mitochondria and chloroplasts?', a: 'They perform complementary energy processes', wrong: ['They store DNA only', 'They perform the same function', 'Both only occur in animals'] },
  { id: 60, unit: 'Unit 10', topic: 'Photosynthesis', q: 'Chloroplasts can be found in all parts of the plant including the roots.', a: 'False', wrong: ['True'] },
  { id: 61, unit: 'Unit 10', topic: 'Cellular Respiration', q: 'The reactants of cellular respiration are...', a: 'Glucose and oxygen', wrong: ['ATP and glucose', 'Oxygen and ATP', 'Carbon dioxide and water'] },
  { id: 62, unit: 'Unit 10', topic: 'Calvin Cycle', q: 'Carbon dioxide is used to build glucose during the...', a: 'Calvin cycle', wrong: ['Krebs cycle', 'Electron transport chain', 'Light-dependent reaction'] },
  { id: 63, unit: 'Unit 10', topic: 'Key Molecules', q: 'Chlorophyll is...', a: 'A green pigment that absorbs light energy for photosynthesis', wrong: ['A membrane where light reactions occur', 'Small pores in leaves for gas exchange', 'A sugar molecule that stores energy'] },
  { id: 64, unit: 'Unit 10', topic: 'Cell Biology', q: 'A thylakoid is...', a: 'A membrane-bound compartment inside chloroplasts where light reactions occur', wrong: ['A green pigment that captures sunlight', 'Small openings on leaves for gas exchange', 'A sugar molecule that stores chemical energy'] },
  { id: 65, unit: 'Unit 10', topic: 'Photosynthesis', q: 'Stomata are...', a: 'Small pores on leaves that allow gas exchange', wrong: ['Green pigments in chloroplasts', 'Internal membrane systems for light reactions', 'Energy storage molecules'] },
  { id: 66, unit: 'Unit 10', topic: 'Key Molecules', q: 'Glucose is...', a: 'A sugar molecule that stores chemical energy', wrong: ['A green pigment that absorbs light', 'A membrane inside chloroplasts', 'Pores on the leaf surface'] },
  { id: 67, unit: 'Unit 10', topic: 'Energy & Organisms', q: 'Kinetic energy is...', a: 'Energy of motion', wrong: ['Chemical energy', 'Stored energy', 'Nuclear energy'] },
  { id: 68, unit: 'Unit 10', topic: 'Light Reactions', q: 'The light-dependent reactions occur in the...', a: 'Thylakoid membranes', wrong: ['Cytoplasm', 'Stroma', 'Mitochondrial matrix'] },
  { id: 69, unit: 'Unit 10', topic: 'Cellular Respiration', q: 'The carbon in carbon dioxide released during respiration originally came from...', a: 'Glucose', wrong: ['ATP', 'Water', 'Oxygen'] },
  { id: 70, unit: 'Unit 10', topic: 'Calvin Cycle', q: 'The raw material required for the Calvin cycle to build glucose is...', a: 'Carbon dioxide', wrong: ['Water', 'Nitrogen', 'Oxygen'] },
  { id: 71, unit: 'Unit 10', topic: 'Photosynthesis', q: 'Which statement best describes photosynthesis?', a: 'It stores energy in glucose', wrong: ['It occurs in mitochondria', 'It releases energy', 'It breaks down glucose'] },
  { id: 72, unit: 'Unit 10', topic: 'Cellular Respiration', q: 'The electron transport chain produces most of the cell\'s...', a: 'ATP', wrong: ['Oxygen', 'Carbon dioxide', 'Glucose'] },
  { id: 73, unit: 'Unit 10', topic: 'Photosynthesis', q: 'The overall energy storage molecule produced by photosynthesis is...', a: 'Glucose', wrong: ['Carbon dioxide', 'ATP', 'Oxygen'] },
  { id: 74, unit: 'Unit 10', topic: 'Energy & Organisms', q: 'Organisms that must consume other organisms for energy are called...', a: 'Heterotrophs', wrong: ['Autotrophs', 'Chloroplasts', 'Producers'] },
  { id: 75, unit: 'Unit 10', topic: 'Energy & Organisms', q: 'An example of potential energy in a living organism is...', a: 'Energy stored in glucose bonds', wrong: ['Running', 'Blood flow', 'Muscle contraction'] },
  { id: 76, unit: 'Unit 10', topic: 'Light Reactions', q: 'ATP and NADPH are produced during the...', a: 'Light-dependent reactions', wrong: ['Calvin cycle', 'Glycolysis', 'Fermentation'] },
  { id: 77, unit: 'Unit 10', topic: 'Photosynthesis', q: 'Oxygen is a byproduct of photosynthesis.', a: 'True', wrong: ['False'] },
  { id: 78, unit: 'Unit 10', topic: 'Photosynthesis', q: 'Photosynthesis requires energy from the ___ to occur.', a: 'Sun', wrong: ['Moon', 'Soil', 'ATP'] },
  { id: 79, unit: 'Unit 10', topic: 'Photosynthesis', q: 'The products of photosynthesis are...', a: 'Glucose and oxygen', wrong: ['Oxygen and carbon dioxide', 'ATP and heat', 'Carbon dioxide and water'] },
  { id: 80, unit: 'Unit 10', topic: 'Photosynthesis', q: 'The small openings on the underside of leaves that allow gas exchange are called...', a: 'Stomata', wrong: ['Chloroplasts', 'Thylakoids', 'Chlorophyll'] },
  { id: 81, unit: 'Unit 10', topic: 'Cellular Respiration', q: 'The first stage of cellular respiration is...', a: 'Glycolysis', wrong: ['Fermentation', 'Krebs cycle', 'Electron transport chain'] },
  { id: 82, unit: 'Unit 10', topic: 'Photosynthesis', q: 'The reactants of photosynthesis are...', a: 'Carbon dioxide and water', wrong: ['Glucose and oxygen', 'ATP and carbon dioxide', 'Oxygen and ATP'] },
  { id: 83, unit: 'Unit 10', topic: 'Cellular Respiration', q: 'Glycolysis occurs in the...', a: 'Cytoplasm', wrong: ['Nucleus', 'Chloroplast', 'Mitochondria'] },

  // Unit 11 - Introduction to Genetics (Test Questions)

  { id: 1101, unit: 'Unit 11', topic: 'Punnett Squares', q: 'Two heterozygous guinea pigs (Bb × Bb) produce 40 offspring. How many white (bb) offspring would you expect?', a: '10', wrong: ['20', '30', '40'] },
  { id: 1102, unit: 'Unit 11', topic: 'Punnett Squares', q: 'Black fur (B) is dominant to white fur (b). A heterozygous black mouse (Bb) is crossed with a homozygous recessive white mouse (bb). What is the probability of a bb (white) offspring?', a: '50%', wrong: ['25%', '75%', '100%'] },
  { id: 1103, unit: 'Unit 11', topic: 'Punnett Squares', q: 'Black fur (B) is dominant to white fur (b). A heterozygous black mouse (Bb) is crossed with a homozygous recessive white mouse (bb). What is the probability of a Bb (black) offspring?', a: '50%', wrong: ['25%', '75%', '100%'] },
  { id: 1104, unit: 'Unit 11', topic: 'Punnett Squares', q: 'Black fur (B) is dominant to white fur (b). A heterozygous black mouse (Bb) is crossed with a homozygous recessive white mouse (bb). What is the probability of a BB offspring?', a: '0%', wrong: ['25%', '50%', '75%'] },
  { id: 1105, unit: 'Unit 11', topic: 'Dominance', q: "Mendel's Law of Dominance states that:", a: 'Dominant alleles are always expressed over recessive alleles', wrong: ['Dominant and recessive alleles are expressed randomly', 'Recessive alleles are always expressed over dominant alleles', 'Dominant and recessive alleles are always expressed equally'] },
  { id: 1106, unit: 'Unit 11', topic: 'Polygenic Traits', q: 'A scientist studies human height and observes a wide range of variation within a population. Which explanation best accounts for this pattern?', a: 'Height is controlled by multiple genes and environmental factors', wrong: ['Height is controlled by one gene', 'Height is always dominant', 'Height is determined only by environment'] },
  { id: 1107, unit: 'Unit 11', topic: 'Punnett Squares', q: 'Black fur (B) in guinea pigs is dominant over white fur (b). What is the probability of a black offspring in a cross of two heterozygous guinea pigs (Bb × Bb)?', a: '75%', wrong: ['25%', '50%', '100%'] },
  { id: 1108, unit: 'Unit 11', topic: 'Heredity', q: 'What is the study of heredity called?', a: 'Genetics', wrong: ['Zoology', 'Biology', 'Botany'] },
  { id: 1109, unit: 'Unit 11', topic: 'Genotype', q: 'Which of the following represents a recessive trait?', a: 'aa', wrong: ['AA', 'Aa', 'AaBb'] },
  { id: 1110, unit: 'Unit 11', topic: 'Genotype', q: 'The genotype of an organism refers to:', a: 'Its genetic makeup', wrong: ['Its physical appearance', 'Its species', 'Its environment'] },
  { id: 1111, unit: 'Unit 11', topic: 'Probability', q: 'A couple are both carriers for a recessive disorder (Aa × Aa). They already have one affected child. What is the probability their next child will also have the disorder?', a: '25%', wrong: ['50%', '75%', '0%'] },
  { id: 1112, unit: 'Unit 11', topic: 'Punnett Squares', q: 'In a particular species of plant, purple is dominant over white. If a homozygous dominant plant (PP) is crossed with a homozygous recessive plant (pp), what is the probability that the offspring will be white?', a: '0%', wrong: ['25%', '50%', '100%'] },
  { id: 1113, unit: 'Unit 11', topic: 'Heredity', q: 'What term describes the offspring of parents with different traits?', a: 'Heterozygotes', wrong: ['Diploids', 'Homozygotes', 'Mutants'] },
  { id: 1114, unit: 'Unit 11', topic: 'Punnett Squares', q: 'In a particular species of plant, purple is dominant over white. If a homozygous recessive plant (pp) is crossed with a homozygous dominant plant (PP), what is the probability that the offspring will be purple?', a: '100%', wrong: ['75%', '50%', '0%'] },
  { id: 1115, unit: 'Unit 11', topic: 'Punnett Squares', q: 'A botanist crosses a heterozygous tall pea plant with a short pea plant (Tt × tt). After planting 200 seeds, what is the expected number of tall plants?', a: '100', wrong: ['50', '150', '200'] },
  { id: 1116, unit: 'Unit 11', topic: 'Punnett Squares', q: 'A botanist crosses Tt × tt and plants 200 seeds. What is the expected number of short plants?', a: '100', wrong: ['50', '150', '200'] },
  { id: 1117, unit: 'Unit 11', topic: 'Punnett Squares', q: 'A botanist crosses Tt × tt and observes 98 tall and 102 short out of 200. The observed results are closest to what ratio (tall:short)?', a: '1:1', wrong: ['3:1', '2:1', '1:3'] },
  { id: 1118, unit: 'Unit 11', topic: 'Probability', q: 'A couple are both heterozygous for a recessive disorder (Aa × Aa). What is the probability their child is unaffected and a non-carrier (AA)?', a: '25%', wrong: ['50%', '75%', '0%'] },
  { id: 1119, unit: 'Unit 11', topic: 'Probability', q: 'A couple are both heterozygous for a recessive disorder (Aa × Aa). What is the probability their child is affected (aa)?', a: '25%', wrong: ['50%', '75%', '0%'] },
  { id: 1120, unit: 'Unit 11', topic: 'Probability', q: 'A couple are both heterozygous for a recessive disorder (Aa × Aa). What is the probability their child shows the dominant phenotype?', a: '75%', wrong: ['25%', '50%', '100%'] },
  { id: 1121, unit: 'Unit 11', topic: 'Probability', q: 'A couple are both heterozygous for a recessive disorder (Aa × Aa). What is the probability their child is a carrier (Aa)?', a: '50%', wrong: ['25%', '75%', '0%'] },
  { id: 1122, unit: 'Unit 11', topic: 'Crosses', q: 'What type of cross involves parents differing in two traits?', a: 'Dihybrid cross', wrong: ['Test cross', 'Monohybrid cross', 'Codominant cross'] },
  { id: 1123, unit: 'Unit 11', topic: 'Independent Assortment', q: 'What principle describes the independent assortment of alleles for different genes?', a: 'Principle of Independent Assortment', wrong: ['Principle of Dominance', 'Principle of Segregation', 'Principle of Codominance'] },
  { id: 1124, unit: 'Unit 11', topic: 'Gregor Mendel', q: 'Gregor Mendel is known as the father of modern genetics because:', a: 'He conducted experiments with pea plants and formulated the principles of inheritance', wrong: ['He discovered the structure of DNA', 'He developed the theory of natural selection', 'He identified the process of meiosis'] },
  { id: 1125, unit: 'Unit 11', topic: 'Segregation', q: 'What term describes the separation of alleles during gamete formation?', a: 'Segregation', wrong: ['Independent assortment', 'Fertilization', 'Multiple alleles'] },
  { id: 1126, unit: 'Unit 11', topic: 'Crosses', q: 'What is a dihybrid cross?', a: 'A cross involving two traits', wrong: ['A cross involving one trait', 'A cross involving four or more traits', 'A cross involving three traits'] },
  { id: 1127, unit: 'Unit 11', topic: 'Blood Type', q: 'A father has blood type AB and the mother has blood type O. What blood types are possible for their children?', a: 'A or B', wrong: ['AB only', 'A or O', 'B or O'] },
  { id: 1128, unit: 'Unit 11', topic: 'Fertilization', q: 'What process combines gametes to form a zygote?', a: 'Fertilization', wrong: ['Independent assortment', 'Segregation', 'Multiple alleles'] },
  { id: 1129, unit: 'Unit 11', topic: 'Genetics Basics', q: 'What is the relationship between alleles, genes, and chromosomes?', a: 'Alleles make up genes and genes make up chromosomes', wrong: ['Alleles make up chromosomes and chromosomes make up genes', 'Genes make up alleles and alleles make up chromosomes', 'Chromosomes make up genes and genes make up alleles'] },
  { id: 1130, unit: 'Unit 11', topic: 'Crosses', q: 'What is a monohybrid cross?', a: 'A cross involving one trait', wrong: ['A cross involving three traits', 'A cross involving four or more traits', 'A cross involving two traits'] },
  { id: 1131, unit: 'Unit 11', topic: 'Genotype', q: 'Which of the following is an example of a homozygous genotype?', a: 'AA', wrong: ['AB', 'AaBb', 'Aa'] },
  { id: 1132, unit: 'Unit 11', topic: 'Punnett Squares', q: 'Black fur in guinea pigs is dominant over white fur. Find the probability of a black offspring in a cross bb × bb.', a: '0%', wrong: ['25%', '50%', '100%'] },
  { id: 1133, unit: 'Unit 11', topic: 'Gregor Mendel', q: "What were the primary subjects of Mendel's experiments?", a: 'Plants', wrong: ['Fungi', 'Animals', 'Bacteria'] },
  { id: 1134, unit: 'Unit 11', topic: 'Independent Assortment', q: 'What term describes the random distribution of alleles during gamete formation?', a: 'Independent assortment', wrong: ['Fertilization', 'Segregation', 'Multiple alleles'] },
  { id: 1135, unit: 'Unit 11', topic: 'Phenotype', q: 'The phenotype of an organism refers to:', a: 'Its physical appearance', wrong: ['Its environment', 'Its diet', 'Its genetic makeup'] },
  { id: 1136, unit: 'Unit 11', topic: 'Meiosis', q: 'What are the reproductive cells produced during meiosis called?', a: 'Gametes', wrong: ['Diploids', 'Zygotes', 'Mitosis'] },
  { id: 1137, unit: 'Unit 11', topic: 'Genotype', q: 'If an individual has two different alleles for a particular gene, they are said to be:', a: 'Heterozygous', wrong: ['Homozygous dominant', 'Homozygous recessive', 'Monohybrid'] },
  { id: 1138, unit: 'Unit 11', topic: 'Genetics Basics', q: 'What is the term used to describe the different forms of a gene?', a: 'Allele', wrong: ['Genotype', 'Homozygote', 'Heterozygote'] },
  { id: 1139, unit: 'Unit 11', topic: 'Punnett Squares', q: 'A Punnett square is used to:', a: 'Determine the probability of different genotypes and phenotypes in offspring', wrong: ['Determine the dominance of a trait', 'Determine the number of chromosomes in an organism', 'Determine the ratios of alleles in a population'] },
  { id: 1140, unit: 'Unit 11', topic: 'Punnett Squares', q: 'Long tails (L) are dominant to short tails (l). Two dogs (Ll × Ll) produce 16 puppies. What is the genotype ratio?', a: '1 LL : 2 Ll : 1 ll', wrong: ['3 LL : 1 ll', '2 LL : 2 ll', '1 LL : 1 Ll : 2 ll'] },
  { id: 1141, unit: 'Unit 11', topic: 'Punnett Squares', q: 'Long tails (L) are dominant to short tails (l). Two dogs (Ll × Ll) produce 16 puppies. What percentage will be short-tailed?', a: '25%', wrong: ['50%', '75%', '0%'] },
  { id: 1142, unit: 'Unit 11', topic: 'Punnett Squares', q: 'Long tails (L) are dominant to short tails (l). Two dogs (Ll × Ll) produce 16 puppies. How many short-tailed puppies are expected?', a: '4', wrong: ['8', '12', '2'] },
  { id: 1143, unit: 'Unit 11', topic: 'Dihybrid Cross', q: 'Two plants with genotype RrYy are crossed. What phenotypic ratio should be expected?', a: '9:3:3:1', wrong: ['1:2:1', '3:1', '1:1'] },
  { id: 1156, unit: 'Unit 11', topic: "Mendel's Principles", q: 'Long tails (L) are dominant to short tails (l). Two dogs (Ll × Ll) produce 16 puppies. What percentage are short-tailed?', a: '25%', wrong: ['50%', '75%', '0%'] },
  { id: 1157, unit: 'Unit 11', topic: "Mendel's Principles", q: 'Long tails (L) are dominant to short tails (l). Two dogs (Ll × Ll) produce 16 puppies. How many are expected to be short-tailed?', a: '4', wrong: ['8', '12', '2'] },
  { id: 1158, unit: 'Unit 11', topic: "Mendel's Principles", q: 'A heterozygous black mouse (Bb) is crossed with a homozygous recessive white mouse (bb). What percentage of offspring have a black phenotype?', a: '50%', wrong: ['25%', '75%', '100%'] },
  { id: 1159, unit: 'Unit 11', topic: "Mendel's Principles", q: 'A heterozygous black mouse (Bb) is crossed with a homozygous recessive white mouse (bb). What percentage of offspring are Bb?', a: '50%', wrong: ['25%', '75%', '0%'] },
  { id: 1160, unit: 'Unit 11', topic: "Mendel's Principles", q: 'A heterozygous black mouse (Bb) is crossed with a homozygous recessive white mouse (bb). What percentage of offspring have a white phenotype?', a: '50%', wrong: ['25%', '75%', '0%'] },
  { id: 1161, unit: 'Unit 11', topic: "Mendel's Principles", q: 'A heterozygous black mouse (Bb) is crossed with a homozygous recessive white mouse (bb). What percentage of offspring are BB?', a: '0%', wrong: ['25%', '50%', '75%'] },
  { id: 1166, unit: 'Unit 11', topic: "Mendel's Principles", q: 'Two heterozygous black guinea pigs (Bb × Bb) produce 40 offspring. How many white offspring would you expect?', a: '10', wrong: ['20', '30', '5'] },

  // Unit 12: DNA Replication & Protein Synthesis
  // DNA Structure
  { id: 1201, unit: 'Unit 12', topic: 'DNA Structure', q: 'What are the three parts of a nucleotide?', a: 'Sugar, phosphate group, nitrogenous base', wrong: ['Sugar, protein, lipid', 'Amino acid, phosphate, base', 'Ribose, enzyme, nitrogen'] },
  { id: 1202, unit: 'Unit 12', topic: 'DNA Structure', q: 'What type of bond holds base pairs together in DNA?', a: 'Hydrogen bonds', wrong: ['Covalent bonds', 'Ionic bonds', 'Peptide bonds'] },
  { id: 1203, unit: 'Unit 12', topic: 'DNA Structure', q: 'In DNA, adenine pairs with which base?', a: 'Thymine', wrong: ['Guanine', 'Cytosine', 'Uracil'] },
  { id: 1204, unit: 'Unit 12', topic: 'DNA Structure', q: 'In DNA, cytosine pairs with which base?', a: 'Guanine', wrong: ['Adenine', 'Thymine', 'Uracil'] },
  { id: 1205, unit: 'Unit 12', topic: 'DNA Structure', q: 'During which phase of the cell cycle does DNA replication occur?', a: 'S phase', wrong: ['G1 phase', 'G2 phase', 'M phase'] },

  // Base Pairing - DNA
  { id: 1206, unit: 'Unit 12', topic: 'Base Pairing', q: 'What is the complementary DNA strand for ATCG?', a: 'TAGC', wrong: ['UAGC', 'GCTA', 'CGAT'] },
  { id: 1207, unit: 'Unit 12', topic: 'Base Pairing', q: 'What is the complementary DNA strand for GGCATA?', a: 'CCGTAT', wrong: ['CCGUAU', 'AATGCC', 'TATGCC'] },
  { id: 1208, unit: 'Unit 12', topic: 'Base Pairing', q: 'What is the complementary DNA strand for TACGGT?', a: 'ATGCCA', wrong: ['AUGCCA', 'GTACCA', 'CATGGC'] },

  // DNA Replication
  { id: 1209, unit: 'Unit 12', topic: 'DNA Replication', q: 'Why is DNA replication called "semi-conservative"?', a: 'Each new DNA molecule has one original strand and one new strand', wrong: ['DNA is completely copied without changes', 'Both strands are newly synthesized', 'Only half the DNA is copied'] },
  { id: 1210, unit: 'Unit 12', topic: 'DNA Replication', q: 'What would happen if DNA did not replicate before mitosis?', a: 'Daughter cells would only get half the DNA', wrong: ['Daughter cells would get double the DNA', 'Nothing would change', 'Cells would become cancerous immediately'] },
  { id: 1211, unit: 'Unit 12', topic: 'DNA Replication', q: 'Why is accuracy important during DNA replication?', a: 'Errors can cause mutations that lead to diseases or cancer', wrong: ['It makes replication faster', 'It uses less energy', 'It prevents cell division'] },
  { id: 1212, unit: 'Unit 12', topic: 'DNA Replication', q: 'What is the correct order of DNA replication steps?', a: 'Helicase unzips DNA → Primers attach → DNA polymerase adds nucleotides', wrong: ['DNA polymerase adds nucleotides → Helicase unzips → Primers attach', 'Primers attach → Helicase unzips → DNA polymerase adds nucleotides', 'DNA polymerase unzips → Primers detach → Helicase adds nucleotides'] },
  { id: 1213, unit: 'Unit 12', topic: 'DNA Replication', q: 'What is the role of DNA polymerase?', a: 'Adds complementary nucleotides to build the new DNA strand', wrong: ['Unzips the DNA double helix', 'Holds the DNA strands apart', 'Creates primers for replication'] },
  { id: 1214, unit: 'Unit 12', topic: 'DNA Replication', q: 'Why does DNA replication start at multiple origins in human cells?', a: 'To speed up replication since human DNA is very long', wrong: ['To create more mutations', 'Because helicase can only work once', 'To make the DNA shorter'] },
  { id: 1215, unit: 'Unit 12', topic: 'DNA Replication', q: 'Which enzyme "unzips" the DNA double helix during replication?', a: 'Helicase', wrong: ['DNA polymerase', 'RNA polymerase', 'Ligase'] },

  // Transcription
  { id: 1216, unit: 'Unit 12', topic: 'Transcription', q: 'Where does transcription occur in a eukaryotic cell?', a: 'Nucleus', wrong: ['Ribosome', 'Cytoplasm', 'Mitochondria'] },
  { id: 1217, unit: 'Unit 12', topic: 'Transcription', q: 'Which enzyme builds mRNA during transcription?', a: 'RNA polymerase', wrong: ['DNA polymerase', 'Helicase', 'Ligase'] },
  { id: 1218, unit: 'Unit 12', topic: 'Transcription', q: 'Why can\'t DNA leave the nucleus?', a: 'It is too big and important to risk damage', wrong: ['It would dissolve in the cytoplasm', 'The nuclear membrane is too thick', 'Ribosomes would destroy it'] },
  { id: 1219, unit: 'Unit 12', topic: 'Transcription', q: 'What is the mRNA sequence transcribed from DNA sequence TAC?', a: 'AUG', wrong: ['ATG', 'UAC', 'TAG'] },
  { id: 1220, unit: 'Unit 12', topic: 'Transcription', q: 'What is the mRNA sequence transcribed from DNA sequence ATCG?', a: 'UAGC', wrong: ['TAGC', 'AUCG', 'GCTA'] },
  { id: 1221, unit: 'Unit 12', topic: 'Transcription', q: 'What is the mRNA sequence transcribed from DNA sequence GGCATA?', a: 'CCGUAU', wrong: ['CCGTAT', 'GGCAUA', 'UAUGCC'] },
  { id: 1222, unit: 'Unit 12', topic: 'Transcription', q: 'Why does RNA use uracil instead of thymine?', a: 'RNA is temporary and uracil is easier for the cell to make', wrong: ['Uracil is more stable than thymine', 'Thymine cannot bind to adenine', 'DNA already uses all the uracil'] },
  { id: 1223, unit: 'Unit 12', topic: 'Transcription', q: 'What is the purpose of mRNA?', a: 'To carry genetic instructions from DNA to ribosomes', wrong: ['To store genetic information permanently', 'To break down proteins', 'To copy DNA during cell division'] },
  { id: 1224, unit: 'Unit 12', topic: 'Transcription', q: 'How is mRNA different from DNA?', a: 'mRNA is single-stranded, uses ribose sugar, and has uracil instead of thymine', wrong: ['mRNA is double-stranded and longer than DNA', 'mRNA uses deoxyribose sugar and thymine', 'mRNA is permanent while DNA is temporary'] },

  // Translation
  { id: 1225, unit: 'Unit 12', topic: 'Translation', q: 'What is a codon?', a: 'A sequence of 3 mRNA bases that codes for one amino acid', wrong: ['A sequence of 3 amino acids', 'A single base in DNA', 'A type of protein'] },
  { id: 1226, unit: 'Unit 12', topic: 'Translation', q: 'Where does translation occur?', a: 'Ribosome', wrong: ['Nucleus', 'Mitochondria', 'Golgi apparatus'] },
  { id: 1227, unit: 'Unit 12', topic: 'Translation', q: 'What molecule brings amino acids to the ribosome during translation?', a: 'tRNA', wrong: ['mRNA', 'rRNA', 'DNA'] },
  { id: 1228, unit: 'Unit 12', topic: 'Translation', q: 'How many bases make up one codon?', a: '3', wrong: ['1', '2', '4'] },
  { id: 1229, unit: 'Unit 12', topic: 'Translation', q: 'What is the start codon?', a: 'AUG', wrong: ['UAA', 'UAG', 'UGA'] },
  { id: 1230, unit: 'Unit 12', topic: 'Translation', q: 'Which of the following is a stop codon?', a: 'UAA', wrong: ['AUG', 'GUA', 'CGA'] },
  { id: 1231, unit: 'Unit 12', topic: 'Translation', q: 'Which of the following is NOT a stop codon?', a: 'AUG', wrong: ['UAA', 'UAG', 'UGA'] },
  { id: 1232, unit: 'Unit 12', topic: 'Translation', q: 'In the mRNA sequence AUG UUU GGC UAA, which codon signals the start?', a: 'AUG', wrong: ['UUU', 'GGC', 'UAA'] },
  { id: 1233, unit: 'Unit 12', topic: 'Translation', q: 'In the mRNA sequence AUG UUU GGC UAA, which codon signals stop?', a: 'UAA', wrong: ['AUG', 'UUU', 'GGC'] },

  // DNA to Protein Process
  { id: 1234, unit: 'Unit 12', topic: 'DNA to Protein', q: 'Given DNA sequence TAC GGA TTT ACT, what is the mRNA?', a: 'AUG CCU AAA UGA', wrong: ['TAC GGA UUU ACU', 'AUG CCU TTT ACT', 'UAC GGU AAA UGA'] },
  { id: 1235, unit: 'Unit 12', topic: 'DNA to Protein', q: 'In the mRNA sequence AUG CCU AAA UGA, which is the start codon?', a: 'AUG', wrong: ['CCU', 'AAA', 'UGA'] },
  { id: 1236, unit: 'Unit 12', topic: 'DNA to Protein', q: 'In the mRNA sequence AUG CCU AAA UGA, which is the stop codon?', a: 'UGA', wrong: ['AUG', 'CCU', 'AAA'] },

  // Protein Structure
  { id: 1237, unit: 'Unit 12', topic: 'Protein Structure', q: 'What are proteins made of?', a: 'Amino acids', wrong: ['Nucleotides', 'Fatty acids', 'Glucose molecules'] },
  { id: 1238, unit: 'Unit 12', topic: 'Protein Structure', q: 'How many different amino acids exist?', a: '20', wrong: ['4', '64', '100'] },
  { id: 1239, unit: 'Unit 12', topic: 'Protein Structure', q: 'What determines the shape of a protein?', a: 'The sequence of amino acids', wrong: ['The temperature of the cell', 'The size of the ribosome', 'The amount of water present'] },
  { id: 1240, unit: 'Unit 12', topic: 'Protein Structure', q: 'Why is protein shape important?', a: 'Shape determines function - wrong shape means the protein won\'t work', wrong: ['Shape makes proteins colorful', 'Shape helps proteins dissolve', 'Shape is only important for appearance'] },
  { id: 1241, unit: 'Unit 12', topic: 'Protein Structure', q: 'Which level of protein structure refers to the sequence of amino acids?', a: 'Primary', wrong: ['Secondary', 'Tertiary', 'Quaternary'] },
  { id: 1242, unit: 'Unit 12', topic: 'Protein Structure', q: 'Which level of protein structure involves alpha helices and beta sheets?', a: 'Secondary', wrong: ['Primary', 'Tertiary', 'Quaternary'] },
  { id: 1243, unit: 'Unit 12', topic: 'Protein Structure', q: 'Which level of protein structure is the 3D folding of a single polypeptide chain?', a: 'Tertiary', wrong: ['Primary', 'Secondary', 'Quaternary'] },
  { id: 1244, unit: 'Unit 12', topic: 'Protein Structure', q: 'Which level of protein structure involves multiple polypeptide chains together?', a: 'Quaternary', wrong: ['Primary', 'Secondary', 'Tertiary'] },

  // Mutations
  { id: 1245, unit: 'Unit 12', topic: 'Mutations', q: 'If a mutation changes TAC to TAG, what happens to the mRNA?', a: 'AUG changes to AUC', wrong: ['AUG changes to AUG', 'TAG changes to TAC', 'Nothing changes'] },
  { id: 1246, unit: 'Unit 12', topic: 'Mutations', q: 'What happens if a protein folds incorrectly?', a: 'It won\'t function properly and could cause disease', wrong: ['It works better than normal', 'It becomes larger', 'Nothing happens'] },
  { id: 1247, unit: 'Unit 12', topic: 'Mutations', q: 'If a cell can\'t produce RNA polymerase, which process stops?', a: 'Transcription', wrong: ['Replication', 'Translation', 'Mutation'] },
  { id: 1248, unit: 'Unit 12', topic: 'Mutations', q: 'What happens during replication if helicase doesn\'t work?', a: 'DNA cannot unzip so replication stops', wrong: ['Replication speeds up', 'Only one strand is copied', 'The cell divides faster'] },
  { id: 1249, unit: 'Unit 12', topic: 'Mutations', q: 'Why might a mutation NOT affect the protein produced?', a: 'Multiple codons can code for the same amino acid (silent mutation)', wrong: ['Mutations always change proteins', 'The DNA repairs itself immediately', 'Proteins ignore mutations'] },
  { id: 1250, unit: 'Unit 12', topic: 'Mutations', q: 'What type of mutation occurs when a codon changes but codes for the same amino acid?', a: 'Silent mutation', wrong: ['Missense mutation', 'Nonsense mutation', 'Frameshift mutation'] },
  { id: 1251, unit: 'Unit 12', topic: 'Mutations', q: 'What type of mutation creates an early stop codon?', a: 'Nonsense mutation', wrong: ['Silent mutation', 'Missense mutation', 'Beneficial mutation'] },
  { id: 1252, unit: 'Unit 12', topic: 'Mutations', q: 'What would happen if a stop codon mutated into a regular codon?', a: 'The protein would be too long and likely nonfunctional', wrong: ['The protein would be shorter', 'Nothing would change', 'The protein would work better'] },

  // Higher Level Concepts
  { id: 1253, unit: 'Unit 12', topic: 'Concepts', q: 'What enzyme is used in DNA replication but NOT in transcription?', a: 'DNA polymerase', wrong: ['RNA polymerase', 'Helicase', 'Both use the same enzymes'] },
  { id: 1254, unit: 'Unit 12', topic: 'Concepts', q: 'What is the purpose of DNA replication?', a: 'To copy DNA for cell division', wrong: ['To make proteins', 'To create mRNA', 'To break down nucleotides'] },
  { id: 1255, unit: 'Unit 12', topic: 'Concepts', q: 'What is the purpose of transcription?', a: 'To make mRNA from DNA', wrong: ['To copy DNA', 'To make proteins', 'To break down DNA'] },
  { id: 1256, unit: 'Unit 12', topic: 'Concepts', q: 'How does DNA control cell activities?', a: 'DNA → mRNA → protein, and proteins do all the cell\'s work', wrong: ['DNA directly performs cell functions', 'DNA breaks down into nutrients', 'DNA only stores information without affecting the cell'] },
  { id: 1257, unit: 'Unit 12', topic: 'Concepts', q: 'Why are proteins called the "workers" of the cell?', a: 'They perform nearly all cell functions - enzymes, structure, transport, signaling', wrong: ['They are made of sugar', 'They store genetic information', 'They only provide energy'] },
  { id: 1258, unit: 'Unit 12', topic: 'Concepts', q: 'Where does replication occur?', a: 'Nucleus', wrong: ['Ribosome', 'Cytoplasm', 'Cell membrane'] },
  { id: 1259, unit: 'Unit 12', topic: 'Concepts', q: 'Which process occurs at the ribosome?', a: 'Translation', wrong: ['Transcription', 'Replication', 'Mutation'] },

  // Word Roots - Set 1
  { id: 250, unit: 'Roots', topic: 'Set 1', q: 'What does the prefix A- (AN-) mean?', a: 'Without, not', wrong: ['With, together', 'Before', 'Against'] },
  { id: 251, unit: 'Roots', topic: 'Set 1', q: 'What does the suffix -ITIS mean?', a: 'Inflammation', wrong: ['Study of', 'Condition of', 'Removal of'] },
  { id: 252, unit: 'Roots', topic: 'Set 1', q: 'What does the root FLOR-/FLORA- mean?', a: 'Flower', wrong: ['Leaf', 'Fruit', 'Seed'] },
  { id: 253, unit: 'Roots', topic: 'Set 1', q: 'What does SYNTHESIS mean?', a: 'Putting together', wrong: ['Breaking apart', 'Moving across', 'Looking at'] },
  { id: 254, unit: 'Roots', topic: 'Set 1', q: 'What does the root GLYCO- mean?', a: 'Sugar', wrong: ['Fat', 'Protein', 'Water'] },
  { id: 255, unit: 'Roots', topic: 'Set 1', q: 'What does the root ARTERIO- mean?', a: 'To do with arteries', wrong: ['To do with veins', 'To do with bones', 'To do with nerves'] },
  { id: 256, unit: 'Roots', topic: 'Set 1', q: 'What does the root CHROME- mean?', a: 'Color, colored', wrong: ['Time', 'Shape', 'Light'] },
  { id: 257, unit: 'Roots', topic: 'Set 1', q: 'What does the prefix OMNI- mean?', a: 'All', wrong: ['One', 'Many', 'None'] },
  { id: 258, unit: 'Roots', topic: 'Set 1', q: 'What does the root ERYTHRO- mean?', a: 'Reddish', wrong: ['Bluish', 'Whitish', 'Yellowish'] },
  { id: 259, unit: 'Roots', topic: 'Set 1', q: 'What does the root OO- mean?', a: 'Egg', wrong: ['Eye', 'Bone', 'Cell'] },

  // Word Roots - Set 2
  { id: 100, unit: 'Roots', topic: 'Set 2', q: 'What does the root SPORO- mean?', a: 'Seed', wrong: ['Leaf', 'Root', 'Flower'] },
  { id: 101, unit: 'Roots', topic: 'Set 2', q: 'What does the root PHAGO- mean?', a: 'Eat, eater of', wrong: ['Drink', 'Breathe', 'Move'] },
  { id: 102, unit: 'Roots', topic: 'Set 2', q: 'What does the suffix -OID mean?', a: 'Resembling, like', wrong: ['Without', 'Full of', 'Against'] },
  { id: 103, unit: 'Roots', topic: 'Set 2', q: 'What does the root SACCHARIDE- mean?', a: 'Sugar', wrong: ['Salt', 'Fat', 'Protein'] },
  { id: 104, unit: 'Roots', topic: 'Set 2', q: 'What does the root VASO- mean?', a: 'Blood vessel', wrong: ['Blood cell', 'Bone', 'Nerve'] },
  { id: 105, unit: 'Roots', topic: 'Set 2', q: 'What does the suffix -POIESIS mean?', a: 'Making', wrong: ['Breaking', 'Carrying', 'Cutting'] },
  { id: 106, unit: 'Roots', topic: 'Set 2', q: 'What does the root HEPATO- mean?', a: 'Liver', wrong: ['Heart', 'Kidney', 'Stomach'] },
  { id: 107, unit: 'Roots', topic: 'Set 2', q: 'What does the root CEPHALO- mean?', a: 'Head, anterior', wrong: ['Tail, posterior', 'Side', 'Back'] },
  { id: 108, unit: 'Roots', topic: 'Set 2', q: 'What does the root MELANO- mean?', a: 'Dark, black, with color', wrong: ['Light, white', 'Red', 'Yellow'] },
  { id: 109, unit: 'Roots', topic: 'Set 2', q: 'What does the suffix -STASIS mean?', a: 'Condition of', wrong: ['Movement of', 'Creation of', 'Destruction of'] },

  // Word Roots - Set 3
  { id: 300, unit: 'Roots', topic: 'Set 3', q: 'What does the root TROPH mean?', a: 'Food, place of eating', wrong: ['Across, beyond', 'Animal', 'Skin, layer'] },
  { id: 301, unit: 'Roots', topic: 'Set 3', q: 'What does the prefix TRANS- mean?', a: 'Across', wrong: ['Together', 'Food', 'Time'] },
  { id: 302, unit: 'Roots', topic: 'Set 3', q: 'What does the root ZOO mean?', a: 'Animal', wrong: ['Salt, the sea', 'Flesh', 'Ancient, first'] },
  { id: 303, unit: 'Roots', topic: 'Set 3', q: 'What does the root DERM- mean?', a: 'Skin, layer', wrong: ['Time', 'Bound, tied', 'Food'] },
  { id: 304, unit: 'Roots', topic: 'Set 3', q: 'What does the root CHRON- mean?', a: 'Time', wrong: ['Together', 'Across', 'Flesh'] },
  { id: 305, unit: 'Roots', topic: 'Set 3', q: 'What does the prefix SYN- mean?', a: 'Together', wrong: ['Time', 'Skin, layer', 'Across'] },
  { id: 306, unit: 'Roots', topic: 'Set 3', q: 'What does the root LIGA- mean?', a: 'Bound, tied, a bond', wrong: ['Salt, the sea', 'Ancient, first', 'Food'] },
  { id: 307, unit: 'Roots', topic: 'Set 3', q: 'What does the root HALO- (IO) mean?', a: 'Salt, the sea', wrong: ['Animal', 'Flesh', 'Time'] },
  { id: 308, unit: 'Roots', topic: 'Set 3', q: 'What does the root ARCH- (EO) mean?', a: 'Ancient, first', wrong: ['Bound, tied, a bond', 'Skin, layer', 'Together'] },
  { id: 309, unit: 'Roots', topic: 'Set 3', q: 'What does the root CARNI- mean?', a: 'Flesh', wrong: ['Animal', 'Food', 'Ancient, first'] },

  // Word Roots - Set 4
  { id: 120, unit: 'Roots', topic: 'Set 4', q: 'What does the prefix DEUTERO- mean?', a: 'Second', wrong: ['First', 'Third', 'Last'] },
  { id: 121, unit: 'Roots', topic: 'Set 4', q: 'What does the root CRANIO- mean?', a: 'Skull', wrong: ['Spine', 'Rib', 'Jaw'] },
  { id: 122, unit: 'Roots', topic: 'Set 4', q: 'What does the prefix PARA- mean?', a: 'Beside, beyond', wrong: ['Within', 'Above', 'Against'] },
  { id: 123, unit: 'Roots', topic: 'Set 4', q: 'What does the root MORPH- mean?', a: 'Form, shape', wrong: ['Color', 'Size', 'Movement'] },
  { id: 124, unit: 'Roots', topic: 'Set 4', q: 'What does the prefix INFRA- mean?', a: 'Under, below', wrong: ['Above', 'Beside', 'Within'] },
  { id: 125, unit: 'Roots', topic: 'Set 4', q: 'What does the root GASTRO- mean?', a: 'Stomach', wrong: ['Heart', 'Lung', 'Liver'] },
  { id: 126, unit: 'Roots', topic: 'Set 4', q: 'What does the root PINO- mean?', a: 'Drink, take in liquid', wrong: ['Eat, take in solid', 'Breathe', 'Excrete'] },
  { id: 127, unit: 'Roots', topic: 'Set 4', q: 'What does the root PHYTO- mean?', a: 'Plant', wrong: ['Animal', 'Fungi', 'Bacteria'] },
  { id: 128, unit: 'Roots', topic: 'Set 4', q: 'What does the root ADIPO- mean?', a: 'Fat', wrong: ['Sugar', 'Protein', 'Water'] },
  { id: 129, unit: 'Roots', topic: 'Set 4', q: 'What does the root CAUD- mean?', a: 'Tail', wrong: ['Head', 'Arm', 'Foot'] },

  // Word Roots - Set 5
  { id: 140, unit: 'Roots', topic: 'Set 5', q: 'What does the prefix XENO- mean?', a: 'Strange, stranger', wrong: ['Familiar', 'Ancient', 'Small'] },
  { id: 141, unit: 'Roots', topic: 'Set 5', q: 'What does the root VENTRA- mean?', a: 'Underside, belly', wrong: ['Top, back', 'Side', 'Head'] },
  { id: 142, unit: 'Roots', topic: 'Set 5', q: 'What does the suffix -CIDE mean?', a: 'Killer', wrong: ['Maker', 'Lover', 'Eater'] },
  { id: 143, unit: 'Roots', topic: 'Set 5', q: 'What does the root KINE(SIS) mean?', a: 'Movement', wrong: ['Rest', 'Growth', 'Division'] },
  { id: 144, unit: 'Roots', topic: 'Set 5', q: 'What does the root PERIOD mean?', a: 'Regularly occurring event', wrong: ['One-time event', 'Rare occurrence', 'Ending'] },
  { id: 145, unit: 'Roots', topic: 'Set 5', q: 'What does the root LATERO- mean?', a: 'Side', wrong: ['Top', 'Bottom', 'Center'] },
  { id: 146, unit: 'Roots', topic: 'Set 5', q: 'What does the root MYC(O)- mean?', a: 'Dealing with fungi', wrong: ['Dealing with bacteria', 'Dealing with viruses', 'Dealing with plants'] },
  { id: 147, unit: 'Roots', topic: 'Set 5', q: 'What does the root CYTO- mean?', a: 'Cell', wrong: ['Tissue', 'Organ', 'Bone'] },
  { id: 148, unit: 'Roots', topic: 'Set 5', q: 'What does the root DORSA- mean?', a: 'Above, back', wrong: ['Underside, belly', 'Side', 'Front'] },
  { id: 149, unit: 'Roots', topic: 'Set 5', q: 'What does the root MYO- mean?', a: 'Muscle tissue', wrong: ['Bone tissue', 'Nerve tissue', 'Fat tissue'] },

  // Word Roots - Set 6
  { id: 160, unit: 'Roots', topic: 'Set 6', q: 'What does the root OSTEO- mean?', a: 'Bone, calcified', wrong: ['Muscle', 'Tissue', 'Joint'] },
  { id: 161, unit: 'Roots', topic: 'Set 6', q: 'What does the root SCLERA(O)- mean?', a: 'Hard, hardened', wrong: ['Soft', 'Flat', 'Round'] },
  { id: 162, unit: 'Roots', topic: 'Set 6', q: 'What does the prefix TELE- mean?', a: 'Far, distant', wrong: ['Near, close', 'End', 'Beginning'] },
  { id: 163, unit: 'Roots', topic: 'Set 6', q: 'What does the suffix -PHORESIS mean?', a: 'Carrying, transmission', wrong: ['Breaking', 'Building', 'Cutting'] },
  { id: 164, unit: 'Roots', topic: 'Set 6', q: 'What does the suffix -PLASM mean?', a: 'Fluid substance', wrong: ['Solid body', 'Gas', 'Hard shell'] },
  { id: 165, unit: 'Roots', topic: 'Set 6', q: 'What does the root STOME(A) mean?', a: 'Mouth, oral opening', wrong: ['Eye', 'Ear', 'Nose'] },
  { id: 166, unit: 'Roots', topic: 'Set 6', q: 'What does the root APEX mean?', a: 'Tip, extremity', wrong: ['Base, bottom', 'Middle', 'Side'] },
  { id: 167, unit: 'Roots', topic: 'Set 6', q: 'What does the root LIPO- mean?', a: 'Fat', wrong: ['Sugar', 'Protein', 'Water'] },
  { id: 168, unit: 'Roots', topic: 'Set 6', q: 'What does the prefix NEO- mean?', a: 'New', wrong: ['Old', 'First', 'Last'] },
  { id: 169, unit: 'Roots', topic: 'Set 6', q: 'What does the root HEMO- mean?', a: 'Blood', wrong: ['Bone', 'Tissue', 'Muscle'] },

  // Word Roots - Set 7
  { id: 180, unit: 'Roots', topic: 'Set 7', q: 'What does the root HISTO- mean?', a: 'Tissue', wrong: ['Bone', 'Blood', 'History'] },
  { id: 181, unit: 'Roots', topic: 'Set 7', q: 'What does the prefix ISO- mean?', a: 'Same, equal', wrong: ['Different', 'Half', 'Many'] },
  { id: 182, unit: 'Roots', topic: 'Set 7', q: 'What does the suffix -PLAST mean?', a: 'Formed, body', wrong: ['Broken', 'Flat', 'Small'] },
  { id: 183, unit: 'Roots', topic: 'Set 7', q: 'What does the suffix -ICLE mean?', a: 'Little', wrong: ['Large', 'Many', 'Without'] },
  { id: 184, unit: 'Roots', topic: 'Set 7', q: 'What does the prefix PSEUDO- mean?', a: 'Not as it appears, false', wrong: ['True, real', 'Ancient', 'New'] },
  { id: 185, unit: 'Roots', topic: 'Set 7', q: 'What does the root SAPRO- mean?', a: 'Rotten, decomposing', wrong: ['Fresh, new', 'Sweet', 'Hard'] },
  { id: 186, unit: 'Roots', topic: 'Set 7', q: 'What does the root PLATY- mean?', a: 'Flat, flattened', wrong: ['Round', 'Tall', 'Thick'] },
  { id: 187, unit: 'Roots', topic: 'Set 7', q: 'What does the prefix SUPER- mean?', a: 'Above', wrong: ['Below', 'Within', 'Between'] },
  { id: 188, unit: 'Roots', topic: 'Set 7', q: 'What does the root XANTHO- mean?', a: 'Yellow, lacking dark', wrong: ['Green', 'Red', 'White'] },
  { id: 189, unit: 'Roots', topic: 'Set 7', q: 'What does the prefix EU- mean?', a: 'True, good', wrong: ['False', 'Bad', 'New'] },

  // Word Roots - Set 8
  { id: 200, unit: 'Roots', topic: 'Set 8', q: 'What does the root ANTHRO- mean?', a: 'Dealing with humans', wrong: ['Dealing with animals', 'Dealing with plants', 'Dealing with water'] },
  { id: 201, unit: 'Roots', topic: 'Set 8', q: 'What does the root CHLORO- mean?', a: 'Green', wrong: ['Red', 'Blue', 'Yellow'] },
  { id: 202, unit: 'Roots', topic: 'Set 8', q: 'What does the root HAP(LO)- mean?', a: 'Half', wrong: ['Whole', 'Double', 'Many'] },
  { id: 203, unit: 'Roots', topic: 'Set 8', q: 'What does the root LEUCO- mean?', a: 'White', wrong: ['Black', 'Red', 'Green'] },
  { id: 204, unit: 'Roots', topic: 'Set 8', q: 'What does the prefix MESO- mean?', a: 'Middle', wrong: ['End', 'Beginning', 'Outside'] },
  { id: 205, unit: 'Roots', topic: 'Set 8', q: 'What does the root ONCO- mean?', a: 'Tumor, cancer', wrong: ['Bone', 'Blood', 'Nerve'] },
  { id: 206, unit: 'Roots', topic: 'Set 8', q: 'What does the prefix PROTO- mean?', a: 'First, earliest form', wrong: ['Last', 'Many', 'New'] },
  { id: 207, unit: 'Roots', topic: 'Set 8', q: 'What does the root ICHTHYS mean?', a: 'Fish', wrong: ['Bird', 'Reptile', 'Insect'] },
  { id: 208, unit: 'Roots', topic: 'Set 8', q: 'What does the root GRAM/GRAPH mean?', a: 'Write, record', wrong: ['Read', 'Speak', 'Listen'] },
  { id: 209, unit: 'Roots', topic: 'Set 8', q: 'What does the suffix -FUGE mean?', a: 'Drives away or out', wrong: ['Brings together', 'Holds in place', 'Breaks apart'] },

  // Word Roots - Set 9
  { id: 220, unit: 'Roots', topic: 'Set 9', q: 'What does the prefix ECTO- mean?', a: 'Outside of', wrong: ['Inside of', 'Upon, over', 'Between'] },
  { id: 221, unit: 'Roots', topic: 'Set 9', q: 'What does the prefix DIPLO- mean?', a: 'In pairs, doubled', wrong: ['Single', 'Many', 'Half'] },
  { id: 222, unit: 'Roots', topic: 'Set 9', q: 'What does the root HOMEO-/HOMO- mean?', a: 'Similar, constant', wrong: ['Different', 'Changing', 'Opposite'] },
  { id: 223, unit: 'Roots', topic: 'Set 9', q: 'What does the prefix HETERO- mean?', a: 'Different', wrong: ['Similar, constant', 'Same', 'Equal'] },
  { id: 224, unit: 'Roots', topic: 'Set 9', q: 'What does the root STALSIS mean?', a: 'Constriction, compression', wrong: ['Expansion', 'Movement', 'Division'] },
  { id: 225, unit: 'Roots', topic: 'Set 9', q: 'What does the prefix EPI- mean?', a: 'Upon, over, on', wrong: ['Under, below', 'Within, inside of', 'Outside of'] },
  { id: 226, unit: 'Roots', topic: 'Set 9', q: 'What does the prefix ENDO- mean?', a: 'Within, inside of', wrong: ['Outside of', 'Upon, over', 'Between'] },
  { id: 227, unit: 'Roots', topic: 'Set 9', q: 'What does the root LYSO-/LYSE mean?', a: 'Decompose, cut', wrong: ['Build, create', 'Move', 'Grow'] },
  { id: 228, unit: 'Roots', topic: 'Set 9', q: 'What does the root GEN- mean?', a: 'To produce', wrong: ['To destroy', 'To move', 'To eat'] },
  { id: 229, unit: 'Roots', topic: 'Set 9', q: 'What does the suffix -PHYLL mean?', a: 'Leaf', wrong: ['Flower', 'Root', 'Stem'] },

  // Word Roots - Set 10
  { id: 270, unit: 'Roots', topic: 'Set 10', q: 'What does the root THERM mean?', a: 'Heat', wrong: ['Cold', 'Light', 'Energy'] },
  { id: 271, unit: 'Roots', topic: 'Set 10', q: 'What does the prefix HOLO- mean?', a: 'Entire', wrong: ['Half', 'Empty', 'Sacred'] },
  { id: 272, unit: 'Roots', topic: 'Set 10', q: 'What does the root POD- mean?', a: 'Foot', wrong: ['Hand', 'Head', 'Arm'] },
  { id: 273, unit: 'Roots', topic: 'Set 10', q: 'What does the root TELO- mean?', a: 'End', wrong: ['Beginning', 'Middle', 'Far'] },
  { id: 274, unit: 'Roots', topic: 'Set 10', q: 'What does the root AERO- mean?', a: 'Air', wrong: ['Water', 'Earth', 'Fire'] },
  { id: 275, unit: 'Roots', topic: 'Set 10', q: 'What does the prefix AMPHI- mean?', a: 'Two', wrong: ['One', 'Many', 'Half'] },
  { id: 276, unit: 'Roots', topic: 'Set 10', q: 'What does the root PALEO- mean?', a: 'Long ago, ancient', wrong: ['New, recent', 'Small', 'Large'] },
  { id: 277, unit: 'Roots', topic: 'Set 10', q: 'What does the suffix -MYCES mean?', a: 'Fungi', wrong: ['Bacteria', 'Virus', 'Plant'] },
  { id: 278, unit: 'Roots', topic: 'Set 10', q: 'What does the root CHORDA- mean?', a: 'String, cord', wrong: ['Bone', 'Muscle', 'Skin'] },
  { id: 279, unit: 'Roots', topic: 'Set 10', q: 'What does the root PULM(O)- mean?', a: 'Lung', wrong: ['Heart', 'Stomach', 'Kidney'] },
];

const allQuestions = questions;

// Deep explanations for tricky questions (Learn mode)
const explanations: {[id: number]: string} = {
  1125: "Mendel crossed pea plants that differed in TWO traits (like seed shape AND seed color). In the F2 generation, he got a 9:3:3:1 ratio. Here's why: each trait follows a 3:1 ratio on its own. When you combine two independent 3:1 ratios, you multiply them out: (3+1) × (3+1) = 9+3+3+1 = 16 possible combinations. 9 show both dominant traits, 3 show one dominant + one recessive, 3 show the other combo, and 1 shows both recessive. Think of it like flipping two coins at once — you're combining two independent probabilities.",
  1115: "Each coin flip has a 1/2 chance of heads. For three flips IN A ROW, you multiply the probabilities: 1/2 × 1/2 × 1/2 = 1/8. This is because each flip is independent — the coin doesn't \"remember\" what happened before. Same logic applies in genetics: the probability of inheriting multiple independent traits = multiply each individual probability together.",
  1129: "This is INCOMPLETE DOMINANCE. Unlike regular dominance where one allele completely masks the other, here neither allele is fully dominant. The red allele (R) and white allele (W) blend together, producing an intermediate phenotype: pink. It's like mixing red and white paint. The genotype RW creates a phenotype that's in between the two parents. If you cross two pink flowers (RW × RW), you get 1 red : 2 pink : 1 white — the 1:2:1 ratio is the hallmark of incomplete dominance.",
  1135: "Polygenic means \"many genes.\" Instead of one gene controlling one trait (like Mendel's pea plants), a polygenic trait is controlled by two or more genes working together. Each gene adds a little bit to the final result. Think of it like a dimmer switch instead of an on/off light switch. Examples: skin color, height, eye color, hair color. That's why these traits have so many variations instead of just two options.",
  1108: "The Principle of Segregation says that during gamete formation (making sperm/eggs), the two alleles for each gene SEPARATE from each other. So each gamete only carries ONE allele for each trait. Think of it this way: you have two copies of every gene (one from mom, one from dad). When you make reproductive cells, those pairs split up so each egg or sperm only gets one copy. When fertilization happens, the pair is restored — one from each parent.",
  1131: "This is CODOMINANCE — different from incomplete dominance! Instead of blending into a middle color (like pink), BOTH alleles are fully expressed at the same time. So a black chicken × white chicken = speckled/checkered with distinct black AND white feathers. Both colors show up completely, side by side. The key difference: incomplete dominance = blending (red + white = pink). Codominance = both showing fully (black + white = black AND white spots).",
  1134: "The Himalayan rabbit is a perfect example of how ENVIRONMENT affects gene expression. The gene for fur color is temperature-sensitive. At cooler body temperatures (ears, nose, tail, feet — the extremities), the gene activates and produces dark pigment. At warmer core body temperatures, the gene is inactive, so the fur stays white. The rabbit's genotype is the same everywhere, but the phenotype changes based on temperature. This proves genes don't work in isolation — the environment matters!",
  1141: "Just like the Himalayan rabbit, the buckeye butterfly shows how environment influences phenotype. The temperature during the caterpillar/chrysalis stage affects what color pattern the adult butterfly develops. Warmer temperatures produce different wing patterns than cooler ones. Same DNA, different result depending on conditions. This is why butterflies born in summer can look different from those born in fall — the genes are identical, but temperature during development changes how they're expressed.",
  1126: "The Principle of Independent Assortment came from Mendel's dihybrid crosses. It states that genes for different traits are inherited INDEPENDENTLY of each other. During gamete formation, the allele you get for seed shape has nothing to do with which allele you get for seed color. They sort into gametes randomly and independently. This only works for genes on DIFFERENT chromosomes (genes on the same chromosome can be linked). This principle is why you can have any combination of your parents' traits — you're not stuck inheriting them as a package deal.",
  1114: "Probability is just the mathematical likelihood that something will happen. In genetics, we use it to predict offspring ratios. A probability of 1 means it WILL happen, 0 means it WON'T, and 0.5 (or 1/2) means 50-50 chance. Mendel used probability to understand inheritance patterns — like how a monohybrid cross gives a 3:1 ratio means there's a 3/4 (75%) probability of the dominant phenotype and a 1/4 (25%) probability of the recessive phenotype.",
  1151: "Draw the Punnett square: Aa × Aa gives AA, Aa, Aa, aa. Only AA (1 out of 4) is both unaffected AND not a carrier. That's 25%. The Aa kids are unaffected but still carry the recessive allele.",
  1152: "From the Punnett square Aa × Aa: you get AA, Aa, Aa, aa. Two out of four are Aa (carriers). They don't show the disorder but carry one copy of the recessive allele. That's 50%.",
  1153: "Dominant phenotype means they LOOK normal (don't show the disorder). From Aa × Aa: AA, Aa, and Aa all show the dominant phenotype. That's 3 out of 4 = 75%. Only aa (1/4) shows the recessive disorder.",
  1154: "Affected means homozygous recessive (aa). From Aa × Aa: only 1 out of 4 boxes in the Punnett square is aa. That's 25% or a 1-in-4 chance.",
};
const uniqueQuestions = allQuestions; // alias for compatibility

// Millionaire prize ladder
const MILLIONAIRE_PRIZES = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];
const MILLIONAIRE_SAFE = [4, 9];

// Stats tracking
type QuestionStats = { [questionId: number]: { correct: number; incorrect: number; lastSeen: number } };
const STORAGE_KEY = 'biology-study-stats';
const HIGHSCORE_KEY = 'biology-highscores';

type HighScores = {
  speed: number;
  millionaire: number;
  bomb: number;
  challenge: number;
  snake: number;
  memory: number; // lower is better
};

function loadStats(): QuestionStats {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
}

function saveStats(stats: QuestionStats) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch { /* ignore */ }
}

function loadHighScores(): HighScores {
  if (typeof window === 'undefined') return { speed: 0, millionaire: 0, bomb: 0, challenge: 0, snake: 0, memory: 999 };
  try {
    const saved = localStorage.getItem(HIGHSCORE_KEY);
    return saved ? JSON.parse(saved) : { speed: 0, millionaire: 0, bomb: 0, challenge: 0, snake: 0, memory: 999 };
  } catch { return { speed: 0, millionaire: 0, bomb: 0, challenge: 0, snake: 0, memory: 999 }; }
}

function saveHighScores(scores: HighScores) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(HIGHSCORE_KEY, JSON.stringify(scores));
  } catch { /* ignore */ }
}

function isTooSimilar(a: string, b: string): boolean {
  const aLower = a.toLowerCase().trim();
  const bLower = b.toLowerCase().trim();
  // Exact match
  if (aLower === bLower) return true;
  // One contains the other
  if (aLower.includes(bLower) || bLower.includes(aLower)) return true;
  // Same first word (for short answers)
  const aFirst = aLower.split(' ')[0];
  const bFirst = bLower.split(' ')[0];
  if (aFirst.length > 3 && aFirst === bFirst) return true;
  // Similar root words (mitochondria/mitochondrion, hypotonic/hypertonic)
  if (aFirst.length > 5 && bFirst.length > 5 && aFirst.slice(0, 5) === bFirst.slice(0, 5)) return true;
  return false;
}

function isTrueFalse(correct: string, wrong?: string[]): boolean {
  const tf = ['True', 'False'];
  return tf.includes(correct) && (wrong || []).every(w => tf.includes(w));
}

function getWrongAnswers(correctAnswer: string, topic: string, questionWrong?: string[]): string[] {
  // True/False questions: only return True or False
  if (isTrueFalse(correctAnswer, questionWrong)) {
    return questionWrong || [correctAnswer === 'True' ? 'False' : 'True'];
  }
  
  // Use curated wrong answers if available
  if (questionWrong && questionWrong.length >= 3) {
    return shuffle(questionWrong).slice(0, 3);
  }
  
  // Fallback to old method
  const allAnswers = uniqueQuestions.map(q => q.a);
  const topicAnswers = uniqueQuestions.filter(q => q.topic === topic).map(q => q.a);
  
  const filterSimilar = (pool: string[]) => {
    const result: string[] = [];
    for (const answer of pool) {
      if (isTooSimilar(answer, correctAnswer)) continue;
      if (result.some(r => isTooSimilar(r, answer))) continue;
      result.push(answer);
    }
    return result;
  };
  
  let pool = filterSimilar(topicAnswers);
  if (pool.length < 3) {
    const otherAnswers = allAnswers.filter(a => !topicAnswers.includes(a));
    pool = [...pool, ...filterSimilar(otherAnswers)];
  }
  
  return pool.sort(() => Math.random() - 0.5).slice(0, 3);
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Simple crossword generator
function generateCrossword(questions: typeof uniqueQuestions) {
  // Filter to single-word answers only
  const singleWord = questions.filter(q => !q.a.includes(' ') && q.a.length >= 3 && q.a.length <= 15);
  if (singleWord.length < 4) return null;
  
  const shuffled = shuffle(singleWord).slice(0, 8);
  const gridSize = 15;
  const grid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
  const placed: {word: string, clue: string, row: number, col: number, dir: 'across' | 'down'}[] = [];
  
  // Place first word horizontally in middle
  const first = shuffled[0];
  const startCol = Math.floor((gridSize - first.a.length) / 2);
  const startRow = Math.floor(gridSize / 2);
  for (let i = 0; i < first.a.length; i++) {
    grid[startRow][startCol + i] = first.a[i].toUpperCase();
  }
  placed.push({word: first.a.toUpperCase(), clue: first.q, row: startRow, col: startCol, dir: 'across'});
  
  // Try to place remaining words
  for (let w = 1; w < shuffled.length; w++) {
    const word = shuffled[w].a.toUpperCase();
    const clue = shuffled[w].q;
    let bestPlacement: {row: number, col: number, dir: 'across' | 'down'} | null = null;
    
    // Try to find intersection with existing words
    for (let i = 0; i < word.length; i++) {
      const letter = word[i];
      
      // Search grid for this letter
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          if (grid[r][c] === letter) {
            // Try placing vertically through this point
            const vStartRow = r - i;
            if (vStartRow >= 0 && vStartRow + word.length <= gridSize) {
              let canPlace = true;
              for (let j = 0; j < word.length; j++) {
                const checkRow = vStartRow + j;
                const existing = grid[checkRow][c];
                if (existing && existing !== word[j]) canPlace = false;
                // Check sides
                if (j !== i) {
                  if (c > 0 && grid[checkRow][c-1]) canPlace = false;
                  if (c < gridSize-1 && grid[checkRow][c+1]) canPlace = false;
                }
              }
              // Check before and after
              if (vStartRow > 0 && grid[vStartRow-1][c]) canPlace = false;
              if (vStartRow + word.length < gridSize && grid[vStartRow + word.length][c]) canPlace = false;
              
              if (canPlace) {
                bestPlacement = {row: vStartRow, col: c, dir: 'down'};
                break;
              }
            }
            
            // Try placing horizontally through this point
            const hStartCol = c - i;
            if (hStartCol >= 0 && hStartCol + word.length <= gridSize) {
              let canPlace = true;
              for (let j = 0; j < word.length; j++) {
                const checkCol = hStartCol + j;
                const existing = grid[r][checkCol];
                if (existing && existing !== word[j]) canPlace = false;
                // Check above and below
                if (j !== i) {
                  if (r > 0 && grid[r-1][checkCol]) canPlace = false;
                  if (r < gridSize-1 && grid[r+1][checkCol]) canPlace = false;
                }
              }
              // Check before and after
              if (hStartCol > 0 && grid[r][hStartCol-1]) canPlace = false;
              if (hStartCol + word.length < gridSize && grid[r][hStartCol + word.length]) canPlace = false;
              
              if (canPlace && !bestPlacement) {
                bestPlacement = {row: r, col: hStartCol, dir: 'across'};
              }
            }
          }
          if (bestPlacement) break;
        }
        if (bestPlacement) break;
      }
      if (bestPlacement) break;
    }
    
    if (bestPlacement) {
      const {row, col, dir} = bestPlacement;
      for (let i = 0; i < word.length; i++) {
        if (dir === 'across') grid[row][col + i] = word[i];
        else grid[row + i][col] = word[i];
      }
      placed.push({word, clue, row, col, dir});
    }
  }
  
  if (placed.length < 3) return null;
  
  // Assign numbers
  const numbered: {[key: string]: number} = {};
  let num = 1;
  const across: {num: number, clue: string, answer: string, row: number, col: number}[] = [];
  const down: {num: number, clue: string, answer: string, row: number, col: number}[] = [];
  
  placed.sort((a, b) => a.row - b.row || a.col - b.col);
  for (const p of placed) {
    const key = `${p.row}-${p.col}`;
    if (!numbered[key]) {
      numbered[key] = num++;
    }
    if (p.dir === 'across') {
      across.push({num: numbered[key], clue: p.clue, answer: p.word, row: p.row, col: p.col});
    } else {
      down.push({num: numbered[key], clue: p.clue, answer: p.word, row: p.row, col: p.col});
    }
  }
  
  return {grid, across, down, placed};
}

type Mode = 'menu' | 'flashcards' | 'quiz' | 'learn' | 'match' | 'jeopardy' | 'speed' | 'millionaire' | 'review' | 'stats' | 'wheel' | 'bomb' | 'crossword' | 'practicetest' | 'challenge' | 'snake' | 'memory' | 'life';

function WheelResult({ currentQ, wheelGuessedLetters, wheelWrongGuesses, wheelScore, currentIndex, totalQuestions, wheelNextQuestion, startMode, getWheelDisplay, styles }: any) {
  const isWrong = getWheelDisplay(currentQ.a, wheelGuessedLetters).includes('_') || wheelWrongGuesses >= 6;
  const isLastQuestion = currentIndex >= totalQuestions - 1;

  useEffect(() => {
    if (!isLastQuestion) {
      const timer = setTimeout(() => wheelNextQuestion(), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isLastQuestion, wheelNextQuestion]);

  return (
    <div style={{textAlign: 'center'}}>
      <div style={{
        fontSize: '20px', fontWeight: 'bold', marginBottom: '16px',
        color: isWrong ? '#dc2626' : '#059669'
      }}>
        {isWrong ? (
          <>The answer was: <span style={{color: '#059669'}}>{currentQ.a}</span></>
        ) : (
          'You got it! 🎉'
        )}
      </div>
      {isLastQuestion ? (
        <div>
          <div style={{fontSize: '32px', fontWeight: 'bold', color: '#059669', marginBottom: '16px'}}>
            Done! {wheelScore} / {totalQuestions}
          </div>
          <button onClick={() => startMode('wheel')} style={styles.primaryBtn}>Play Again</button>
        </div>
      ) : (
        <div style={{fontSize: '14px', color: '#9ca3af', marginTop: '8px'}}>Next question in 2s...</div>
      )}
    </div>
  );
}

export default function StudyGuide() {
  const [mode, setMode] = useState<Mode>('menu');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState(uniqueQuestions);
  const [missedQuestions, setMissedQuestions] = useState<typeof uniqueQuestions>([]);
  const [quizChoices, setQuizChoices] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [stats, setStats] = useState<QuestionStats>({});
  
  // Match game state
  const [matchPairs, setMatchPairs] = useState<{q: string, a: string, qMatched: boolean, aMatched: boolean}[]>([]);
  const [selectedQ, setSelectedQ] = useState<string | null>(null);
  const [selectedA, setSelectedA] = useState<string | null>(null);
  const [matchScore, setMatchScore] = useState(0);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  
  // Jeopardy state
  const [jeopardyBoard, setJeopardyBoard] = useState<{[topic: string]: {points: number, question: typeof uniqueQuestions[0], answered: boolean, correct: boolean | null}[]}>({});
  const [jeopardyQuestion, setJeopardyQuestion] = useState<typeof uniqueQuestions[0] | null>(null);
  const [jeopardyPoints, setJeopardyPoints] = useState(0);
  const [jeopardyScore, setJeopardyScore] = useState(0);
  const [jeopardyRevealed, setJeopardyRevealed] = useState(false);
  const [jeopardyChoices, setJeopardyChoices] = useState<string[]>([]);
  const [jeopardySelected, setJeopardySelected] = useState<string | null>(null);
  const [jeopardyComplete, setJeopardyComplete] = useState(false);
  const [jeopardyReviewMode, setJeopardyReviewMode] = useState(false);
  const [jeopardyReviewIndex, setJeopardyReviewIndex] = useState(0);
  const [jeopardyReviewSelected, setJeopardyReviewSelected] = useState<string | null>(null);
  const [jeopardyReviewRevealed, setJeopardyReviewRevealed] = useState(false);
  const [jeopardyReviewChoices, setJeopardyReviewChoices] = useState<string[]>([]);
  const [jeopardyReviewCorrect, setJeopardyReviewCorrect] = useState(0);
  
  // Speed Round state
  const [speedTime, setSpeedTime] = useState(60);
  const [speedRunning, setSpeedRunning] = useState(false);
  const [speedScore, setSpeedScore] = useState(0);
  const [speedBest, setSpeedBest] = useState(0);
  const speedTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<{name: string, score: number, unit: string, ts: number}[]>([]);
  const [lbLoading, setLbLoading] = useState(false);
  const [lbName, setLbName] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('study-lb-name') || '';
  });
  const [lbSubmitted, setLbSubmitted] = useState(false);
  const [lbShowInput, setLbShowInput] = useState(false);

  const fetchLeaderboard = useCallback(async () => {
    setLbLoading(true);
    try {
      const unit = selectedUnit === 'All' ? 'all' : selectedUnit.replace(' ', '-').toLowerCase();
      const res = await fetch(`/.netlify/functions/leaderboard?unit=${unit}`);
      const data = await res.json();
      setLeaderboard(data);
    } catch { setLeaderboard([]); }
    setLbLoading(false);
  }, [selectedUnit]);

  const submitScore = async (score: number) => {
    if (!lbName.trim()) return;
    localStorage.setItem('study-lb-name', lbName.trim());
    try {
      const unit = selectedUnit === 'All' ? 'all' : selectedUnit.replace(' ', '-').toLowerCase();
      await fetch('/.netlify/functions/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: lbName.trim(), score, unit }),
      });
      setLbSubmitted(true);
      fetchLeaderboard();
    } catch { /* silent */ }
  };
  
  // Millionaire state
  const [millionaireLevel, setMillionaireLevel] = useState(0);
  const [millionaireChoices, setMillionaireChoices] = useState<string[]>([]);
  const [millionaireSelected, setMillionaireSelected] = useState<string | null>(null);
  const [millionaireRevealed, setMillionaireRevealed] = useState(false);
  const [millionaireGameOver, setMillionaireGameOver] = useState(false);
  const [millionaireFiftyFifty, setMillionaireFiftyFifty] = useState(true);
  const [millionaireSkip, setMillionaireSkip] = useState(true);
  const [millionaireFinalPrize, setMillionaireFinalPrize] = useState(0);
  
  // Wheel of Fortune state
  const [wheelGuessedLetters, setWheelGuessedLetters] = useState<string[]>([]);
  const [wheelWrongGuesses, setWheelWrongGuesses] = useState(0);
  const [wheelSolved, setWheelSolved] = useState(false);
  const [wheelInput, setWheelInput] = useState('');
  const [wheelScore, setWheelScore] = useState(0);

  // Crossword state
  const [crosswordGrid, setCrosswordGrid] = useState<string[][]>([]);
  const [crosswordAnswers, setCrosswordAnswers] = useState<{[key: string]: string}>({});
  const [crosswordClues, setCrosswordClues] = useState<{across: {num: number, clue: string, answer: string, row: number, col: number}[], down: {num: number, clue: string, answer: string, row: number, col: number}[]}>({across: [], down: []});
  const [crosswordInputs, setCrosswordInputs] = useState<{[key: string]: string}>({});
  const [crosswordChecked, setCrosswordChecked] = useState(false);
  const [crosswordScore, setCrosswordScore] = useState(0);

  // Bomb Defusal state
  const [bombTime, setBombTime] = useState(60);
  const [bombRunning, setBombRunning] = useState(false);
  const [bombWiresTotal, setBombWiresTotal] = useState(10);
  const [bombWiresCut, setBombWiresCut] = useState(0);
  const [bombExploded, setBombExploded] = useState(false);
  const [bombDefused, setBombDefused] = useState(false);
  const [bombShake, setBombShake] = useState(false);
  const [bombFlash, setBombFlash] = useState('');
  const bombTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Practice Test state (Canvas LMS style)
  const [practiceTestAnswers, setPracticeTestAnswers] = useState<{[key: number]: string}>({});
  const [practiceTestSubmitted, setPracticeTestSubmitted] = useState(false);
  const [practiceTestScore, setPracticeTestScore] = useState(0);
  const [practiceTestTime, setPracticeTestTime] = useState(1200); // 20 minutes
  const [practiceTestRunning, setPracticeTestRunning] = useState(false);
  const practiceTestTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Challenge mode state
  const [challengeTime, setChallengeTime] = useState(300); // 5 minutes
  const [challengeRunning, setChallengeRunning] = useState(false);
  const [challengeScore, setChallengeScore] = useState(0);
  const [challengeStreak, setChallengeStreak] = useState(0);
  const [challengeBestStreak, setChallengeBestStreak] = useState(0);
  const [challengeWrong, setChallengeWrong] = useState(0);
  const [challengeGameOver, setChallengeGameOver] = useState(false);
  const challengeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Snake game state
  const [snakeBody, setSnakeBody] = useState<{x: number, y: number}[]>([{x: 10, y: 10}]);
  const [snakeDir, setSnakeDir] = useState<'up' | 'down' | 'left' | 'right'>('right');
  const [snakeFood, setSnakeFood] = useState<{x: number, y: number}>({x: 15, y: 10});
  const [snakeRunning, setSnakeRunning] = useState(false);
  const [snakeGameOver, setSnakeGameOver] = useState(false);
  const [snakeScore, setSnakeScore] = useState(0);
  const [snakeShowQuestion, setSnakeShowQuestion] = useState(false);
  const [snakeQuestionIndex, setSnakeQuestionIndex] = useState(0);
  const snakeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const snakeDirRef = useRef<'up' | 'down' | 'left' | 'right'>('right');

  // Memory game state
  const [memoryCards, setMemoryCards] = useState<{id: number, type: 'q' | 'a', content: string, pairId: number, flipped: boolean, matched: boolean}[]>([]);
  const [memoryFlipped, setMemoryFlipped] = useState<number[]>([]);
  const [memoryMatches, setMemoryMatches] = useState(0);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryLocked, setMemoryLocked] = useState(false);

  // Bio Life game state - SIMPLIFIED BOARD GAME
  type LifePlayer = {
    name: string;
    color: string;
    emoji: string;
    position: number;
    money: number;
    career: { title: string; salary: number; emoji: string } | null;
    house: { name: string; value: number; emoji: string } | null;
    spouse: boolean;
    kids: number;
    correctAnswers: number;
  };
  const [lifePhase, setLifePhase] = useState<'setup' | 'spin' | 'question' | 'choice' | 'event' | 'summary'>('setup');
  const [lifePlayers, setLifePlayers] = useState<LifePlayer[]>([]);
  const [lifeCurrentPlayer, setLifeCurrentPlayer] = useState(0);
  const [lifeChoices, setLifeChoices] = useState<string[]>([]);
  const [lifeShowFeedback, setLifeShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [lifeGotItRight, setLifeGotItRight] = useState(false);
  const [lifeEvent, setLifeEvent] = useState<{text: string, emoji: string, effect: string} | null>(null);
  const [lifeMultiplayer, setLifeMultiplayer] = useState(false);
  const [lifePlayerCount, setLifePlayerCount] = useState(1);
  const [lifePlayerNames, setLifePlayerNames] = useState<string[]>(['Player 1', 'Player 2', 'Player 3', 'Player 4']);
  const [lifeGameLength, setLifeGameLength] = useState<'fast' | 'regular' | 'long'>('regular');
  const [lifeQuestionsCorrect, setLifeQuestionsCorrect] = useState(0); // Need 2 correct to move
  const [lifePendingMove, setLifePendingMove] = useState(false); // Track if we're in question phase before moving
  
  // Board spaces by game length
  const lifeBoardOptions = {
    fast: [ // 10 stops
      { type: 'start', label: 'Start', emoji: '🚀', goodChoice: null, badChoice: null },
      { type: 'choice', label: 'High School', emoji: '🎒', goodChoice: { text: 'Join Science Club', emoji: '🔬', money: 1000 }, badChoice: { text: 'Skip Class', emoji: '😴', money: -500 } },
      { type: 'career', label: 'First Job', emoji: '💼', goodChoice: { text: 'Research Scientist', emoji: '🔬', salary: 80000 }, badChoice: { text: 'Fast Food', emoji: '🍔', salary: 25000 } },
      { type: 'choice', label: 'Dating', emoji: '💕', goodChoice: { text: 'Find True Love', emoji: '💍', money: 5000, spouse: true }, badChoice: { text: 'Stay Single', emoji: '🎭', money: 0 } },
      { type: 'house', label: 'First Home', emoji: '🏠', goodChoice: { text: 'Nice House', emoji: '🏡', value: 200000 }, badChoice: { text: 'Tiny Apartment', emoji: '🏚️', value: 50000 } },
      { type: 'event', label: 'Bonus!', emoji: '💵', event: { text: 'Work bonus!', effect: '+$15,000', money: 15000 } },
      { type: 'choice', label: 'Family', emoji: '👨‍👩‍👧', goodChoice: { text: 'Have Kids', emoji: '👶', money: 0, kids: 2 }, badChoice: { text: 'Get a Dog', emoji: '🐕', money: -2000 } },
      { type: 'career', label: 'Promotion', emoji: '📈', goodChoice: { text: 'Director', emoji: '👔', salary: 150000 }, badChoice: { text: 'Stay Put', emoji: '📊', salary: 60000 } },
      { type: 'event', label: 'Lottery!', emoji: '🎰', event: { text: 'You won!', effect: '+$25,000', money: 25000 } },
      { type: 'retire', label: 'Retirement!', emoji: '🌅', goodChoice: null, badChoice: null },
    ],
    regular: [ // 16 stops
      { type: 'start', label: 'Start', emoji: '🚀', goodChoice: null, badChoice: null },
      { type: 'choice', label: 'High School', emoji: '🎒', goodChoice: { text: 'Join Science Club', emoji: '🔬', money: 1000 }, badChoice: { text: 'Skip Class', emoji: '😴', money: -500 } },
      { type: 'choice', label: 'College Apps', emoji: '📝', goodChoice: { text: 'Apply to Top Schools', emoji: '🎓', money: -5000 }, badChoice: { text: 'Skip College', emoji: '🎮', money: 0 } },
      { type: 'event', label: 'Graduation!', emoji: '🎓', event: { text: 'You graduated!', effect: '+$5,000 gift', money: 5000 } },
      { type: 'career', label: 'First Job', emoji: '💼', goodChoice: { text: 'Research Scientist', emoji: '🔬', salary: 80000 }, badChoice: { text: 'Fast Food', emoji: '🍔', salary: 25000 } },
      { type: 'choice', label: 'Dating', emoji: '💕', goodChoice: { text: 'Find True Love', emoji: '💍', money: 5000, spouse: true }, badChoice: { text: 'Stay Single', emoji: '🎭', money: 0 } },
      { type: 'house', label: 'First Home', emoji: '🏠', goodChoice: { text: 'Nice House', emoji: '🏡', value: 200000 }, badChoice: { text: 'Tiny Apartment', emoji: '🏚️', value: 50000 } },
      { type: 'event', label: 'Tax Refund!', emoji: '💵', event: { text: 'Tax refund!', effect: '+$10,000', money: 10000 } },
      { type: 'choice', label: 'Family', emoji: '👨‍👩‍👧', goodChoice: { text: 'Have Kids', emoji: '👶', money: 0, kids: 2 }, badChoice: { text: 'Get a Dog', emoji: '🐕', money: -2000 } },
      { type: 'career', label: 'Promotion', emoji: '📈', goodChoice: { text: 'Director', emoji: '👔', salary: 150000 }, badChoice: { text: 'Stay Put', emoji: '📊', salary: 60000 } },
      { type: 'event', label: 'Lottery!', emoji: '🎰', event: { text: 'You won!', effect: '+$25,000', money: 25000 } },
      { type: 'house', label: 'Dream Home', emoji: '🏰', goodChoice: { text: 'Mansion', emoji: '🏰', value: 500000 }, badChoice: { text: 'Keep Current', emoji: '🏠', value: 0 } },
      { type: 'choice', label: 'Mid-Life', emoji: '🎂', goodChoice: { text: 'Start a Business', emoji: '💼', money: 50000 }, badChoice: { text: 'Mid-Life Crisis Car', emoji: '🏎️', money: -30000 } },
      { type: 'event', label: 'Kids College', emoji: '🎒', event: { text: 'College tuition!', effect: '-$20,000', money: -20000 } },
      { type: 'career', label: 'Peak Career', emoji: '🏆', goodChoice: { text: 'CEO', emoji: '👑', salary: 300000 }, badChoice: { text: 'Early Retirement', emoji: '🏖️', salary: 0 } },
      { type: 'retire', label: 'Retirement!', emoji: '🌅', goodChoice: null, badChoice: null },
    ],
    long: [ // 25 stops
      { type: 'start', label: 'Start', emoji: '🚀', goodChoice: null, badChoice: null },
      { type: 'choice', label: 'Elementary', emoji: '📚', goodChoice: { text: 'Study Hard', emoji: '📖', money: 500 }, badChoice: { text: 'Goof Off', emoji: '🎪', money: 0 } },
      { type: 'choice', label: 'Middle School', emoji: '🏫', goodChoice: { text: 'Join Sports', emoji: '⚽', money: 0 }, badChoice: { text: 'Play Video Games', emoji: '🎮', money: -200 } },
      { type: 'choice', label: 'High School', emoji: '🎒', goodChoice: { text: 'Join Science Club', emoji: '🔬', money: 1000 }, badChoice: { text: 'Skip Class', emoji: '😴', money: -500 } },
      { type: 'event', label: 'Prom!', emoji: '💃', event: { text: 'Best prom ever!', effect: '+$200', money: 200 } },
      { type: 'choice', label: 'College Apps', emoji: '📝', goodChoice: { text: 'Apply to Top Schools', emoji: '🎓', money: -5000 }, badChoice: { text: 'Skip College', emoji: '🛋️', money: 0 } },
      { type: 'choice', label: 'College Life', emoji: '🎓', goodChoice: { text: 'Dean\'s List', emoji: '⭐', money: 2000 }, badChoice: { text: 'Party Time', emoji: '🎉', money: -3000 } },
      { type: 'event', label: 'Graduation!', emoji: '🎓', event: { text: 'You graduated!', effect: '+$5,000 gift', money: 5000 } },
      { type: 'choice', label: 'Internship', emoji: '💻', goodChoice: { text: 'Dream Company', emoji: '🏢', money: 10000 }, badChoice: { text: 'Unpaid Intern', emoji: '😓', money: 0 } },
      { type: 'career', label: 'First Job', emoji: '💼', goodChoice: { text: 'Research Scientist', emoji: '🔬', salary: 80000 }, badChoice: { text: 'Fast Food', emoji: '🍔', salary: 25000 } },
      { type: 'choice', label: 'Dating', emoji: '💕', goodChoice: { text: 'Find True Love', emoji: '💍', money: 5000, spouse: true }, badChoice: { text: 'Stay Single', emoji: '🎭', money: 0 } },
      { type: 'event', label: 'Wedding!', emoji: '💒', event: { text: 'Beautiful wedding!', effect: '-$15,000', money: -15000 } },
      { type: 'house', label: 'First Home', emoji: '🏠', goodChoice: { text: 'Nice House', emoji: '🏡', value: 200000 }, badChoice: { text: 'Tiny Apartment', emoji: '🏚️', value: 50000 } },
      { type: 'event', label: 'Tax Refund!', emoji: '💵', event: { text: 'Tax refund!', effect: '+$10,000', money: 10000 } },
      { type: 'choice', label: 'Family', emoji: '👨‍👩‍👧', goodChoice: { text: 'Have Kids', emoji: '👶', money: 0, kids: 2 }, badChoice: { text: 'Get Pets', emoji: '🐕', money: -2000 } },
      { type: 'event', label: 'Baby Shower!', emoji: '🍼', event: { text: 'Gifts galore!', effect: '+$3,000', money: 3000 } },
      { type: 'career', label: 'Promotion', emoji: '📈', goodChoice: { text: 'Director', emoji: '👔', salary: 150000 }, badChoice: { text: 'Stay Put', emoji: '📊', salary: 60000 } },
      { type: 'choice', label: 'Vacation', emoji: '✈️', goodChoice: { text: 'Dream Vacation', emoji: '🏝️', money: -8000 }, badChoice: { text: 'Staycation', emoji: '🏠', money: 0 } },
      { type: 'event', label: 'Lottery!', emoji: '🎰', event: { text: 'You won!', effect: '+$25,000', money: 25000 } },
      { type: 'house', label: 'Dream Home', emoji: '🏰', goodChoice: { text: 'Mansion', emoji: '🏰', value: 500000 }, badChoice: { text: 'Keep Current', emoji: '🏠', value: 0 } },
      { type: 'choice', label: 'Mid-Life', emoji: '🎂', goodChoice: { text: 'Start a Business', emoji: '💼', money: 50000 }, badChoice: { text: 'Mid-Life Crisis Car', emoji: '🏎️', money: -30000 } },
      { type: 'event', label: 'Kids Graduate!', emoji: '🎓', event: { text: 'So proud!', effect: '+$5,000', money: 5000 } },
      { type: 'event', label: 'Kids College', emoji: '🎒', event: { text: 'College tuition!', effect: '-$20,000', money: -20000 } },
      { type: 'career', label: 'Peak Career', emoji: '🏆', goodChoice: { text: 'CEO', emoji: '👑', salary: 300000 }, badChoice: { text: 'Early Retirement', emoji: '🏖️', salary: 0 } },
      { type: 'retire', label: 'Retirement!', emoji: '🌅', goodChoice: null, badChoice: null },
    ],
  };
  
  const lifeBoardSpaces = lifeBoardOptions[lifeGameLength];

  // High scores state
  const [highScores, setHighScores] = useState<HighScores>({ speed: 0, millionaire: 0, bomb: 0, challenge: 0, snake: 0, memory: 999 });
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  // Load stats on mount
  useEffect(() => {
    setStats(loadStats());
    setHighScores(loadHighScores());
  }, []);

  // Record answer (for tracking)
  const recordAnswer = useCallback((questionId: number, correct: boolean) => {
    setStats(prev => {
      const current = prev[questionId] || { correct: 0, incorrect: 0, lastSeen: 0 };
      const updated = {
        ...prev,
        [questionId]: {
          correct: current.correct + (correct ? 1 : 0),
          incorrect: current.incorrect + (correct ? 0 : 1),
          lastSeen: Date.now()
        }
      };
      saveStats(updated);
      return updated;
    });
  }, []);

  const theme = unitThemes[selectedUnit] || unitThemes['All'];

  // Get missed questions (ones with more incorrect than correct, or never seen correctly)
  const getMissedQuestions = useCallback(() => {
    const base = selectedUnit === 'All' ? allQuestions : allQuestions.filter(q => q.unit === selectedUnit);
    return base.filter(q => {
      const s = stats[q.id];
      if (!s) return false;
      return s.incorrect > s.correct;
    });
  }, [stats, selectedUnit]);

  const unitQuestions = selectedUnit === 'All' ? allQuestions : allQuestions.filter(q => q.unit === selectedUnit);
  const topics = Array.from(new Set(unitQuestions.map(q => q.topic)));
  const unitLabel = units.find(u => u.key === selectedUnit)?.label || selectedUnit;

  const getFilteredQuestions = useCallback(() => {
    const uq = selectedUnit === 'All' ? allQuestions : allQuestions.filter(q => q.unit === selectedUnit);
    return selectedTopic 
      ? uq.filter(q => q.topic === selectedTopic)
      : uq;
  }, [selectedTopic, selectedUnit]);

  // Check and update high score helper
  const checkHighScore = useCallback((game: keyof HighScores, score: number, lowerIsBetter = false) => {
    setHighScores(prev => {
      const isNew = lowerIsBetter 
        ? (score < prev[game] && score > 0)
        : (score > prev[game]);
      
      if (isNew) {
        const updated = { ...prev, [game]: score };
        saveHighScores(updated);
        setIsNewHighScore(true);
        return updated;
      }
      setIsNewHighScore(false);
      return prev;
    });
  }, []);

  // Speed timer effect
  useEffect(() => {
    if (speedRunning && speedTime > 0) {
      speedTimerRef.current = setTimeout(() => setSpeedTime(t => t - 1), 1000);
    } else if (speedTime === 0 && speedRunning) {
      setSpeedRunning(false);
      if (speedScore > speedBest) setSpeedBest(speedScore);
      checkHighScore('speed', speedScore);
    }
    return () => { if (speedTimerRef.current) clearTimeout(speedTimerRef.current); };
  }, [speedRunning, speedTime, speedScore, speedBest, checkHighScore]);

  // Bomb defusal timer effect
  useEffect(() => {
    if (bombRunning && bombTime > 0) {
      bombTimerRef.current = setTimeout(() => setBombTime(t => t - 1), 1000);
    } else if (bombTime === 0 && bombRunning) {
      setBombRunning(false);
      setBombExploded(true);
      setBombShake(true);
      setTimeout(() => setBombShake(false), 500);
    }
    return () => { if (bombTimerRef.current) clearTimeout(bombTimerRef.current); };
  }, [bombRunning, bombTime]);

  // Challenge timer effect
  useEffect(() => {
    if (challengeRunning && challengeTime > 0) {
      challengeTimerRef.current = setTimeout(() => setChallengeTime(t => t - 1), 1000);
    } else if (challengeTime === 0 && challengeRunning) {
      setChallengeRunning(false);
      setChallengeGameOver(true);
      checkHighScore('challenge', challengeScore);
    }
    return () => { if (challengeTimerRef.current) clearTimeout(challengeTimerRef.current); };
  }, [challengeRunning, challengeTime, challengeScore, checkHighScore]);

  // Practice Test timer effect
  useEffect(() => {
    if (practiceTestRunning && practiceTestTime > 0) {
      practiceTestTimerRef.current = setTimeout(() => setPracticeTestTime(t => t - 1), 1000);
    } else if (practiceTestTime === 0 && practiceTestRunning) {
      // Auto-submit when time runs out
      setPracticeTestRunning(false);
      let correct = 0;
      shuffledQuestions.forEach((q, idx) => {
        if (practiceTestAnswers[idx] === q.a) {
          correct++;
          recordAnswer(q.id, true);
        } else if (practiceTestAnswers[idx]) {
          recordAnswer(q.id, false);
        }
      });
      setPracticeTestScore(correct);
      setPracticeTestSubmitted(true);
    }
    return () => { if (practiceTestTimerRef.current) clearTimeout(practiceTestTimerRef.current); };
  }, [practiceTestRunning, practiceTestTime, shuffledQuestions, practiceTestAnswers, recordAnswer]);

  // Snake game loop
  useEffect(() => {
    if (!snakeRunning || snakeShowQuestion) return;
    
    const moveSnake = () => {
      setSnakeBody(prev => {
        const head = prev[0];
        const dir = snakeDirRef.current;
        let newHead = { ...head };
        
        if (dir === 'up') newHead.y -= 1;
        else if (dir === 'down') newHead.y += 1;
        else if (dir === 'left') newHead.x -= 1;
        else if (dir === 'right') newHead.x += 1;
        
        // Check wall collision
        if (newHead.x < 0 || newHead.x >= 20 || newHead.y < 0 || newHead.y >= 20) {
          setSnakeRunning(false);
          setSnakeGameOver(true);
          return prev;
        }
        
        // Check self collision
        if (prev.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
          setSnakeRunning(false);
          setSnakeGameOver(true);
          return prev;
        }
        
        // Check food collision
        if (newHead.x === snakeFood.x && newHead.y === snakeFood.y) {
          setSnakeShowQuestion(true);
          return [newHead, ...prev]; // Grow
        }
        
        return [newHead, ...prev.slice(0, -1)]; // Move without growing
      });
    };
    
    snakeTimerRef.current = setTimeout(moveSnake, 150);
    return () => { if (snakeTimerRef.current) clearTimeout(snakeTimerRef.current); };
  }, [snakeRunning, snakeBody, snakeShowQuestion, snakeFood]);

  // Snake keyboard controls
  useEffect(() => {
    if (mode !== 'snake') return;
    
    const handleKey = (e: KeyboardEvent) => {
      if (snakeShowQuestion) return;
      const dir = snakeDirRef.current;
      if ((e.key === 'ArrowUp' || e.key === 'w') && dir !== 'down') {
        snakeDirRef.current = 'up';
        setSnakeDir('up');
      } else if ((e.key === 'ArrowDown' || e.key === 's') && dir !== 'up') {
        snakeDirRef.current = 'down';
        setSnakeDir('down');
      } else if ((e.key === 'ArrowLeft' || e.key === 'a') && dir !== 'right') {
        snakeDirRef.current = 'left';
        setSnakeDir('left');
      } else if ((e.key === 'ArrowRight' || e.key === 'd') && dir !== 'left') {
        snakeDirRef.current = 'right';
        setSnakeDir('right');
      }
    };
    
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [mode, snakeShowQuestion]);

  // High score check effects
  useEffect(() => {
    if (snakeGameOver) checkHighScore('snake', snakeScore);
  }, [snakeGameOver, snakeScore, checkHighScore]);

  useEffect(() => {
    if (memoryMatches >= 6) checkHighScore('memory', memoryMoves, true);
  }, [memoryMatches, memoryMoves, checkHighScore]);

  useEffect(() => {
    if (bombDefused) {
      checkHighScore('bomb', bombTime);
    }
  }, [bombDefused, bombTime, checkHighScore]);

  useEffect(() => {
    if (millionaireGameOver && millionaireFinalPrize > 0) {
      checkHighScore('millionaire', millionaireFinalPrize);
    }
  }, [millionaireGameOver, millionaireFinalPrize, checkHighScore]);

  const startMode = (newMode: Mode) => {
    const explainIds = Object.keys(explanations).map(Number);
    const filtered = newMode === 'review' ? getMissedQuestions() : 
      newMode === 'learn' ? getFilteredQuestions().filter(q => explainIds.includes(q.id)) :
      getFilteredQuestions();
    const shuffled = shuffle(filtered.length > 0 ? filtered : getFilteredQuestions());
    setShuffledQuestions(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
    setScore(0);
    setTotal(0);
    setMissedQuestions([]);
    setSelectedAnswer(null);
    setMode(newMode);

    if ((newMode === 'quiz' || newMode === 'review') && shuffled.length > 0) {
      const q = shuffled[0];
      const wrong = getWrongAnswers(q.a, q.topic, q.wrong);
      setQuizChoices(shuffle([q.a, ...wrong]));
    }
    
    if (newMode === 'match') {
      const pairs = shuffle(filtered).slice(0, 6);
      setMatchPairs(pairs.map(p => ({ q: p.q, a: p.a, qMatched: false, aMatched: false })));
      setShuffledAnswers(shuffle(pairs.map(p => p.a)));
      setSelectedQ(null);
      setSelectedA(null);
      setMatchScore(0);
    }
    
    if (newMode === 'jeopardy') {
      const board: typeof jeopardyBoard = {};
      const jTopics = Array.from(new Set((selectedUnit === 'All' ? allQuestions : allQuestions.filter(q => q.unit === selectedUnit)).map(q => q.topic)));
      jTopics.forEach(topic => {
        const topicQs = shuffle(selectedUnit === 'All' ? allQuestions.filter(q => q.topic === topic) : allQuestions.filter(q => q.unit === selectedUnit && q.topic === topic));
        board[topic] = [100, 200, 300, 400].map((points, i) => ({
          points,
          question: topicQs[i % topicQs.length],
          answered: false,
          correct: null
        }));
      });
      setJeopardyBoard(board);
      setJeopardyScore(0);
      setJeopardyQuestion(null);
      setJeopardyRevealed(false);
      setJeopardyComplete(false);
      setJeopardyReviewMode(false);
    }
    
    if (newMode === 'speed') {
      setSpeedTime(60);
      setSpeedRunning(false);
      setSpeedScore(0);
      setLbSubmitted(false);
      setLbShowInput(false);
      fetchLeaderboard();
      setSelectedAnswer(null);
      if (shuffled.length > 0) {
        const q = shuffled[0];
        const wrong = getWrongAnswers(q.a, q.topic, q.wrong);
        setQuizChoices(shuffle([q.a, ...wrong]));
      }
    }
    
    if (newMode === 'millionaire') {
      setMillionaireLevel(0);
      setMillionaireSelected(null);
      setMillionaireRevealed(false);
      setMillionaireGameOver(false);
      setMillionaireFiftyFifty(true);
      setMillionaireSkip(true);
      setMillionaireFinalPrize(0);
      if (shuffled.length > 0) {
        const q = shuffled[0];
        const wrong = getWrongAnswers(q.a, q.topic, q.wrong);
        setMillionaireChoices(shuffle([q.a, ...wrong]));
      }
    }

    if (newMode === 'life') {
      // Life game - simplified board game
      setLifePhase('setup');
      setLifePlayers([]);
      setLifeCurrentPlayer(0);
      setLifeShowFeedback(null);
      setLifeGotItRight(false);
      setLifeEvent(null);
      setLifeMultiplayer(false);
      setLifePlayerCount(1);
    }
    
    if (newMode === 'wheel') {
      // Filter to short answers only (3 words max or 25 chars)
      const shortAnswerQs = filtered.filter(q => {
        const words = q.a.split(' ').length;
        return words <= 3 && q.a.length <= 30;
      });
      const wheelShuffled = shuffle(shortAnswerQs);
      setShuffledQuestions(wheelShuffled);
      setWheelGuessedLetters([]);
      setWheelWrongGuesses(0);
      setWheelSolved(false);
      setWheelInput('');
      setWheelScore(0);
    }
    
    if (newMode === 'bomb') {
      setBombTime(60);
      setBombRunning(true);
      setBombWiresTotal(10);
      setBombWiresCut(0);
      setBombExploded(false);
      setBombDefused(false);
      setBombShake(false);
      setBombFlash('');
      if (shuffled.length > 0) {
        const q = shuffled[0];
        const wrong = getWrongAnswers(q.a, q.topic, q.wrong);
        setQuizChoices(shuffle([q.a, ...wrong]));
      }
    }
    
    if (newMode === 'crossword') {
      const result = generateCrossword(filtered);
      if (result) {
        setCrosswordGrid(result.grid);
        setCrosswordClues({across: result.across, down: result.down});
        setCrosswordInputs({});
        setCrosswordChecked(false);
        setCrosswordScore(0);
      }
    }

    if (newMode === 'practicetest') {
      // Practice Test - Canvas LMS style, all questions at once
      setPracticeTestAnswers({});
      setPracticeTestSubmitted(false);
      setPracticeTestScore(0);
      setPracticeTestTime(1200); // 20 minutes
      setPracticeTestRunning(true);
      // Prepare choices for each question
      const allChoices: {[key: number]: string[]} = {};
      shuffled.forEach((q, idx) => {
        const wrong = getWrongAnswers(q.a, q.topic, q.wrong);
        allChoices[idx] = shuffle([q.a, ...wrong]);
      });
      setQuizChoices([]); // Not used, using per-question choices
      (window as unknown as {practiceTestChoices: typeof allChoices}).practiceTestChoices = allChoices;
    }

    if (newMode === 'challenge') {
      // Challenge Mode - timed, no going back, 3 strikes
      setChallengeTime(300); // 5 minutes
      setChallengeRunning(true);
      setChallengeScore(0);
      setChallengeStreak(0);
      setChallengeBestStreak(0);
      setChallengeWrong(0);
      setChallengeGameOver(false);
      if (shuffled.length > 0) {
        const q = shuffled[0];
        const wrong = getWrongAnswers(q.a, q.topic, q.wrong);
        setQuizChoices(shuffle([q.a, ...wrong]));
      }
    }

    if (newMode === 'snake') {
      // Snake game - answer questions to grow
      setSnakeBody([{x: 10, y: 10}]);
      snakeDirRef.current = 'right';
      setSnakeDir('right');
      setSnakeFood({x: 15, y: 10});
      setSnakeRunning(true);
      setSnakeGameOver(false);
      setSnakeScore(0);
      setSnakeShowQuestion(false);
      setSnakeQuestionIndex(0);
      if (shuffled.length > 0) {
        const q = shuffled[0];
        const wrong = getWrongAnswers(q.a, q.topic, q.wrong);
        setQuizChoices(shuffle([q.a, ...wrong]));
      }
    }

    if (newMode === 'memory') {
      // Memory matching game - 6 pairs (12 cards)
      const pairs = shuffle(filtered).slice(0, 6);
      const cards: typeof memoryCards = [];
      pairs.forEach((p, idx) => {
        cards.push({ id: idx * 2, type: 'q', content: p.q, pairId: idx, flipped: false, matched: false });
        cards.push({ id: idx * 2 + 1, type: 'a', content: p.a, pairId: idx, flipped: false, matched: false });
      });
      setMemoryCards(shuffle(cards));
      setMemoryFlipped([]);
      setMemoryMatches(0);
      setMemoryMoves(0);
      setMemoryLocked(false);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < shuffledQuestions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setShowAnswer(false);
      setSelectedAnswer(null);
      
      if (mode === 'quiz' || mode === 'review') {
        const q = shuffledQuestions[nextIdx];
        const wrong = getWrongAnswers(q.a, q.topic, q.wrong);
        setQuizChoices(shuffle([q.a, ...wrong]));
      }
    } else if (missedQuestions.length > 0 && mode === 'learn') {
      setShuffledQuestions(shuffle(missedQuestions));
      setMissedQuestions([]);
      setCurrentIndex(0);
      setShowAnswer(false);
    }
  };

  const handleQuizAnswer = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    setTotal(t => t + 1);
    const correct = answer === shuffledQuestions[currentIndex].a;
    if (correct) setScore(s => s + 1);
    recordAnswer(shuffledQuestions[currentIndex].id, correct);
  };

  const handleLearnResponse = (knew: boolean) => {
    setTotal(t => t + 1);
    recordAnswer(shuffledQuestions[currentIndex].id, knew);
    if (knew) {
      setScore(s => s + 1);
    } else {
      setMissedQuestions(m => [...m, shuffledQuestions[currentIndex]]);
    }
    nextQuestion();
  };

  // Match handlers
  const handleMatchQ = (q: string) => {
    if (matchPairs.find(p => p.q === q)?.qMatched) return;
    setSelectedQ(q);
    if (selectedA) {
      const pair = matchPairs.find(p => p.q === q && p.a === selectedA);
      if (pair) {
        setMatchPairs(pairs => pairs.map(p => 
          p.q === q ? { ...p, qMatched: true, aMatched: true } : p
        ));
        setMatchScore(s => s + 1);
        const qObj = uniqueQuestions.find(uq => uq.q === q);
        if (qObj) recordAnswer(qObj.id, true);
      } else {
        const qObj = uniqueQuestions.find(uq => uq.q === q);
        if (qObj) recordAnswer(qObj.id, false);
      }
      setSelectedQ(null);
      setSelectedA(null);
    }
  };

  const handleMatchA = (a: string) => {
    if (matchPairs.find(p => p.a === a)?.aMatched) return;
    setSelectedA(a);
    if (selectedQ) {
      const pair = matchPairs.find(p => p.q === selectedQ && p.a === a);
      if (pair) {
        setMatchPairs(pairs => pairs.map(p => 
          p.a === a ? { ...p, qMatched: true, aMatched: true } : p
        ));
        setMatchScore(s => s + 1);
        const qObj = uniqueQuestions.find(uq => uq.a === a);
        if (qObj) recordAnswer(qObj.id, true);
      } else {
        const qObj = uniqueQuestions.find(uq => uq.a === a);
        if (qObj) recordAnswer(qObj.id, false);
      }
      setSelectedQ(null);
      setSelectedA(null);
    }
  };

  // Jeopardy handlers
  const handleJeopardySelect = (topic: string, index: number) => {
    const cell = jeopardyBoard[topic][index];
    if (cell.answered) return;
    
    setJeopardyQuestion(cell.question);
    setJeopardyPoints(cell.points);
    setJeopardyRevealed(false);
    setJeopardySelected(null);
    
    const wrong = getWrongAnswers(cell.question.a, cell.question.topic, cell.question.wrong);
    setJeopardyChoices(shuffle([cell.question.a, ...wrong]));
  };

  const handleJeopardyAnswer = (answer: string) => {
    if (jeopardySelected) return;
    setJeopardySelected(answer);
    setJeopardyRevealed(true);
    
    const isCorrect = answer === jeopardyQuestion!.a;
    if (isCorrect) setJeopardyScore(s => s + jeopardyPoints);
    recordAnswer(jeopardyQuestion!.id, isCorrect);
    
    setJeopardyBoard(board => {
      const newBoard = { ...board };
      Object.keys(newBoard).forEach(topic => {
        newBoard[topic] = newBoard[topic].map(cell => 
          cell.question.id === jeopardyQuestion!.id ? { ...cell, answered: true, correct: isCorrect } : cell
        );
      });
      // Check if all cells are answered
      const allDone = Object.values(newBoard).every(cells => cells.every(c => c.answered));
      if (allDone) {
        setTimeout(() => {
          setJeopardyQuestion(null);
          setJeopardyComplete(true);
        }, 1500);
      }
      return newBoard;
    });
  };

  const getJeopardyMissed = () => {
    const missed: {question: typeof uniqueQuestions[0], points: number}[] = [];
    Object.values(jeopardyBoard).forEach(cells => {
      cells.forEach(cell => {
        if (cell.answered && cell.correct === false) {
          missed.push({ question: cell.question, points: cell.points });
        }
      });
    });
    return missed;
  };

  const startJeopardyReview = () => {
    const missed = getJeopardyMissed();
    if (missed.length === 0) return;
    setJeopardyReviewMode(true);
    setJeopardyReviewIndex(0);
    setJeopardyReviewCorrect(0);
    setJeopardyReviewSelected(null);
    setJeopardyReviewRevealed(false);
    const q = missed[0].question;
    const wrong = getWrongAnswers(q.a, q.topic, q.wrong);
    setJeopardyReviewChoices(shuffle([q.a, ...wrong]));
  };

  const handleJeopardyReviewAnswer = (answer: string) => {
    if (jeopardyReviewSelected) return;
    setJeopardyReviewSelected(answer);
    setJeopardyReviewRevealed(true);
    const missed = getJeopardyMissed();
    if (answer === missed[jeopardyReviewIndex].question.a) {
      setJeopardyReviewCorrect(c => c + 1);
    }
  };

  const jeopardyReviewNext = () => {
    const missed = getJeopardyMissed();
    const nextIdx = jeopardyReviewIndex + 1;
    if (nextIdx >= missed.length) {
      setJeopardyReviewMode(false);
      return;
    }
    setJeopardyReviewIndex(nextIdx);
    setJeopardyReviewSelected(null);
    setJeopardyReviewRevealed(false);
    const q = missed[nextIdx].question;
    const wrong = getWrongAnswers(q.a, q.topic, q.wrong);
    setJeopardyReviewChoices(shuffle([q.a, ...wrong]));
  };

  // Speed Round handlers
  const startSpeedRound = () => {
    setSpeedRunning(true);
    setSpeedTime(60);
    setSpeedScore(0);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    const shuffled = shuffle(getFilteredQuestions());
    setShuffledQuestions(shuffled);
    if (shuffled.length > 0) {
      const q = shuffled[0];
      const wrong = getWrongAnswers(q.a, q.topic, q.wrong);
      setQuizChoices(shuffle([q.a, ...wrong]));
    }
  };

  const handleSpeedAnswer = (answer: string) => {
    if (!speedRunning || selectedAnswer) return;
    const correct = answer === shuffledQuestions[currentIndex].a;
    if (correct) setSpeedScore(s => s + 1);
    recordAnswer(shuffledQuestions[currentIndex].id, correct);
    
    setSelectedAnswer(answer);
    setTimeout(() => {
      const nextIdx = (currentIndex + 1) % shuffledQuestions.length;
      setCurrentIndex(nextIdx);
      setSelectedAnswer(null);
      const q = shuffledQuestions[nextIdx];
      const wrong = getWrongAnswers(q.a, q.topic, q.wrong);
      setQuizChoices(shuffle([q.a, ...wrong]));
    }, 300);
  };

  // Millionaire handlers
  const handleMillionaireAnswer = (answer: string) => {
    if (millionaireSelected || millionaireGameOver) return;
    setMillionaireSelected(answer);
    setMillionaireRevealed(true);
    
    const correct = answer === shuffledQuestions[currentIndex].a;
    recordAnswer(shuffledQuestions[currentIndex].id, correct);
    
    if (correct) {
      if (millionaireLevel >= MILLIONAIRE_PRIZES.length - 1) {
        setMillionaireFinalPrize(MILLIONAIRE_PRIZES[millionaireLevel]);
        setMillionaireGameOver(true);
      }
    } else {
      let prize = 0;
      for (const safe of MILLIONAIRE_SAFE) {
        if (millionaireLevel > safe) prize = MILLIONAIRE_PRIZES[safe];
      }
      setMillionaireFinalPrize(prize);
      setMillionaireGameOver(true);
    }
  };

  const millionaireNextQuestion = () => {
    const nextLevel = millionaireLevel + 1;
    const nextQIdx = currentIndex + 1;
    
    if (nextQIdx >= shuffledQuestions.length || nextLevel >= MILLIONAIRE_PRIZES.length) {
      setMillionaireFinalPrize(MILLIONAIRE_PRIZES[millionaireLevel]);
      setMillionaireGameOver(true);
      return;
    }
    
    setMillionaireLevel(nextLevel);
    setCurrentIndex(nextQIdx);
    setMillionaireSelected(null);
    setMillionaireRevealed(false);
    
    const q = shuffledQuestions[nextQIdx];
    const wrong = getWrongAnswers(q.a, q.topic, q.wrong);
    setMillionaireChoices(shuffle([q.a, ...wrong]));
  };

  const useFiftyFifty = () => {
    if (!millionaireFiftyFifty) return;
    setMillionaireFiftyFifty(false);
    const correct = shuffledQuestions[currentIndex].a;
    const wrongs = millionaireChoices.filter(c => c !== correct);
    const keepWrong = wrongs[Math.floor(Math.random() * wrongs.length)];
    setMillionaireChoices([correct, keepWrong].sort(() => Math.random() - 0.5));
  };

  const useSkip = () => {
    if (!millionaireSkip) return;
    setMillionaireSkip(false);
    millionaireNextQuestion();
  };

  const walkAway = () => {
    setMillionaireFinalPrize(MILLIONAIRE_PRIZES[millionaireLevel]);
    setMillionaireGameOver(true);
  };

  // Wheel of Fortune handlers
  const getWheelDisplay = (answer: string, guessed: string[]) => {
    return answer.split('').map(char => {
      if (char === ' ') return ' ';
      if (!/[a-zA-Z]/.test(char)) return char; // Show punctuation
      if (guessed.includes(char.toUpperCase())) return char;
      return '_';
    }).join('');
  };

  const handleWheelGuess = (letter: string) => {
    if (wheelSolved || wheelGuessedLetters.includes(letter)) return;
    
    const answer = shuffledQuestions[currentIndex].a.toUpperCase();
    const newGuessed = [...wheelGuessedLetters, letter];
    setWheelGuessedLetters(newGuessed);
    
    if (!answer.includes(letter)) {
      setWheelWrongGuesses(w => w + 1);
      if (wheelWrongGuesses + 1 >= 6) {
        // Game over for this question
        setWheelSolved(true);
        recordAnswer(shuffledQuestions[currentIndex].id, false);
      }
    } else {
      // Check if solved
      const display = getWheelDisplay(answer, newGuessed);
      if (!display.includes('_')) {
        setWheelSolved(true);
        setWheelScore(s => s + 1);
        recordAnswer(shuffledQuestions[currentIndex].id, true);
      }
    }
  };

  const handleWheelSolve = () => {
    const answer = shuffledQuestions[currentIndex].a;
    const correct = wheelInput.toLowerCase().trim() === answer.toLowerCase().trim();
    setWheelSolved(true);
    if (correct) {
      setWheelScore(s => s + 1);
      // Reveal all letters
      setWheelGuessedLetters(answer.toUpperCase().split('').filter(c => /[a-zA-Z]/.test(c)));
    }
    recordAnswer(shuffledQuestions[currentIndex].id, correct);
  };

  const wheelNextQuestion = () => {
    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setWheelGuessedLetters([]);
      setWheelWrongGuesses(0);
      setWheelSolved(false);
      setWheelInput('');
    }
  };

  // Bomb Defusal handlers
  const handleBombAnswer = (answer: string) => {
    if (selectedAnswer || bombExploded || bombDefused) return;
    setSelectedAnswer(answer);
    const correct = answer === shuffledQuestions[currentIndex].a;
    recordAnswer(shuffledQuestions[currentIndex].id, correct);
    
    if (correct) {
      setBombFlash('green');
      setTimeout(() => setBombFlash(''), 400);
      const newCut = bombWiresCut + 1;
      setBombWiresCut(newCut);
      if (newCut >= bombWiresTotal) {
        setBombDefused(true);
        setBombRunning(false);
      } else {
        setTimeout(() => {
          const nextIdx = (currentIndex + 1) % shuffledQuestions.length;
          setCurrentIndex(nextIdx);
          setSelectedAnswer(null);
          const q = shuffledQuestions[nextIdx];
          const wrong = getWrongAnswers(q.a, q.topic, q.wrong);
          setQuizChoices(shuffle([q.a, ...wrong]));
        }, 600);
      }
    } else {
      setBombFlash('red');
      setBombShake(true);
      setTimeout(() => { setBombShake(false); setBombFlash(''); }, 500);
      setBombExploded(true);
      setBombRunning(false);
    }
  };

  const clearStats = () => {
    const code = prompt('Type BUBBLE to confirm clearing all progress:');
    if (code === 'BUBBLE') {
      setStats({});
      saveStats({});
    }
  };

  const currentQ = shuffledQuestions[currentIndex];
  const isComplete = currentIndex >= shuffledQuestions.length - 1 && selectedAnswer;
  const learnComplete = mode === 'learn' && currentIndex >= shuffledQuestions.length - 1 && missedQuestions.length === 0 && showAnswer;
  const matchComplete = matchScore === matchPairs.length && matchPairs.length > 0;
  const missedCount = getMissedQuestions().length;

  // Calculate stats
  const topicStats = topics.map(topic => {
    const topicQs = unitQuestions.filter(q => q.topic === topic);
    let correct = 0, incorrect = 0;
    topicQs.forEach(q => {
      const s = stats[q.id];
      if (s) { correct += s.correct; incorrect += s.incorrect; }
    });
    return { topic, correct, incorrect, total: correct + incorrect };
  });

  const styles = {
    container: {
      minHeight: '100vh',
      background: theme.bgGradient,
      padding: '24px',
      fontFamily: '"Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      transition: 'background 0.4s ease',
    },
    inner: { maxWidth: '900px', margin: '0 auto' },
    header: { textAlign: 'center' as const, marginBottom: '32px' },
    title: { fontSize: '30px', fontWeight: '800', color: theme.primaryDark, marginBottom: '6px', letterSpacing: '-0.5px' },
    subtitle: { color: '#b0b5c0', fontSize: '14px', fontWeight: '500', letterSpacing: '0.5px' },
    topicFilter: { display: 'flex', flexWrap: 'wrap' as const, justifyContent: 'center', gap: '8px', marginBottom: '24px' },
    topicBtn: (active: boolean) => ({
      padding: '10px 18px', borderRadius: '50px', border: 'none', cursor: 'pointer',
      fontSize: '13px', fontWeight: '700', background: active ? theme.gradient : 'rgba(255,255,255,0.85)',
      color: active ? 'white' : '#8b8fa3', boxShadow: active ? `0 4px 14px ${theme.shadow}` : '0 2px 8px rgba(0,0,0,0.06)',
      transition: 'all 0.25s ease', backdropFilter: 'blur(8px)',
    }),
    menuGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' },
    menuCard: {
      background: 'rgba(255,255,255,0.9)', padding: '22px 14px', borderRadius: '20px', border: 'none',
      cursor: 'pointer', textAlign: 'center' as const, 
      boxShadow: '0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
      backdropFilter: 'blur(8px)',
      transition: 'all 0.25s ease',
    },
    menuTitle: { fontSize: '15px', fontWeight: '800', color: theme.primaryDark, marginBottom: '4px' },
    menuDesc: { fontSize: '11px', color: '#b0b5c0', fontWeight: '500' },
    backBtn: { background: 'none', border: 'none', color: theme.primary, cursor: 'pointer', marginBottom: '16px', fontSize: '14px', fontWeight: '700' },
    card: { 
      background: 'rgba(255,255,255,0.92)', borderRadius: '24px', padding: '32px', 
      boxShadow: '0 8px 30px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)', 
      marginBottom: '24px', borderTop: `4px solid ${theme.accentLight}`,
      backdropFilter: 'blur(8px)',
    },
    question: { fontSize: '18px', color: '#374151', lineHeight: '1.7', fontWeight: '600' },
    answer: { fontSize: '18px', color: '#059669', fontWeight: '800', marginTop: '16px', paddingTop: '16px', borderTop: '2px solid #f0fdf4' },
    topicLabel: { fontSize: '12px', color: theme.primary, fontWeight: '700', marginBottom: '12px', letterSpacing: '0.5px', textTransform: 'uppercase' as const },
    progress: { textAlign: 'center' as const, color: '#b0b5c0', marginBottom: '16px', fontSize: '14px', fontWeight: '600' },
    primaryBtn: { 
      background: theme.gradient, color: 'white', border: 'none', padding: '14px 36px', borderRadius: '50px', 
      fontSize: '15px', fontWeight: '700', cursor: 'pointer', 
      boxShadow: `0 4px 14px ${theme.shadow}`,
      transition: 'all 0.25s ease',
    },
    secondaryBtn: { 
      background: 'rgba(243,244,246,0.8)', color: '#8b8fa3', border: 'none', padding: '14px 28px', borderRadius: '50px', 
      fontSize: '15px', fontWeight: '600', cursor: 'pointer', backdropFilter: 'blur(8px)',
    },
    choiceBtn: (answered: boolean, isCorrect: boolean, wasSelected: boolean) => {
      let bg = 'rgba(255,255,255,0.9)';
      let color = '#374151';
      let shadow = '0 3px 12px rgba(0,0,0,0.06)';
      let border = '2px solid transparent';
      if (answered) {
        if (isCorrect) { bg = '#ecfdf5'; color = '#059669'; border = '2px solid #a7f3d0'; shadow = '0 3px 12px rgba(16,185,129,0.15)'; }
        else if (wasSelected) { bg = '#fef2f2'; color = '#dc2626'; border = '2px solid #fecaca'; shadow = '0 3px 12px rgba(239,68,68,0.15)'; }
        else { bg = '#f9fafb'; color = '#c0c4cc'; border = '2px solid transparent'; shadow = 'none'; }
      }
      return {
        display: 'block', width: '100%', padding: '16px 20px', marginBottom: '12px', borderRadius: '16px',
        border, cursor: answered ? 'default' : 'pointer', textAlign: 'left' as const, fontSize: '15px',
        fontWeight: '600', background: bg, color, boxShadow: shadow, transition: 'all 0.2s ease',
        backdropFilter: 'blur(8px)',
      };
    },
    navBtns: { display: 'flex', justifyContent: 'center', gap: '12px' },
    complete: { 
      textAlign: 'center' as const, background: 'rgba(255,255,255,0.92)', borderRadius: '24px', padding: '48px 32px', 
      boxShadow: '0 8px 30px rgba(0,0,0,0.06)', backdropFilter: 'blur(8px)',
    },
    score: { fontSize: '48px', fontWeight: '800', color: theme.primary, marginBottom: '8px' },
    learnBtns: { display: 'flex', justifyContent: 'center', gap: '12px' },
    wrongBtn: { background: '#fef2f2', color: '#e11d48', border: '2px solid #fecdd3', padding: '14px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s ease' },
    rightBtn: { background: '#ecfdf5', color: '#059669', border: '2px solid #a7f3d0', padding: '14px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s ease' },
    matchGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
    matchCol: { display: 'flex', flexDirection: 'column' as const, gap: '10px' },
    matchCard: (selected: boolean, matched: boolean) => ({
      padding: '14px 18px', borderRadius: '16px', border: matched ? '2px solid #a7f3d0' : selected ? `2px solid ${theme.primary}` : '2px solid transparent',
      cursor: matched ? 'default' : 'pointer',
      fontSize: '14px', fontWeight: '600', textAlign: 'left' as const,
      background: matched ? '#ecfdf5' : selected ? theme.accentLight : 'rgba(255,255,255,0.9)',
      color: matched ? '#059669' : '#374151',
      boxShadow: '0 3px 12px rgba(0,0,0,0.06)', opacity: matched ? 0.6 : 1,
      transition: 'all 0.2s ease', backdropFilter: 'blur(8px)',
    }),
    jeopardyBoard: { display: 'grid', gridTemplateColumns: `repeat(${topics.length}, 1fr)`, gap: '10px', marginBottom: '24px' },
    jeopardyHeader: { background: theme.gradient, color: 'white', padding: '10px 4px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', textAlign: 'center' as const, letterSpacing: '0.3px' },
    jeopardyCell: (answered: boolean, correct: boolean | null) => ({
      background: answered ? (correct ? '#ecfdf5' : '#fef2f2') : theme.gradient, 
      color: answered ? (correct ? '#059669' : '#e11d48') : 'white',
      padding: '16px 8px', borderRadius: '14px', border: answered ? (correct ? '2px solid #a7f3d0' : '2px solid #fecdd3') : '2px solid transparent',
      cursor: answered ? 'default' : 'pointer',
      fontSize: '18px', fontWeight: '800', textAlign: 'center' as const,
      boxShadow: answered ? 'none' : `0 4px 14px ${theme.shadow}`,
      transition: 'all 0.2s ease',
    }),
    timer: { fontSize: '64px', fontWeight: '800', color: theme.primary, textAlign: 'center' as const },
    timerSmall: { fontSize: '14px', color: '#b0b5c0', textAlign: 'center' as const, marginBottom: '24px', fontWeight: '600' },
    lifeline: (available: boolean) => ({
      padding: '10px 18px', borderRadius: '50px', border: 'none', cursor: available ? 'pointer' : 'default',
      fontSize: '13px', fontWeight: '700',
      background: available ? '#fef9ee' : '#f3f4f6',
      color: available ? '#92400e' : '#b0b5c0',
      opacity: available ? 1 : 0.5, boxShadow: available ? '0 2px 8px rgba(251,191,36,0.2)' : 'none',
      transition: 'all 0.2s ease',
    }),
    prizeLadder: { background: '#1e1b4b', borderRadius: '16px', padding: '16px', marginBottom: '24px' },
    prizeRow: (active: boolean, safe: boolean) => ({
      display: 'flex', justifyContent: 'space-between', padding: '8px 12px',
      background: active ? '#7c3aed' : 'transparent',
      borderRadius: '10px', color: safe ? '#fbbf24' : 'white',
      fontWeight: active || safe ? '800' : '500', fontSize: '14px',
    }),
    statBar: { height: '10px', borderRadius: '50px', background: '#f3f4f6', overflow: 'hidden' as const, marginTop: '4px' },
    statFill: (pct: number, good: boolean) => ({
      height: '100%', width: `${pct}%`, background: good ? 'linear-gradient(90deg, #34d399, #10b981)' : 'linear-gradient(90deg, #fca5a5, #f87171)', 
      borderRadius: '50px', transition: 'width 0.4s ease',
    }),
  };

  return (
    <div className="study-container" style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800;900&family=Luckiest+Guy&display=swap');
        .study-container * { font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .study-title-cursive { font-family: 'Luckiest Guy', cursive !important; font-weight: 400 !important; font-size: 26px !important; letter-spacing: 1px !important; }
        .study-container button:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.03); }
        .study-container button:active:not(:disabled) { transform: translateY(0px) !important; }
        .study-container button { transition: all 0.2s ease !important; }
        .menu-card-hover:hover { transform: translateY(-4px) rotate(-1deg) !important; }
        .menu-card-hover:active { transform: translateY(0px) rotate(0deg) !important; }
        .blob-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; overflow: hidden; }
        .blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.15; animation: blobFloat 20s ease-in-out infinite; }
        .blob-1 { width: 300px; height: 300px; top: -50px; right: -80px; background: ${theme.primary}; animation-delay: 0s; }
        .blob-2 { width: 250px; height: 250px; bottom: 10%; left: -60px; background: ${theme.primaryLight}; animation-delay: -7s; }
        .blob-3 { width: 200px; height: 200px; top: 40%; right: 10%; background: ${theme.accent}; animation-delay: -14s; }
        @keyframes blobFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -20px) scale(1.05); }
          66% { transform: translate(-15px, 15px) scale(0.95); }
        }
        @media (max-width: 640px) {
          .study-container { padding: 12px !important; }
          .study-card { padding: 16px !important; }
          .jeopardy-board { grid-template-columns: repeat(3, 1fr) !important; }
          .jeopardy-header { font-size: 9px !important; padding: 6px 2px !important; }
          .crossword-layout { grid-template-columns: 1fr !important; }
          .crossword-grid-wrap { overflow-x: auto; }
          .millionaire-layout { grid-template-columns: 1fr !important; }
          .prize-ladder { display: none; }
          .stats-row { grid-template-columns: 1fr 1fr !important; }
          .challenge-stats { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
      <div className="blob-bg" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>
      <div style={{...styles.inner, position: 'relative', zIndex: 1}}>
        <div style={styles.header}>
          <div style={{padding: '8px 0'}}>
            <h1 className="study-title-cursive" style={styles.title}>
              {theme.emojis[0]} Biology Study Guide {theme.emojis[theme.emojis.length - 1]}
            </h1>
          </div>
          <p style={styles.subtitle}>{unitLabel}</p>
        </div>

        {mode === 'menu' && (
          <>
            <div style={{display: 'flex', gap: '8px', marginBottom: '12px', justifyContent: 'center'}}>
              {units.map(u => {
                const uTheme = unitThemes[u.key];
                const isActive = selectedUnit === u.key;
                return (
                  <button key={u.key} onClick={() => { setSelectedUnit(u.key); setSelectedTopic(null); }} style={{
                    padding: '10px 20px', borderRadius: '50px', border: isActive ? 'none' : `2px solid ${uTheme.primary}30`,
                    cursor: 'pointer', fontSize: '14px', fontWeight: 800,
                    background: isActive ? uTheme.gradient : 'rgba(255,255,255,0.85)',
                    color: isActive ? 'white' : uTheme.primary,
                    boxShadow: isActive ? `0 4px 14px ${uTheme.shadow}` : '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'all 0.25s ease', backdropFilter: 'blur(8px)',
                  }}>{u.key === 'All' ? '📚 All' : u.key === 'Unit 9' ? '🔬 Unit 9' : u.key === 'Unit 10' ? '🌱 Unit 10' : u.key === 'Unit 11' ? '🧑‍🧑‍🧒‍🧒 Unit 11' : u.key === 'Roots' ? '📖 Roots' : u.key}</button>
                );
              })}
            </div>
            <div style={styles.topicFilter}>
              <button onClick={() => setSelectedTopic(null)} style={styles.topicBtn(!selectedTopic)}>
                All ({unitQuestions.length})
              </button>
              {topics.map(topic => (
                <button key={topic} onClick={() => setSelectedTopic(topic)} style={styles.topicBtn(selectedTopic === topic)}>
                  {topic} ({unitQuestions.filter(q => q.topic === topic).length})
                </button>
              ))}
            </div>
            
            {/* Stats banner */}
            {missedCount > 0 && (
              <div style={{background: '#fef3c7', padding: '12px 16px', borderRadius: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{color: '#92400e', fontSize: '14px'}}>{missedCount} questions need review</span>
                <button onClick={() => startMode('review')} style={{background: '#f59e0b', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '16px', fontSize: '13px', cursor: 'pointer'}}>
                  Review Now
                </button>
              </div>
            )}
            
            <div style={styles.menuGrid}>
              <button className="menu-card-hover" onClick={() => startMode('flashcards')} style={{...styles.menuCard, boxShadow: `0 4px 20px ${theme.shadow}`}}>
                <div style={styles.menuTitle}>Flashcards</div>
                <div style={styles.menuDesc}>Flip to reveal</div>
              </button>
              <button className="menu-card-hover" onClick={() => startMode('quiz')} style={{...styles.menuCard, boxShadow: `0 4px 20px ${theme.shadow}`}}>
                <div style={styles.menuTitle}>Quiz</div>
                <div style={styles.menuDesc}>Multiple choice</div>
              </button>
              <button className="menu-card-hover" onClick={() => startMode('learn')} style={{...styles.menuCard, boxShadow: `0 4px 20px ${theme.shadow}`}}>
                <div style={styles.menuTitle}>Learn</div>
                <div style={styles.menuDesc}>Spaced repetition</div>
              </button>
              <button className="menu-card-hover" onClick={() => startMode('match')} style={{...styles.menuCard, boxShadow: `0 4px 20px ${theme.shadow}`}}>
                <div style={styles.menuTitle}>Match</div>
                <div style={styles.menuDesc}>Pair Q&A</div>
              </button>
              <button className="menu-card-hover" onClick={() => startMode('speed')} style={{...styles.menuCard, boxShadow: `0 4px 20px ${theme.shadow}`}}>
                <div style={styles.menuTitle}>Speed Round</div>
                <div style={styles.menuDesc}>60 seconds</div>
              </button>
              <button className="menu-card-hover" onClick={() => startMode('millionaire')} style={{...styles.menuCard, background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)', boxShadow: '0 4px 20px rgba(76,29,149,0.3)'}}>
                <div style={{...styles.menuTitle, color: '#fbbf24'}}>Millionaire</div>
                <div style={{...styles.menuDesc, color: '#a5b4fc'}}>Rising stakes</div>
              </button>
              <button className="menu-card-hover" onClick={() => startMode('jeopardy')} style={{...styles.menuCard, background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)', boxShadow: '0 4px 20px rgba(37,99,235,0.3)'}}>
                <div style={{...styles.menuTitle, color: '#fbbf24'}}>Jeopardy</div>
                <div style={{...styles.menuDesc, color: '#93c5fd'}}>Pick points</div>
              </button>
              <button className="menu-card-hover" onClick={() => startMode('life')} style={{...styles.menuCard, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', boxShadow: '0 4px 20px rgba(118,75,162,0.3)'}}>
                <div style={{...styles.menuTitle, color: '#fef3c7'}}>Bio Life</div>
                <div style={{...styles.menuDesc, color: '#e9d5ff'}}>Life simulator</div>
              </button>
              <button className="menu-card-hover" onClick={() => startMode('wheel')} style={{...styles.menuCard, background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)', boxShadow: '0 4px 20px rgba(5,150,105,0.3)'}}>
                <div style={{...styles.menuTitle, color: '#d1fae5'}}>Wheel</div>
                <div style={{...styles.menuDesc, color: '#a7f3d0'}}>Spell it out</div>
              </button>
              <button className="menu-card-hover" onClick={() => startMode('bomb')} style={{...styles.menuCard, background: 'linear-gradient(135deg, #c2410c 0%, #f97316 100%)', boxShadow: '0 4px 20px rgba(249,115,22,0.3)'}}>
                <div style={{...styles.menuTitle, color: '#fff7ed'}}>Bomb</div>
                <div style={{...styles.menuDesc, color: '#fed7aa'}}>Defuse or boom!</div>
              </button>
              <button className="menu-card-hover" onClick={() => startMode('crossword')} style={{...styles.menuCard, background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', boxShadow: '0 4px 20px rgba(59,130,246,0.3)'}}>
                <div style={{...styles.menuTitle, color: '#dbeafe'}}>Crossword</div>
                <div style={{...styles.menuDesc, color: '#93c5fd'}}>Fill the grid</div>
              </button>
              <button className="menu-card-hover" onClick={() => startMode('practicetest')} style={{...styles.menuCard, background: 'linear-gradient(135deg, #374151 0%, #6b7280 100%)', boxShadow: '0 4px 20px rgba(107,114,128,0.3)'}}>
                <div style={{...styles.menuTitle, color: '#f3f4f6'}}>Practice Test</div>
                <div style={{...styles.menuDesc, color: '#d1d5db'}}>Canvas format</div>
              </button>
              <button className="menu-card-hover" onClick={() => startMode('challenge')} style={{...styles.menuCard, background: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)', boxShadow: '0 4px 20px rgba(220,38,38,0.3)'}}>
                <div style={{...styles.menuTitle, color: '#fecaca'}}>Challenge</div>
                <div style={{...styles.menuDesc, color: '#fca5a5'}}>3 strikes, timed</div>
              </button>
              <button className="menu-card-hover" onClick={() => startMode('snake')} style={{...styles.menuCard, background: 'linear-gradient(135deg, #166534 0%, #22c55e 100%)', boxShadow: '0 4px 20px rgba(34,197,94,0.3)'}}>
                <div style={{...styles.menuTitle, color: '#dcfce7'}}>Snake</div>
                <div style={{...styles.menuDesc, color: '#bbf7d0'}}>Eat & grow</div>
              </button>
              <button className="menu-card-hover" onClick={() => setMode('stats')} style={{...styles.menuCard, boxShadow: `0 4px 20px ${theme.shadow}`}}>
                <div style={styles.menuTitle}>My Stats</div>
                <div style={styles.menuDesc}>See progress</div>
              </button>
            </div>
          </>
        )}

        {mode !== 'menu' && (
          <button onClick={() => setMode('menu')} style={styles.backBtn}>← Back</button>
        )}

        {/* Stats Page */}
        {mode === 'stats' && (
          <div>
            <div style={styles.card}>
              {(() => {
                const totalCorrect = topicStats.reduce((sum, ts) => sum + ts.correct, 0);
                const totalAll = topicStats.reduce((sum, ts) => sum + ts.total, 0);
                const totalPct = totalAll > 0 ? Math.round((totalCorrect / totalAll) * 100) : 0;
                return (
                  <div style={{marginBottom: '24px', padding: '16px', borderRadius: '12px', background: theme.bgGradient, textAlign: 'center'}}>
                    <div style={{fontSize: '36px', fontWeight: 'bold', color: totalPct >= 70 ? '#059669' : totalPct >= 50 ? '#f59e0b' : '#dc2626'}}>{totalPct}%</div>
                    <div style={{fontSize: '14px', color: '#6b7280', marginTop: '4px'}}>Overall ({totalCorrect}/{totalAll})</div>
                  </div>
                );
              })()}
              <h2 style={{fontSize: '20px', fontWeight: 'bold', color: theme.primaryDark, marginBottom: '24px'}}>Progress by Topic</h2>
              {topicStats.map(ts => {
                const pct = ts.total > 0 ? Math.round((ts.correct / ts.total) * 100) : 0;
                return (
                  <div key={ts.topic} style={{marginBottom: '16px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px'}}>
                      <span style={{color: '#374151'}}>{ts.topic}</span>
                      <span style={{color: pct >= 70 ? '#059669' : pct >= 50 ? '#f59e0b' : '#dc2626'}}>{pct}% ({ts.correct}/{ts.total})</span>
                    </div>
                    <div style={styles.statBar}>
                      <div style={styles.statFill(pct, pct >= 70)} />
                    </div>
                  </div>
                );
              })}
            </div>
            
            {missedCount > 0 && (
              <div style={styles.card}>
                <h2 style={{fontSize: '20px', fontWeight: 'bold', color: '#dc2626', marginBottom: '16px'}}>Questions to Review ({missedCount})</h2>
                {getMissedQuestions().slice(0, 10).map(q => (
                  <div key={q.id} style={{padding: '12px 0', borderBottom: '1px solid #f3f4f6', fontSize: '14px', color: '#374151'}}>
                    {q.q}
                  </div>
                ))}
                {missedCount > 10 && <div style={{color: '#9ca3af', fontSize: '13px', marginTop: '12px'}}>...and {missedCount - 10} more</div>}
              </div>
            )}
            
            <div style={{textAlign: 'center', marginTop: '24px'}}>
              <button onClick={clearStats} style={{...styles.secondaryBtn, color: '#dc2626'}}>Clear All Progress</button>
            </div>
          </div>
        )}

        {/* Flashcards */}
        {mode === 'flashcards' && currentQ && (
          <div>
            <div style={styles.progress}>{currentIndex + 1} / {shuffledQuestions.length}</div>
            <div style={{...styles.card, cursor: 'pointer'}} onClick={() => setShowAnswer(!showAnswer)}>
              <div style={styles.topicLabel}>{currentQ.topic}</div>
              <div style={styles.question}>{currentQ.q}</div>
              {showAnswer && <div style={styles.answer}>{currentQ.a}</div>}
              {!showAnswer && <div style={{color: '#d1d5db', fontSize: '13px', marginTop: '16px'}}>Tap to reveal</div>}
            </div>
            <div style={styles.navBtns}>
              <button onClick={() => { setCurrentIndex(Math.max(0, currentIndex - 1)); setShowAnswer(false); }}
                disabled={currentIndex === 0} style={{...styles.secondaryBtn, opacity: currentIndex === 0 ? 0.5 : 1}}>Previous</button>
              <button onClick={() => { setCurrentIndex(Math.min(shuffledQuestions.length - 1, currentIndex + 1)); setShowAnswer(false); }}
                disabled={currentIndex >= shuffledQuestions.length - 1} style={{...styles.primaryBtn, opacity: currentIndex >= shuffledQuestions.length - 1 ? 0.5 : 1}}>Next</button>
            </div>
          </div>
        )}

        {/* Quiz & Review */}
        {(mode === 'quiz' || mode === 'review') && currentQ && !isComplete && (
          <div>
            <div style={styles.progress}>
              {mode === 'review' && <span style={{color: '#f59e0b'}}>Review Mode • </span>}
              Question {currentIndex + 1} / {shuffledQuestions.length} • Score: {score}/{total}
            </div>
            <div style={styles.card}>
              <div style={styles.topicLabel}>{currentQ.topic}</div>
              <div style={styles.question}>{currentQ.q}</div>
            </div>
            <div>
              {quizChoices.map((choice, i) => (
                <button key={i} onClick={() => handleQuizAnswer(choice)} disabled={!!selectedAnswer}
                  style={styles.choiceBtn(!!selectedAnswer, choice === currentQ.a, choice === selectedAnswer)}>{choice}</button>
              ))}
            </div>
            {selectedAnswer && <div style={{textAlign: 'center', marginTop: '16px'}}><button onClick={nextQuestion} style={styles.primaryBtn}>Next</button></div>}
          </div>
        )}

        {(mode === 'quiz' || mode === 'review') && isComplete && (
          <div style={styles.complete}>
            <div style={styles.score}>{Math.round((score / total) * 100)}%</div>
            <div style={{color: '#6b7280', marginBottom: '24px'}}>{score} / {total} correct</div>
            <button onClick={() => startMode(mode)} style={styles.primaryBtn}>Try Again</button>
          </div>
        )}

        {/* Review empty state */}
        {mode === 'review' && shuffledQuestions.length === 0 && (
          <div style={styles.complete}>
            <div style={{fontSize: '48px', marginBottom: '16px'}}>🎉</div>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: '#059669', marginBottom: '8px'}}>No questions to review!</div>
            <div style={{color: '#6b7280', marginBottom: '24px'}}>You&apos;re doing great - keep practicing!</div>
            <button onClick={() => setMode('menu')} style={styles.primaryBtn}>Back to Menu</button>
          </div>
        )}

        {/* Learn */}
        {mode === 'learn' && currentQ && !learnComplete && (
          <div>
            <div style={styles.progress}>{missedQuestions.length > 0 ? 'Reviewing • ' : ''}{currentIndex + 1} / {shuffledQuestions.length} • Mastered: {score}</div>
            <div style={styles.card}>
              <div style={styles.topicLabel}>{currentQ.topic}</div>
              <div style={styles.question}>{currentQ.q}</div>
              {showAnswer && (
                <>
                  <div style={styles.answer}>{currentQ.a}</div>
                  {explanations[currentQ.id] && (
                    <div style={{
                      marginTop: '16px', padding: '16px 20px', borderRadius: '16px',
                      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                      border: '2px solid #bae6fd', fontSize: '14px', lineHeight: '1.7',
                      color: '#1e3a5f',
                    }}>
                      <div style={{fontWeight: '800', fontSize: '12px', color: theme.primary, marginBottom: '8px', textTransform: 'uppercase' as const, letterSpacing: '0.5px'}}>Why?</div>
                      {explanations[currentQ.id]}
                    </div>
                  )}
                </>
              )}
            </div>
            {!showAnswer ? (
              <div style={{textAlign: 'center'}}><button onClick={() => setShowAnswer(true)} style={styles.primaryBtn}>Show Answer</button></div>
            ) : (
              <div style={styles.learnBtns}>
                <button onClick={() => { handleLearnResponse(false); setShowAnswer(false); }} style={styles.wrongBtn}>Still Learning</button>
                <button onClick={() => { handleLearnResponse(true); setShowAnswer(false); }} style={styles.rightBtn}>Got It</button>
              </div>
            )}
          </div>
        )}

        {learnComplete && (
          <div style={styles.complete}>
            <div style={styles.score}>Done!</div>
            <div style={{color: '#6b7280', marginBottom: '24px'}}>Mastered all {score} questions</div>
            <button onClick={() => startMode('learn')} style={styles.primaryBtn}>Practice Again</button>
          </div>
        )}

        {/* Match */}
        {mode === 'match' && !matchComplete && (
          <div>
            <div style={styles.progress}>Matched: {matchScore} / {matchPairs.length}</div>
            <div style={styles.matchGrid}>
              <div style={styles.matchCol}>
                <div style={{fontSize: '12px', color: theme.primary, fontWeight: '500', marginBottom: '8px'}}>Questions</div>
                {matchPairs.map((pair, i) => (
                  <button key={i} onClick={() => handleMatchQ(pair.q)} style={styles.matchCard(selectedQ === pair.q, pair.qMatched)}>
                    {pair.q}
                  </button>
                ))}
              </div>
              <div style={styles.matchCol}>
                <div style={{fontSize: '12px', color: theme.primary, fontWeight: '500', marginBottom: '8px'}}>Answers</div>
                {shuffledAnswers.map((a, i) => {
                  const pair = matchPairs.find(p => p.a === a);
                  return (
                    <button key={i} onClick={() => handleMatchA(a)} style={styles.matchCard(selectedA === a, pair?.aMatched || false)}>
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {mode === 'match' && matchComplete && (
          <div style={styles.complete}>
            <div style={styles.score}>Matched!</div>
            <div style={{color: '#6b7280', marginBottom: '24px'}}>All {matchScore} pairs found</div>
            <button onClick={() => startMode('match')} style={styles.primaryBtn}>Play Again</button>
          </div>
        )}

        {/* Jeopardy */}
        {mode === 'jeopardy' && !jeopardyQuestion && !jeopardyComplete && (
          <div>
            <div style={styles.progress}>Score: ${jeopardyScore}</div>
            <div className="jeopardy-board" style={styles.jeopardyBoard}>
              {topics.map(topic => (
                <div key={topic} style={styles.jeopardyHeader}>{topic}</div>
              ))}
              {[0, 1, 2, 3].map(row => (
                topics.map(topic => {
                  const cell = jeopardyBoard[topic]?.[row];
                  return cell ? (
                    <button key={`${topic}-${row}`} onClick={() => handleJeopardySelect(topic, row)}
                      style={styles.jeopardyCell(cell.answered, cell.correct)}>
                      {cell.answered ? (cell.correct ? '✓' : '✗') : `$${cell.points}`}
                    </button>
                  ) : null;
                })
              ))}
            </div>
          </div>
        )}

        {mode === 'jeopardy' && jeopardyComplete && !jeopardyReviewMode && (() => {
          const missed = getJeopardyMissed();
          const totalCells = Object.values(jeopardyBoard).reduce((sum, cells) => sum + cells.length, 0);
          const correctCount = totalCells - missed.length;
          const maxScore = Object.values(jeopardyBoard).reduce((sum, cells) => sum + cells.reduce((s, c) => s + c.points, 0), 0);
          return (
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '48px', marginBottom: '8px'}}>🏆</div>
              <div style={{fontSize: '28px', fontWeight: 'bold', color: theme.primary, marginBottom: '4px'}}>${jeopardyScore}</div>
              <div style={{fontSize: '14px', color: '#6b7280', marginBottom: '24px'}}>out of ${maxScore} possible</div>
              <div style={{display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '24px'}}>
                <div>
                  <div style={{fontSize: '24px', fontWeight: 'bold', color: '#059669'}}>{correctCount}</div>
                  <div style={{fontSize: '12px', color: '#6b7280'}}>Correct</div>
                </div>
                <div>
                  <div style={{fontSize: '24px', fontWeight: 'bold', color: '#dc2626'}}>{missed.length}</div>
                  <div style={{fontSize: '12px', color: '#6b7280'}}>Missed</div>
                </div>
              </div>
              {missed.length > 0 && (
                <div style={{marginBottom: '24px'}}>
                  <div style={{fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px'}}>Questions you missed:</div>
                  <div style={{textAlign: 'left', maxWidth: '400px', margin: '0 auto'}}>
                    {missed.map((m, i) => (
                      <div key={i} style={{background: '#fef2f2', borderRadius: '8px', padding: '12px', marginBottom: '8px', borderLeft: '3px solid #dc2626'}}>
                        <div style={{fontSize: '13px', color: '#dc2626', fontWeight: '600', marginBottom: '4px'}}>${m.points}</div>
                        <div style={{fontSize: '14px', color: '#374151', marginBottom: '4px'}}>{m.question.q}</div>
                        <div style={{fontSize: '13px', color: '#059669'}}>Answer: {m.question.a}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap'}}>
                {missed.length > 0 && (
                  <button onClick={startJeopardyReview} style={{...styles.primaryBtn, background: '#dc2626'}}>
                    Retry Missed ({missed.length})
                  </button>
                )}
                <button onClick={() => startMode('jeopardy')} style={styles.primaryBtn}>Play Again</button>
                <button onClick={() => startMode('menu')} style={{...styles.primaryBtn, background: '#6b7280'}}>Menu</button>
              </div>
            </div>
          );
        })()}

        {mode === 'jeopardy' && jeopardyReviewMode && (() => {
          const missed = getJeopardyMissed();
          const current = missed[jeopardyReviewIndex];
          if (!current) return null;
          return (
            <div>
              <div style={styles.progress}>Review: {jeopardyReviewIndex + 1} / {missed.length}</div>
              <div style={styles.card}>
                <div style={styles.topicLabel}>{current.question.topic}</div>
                <div style={styles.question}>{current.question.q}</div>
              </div>
              <div>
                {jeopardyReviewChoices.map((choice, i) => (
                  <button key={i} onClick={() => handleJeopardyReviewAnswer(choice)} disabled={!!jeopardyReviewSelected}
                    style={styles.choiceBtn(!!jeopardyReviewSelected, choice === current.question.a, choice === jeopardyReviewSelected)}>{choice}</button>
                ))}
              </div>
              {jeopardyReviewRevealed && (
                <div style={{textAlign: 'center', marginTop: '16px'}}>
                  <div style={{marginBottom: '16px', color: jeopardyReviewSelected === current.question.a ? '#059669' : '#dc2626', fontWeight: 'bold'}}>
                    {jeopardyReviewSelected === current.question.a ? 'Got it!' : `Answer: ${current.question.a}`}
                  </div>
                  <button onClick={jeopardyReviewNext} style={styles.primaryBtn}>
                    {jeopardyReviewIndex + 1 >= missed.length ? 'Done' : 'Next'}
                  </button>
                </div>
              )}
            </div>
          );
        })()}

        {mode === 'jeopardy' && jeopardyQuestion && (
          <div>
            <div style={styles.progress}>${jeopardyPoints}</div>
            <div style={styles.card}>
              <div style={styles.topicLabel}>{jeopardyQuestion.topic}</div>
              <div style={styles.question}>{jeopardyQuestion.q}</div>
            </div>
            <div>
              {jeopardyChoices.map((choice, i) => (
                <button key={i} onClick={() => handleJeopardyAnswer(choice)} disabled={!!jeopardySelected}
                  style={styles.choiceBtn(!!jeopardySelected, choice === jeopardyQuestion.a, choice === jeopardySelected)}>{choice}</button>
              ))}
            </div>
            {jeopardyRevealed && (
              <div style={{textAlign: 'center', marginTop: '16px'}}>
                <div style={{marginBottom: '16px', color: jeopardySelected === jeopardyQuestion.a ? '#059669' : '#dc2626', fontWeight: 'bold'}}>
                  {jeopardySelected === jeopardyQuestion.a ? `+$${jeopardyPoints}` : 'Incorrect'}
                </div>
                <button onClick={() => setJeopardyQuestion(null)} style={styles.primaryBtn}>Back to Board</button>
              </div>
            )}
          </div>
        )}

        {/* Speed Round */}
        {mode === 'speed' && !speedRunning && speedTime === 60 && (
          <div>
            <div style={styles.complete}>
              <div style={styles.timer}>60</div>
              <div style={styles.timerSmall}>seconds</div>
              {speedBest > 0 && <div style={{color: theme.primary, marginBottom: '16px'}}>Best: {speedBest}</div>}
              <button onClick={startSpeedRound} style={styles.primaryBtn}>Start!</button>
            </div>
            {/* Leaderboard */}
            {leaderboard.length > 0 && (
              <div style={{marginTop: '24px', background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}>
                <div style={{fontSize: '16px', fontWeight: 'bold', color: '#374151', marginBottom: '12px', textAlign: 'center'}}>🏆 Leaderboard</div>
                {leaderboard.slice(0, 10).map((entry, i) => (
                  <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', background: i === 0 ? '#fef3c7' : i === 1 ? '#f3f4f6' : i === 2 ? '#fff7ed' : 'transparent', marginBottom: '4px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                      <span style={{fontSize: '14px', fontWeight: 'bold', color: i === 0 ? '#f59e0b' : i === 1 ? '#6b7280' : i === 2 ? '#ea580c' : '#9ca3af', width: '24px'}}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</span>
                      <span style={{fontSize: '15px', color: '#374151', fontWeight: i < 3 ? '600' : '400'}}>{entry.name}</span>
                    </div>
                    <span style={{fontSize: '16px', fontWeight: 'bold', color: theme.primary}}>{entry.score}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {mode === 'speed' && speedRunning && currentQ && (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
              <div style={{fontSize: '32px', fontWeight: 'bold', color: speedTime <= 10 ? '#dc2626' : theme.primary}}>{speedTime}s</div>
              <div style={{fontSize: '24px', fontWeight: 'bold', color: '#059669'}}>{speedScore} correct</div>
            </div>
            <div style={styles.card}>
              <div style={styles.question}>{currentQ.q}</div>
            </div>
            <div>
              {quizChoices.map((choice, i) => (
                <button key={i} onClick={() => handleSpeedAnswer(choice)}
                  style={styles.choiceBtn(!!selectedAnswer, choice === currentQ.a, choice === selectedAnswer)}>{choice}</button>
              ))}
            </div>
          </div>
        )}

        {mode === 'speed' && !speedRunning && speedTime === 0 && (
          <div>
            <div style={styles.complete}>
              <div style={styles.score}>{speedScore}</div>
              <div style={{color: '#6b7280', marginBottom: '8px'}}>correct in 60 seconds</div>
              {speedScore >= highScores.speed && speedScore > 0 && (
                <div style={{color: '#f59e0b', fontWeight: 'bold', marginBottom: '16px', fontSize: '18px'}}>👑 New High Score!</div>
              )}
              <div style={{color: '#9ca3af', fontSize: '13px', marginBottom: '16px'}}>
                High Score: {highScores.speed} {highScores.speed > 0 && '👑'}
              </div>

              {/* Submit to leaderboard */}
              {!lbSubmitted && !lbShowInput && speedScore > 0 && (
                <button onClick={() => setLbShowInput(true)} style={{...styles.secondaryBtn, marginBottom: '12px', background: '#fef3c7', color: '#92400e'}}>
                  🏆 Add to Leaderboard
                </button>
              )}
              {lbShowInput && !lbSubmitted && (
                <div style={{marginBottom: '16px'}}>
                  <input
                    type="text"
                    placeholder="Your name (anonymous)"
                    maxLength={12}
                    value={lbName}
                    onChange={e => setLbName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && lbName.trim()) submitScore(speedScore); }}
                    style={{padding: '10px 16px', borderRadius: '8px', border: '2px solid ' + theme.primary, fontSize: '15px', width: '200px', textAlign: 'center', outline: 'none', marginBottom: '8px'}}
                  />
                  <div>
                    <button onClick={() => submitScore(speedScore)} disabled={!lbName.trim()} style={{...styles.primaryBtn, opacity: lbName.trim() ? 1 : 0.5, padding: '8px 24px', fontSize: '14px'}}>Submit</button>
                  </div>
                </div>
              )}
              {lbSubmitted && (
                <div style={{color: '#059669', fontWeight: '600', marginBottom: '16px', fontSize: '14px'}}>✅ Score submitted!</div>
              )}

              <button onClick={startSpeedRound} style={styles.primaryBtn}>Play Again</button>
            </div>

            {/* Leaderboard */}
            {leaderboard.length > 0 && (
              <div style={{marginTop: '24px', background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}>
                <div style={{fontSize: '16px', fontWeight: 'bold', color: '#374151', marginBottom: '12px', textAlign: 'center'}}>🏆 Leaderboard</div>
                {leaderboard.slice(0, 10).map((entry, i) => (
                  <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', background: i === 0 ? '#fef3c7' : i === 1 ? '#f3f4f6' : i === 2 ? '#fff7ed' : 'transparent', marginBottom: '4px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                      <span style={{fontSize: '14px', fontWeight: 'bold', color: i === 0 ? '#f59e0b' : i === 1 ? '#6b7280' : i === 2 ? '#ea580c' : '#9ca3af', width: '24px'}}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</span>
                      <span style={{fontSize: '15px', color: '#374151', fontWeight: i < 3 ? '600' : '400'}}>{entry.name}</span>
                    </div>
                    <span style={{fontSize: '16px', fontWeight: 'bold', color: theme.primary}}>{entry.score}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Millionaire */}
        {mode === 'millionaire' && !millionaireGameOver && currentQ && (
          <div className="millionaire-layout" style={{display: 'grid', gridTemplateColumns: '1fr 200px', gap: '24px'}}>
            <div>
              <div style={{display: 'flex', gap: '8px', marginBottom: '16px'}}>
                <button onClick={useFiftyFifty} style={styles.lifeline(millionaireFiftyFifty)}>50:50</button>
                <button onClick={useSkip} style={styles.lifeline(millionaireSkip)}>Skip</button>
                <button onClick={walkAway} style={{...styles.secondaryBtn, padding: '8px 16px', fontSize: '13px'}}>Walk Away</button>
              </div>
              <div style={styles.card}>
                <div style={styles.topicLabel}>{currentQ.topic}</div>
                <div style={styles.question}>{currentQ.q}</div>
              </div>
              <div>
                {millionaireChoices.map((choice, i) => (
                  <button key={i} onClick={() => handleMillionaireAnswer(choice)} disabled={!!millionaireSelected}
                    style={styles.choiceBtn(!!millionaireSelected, choice === currentQ.a, choice === millionaireSelected)}>{choice}</button>
                ))}
              </div>
              {millionaireRevealed && !millionaireGameOver && millionaireSelected === currentQ.a && (
                <div style={{textAlign: 'center', marginTop: '16px'}}>
                  <div style={{color: '#059669', fontWeight: 'bold', marginBottom: '16px'}}>Correct! You have ${MILLIONAIRE_PRIZES[millionaireLevel].toLocaleString()}</div>
                  <button onClick={millionaireNextQuestion} style={styles.primaryBtn}>Continue</button>
                </div>
              )}
            </div>
            <div style={styles.prizeLadder}>
              {[...MILLIONAIRE_PRIZES].reverse().map((prize, i) => {
                const level = MILLIONAIRE_PRIZES.length - 1 - i;
                return (
                  <div key={prize} style={styles.prizeRow(level === millionaireLevel, MILLIONAIRE_SAFE.includes(level))}>
                    <span>{level + 1}</span>
                    <span>${prize.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {mode === 'millionaire' && millionaireGameOver && (
          <div style={{...styles.complete, background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)'}}>
            <div style={{...styles.score, color: '#fbbf24'}}>${millionaireFinalPrize.toLocaleString()}</div>
            <div style={{color: '#a5b4fc', marginBottom: '16px'}}>
              {millionaireFinalPrize >= 1000000 ? 'You won the million!' : millionaireFinalPrize > 0 ? 'Final Winnings' : 'Better luck next time!'}
            </div>
            {millionaireFinalPrize >= highScores.millionaire && millionaireFinalPrize > 0 && (
              <div style={{color: '#fbbf24', fontWeight: 'bold', marginBottom: '16px', fontSize: '18px'}}>👑 New High Score!</div>
            )}
            <div style={{color: '#818cf8', fontSize: '13px', marginBottom: '16px'}}>
              High Score: ${highScores.millionaire.toLocaleString()} {highScores.millionaire > 0 && '👑'}
            </div>
            <button onClick={() => startMode('millionaire')} style={{...styles.primaryBtn, background: '#7c3aed'}}>Play Again</button>
          </div>
        )}

        {/* Bio Life Game - FULL BOARD GAME WITH MULTIPLAYER */}
        {mode === 'life' && lifePhase === 'setup' && (
          <div>
            <div style={{textAlign: 'center', marginBottom: '20px'}}>
              <div style={{fontSize: '48px', marginBottom: '8px'}}>🎲</div>
              <h2 style={{margin: '0 0 8px 0', color: theme.primary}}>Bio Life</h2>
              <p style={{color: '#666', margin: 0}}>The Game of Life... with Biology!</p>
            </div>
            
            {/* Game Length */}
            <div style={{marginBottom: '16px'}}>
              <h4 style={{margin: '0 0 8px 0', color: theme.primary}}>Game Length:</h4>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px'}}>
                <button
                  onClick={() => setLifeGameLength('fast')}
                  style={{
                    padding: '12px 8px', border: lifeGameLength === 'fast' ? '3px solid ' + theme.primary : '2px solid #e5e7eb',
                    borderRadius: '10px', background: lifeGameLength === 'fast' ? theme.accentLight : 'white', cursor: 'pointer', textAlign: 'center'
                  }}
                >
                  <div style={{fontSize: '20px'}}>⚡</div>
                  <div style={{fontWeight: 'bold', color: theme.primary, fontSize: '14px'}}>Fast</div>
                  <div style={{fontSize: '11px', color: '#666'}}>10 stops</div>
                </button>
                <button
                  onClick={() => setLifeGameLength('regular')}
                  style={{
                    padding: '12px 8px', border: lifeGameLength === 'regular' ? '3px solid ' + theme.primary : '2px solid #e5e7eb',
                    borderRadius: '10px', background: lifeGameLength === 'regular' ? theme.accentLight : 'white', cursor: 'pointer', textAlign: 'center'
                  }}
                >
                  <div style={{fontSize: '20px'}}>🎯</div>
                  <div style={{fontWeight: 'bold', color: theme.primary, fontSize: '14px'}}>Regular</div>
                  <div style={{fontSize: '11px', color: '#666'}}>16 stops</div>
                </button>
                <button
                  onClick={() => setLifeGameLength('long')}
                  style={{
                    padding: '12px 8px', border: lifeGameLength === 'long' ? '3px solid ' + theme.primary : '2px solid #e5e7eb',
                    borderRadius: '10px', background: lifeGameLength === 'long' ? theme.accentLight : 'white', cursor: 'pointer', textAlign: 'center'
                  }}
                >
                  <div style={{fontSize: '20px'}}>🏔️</div>
                  <div style={{fontWeight: 'bold', color: theme.primary, fontSize: '14px'}}>Long</div>
                  <div style={{fontSize: '11px', color: '#666'}}>25 stops</div>
                </button>
              </div>
            </div>
            
            {/* Single vs Multiplayer */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px'}}>
              <button
                onClick={() => { setLifeMultiplayer(false); setLifePlayerCount(1); }}
                style={{
                  padding: '16px', border: !lifeMultiplayer ? '3px solid ' + theme.primary : '2px solid #e5e7eb',
                  borderRadius: '12px', background: !lifeMultiplayer ? theme.accentLight : 'white', cursor: 'pointer', textAlign: 'center'
                }}
              >
                <div style={{fontSize: '28px'}}>🎮</div>
                <div style={{fontWeight: 'bold', color: theme.primary}}>Solo</div>
              </button>
              <button
                onClick={() => { setLifeMultiplayer(true); if (lifePlayerCount < 2) setLifePlayerCount(2); }}
                style={{
                  padding: '16px', border: lifeMultiplayer ? '3px solid ' + theme.primary : '2px solid #e5e7eb',
                  borderRadius: '12px', background: lifeMultiplayer ? theme.accentLight : 'white', cursor: 'pointer', textAlign: 'center'
                }}
              >
                <div style={{fontSize: '28px'}}>👥</div>
                <div style={{fontWeight: 'bold', color: theme.primary}}>Multiplayer</div>
              </button>
            </div>
            
            {/* Player count (multiplayer only) */}
            {lifeMultiplayer && (
              <div style={{marginBottom: '16px'}}>
                <h4 style={{margin: '0 0 8px 0', color: theme.primary}}>How many players?</h4>
                <div style={{display: 'flex', gap: '8px'}}>
                  {[2, 3, 4].map(n => (
                    <button
                      key={n}
                      onClick={() => setLifePlayerCount(n)}
                      style={{
                        flex: 1, padding: '12px', border: lifePlayerCount === n ? '2px solid ' + theme.primary : '2px solid #e5e7eb',
                        borderRadius: '8px', background: lifePlayerCount === n ? theme.accentLight : 'white', cursor: 'pointer',
                        fontWeight: 'bold', fontSize: '18px'
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Player names (multiplayer only) */}
            {lifeMultiplayer && (
              <div style={{marginBottom: '16px'}}>
                <h4 style={{margin: '0 0 8px 0', color: theme.primary}}>Player Names:</h4>
                {Array.from({length: lifePlayerCount}).map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    value={lifePlayerNames[i]}
                    onChange={(e) => {
                      const newNames = [...lifePlayerNames];
                      newNames[i] = e.target.value;
                      setLifePlayerNames(newNames);
                    }}
                    placeholder={`Player ${i + 1}`}
                    style={{
                      width: '100%', padding: '10px 12px', marginBottom: '8px', border: '2px solid #e5e7eb',
                      borderRadius: '8px', fontSize: '14px'
                    }}
                  />
                ))}
              </div>
            )}
            
            {/* Start button */}
            <button
              onClick={() => {
                const colors = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b'];
                const emojis = ['🚗', '🚙', '🚕', '🏎️'];
                const players: LifePlayer[] = Array.from({length: lifePlayerCount}).map((_, i) => ({
                  name: lifeMultiplayer ? lifePlayerNames[i] : 'You',
                  color: colors[i],
                  emoji: emojis[i],
                  position: 0,
                  money: 10000,
                  career: null,
                  house: null,
                  education: 'High School',
                  spouse: false,
                  kids: 0,
                  cards: [],
                  correctAnswers: 0,
                }));
                setLifePlayers(players);
                setLifeCurrentPlayer(0);
                setLifePhase('spin');
                // Prep questions
                const qs = shuffle(shuffledQuestions);
                setShuffledQuestions(qs);
                setCurrentIndex(0);
              }}
              style={{
                width: '100%', padding: '16px', background: theme.gradient,
                color: 'white', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer'
              }}
            >
              🚀 Start Game!
            </button>
            <button onClick={() => setMode('menu')} style={{...styles.secondaryBtn, width: '100%', marginTop: '8px'}}>← Back</button>
          </div>
        )}

        {mode === 'life' && lifePhase === 'spin' && lifePlayers.length > 0 && (() => {
          const player = lifePlayers[lifeCurrentPlayer];
          const allRetired = lifePlayers.every(p => p.position >= lifeBoardSpaces.length - 1);
          
          if (allRetired) {
            setLifePhase('summary');
            return null;
          }

          // Get the NEXT space (where they'll move to)
          const nextPos = Math.min(player.position + 1, lifeBoardSpaces.length - 1);
          const nextSpace = lifeBoardSpaces[nextPos];
          
          return (
            <div>
              {/* Current player indicator */}
              <div style={{textAlign: 'center', marginBottom: '12px'}}>
                <div style={{fontSize: '24px'}}>{player.emoji}</div>
                <div style={{fontWeight: 'bold', color: player.color, fontSize: '18px'}}>{player.name}'s Turn</div>
                <div style={{fontSize: '13px', color: '#666'}}>💰 ${player.money.toLocaleString()}</div>
                <div style={{fontSize: '14px', color: '#374151', marginTop: '4px'}}>
                  Stop {player.position + 1} of {lifeBoardSpaces.length}
                </div>
              </div>
              
              {/* Mini Board */}
              <div style={{background: '#f9fafb', padding: '12px', borderRadius: '12px', marginBottom: '12px', overflowX: 'auto'}}>
                <div style={{display: 'flex', gap: '4px', minWidth: 'max-content'}}>
                  {lifeBoardSpaces.map((space, i) => {
                    const playersHere = lifePlayers.filter(p => p.position === i);
                    const isNext = i === nextPos;
                    return (
                      <div key={i} style={{
                        width: '36px', height: '44px', borderRadius: '6px', fontSize: '10px', textAlign: 'center',
                        background: i === 0 ? '#22c55e' : i === lifeBoardSpaces.length - 1 ? '#f59e0b' : space.type === 'career' ? '#3b82f6' : space.type === 'house' ? '#8b5cf6' : space.type === 'event' ? '#ec4899' : '#e5e7eb',
                        color: ['start', 'retire', 'career', 'house', 'event'].includes(space.type) ? 'white' : '#666',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        border: isNext ? '3px solid #fbbf24' : '1px solid rgba(0,0,0,0.1)', 
                        position: 'relative',
                        transform: isNext ? 'scale(1.1)' : 'none',
                        boxShadow: isNext ? '0 0 10px rgba(251, 191, 36, 0.5)' : 'none'
                      }}>
                        <span style={{fontSize: '14px'}}>{space.emoji}</span>
                        {playersHere.length > 0 && (
                          <div style={{position: 'absolute', bottom: '-2px', display: 'flex', gap: '1px'}}>
                            {playersHere.map((p, pi) => <span key={pi} style={{fontSize: '10px'}}>{p.emoji}</span>)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Player cards/stats */}
              <div style={{display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap'}}>
                {player.career && <div style={{background: '#dbeafe', padding: '4px 8px', borderRadius: '6px', fontSize: '12px'}}>💼 {player.career.title}</div>}
                {player.house && <div style={{background: '#f3e8ff', padding: '4px 8px', borderRadius: '6px', fontSize: '12px'}}>🏠 {player.house.name}</div>}
                {player.spouse && <div style={{background: '#fce7f3', padding: '4px 8px', borderRadius: '6px', fontSize: '12px'}}>💍 Married</div>}
                {player.kids > 0 && <div style={{background: '#fef3c7', padding: '4px 8px', borderRadius: '6px', fontSize: '12px'}}>👶 {player.kids} kid{player.kids > 1 ? 's' : ''}</div>}
              </div>
              
              {/* Next stop preview */}
              <div style={{background: 'linear-gradient(135deg, #fef3c7, #fde68a)', padding: '16px', borderRadius: '12px', marginBottom: '16px', textAlign: 'center'}}>
                <div style={{fontSize: '12px', color: '#92400e', marginBottom: '4px'}}>Next Stop:</div>
                <div style={{fontSize: '32px', marginBottom: '4px'}}>{nextSpace.emoji}</div>
                <div style={{fontWeight: 'bold', color: '#78350f', fontSize: '16px'}}>{nextSpace.label}</div>
              </div>
              
              {/* Answer questions before moving */}
              <div style={{textAlign: 'center', marginBottom: '16px'}}>
                <div style={{marginBottom: '12px', padding: '8px 16px', background: '#f0f9ff', borderRadius: '8px', display: 'inline-block'}}>
                  <span style={{fontSize: '14px', color: '#0369a1'}}>
                    Answer 2 questions correctly to move! ({lifeQuestionsCorrect}/2) ✅
                  </span>
                </div>
                <br/>
                <button
                  onClick={() => {
                    // Start question phase to earn the move
                    setLifePendingMove(true);
                    setLifeQuestionsCorrect(0);
                    
                    // Ensure we have questions - reshuffle if needed
                    let questions = shuffledQuestions;
                    let idx = currentIndex;
                    if (!questions[idx]) {
                      questions = shuffle([...unitQuestions]);
                      setShuffledQuestions(questions);
                      idx = 0;
                      setCurrentIndex(0);
                    }
                    
                    const q = questions[idx];
                    if (q) {
                      const wrong = getWrongAnswers(q.a, q.topic, q.wrong);
                      setLifeChoices(shuffle([q.a, ...wrong]));
                    }
                    
                    setLifePhase('question');
                  }}
                  disabled={player.position >= lifeBoardSpaces.length - 1}
                  style={{
                    padding: '16px 40px', background: theme.gradient,
                    color: 'white', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer'
                  }}
                >
                  📝 Answer Questions
                </button>
              </div>
              
              {/* All players scoreboard */}
              {lifePlayers.length > 1 && (
                <div style={{background: '#f9fafb', padding: '12px', borderRadius: '12px'}}>
                  <div style={{fontWeight: 'bold', marginBottom: '8px', fontSize: '13px'}}>📊 Scoreboard</div>
                  {lifePlayers.map((p, i) => (
                    <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: i < lifePlayers.length - 1 ? '1px solid #e5e7eb' : 'none'}}>
                      <span style={{color: p.color, fontWeight: i === lifeCurrentPlayer ? 'bold' : 'normal'}}>{p.emoji} {p.name}</span>
                      <span style={{fontSize: '13px'}}>${p.money.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {mode === 'life' && lifePhase === 'question' && lifePlayers.length > 0 && !currentQ && (
          <div style={{textAlign: 'center', padding: '20px'}}>
            <p>Loading questions...</p>
            <button onClick={() => {
              const qs = shuffle([...unitQuestions]);
              setShuffledQuestions(qs);
              setCurrentIndex(0);
              const q = qs[0];
              if (q) {
                const wrong = getWrongAnswers(q.a, q.topic, q.wrong);
                setLifeChoices(shuffle([q.a, ...wrong]));
              }
            }} style={{padding: '12px 24px', background: theme.gradient, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>
              Load Questions
            </button>
          </div>
        )}
        
        {mode === 'life' && lifePhase === 'question' && lifePlayers.length > 0 && currentQ && (() => {
          const player = lifePlayers[lifeCurrentPlayer];
          const nextPos = Math.min(player.position + 1, lifeBoardSpaces.length - 1);
          const nextSpace = lifeBoardSpaces[nextPos];
          
          return (
            <div>
              <div style={{textAlign: 'center', marginBottom: '12px'}}>
                <span style={{color: player.color, fontWeight: 'bold'}}>{player.emoji} {player.name}</span>
                {lifePendingMove && (
                  <div style={{marginTop: '8px', padding: '6px 12px', background: '#dbeafe', borderRadius: '8px', display: 'inline-block'}}>
                    <span style={{fontSize: '13px', color: '#1e40af'}}>
                      {lifeQuestionsCorrect}/2 correct to reach {nextSpace.emoji} {nextSpace.label}
                    </span>
                  </div>
                )}
                {lifePendingChoice && !lifePendingMove && (
                  <span style={{color: '#666'}}> — {lifePendingChoice.type === 'career' ? '💼 Career Choice!' : lifePendingChoice.type === 'house' ? '🏠 House Choice!' : '🎯 Life Choice!'}</span>
                )}
              </div>
              
              <div style={{...styles.card, background: 'linear-gradient(135deg, #f0f4ff, #faf5ff)', border: '1px solid #e5e7eb'}}>
                <div style={styles.topicLabel}>{currentQ.topic}</div>
                <p style={{fontWeight: 'bold', color: '#1f2937', margin: 0}}>{currentQ.q}</p>
              </div>
              
              <div style={{display: 'grid', gap: '8px', marginTop: '12px'}}>
                {lifeChoices.map((choice, idx) => {
                  let bg = 'white';
                  let border = '2px solid #e5e7eb';
                  if (lifeShowFeedback) {
                    if (choice === currentQ.a) {
                      bg = '#dcfce7';
                      border = '2px solid #22c55e';
                    } else if (lifeShowFeedback === 'wrong') {
                      bg = '#fee2e2';
                      border = '2px solid #ef4444';
                    }
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (lifeShowFeedback) return;
                        const isCorrect = choice === currentQ.a;
                        setLifeShowFeedback(isCorrect ? 'correct' : 'wrong');
                        recordAnswer(currentQ.id, isCorrect);
                        
                        const updatedPlayers = [...lifePlayers];
                        if (isCorrect) {
                          updatedPlayers[lifeCurrentPlayer].correctAnswers += 1;
                          updatedPlayers[lifeCurrentPlayer].money += 5000;
                        }
                        setLifePlayers(updatedPlayers);
                        
                        setTimeout(() => {
                          setLifeShowFeedback(null);
                          setCurrentIndex(prev => prev + 1);
                          
                          // If we're in "pending move" mode (need 2 correct to move)
                          if (lifePendingMove) {
                            const newCorrectCount = isCorrect ? lifeQuestionsCorrect + 1 : lifeQuestionsCorrect;
                            setLifeQuestionsCorrect(newCorrectCount);
                            
                            if (newCorrectCount >= 2) {
                              // Got 2 correct! Now move forward
                              setLifePendingMove(false);
                              setLifeQuestionsCorrect(0);
                              
                              // Move player forward 1 space
                              const newPos = Math.min(player.position + 1, lifeBoardSpaces.length - 1);
                              updatedPlayers[lifeCurrentPlayer] = { ...updatedPlayers[lifeCurrentPlayer], position: newPos };
                              setLifePlayers(updatedPlayers);
                              
                              // Check what space they landed on
                              const space = lifeBoardSpaces[newPos];
                              
                              if (space.type === 'retire') {
                                const bonus = updatedPlayers[lifeCurrentPlayer].career ? updatedPlayers[lifeCurrentPlayer].career!.salary : 0;
                                updatedPlayers[lifeCurrentPlayer].money += bonus;
                                setLifePlayers(updatedPlayers);
                                setLifeEvent({ text: '🎉 RETIREMENT! Final salary bonus!', emoji: '🏖️', effect: `+$${bonus.toLocaleString()}` });
                                setLifePhase('event');
                              } else if (space.type === 'event' && space.event) {
                                const evt = space.event;
                                updatedPlayers[lifeCurrentPlayer].money += evt.money || 0;
                                setLifePlayers(updatedPlayers);
                                setLifeEvent({ text: evt.text, emoji: space.emoji, effect: evt.effect });
                                setLifePhase('event');
                              } else if (space.type === 'career' || space.type === 'house' || space.type === 'choice') {
                                // Go to choice phase
                                setLifePendingChoice({
                                  type: space.type,
                                  goodChoice: space.goodChoice,
                                  badChoice: space.badChoice
                                });
                                setLifeGotItRight(true); // They got 2 correct, so they get the good choice!
                                setLifePhase('choice');
                              } else {
                                // Start space - next player
                                const nextPlayer = (lifeCurrentPlayer + 1) % lifePlayers.length;
                                setLifeCurrentPlayer(nextPlayer);
                                setLifePhase('spin');
                              }
                            } else {
                              // Not enough correct yet, keep asking questions
                              if (shuffledQuestions[currentIndex + 1]) {
                                const q = shuffledQuestions[currentIndex + 1];
                                const wrong = getWrongAnswers(q.a, q.topic, q.wrong);
                                setLifeChoices(shuffle([q.a, ...wrong]));
                              }
                            }
                          } else if (lifePendingChoice) {
                            // Old flow for choice-based questions
                            setLifePhase('choice');
                          } else {
                            // Next player
                            const nextPlayer = (lifeCurrentPlayer + 1) % lifePlayers.length;
                            setLifeCurrentPlayer(nextPlayer);
                            setLifePhase('spin');
                          }
                        }, 1200);
                      }}
                      disabled={lifeShowFeedback !== null}
                      style={{
                        padding: '12px 16px', border, borderRadius: '12px', background: bg,
                        cursor: lifeShowFeedback ? 'default' : 'pointer', textAlign: 'left', fontSize: '14px', transition: 'all 0.2s'
                      }}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
              
              {lifeShowFeedback && (
                <div style={{
                  marginTop: '12px', padding: '12px', borderRadius: '12px',
                  background: lifeShowFeedback === 'correct' ? '#dcfce7' : '#fee2e2', textAlign: 'center'
                }}>
                  <p style={{fontWeight: 'bold', margin: 0}}>
                    {lifeShowFeedback === 'correct' ? `✅ Correct! +$5,000 (${lifeQuestionsCorrect + 1}/2)` : '❌ Wrong! Try again...'}
                  </p>
                </div>
              )}
            </div>
          );
        })()}

        {mode === 'life' && lifePhase === 'choice' && lifePendingChoice && lifePlayers.length > 0 && (() => {
          const player = lifePlayers[lifeCurrentPlayer];
          const gotItRight = player.correctAnswers > (player.career ? 1 : 0) + (player.house ? 1 : 0);
          const goodOptions = lifePendingChoice.options.filter((o: any) => o.effect.requirement === 'correct');
          const anyOptions = lifePendingChoice.options.filter((o: any) => o.effect.requirement === 'any');
          
          return (
            <div>
              <div style={{textAlign: 'center', marginBottom: '16px'}}>
                <div style={{fontSize: '36px', marginBottom: '8px'}}>{lifePendingChoice.type === 'career' ? '💼' : '🏠'}</div>
                <h3 style={{margin: '0 0 8px 0', color: theme.primary}}>
                  Choose Your {lifePendingChoice.type === 'career' ? 'Career' : 'House'}!
                </h3>
                {!gotItRight && <p style={{color: '#ef4444', fontSize: '13px', margin: 0}}>🔒 Premium options locked — answer correctly next time!</p>}
              </div>
              
              <div style={{display: 'grid', gap: '8px'}}>
                {/* Premium options (need correct answer) */}
                {goodOptions.map((opt: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (!gotItRight) return;
                      const updatedPlayers = [...lifePlayers];
                      if (lifePendingChoice.type === 'career') {
                        updatedPlayers[lifeCurrentPlayer].career = { title: opt.text, salary: opt.effect.salary, emoji: opt.emoji };
                      } else {
                        updatedPlayers[lifeCurrentPlayer].house = { name: opt.text, value: opt.effect.value, emoji: opt.emoji };
                        updatedPlayers[lifeCurrentPlayer].money -= opt.effect.value;
                      }
                      setLifePlayers(updatedPlayers);
                      setLifePendingChoice(null);
                      const nextPlayer = (lifeCurrentPlayer + 1) % lifePlayers.length;
                      setLifeCurrentPlayer(nextPlayer);
                      setLifePhase('spin');
                    }}
                    disabled={!gotItRight}
                    style={{
                      padding: '14px', border: gotItRight ? '2px solid #22c55e' : '2px solid #d1d5db', borderRadius: '12px',
                      background: gotItRight ? '#dcfce7' : '#f3f4f6', cursor: gotItRight ? 'pointer' : 'not-allowed',
                      textAlign: 'left', opacity: gotItRight ? 1 : 0.5, display: 'flex', alignItems: 'center', gap: '12px'
                    }}
                  >
                    <span style={{fontSize: '28px'}}>{opt.emoji}</span>
                    <div>
                      <div style={{fontWeight: 'bold'}}>{opt.text}</div>
                      <div style={{fontSize: '12px', color: '#666'}}>
                        {lifePendingChoice.type === 'career' ? `$${opt.effect.salary.toLocaleString()}/yr` : `$${opt.effect.value.toLocaleString()}`}
                      </div>
                    </div>
                    {!gotItRight && <span style={{marginLeft: 'auto'}}>🔒</span>}
                  </button>
                ))}
                
                {/* Basic options (always available) */}
                {anyOptions.map((opt: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => {
                      const updatedPlayers = [...lifePlayers];
                      if (lifePendingChoice.type === 'career') {
                        updatedPlayers[lifeCurrentPlayer].career = { title: opt.text, salary: opt.effect.salary, emoji: opt.emoji };
                      } else {
                        updatedPlayers[lifeCurrentPlayer].house = { name: opt.text, value: opt.effect.value, emoji: opt.emoji };
                        updatedPlayers[lifeCurrentPlayer].money -= opt.effect.value;
                      }
                      setLifePlayers(updatedPlayers);
                      setLifePendingChoice(null);
                      const nextPlayer = (lifeCurrentPlayer + 1) % lifePlayers.length;
                      setLifeCurrentPlayer(nextPlayer);
                      setLifePhase('spin');
                    }}
                    style={{
                      padding: '14px', border: '2px solid #e5e7eb', borderRadius: '12px',
                      background: 'white', cursor: 'pointer', textAlign: 'left',
                      display: 'flex', alignItems: 'center', gap: '12px'
                    }}
                  >
                    <span style={{fontSize: '28px'}}>{opt.emoji}</span>
                    <div>
                      <div style={{fontWeight: 'bold'}}>{opt.text}</div>
                      <div style={{fontSize: '12px', color: '#666'}}>
                        {lifePendingChoice.type === 'career' ? `$${opt.effect.salary.toLocaleString()}/yr` : `$${opt.effect.value.toLocaleString()}`}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })()}

        {mode === 'life' && lifePhase === 'event' && lifeEvent && lifePlayers.length > 0 && (
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '64px', marginBottom: '16px'}}>{lifeEvent.emoji}</div>
            <h2 style={{margin: '0 0 8px 0', color: theme.primary}}>{lifeEvent.text}</h2>
            <p style={{fontSize: '18px', color: '#666', marginBottom: '24px'}}>{lifeEvent.effect}</p>
            <button
              onClick={() => {
                setLifeEvent(null);
                // Check if all players retired
                const allRetired = lifePlayers.every(p => p.position >= lifeBoardSpaces.length - 1);
                if (allRetired) {
                  setLifePhase('summary');
                } else {
                  const nextPlayer = (lifeCurrentPlayer + 1) % lifePlayers.length;
                  setLifeCurrentPlayer(nextPlayer);
                  setLifePhase('spin');
                }
              }}
              style={{padding: '14px 32px', background: theme.gradient, color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'}}
            >
              Continue
            </button>
          </div>
        )}

        {mode === 'life' && lifePhase === 'summary' && lifePlayers.length > 0 && (() => {
          // Calculate final scores
          const rankedPlayers = [...lifePlayers].map(p => ({
            ...p,
            finalScore: p.money + (p.house?.value || 0) + (p.career?.salary || 0) * 5 + p.kids * 10000 + (p.spouse ? 20000 : 0)
          })).sort((a, b) => b.finalScore - a.finalScore);
          
          const winner = rankedPlayers[0];
          
          return (
            <div>
              <div style={{textAlign: 'center', marginBottom: '20px'}}>
                <div style={{fontSize: '48px', marginBottom: '8px'}}>🏆</div>
                <h2 style={{margin: '0 0 8px 0', color: theme.primary}}>
                  {lifePlayers.length > 1 ? `${winner.name} Wins!` : 'Game Over!'}
                </h2>
                <div style={{fontSize: '24px', color: winner.color}}>{winner.emoji}</div>
              </div>
              
              {/* Final standings */}
              <div style={{marginBottom: '16px'}}>
                {rankedPlayers.map((p, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
                    background: i === 0 ? '#fef3c7' : '#f9fafb', borderRadius: '12px', marginBottom: '8px',
                    border: i === 0 ? '2px solid #f59e0b' : '1px solid #e5e7eb'
                  }}>
                    <div style={{fontSize: '24px', fontWeight: 'bold', color: i === 0 ? '#f59e0b' : '#9ca3af', width: '30px'}}>#{i + 1}</div>
                    <div style={{fontSize: '28px'}}>{p.emoji}</div>
                    <div style={{flex: 1}}>
                      <div style={{fontWeight: 'bold', color: p.color}}>{p.name}</div>
                      <div style={{fontSize: '12px', color: '#666', display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                        {p.career && <span>💼 {p.career.title}</span>}
                        {p.house && <span>🏠 {p.house.name}</span>}
                        {p.spouse && <span>💍</span>}
                        {p.kids > 0 && <span>👶×{p.kids}</span>}
                      </div>
                    </div>
                    <div style={{textAlign: 'right'}}>
                      <div style={{fontWeight: 'bold', fontSize: '16px'}}>${p.finalScore.toLocaleString()}</div>
                      <div style={{fontSize: '11px', color: '#666'}}>Total Value</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{display: 'flex', gap: '8px'}}>
                <button onClick={() => startMode('life')} style={{...styles.primaryBtn, background: theme.gradient, flex: 1}}>Play Again</button>
                <button onClick={() => setMode('menu')} style={{...styles.secondaryBtn, flex: 1}}>Menu</button>
              </div>
            </div>
          );
        })()}

        {/* Wheel of Fortune */}
        {mode === 'wheel' && currentQ && (
          <div>
            <div style={styles.progress}>
              Question {currentIndex + 1} / {shuffledQuestions.length} • Solved: {wheelScore}
            </div>
            
            <div style={styles.card}>
              <div style={styles.topicLabel}>{currentQ.topic}</div>
              <div style={styles.question}>{currentQ.q}</div>
              
              {/* Answer display with blanks */}
              <div style={{marginTop: '24px', textAlign: 'center'}}>
                <div style={{
                  fontSize: '28px', fontFamily: 'monospace', letterSpacing: '4px', color: '#059669',
                  background: '#f0fdf4', padding: '16px', borderRadius: '12px', marginBottom: '16px'
                }}>
                  {getWheelDisplay(currentQ.a, wheelGuessedLetters)}
                </div>
                
                {/* Wrong guesses indicator */}
                <div style={{marginBottom: '16px', color: '#dc2626'}}>
                  {'❌'.repeat(wheelWrongGuesses)}{'⬜'.repeat(6 - wheelWrongGuesses)}
                </div>
              </div>
            </div>

            {!wheelSolved ? (
              <>
                {/* Letter buttons */}
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '24px'}}>
                  {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => {
                    const guessed = wheelGuessedLetters.includes(letter);
                    const inAnswer = currentQ.a.toUpperCase().includes(letter);
                    return (
                      <button
                        key={letter}
                        onClick={() => handleWheelGuess(letter)}
                        disabled={guessed}
                        style={{
                          width: '40px', height: '40px', borderRadius: '8px', border: 'none',
                          fontSize: '16px', fontWeight: 'bold', cursor: guessed ? 'default' : 'pointer',
                          background: guessed ? (inAnswer ? '#d1fae5' : '#fecaca') : 'white',
                          color: guessed ? (inAnswer ? '#059669' : '#dc2626') : '#374151',
                          opacity: guessed ? 0.6 : 1,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>

                {/* Solve it */}
                <div style={{display: 'flex', gap: '12px', justifyContent: 'center'}}>
                  <input
                    type="text"
                    value={wheelInput}
                    onChange={e => setWheelInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && wheelInput.trim() && handleWheelSolve()}
                    placeholder="Or type the full answer..."
                    style={{
                      padding: '12px 16px', borderRadius: '12px', border: '2px solid #e5e7eb',
                      fontSize: '15px', width: '250px', outline: 'none'
                    }}
                  />
                  <button 
                    onClick={handleWheelSolve} 
                    disabled={!wheelInput.trim()}
                    style={{...styles.primaryBtn, opacity: wheelInput.trim() ? 1 : 0.5}}
                  >
                    Solve!
                  </button>
                </div>
              </>
            ) : (
              <WheelResult
                currentQ={currentQ}
                wheelGuessedLetters={wheelGuessedLetters}
                wheelWrongGuesses={wheelWrongGuesses}
                wheelScore={wheelScore}
                currentIndex={currentIndex}
                totalQuestions={shuffledQuestions.length}
                wheelNextQuestion={wheelNextQuestion}
                startMode={startMode}
                getWheelDisplay={getWheelDisplay}
                styles={styles}
              />
            )}
          </div>
        )}

        {/* Bomb Defusal Mode */}
        {mode === 'bomb' && currentQ && (
          <div style={{transform: bombShake ? 'translateX(8px)' : 'none', transition: 'transform 0.1s'}}>
            {/* Active game */}
            {!bombExploded && !bombDefused && (
              <div>
                {/* Timer and wires */}
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                  <div style={{
                    fontSize: '48px', fontWeight: 'bold', fontFamily: 'monospace',
                    color: bombTime <= 10 ? '#dc2626' : bombTime <= 20 ? '#f59e0b' : '#059669',
                    animation: bombTime <= 10 ? 'pulse 0.5s infinite' : 'none',
                    textShadow: bombTime <= 10 ? '0 0 20px rgba(220,38,38,0.5)' : 'none'
                  }}>
                    {Math.floor(bombTime / 60)}:{(bombTime % 60).toString().padStart(2, '0')}
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div style={{fontSize: '14px', color: '#6b7280', marginBottom: '4px'}}>WIRES CUT</div>
                    <div style={{fontSize: '28px', fontWeight: 'bold', color: '#059669'}}>{bombWiresCut}/{bombWiresTotal}</div>
                  </div>
                </div>

                {/* Wire progress bar */}
                <div style={{display: 'flex', gap: '4px', marginBottom: '24px'}}>
                  {Array.from({length: bombWiresTotal}).map((_, i) => (
                    <div key={i} style={{
                      flex: 1, height: '8px', borderRadius: '4px',
                      background: i < bombWiresCut ? '#22c55e' : (
                        i === bombWiresCut ? (bombFlash === 'green' ? '#22c55e' : bombFlash === 'red' ? '#dc2626' : '#e5e7eb') : '#e5e7eb'
                      ),
                      transition: 'background 0.3s',
                      boxShadow: i === bombWiresCut ? '0 0 8px rgba(220,38,38,0.3)' : 'none'
                    }} />
                  ))}
                </div>

                {/* Bomb emoji */}
                <div style={{textAlign: 'center', fontSize: '40px', marginBottom: '16px'}}>
                  💣 Wire {bombWiresCut + 1} of {bombWiresTotal}
                </div>

                {/* Question */}
                <div style={{...styles.card, borderLeft: `4px solid ${bombTime <= 10 ? '#dc2626' : '#f59e0b'}`, background: bombFlash === 'red' ? '#fef2f2' : bombFlash === 'green' ? '#f0fdf4' : 'white'}}>
                  <div style={styles.topicLabel}>{currentQ.topic}</div>
                  <div style={styles.question}>{currentQ.q}</div>
                </div>

                {/* Answer choices */}
                <div>
                  {quizChoices.map((choice, i) => (
                    <button key={i} onClick={() => handleBombAnswer(choice)} disabled={!!selectedAnswer}
                      style={{
                        ...styles.choiceBtn(!!selectedAnswer, choice === currentQ.a, choice === selectedAnswer),
                        borderLeft: '4px solid transparent',
                        ...(!!selectedAnswer && choice === currentQ.a ? {borderLeftColor: '#22c55e'} : {}),
                        ...(!!selectedAnswer && choice === selectedAnswer && choice !== currentQ.a ? {borderLeftColor: '#dc2626'} : {}),
                      }}>{choice}</button>
                  ))}
                </div>
              </div>
            )}

            {/* BOOM - Exploded */}
            {bombExploded && (
              <div style={{...styles.complete, background: 'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)'}}>
                <div style={{fontSize: '80px', marginBottom: '16px'}}>💥</div>
                <div style={{fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '8px'}}>
                  {bombTime === 0 ? 'TIME\'S UP!' : 'WRONG WIRE!'}
                </div>
                <div style={{fontSize: '18px', color: '#fecaca', marginBottom: '24px'}}>
                  The bomb exploded! You cut {bombWiresCut}/{bombWiresTotal} wires.
                </div>
                {currentQ && bombTime > 0 && (
                  <div style={{background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', marginBottom: '24px'}}>
                    <div style={{fontSize: '14px', color: '#fca5a5', marginBottom: '4px'}}>Correct answer:</div>
                    <div style={{fontSize: '16px', color: 'white', fontWeight: 'bold'}}>{currentQ.a}</div>
                  </div>
                )}
                <button onClick={() => startMode('bomb')} style={{...styles.primaryBtn, background: '#7f1d1d'}}>Try Again 💣</button>
              </div>
            )}

            {/* Defused! */}
            {bombDefused && (
              <div style={{...styles.complete, background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)'}}>
                <div style={{fontSize: '80px', marginBottom: '16px'}}>🎉</div>
                <div style={{fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '8px'}}>
                  BOMB DEFUSED!
                </div>
                <div style={{fontSize: '18px', color: '#a7f3d0', marginBottom: '24px'}}>
                  You cut all {bombWiresTotal} wires with {bombTime}s remaining!
                </div>
                <div className="challenge-stats" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px'}}>
                  <div style={{background: 'rgba(255,255,255,0.2)', padding: '16px', borderRadius: '12px'}}>
                    <div style={{fontSize: '12px', color: '#a7f3d0', marginBottom: '4px'}}>TIME LEFT</div>
                    <div style={{fontSize: '32px', fontWeight: 'bold', color: 'white'}}>{bombTime}s</div>
                  </div>
                  <div style={{background: 'rgba(255,255,255,0.2)', padding: '16px', borderRadius: '12px'}}>
                    <div style={{fontSize: '12px', color: '#a7f3d0', marginBottom: '4px'}}>WIRES CUT</div>
                    <div style={{fontSize: '32px', fontWeight: 'bold', color: 'white'}}>{bombWiresCut} ✂️</div>
                  </div>
                </div>
                {bombTime >= highScores.bomb && bombTime > 0 && (
                  <div style={{color: '#a7f3d0', fontWeight: 'bold', marginBottom: '16px', fontSize: '18px'}}>👑 New Best Time!</div>
                )}
                <div style={{color: '#6ee7b7', fontSize: '13px', marginBottom: '16px'}}>
                  Best Time Remaining: {highScores.bomb}s {highScores.bomb > 0 && '👑'}
                </div>
                <button onClick={() => startMode('bomb')} style={{...styles.primaryBtn, background: '#064e3b'}}>Play Again 💣</button>
              </div>
            )}
          </div>
        )}

        {/* Crossword */}
        {mode === 'crossword' && crosswordClues.across.length > 0 && (
          <div>
            <div className="crossword-layout" style={{display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px'}}>
              {/* Grid */}
              <div>
                <div style={{display: 'inline-grid', gridTemplateColumns: `repeat(15, 28px)`, gap: '1px', background: '#000', padding: '1px', borderRadius: '4px'}}>
                  {crosswordGrid.map((row, r) => 
                    row.map((cell, c) => {
                      if (!cell) {
                        return <div key={`${r}-${c}`} style={{width: '28px', height: '28px', background: '#1e3a8a'}} />;
                      }
                      // Find if this is a starting cell
                      const acrossClue = crosswordClues.across.find(cl => cl.row === r && cl.col === c);
                      const downClue = crosswordClues.down.find(cl => cl.row === r && cl.col === c);
                      const num = acrossClue?.num || downClue?.num;
                      
                      // Find which word this belongs to for input tracking
                      const inputKey = `${r}-${c}`;
                      const userInput = crosswordInputs[inputKey] || '';
                      const isCorrect = crosswordChecked && userInput.toUpperCase() === cell;
                      const isWrong = crosswordChecked && userInput && userInput.toUpperCase() !== cell;
                      
                      return (
                        <div key={`${r}-${c}`} style={{
                          width: '28px', height: '28px', background: isCorrect ? '#d1fae5' : isWrong ? '#fecaca' : 'white',
                          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          {num && <span style={{position: 'absolute', top: '1px', left: '2px', fontSize: '8px', color: '#6b7280'}}>{num}</span>}
                          <input
                            id={`cw-${r}-${c}`}
                            type="text"
                            maxLength={1}
                            value={crosswordChecked ? cell : userInput}
                            onChange={e => {
                              if (!crosswordChecked) {
                                const val = e.target.value.toUpperCase();
                                setCrosswordInputs(prev => ({...prev, [inputKey]: val}));
                                // Auto-advance to next cell (right first, then down)
                                if (val) {
                                  const nextRight = crosswordGrid[r]?.[c + 1];
                                  const nextDown = crosswordGrid[r + 1]?.[c];
                                  if (nextRight) {
                                    document.getElementById(`cw-${r}-${c + 1}`)?.focus();
                                  } else if (nextDown) {
                                    document.getElementById(`cw-${r + 1}-${c}`)?.focus();
                                  }
                                }
                              }
                            }}
                            onKeyDown={e => {
                              if (crosswordChecked) return;
                              if (e.key === 'Backspace' && !userInput) {
                                // Move back on empty backspace
                                const prevLeft = crosswordGrid[r]?.[c - 1];
                                const prevUp = crosswordGrid[r - 1]?.[c];
                                if (prevLeft) {
                                  document.getElementById(`cw-${r}-${c - 1}`)?.focus();
                                } else if (prevUp) {
                                  document.getElementById(`cw-${r - 1}-${c}`)?.focus();
                                }
                              }
                            }}
                            disabled={crosswordChecked}
                            style={{
                              width: '24px', height: '24px', border: 'none', textAlign: 'center',
                              fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase',
                              background: 'transparent', outline: 'none',
                              color: isCorrect ? '#059669' : isWrong ? '#dc2626' : '#1e3a8a'
                            }}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
                
                <div style={{marginTop: '24px', textAlign: 'center'}}>
                  {!crosswordChecked ? (
                    <button onClick={() => {
                      let correct = 0;
                      let total = 0;
                      crosswordGrid.forEach((row, r) => {
                        row.forEach((cell, c) => {
                          if (cell) {
                            total++;
                            if (crosswordInputs[`${r}-${c}`]?.toUpperCase() === cell) correct++;
                          }
                        });
                      });
                      setCrosswordScore(correct);
                      setCrosswordChecked(true);
                    }} style={styles.primaryBtn}>
                      Check Answers
                    </button>
                  ) : (
                    <div>
                      <div style={{fontSize: '24px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '16px'}}>
                        {crosswordScore} / {crosswordGrid.flat().filter(c => c).length} letters correct
                      </div>
                      <button onClick={() => startMode('crossword')} style={styles.primaryBtn}>New Puzzle</button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Clues */}
              <div style={{fontSize: '13px'}}>
                <div style={{marginBottom: '16px'}}>
                  <div style={{fontWeight: 'bold', color: '#1e3a8a', marginBottom: '8px'}}>ACROSS</div>
                  {crosswordClues.across.map(clue => (
                    <div key={`a${clue.num}`} style={{marginBottom: '8px', color: '#374151'}}>
                      <strong>{clue.num}.</strong> {clue.clue}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{fontWeight: 'bold', color: '#1e3a8a', marginBottom: '8px'}}>DOWN</div>
                  {crosswordClues.down.map(clue => (
                    <div key={`d${clue.num}`} style={{marginBottom: '8px', color: '#374151'}}>
                      <strong>{clue.num}.</strong> {clue.clue}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {mode === 'crossword' && crosswordClues.across.length === 0 && (
          <div style={styles.complete}>
            <div style={{fontSize: '20px', color: '#6b7280', marginBottom: '16px'}}>Couldn&apos;t generate a crossword with these questions. Try selecting a different topic or all topics.</div>
            <button onClick={() => setMode('menu')} style={styles.primaryBtn}>Back to Menu</button>
          </div>
        )}

        {/* Practice Test - Canvas LMS Style */}
        {mode === 'practicetest' && !practiceTestSubmitted && (
          <div>
            {/* Canvas-style header */}
            <div style={{background: '#f3f4f6', padding: '16px 20px', borderRadius: '8px', marginBottom: '24px', borderLeft: '4px solid #374151'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <div style={{fontSize: '18px', fontWeight: 'bold', color: '#374151'}}>{selectedUnit === 'All' ? 'BIOLOGY TEST' : `${selectedUnit.toUpperCase()} TEST`}</div>
                  <div style={{fontSize: '13px', color: '#6b7280', marginTop: '4px'}}>
                    {shuffledQuestions.length} Questions • {shuffledQuestions.length * 2.5} Points • {Object.keys(practiceTestAnswers).length} Answered
                  </div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontSize: '11px', color: '#6b7280', fontWeight: '600'}}>TIME LEFT</div>
                  <div style={{fontSize: '24px', fontWeight: 'bold', color: practiceTestTime <= 120 ? '#dc2626' : '#374151', fontFamily: 'monospace'}}>
                    {Math.floor(practiceTestTime / 60)}:{(practiceTestTime % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>

            {/* Questions */}
            {shuffledQuestions.map((q, idx) => {
              const choices = ((window as unknown as {practiceTestChoices: {[key: number]: string[]}}).practiceTestChoices || {})[idx] || [];
              const answered = practiceTestAnswers[idx];
              
              return (
                <div key={idx} style={{background: 'white', borderRadius: '8px', padding: '20px', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
                  {/* Question header */}
                  <div style={{display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px'}}>
                    <div style={{background: '#374151', color: 'white', padding: '8px 14px', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', minWidth: '32px', textAlign: 'center'}}>
                      {idx + 1}
                    </div>
                    <div style={{flex: 1}}>
                      <div style={{fontSize: '12px', color: '#9ca3af', marginBottom: '4px'}}>2.5 points • Multiple Choice</div>
                      <div style={{fontSize: '15px', color: '#374151', lineHeight: '1.5'}}>{q.q}</div>
                    </div>
                  </div>
                  
                  {/* Answer choices */}
                  <div style={{marginLeft: '56px'}}>
                    {choices.map((choice, ci) => (
                      <label key={ci} style={{display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '10px 0', cursor: 'pointer', borderBottom: ci < choices.length - 1 ? '1px solid #f3f4f6' : 'none'}}>
                        <input
                          type="radio"
                          name={`q${idx}`}
                          checked={answered === choice}
                          onChange={() => setPracticeTestAnswers(prev => ({...prev, [idx]: choice}))}
                          style={{marginTop: '3px', width: '16px', height: '16px', accentColor: '#374151'}}
                        />
                        <span style={{fontSize: '14px', color: '#374151'}}>{choice}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Submit button */}
            <div style={{textAlign: 'center', marginTop: '32px', marginBottom: '32px'}}>
              <button
                onClick={() => {
                  let correct = 0;
                  shuffledQuestions.forEach((q, idx) => {
                    if (practiceTestAnswers[idx] === q.a) {
                      correct++;
                      recordAnswer(q.id, true);
                    } else if (practiceTestAnswers[idx]) {
                      recordAnswer(q.id, false);
                    }
                  });
                  setPracticeTestScore(correct);
                  setPracticeTestSubmitted(true);
                  setPracticeTestRunning(false);
                }}
                disabled={Object.keys(practiceTestAnswers).length < shuffledQuestions.length}
                style={{
                  background: Object.keys(practiceTestAnswers).length >= shuffledQuestions.length ? '#374151' : '#d1d5db',
                  color: 'white',
                  border: 'none',
                  padding: '14px 48px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: Object.keys(practiceTestAnswers).length >= shuffledQuestions.length ? 'pointer' : 'not-allowed'
                }}
              >
                Submit Test
              </button>
              {Object.keys(practiceTestAnswers).length < shuffledQuestions.length && (
                <div style={{color: '#9ca3af', fontSize: '13px', marginTop: '8px'}}>
                  Answer all questions to submit ({shuffledQuestions.length - Object.keys(practiceTestAnswers).length} remaining)
                </div>
              )}
            </div>
          </div>
        )}

        {/* Practice Test Results */}
        {mode === 'practicetest' && practiceTestSubmitted && (
          <div>
            {/* Score header */}
            <div style={{background: 'linear-gradient(135deg, #374151 0%, #6b7280 100%)', padding: '32px', borderRadius: '12px', marginBottom: '24px', textAlign: 'center'}}>
              <div style={{fontSize: '14px', color: '#d1d5db', marginBottom: '8px'}}>TEST COMPLETE</div>
              <div style={{fontSize: '48px', fontWeight: 'bold', color: 'white', marginBottom: '8px'}}>
                {practiceTestScore * 2.5}/{shuffledQuestions.length * 2.5}
              </div>
              <div style={{fontSize: '18px', color: practiceTestScore / shuffledQuestions.length >= 0.7 ? '#86efac' : practiceTestScore / shuffledQuestions.length >= 0.5 ? '#fde047' : '#fca5a5'}}>
                {Math.round((practiceTestScore / shuffledQuestions.length) * 100)}%
              </div>
            </div>

            {/* Review answers */}
            {shuffledQuestions.map((q, idx) => {
              const choices = ((window as unknown as {practiceTestChoices: {[key: number]: string[]}}).practiceTestChoices || {})[idx] || [];
              const userAnswer = practiceTestAnswers[idx];
              const isCorrect = userAnswer === q.a;
              
              return (
                <div key={idx} style={{background: 'white', borderRadius: '8px', padding: '20px', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: `4px solid ${isCorrect ? '#10b981' : '#ef4444'}`}}>
                  <div style={{display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px'}}>
                    <div style={{background: isCorrect ? '#10b981' : '#ef4444', color: 'white', padding: '8px 14px', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', minWidth: '32px', textAlign: 'center'}}>
                      {idx + 1}
                    </div>
                    <div style={{flex: 1}}>
                      <div style={{fontSize: '12px', color: isCorrect ? '#10b981' : '#ef4444', fontWeight: '600', marginBottom: '4px'}}>
                        {isCorrect ? '2.5/2.5 points ✓' : '0/2.5 points ✗'}
                      </div>
                      <div style={{fontSize: '15px', color: '#374151', lineHeight: '1.5'}}>{q.q}</div>
                    </div>
                  </div>
                  
                  <div style={{marginLeft: '56px'}}>
                    {choices.map((choice, ci) => {
                      const isUserChoice = userAnswer === choice;
                      const isCorrectChoice = choice === q.a;
                      let bg = 'white';
                      let color = '#6b7280';
                      if (isCorrectChoice) { bg = '#d1fae5'; color = '#059669'; }
                      else if (isUserChoice && !isCorrect) { bg = '#fee2e2'; color = '#dc2626'; }
                      
                      return (
                        <div key={ci} style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', marginBottom: '4px', borderRadius: '6px', background: bg}}>
                          <div style={{width: '16px', height: '16px', borderRadius: '50%', border: `2px solid ${isUserChoice ? '#374151' : '#d1d5db'}`, background: isUserChoice ? '#374151' : 'white'}} />
                          <span style={{fontSize: '14px', color, fontWeight: isCorrectChoice ? '600' : '400'}}>{choice}</span>
                          {isCorrectChoice && <span style={{marginLeft: 'auto', fontSize: '12px', color: '#059669'}}>✓ Correct</span>}
                          {isUserChoice && !isCorrect && <span style={{marginLeft: 'auto', fontSize: '12px', color: '#dc2626'}}>Your answer</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div style={{textAlign: 'center', marginTop: '32px'}}>
              <button onClick={() => startMode('practicetest')} style={{...styles.primaryBtn, background: '#374151'}}>Take Again</button>
            </div>
          </div>
        )}

        {/* Challenge Mode */}
        {mode === 'challenge' && !challengeGameOver && currentQ && (
          <div>
            {/* Status bar */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)', padding: '16px 20px', borderRadius: '12px', marginBottom: '24px'}}>
              <div>
                <div style={{fontSize: '12px', color: '#fca5a5'}}>TIME LEFT</div>
                <div style={{fontSize: '28px', fontWeight: 'bold', color: 'white', fontFamily: 'monospace'}}>
                  {Math.floor(challengeTime / 60)}:{(challengeTime % 60).toString().padStart(2, '0')}
                </div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '12px', color: '#fca5a5'}}>STREAK</div>
                <div style={{fontSize: '28px', fontWeight: 'bold', color: '#fbbf24'}}>🔥 {challengeStreak}</div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '12px', color: '#fca5a5'}}>STRIKES</div>
                <div style={{fontSize: '24px'}}>
                  {[0,1,2].map(i => (
                    <span key={i} style={{color: i < challengeWrong ? '#fca5a5' : '#7f1d1d'}}>✗</span>
                  ))}
                </div>
              </div>
              <div style={{textAlign: 'right'}}>
                <div style={{fontSize: '12px', color: '#fca5a5'}}>SCORE</div>
                <div style={{fontSize: '28px', fontWeight: 'bold', color: 'white'}}>{challengeScore}</div>
              </div>
            </div>

            {/* Question */}
            <div style={styles.progress}>Question {currentIndex + 1} / {shuffledQuestions.length}</div>
            <div style={styles.card}>
              <div style={styles.topicLabel}>{currentQ.topic}</div>
              <div style={styles.question}>{currentQ.q}</div>
            </div>
            
            {/* Choices */}
            <div>
              {quizChoices.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (selectedAnswer) return;
                    setSelectedAnswer(choice);
                    const correct = choice === currentQ.a;
                    recordAnswer(currentQ.id, correct);
                    
                    if (correct) {
                      setChallengeScore(s => s + 10 + challengeStreak);
                      setChallengeStreak(s => {
                        const newStreak = s + 1;
                        if (newStreak > challengeBestStreak) setChallengeBestStreak(newStreak);
                        return newStreak;
                      });
                    } else {
                      setChallengeStreak(0);
                      setChallengeWrong(w => {
                        if (w + 1 >= 3) {
                          setChallengeRunning(false);
                          setChallengeGameOver(true);
                          checkHighScore('challenge', challengeScore);
                        }
                        return w + 1;
                      });
                    }
                    
                    // Auto advance after 1.5s if not game over
                    setTimeout(() => {
                      if (challengeWrong + (correct ? 0 : 1) < 3) {
                        const nextIdx = (currentIndex + 1) % shuffledQuestions.length;
                        setCurrentIndex(nextIdx);
                        setSelectedAnswer(null);
                        const nextQ = shuffledQuestions[nextIdx];
                        const wrong = getWrongAnswers(nextQ.a, nextQ.topic, nextQ.wrong);
                        setQuizChoices(shuffle([nextQ.a, ...wrong]));
                      }
                    }, 1200);
                  }}
                  disabled={!!selectedAnswer}
                  style={styles.choiceBtn(!!selectedAnswer, choice === currentQ.a, choice === selectedAnswer)}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Challenge Game Over */}
        {mode === 'challenge' && challengeGameOver && (
          <div style={{...styles.complete, background: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)'}}>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '24px'}}>
              ⚡ Challenge Complete
            </div>
            <div className="challenge-stats" style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px'}}>
              <div style={{background: 'rgba(255,255,255,0.2)', padding: '16px', borderRadius: '12px'}}>
                <div style={{fontSize: '12px', color: '#fecaca', marginBottom: '4px'}}>FINAL SCORE</div>
                <div style={{fontSize: '28px', fontWeight: 'bold', color: 'white'}}>{challengeScore}</div>
              </div>
              <div style={{background: 'rgba(255,255,255,0.2)', padding: '16px', borderRadius: '12px'}}>
                <div style={{fontSize: '12px', color: '#fecaca', marginBottom: '4px'}}>BEST STREAK</div>
                <div style={{fontSize: '28px', fontWeight: 'bold', color: '#fbbf24'}}>🔥 {challengeBestStreak}</div>
              </div>
              <div style={{background: 'rgba(255,255,255,0.2)', padding: '16px', borderRadius: '12px'}}>
                <div style={{fontSize: '12px', color: '#fecaca', marginBottom: '4px'}}>TIME USED</div>
                <div style={{fontSize: '28px', fontWeight: 'bold', color: 'white'}}>
                  {Math.floor((300 - challengeTime) / 60)}:{((300 - challengeTime) % 60).toString().padStart(2, '0')}
                </div>
              </div>
            </div>
            <div style={{fontSize: '16px', color: '#fecaca', marginBottom: '16px'}}>
              {challengeWrong >= 3 ? '3 strikes - you\'re out!' : 'Time\'s up!'}
            </div>
            {challengeScore >= highScores.challenge && challengeScore > 0 && (
              <div style={{color: '#fbbf24', fontWeight: 'bold', marginBottom: '16px', fontSize: '18px'}}>👑 New High Score!</div>
            )}
            <div style={{color: '#fca5a5', fontSize: '13px', marginBottom: '16px'}}>
              High Score: {highScores.challenge} {highScores.challenge > 0 && '👑'}
            </div>
            <button onClick={() => startMode('challenge')} style={{...styles.primaryBtn, background: '#fecaca', color: '#7f1d1d'}}>Try Again</button>
          </div>
        )}

        {/* Snake Game */}
        {mode === 'snake' && !snakeGameOver && (
          <div>
            {/* Score bar */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #166534 0%, #22c55e 100%)', padding: '12px 20px', borderRadius: '12px', marginBottom: '16px'}}>
              <div style={{color: '#dcfce7', fontSize: '14px'}}>🐍 Length: <strong style={{color: 'white'}}>{snakeBody.length}</strong></div>
              <div style={{color: '#dcfce7', fontSize: '14px'}}>Score: <strong style={{color: 'white'}}>{snakeScore}</strong></div>
            </div>

            {/* Game board */}
            {!snakeShowQuestion && (
              <div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(20, 1fr)', gap: '1px', background: '#166534', padding: '4px', borderRadius: '8px', aspectRatio: '1', maxWidth: '400px', margin: '0 auto'}}>
                  {Array.from({length: 400}).map((_, i) => {
                    const x = i % 20;
                    const y = Math.floor(i / 20);
                    const isSnakeHead = snakeBody[0]?.x === x && snakeBody[0]?.y === y;
                    const isSnakeBody = snakeBody.slice(1).some(seg => seg.x === x && seg.y === y);
                    const isFood = snakeFood.x === x && snakeFood.y === y;
                    
                    let bg = '#dcfce7';
                    if (isSnakeHead) bg = '#166534';
                    else if (isSnakeBody) bg = '#22c55e';
                    else if (isFood) bg = '#ef4444';
                    
                    return (
                      <div key={i} style={{
                        background: bg,
                        borderRadius: isSnakeHead ? '4px' : isFood ? '50%' : '2px',
                        aspectRatio: '1'
                      }} />
                    );
                  })}
                </div>
                
                {/* Mobile controls */}
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', maxWidth: '200px', margin: '16px auto 0'}}>
                  <div />
                  <button onClick={() => { if (snakeDirRef.current !== 'down') { snakeDirRef.current = 'up'; setSnakeDir('up'); }}} 
                    style={{background: '#22c55e', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '20px', cursor: 'pointer'}}>⬆️</button>
                  <div />
                  <button onClick={() => { if (snakeDirRef.current !== 'right') { snakeDirRef.current = 'left'; setSnakeDir('left'); }}}
                    style={{background: '#22c55e', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '20px', cursor: 'pointer'}}>⬅️</button>
                  <div style={{background: '#166534', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px'}}>
                    {snakeDir === 'up' ? '⬆' : snakeDir === 'down' ? '⬇' : snakeDir === 'left' ? '⬅' : '➡'}
                  </div>
                  <button onClick={() => { if (snakeDirRef.current !== 'left') { snakeDirRef.current = 'right'; setSnakeDir('right'); }}}
                    style={{background: '#22c55e', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '20px', cursor: 'pointer'}}>➡️</button>
                  <div />
                  <button onClick={() => { if (snakeDirRef.current !== 'up') { snakeDirRef.current = 'down'; setSnakeDir('down'); }}}
                    style={{background: '#22c55e', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '20px', cursor: 'pointer'}}>⬇️</button>
                  <div />
                </div>
                <div style={{textAlign: 'center', color: '#6b7280', fontSize: '12px', marginTop: '8px'}}>Use arrow keys or buttons</div>
              </div>
            )}

            {/* Question popup */}
            {snakeShowQuestion && shuffledQuestions[snakeQuestionIndex] && (
              <div style={{background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'}}>
                <div style={{textAlign: 'center', marginBottom: '16px'}}>
                  <span style={{background: '#22c55e', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '13px'}}>
                    🍎 Answer to grow!
                  </span>
                </div>
                <div style={{fontSize: '16px', color: '#374151', marginBottom: '20px', lineHeight: '1.5'}}>
                  {shuffledQuestions[snakeQuestionIndex].q}
                </div>
                <div>
                  {quizChoices.map((choice, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const correct = choice === shuffledQuestions[snakeQuestionIndex].a;
                        recordAnswer(shuffledQuestions[snakeQuestionIndex].id, correct);
                        
                        if (correct) {
                          setSnakeScore(s => s + 10);
                          // Place new food
                          let newFood: {x: number, y: number};
                          do {
                            newFood = {
                              x: Math.floor(Math.random() * 20),
                              y: Math.floor(Math.random() * 20)
                            };
                          } while (snakeBody.some(seg => seg.x === newFood.x && seg.y === newFood.y));
                          setSnakeFood(newFood);
                          
                          // Next question
                          const nextQ = (snakeQuestionIndex + 1) % shuffledQuestions.length;
                          setSnakeQuestionIndex(nextQ);
                          const q = shuffledQuestions[nextQ];
                          const wrong = getWrongAnswers(q.a, q.topic, q.wrong);
                          setQuizChoices(shuffle([q.a, ...wrong]));
                          
                          setSnakeShowQuestion(false);
                        } else {
                          // Wrong answer = show correct answer, keep question visible
                          setSnakeRunning(false);
                          setSnakeGameOver(true);
                          // snakeShowQuestion stays true so popup remains
                        }
                      }}
                      disabled={snakeGameOver}
                      style={{
                        display: 'block', width: '100%', padding: '14px', marginBottom: '10px',
                        borderRadius: '10px', border: 'none', cursor: snakeGameOver ? 'default' : 'pointer',
                        background: snakeGameOver
                          ? (choice === shuffledQuestions[snakeQuestionIndex].a ? '#d1fae5' : '#fee2e2')
                          : '#f0fdf4',
                        color: snakeGameOver
                          ? (choice === shuffledQuestions[snakeQuestionIndex].a ? '#059669' : '#dc2626')
                          : '#166534',
                        fontSize: '14px', textAlign: 'left',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        fontWeight: snakeGameOver && choice === shuffledQuestions[snakeQuestionIndex].a ? 'bold' : 'normal'
                      }}
                    >
                      {snakeGameOver && choice === shuffledQuestions[snakeQuestionIndex].a && '✅ '}{choice}
                    </button>
                  ))}
                  {snakeGameOver && (
                    <button
                      onClick={() => setSnakeShowQuestion(false)}
                      style={{...styles.primaryBtn, marginTop: '12px', background: '#166534', width: '100%'}}
                    >
                      Continue →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Snake Game Over */}
        {mode === 'snake' && snakeGameOver && !snakeShowQuestion && (
          <div style={{...styles.complete, background: 'linear-gradient(135deg, #166534 0%, #22c55e 100%)'}}>
            <div style={{fontSize: '48px', marginBottom: '16px'}}>🐍</div>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '8px'}}>Game Over!</div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px', maxWidth: '280px', margin: '0 auto 16px'}}>
              <div style={{background: 'rgba(255,255,255,0.2)', padding: '16px', borderRadius: '12px'}}>
                <div style={{fontSize: '12px', color: '#bbf7d0', marginBottom: '4px'}}>LENGTH</div>
                <div style={{fontSize: '28px', fontWeight: 'bold', color: 'white'}}>{snakeBody.length}</div>
              </div>
              <div style={{background: 'rgba(255,255,255,0.2)', padding: '16px', borderRadius: '12px'}}>
                <div style={{fontSize: '12px', color: '#bbf7d0', marginBottom: '4px'}}>SCORE</div>
                <div style={{fontSize: '28px', fontWeight: 'bold', color: 'white'}}>{snakeScore}</div>
              </div>
            </div>
            {snakeScore >= highScores.snake && snakeScore > 0 && (
              <div style={{color: '#fbbf24', fontWeight: 'bold', marginBottom: '16px', fontSize: '18px'}}>👑 New High Score!</div>
            )}
            <div style={{color: '#bbf7d0', fontSize: '13px', marginBottom: '16px'}}>
              High Score: {highScores.snake} {highScores.snake > 0 && '👑'}
            </div>
            <button onClick={() => startMode('snake')} style={{...styles.primaryBtn, background: '#dcfce7', color: '#166534'}}>Play Again</button>
          </div>
        )}

        {/* Memory Game */}
        {mode === 'memory' && memoryMatches < 6 && (
          <div>
            {/* Stats bar */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)', padding: '12px 20px', borderRadius: '12px', marginBottom: '20px'}}>
              <div style={{color: '#ede9fe', fontSize: '14px'}}>Matches: <strong style={{color: 'white'}}>{memoryMatches}/6</strong></div>
              <div style={{color: '#ede9fe', fontSize: '14px'}}>Moves: <strong style={{color: 'white'}}>{memoryMoves}</strong></div>
            </div>

            {/* Card grid */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', maxWidth: '500px', margin: '0 auto'}}>
              {memoryCards.map((card) => {
                const isFlipped = memoryFlipped.includes(card.id) || card.matched;
                
                return (
                  <div
                    key={card.id}
                    onClick={() => {
                      if (memoryLocked || isFlipped || memoryFlipped.length >= 2) return;
                      
                      const newFlipped = [...memoryFlipped, card.id];
                      setMemoryFlipped(newFlipped);
                      
                      if (newFlipped.length === 2) {
                        setMemoryMoves(m => m + 1);
                        setMemoryLocked(true);
                        
                        const [first, second] = newFlipped;
                        const card1 = memoryCards.find(c => c.id === first)!;
                        const card2 = memoryCards.find(c => c.id === second)!;
                        
                        if (card1.pairId === card2.pairId && card1.type !== card2.type) {
                          // Match!
                          setTimeout(() => {
                            setMemoryCards(cards => cards.map(c => 
                              c.pairId === card1.pairId ? {...c, matched: true} : c
                            ));
                            setMemoryMatches(m => m + 1);
                            setMemoryFlipped([]);
                            setMemoryLocked(false);
                          }, 600);
                        } else {
                          // No match
                          setTimeout(() => {
                            setMemoryFlipped([]);
                            setMemoryLocked(false);
                          }, 1200);
                        }
                      }
                    }}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '12px',
                      cursor: isFlipped ? 'default' : 'pointer',
                      background: isFlipped 
                        ? (card.matched ? '#c4b5fd' : 'white')
                        : 'linear-gradient(135deg, #c4b5fd 0%, #ddd6fe 100%)',
                      boxShadow: isFlipped ? 'inset 0 2px 4px rgba(0,0,0,0.1)' : '0 4px 12px rgba(124,58,237,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px',
                      transition: 'all 0.3s ease',
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
                      border: card.matched ? '3px solid #7c3aed' : 'none',
                    }}
                  >
                    {isFlipped ? (
                      <div style={{
                        fontSize: card.content.length > 40 ? '10px' : card.content.length > 20 ? '11px' : '12px',
                        color: '#5b21b6',
                        textAlign: 'center',
                        lineHeight: '1.3',
                        fontWeight: card.type === 'a' ? '600' : '400',
                        transform: 'rotateY(180deg)',
                        overflow: 'hidden',
                      }}>
                        {card.type === 'q' ? '❓ ' : '✓ '}{card.content.length > 60 ? card.content.slice(0, 57) + '...' : card.content}
                      </div>
                    ) : (
                      <div style={{fontSize: '32px'}}>🧪</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Memory Complete */}
        {mode === 'memory' && memoryMatches >= 6 && (
          <div style={{...styles.complete, background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)'}}>
            <div style={{fontSize: '48px', marginBottom: '16px'}}>🧪🎉</div>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '8px'}}>All Matched!</div>
            <div style={{fontSize: '18px', color: '#ede9fe', marginBottom: '16px'}}>
              Completed in <strong>{memoryMoves}</strong> moves
            </div>
            {memoryMoves <= highScores.memory && (
              <div style={{color: '#fbbf24', fontWeight: 'bold', marginBottom: '16px', fontSize: '18px'}}>👑 New High Score!</div>
            )}
            <div style={{color: '#ddd6fe', fontSize: '13px', marginBottom: '16px'}}>
              Best: {highScores.memory < 999 ? `${highScores.memory} moves 👑` : 'No record yet'}
            </div>
            <div style={{fontSize: '14px', color: '#ddd6fe', marginBottom: '24px'}}>
              {memoryMoves <= 8 ? '🏆 Perfect memory!' : memoryMoves <= 12 ? '⭐ Great job!' : memoryMoves <= 18 ? '👍 Nice work!' : 'Keep practicing!'}
            </div>
            <button onClick={() => startMode('memory')} style={{...styles.primaryBtn, background: '#ede9fe', color: '#5b21b6'}}>Play Again</button>
          </div>
        )}
      </div>
    </div>
  );
}
