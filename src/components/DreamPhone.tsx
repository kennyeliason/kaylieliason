import { useEffect, useState } from 'react';

type NoteState = 'none' | 'circled' | 'crossed';
type NoteGroup = { label: string; items: string[] };
type ClueCard = { id: number; kind: string; clue: string; spoken: string };

const noteGroups: NoteGroup[] = [
  { label: 'Secret Admirer', items: ['Dave', 'George', 'Dale', 'Alan', 'James', 'Phil'] },
  { label: 'Called', items: ['Bruce', 'Tyler', 'Jamal', 'Gary', 'Dan', 'Spencer', 'Mark', 'Jason', 'Steven', 'John', 'Paul', 'Tony', 'Wayne', 'Mike', 'Scott', 'Bob', 'Carlos', 'Matt'] },
  { label: 'Hang-Out Clues', items: ['Crosstown Mall', 'Snack Shop', 'Reel Movies', 'Woodland Park', 'High Tide Beach', "Jim's Gym"] },
  { label: 'Sports Clues', items: ['Basketball', 'Skateboarding', 'Volleyball', 'Surfing', 'Tennis'] },
  { label: 'Food Clues', items: ['Ice cream', 'Cookies', 'Hot dogs', 'Pizza', 'Popcorn', 'Candy'] },
  { label: 'Clothing Clues', items: ['Hat', 'Tie', 'Blue jeans', 'Jacket', 'Glasses', 'Anything yellow'] },
];

const clueCards: ClueCard[] = [
  { id: 1, kind: 'SECRET ADMIRER', clue: 'I know who it is, but I’m not telling! Ha! Ha!', spoken: 'I know who it is, but I’m not telling! Ha! Ha!' },
  { id: 2, kind: 'HANG-OUT CLUE', clue: 'I know where he hangs out… but it’s not at Crosstown Mall.', spoken: 'I know where he hangs out, but it’s not at Crosstown Mall.' },
  { id: 3, kind: 'HANG-OUT CLUE', clue: 'I know where he hangs out… but it’s not at the Snack Shop.', spoken: 'I know where he hangs out, but it’s not at the Snack Shop.' },
  { id: 4, kind: 'HANG-OUT CLUE', clue: 'I know where he hangs out… but it’s not at Reel Movies.', spoken: 'I know where he hangs out, but it’s not at Reel Movies.' },
  { id: 5, kind: 'HANG-OUT CLUE', clue: 'I know where he hangs out… but it’s not at Woodland Park.', spoken: 'I know where he hangs out, but it’s not at Woodland Park.' },
  { id: 6, kind: 'HANG-OUT CLUE', clue: 'I know where he hangs out… but it’s not at High Tide Beach.', spoken: 'I know where he hangs out, but it’s not at High Tide Beach.' },
  { id: 7, kind: 'SPORTS CLUE', clue: 'He likes most sports… but not basketball.', spoken: 'He likes most sports, but not basketball.' },
  { id: 8, kind: 'SPORTS CLUE', clue: 'He likes most sports… but not skateboarding.', spoken: 'He likes most sports, but not skateboarding.' },
  { id: 9, kind: 'SPORTS CLUE', clue: 'He likes most sports… but not volleyball.', spoken: 'He likes most sports, but not volleyball.' },
  { id: 10, kind: 'SPORTS CLUE', clue: 'He likes most sports… but not surfing.', spoken: 'He likes most sports, but not surfing.' },
  { id: 11, kind: 'SPORTS CLUE', clue: 'He likes most sports… but not tennis.', spoken: 'He likes most sports, but not tennis.' },
  { id: 12, kind: 'FOOD CLUE', clue: 'He’ll eat almost anything, except ice cream.', spoken: 'He will eat almost anything, except ice cream.' },
  { id: 13, kind: 'FOOD CLUE', clue: 'He’ll eat almost anything, except cookies.', spoken: 'He will eat almost anything, except cookies.' },
  { id: 14, kind: 'FOOD CLUE', clue: 'He’ll eat almost anything, except hot dogs.', spoken: 'He will eat almost anything, except hot dogs.' },
  { id: 15, kind: 'FOOD CLUE', clue: 'He’ll eat almost anything, except pizza.', spoken: 'He will eat almost anything, except pizza.' },
  { id: 16, kind: 'FOOD CLUE', clue: 'He’ll eat almost anything, except popcorn.', spoken: 'He will eat almost anything, except popcorn.' },
  { id: 17, kind: 'FOOD CLUE', clue: 'He’ll eat almost anything, except candy.', spoken: 'He will eat almost anything, except candy.' },
  { id: 18, kind: 'CLOTHING CLUE', clue: 'He’s not wearing a hat.', spoken: 'He is not wearing a hat.' },
  { id: 19, kind: 'CLOTHING CLUE', clue: 'He’s not wearing a tie.', spoken: 'He is not wearing a tie.' },
  { id: 20, kind: 'CLOTHING CLUE', clue: 'He’s not wearing blue jeans.', spoken: 'He is not wearing blue jeans.' },
  { id: 21, kind: 'CLOTHING CLUE', clue: 'He’s not wearing a jacket.', spoken: 'He is not wearing a jacket.' },
  { id: 22, kind: 'CLOTHING CLUE', clue: 'He’s not wearing glasses.', spoken: 'He is not wearing glasses.' },
  { id: 23, kind: 'CLOTHING CLUE', clue: 'He’s not wearing anything yellow.', spoken: 'He is not wearing anything yellow.' },
  { id: 24, kind: 'SECRET ADMIRER', clue: 'I know who it is, but I’m not telling! Ha! Ha!', spoken: 'I know who it is, but I’m not telling! Ha! Ha!' },
];

