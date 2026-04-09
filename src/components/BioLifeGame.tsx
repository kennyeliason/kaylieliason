import { useState, useCallback, useEffect } from 'react';

// Import questions from StudyGuide (we'll extract them)
const units = [
  { key: 'Unit 9', label: 'Unit 9: Cell Structure & Transport', emoji: '🔬' },
  { key: 'Unit 10', label: 'Unit 10: Photosynthesis', emoji: '🌱' },
  { key: 'Unit 11', label: 'Unit 11: Genetics', emoji: '🧬' },
  { key: 'Unit 12', label: 'Unit 12: DNA & Protein Synthesis', emoji: '🧪' },
];

const gameLengths = [
  { key: 10, label: 'Quick Life', emoji: '⚡', desc: '~5 min' },
  { key: 15, label: 'Regular Life', emoji: '🎮', desc: '~10 min' },
  { key: 25, label: 'Full Life', emoji: '🏆', desc: '~15 min' },
];

// Life stages with scenarios
const lifeStages = [
  { name: 'High School', emoji: '🎒', scenarios: [
    { setup: "Your biology teacher asks you a question in front of the whole class...", success: "Nailed it! The class is impressed.", fail: "Awkward silence... you'll get it next time." },
    { setup: "SAT prep test has a science section...", success: "You crushed it! College scouts are watching.", fail: "Not your best work. You can retake it." },
    { setup: "Science fair project judging...", success: "First place! Scholarship opportunities open up.", fail: "Honorable mention. Still looks good on applications." },
    { setup: "AP Bio exam question...", success: "Perfect score on this section!", fail: "Missed points here, but you passed overall." },
    { setup: "Your crush asks for help studying biology...", success: "You explain it perfectly. They're impressed! 😊", fail: "You fumbled the explanation... still got their number though." },
  ]},
  { name: 'College', emoji: '🎓', scenarios: [
    { setup: "Freshman bio midterm...", success: "A+! Your GPA is looking great.", fail: "C+... time to hit the library harder." },
    { setup: "Research lab interview...", success: "You're hired! Great experience for your resume.", fail: "They went with another candidate. Keep applying!" },
    { setup: "Study group needs someone to explain this concept...", success: "You teach it perfectly. Everyone aces the test!", fail: "You tried your best. Group study session continues." },
    { setup: "Internship interview at a biotech company...", success: "You got the internship! $25/hour!", fail: "Not this time, but you made connections." },
    { setup: "Senior thesis defense...", success: "Committee is impressed! Summa cum laude!", fail: "Revisions needed, but you'll graduate on time." },
    { setup: "Med school application essay question...", success: "Compelling answer! Interview invitation incoming.", fail: "Form rejection. Consider other paths?" },
    { setup: "MCAT biology section...", success: "Top 10% score! Any school you want.", fail: "Average score. State schools still possible." },
  ]},
  { name: 'Career', emoji: '💼', scenarios: [
    { setup: "Job interview for research position...", success: "You're hired! Great starting salary.", fail: "They chose someone with more experience." },
    { setup: "Your boss asks you to explain results to investors...", success: "Funding secured! Promotion incoming.", fail: "Investors are confused. Back to the drawing board." },
    { setup: "Coworker needs help with their experiment...", success: "Your insight saves the project! Team MVP.", fail: "You tried. They figured it out eventually." },
    { setup: "Conference presentation Q&A...", success: "Brilliant answer! Job offers flood in.", fail: "Tough question. You handled it gracefully." },
    { setup: "Grant proposal review...", success: "$500K funded! Your lab is set.", fail: "Rejected. Time to revise and resubmit." },
    { setup: "Promotion interview...", success: "Senior Scientist! Corner office!", fail: "Not yet. Keep building your portfolio." },
    { setup: "Consulting opportunity...", success: "Side income! +$10K/month", fail: "They went with a bigger firm." },
    { setup: "Patent application for your discovery...", success: "Approved! Royalties incoming.", fail: "Prior art found. Back to innovating." },
  ]},
  { name: 'Peak Life', emoji: '🌟', scenarios: [
    { setup: "TED talk invitation on your research...", success: "Standing ovation! Viral video!", fail: "Technical difficulties. Still a good talk." },
    { setup: "Nobel committee reviewing your work...", success: "NOBEL PRIZE! You made it!", fail: "Honorable mention. Still incredible!" },
    { setup: "Writing a textbook chapter...", success: "Published! Students worldwide learn from you.", fail: "Editor requests revisions. It'll get there." },
    { setup: "Mentoring the next generation...", success: "Your student wins their own award!", fail: "They chose a different path. Still proud." },
    { setup: "Documentary interview about your career...", success: "Inspiring millions! Legacy secured.", fail: "Ended up on the cutting room floor." },
  ]},
];

