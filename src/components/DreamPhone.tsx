import { useEffect, useMemo, useState } from 'react';

type CallCard = {
  id: number;
  number: string;
  clue: string;
  spoken: string;
  eliminate: string[];
};

const suspects = [
  { name: 'Jesse', emoji: '🛹', vibe: 'Skater with a sunshine smile', color: '#ffca55' },
  { name: 'Mason', emoji: '🎸', vibe: 'Guitar player', color: '#72ddc8' },
  { name: 'Theo', emoji: '📚', vibe: 'Quiet bookworm', color: '#b9a1ff' },
  { name: 'River', emoji: '🎨', vibe: 'Artsy and mysterious', color: '#ff91bd' },
  { name: 'Noah', emoji: '🏀', vibe: 'Basketball captain', color: '#77b6ff' },
  { name: 'Kai', emoji: '🌊', vibe: 'Surfer and snack expert', color: '#ff9f72' },
];

const calls: CallCard[] = [
  { id: 1, number: '555-0147', clue: '“My dream date would be at the skate park.”', spoken: 'Hey! My dream date would definitely be at the skate park.', eliminate: ['Mason', 'Theo', 'River', 'Noah', 'Kai'] },
  { id: 2, number: '555-0192', clue: '“I always carry a guitar pick in my pocket.”', spoken: 'Hi there. I always carry a guitar pick in my pocket.', eliminate: ['Jesse', 'Theo', 'River', 'Noah', 'Kai'] },
  { id: 3, number: '555-0168', clue: '“My favorite place is the school library.”', spoken: 'Hey. You can usually find me in the school library.', eliminate: ['Jesse', 'Mason', 'River', 'Noah', 'Kai'] },
  { id: 4, number: '555-0124', clue: '“I would rather paint a mural than go to a game.”', spoken: 'Hi. I would rather paint a mural than go to a game.', eliminate: ['Jesse', 'Mason', 'Theo', 'Noah', 'Kai'] },
  { id: 5, number: '555-0175', clue: '“I never miss basketball practice.”', spoken: 'Hey! I never miss basketball practice.', eliminate: ['Jesse', 'Mason', 'Theo', 'River', 'Kai'] },
  { id: 6, number: '555-0153', clue: '“The ocean is my favorite place to be.”', spoken: 'Hello! The ocean is my favorite place to be.', eliminate: ['Jesse', 'Mason', 'Theo', 'River', 'Noah'] },
  { id: 7, number: '555-0181', clue: '“I wear a lucky red cap when I skate.”', spoken: 'Psst... I wear a lucky red cap whenever I skate.', eliminate: ['Mason', 'Theo', 'River', 'Noah', 'Kai'] },
  { id: 8, number: '555-0139', clue: '“I have a board covered in stickers.”', spoken: 'Hi! I have a board covered in stickers.', eliminate: ['Mason', 'Theo', 'River', 'Noah', 'Kai'] },
  { id: 9, number: '555-0116', clue: '“You might see me at the skate park after school.”', spoken: 'Hey! You might see me at the skate park after school.', eliminate: ['Mason', 'Theo', 'River', 'Noah', 'Kai'] },
  { id: 10, number: '555-0102', clue: '“I like bright yellow sneakers.”', spoken: 'Hey! I like bright yellow sneakers more than any other color.', eliminate: ['Mason', 'Theo', 'River', 'Noah', 'Kai'] },
  { id: 11, number: '555-0188', clue: '“I can do a kickflip.”', spoken: 'Hi. I can do a kickflip. Can you?', eliminate: ['Mason', 'Theo', 'River', 'Noah', 'Kai'] },
  { id: 12, number: '555-0111', clue: '“My friends call me the sunshine skater.”', spoken: 'My friends call me the sunshine skater. Bye!', eliminate: ['Mason', 'Theo', 'River', 'Noah', 'Kai'] },
];

function makeCode() {
  return Math.random().toString(36).slice(2, 7).toUpperCase();
}

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const voice = new SpeechSynthesisUtterance(text);
  voice.rate = 0.95;
  voice.pitch = 1.28;
  window.speechSynthesis.speak(voice);
}

