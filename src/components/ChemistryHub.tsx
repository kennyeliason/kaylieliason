import { useState } from 'react';

type Question = { question: string; choices: string[]; answer: string; explanation: string };

const unit5Questions: Question[] = [
  {question:'What do all electromagnetic waves have in common?',choices:['They travel at the speed of light in a vacuum','They have the same wavelength','They have the same frequency','They need matter to travel'],answer:'They travel at the speed of light in a vacuum',explanation:'All electromagnetic waves travel at the speed of light in a vacuum.'},
  {question:'What equation connects the speed of light, frequency, and wavelength?',choices:['c = λν','E = mc²','PV = nRT','m = dV'],answer:'c = λν',explanation:'c is the speed of light, λ is wavelength, and ν is frequency.'},
  {question:'A frequency of 6.9 × 10¹⁷ s⁻¹ has a wavelength closest to…',choices:['4.35 × 10⁻¹⁰ m','4.35 × 10¹⁰ m','2.07 × 10⁻²⁶ m','6.9 × 10¹⁷ m'],answer:'4.35 × 10⁻¹⁰ m',explanation:'λ = c ÷ ν = 3.00 × 10⁸ ÷ 6.9 × 10¹⁷.'},
  {question:'Which kind of radiation has a very short wavelength and high frequency?',choices:['X-rays','Radio waves','Microwaves','Infrared waves'],answer:'X-rays',explanation:'X-rays have much shorter wavelengths and higher frequencies than radio, microwave, or infrared waves.'},
  {question:'What is a photon?',choices:['A quantum of electromagnetic energy','A negatively charged atom','An orbital in the p sublevel','A measurement of wavelength'],answer:'A quantum of electromagnetic energy',explanation:'A photon is one packet, or quantum, of electromagnetic energy.'},
  {question:'Which formula finds the energy of one photon?',choices:['E = hν','c = λν','2n²','E = mc²'],answer:'E = hν',explanation:'Photon energy equals Planck’s constant times frequency.'},
  {question:'If frequency increases, what happens to wavelength?',choices:['It decreases','It increases','It stays the same','It becomes zero'],answer:'It decreases',explanation:'Frequency and wavelength are inversely related.'},
  {question:'Which type of radiation has the longest wavelength?',choices:['Radio waves','Visible light','X-rays','Gamma rays'],answer:'Radio waves',explanation:'Radio waves are at the long-wavelength end of the electromagnetic spectrum.'},
  {question:'Which type of radiation has the greatest energy?',choices:['Gamma rays','Radio waves','Microwaves','Infrared waves'],answer:'Gamma rays',explanation:'Gamma rays have the greatest frequency and energy.'},
  {question:'What is an orbital?',choices:['A region where an electron is likely to be found','The path an electron travels in a circle','A positively charged particle','A type of ion'],answer:'A region where an electron is likely to be found',explanation:'Orbitals show probable locations, not a fixed circular path.'},
  {question:'How many electrons can one s orbital hold?',choices:['2','1','6','10'],answer:'2',explanation:'One orbital holds at most two electrons.'},
  {question:'How many orbitals are in a p sublevel?',choices:['3','1','5','7'],answer:'3',explanation:'The p sublevel has three orbitals.'},
  {question:'How many electrons can a full p sublevel hold?',choices:['6','2','3','10'],answer:'6',explanation:'Three p orbitals × two electrons each = six electrons.'},
  {question:'What does the formula 2n² tell you?',choices:['The maximum electrons in an energy level','The number of neutrons in an atom','The wavelength of light','The atomic radius'],answer:'The maximum electrons in an energy level',explanation:'Use 2n² to find the maximum electrons in a principal energy level.'},
  {question:'How many electrons can the second energy level hold?',choices:['8','2','18','32'],answer:'8',explanation:'2(2²) = 8 electrons.'},
  {question:'What is the first ionization energy?',choices:['Energy required to remove an electron from an atom','Energy released when an electron is added','Energy needed to fill a p orbital','Energy of a neutron'],answer:'Energy required to remove an electron from an atom',explanation:'Ionization energy measures how hard it is to remove an electron.'},
  {question:'What is electron affinity?',choices:['The energy change when an atom gains an electron','Energy needed to remove an electron','The size of an atom','The number of valence electrons'],answer:'The energy change when an atom gains an electron',explanation:'Electron affinity is connected to adding an electron.'},
  {question:'How does atomic radius change across a period from left to right?',choices:['It decreases','It increases','It stays identical','It becomes negative'],answer:'It decreases',explanation:'More protons pull the electrons closer as you move across a period.'},
  {question:'How does atomic radius change down a group?',choices:['It increases','It decreases','It stays identical','It becomes zero'],answer:'It increases',explanation:'More energy levels are added down a group.'},
  {question:'A positive ion is called a…',choices:['Cation','Anion','Photon','Isotope'],answer:'Cation',explanation:'A cation has a positive charge because it lost electrons.'},
  {question:'A negative ion is called an…',choices:['Anion','Cation','Orbital','Nucleus'],answer:'Anion',explanation:'An anion has a negative charge because it gained electrons.'},
  {question:'Which electrons are usually gained or lost when a compound forms?',choices:['Valence electrons','Core electrons','Neutrons','Protons'],answer:'Valence electrons',explanation:'Valence electrons are the outer electrons involved in bonding.'},
  {question:'What is an atom in its ground state?',choices:['Its lowest-energy, most stable state','An atom with no electrons','An atom that absorbed energy','A positive ion'],answer:'Its lowest-energy, most stable state',explanation:'Ground state is the lowest possible energy arrangement.'},
  {question:'When an electron moves from ground state to excited state, energy is…',choices:['Absorbed','Released','Destroyed','Turned into neutrons'],answer:'Absorbed',explanation:'An electron must absorb energy to move higher.'},
  {question:'When an electron falls from an excited state to ground state, energy is…',choices:['Released','Absorbed','Destroyed','Changed into protons'],answer:'Released',explanation:'Moving down to a lower level releases energy as light.'},
  {question:'How is a line spectrum produced?',choices:['Electrons release light while moving from excited to lower levels','Protons move between orbitals','Atoms gain neutrons','Wavelength becomes constant'],answer:'Electrons release light while moving from excited to lower levels',explanation:'Each energy jump releases a specific amount of light energy.'},
  {question:'Which electron configuration is nitrogen?',choices:['1s² 2s² 2p³','1s² 2s² 2p⁶','1s² 2s¹','1s² 2s² 2p⁵'],answer:'1s² 2s² 2p³',explanation:'Nitrogen has 7 electrons: 2 + 2 + 3.'},
  {question:'How many valence electrons does nitrogen have?',choices:['5','3','7','2'],answer:'5',explanation:'Nitrogen’s outer level has 2s² 2p³: five valence electrons.'},
  {question:'What ion does nitrogen most commonly form?',choices:['N³⁻','N³⁺','N⁻','N²⁺'],answer:'N³⁻',explanation:'Nitrogen gains three electrons to reach a full outer level.'},
  {question:'How many electrons does nitrogen gain to become stable?',choices:['3','1','2','5'],answer:'3',explanation:'Nitrogen has five valence electrons and needs three more for an octet.'},
  {question:'What is the electron configuration for N³⁻?',choices:['1s² 2s² 2p⁶','1s² 2s² 2p³','1s² 2s² 2p⁵','1s² 2s¹'],answer:'1s² 2s² 2p⁶',explanation:'N³⁻ has 10 electrons, the same configuration as neon.'},
  {question:'Which is nitrogen’s noble-gas configuration?',choices:['[He] 2s² 2p³','[Ne] 3s²','[He] 2s² 2p⁶','[Ar] 4s²'],answer:'[He] 2s² 2p³',explanation:'Start from helium, then add nitrogen’s remaining five electrons.'},
  {question:'What does a Lewis dot diagram show?',choices:['Valence electrons','All neutrons','Electron wavelengths','Atomic radius'],answer:'Valence electrons',explanation:'Lewis dots show the outer electrons used in bonding.'},
  {question:'Which statement correctly compares wavelength and frequency?',choices:['Wavelength measures distance; frequency measures cycles per second','Both measure time','Both measure distance','Frequency measures mass'],answer:'Wavelength measures distance; frequency measures cycles per second',explanation:'Wavelength is a length; frequency counts waves each second.'},
];

