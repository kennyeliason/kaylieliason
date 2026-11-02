import { useMemo, useState } from 'react';

type Screen = 'home' | 'lobby' | 'play' | 'results';

const prompts = [
  ['Would you rather', 'have a personal theme song whenever you enter a room', 'or glow neon whenever you are nervous?'],
  ['Pick your chaos', 'always send texts with one tiny typo', 'or have every sneeze sound like an air horn?'],
  ['Be honest', 'win every claw machine on the first try', 'or never wait in a line again?'],
  ['Important science', 'be able to talk to dogs', 'or understand every language except your own?'],
  ['Choose wisely', 'live in a tree house with perfect Wi-Fi', 'or a castle with a secret slide?'],
];

function roomCode() {
  return Math.random().toString(36).slice(2, 6).toUpperCase();
}

export default function PartyHub() {
  const [screen, setScreen] = useState<Screen>('home');
  const [code, setCode] = useState(roomCode);
  const [name, setName] = useState('');
  const [players, setPlayers] = useState<string[]>([]);
  const [turn, setTurn] = useState(0);
  const [round, setRound] = useState(0);
  const [votes, setVotes] = useState<Array<'left' | 'right'>>([]);
  const [joinCode, setJoinCode] = useState('');
  const prompt = prompts[round % prompts.length];
  const leftVotes = votes.filter((vote) => vote === 'left').length;
  const rightVotes = votes.length - leftVotes;
  const voteTotal = Math.max(votes.length, 1);
  const leftPercent = Math.round((leftVotes / voteTotal) * 100);

  const subline = useMemo(() => {
    if (!players.length) return 'Add the people in the room, then start the nonsense.';
    if (players.length === 1) return 'One more person makes it a party.';
    return `${players.length} players are ready for questionable decisions.`;
  }, [players]);

  function startRoom() {
    setCode(roomCode());
    setPlayers(name.trim() ? [name.trim()] : []);
    setScreen('lobby');
  }

  function addPlayer() {
    const cleanName = name.trim();
    if (!cleanName || players.some((player) => player.toLowerCase() === cleanName.toLowerCase())) return;
    setPlayers((current) => [...current, cleanName]);
    setName('');
  }

  function beginGame() {
    if (players.length < 2) return;
    setTurn(0);
    setVotes([]);
    setScreen('play');
  }

  function choose(side: 'left' | 'right') {
    const newVotes = [...votes, side];
    setVotes(newVotes);
    if (turn + 1 === players.length) {
      setScreen('results');
    } else {
      setTurn((current) => current + 1);
    }
  }

  function nextRound() {
    setRound((current) => current + 1);
    setTurn(0);
    setVotes([]);
    setScreen('play');
  }

  return (
    <main className="party-shell">
      <div className="party-glow glow-one" />
      <div className="party-glow glow-two" />
      <nav className="party-nav"><a href="/">KAYLI</a><span>GAME NIGHT</span></nav>

      {screen === 'home' && <section className="party-home">
        <p className="party-eyebrow">A tiny party in your browser</p>
        <h1>Side<span>Quest</span></h1>
        <p className="party-lede">Original mini-games for loud opinions, weird choices, and whoever is sitting next to you.</p>
        <div className="party-card home-card">
          <label>Your name <input value={name} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && startRoom()} placeholder="Type your name" maxLength={18} /></label>
          <button className="party-primary" onClick={startRoom}>Start a game <b>→</b></button>
          <div className="party-divider"><span>or</span></div>
          <div className="party-join"><input value={joinCode} onChange={(event) => setJoinCode(event.target.value.toUpperCase().slice(0, 4))} placeholder="ROOM CODE" maxLength={4} /><button onClick={() => joinCode.length === 4 && setScreen('lobby')}>Join</button></div>
        </div>
        <p className="party-note">First game: <strong>Pick a Side</strong> · Pass-the-phone friendly</p>
      </section>}

      {screen === 'lobby' && <section className="party-panel">
        <p className="party-eyebrow">Your room is open</p>
        <h2>Get the crew in here.</h2>
        <div className="room-code"><small>ROOM CODE</small><strong>{joinCode || code}</strong></div>
        <div className="room-qr">
          <img src="/sidequest-qr.png" alt="QR code to open SideQuest" />
          <p><strong>Scan to open SideQuest</strong><br />Then type the room code above.</p>
        </div>
        <p className="lobby-copy">{subline}</p>
        <div className="player-entry"><input value={name} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addPlayer()} placeholder="Add a player" maxLength={18} /><button onClick={addPlayer}>Add</button></div>
        <div className="player-list">{players.length ? players.map((player, index) => <span key={player}><i>{['✦', '●', '▲', '♥', '◆', '☀'][index % 6]}</i>{player}</span>) : <em>Waiting for players…</em>}</div>
        <button className="party-primary" disabled={players.length < 2} onClick={beginGame}>{players.length < 2 ? 'Need 2 players' : 'Play Pick a Side →'}</button>
        <button className="party-text" onClick={() => setScreen('home')}>Leave room</button>
      </section>}

      {screen === 'play' && <section className="party-panel game-panel">
        <div className="round-top"><span>ROUND {round + 1}</span><span>{turn + 1} / {players.length}</span></div>
        <p className="party-eyebrow">Hand the phone to <strong>{players[turn]}</strong></p>
        <h2>{prompt[0]}</h2>
        <p className="game-instruction">Pick one. No explaining yourself until the reveal.</p>
        <div className="choice-grid">
          <button className="choice choice-left" onClick={() => choose('left')}><small>OPTION A</small>{prompt[1]}<b>←</b></button>
          <button className="choice choice-right" onClick={() => choose('right')}><small>OPTION B</small>{prompt[2]}<b>→</b></button>
        </div>
      </section>}

      {screen === 'results' && <section className="party-panel result-panel">
        <p className="party-eyebrow">The room has spoken</p>
        <h2>{leftVotes === rightVotes ? 'It’s a split decision.' : leftVotes > rightVotes ? 'Option A wins.' : 'Option B wins.'}</h2>
        <div className="result-choices"><div><small>OPTION A</small><b>{leftPercent}%</b><p>{prompt[1]}</p></div><div><small>OPTION B</small><b>{100 - leftPercent}%</b><p>{prompt[2]}</p></div></div>
        <div className="vote-bar"><span style={{ width: `${leftPercent}%` }} /></div>
        <p className="result-caption">{leftVotes} picked A · {rightVotes} picked B</p>
        <button className="party-primary" onClick={nextRound}>Next question <b>→</b></button>
        <button className="party-text" onClick={() => setScreen('lobby')}>Back to room</button>
      </section>}
    </main>
  );
}
