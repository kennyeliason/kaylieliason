import { useState } from 'react';

const games = [
  ['Flashcards', 'Flip to reveal'],
  ['Quiz', 'Multiple choice'],
  ['Typing Quiz', 'Type the answer'],
  ['Learn', 'Spaced repetition'],
  ['Match', 'Pair Q&A'],
  ['Speed Round', '60 seconds'],
  ['Millionaire', 'Rising stakes'],
  ['Jeopardy', 'Pick points'],
  ['Wheel', 'Spell it out'],
  ['Bomb', 'Defuse or boom!'],
  ['Crossword', 'Fill the grid'],
  ['Practice Test', 'Canvas format'],
  ['Challenge', '3 strikes, timed'],
  ['Snake', 'Eat & grow'],
  ['My Stats', 'See progress'],
];

export default function ChemistryHub() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  return (
    <main style={styles.page}>
      <style>{`
        * { box-sizing: border-box; }
        .chem-game-card:hover { transform: translateY(-5px); box-shadow: 0 18px 34px rgba(13, 148, 136, .25) !important; }
        .chem-game-card:focus-visible { outline: 4px solid #99f6e4; outline-offset: 3px; }
      `}</style>

      <section style={styles.shell}>
        <header style={styles.header}>
          <div style={styles.badge}>CHEMISTRY</div>
          <h1 style={styles.title}>Study Hub</h1>
          <p style={styles.subtitle}>Your games are ready. Send your study guide whenever you’re ready to fill them in.</p>
        </header>

        <div style={styles.unitRow}>
          <button style={styles.unitButton}>Unit 1</button>
          <button style={styles.unitButton}>Unit 2</button>
          <button style={styles.unitButton}>Unit 3</button>
        </div>

        <section style={styles.grid} aria-label="Chemistry games">
          {games.map(([name, detail], index) => (
            <button
              className="chem-game-card"
              key={name}
              onClick={() => setSelectedGame(name)}
              style={{ ...styles.card, ...(index >= 6 ? styles.darkCard : {}) }}
            >
              <span style={{ ...styles.cardTitle, ...(index >= 6 ? styles.lightText : {}) }}>{name}</span>
              <span style={{ ...styles.cardDetail, ...(index >= 6 ? styles.darkCardDetail : {}) }}>{detail}</span>
            </button>
          ))}
        </section>
      </section>

      {selectedGame && (
        <div style={styles.overlay} onClick={() => setSelectedGame(null)}>
          <section style={styles.modal} onClick={(event) => event.stopPropagation()}>
            <div style={styles.modalLabel}>{selectedGame.toUpperCase()}</div>
            <h2 style={styles.modalTitle}>Ready for your study guide</h2>
            <p style={styles.modalText}>This game is set up, but there aren’t any Chemistry questions in it yet.</p>
            <button style={styles.closeButton} onClick={() => setSelectedGame(null)}>Back to games</button>
          </section>
        </div>
      )}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh', padding: '48px 20px 64px', color: '#123b3a',
    fontFamily: 'Avenir Next, Avenir, Inter, ui-sans-serif, system-ui, sans-serif',
    background: 'radial-gradient(circle at top left, #ccfbf1 0%, transparent 34%), linear-gradient(135deg, #ecfdf5 0%, #ecfeff 48%, #d1fae5 100%)',
  },
  shell: { width: 'min(1080px, 100%)', margin: '0 auto' },
  header: { textAlign: 'center', margin: '8px auto 28px', maxWidth: '660px' },
  badge: { display: 'inline-block', color: '#0f766e', background: '#ccfbf1', border: '1px solid #5eead4', padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 900, letterSpacing: 1.4 },
  title: { margin: '14px 0 8px', fontSize: 'clamp(38px, 7vw, 64px)', lineHeight: 1, letterSpacing: '-2px', color: '#115e59' },
  subtitle: { margin: 0, color: '#40706c', fontSize: 16, lineHeight: 1.5 },
  unitRow: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, margin: '0 auto 28px' },
  unitButton: { padding: '10px 20px', borderRadius: 999, border: '2px solid #99f6e4', background: 'rgba(255,255,255,.78)', color: '#0f766e', fontWeight: 800, fontSize: 14, cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14 },
  card: { minHeight: 130, padding: 20, border: 0, borderRadius: 22, textAlign: 'left', cursor: 'pointer', transition: 'transform .2s ease, box-shadow .2s ease', background: 'linear-gradient(140deg, #ffffff 0%, #f0fdfa 100%)', boxShadow: '0 7px 18px rgba(13, 148, 136, .13)', display: 'flex', flexDirection: 'column', justifyContent: 'end' },
  darkCard: { background: 'linear-gradient(140deg, #115e59 0%, #0f766e 56%, #0891b2 100%)', boxShadow: '0 7px 18px rgba(15, 118, 110, .25)' },
  cardTitle: { color: '#0f766e', fontSize: 22, fontWeight: 900, letterSpacing: '-.5px' },
  lightText: { color: '#ffffff' },
  cardDetail: { marginTop: 5, color: '#5f7f7c', fontSize: 14, fontWeight: 600 },
  darkCardDetail: { color: '#bff7ef' },
  overlay: { position: 'fixed', inset: 0, zIndex: 10, display: 'grid', placeItems: 'center', padding: 20, background: 'rgba(4, 47, 46, .45)' },
  modal: { width: 'min(440px, 100%)', background: '#ffffff', padding: 30, borderRadius: 26, textAlign: 'center', boxShadow: '0 24px 70px rgba(4, 47, 46, .35)' },
  modalLabel: { color: '#0f766e', fontSize: 12, letterSpacing: 1.3, fontWeight: 900 },
  modalTitle: { margin: '9px 0', color: '#115e59', fontSize: 28 },
  modalText: { color: '#557673', lineHeight: 1.55, margin: '0 0 22px' },
  closeButton: { border: 0, borderRadius: 14, background: 'linear-gradient(135deg, #0f766e, #0891b2)', color: '#fff', padding: '12px 18px', fontSize: 15, fontWeight: 800, cursor: 'pointer' },
};