const games = [['Flashcards','Flip to reveal'],['Quiz','Multiple choice'],['Learn','Spaced repetition'],['Match','Pair Q&A'],['Speed Round','60 seconds'],['Millionaire','Rising stakes'],['Jeopardy','Pick points'],['Bomb','Defuse or boom!'],['Snake','Eat & grow'],['My Stats','See progress']];

const jeopardyBoard = [
  { title: 'EM WAVES', indexes: [0, 1, 2, 3, 4] },
  { title: 'LIGHT ENERGY', indexes: [5, 6, 7, 8, 24] },
  { title: 'ORBITALS', indexes: [9, 10, 11, 12, 13] },
  { title: 'ATOMIC TRENDS', indexes: [14, 15, 16, 17, 18] },
  { title: 'IONS & NITROGEN', indexes: [19, 20, 21, 22, 26] },
];

const millionaireLevels = ['$100','$200','$300','$500','$1,000','$2,000','$4,000','$8,000','$16,000','$32,000','$64,000','$125,000','$250,000','$500,000','$1,000,000'];

function MillionaireGame({question, questionIndex, choice, checked, onChoose, onCheck, onNext}:{question:Question;questionIndex:number;choice:string|null;checked:boolean;onChoose:(answer:string)=>void;onCheck:()=>void;onNext:()=>void}) {
  return <div style={styles.millionaireLayout}>
    <aside style={styles.moneyLadder}>{[...millionaireLevels].reverse().map((amount, reverseIndex) => {
      const level = millionaireLevels.length - reverseIndex - 1;
      const isMilestone = level === 4 || level === 9;
      return <div key={amount} style={{...styles.moneyStep,...(level === questionIndex ? styles.moneyStepActive : {}),...(isMilestone && level !== questionIndex ? styles.moneyMilestone : {})}}><span>{level + 1}</span><strong>{amount}</strong></div>;
    })}</aside>
    <div style={styles.millionaireQuestion}>
      <div style={styles.gameName}>MILLIONAIRE</div>
      <div style={styles.progress}>Question {questionIndex + 1} of 15</div>
      <h2 style={styles.question}>{question.question}</h2>
      <div style={styles.choices}>{question.choices.map(answer => <button key={answer} onClick={() => !checked && onChoose(answer)} style={{...styles.choice,...(choice === answer ? (checked ? (answer === question.answer ? styles.correct : styles.incorrect) : styles.selected) : {})}}>{answer}</button>)}
      {checked && choice && <p style={styles.explanation}>{choice === question.answer ? 'Correct! ' : 'Not quite. '}{question.explanation}</p>}
      {!checked ? <button disabled={!choice} style={{...styles.closeButton,opacity:choice?1:.45,cursor:choice?'pointer':'default'}} onClick={onCheck}>Check Answer</button> : <button style={styles.closeButton} onClick={onNext}>{questionIndex === millionaireLevels.length - 1 ? 'Play again' : 'Next question'}</button>}</div>
    </div>
  </div>;
}