function makeCode() { return Math.random().toString(36).slice(2, 7).toUpperCase(); }
function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const line = new SpeechSynthesisUtterance(text);
  line.rate = 0.9; line.pitch = 1.18;
  window.speechSynthesis.speak(line);
}

export default function DreamPhone() {
  const [screen, setScreen] = useState<'home' | 'host' | 'join' | 'hostWaiting' | 'joinWaiting' | 'game'>('home');
  const [roomCode, setRoomCode] = useState('');
  const [name, setName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [activeTab, setActiveTab] = useState<'deck' | 'notes'>('deck');
  const [deck, setDeck] = useState<ClueCard[]>([]);
  const [activeCard, setActiveCard] = useState<ClueCard | null>(null);
  const [notes, setNotes] = useState<Record<string, NoteState>>({});
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('room');
    if (param) { setJoinCode(param.toUpperCase()); setScreen('join'); }
  }, []);

  const drawCount = clueCards.length - deck.length;
  const begin = () => { setDeck([...clueCards].sort(() => Math.random() - 0.5)); setActiveCard(null); setActiveTab('deck'); setScreen('game'); };
  const draw = () => {
    if (!deck.length) return;
    const [next, ...rest] = deck;
    setDeck(rest); setActiveCard(next);
    window.setTimeout(() => speak(next.spoken), 350);
  };
  const cycleNote = (item: string) => setNotes((old) => {
    const current = old[item] ?? 'none';
    return { ...old, [item]: current === 'none' ? 'circled' : current === 'circled' ? 'crossed' : 'none' };
  });
  const shareCode = async () => {
    const link = `${window.location.origin}/dream-phone?room=${roomCode}`;
    await navigator.clipboard?.writeText(link);
    setMessage('Invite link copied!'); window.setTimeout(() => setMessage(null), 1800);
  };

  if (screen === 'home') return <main className="dream-app landing-page"><section className="landing"><div className="sparkles">✦ ✧ ✦</div><p className="eyebrow">A PHONE-CALL MYSTERY GAME</p><h1>DREAM <span>PHONE</span></h1><div className="phone-hero">☎</div><p className="intro">Pick up clue cards, take detective notes, and figure out the secret admirer.</p><div className="two-buttons"><button className="big-button" onClick={() => { setRoomCode(makeCode()); setScreen('host'); }}>HOST</button><button className="big-button pink-button" onClick={() => setScreen('join')}>JOIN</button></div></section></main>;

  if (screen === 'host') return <main className="dream-app"><Lobby title="Host a game" subtitle="You will get a code to give the other players."><label>Your name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="YOUR NAME" maxLength={18} /></label><button className="big-button" onClick={() => setScreen('hostWaiting')}>Create game</button><button className="back-button" onClick={() => setScreen('home')}>← Back</button></Lobby></main>;
  if (screen === 'join') return <main className="dream-app"><Lobby title="Join a game" subtitle="Ask the host for their five-letter game code."><label>Game code<input value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder="ABCDE" maxLength={5} /></label><label>Your name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="YOUR NAME" maxLength={18} /></label><button className="big-button" disabled={joinCode.trim().length < 5 || !name.trim()} onClick={() => { setRoomCode(joinCode.trim()); setScreen('joinWaiting'); }}>Join game</button><button className="back-button" onClick={() => setScreen('home')}>← Back</button></Lobby></main>;
  if (screen === 'hostWaiting') return <main className="dream-app"><Lobby title="Waiting for players" subtitle="Share this code. When everyone has joined, start the game."><div className="code-card"><span>GAME CODE</span><strong>{roomCode}</strong><button onClick={shareCode}>Copy invite</button></div><label>Host player name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="YOUR NAME" maxLength={18} /></label><p className="host-note">You are automatically joining as a player{ name ? `: ${name}` : '' }.</p><button className="big-button" onClick={begin}>Start game →</button></Lobby></main>;
  if (screen === 'joinWaiting') return <main className="dream-app"><Lobby title="Waiting for host" subtitle={`You joined game ${roomCode}. The host will start when everyone is ready.`}><div className="waiting-phone">☎</div><p className="waiting-name">You are playing as <b>{name}</b></p><button className="back-button" onClick={() => setScreen('home')}>Leave game</button></Lobby></main>;

  return <main className="dream-app game-shell"><header className="game-header"><button className="brand" onClick={() => setScreen('home')}>☎ DREAM PHONE</button><div className="room-pill"><span>GAME CODE</span><strong>{roomCode}</strong><button onClick={shareCode}>Copy invite</button></div></header><section className="game-wrap"><nav className="tabs"><button className={activeTab === 'deck' ? 'active' : ''} onClick={() => setActiveTab('deck')}>☎ Draw pile <em>{drawCount}/24</em></button><button className={activeTab === 'notes' ? 'active' : ''} onClick={() => setActiveTab('notes')}>✎ Detective Notes</button></nav>{activeTab === 'deck' ? <section className="deck-screen"><div className="deck-copy"><p className="eyebrow">SECRET ADMIRER CARDS</p><h2>Pick up the next card.</h2><p>Each card gives your group one more clue. Open Detective Notes anytime to circle or cross off possibilities.</p></div><div className="deck-zone"><button className="card-stack" onClick={draw} disabled={!deck.length} aria-label="Draw the next Secret Admirer card"><span className="stack stack-three"></span><span className="stack stack-two"></span><span className="top-card"><i>☎</i><b>SECRET<br/>ADMIRER</b><small>{deck.length ? 'TAP TO DRAW' : 'ALL CALLED'}</small></span></button><p>{deck.length ? `${deck.length} cards left in the pile` : 'Every clue card has been drawn!'}</p></div></section> : <Notes notes={notes} onCycle={cycleNote} />}</section>{activeCard && <div className="overlay"><section className="clue-modal"><button className="close" onClick={() => setActiveCard(null)}>×</button><div className="call-phone">☎</div><p className="eyebrow">{activeCard.kind}</p><h2>New clue!</h2><blockquote>“{activeCard.clue}”</blockquote><button className="listen-button" onClick={() => speak(activeCard.spoken)}>▶ Play phone call again</button><button className="notes-link" onClick={() => { setActiveCard(null); setActiveTab('notes'); }}>Open Detective Notes →</button></section></div>}{message && <div className="toast">{message}</div>}</main>;
}