export default function DreamPhone() {
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [inGame, setInGame] = useState(false);
  const [drawn, setDrawn] = useState<number[]>([]);
  const [activeCall, setActiveCall] = useState<CallCard | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [answerOpen, setAnswerOpen] = useState(false);
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('room');
    if (param) setJoinCode(param.toUpperCase());
  }, []);

  const remaining = useMemo(() => calls.filter((call) => !drawn.includes(call.id)), [drawn]);
  const shareLink = roomCode ? `${window.location.origin}/dream-phone?room=${roomCode}` : '';

  const start = (code: string) => {
    const normalized = code.trim().toUpperCase() || makeCode();
    setRoomCode(normalized);
    setInGame(true);
    setDrawn([]);
    setActiveCall(null);
    setChecked([]);
    setAnswerOpen(false);
    setGuess('');
    setResult(null);
  };

  const drawCard = () => {
    if (!remaining.length) return;
    const card = remaining[Math.floor(Math.random() * remaining.length)];
    setDrawn((previous) => [...previous, card.id]);
    setActiveCall(card);
  };

  const callNumber = (card: CallCard) => {
    setActiveCall(card);
    window.setTimeout(() => speak(card.spoken), 380);
  };

  const copyCode = async () => {
    await navigator.clipboard?.writeText(shareLink);
    setResult('Invite link copied!');
    window.setTimeout(() => setResult(null), 1800);
  };

  if (!inGame) {
    return <main className="dream-app">
      <section className="landing">
        <div className="sparkles">✦ ✧ ✦</div>
        <p className="eyebrow">THE CALL IS COMING FROM YOUR DREAMS</p>
        <h1>DREAM <span>PHONE</span></h1>
        <p className="intro">Pick up phone-number cards, listen for clues, and figure out who has a crush on you.</p>
        <div className="phone-hero" aria-hidden="true">☎</div>
        <div className="lobby-actions">
          <button className="big-button" onClick={() => start(makeCode())}>Start a new game <b>→</b></button>
          <div className="join-box">
            <label htmlFor="game-code">Joining a friend?</label>
            <div><input id="game-code" maxLength={5} value={joinCode} onChange={(event) => setJoinCode(event.target.value.toUpperCase())} placeholder="GAME CODE" /><button onClick={() => start(joinCode)}>Join</button></div>
          </div>
        </div>
        <p className="tiny">Works best when everyone opens the same game code and plays together.</p>
      </section>
    </main>;
  }

  return <main className="dream-app game-shell">
    <header className="game-header">
      <button className="brand" onClick={() => setInGame(false)}>☎ DREAM PHONE</button>
      <div className="room-pill"><span>GAME CODE</span><strong>{roomCode}</strong><button onClick={copyCode}>Copy invite</button></div>
    </header>
    <section className="game-layout">
      <aside className="suspect-panel">
        <p className="panel-label">YOUR DREAM LIST</p>
        <h2>Who likes you?</h2>
        <p className="hint">Cross people off as the calls give you clues.</p>
        <div className="suspect-list">
          {suspects.map((suspect) => {
            const done = checked.includes(suspect.name);
            return <button key={suspect.name} onClick={() => setChecked((old) => done ? old.filter((name) => name !== suspect.name) : [...old, suspect.name])} className={`suspect ${done ? 'crossed' : ''}`}>
              <span className="avatar" style={{ background: suspect.color }}>{suspect.emoji}</span>
              <span><b>{suspect.name}</b><small>{suspect.vibe}</small></span><i>{done ? '✕' : '○'}</i>
            </button>;
          })}
        </div>
        <button className="guess-button" onClick={() => setAnswerOpen(true)}>Make your guess ✦</button>
      </aside>
      <section className="board">
        <div className="board-top"><div><p className="panel-label">PHONE NUMBER DECK</p><h2>Pick up a card</h2></div><span>{drawn.length} / {calls.length} called</span></div>
        <div className="card-grid">
          {calls.map((card) => {
            const isDrawn = drawn.includes(card.id);
            return <button key={card.id} className={`call-card ${isDrawn ? 'drawn' : ''}`} onClick={() => isDrawn ? callNumber(card) : undefined}>
              {isDrawn ? <><span className="mini-phone">☎</span><b>{card.number}</b><small>Call again</small></> : <><span>?</span><small>PHONE CARD</small></>}
            </button>;
          })}
        </div>
        <button className="draw-button" onClick={drawCard} disabled={!remaining.length}>{remaining.length ? <>Pick up a phone-number card <span>☎</span></> : 'Every card has been called!'}</button>
      </section>
    </section>
    {activeCall && <div className="overlay" role="dialog" aria-modal="true">
      <section className="call-modal">
        <button className="close" onClick={() => setActiveCall(null)}>×</button>
        <div className="call-phone">☎</div>
        <p className="panel-label">CALLING {activeCall.number}</p>
        <h2>Someone picked up...</h2>
        <blockquote>{activeCall.clue}</blockquote>
        <button className="listen-button" onClick={() => speak(activeCall.spoken)}>▶ Play the call again</button>
        <p className="eliminate">This clue rules out: <b>{activeCall.eliminate.join(', ')}</b></p>
      </section>
    </div>}
    {answerOpen && <div className="overlay" role="dialog" aria-modal="true"><section className="guess-modal"><button className="close" onClick={() => setAnswerOpen(false)}>×</button><p className="panel-label">FINAL ANSWER</p><h2>Who is your dream caller?</h2><div className="guess-options">{suspects.map((suspect) => <button key={suspect.name} className={guess === suspect.name ? 'selected' : ''} onClick={() => setGuess(suspect.name)}>{suspect.emoji} {suspect.name}</button>)}</div><button className="big-button" disabled={!guess} onClick={() => { setResult(guess === 'Jesse' ? 'YES! Jesse was your dream caller! 🛹💛' : `Not ${guess} — keep listening to the calls!`); setAnswerOpen(false); }}>{guess ? `Guess ${guess}` : 'Choose a name'}</button></section></div>}
    {result && <div className="toast">{result}</div>}
  </main>;
}