export default function ChemistryHub() {
  const [selectedUnit,setSelectedUnit] = useState('Unit 1');
  const [selectedGame,setSelectedGame] = useState<string|null>(null);
  const [questionIndex,setQuestionIndex] = useState(0);
  const [showAnswer,setShowAnswer] = useState(false);
  const [choice,setChoice] = useState<string|null>(null);
  const [checked,setChecked] = useState(false);
  const [correctCount,setCorrectCount] = useState(0);
  const [attemptCount,setAttemptCount] = useState(0);
  const [jeopardyQuestion,setJeopardyQuestion] = useState<number|null>(null);
  const [jeopardyUsed,setJeopardyUsed] = useState<number[]>([]);
  const questions = selectedUnit === 'Unit 5' ? unit5Questions : [];
  const currentQuestion = questions[questionIndex % Math.max(questions.length,1)];
  const playable = selectedGame !== 'My Stats';
  const openGame = (game:string) => {setSelectedGame(game);setQuestionIndex(0);setShowAnswer(false);setChoice(null);setChecked(false);setJeopardyQuestion(null);setJeopardyUsed([]);};
  const next = () => {setQuestionIndex((i)=>(i+1)%questions.length);setShowAnswer(false);setChoice(null);setChecked(false);};
  const checkAnswer = () => {
    if (!choice || checked) return;
    setChecked(true);
    setAttemptCount((count) => count + 1);
    if (choice === currentQuestion.answer) setCorrectCount((count) => count + 1);
  };

  return <main style={styles.page}>
    <style>{`*{box-sizing:border-box}.chem-game-card:hover{transform:translateY(-5px);box-shadow:0 18px 34px rgba(13,148,136,.25)!important}.chem-game-card:focus-visible{outline:4px solid #99f6e4;outline-offset:3px}`}</style>
    {!selectedGame ? <section style={styles.shell}>
      <header style={styles.header}><h1 style={styles.title}>Chemistry Study Guide</h1></header>
      <div style={styles.unitRow}>{['Unit 1','Unit 2','Unit 3','Unit 4','Unit 5'].map(unit=><button key={unit} onClick={()=>setSelectedUnit(unit)} style={{...styles.unitButton,...(selectedUnit===unit?styles.activeUnit:{})}}>{unit}</button>)}</div>
      <div style={styles.unitStatus}>{selectedUnit} · {selectedUnit==='Unit 5'?`${unit5Questions.length} questions ready`:'Study guide coming soon'}</div>
      <section style={styles.grid}>{games.map(([name,detail],index)=><button className="chem-game-card" key={name} onClick={()=>openGame(name)} style={{...styles.card,...(index>=5?styles.darkCard:{})}}><span style={{...styles.cardTitle,...(index>=5?styles.lightText:{})}}>{name}</span><span style={{...styles.cardDetail,...(index>=5?styles.darkCardDetail:{})}}>{detail}</span></button>)}</section>
    </section> : <section style={styles.gameScreen}>
      <button style={styles.backArrow} onClick={()=>setSelectedGame(null)}>← Back to Home</button>
      <section style={styles.modal}>
      <div style={styles.modalLabel}>{selectedUnit.toUpperCase()} · {selectedGame.toUpperCase()}</div>
      {selectedGame==='Jeopardy' && selectedUnit==='Unit 5' ? <>{jeopardyQuestion === null ? <><h2 style={styles.gameName}>JEOPARDY</h2><p style={styles.modalText}>Pick a point value.</p><div style={styles.jeopardyBoard}>{jeopardyBoard.map((category) => <div key={category.title} style={styles.jeopardyColumn}><div style={styles.jeopardyHeader}>{category.title}</div>{category.indexes.map((index, row) => { const value = (row + 1) * 100; const used = jeopardyUsed.includes(index); return <button key={index} disabled={used} onClick={() => { setJeopardyQuestion(index); setChoice(null); setChecked(false); }} style={{...styles.jeopardyTile, ...(used ? styles.jeopardyUsed : {})}}>{used ? '' : `$${value}`}</button>; })}</div>)}</div></> : (() => { const question = unit5Questions[jeopardyQuestion]; return <><button style={styles.boardArrow} onClick={() => { setJeopardyQuestion(null); setChoice(null); setChecked(false); }}>← Back to Board</button><div style={styles.gameName}>JEOPARDY</div><div style={styles.progress}>${(jeopardyBoard.flatMap(c => c.indexes).indexOf(jeopardyQuestion) % 5 + 1) * 100} QUESTION</div><h2 style={styles.question}>{question.question}</h2><div style={styles.choices}>{question.choices.map(answer => <button key={answer} onClick={() => !checked && setChoice(answer)} style={{...styles.choice,...(choice === answer ? (checked ? (answer === question.answer ? styles.correct : styles.incorrect) : styles.selected) : {})}}>{answer}</button>)}{checked && choice && <p style={styles.explanation}>{choice === question.answer ? 'Correct! ' : 'Not quite. '}{question.explanation}</p>}{!checked ? <button disabled={!choice} style={{...styles.closeButton,opacity:choice?1:.45,cursor:choice?'pointer':'default'}} onClick={() => { if (!choice) return; setChecked(true); setAttemptCount(count => count + 1); if (choice === question.answer) setCorrectCount(count => count + 1); }}>Check Answer</button> : <button style={styles.closeButton} onClick={() => { setJeopardyUsed(used => [...used, jeopardyQuestion]); setJeopardyQuestion(null); }}>Back to Board</button>}</div></>; })()}</> : selectedGame==='Millionaire' && questions.length ? <MillionaireGame question={currentQuestion!} questionIndex={questionIndex} choice={choice} checked={checked} onChoose={setChoice} onCheck={checkAnswer} onNext={() => questionIndex === millionaireLevels.length - 1 ? (setQuestionIndex(0),setChoice(null),setChecked(false)) : next()} /> : selectedGame==='My Stats'?<><h2 style={styles.modalTitle}>My Stats</h2><div style={styles.statsNumber}>{attemptCount === 0 ? '—' : Math.round((correctCount / attemptCount) * 100) + '%'}</div><p style={styles.modalText}>{attemptCount === 0 ? 'Start a game to see your score.' : `${correctCount} correct out of ${attemptCount} questions`}</p></>:questions.length===0?<><h2 style={styles.modalTitle}>Ready for your study guide</h2><p style={styles.modalText}>There aren’t any questions in this unit yet.</p></>:playable&&currentQuestion?<><div style={styles.gameName}>{selectedGame}</div><div style={styles.progress}>Question {questionIndex+1} of {questions.length}</div><h2 style={styles.question}>{currentQuestion.question}</h2>
        {selectedGame==='Flashcards'?<><button style={styles.flipButton} onClick={()=>setShowAnswer(!showAnswer)}>{showAnswer?currentQuestion.answer:'Tap to flip'}</button>{showAnswer&&<><p style={styles.explanation}>{currentQuestion.explanation}</p><button style={styles.closeButton} onClick={next}>Next question</button></>}</>:<div style={styles.choices}>{currentQuestion.choices.map(answer=><button key={answer} onClick={()=>!checked&&setChoice(answer)} style={{...styles.choice,...(choice===answer?(checked?(answer===currentQuestion.answer?styles.correct:styles.incorrect):styles.selected):{})}}>{answer}</button>)}{checked&&choice&&<p style={styles.explanation}>{choice===currentQuestion.answer?'Correct! ': 'Not quite. '}{currentQuestion.explanation}</p>}{!checked?<button disabled={!choice} style={{...styles.closeButton,opacity:choice?1:.45,cursor:choice?'pointer':'default'}} onClick={checkAnswer}>Check Answer</button>:<button style={styles.closeButton} onClick={next}>Next question</button>}</div>}
        </>:null}
    </section></section>}
  </main>;
}