// Questions database (same as StudyGuide)
const allQuestions = [
  // Unit 9
  { id: 1, unit: 'Unit 9', q: 'Which of the following is one of the three principles of the Cell Theory?', a: 'All cells arise from pre-existing cells', wrong: ['Cells can spontaneously generate from non-living matter', 'Only animal cells arise from other cells', 'Cells are created from proteins in the environment'] },
  { id: 6, unit: 'Unit 9', q: 'Which organelle is known as the powerhouse of the cell?', a: 'Mitochondrion', wrong: ['Chloroplast', 'Ribosome', 'Nucleus'] },
  { id: 3, unit: 'Unit 9', q: 'Which organelle is directly responsible for producing proteins?', a: 'Ribosome', wrong: ['Golgi apparatus', 'Rough endoplasmic reticulum', 'Nucleus'] },
  { id: 16, unit: 'Unit 9', q: 'The diffusion of water across a selectively permeable membrane is called...', a: 'Osmosis', wrong: ['Facilitated diffusion', 'Active transport', 'Endocytosis'] },
  { id: 17, unit: 'Unit 9', q: 'Which organelle modifies, packages, and ships proteins?', a: 'Golgi apparatus', wrong: ['Rough endoplasmic reticulum', 'Lysosome', 'Smooth endoplasmic reticulum'] },
  { id: 21, unit: 'Unit 9', q: "Which organelle controls the cell's activities and contains DNA?", a: 'Nucleus', wrong: ['Mitochondrion', 'Ribosome', 'Nucleolus'] },
  { id: 10, unit: 'Unit 9', q: 'What is the main function of the cell membrane?', a: 'To regulate what enters and exits the cell', wrong: ['To provide rigid structural support', 'To produce energy for the cell', 'To store genetic information'] },
  { id: 5, unit: 'Unit 9', q: 'Which organelle contains digestive enzymes and recycles waste in animal cells?', a: 'Lysosome', wrong: ['Peroxisome', 'Vacuole', 'Golgi apparatus'] },
  { id: 13, unit: 'Unit 9', q: 'What type of solution causes animal cells to shrink?', a: 'Hypertonic', wrong: ['Hypotonic', 'Isotonic', 'Neutral'] },
  { id: 14, unit: 'Unit 9', q: 'Endocytosis is a form of...', a: 'Active transport that moves large particles into the cell', wrong: ['Passive transport that requires no energy', 'Diffusion across the membrane', 'Osmosis of water molecules'] },
  { id: 28, unit: 'Unit 9', q: 'Which scientist is credited with first observing cells while studying cork?', a: 'Robert Hooke', wrong: ['Anton van Leeuwenhoek', 'Matthias Schleiden', 'Rudolf Virchow'] },
  { id: 7, unit: 'Unit 9', q: 'Which observation tells a scientist that an organism is a eukaryote?', a: 'The organism has membrane-bound organelles', wrong: ['The organism has ribosomes', 'The organism has a cell membrane', 'The organism contains DNA'] },
  { id: 30, unit: 'Unit 9', q: 'According to the endosymbiotic theory, which organelles have their own DNA?', a: 'Mitochondria and chloroplasts', wrong: ['Ribosomes and lysosomes', 'Golgi apparatus and endoplasmic reticulum', 'Nucleus and vacuoles'] },
  { id: 33, unit: 'Unit 9', q: 'Which structure is found in all eukaryotic cells?', a: 'Mitochondria', wrong: ['Chloroplasts', 'Cell wall', 'Central vacuole'] },
  { id: 40, unit: 'Unit 9', q: 'What is the function of the mitochondrion?', a: 'ATP production', wrong: ['Protein synthesis', 'Photosynthesis', 'Lipid storage'] },
  // Unit 10
  { id: 101, unit: 'Unit 10', q: 'What is the primary purpose of photosynthesis?', a: 'To convert light energy into chemical energy (glucose)', wrong: ['To break down glucose for energy', 'To produce oxygen for respiration', 'To absorb carbon dioxide from air'] },
  { id: 102, unit: 'Unit 10', q: 'Where do the light-dependent reactions of photosynthesis occur?', a: 'Thylakoid membranes', wrong: ['Stroma', 'Mitochondria', 'Cytoplasm'] },
  { id: 103, unit: 'Unit 10', q: 'What are the products of the light-dependent reactions?', a: 'ATP, NADPH, and O₂', wrong: ['Glucose and O₂', 'CO₂ and H₂O', 'Only ATP'] },
  { id: 104, unit: 'Unit 10', q: 'Where does the Calvin Cycle take place?', a: 'Stroma of the chloroplast', wrong: ['Thylakoid membrane', 'Mitochondrial matrix', 'Cytoplasm'] },
  { id: 105, unit: 'Unit 10', q: 'What is the primary function of chlorophyll?', a: 'To absorb light energy for photosynthesis', wrong: ['To store glucose', 'To transport water', 'To produce oxygen'] },
  { id: 106, unit: 'Unit 10', q: 'What gas is released as a byproduct of the light reactions?', a: 'Oxygen (O₂)', wrong: ['Carbon dioxide (CO₂)', 'Nitrogen (N₂)', 'Hydrogen (H₂)'] },
  { id: 107, unit: 'Unit 10', q: 'What molecule is the final product of the Calvin Cycle?', a: 'G3P (which is used to make glucose)', wrong: ['ATP', 'NADPH', 'Oxygen'] },
  { id: 108, unit: 'Unit 10', q: 'Which wavelengths of light are LEAST absorbed by chlorophyll?', a: 'Green', wrong: ['Red', 'Blue', 'Violet'] },
  { id: 109, unit: 'Unit 10', q: 'What is the role of water in photosynthesis?', a: 'It is split to provide electrons and release O₂', wrong: ['It is the final product', 'It carries glucose to other cells', 'It absorbs light energy'] },
  { id: 110, unit: 'Unit 10', q: 'How many turns of the Calvin Cycle are needed to produce one glucose molecule?', a: '6 turns', wrong: ['1 turn', '2 turns', '3 turns'] },
  { id: 111, unit: 'Unit 10', q: 'What provides the energy to power the Calvin Cycle?', a: 'ATP and NADPH from light reactions', wrong: ['Sunlight directly', 'Glucose breakdown', 'Oxygen'] },
  { id: 112, unit: 'Unit 10', q: 'What is carbon fixation?', a: 'The incorporation of CO₂ into organic molecules', wrong: ['The release of CO₂', 'The absorption of O₂', 'The breakdown of glucose'] },
  { id: 113, unit: 'Unit 10', q: 'Which organelle contains the enzymes for the Calvin Cycle?', a: 'Chloroplast', wrong: ['Mitochondrion', 'Ribosome', 'Nucleus'] },
  { id: 114, unit: 'Unit 10', q: 'What happens to glucose produced in photosynthesis?', a: 'Used for energy or stored as starch', wrong: ['Immediately released as CO₂', 'Converted to oxygen', 'Excreted from the plant'] },
  { id: 115, unit: 'Unit 10', q: 'Photosynthesis equation: 6CO₂ + 6H₂O + light → ?', a: 'C₆H₁₂O₆ + 6O₂', wrong: ['6CO₂ + 6H₂O', 'ATP + NADPH', '6O₂ + 6H₂O'] },
  // Unit 11
  { id: 201, unit: 'Unit 11', q: 'What is an allele?', a: 'Different versions of a gene', wrong: ['A type of chromosome', 'A protein', 'A cell'] },
  { id: 202, unit: 'Unit 11', q: 'What does "heterozygous" mean?', a: 'Having two different alleles for a trait (Aa)', wrong: ['Having two identical alleles', 'Having no alleles', 'Having three alleles'] },
  { id: 203, unit: 'Unit 11', q: 'In a Punnett square, Aa x Aa produces what ratio of phenotypes if A is dominant?', a: '3:1 (3 dominant : 1 recessive)', wrong: ['1:1', '2:2', '4:0'] },
  { id: 204, unit: 'Unit 11', q: 'What is a genotype?', a: 'The genetic makeup of an organism (letters like AA, Aa, aa)', wrong: ['The physical appearance', 'The number of chromosomes', 'The type of cell'] },
  { id: 205, unit: 'Unit 11', q: 'What is a phenotype?', a: 'The physical expression/appearance of a trait', wrong: ['The genetic code', 'A type of allele', 'A chromosome mutation'] },
  { id: 206, unit: 'Unit 11', q: 'Who is considered the "Father of Genetics"?', a: 'Gregor Mendel', wrong: ['Charles Darwin', 'James Watson', 'Robert Hooke'] },
  { id: 207, unit: 'Unit 11', q: 'What is a homozygous genotype?', a: 'Two identical alleles (AA or aa)', wrong: ['Two different alleles (Aa)', 'One allele only', 'Three alleles'] },
  { id: 208, unit: 'Unit 11', q: 'What does the Law of Segregation state?', a: 'Allele pairs separate during gamete formation', wrong: ['Alleles blend together', 'Dominant alleles are always expressed', 'Genes are always inherited together'] },
  { id: 209, unit: 'Unit 11', q: 'In codominance, how are both alleles expressed?', a: 'Both phenotypes appear together (like red AND white spots)', wrong: ['They blend into one color', 'One hides the other', 'Neither is expressed'] },
  { id: 210, unit: 'Unit 11', q: 'What is incomplete dominance?', a: 'A blend of two traits (red + white = pink)', wrong: ['One allele completely masks another', 'Both alleles show separately', 'Neither allele is expressed'] },
  { id: 211, unit: 'Unit 11', q: 'What type of inheritance is blood type (A, B, AB, O)?', a: 'Multiple alleles with codominance', wrong: ['Simple dominance', 'Incomplete dominance', 'X-linked'] },
  { id: 212, unit: 'Unit 11', q: 'If a trait is X-linked recessive, who is more likely to express it?', a: 'Males', wrong: ['Females', 'Both equally', 'Neither'] },
  { id: 213, unit: 'Unit 11', q: 'What organism did Mendel study?', a: 'Pea plants', wrong: ['Fruit flies', 'Mice', 'Bacteria'] },
  { id: 214, unit: 'Unit 11', q: 'A Punnett square cross of Aa x aa produces what genotype ratio?', a: '1:1 (Aa : aa)', wrong: ['3:1', '2:2', '1:2:1'] },
  { id: 215, unit: 'Unit 11', q: 'What is a carrier?', a: 'Someone heterozygous for a recessive trait (Aa) who doesn\'t show it', wrong: ['Someone who shows the dominant trait', 'Someone homozygous dominant', 'Someone with no alleles'] },
];