const styles = `
  :root { font-family: Fredoka, system-ui, sans-serif; color: #2d1841; background: #35104d; }
  * { box-sizing: border-box; } button, input { font: inherit; }
  button { cursor: pointer; } button:disabled { cursor: not-allowed; opacity: .55; }
  .dream-app { min-height: 100vh; background: radial-gradient(circle at 20% 12%, #a356c6 0, transparent 27rem), radial-gradient(circle at 86% 88%, #fa8eb5 0, transparent 30rem), #35104d; color: #fff8f5; padding: 24px; overflow: hidden; }
  .landing { width: min(690px, 100%); min-height: calc(100vh - 48px); margin: auto; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; position: relative; }
  .sparkles { color: #ffdd6f; font-size: 22px; letter-spacing: 9px; }
  .eyebrow,.panel-label { color: #ffcf56; font: 500 11px 'DM Mono', monospace; letter-spacing: .13em; margin: 15px 0 7px; }
  .landing h1 { font-size: clamp(56px, 12vw, 104px); line-height: .83; letter-spacing: -.055em; margin: 0; text-shadow: 4px 5px 0 #ed5f9f; transform: rotate(-2deg); }
  .landing h1 span { display: block; color: #ffcd53; text-shadow: 4px 5px 0 #a83575; }
  .intro { max-width: 420px; margin: 24px auto 5px; line-height: 1.45; font-size: 18px; color: #ffe7ef; }
  .phone-hero { font-size: 100px; color: #ff4c9b; transform: rotate(-18deg); filter: drop-shadow(8px 10px 0 #7b1d62); margin: 5px 0 2px; }
  .lobby-actions { display: grid; gap: 12px; width: min(410px, 100%); margin-top: 13px; }
  .big-button,.draw-button,.guess-button { border: 0; border-radius: 15px; background: #ffcd53; color: #421347; font-weight: 700; padding: 15px 19px; box-shadow: 0 5px 0 #b66055; transition: transform .16s; }
  .big-button:hover,.draw-button:hover,.guess-button:hover { transform: translateY(-2px); } .big-button b { float: right; font-size: 23px; line-height: .7; }
  .join-box { padding: 14px; background: #ffffff1c; border: 1px solid #ffffff3b; border-radius: 15px; text-align: left; } .join-box label { display: block; font-size: 13px; margin: 0 0 8px; color: #fce4f7; }.join-box div { display: flex; gap: 8px; }.join-box input { min-width: 0; flex: 1; color: #531653; border: 0; background: #fff; padding: 11px; border-radius: 9px; letter-spacing: .1em; font: 500 12px 'DM Mono', monospace; }.join-box button { border: 0; border-radius: 9px; padding: 7px 13px; color: #fff; background: #d6418a; font-weight: 700; }.tiny { color: #ddbad9; font-size: 12px; margin-top: 15px; }
  .game-shell { padding: 18px; }.game-header { max-width: 1220px; margin: auto; display: flex; justify-content: space-between; align-items: center; gap: 14px; }.brand { color: #fff; border: 0; background: transparent; font-weight: 700; font-size: 21px; letter-spacing: -.03em; }.room-pill { display: flex; align-items: center; gap: 9px; background: #ffffff1a; border: 1px solid #ffffff2c; border-radius: 99px; padding: 6px 7px 6px 13px; }.room-pill span { color: #f8d2ed; font: 10px 'DM Mono', monospace; letter-spacing: .07em; }.room-pill strong { color: #ffce55; letter-spacing: .09em; }.room-pill button { border: 0; color: #fff; background: #d6418a; border-radius: 99px; padding: 7px 10px; font-size: 12px; }
  .game-layout { max-width: 1220px; margin: 18px auto 0; display: grid; grid-template-columns: 300px 1fr; gap: 18px; }.suspect-panel,.board { background: #fff6f7; color: #3b214b; border-radius: 22px; box-shadow: 0 12px 0 #210b34; }.suspect-panel { padding: 21px; }.suspect-panel .panel-label,.board .panel-label { color: #aa4b7d; margin-top: 0; }.suspect-panel h2,.board h2,.call-modal h2,.guess-modal h2 { font-size: 29px; line-height: 1; margin: 0; letter-spacing: -.04em; }.hint { font-size: 13px; line-height: 1.3; color: #805b7a; margin: 9px 0 14px; }.suspect-list { display: grid; gap: 7px; }.suspect { width: 100%; display: flex; align-items: center; gap: 9px; border: 1px solid #eadce8; border-radius: 11px; background: #fff; color: #46254e; text-align: left; padding: 7px; transition: .15s; }.suspect:hover { border-color: #d35899; }.suspect.crossed { opacity: .46; }.suspect.crossed b,.suspect.crossed small { text-decoration: line-through; }.avatar { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 9px; font-size: 20px; }.suspect b { display: block; font-size: 14px; }.suspect small { display: block; font-size: 10px; color: #896a85; }.suspect i { font-style: normal; margin-left: auto; font-size: 19px; color: #c84384; }.guess-button { margin-top: 16px; width: 100%; background: #6ccebb; box-shadow: 0 4px 0 #319787; }.board { padding: clamp(20px, 4vw, 37px); }.board-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }.board-top > span { background: #f3dded; border-radius: 99px; color: #935478; padding: 7px 10px; font: 11px 'DM Mono', monospace; }.card-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 26px 0; }.call-card { min-height: 115px; border: 0; border-radius: 15px; background: linear-gradient(145deg, #5d1e7b, #98328a); color: #fff; box-shadow: inset 0 0 0 2px #ffffff2c, 0 5px 0 #57206e; transition: .16s; }.call-card:hover:not(.drawn) { transform: rotate(-2deg) translateY(-3px); }.call-card > span { display: block; font-size: 40px; line-height: 1; }.call-card small { display: block; font: 10px 'DM Mono', monospace; letter-spacing: .05em; margin-top: 8px; }.call-card.drawn { background: #ffe5ef; color: #673960; box-shadow: inset 0 0 0 2px #ea8ab6, 0 5px 0 #e3a2be; }.mini-phone { color: #d84188; font-size: 31px !important; }.call-card.drawn b { display: block; margin-top: 4px; font-size: 13px; }.draw-button { width: 100%; background: #e64c97; color: #fff; box-shadow: 0 5px 0 #a22965; font-size: 16px; }.draw-button span { margin-left: 6px; }
  .overlay { position: fixed; inset: 0; z-index: 5; display: grid; place-items: center; padding: 20px; background: #1e082ddd; }.call-modal,.guess-modal { position: relative; max-width: 450px; width: 100%; padding: 35px; text-align: center; color: #4a214e; background: #fff7f7; border-radius: 25px; box-shadow: 0 14px 0 #12061e; }.close { position: absolute; right: 13px; top: 11px; background: transparent; border: 0; color: #a35980; font-size: 30px; }.call-phone { width: 72px; height: 72px; display: grid; place-items: center; margin: auto; border-radius: 50%; background: #f85ba4; color: #fff; font-size: 40px; transform: rotate(-13deg); }.call-modal blockquote { padding: 18px; margin: 22px 0 14px; background: #f4e4ee; border-radius: 15px; font-size: 20px; font-weight: 500; line-height: 1.25; }.listen-button { border: 0; color: #fff; background: #754caa; border-radius: 11px; padding: 11px 14px; font-weight: 600; }.eliminate { margin: 18px 0 0; font-size: 12px; line-height: 1.35; color: #805c79; }.guess-options { display: grid; grid-template-columns: repeat(2, 1fr); gap: 9px; margin: 20px 0; }.guess-options button { color: #4a214e; background: #f5e5ee; border: 2px solid transparent; border-radius: 10px; padding: 10px; font-weight: 600; }.guess-options .selected { border-color: #e74d97; background: #ffd9e9; }.toast { position: fixed; bottom: 26px; left: 50%; z-index: 12; transform: translateX(-50%); max-width: calc(100vw - 30px); padding: 13px 18px; border-radius: 99px; background: #ffcf55; color: #562148; font-weight: 700; box-shadow: 0 5px 0 #b96a55; }
  @media (max-width: 760px) { .dream-app { padding: 12px; }.game-header { align-items: flex-start; }.brand { font-size: 16px; }.room-pill { gap: 5px; padding-left: 9px; }.room-pill span { display: none; }.game-layout { grid-template-columns: 1fr; margin-top: 12px; }.suspect-panel { order: 2; }.card-grid { grid-template-columns: repeat(3, 1fr); gap: 9px; }.call-card { min-height: 93px; }.call-card > span { font-size: 30px; }.board { padding: 20px 15px; }.board h2,.suspect-panel h2 { font-size: 25px; } }
`;

if (typeof document !== 'undefined' && !document.getElementById('dream-phone-styles')) {
  const tag = document.createElement('style');
  tag.id = 'dream-phone-styles';
  tag.textContent = styles;
  document.head.appendChild(tag);
}