function Lobby({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) { return <section className="lobby"><div className="sparkles">✦ ✧ ✦</div><p className="eyebrow">DREAM PHONE</p><h1>{title}</h1><p>{subtitle}</p><div className="lobby-fields">{children}</div></section>; }
function Notes({ notes, onCycle }: { notes: Record<string, NoteState>; onCycle: (item: string) => void }) { return <section className="notes-screen"><div className="notes-title"><div><p className="eyebrow">YOUR CHECKLIST</p><h2>Detective Notes</h2><p>Tap once to circle an option, tap again to cross it off, tap once more to clear it.</p></div><div className="note-key"><span>○ circle</span><span>✕ cross off</span></div></div><div className="note-grid">{noteGroups.map((group) => <section className="note-group" key={group.label}><h3>{group.label}</h3>{group.items.map((item) => <button key={item} onClick={() => onCycle(item)} className={`note-item ${notes[item] || 'none'}`}><i>{notes[item] === 'circled' ? '○' : notes[item] === 'crossed' ? '✕' : ''}</i>{item}</button>)}</section>)}</div></section>; }

const styles = `
:root{font-family:Fredoka,system-ui,sans-serif;background:#35104d;color:#fff8f5}*{box-sizing:border-box}button,input{font:inherit}button{cursor:pointer}button:disabled{opacity:.48;cursor:not-allowed}.dream-app{min-height:100vh;padding:24px;background:radial-gradient(circle at 20% 12%,#a356c6 0,transparent 27rem),radial-gradient(circle at 86% 88%,#fa8eb5 0,transparent 30rem),#35104d;color:#fff8f5}.landing-page{display:grid;place-items:center}.landing,.lobby{width:min(500px,100%);text-align:center}.sparkles{color:#ffdd6f;font-size:22px;letter-spacing:9px}.eyebrow{color:#ffcf56;font:500 11px 'DM Mono',monospace;letter-spacing:.13em;margin:15px 0 7px}.landing h1,.lobby h1{font-size:clamp(56px,12vw,100px);line-height:.83;letter-spacing:-.055em;margin:0;text-shadow:4px 5px 0 #ed5f9f;transform:rotate(-2deg)}.landing h1 span{display:block;color:#ffcd53;text-shadow:4px 5px 0 #a83575}.phone-hero{font-size:104px;color:#ff4c9b;transform:rotate(-18deg);filter:drop-shadow(8px 10px 0 #7b1d62);margin:5px 0 2px}.intro,.lobby>p{line-height:1.45;font-size:17px;color:#ffe7ef;margin:20px auto}.two-buttons{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:25px}.big-button,.back-button{border:0;border-radius:15px;background:#ffcd53;color:#421347;font-weight:700;padding:15px 19px;box-shadow:0 5px 0 #b66055;transition:transform .16s}.big-button:hover:not(:disabled){transform:translateY(-2px)}.pink-button{background:#e64c97;color:#fff;box-shadow:0 5px 0 #a22965}.lobby{min-height:calc(100vh - 48px);margin:auto;display:flex;flex-direction:column;justify-content:center}.lobby h1{font-size:clamp(42px,9vw,72px);text-shadow:3px 4px 0 #ed5f9f}.lobby-fields{display:grid;gap:12px;text-align:left;margin-top:10px}.lobby label{color:#ffe5f1;font-size:13px;font-weight:600}.lobby input{display:block;width:100%;margin-top:7px;border:0;border-radius:10px;background:#fff;color:#52144d;padding:13px;letter-spacing:.08em;font:500 14px 'DM Mono',monospace}.lobby-fields>.big-button{text-align:center}.back-button{background:transparent;color:#f4d5e6;box-shadow:none;padding:8px;text-align:center}.code-card{padding:20px;border:2px dashed #ffcc64;border-radius:17px;background:#ffffff15;text-align:center}.code-card span{display:block;font:10px 'DM Mono',monospace;letter-spacing:.13em;color:#fbd7ed}.code-card strong{display:block;color:#ffcf56;font:700 43px 'DM Mono',monospace;letter-spacing:.13em;margin:7px}.code-card button{border:0;border-radius:9px;background:#e44a94;color:#fff;padding:8px 13px;font-weight:700}.host-note,.waiting-name{text-align:center!important;margin:2px!important;color:#f5d4e6!important;font-size:14px!important}.waiting-phone{font-size:100px;color:#ffcf56;text-align:center;transform:rotate(-14deg);filter:drop-shadow(6px 7px 0 #8a296d)}
.game-shell{padding:18px}.game-header{max-width:1080px;margin:auto;display:flex;justify-content:space-between;align-items:center;gap:14px}.brand{color:#fff;border:0;background:transparent;font-weight:700;font-size:21px;letter-spacing:-.03em}.room-pill{display:flex;align-items:center;gap:9px;background:#ffffff1a;border:1px solid #ffffff2c;border-radius:99px;padding:6px 7px 6px 13px}.room-pill span{color:#f8d2ed;font:10px 'DM Mono',monospace;letter-spacing:.07em}.room-pill strong{color:#ffce55;letter-spacing:.09em}.room-pill button{border:0;color:#fff;background:#d6418a;border-radius:99px;padding:7px 10px;font-size:12px}.game-wrap{max-width:1080px;margin:18px auto}.tabs{display:flex;gap:9px;margin-bottom:13px}.tabs button{border:0;border-radius:99px;background:#ffffff1c;color:#f9dce9;padding:10px 15px;font-weight:600}.tabs button.active{background:#ffcf56;color:#4b174e}.tabs em{font-style:normal;font:10px 'DM Mono',monospace;margin-left:6px}.deck-screen,.notes-screen{min-height:590px;border-radius:23px;background:#fff7f7;color:#44224e;box-shadow:0 12px 0 #210b34;padding:clamp(25px,5vw,60px)}.deck-screen{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:40px}.deck-copy h2,.notes-title h2,.clue-modal h2{font-size:clamp(33px,5vw,53px);line-height:.95;letter-spacing:-.055em;margin:0}.deck-copy .eyebrow,.notes-title .eyebrow,.clue-modal .eyebrow{color:#b14c7f}.deck-copy>p:last-child{color:#795777;line-height:1.5;max-width:360px}.deck-zone{text-align:center;color:#8d6684}.card-stack{position:relative;width:208px;height:278px;margin:auto;border:0;background:transparent;transform:rotate(-3deg);transition:transform .18s}.card-stack:hover:not(:disabled){transform:rotate(1deg) translateY(-7px)}.stack,.top-card{position:absolute;inset:0;border-radius:18px}.stack{background:#813078;border:2px solid #ffbdde}.stack-two{transform:rotate(5deg) translate(10px,7px);background:#62206f}.stack-three{transform:rotate(-5deg) translate(-9px,10px);background:#a33484}.top-card{z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(155deg,#e74c97,#7a287d);border:3px solid #ffdfa0;color:#fff;box-shadow:inset 0 0 0 4px #ffffff39,0 8px 0 #5a1e68}.top-card i{font-size:56px;font-style:normal;transform:rotate(-12deg)}.top-card b{font-size:24px;line-height:.9;margin:12px 0;letter-spacing:-.05em}.top-card small{font:10px 'DM Mono',monospace;letter-spacing:.1em}.deck-zone>p{font-size:13px;margin-top:22px}.notes-title{display:flex;justify-content:space-between;align-items:flex-end;gap:20px}.notes-title h2{font-size:42px}.notes-title>div>p:last-child{color:#805a79;margin:9px 0 0;font-size:13px}.note-key{display:flex;gap:8px;flex-wrap:wrap}.note-key span{padding:6px 9px;border-radius:99px;background:#f2e2ed;color:#a45580;font-size:11px}.note-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:15px;margin-top:28px}.note-group{border:1px solid #ead9e6;border-radius:13px;padding:13px}.note-group h3{font-size:16px;margin:0 0 9px;color:#743766}.note-item{display:flex;align-items:center;width:100%;border:0;background:transparent;color:#553151;padding:5px 3px;text-align:left;font-size:14px}.note-item i{display:inline-grid;place-items:center;width:24px;height:21px;margin-right:5px;font-style:normal;font-size:23px;color:#dc438d}.note-item.circled{font-weight:700;color:#6b287e}.note-item.circled i{border:2px solid #7d3dbb;border-radius:50%;font-size:0}.note-item.crossed{color:#b693ab;text-decoration:line-through}.note-item.crossed i{font-size:22px}.overlay{position:fixed;inset:0;z-index:5;display:grid;place-items:center;padding:20px;background:#1e082ddd}.clue-modal{position:relative;max-width:470px;width:100%;padding:38px;text-align:center;color:#4a214e;background:#fff7f7;border-radius:25px;box-shadow:0 14px 0 #12061e}.close{position:absolute;right:13px;top:11px;background:transparent;border:0;color:#a35980;font-size:30px}.call-phone{width:72px;height:72px;display:grid;place-items:center;margin:auto;border-radius:50%;background:#f85ba4;color:#fff;font-size:40px;transform:rotate(-13deg)}.clue-modal blockquote{padding:18px;margin:22px 0 14px;background:#f4e4ee;border-radius:15px;font-size:20px;font-weight:500;line-height:1.25}.listen-button,.notes-link{border:0;border-radius:11px;padding:11px 14px;font-weight:600}.listen-button{color:#fff;background:#754caa}.notes-link{display:block;margin:11px auto 0;background:transparent;color:#b13c77}.toast{position:fixed;bottom:26px;left:50%;z-index:12;transform:translateX(-50%);padding:13px 18px;border-radius:99px;background:#ffcf55;color:#562148;font-weight:700;box-shadow:0 5px 0 #b96a55}
@media(max-width:720px){.dream-app{padding:12px}.game-header{align-items:flex-start}.brand{font-size:16px}.room-pill span{display:none}.deck-screen{grid-template-columns:1fr;padding:35px 20px;min-height:0}.deck-copy{text-align:center}.deck-copy>p:last-child{margin:16px auto}.deck-zone{order:-1}.notes-screen{padding:27px 16px}.notes-title{align-items:flex-start;display:block}.note-key{margin-top:14px}.note-grid{grid-template-columns:repeat(2,1fr);gap:9px}.note-group{padding:10px}.note-item{font-size:13px}.card-stack{transform:scale(.88)}.deck-zone>p{margin-top:-5px}.tabs{overflow:auto}.tabs button{white-space:nowrap}.two-buttons{margin-top:18px}}
`;

if (typeof document !== 'undefined' && !document.getElementById('dream-phone-styles')) { const tag = document.createElement('style'); tag.id = 'dream-phone-styles'; tag.textContent = styles; document.head.appendChild(tag); }