const styles:Record<string,React.CSSProperties>={
  page:{minHeight:'100vh',padding:'48px 20px 64px',color:'#123b3a',fontFamily:'"Montserrat", sans-serif',background:'radial-gradient(circle at top left,#ccfbf1 0%,transparent 34%),linear-gradient(135deg,#ecfdf5 0%,#ecfeff 48%,#d1fae5 100%)'},
  shell:{width:'min(1080px,100%)',margin:'0 auto'},header:{textAlign:'center',margin:'8px auto 28px'},title:{margin:0,fontFamily:'Londrina Solid, Impact, sans-serif',fontWeight:900,fontSize:'clamp(42px,7vw,72px)',lineHeight:1,letterSpacing:'1px',color:'#115e59'},
  unitRow:{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:10,margin:'0 auto 10px'},unitButton:{padding:'10px 20px',borderRadius:999,border:'2px solid #99f6e4',background:'rgba(255,255,255,.78)',color:'#0f766e',fontWeight:800,fontSize:14,cursor:'pointer'},activeUnit:{background:'#0f766e',borderColor:'#0f766e',color:'#fff'},unitStatus:{textAlign:'center',color:'#40706c',fontSize:13,fontWeight:700,minHeight:30},
  grid:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:14},card:{minHeight:130,padding:20,border:0,borderRadius:22,textAlign:'left',cursor:'pointer',transition:'transform .2s ease,box-shadow .2s ease',background:'linear-gradient(140deg,#fff 0%,#f0fdfa 100%)',boxShadow:'0 7px 18px rgba(13,148,136,.13)',display:'flex',flexDirection:'column',justifyContent:'end'},darkCard:{background:'linear-gradient(140deg,#115e59 0%,#0f766e 56%,#0891b2 100%)',boxShadow:'0 7px 18px rgba(15,118,110,.25)'},cardTitle:{color:'#0f766e',fontSize:22,fontWeight:900,letterSpacing:'-.5px'},lightText:{color:'#fff'},cardDetail:{marginTop:5,color:'#5f7f7c',fontSize:14,fontWeight:600},darkCardDetail:{color:'#bff7ef'},
  gameScreen:{width:'min(1120px,100%)',margin:'0 auto',minHeight:'calc(100vh - 112px)'},backArrow:{border:0,background:'transparent',color:'#0f766e',fontSize:18,fontWeight:900,cursor:'pointer',padding:'4px 0 30px'},modal:{width:'min(1000px,100%)',margin:'0 auto',background:'#fff',padding:'42px 48px',borderRadius:30,textAlign:'center',boxShadow:'0 20px 50px rgba(4,47,46,.16)'},boardArrow:{display:'block',border:0,background:'transparent',color:'#0f766e',fontFamily:'Montserrat,sans-serif',fontSize:15,fontWeight:800,cursor:'pointer',padding:0,margin:'-14px 0 18px'},modalLabel:{color:'#0f766e',fontSize:14,letterSpacing:1.5,fontWeight:900},modalTitle:{margin:'12px 0',color:'#115e59',fontSize:32},modalText:{color:'#557673',lineHeight:1.6,margin:'0 0 24px',fontSize:17},gameName:{fontFamily:'Londrina Solid,Impact,sans-serif',color:'#115e59',fontSize:28,letterSpacing:1},progress:{color:'#0f766e',fontWeight:800,fontSize:15,marginTop:14},question:{color:'#163f3b',fontSize:30,lineHeight:1.28,margin:'20px 0 26px'},choices:{display:'grid',gap:12,textAlign:'left'},choice:{cursor:'pointer',background:'#f0fdfa',border:'2px solid #ccfbf1',borderRadius:14,padding:'15px 17px',color:'#17433f',fontSize:18,textAlign:'left',fontWeight:650},selected:{background:'#ccfbf1',borderColor:'#0f766e'},correct:{background:'#dcfce7',borderColor:'#22c55e'},incorrect:{background:'#fee2e2',borderColor:'#f87171'},flipButton:{width:'100%',border:'2px solid #99f6e4',background:'#f0fdfa',borderRadius:16,padding:'26px 18px',color:'#115e59',fontSize:22,fontWeight:800,cursor:'pointer'},explanation:{color:'#35645f',lineHeight:1.55,fontSize:16,margin:'16px 0'},closeButton:{border:0,borderRadius:14,background:'linear-gradient(135deg,#0f766e,#0891b2)',color:'#fff',padding:'14px 22px',fontSize:17,fontWeight:800,cursor:'pointer',marginTop:20},statsNumber:{fontFamily:'Londrina Solid,Impact,sans-serif',fontSize:76,color:'#0f766e',lineHeight:1},jeopardyBoard:{display:'grid',gridTemplateColumns:'repeat(5,minmax(120px,1fr))',gap:8,overflowX:'auto',paddingBottom:5},jeopardyColumn:{display:'grid',gap:8,minWidth:120},jeopardyHeader:{background:'#115e59',color:'#fff',borderRadius:10,padding:'14px 6px',fontWeight:900,fontSize:13},jeopardyTile:{border:0,borderRadius:10,minHeight:66,cursor:'pointer',fontFamily:'Londrina Solid,Impact,sans-serif',fontSize:31,color:'#fef08a',background:'#0f766e'},jeopardyUsed:{background:'#e6fffb',color:'#d1faf4',cursor:'default'},
  millionaireLayout:{display:'grid',gridTemplateColumns:'230px minmax(0,1fr)',gap:36,alignItems:'center',textAlign:'left'},moneyLadder:{background:'linear-gradient(160deg,#064e3b,#115e59 55%,#0f766e)',borderRadius:22,padding:'15px 14px',display:'grid',gap:3,boxShadow:'inset 0 1px rgba(255,255,255,.18)'},moneyStep:{display:'flex',justifyContent:'space-between',alignItems:'center',borderRadius:9,padding:'5px 12px',color:'#d1fae5',fontSize:15,fontWeight:800},moneyMilestone:{color:'#fef08a'},moneyStepActive:{background:'#2dd4bf',color:'#073b35',boxShadow:'0 4px 12px rgba(0,0,0,.18)'},millionaireQuestion:{minWidth:0},
};