// Shuffle array helper
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Stats type
interface Stats {
  money: number;
  education: number;
  happiness: number;
  career: number;
}

// Game states
type GameState = 'menu' | 'playing' | 'result' | 'gameOver';

export default function BioLifeGame() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [selectedLength, setSelectedLength] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<typeof allQuestions>([]);
  const [scenarios, setScenarios] = useState<{stage: string, scenario: typeof lifeStages[0]['scenarios'][0], emoji: string}[]>([]);
  const [stats, setStats] = useState<Stats>({ money: 50, education: 50, happiness: 50, career: 50 });
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [currentScenario, setCurrentScenario] = useState<{stage: string, scenario: typeof lifeStages[0]['scenarios'][0], emoji: string} | null>(null);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);

  // Start game
  const startGame = useCallback(() => {
    if (!selectedUnit || !selectedLength) return;
    
    // Filter and shuffle questions for selected unit
    const unitQuestions = shuffleArray(allQuestions.filter(q => q.unit === selectedUnit)).slice(0, selectedLength);
    setQuestions(unitQuestions);
    
    // Generate scenarios for each question based on game length
    const generatedScenarios: typeof scenarios = [];
    const stageDistribution = selectedLength <= 10 
      ? [3, 3, 3, 1] // Quick: 3 HS, 3 College, 3 Career, 1 Peak
      : selectedLength <= 15 
        ? [4, 4, 5, 2] // Regular
        : [5, 7, 8, 5]; // Full
    
    let questionIndex = 0;
    lifeStages.forEach((stage, stageIndex) => {
      const count = stageDistribution[stageIndex] || 0;
      const stageScenarios = shuffleArray([...stage.scenarios]);
      for (let i = 0; i < count && questionIndex < selectedLength; i++) {
        generatedScenarios.push({
          stage: stage.name,
          emoji: stage.emoji,
          scenario: stageScenarios[i % stageScenarios.length]
        });
        questionIndex++;
      }
    });
    
    setScenarios(generatedScenarios);
    setStats({ money: 50, education: 50, happiness: 50, career: 50 });
    setCurrentQuestion(0);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setGameState('playing');
    
    // Set first scenario and shuffle answers
    if (generatedScenarios[0] && unitQuestions[0]) {
      setCurrentScenario(generatedScenarios[0]);
      setShuffledAnswers(shuffleArray([unitQuestions[0].a, ...unitQuestions[0].wrong]));
    }
  }, [selectedUnit, selectedLength]);

  // Handle answer
  const handleAnswer = useCallback((answer: string) => {
    if (!questions[currentQuestion] || showFeedback) return;
    
    const isCorrect = answer === questions[currentQuestion].a;
    setShowFeedback(isCorrect ? 'correct' : 'wrong');
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setStats(prev => ({
        money: Math.min(100, prev.money + 8),
        education: Math.min(100, prev.education + 10),
        happiness: Math.min(100, prev.happiness + 5),
        career: Math.min(100, prev.career + 7)
      }));
    } else {
      setWrongAnswers(prev => prev + 1);
      setStats(prev => ({
        money: Math.max(0, prev.money - 10),
        education: Math.max(0, prev.education - 8),
        happiness: Math.max(0, prev.happiness - 5),
        career: Math.max(0, prev.career - 12)
      }));
    }

    // Check for game over
    setTimeout(() => {
      const newStats = isCorrect 
        ? { ...stats, career: Math.min(100, stats.career + 7) }
        : { ...stats, career: Math.max(0, stats.career - 12) };
      
      if (newStats.career <= 0 || newStats.money <= 0) {
        setGameState('gameOver');
        return;
      }

      setShowFeedback(null);
      
      if (currentQuestion + 1 >= questions.length) {
        setGameState('result');
      } else {
        const nextQ = currentQuestion + 1;
        setCurrentQuestion(nextQ);
        setCurrentScenario(scenarios[nextQ]);
        setShuffledAnswers(shuffleArray([questions[nextQ].a, ...questions[nextQ].wrong]));
      }
    }, 1500);
  }, [currentQuestion, questions, scenarios, showFeedback, stats]);

  // Get life outcome based on stats
  const getLifeOutcome = () => {
    const avg = (stats.money + stats.education + stats.happiness + stats.career) / 4;
    if (avg >= 85) return { title: '🏆 Living Legend!', desc: 'Nobel Prize winner, billionaire philanthropist, and inspiration to millions. Your biology knowledge changed the world!', grade: 'S' };
    if (avg >= 70) return { title: '🌟 Incredible Success!', desc: 'Award-winning scientist with a loving family, dream job, and financial security. Life goals achieved!', grade: 'A' };
    if (avg >= 55) return { title: '😊 Great Life!', desc: 'Successful career, good relationships, and comfortable living. You should be proud!', grade: 'B' };
    if (avg >= 40) return { title: '🙂 Decent Life', desc: 'Some ups and downs, but you made it through. Room for improvement!', grade: 'C' };
    return { title: '😅 Rough Journey', desc: 'Life threw some curveballs. Time to study more biology and try again!', grade: 'D' };
  };

  // Reset game
  const resetGame = () => {
    setGameState('menu');
    setSelectedUnit(null);
    setSelectedLength(null);
    setQuestions([]);
    setScenarios([]);
    setCurrentQuestion(0);
    setShowFeedback(null);
  };

  // Render stat bar
  const StatBar = ({ label, value, emoji, color }: { label: string; value: number; emoji: string; color: string }) => (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '2px' }}>
        <span>{emoji} {label}</span>
        <span>{value}%</span>
      </div>
      <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ 
          width: `${value}%`, 
          height: '100%', 
          background: color,
          transition: 'width 0.5s ease',
          borderRadius: '4px'
        }} />
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Menu */}
        {gameState === 'menu' && (
          <>
            <h1 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '28px' }}>🎮 Bio Life</h1>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '24px' }}>Your biology knowledge shapes your destiny!</p>
            
            <h3 style={{ marginBottom: '12px' }}>📚 Choose Your Unit:</h3>
            <div style={{ display: 'grid', gap: '8px', marginBottom: '24px' }}>
              {units.map(unit => (
                <button
                  key={unit.key}
                  onClick={() => setSelectedUnit(unit.key)}
                  style={{
                    padding: '12px 16px',
                    border: selectedUnit === unit.key ? '2px solid #667eea' : '2px solid #e5e7eb',
                    borderRadius: '12px',
                    background: selectedUnit === unit.key ? '#f0f4ff' : 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px',
                    transition: 'all 0.2s'
                  }}
                >
                  {unit.emoji} {unit.label}
                </button>
              ))}
            </div>

            <h3 style={{ marginBottom: '12px' }}>⏱️ Choose Your Life Length:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '24px' }}>
              {gameLengths.map(length => (
                <button
                  key={length.key}
                  onClick={() => setSelectedLength(length.key)}
                  style={{
                    padding: '16px 8px',
                    border: selectedLength === length.key ? '2px solid #667eea' : '2px solid #e5e7eb',
                    borderRadius: '12px',
                    background: selectedLength === length.key ? '#f0f4ff' : 'white',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: '24px' }}>{length.emoji}</div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{length.label}</div>
                  <div style={{ fontSize: '10px', color: '#666' }}>{length.desc}</div>
                </button>
              ))}
            </div>

            <button
              onClick={startGame}
              disabled={!selectedUnit || !selectedLength}
              style={{
                width: '100%',
                padding: '16px',
                background: selectedUnit && selectedLength ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: selectedUnit && selectedLength ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s'
              }}
            >
              🚀 Start Your Life!
            </button>
          </>
        )}

        {/* Playing */}
        {gameState === 'playing' && currentScenario && questions[currentQuestion] && (
          <>
            {/* Progress */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px', color: '#666' }}>
              <span>{currentScenario.emoji} {currentScenario.stage}</span>
              <span>Question {currentQuestion + 1}/{questions.length}</span>
            </div>

            {/* Stats */}
            <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '12px', marginBottom: '16px' }}>
              <StatBar label="Money" value={stats.money} emoji="💰" color="#22c55e" />
              <StatBar label="Education" value={stats.education} emoji="📚" color="#3b82f6" />
              <StatBar label="Happiness" value={stats.happiness} emoji="😊" color="#f59e0b" />
              <StatBar label="Career" value={stats.career} emoji="🏆" color="#8b5cf6" />
            </div>

            {/* Scenario */}
            <div style={{ 
              background: 'linear-gradient(135deg, #f0f4ff, #faf5ff)', 
              padding: '16px', 
              borderRadius: '12px', 
              marginBottom: '16px',
              border: '1px solid #e5e7eb'
            }}>
              <p style={{ fontStyle: 'italic', marginBottom: '8px', color: '#666' }}>
                {currentScenario.scenario.setup}
              </p>
              <p style={{ fontWeight: 'bold', color: '#1f2937' }}>
                {questions[currentQuestion].q}
              </p>
            </div>

            {/* Answers */}
            <div style={{ display: 'grid', gap: '8px' }}>
              {shuffledAnswers.map((answer, idx) => {
                let bg = 'white';
                let border = '2px solid #e5e7eb';
                if (showFeedback) {
                  if (answer === questions[currentQuestion].a) {
                    bg = '#dcfce7';
                    border = '2px solid #22c55e';
                  } else if (showFeedback === 'wrong' && answer !== questions[currentQuestion].a) {
                    bg = '#fee2e2';
                    border = '2px solid #ef4444';
                  }
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(answer)}
                    disabled={showFeedback !== null}
                    style={{
                      padding: '12px 16px',
                      border,
                      borderRadius: '12px',
                      background: bg,
                      cursor: showFeedback ? 'default' : 'pointer',
                      textAlign: 'left',
                      fontSize: '14px',
                      transition: 'all 0.2s'
                    }}
                  >
                    {answer}
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {showFeedback && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                borderRadius: '12px',
                background: showFeedback === 'correct' ? '#dcfce7' : '#fee2e2',
                textAlign: 'center'
              }}>
                <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                  {showFeedback === 'correct' ? '✅ Correct!' : '❌ Wrong!'}
                </p>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  {showFeedback === 'correct' 
                    ? currentScenario.scenario.success 
                    : currentScenario.scenario.fail}
                </p>
              </div>
            )}
          </>
        )}

        {/* Results */}
        {gameState === 'result' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h1 style={{ fontSize: '48px', marginBottom: '8px' }}>🎓</h1>
              <h2>{getLifeOutcome().title}</h2>
              <p style={{ color: '#666', marginBottom: '16px' }}>{getLifeOutcome().desc}</p>
              <div style={{ 
                display: 'inline-block',
                padding: '8px 24px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '24px'
              }}>
                Grade: {getLifeOutcome().grade}
              </div>
            </div>

            <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
              <h3 style={{ marginBottom: '12px' }}>📊 Final Life Stats</h3>
              <StatBar label="Money" value={stats.money} emoji="💰" color="#22c55e" />
              <StatBar label="Education" value={stats.education} emoji="📚" color="#3b82f6" />
              <StatBar label="Happiness" value={stats.happiness} emoji="😊" color="#f59e0b" />
              <StatBar label="Career" value={stats.career} emoji="🏆" color="#8b5cf6" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              <div style={{ textAlign: 'center', padding: '16px', background: '#dcfce7', borderRadius: '12px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>{correctAnswers}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Correct</div>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', background: '#fee2e2', borderRadius: '12px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>{wrongAnswers}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Wrong</div>
              </div>
            </div>

            <button
              onClick={resetGame}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              🔄 Play Again
            </button>
          </>
        )}

        {/* Game Over */}
        {gameState === 'gameOver' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h1 style={{ fontSize: '48px', marginBottom: '8px' }}>💀</h1>
              <h2>Game Over!</h2>
              <p style={{ color: '#666' }}>
                {stats.career <= 0 ? "Your career crashed... Time to study harder!" : "You ran out of money... Biology doesn't pay the bills if you don't know it!"}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              <div style={{ textAlign: 'center', padding: '16px', background: '#dcfce7', borderRadius: '12px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>{correctAnswers}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Correct</div>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', background: '#fee2e2', borderRadius: '12px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>{wrongAnswers}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Wrong</div>
              </div>
            </div>

            <button
              onClick={resetGame}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              🔄 Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
