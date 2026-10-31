import { useEffect, useRef, useState } from 'react';
import Peer, { type DataConnection } from 'peerjs';
import { QRCodeSVG } from 'qrcode.react';

type NoteState = 'none' | 'crossed';
type NoteGroup = { label: string; items: string[] };
type ClueCard = { id: number; kind: string; clue: string; spoken: string };
type PowerCard = 'hangup' | 'speakerphone' | 'secret';
type Reveal = { card: ClueCard; caller: string; title: string; private: boolean };

const guyNames = ['Dave', 'George', 'Dale', 'Alan', 'James', 'Phil', 'Bruce', 'Tyler', 'Jamal', 'Gary', 'Dan', 'Spencer', 'Mark', 'Jason', 'Steven', 'John', 'Paul', 'Tony', 'Wayne', 'Mike', 'Scott', 'Bob', 'Carlos', 'Matt'];
const avatarOptions = ['🦋', '🌸', '💖', '🪩', '🌈', '🧸', '🍒', '⭐️'];
const hangouts = ['Crosstown Mall', 'Snack Shop', 'Reel Movies', 'Woodland Park', 'High Tide Beach', "Jim's Gym"];
const sports = ['Basketball', 'Skateboarding', 'Volleyball', 'Surfing', 'Tennis'];
const foods = ['Ice cream', 'Cookies', 'Hot dogs', 'Pizza', 'Popcorn', 'Candy'];
const outfits = ['Hat', 'Tie', 'Blue jeans', 'Jacket', 'Glasses', 'Anything yellow'];
const guyProfiles = guyNames.map((name, index) => ({
  name,
  hangout: name === 'Jamal' ? "Jim's Gym" : hangouts[index % hangouts.length],
  sport: name === 'Jamal' ? 'Tennis' : sports[index % sports.length],
  food: name === 'Jamal' ? 'Candy' : foods[index % foods.length],
  outfit: name === 'Jamal' ? 'Anything yellow' : outfits[index % outfits.length],
}));
const secretAdmirer = 'Jamal';

const noteGroups: NoteGroup[] = [
  { label: 'Secret Admirer', items: guyNames },
  { label: 'Called', items: guyNames },
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
  { id: 11, kind: 'SECRET ADMIRER', clue: 'I know who it is, but I’m not telling! Ha! Ha!', spoken: 'I know who it is, but I’m not telling! Ha! Ha!' },
  { id: 12, kind: 'FOOD CLUE', clue: 'He’ll eat almost anything, except ice cream.', spoken: 'He will eat almost anything, except ice cream.' },
  { id: 13, kind: 'FOOD CLUE', clue: 'He’ll eat almost anything, except cookies.', spoken: 'He will eat almost anything, except cookies.' },
  { id: 14, kind: 'FOOD CLUE', clue: 'He’ll eat almost anything, except hot dogs.', spoken: 'He will eat almost anything, except hot dogs.' },
  { id: 15, kind: 'FOOD CLUE', clue: 'He’ll eat almost anything, except pizza.', spoken: 'He will eat almost anything, except pizza.' },
  { id: 16, kind: 'FOOD CLUE', clue: 'He’ll eat almost anything, except popcorn.', spoken: 'He will eat almost anything, except popcorn.' },
  { id: 17, kind: 'SECRET ADMIRER', clue: 'I know who it is, but I’m not telling! Ha! Ha!', spoken: 'I know who it is, but I’m not telling! Ha! Ha!' },
  { id: 18, kind: 'CLOTHING CLUE', clue: 'He’s not wearing a hat.', spoken: 'He is not wearing a hat.' },
  { id: 19, kind: 'CLOTHING CLUE', clue: 'He’s not wearing a tie.', spoken: 'He is not wearing a tie.' },
  { id: 20, kind: 'CLOTHING CLUE', clue: 'He’s not wearing blue jeans.', spoken: 'He is not wearing blue jeans.' },
  { id: 21, kind: 'CLOTHING CLUE', clue: 'He’s not wearing a jacket.', spoken: 'He is not wearing a jacket.' },
  { id: 22, kind: 'CLOTHING CLUE', clue: 'He’s not wearing glasses.', spoken: 'He is not wearing glasses.' },
  { id: 23, kind: 'SECRET ADMIRER', clue: 'I know who it is, but I’m not telling! Ha! Ha!', spoken: 'I know who it is, but I’m not telling! Ha! Ha!' },
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
  useEffect(() => {
    if (document.getElementById('dream-phone-power-card-styles')) return;
    const tag = document.createElement('style');
    tag.id = 'dream-phone-power-card-styles';
    tag.textContent = `
      .power-cards{margin-top:18px;padding:18px;border:2px dashed #ffcf56;border-radius:20px;background:#ffffff16;color:#fff7f7}
      .power-cards .eyebrow{margin:0 0 4px}.power-cards h3{margin:0;font-size:21px}.power-cards>div>p:last-child{margin:5px 0 0;color:#f6d8e8;font-size:13px}
      .power-card-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}
      .power-card{min-height:138px;padding:12px 9px;border:3px solid #ffd675;border-radius:15px;color:#fff;text-align:center;box-shadow:0 5px 0 #280d3b;transition:transform .15s,opacity .15s}
      .power-card:hover:not(:disabled){transform:translateY(-3px)}.power-card i{display:block;margin:auto auto 7px;font-style:normal;font-size:31px}.power-card b{display:block;font-size:15px;line-height:1}.power-card small{display:block;margin-top:8px;font-size:11px;line-height:1.15;opacity:.92}
      .power-card.hangup{background:linear-gradient(145deg,#276f71,#164651)}.power-card.speaker{background:linear-gradient(145deg,#6b3ba2,#3c2374)}.power-card.secret{background:linear-gradient(145deg,#e14d96,#93276f)}.power-card.used{filter:grayscale(1);opacity:.48;box-shadow:none}
      .reveal-overlay{position:fixed;inset:0;z-index:9;display:grid;place-items:center;padding:20px;background:#180726d9}.reveal-card{width:min(500px,100%);padding:34px 27px;text-align:center;color:#4a214e;background:#fff8fb;border-radius:25px;box-shadow:0 14px 0 #12061e}.reveal-card .eyebrow{color:#b14c7f;margin-top:0}.reveal-icon{display:grid;place-items:center;width:70px;height:70px;margin:10px auto;border-radius:50%;background:#f5d5e8;font-size:36px}.reveal-card h2{margin:9px 0;font-size:clamp(27px,6vw,43px);line-height:.98;letter-spacing:-.05em}.caller-name{margin:18px 0 6px;font-weight:700;color:#9b507c}.reveal-card blockquote{padding:17px;margin:0 0 22px;background:#f4e4ee;border-radius:15px;font-size:20px;font-weight:600;line-height:1.25}
      .invite-with-qr{display:grid;grid-template-columns:1fr auto;gap:18px;align-items:center}.qr-box{display:grid;place-items:center;padding:9px;border-radius:13px;background:#fff7fb}.qr-box svg{display:block}.qr-caption{margin:8px 0 0;color:#ffe5f1;font:10px 'DM Mono',monospace;letter-spacing:.08em;text-align:center}
      .guess-panel{min-height:590px;padding:clamp(28px,6vw,64px);border-radius:23px;background:#fff7f7;color:#44224e;box-shadow:0 12px 0 #210b34;text-align:center}.guess-panel .eyebrow{color:#b14c7f;margin:0 0 8px}.guess-panel h2{margin:0;font-size:clamp(38px,7vw,68px);line-height:.93;letter-spacing:-.06em}.guess-panel>p:not(.eyebrow){max-width:450px;margin:16px auto 25px;color:#795777;line-height:1.45}.guess-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:720px;margin:auto}.guess-grid button{min-height:54px;border:2px solid #ebcddd;border-radius:12px;background:#fff;color:#743766;font-weight:800;font-size:16px}.guess-grid button:hover{background:#f8d9e8;transform:translateY(-2px)}.guess-result{display:grid;gap:7px;max-width:520px;margin:25px auto;padding:22px;border-radius:17px;font-size:18px}.guess-result b{font-size:26px}.guess-result span{color:#795777}.guess-result.right{background:#d6f3df;color:#216341}.guess-result.wrong{background:#fce0e9;color:#9b315d}
      @media(max-width:470px){.invite-with-qr{grid-template-columns:1fr}.qr-box{width:max-content;margin:auto}}
      @media(max-width:720px){.power-card-row{grid-template-columns:1fr;gap:8px}.power-card{min-height:0;display:grid;grid-template-columns:36px 1fr;column-gap:10px;align-items:center;text-align:left;padding:11px}.power-card i{grid-row:span 2;margin:0}.power-card b{font-size:16px}.power-card small{margin:3px 0 0}.reveal-card{padding:28px 18px}.guess-panel{min-height:0;padding:34px 18px}.guess-grid{grid-template-columns:repeat(2,1fr)}}
    `;
    document.head.appendChild(tag);
  }, []);
  const [screen, setScreen] = useState<'home' | 'host' | 'join' | 'hostWaiting' | 'joinWaiting' | 'game'>('home');
  const [roomCode, setRoomCode] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🦋');
  const [joinCode, setJoinCode] = useState('');
  const [hostJoined, setHostJoined] = useState(false);
  const [activeTab, setActiveTab] = useState<'deck' | 'notes' | 'guess'>('deck');
  const [deck, setDeck] = useState<ClueCard[]>([]);
  const [deckCount, setDeckCount] = useState(24);
  const [players, setPlayers] = useState<string[]>([]);
  const [avatars, setAvatars] = useState<Record<string, string>>({});
  const [turnIndex, setTurnIndex] = useState(0);
  const [turnBusy, setTurnBusy] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [activeCard, setActiveCard] = useState<ClueCard | null>(null);
  const [activeCaller, setActiveCaller] = useState('');
  const [lastCard, setLastCard] = useState<ClueCard | null>(null);
  const [lastCaller, setLastCaller] = useState('');
  const [callAnswered, setCallAnswered] = useState(false);
  const [notes, setNotes] = useState<Record<string, NoteState>>({});
  const [gameFinished, setGameFinished] = useState(false);
  const [gameWinner, setGameWinner] = useState('');
  const [eliminated, setEliminated] = useState(false);
  const [eliminatedPlayers, setEliminatedPlayers] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [usedPowers, setUsedPowers] = useState<Record<PowerCard, boolean>>({ hangup: false, speakerphone: false, secret: false });
  const [reveal, setReveal] = useState<Reveal | null>(null);
  const [guessResult, setGuessResult] = useState<{ name: string; correct: boolean } | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const hostConnection = useRef<DataConnection | null>(null);
  const connections = useRef<Map<string, DataConnection>>(new Map());
  const deckRef = useRef<ClueCard[]>([]);
  const playersRef = useRef<string[]>([]);
  const avatarsRef = useRef<Record<string, string>>({});
  const turnRef = useRef(0);
  const busyRef = useRef(false);
  const currentCardRef = useRef<ClueCard | null>(null);
  const currentCallerRef = useRef('');
  const eliminatedRef = useRef<string[]>([]);

  useEffect(() => { deckRef.current = deck; }, [deck]);
  useEffect(() => { playersRef.current = players; }, [players]);
  useEffect(() => { avatarsRef.current = avatars; }, [avatars]);
  useEffect(() => { turnRef.current = turnIndex; }, [turnIndex]);
  useEffect(() => { busyRef.current = turnBusy; }, [turnBusy]);
  useEffect(() => { eliminatedRef.current = eliminatedPlayers; }, [eliminatedPlayers]);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('room');
    if (param) { setJoinCode(param.toUpperCase()); setScreen('join'); }
  }, []);

  const broadcast = (payload: unknown) => connections.current.forEach((connection) => connection.open && connection.send(payload));
  const updateTurn = (nextIndex: number, busy: boolean, count = deckRef.current.length) => {
    setTurnIndex(nextIndex); setTurnBusy(busy); setDeckCount(count);
    broadcast({ type: 'turn', currentTurn: nextIndex, busy, deckCount: count });
  };
  const finishGame = (winner = '') => {
    setTurnBusy(false);
    setGameFinished(true);
    setGameWinner(winner);
    broadcast({ type: 'gameOver', winner });
  };
  const advanceTurn = () => {
    currentCardRef.current = null;
    currentCallerRef.current = '';
    setActiveCard(null);
    setCallAnswered(false);
    if (deckRef.current.length === 0) finishGame();
    else {
      const nextIndex = Array.from({ length: playersRef.current.length }, (_, offset) => (turnRef.current + offset + 1) % playersRef.current.length).find((index) => !eliminatedRef.current.includes(playersRef.current[index]));
      if (nextIndex === undefined) finishGame();
      else updateTurn(nextIndex, false);
    }
  };
  const finishTurn = () => {
    setActiveCard(null);
    if (isHost) {
      advanceTurn();
    }
    else hostConnection.current?.send({ type: 'finish' });
  };
  const serveDraw = (connection?: DataConnection) => {
    const currentPlayer = playersRef.current[turnRef.current];
    if (!deckRef.current.length || !currentPlayer) return;
    const [card, ...rest] = deckRef.current;
    setDeck(rest); deckRef.current = rest; setDeckCount(rest.length);
    updateTurn(turnRef.current, true, rest.length);
    const caller = guyNames[Math.floor(Math.random() * guyNames.length)];
    currentCardRef.current = card;
    currentCallerRef.current = caller;
    if (connection) connection.send({ type: 'card', card, caller });
    else { setActiveCaller(caller); setLastCaller(caller); setCallAnswered(false); setActiveCard(card); setLastCard(card); }
  };
  const hostMessage = (connection: DataConnection, payload: any) => {
    if (payload?.type === 'join') {
      const nextPlayers = playersRef.current.includes(payload.name) ? playersRef.current : [...playersRef.current, payload.name];
      const nextAvatars = { ...avatarsRef.current, [payload.name]: payload.avatar || '☎️' };
      setPlayers(nextPlayers); playersRef.current = nextPlayers; setAvatars(nextAvatars); avatarsRef.current = nextAvatars;
      broadcast({ type: 'lobby', players: nextPlayers, avatars: nextAvatars });
    }
    if (payload?.type === 'draw' && playersRef.current[turnRef.current] === payload.name && !busyRef.current) serveDraw(connection);
    if (payload?.type === 'finish' && busyRef.current) advanceTurn();
    if (payload?.type === 'power' && payload.name !== playersRef.current[turnRef.current] && busyRef.current && currentCardRef.current) {
      const card = currentCardRef.current;
      const caller = currentCallerRef.current;
      if (payload.power === 'hangup') {
        broadcast({ type: 'hungUp', by: payload.name });
        setMessage(`${payload.name} hung up the call!`); window.setTimeout(() => setMessage(null), 1800);
        advanceTurn();
      }
      if (payload.power === 'speakerphone') {
        broadcast({ type: 'reveal', card, caller, title: `${payload.name} put ${caller} on speakerphone!`, private: false });
        setReveal({ card, caller, title: `${payload.name} put ${caller} on speakerphone!`, private: false });
      }
      if (payload.power === 'secret') connection.send({ type: 'reveal', card, caller, title: 'Shh… your secret clue', private: true });
    }
    if (payload?.type === 'guess' && playersRef.current.includes(payload.name) && !eliminatedRef.current.includes(payload.name)) {
      if (payload.guess === secretAdmirer) finishGame(payload.name);
      else {
        const nextEliminated = [...eliminatedRef.current, payload.name];
        setEliminatedPlayers(nextEliminated); eliminatedRef.current = nextEliminated;
        broadcast({ type: 'guessWrong', name: payload.name, guess: payload.guess, eliminated: nextEliminated });
        if (!busyRef.current && playersRef.current[turnRef.current] === payload.name) advanceTurn();
      }
    }
  };
  const clientMessage = (payload: any) => {
    if (payload?.type === 'lobby') { setPlayers(payload.players); setAvatars(payload.avatars || {}); }
    if (payload?.type === 'start') { setPlayers(payload.players); setAvatars(payload.avatars || {}); setTurnIndex(payload.currentTurn); setDeckCount(payload.deckCount); setTurnBusy(false); setGameFinished(false); setGameWinner(''); setEliminated(false); setEliminatedPlayers([]); eliminatedRef.current = []; setUsedPowers({ hangup: false, speakerphone: false, secret: false }); setReveal(null); setScreen('game'); }
    if (payload?.type === 'turn') { setTurnIndex(payload.currentTurn); setTurnBusy(payload.busy); setDeckCount(payload.deckCount); }
    if (payload?.type === 'card') { setActiveCaller(payload.caller); setLastCaller(payload.caller); setCallAnswered(false); setActiveCard(payload.card); setLastCard(payload.card); }
    if (payload?.type === 'gameOver') { setGameWinner(payload.winner || ''); setGameFinished(true); }
    if (payload?.type === 'guessWrong') { if (payload.name === name) setEliminated(true); const nextEliminated = payload.eliminated || [...eliminatedRef.current, payload.name]; setEliminatedPlayers(nextEliminated); eliminatedRef.current = nextEliminated; setMessage(`${payload.name} guessed ${payload.guess} and is out!`); window.setTimeout(() => setMessage(null), 2600); }
    if (payload?.type === 'hungUp') { setActiveCard(null); setCallAnswered(false); setMessage(`${payload.by} hung up the call!`); window.setTimeout(() => setMessage(null), 1800); }
    if (payload?.type === 'reveal') setReveal({ card: payload.card, caller: payload.caller, title: payload.title, private: Boolean(payload.private) });
  };
  const createHostRoom = () => {
    setIsHost(true);
    const peer = new Peer(`dream-phone-${roomCode.toLowerCase()}`);
    peerRef.current = peer;
    peer.on('open', () => setScreen('hostWaiting'));
    peer.on('connection', (connection) => {
      connections.current.set(connection.peer, connection);
      connection.on('data', (payload) => hostMessage(connection, payload));
      connection.on('close', () => connections.current.delete(connection.peer));
    });
    peer.on('error', () => {});
  };
  const joinHostRoom = () => {
    setIsHost(false); setRoomCode(joinCode.trim().toUpperCase());
    const peer = new Peer(); peerRef.current = peer;
    peer.on('open', () => {
      const connection = peer.connect(`dream-phone-${joinCode.trim().toLowerCase()}`);
      hostConnection.current = connection;
      connection.on('open', () => { connection.send({ type: 'join', name: name.trim(), avatar }); setScreen('joinWaiting'); });
      connection.on('data', clientMessage);
      connection.on('error', () => {});
    });
    peer.on('error', () => {});
  };
  const joinAsHost = () => {
    const hostName = name.trim() || 'Host';
    const nextPlayers = [hostName, ...playersRef.current.filter((player) => player !== hostName)];
    const nextAvatars = { ...avatarsRef.current, [hostName]: avatar };
    setName(hostName); setHostJoined(true); setPlayers(nextPlayers); playersRef.current = nextPlayers; setAvatars(nextAvatars); avatarsRef.current = nextAvatars; broadcast({ type: 'lobby', players: nextPlayers, avatars: nextAvatars });
  };
  const drawCount = clueCards.length - deckCount;
  const begin = () => {
    const shuffled = [...clueCards].sort(() => Math.random() - 0.5);
    setDeck(shuffled); deckRef.current = shuffled; setDeckCount(shuffled.length); setActiveCard(null); setLastCard(null); setCallAnswered(false); setActiveTab('deck'); setTurnIndex(0); turnRef.current = 0; setTurnBusy(false); setGameFinished(false); setGameWinner(''); setEliminated(false); setEliminatedPlayers([]); eliminatedRef.current = []; setNotes({}); setUsedPowers({ hangup: false, speakerphone: false, secret: false }); setReveal(null); setGuessResult(null); setScreen('game');
    broadcast({ type: 'start', players: playersRef.current, avatars: avatarsRef.current, currentTurn: 0, deckCount: shuffled.length });
  };
  const draw = () => {
    if (eliminated || turnBusy || players[turnIndex] !== name || !deckCount) return;
    if (isHost) serveDraw(); else hostConnection.current?.send({ type: 'draw', name });
  };
  const setNote = (item: string, state: NoteState) => setNotes((old) => ({ ...old, [item]: state }));
  const usePower = (power: PowerCard) => {
    if (eliminated || usedPowers[power] || !turnBusy || isMyTurn) return;
    setUsedPowers((old) => ({ ...old, [power]: true }));
    if (isHost && currentCardRef.current) {
      const card = currentCardRef.current;
      const caller = currentCallerRef.current;
      if (power === 'hangup') { broadcast({ type: 'hungUp', by: name }); setMessage('You hung up the call!'); window.setTimeout(() => setMessage(null), 1800); advanceTurn(); }
      if (power === 'speakerphone') { broadcast({ type: 'reveal', card, caller, title: `📣 ${name} put ${caller} on speakerphone!`, private: false }); setReveal({ card, caller, title: `📣 You put ${caller} on speakerphone!`, private: false }); }
      if (power === 'secret') setReveal({ card, caller, title: '🤫 Your private secret clue', private: true });
    }
    else hostConnection.current?.send({ type: 'power', power, name });
  };
  const makeGuess = (guessedName: string) => {
    if (eliminated || gameFinished) return;
    setGuessResult({ name: guessedName, correct: guessedName === secretAdmirer });
    if (isHost) {
      if (guessedName === secretAdmirer) finishGame(name);
      else {
        const nextEliminated = [...eliminatedRef.current, name];
        setEliminated(true); setEliminatedPlayers(nextEliminated); eliminatedRef.current = nextEliminated;
        broadcast({ type: 'guessWrong', name, guess: guessedName, eliminated: nextEliminated });
        if (!busyRef.current && playersRef.current[turnRef.current] === name) advanceTurn();
      }
    } else hostConnection.current?.send({ type: 'guess', name, guess: guessedName });
  };
  const shareCode = async () => {
    const link = `${window.location.origin}/dream-phone?room=${roomCode}`;
    await navigator.clipboard?.writeText(link);
    setMessage('Invite link copied!'); window.setTimeout(() => setMessage(null), 1800);
  };
  const joinLink = typeof window === 'undefined' ? '' : `${window.location.origin}/dream-phone?room=${roomCode}`;

  if (screen === 'home') return <main className="dream-app landing-page"><section className="landing"><div className="sparkles">✦ ✧ ✦</div><p className="eyebrow">A PHONE-CALL MYSTERY GAME</p><h1>DREAM <span>PHONE</span></h1><div className="phone-hero">☎</div><p className="intro">Pick up clue cards, take detective notes, and figure out the secret admirer.</p><div className="two-buttons"><button className="big-button" onClick={() => { setRoomCode(makeCode()); setHostJoined(false); setScreen('host'); }}>HOST</button><button className="big-button pink-button" onClick={() => setScreen('join')}>JOIN</button></div></section></main>;

  if (screen === 'host') return <main className="dream-app"><Lobby title="Host a game" subtitle="You will get a code to give the other players."><label>Your name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="YOUR NAME" maxLength={18} /></label><AvatarPicker avatar={avatar} onChange={setAvatar} /><button className="big-button" onClick={createHostRoom}>Create game</button><button className="back-button" onClick={() => setScreen('home')}>← Back</button></Lobby></main>;
  if (screen === 'join') return <main className="dream-app"><Lobby title="Join a game" subtitle="Ask the host for their five-letter game code."><label>Game code<input value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder="ABCDE" maxLength={5} /></label><label>Your name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="YOUR NAME" maxLength={18} /></label><AvatarPicker avatar={avatar} onChange={setAvatar} /><button className="big-button" disabled={joinCode.trim().length < 5 || !name.trim()} onClick={joinHostRoom}>Join game</button><button className="back-button" onClick={() => setScreen('home')}>← Back</button></Lobby></main>;
  if (screen === 'hostWaiting') return <main className="dream-app"><Lobby title="Waiting for players" subtitle="Share this code or have players scan the QR code."><div className="invite-with-qr"><div className="code-card"><span>GAME CODE</span><strong>{roomCode}</strong><button onClick={shareCode}>Copy invite</button></div><div><div className="qr-box"><QRCodeSVG value={joinLink} size={142} level="M" bgColor="#fff7fb" fgColor="#4b174e" includeMargin /></div><p className="qr-caption">SCAN TO JOIN</p></div></div><section className="player-room"><div className="room-title"><b>Players</b><span>{players.length} player{players.length === 1 ? '' : 's'}</span></div>{players.map((player, index) => <div className="player-slot filled" key={player}><i>☎</i><b>{player}</b>{index === 0 && <small>HOST</small>}</div>)}{Array.from({ length: Math.max(0, 5 - players.length) }, (_, index) => <div className="player-slot empty" key={index}><i>＋</i><span>Waiting for player…</span></div>)}</section>{!hostJoined ? <><label>Host player name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="YOUR NAME" maxLength={18} /></label><button className="big-button join-host" onClick={joinAsHost}>Join as Host</button></> : <button className="big-button" onClick={begin}>Start game →</button>}</Lobby></main>;
  if (screen === 'joinWaiting') return <main className="dream-app"><Lobby title="Waiting for host" subtitle={`You joined game ${roomCode}. The host will start when everyone is ready.`}><div className="waiting-phone">☎</div><p className="waiting-name">You are playing as <b>{name}</b></p><button className="back-button" onClick={() => setScreen('home')}>Leave game</button></Lobby></main>;

  const isMyTurn = !eliminated && players[turnIndex] === name;
  const currentPlayerName = players[turnIndex] || 'the current player';
  const turnName = `${avatars[currentPlayerName] || '☎️'} ${currentPlayerName}`;
  if (gameFinished) return <WinnerScreen winner={gameWinner} canPlayAgain={isHost} onPlayAgain={begin} onHome={() => setScreen('home')} />;
  return <main className="dream-app game-shell"><header className="game-header"><button className="brand" onClick={() => setScreen('home')}>☎ DREAM PHONE</button></header><section className="turn-banner"><b>{eliminated ? 'You are out of this game.' : isMyTurn && !turnBusy ? 'Your turn!' : `Wait for ${turnName} to finish.`}</b><span>{eliminated ? 'Keep watching to see who solves the mystery.' : isMyTurn && !turnBusy ? 'Draw a card when you are ready.' : 'You cannot see their clue or their Detective Notes.'}</span></section><section className="game-wrap"><nav className="tabs"><button className={activeTab === 'deck' ? 'active' : ''} onClick={() => setActiveTab('deck')}>☎ Draw pile <em>{drawCount}/24</em></button><button className={activeTab === 'notes' ? 'active' : ''} onClick={() => setActiveTab('notes')}>✎ Detective Notes</button><button className={activeTab === 'guess' ? 'active' : ''} onClick={() => setActiveTab('guess')}>♥ Guess</button></nav>{activeTab === 'deck' ? <section className="deck-screen"><div className="deck-copy"><p className="eyebrow">SECRET ADMIRER CARDS</p><h2>{eliminated ? 'You are out—keep watching!' : isMyTurn && !turnBusy ? 'Pick up the next card.' : `Wait for ${turnName} to finish.`}</h2><p>Only the player whose turn it is can see the next clue. Your Detective Notes are completely private.</p></div><div className="deck-zone"><button className="card-stack" onClick={draw} disabled={!deckCount || !isMyTurn || turnBusy} aria-label="Draw the next Secret Admirer card"><span className="stack stack-three"></span><span className="stack stack-two"></span><span className="top-card"><i>☎</i><b>SECRET<br/>ADMIRER</b><small>{deckCount ? isMyTurn && !turnBusy ? 'TAP TO DRAW' : 'WAIT' : 'ALL CALLED'}</small></span></button><p>{deckCount ? `${deckCount} cards left in the pile` : 'Every clue card has been drawn!'}</p></div></section> : activeTab === 'notes' ? <Notes notes={notes} onSet={setNote} lastCard={lastCard} lastCaller={lastCaller} /> : <GuessPanel result={guessResult} disabled={eliminated} onGuess={makeGuess} />}{turnBusy && !isMyTurn && !eliminated && <PowerCards used={usedPowers} onUse={usePower} />}</section>{reveal && <RevealCard reveal={reveal} onClose={() => setReveal(null)} />}{activeCard && <div className="overlay"><section className="clue-modal call-with-notes"><button className="close" onClick={finishTurn}>×</button><div className={`call-phone ${callAnswered ? 'answered' : ''}`}>☎</div><p className="eyebrow">{callAnswered ? activeCard.kind : 'INCOMING PHONE CALL'}</p>{callAnswered ? <><h2>{activeCaller} called!</h2><blockquote>“{activeCard.clue}”</blockquote><button className="listen-button" onClick={() => speak(activeCard.spoken)}>▶ Play phone call again</button><Notes notes={notes} onSet={setNote} lastCard={null} lastCaller="" compact /><button className="notes-link" onClick={finishTurn}>Finish turn →</button></> : <><h2>{activeCaller || 'Someone'} is calling…</h2><p className="answer-instruction">Hold your phone like a call, then tap Answer Call to hear the clue.</p><button className="answer-button" onClick={() => { setCallAnswered(true); speak(activeCard.spoken); }}>☎ Answer Call</button></>}</section></div>}{message && <div className="toast">{message}</div>}</main>;
}

function Lobby({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) { return <section className="lobby"><div className="sparkles">✦ ✧ ✦</div><p className="eyebrow">DREAM PHONE</p><h1>{title}</h1><p>{subtitle}</p><div className="lobby-fields">{children}</div></section>; }
function AvatarPicker({ avatar, onChange }: { avatar: string; onChange: (avatar: string) => void }) { return <section className="avatar-picker"><span>Choose your emoji</span><div>{avatarOptions.map((option) => <button key={option} type="button" className={avatar === option ? 'selected' : ''} aria-label={`Use ${option} as your profile emoji`} onClick={() => onChange(option)}>{option}</button>)}</div></section>; }
function WinnerScreen({ winner, canPlayAgain, onPlayAgain, onHome }: { winner: string; canPlayAgain: boolean; onPlayAgain: () => void; onHome: () => void }) {
  const guessedCorrectly = Boolean(winner);
  return <main className="dream-app landing-page"><section className="winner-screen"><div className="confetti" aria-hidden="true">✦　●　✦　◆　●　✦　◆　●　✦</div><p className="eyebrow">🥁 DRUMROLL... 🥁</p><h1>{guessedCorrectly ? 'YOU GOT\nIT!' : 'MYSTERY\nSOLVED!'}</h1>{guessedCorrectly && <p className="guess-winner">{winner} guessed it first!</p>}<p className="winner-label">THE SECRET ADMIRER IS</p><div className="winner-podium"><span>★</span><strong>{secretAdmirer}</strong><span>★</span></div><p>{guessedCorrectly ? 'You’re right! I really like you!' : 'Every clue has been revealed!'}</p>{canPlayAgain ? <button className="big-button" onClick={onPlayAgain}>Play Again</button> : <button className="big-button" onClick={onHome}>Back to Home</button>}</section></main>;
}
function GuessPanel({ result, disabled, onGuess }: { result: { name: string; correct: boolean } | null; disabled: boolean; onGuess: (name: string) => void }) {
  return <section className="guess-panel"><p className="eyebrow">MAKE YOUR MOVE</p><h2>Who is the secret admirer?</h2><p>Choose carefully—if you guess wrong, you are out of the game.</p>{disabled ? <div className="guess-result wrong"><b>You’re out!</b><span>Keep watching to see who solves the mystery.</span></div> : result ? <div className={`guess-result ${result.correct ? 'right' : 'wrong'}`}><b>{result.correct ? 'You’re right! I really like you!' : 'Nice try… but it’s not me!'}</b><span>{result.correct ? `${result.name} was the secret admirer.` : `${result.name} was not the secret admirer, so you are out.`}</span></div> : <div className="guess-grid">{guyNames.map((guy) => <button key={guy} type="button" onClick={() => onGuess(guy)}>{guy}</button>)}</div>}</section>
}
function PowerCards({ used, onUse }: { used: Record<PowerCard, boolean>; onUse: (power: PowerCard) => void }) {
  const cards: { id: PowerCard; title: string; text: string; icon: string; tone: string }[] = [
    { id: 'hangup', title: 'Mom Says Hang Up', text: 'End this call now.', icon: '☎', tone: 'hangup' },
    { id: 'speakerphone', title: 'Speakerphone', text: 'Show this clue to everyone.', icon: '📣', tone: 'speaker' },
    { id: 'secret', title: 'Share a Secret', text: 'See this clue just for you.', icon: '🤫', tone: 'secret' },
  ];
  return <section className="power-cards"><div><p className="eyebrow">PHONE POWERS</p><h3>Someone else is on the phone…</h3><p>Each card works once per game.</p></div><div className="power-card-row">{cards.map((card) => <button key={card.id} type="button" disabled={used[card.id]} className={`power-card ${card.tone} ${used[card.id] ? 'used' : ''}`} onClick={() => onUse(card.id)}><i>{used[card.id] ? '✓' : card.icon}</i><b>{card.title}</b><small>{used[card.id] ? 'USED' : card.text}</small></button>)}</div></section>;
}
function RevealCard({ reveal, onClose }: { reveal: Reveal; onClose: () => void }) {
  return <div className="reveal-overlay"><section className="reveal-card"><p className="eyebrow">{reveal.private ? 'PRIVATE PHONE POWER' : 'SPEAKERPHONE'}</p><div className="reveal-icon">{reveal.private ? '🤫' : '📣'}</div><h2>{reveal.title}</h2><p className="caller-name">{reveal.caller} says:</p><blockquote>“{reveal.card.clue}”</blockquote><button className="big-button" onClick={onClose}>Got it</button></section></div>;
}
function Notes({ notes, onSet, lastCard, lastCaller, compact = false }: { notes: Record<string, NoteState>; onSet: (item: string, state: NoteState) => void; lastCard: ClueCard | null; lastCaller: string; compact?: boolean }) {
  return <section className={`notes-screen ${compact ? 'compact-notes' : ''}`}>{!compact && <div className="notes-title"><div><p className="eyebrow">YOUR CHECKLIST</p><h2>Detective Notes</h2><p>Tap any name or clue to cross it out. Tap it again to undo it. Your notes never show on anyone else’s screen.</p></div></div>}{lastCard && <section className="notes-clue"><p>YOUR LAST PRIVATE CARD · {lastCaller} CALLED</p><b>“{lastCard.clue}”</b></section>}<div className="note-grid">{noteGroups.map((group) => <section className="note-group" key={group.label}><h3>{group.label}</h3>{group.items.map((item) => { const noteKey = `${group.label}:${item}`; const crossed = notes[noteKey] === 'crossed'; return <button key={item} type="button" className={`note-item ${crossed ? 'crossed' : 'none'}`} aria-pressed={crossed} onClick={() => onSet(noteKey, crossed ? 'none' : 'crossed')}><span>{item}</span></button>; })}</section>)}</div><GuyGuide notes={notes} onSet={onSet} embedded /></section>;
}

function GuyGuide({ notes, onSet, embedded = false }: { notes: Record<string, NoteState>; onSet: (item: string, state: NoteState) => void; embedded?: boolean }) {
  const sections = [
    { title: '📍 Places', values: hangouts, key: 'hangout' as const, prompt: 'Who hangs out here?' },
    { title: '🍬 Food', values: foods, key: 'food' as const, prompt: 'Who eats this?' },
    { title: '★ Sports', values: sports, key: 'sport' as const, prompt: 'Who likes this?' },
    { title: '👕 Clothing', values: outfits, key: 'outfit' as const, prompt: 'Who is wearing this?' },
  ];
  return <section className={embedded ? 'guide-in-notes' : 'guide-screen'}><div className="notes-title"><div><p className="eyebrow">THE DREAM PHONE BOARD</p><h2>Guy Guide</h2><p>Open any option to see the guys who match it. Tap a name to cross that person off your <b>Secret Admirer</b> notes.</p></div></div><div className="guide-groups">{sections.map((section) => <section className="guide-group" key={section.title}><h3>{section.title}</h3>{section.values.map((value) => <details key={value}><summary>{value}<span>⌄</span></summary><p>{section.prompt}</p><div className="matching-guys">{guyProfiles.filter((guy) => guy[section.key] === value).map((guy) => { const noteKey = `Secret Admirer:${guy.name}`; const crossed = notes[noteKey] === 'crossed'; return <button type="button" className={`guide-guy ${crossed ? 'crossed' : ''}`} key={guy.name} aria-pressed={crossed} onClick={() => onSet(noteKey, crossed ? 'none' : 'crossed')}>{guy.name}</button>; })}</div></details>)}</section>)}</div></section>
}

const styles = `
:root{font-family:Fredoka,system-ui,sans-serif;background:#35104d;color:#fff8f5}*{box-sizing:border-box}button,input{font:inherit}button{cursor:pointer}button:disabled{opacity:.48;cursor:not-allowed}.dream-app{min-height:100vh;padding:24px;background:radial-gradient(circle at 20% 12%,#a356c6 0,transparent 27rem),radial-gradient(circle at 86% 88%,#fa8eb5 0,transparent 30rem),#35104d;color:#fff8f5}.landing-page{display:grid;place-items:center}.landing,.lobby{width:min(500px,100%);text-align:center}.sparkles{color:#ffdd6f;font-size:22px;letter-spacing:9px}.eyebrow{color:#ffcf56;font:500 11px 'DM Mono',monospace;letter-spacing:.13em;margin:15px 0 7px}.landing h1,.lobby h1{font-size:clamp(56px,12vw,100px);line-height:.83;letter-spacing:-.055em;margin:0;text-shadow:4px 5px 0 #ed5f9f;transform:rotate(-2deg)}.landing h1 span{display:block;color:#ffcd53;text-shadow:4px 5px 0 #a83575}.phone-hero{font-size:104px;color:#ff4c9b;transform:rotate(-18deg);filter:drop-shadow(8px 10px 0 #7b1d62);margin:5px 0 2px}.intro,.lobby>p{line-height:1.45;font-size:17px;color:#ffe7ef;margin:20px auto}.two-buttons{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:25px}.big-button,.back-button{border:0;border-radius:15px;background:#ffcd53;color:#421347;font-weight:700;padding:15px 19px;box-shadow:0 5px 0 #b66055;transition:transform .16s}.big-button:hover:not(:disabled){transform:translateY(-2px)}.pink-button{background:#e64c97;color:#fff;box-shadow:0 5px 0 #a22965}.lobby{min-height:calc(100vh - 48px);margin:auto;display:flex;flex-direction:column;justify-content:center}.lobby h1{font-size:clamp(42px,9vw,72px);text-shadow:3px 4px 0 #ed5f9f}.lobby-fields{display:grid;gap:12px;text-align:left;margin-top:10px}.lobby label{color:#ffe5f1;font-size:13px;font-weight:600}.lobby input{display:block;width:100%;margin-top:7px;border:0;border-radius:10px;background:#fff;color:#52144d;padding:13px;letter-spacing:.08em;font:500 14px 'DM Mono',monospace}.lobby-fields>.big-button{text-align:center}.back-button{background:transparent;color:#f4d5e6;box-shadow:none;padding:8px;text-align:center}.code-card{padding:20px;border:2px dashed #ffcc64;border-radius:17px;background:#ffffff15;text-align:center}.code-card span{display:block;font:10px 'DM Mono',monospace;letter-spacing:.13em;color:#fbd7ed}.code-card strong{display:block;color:#ffcf56;font:700 43px 'DM Mono',monospace;letter-spacing:.13em;margin:7px}.code-card button{border:0;border-radius:9px;background:#e44a94;color:#fff;padding:8px 13px;font-weight:700}.host-note,.waiting-name{text-align:center!important;margin:2px!important;color:#f5d4e6!important;font-size:14px!important}.waiting-phone{font-size:100px;color:#ffcf56;text-align:center;transform:rotate(-14deg);filter:drop-shadow(6px 7px 0 #8a296d)}
.player-room{display:grid;gap:7px;padding:14px;border:1px solid #ffffff36;border-radius:17px;background:#ffffff12}.room-title{display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;color:#fff0f8}.room-title span{color:#e6b9d6;font:10px 'DM Mono',monospace}.player-slot{display:flex;align-items:center;gap:10px;min-height:39px;padding:8px 10px;border-radius:10px;background:#ffffff12;color:#edcfe1}.player-slot i{width:24px;height:24px;display:grid;place-items:center;border-radius:50%;font-style:normal;background:#ffffff1e;color:#f6cae3}.player-slot small{margin-left:auto;color:#ffcf56;font:10px 'DM Mono',monospace;letter-spacing:.08em}.player-slot.filled{background:#fbd758;color:#51204f}.player-slot.filled i{background:#e74c97;color:#fff}.player-slot.empty{opacity:.75}.join-host{background:#6bd3bd;box-shadow:0 5px 0 #308e82}
.game-shell{padding:18px}.game-header{max-width:1080px;margin:auto;display:flex;justify-content:space-between;align-items:center;gap:14px}.brand{color:#fff;border:0;background:transparent;font-weight:700;font-size:21px;letter-spacing:-.03em}.room-pill{display:flex;align-items:center;gap:9px;background:#ffffff1a;border:1px solid #ffffff2c;border-radius:99px;padding:6px 7px 6px 13px}.room-pill span{color:#f8d2ed;font:10px 'DM Mono',monospace;letter-spacing:.07em}.room-pill strong{color:#ffce55;letter-spacing:.09em}.room-pill button{border:0;color:#fff;background:#d6418a;border-radius:99px;padding:7px 10px;font-size:12px}.game-wrap{max-width:1080px;margin:18px auto}.tabs{display:flex;gap:9px;margin-bottom:13px}.tabs button{border:0;border-radius:99px;background:#ffffff1c;color:#f9dce9;padding:10px 15px;font-weight:600}.tabs button.active{background:#ffcf56;color:#4b174e}.tabs em{font-style:normal;font:10px 'DM Mono',monospace;margin-left:6px}.deck-screen,.notes-screen{min-height:590px;border-radius:23px;background:#fff7f7;color:#44224e;box-shadow:0 12px 0 #210b34;padding:clamp(25px,5vw,60px)}.deck-screen{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:40px}.deck-copy h2,.notes-title h2,.clue-modal h2{font-size:clamp(33px,5vw,53px);line-height:.95;letter-spacing:-.055em;margin:0}.deck-copy .eyebrow,.notes-title .eyebrow,.clue-modal .eyebrow{color:#b14c7f}.deck-copy>p:last-child{color:#795777;line-height:1.5;max-width:360px}.deck-zone{text-align:center;color:#8d6684}.card-stack{position:relative;width:208px;height:278px;margin:auto;border:0;background:transparent;transform:rotate(-3deg);transition:transform .18s}.card-stack:hover:not(:disabled){transform:rotate(1deg) translateY(-7px)}.stack,.top-card{position:absolute;inset:0;border-radius:18px}.stack{background:#813078;border:2px solid #ffbdde}.stack-two{transform:rotate(5deg) translate(10px,7px);background:#62206f}.stack-three{transform:rotate(-5deg) translate(-9px,10px);background:#a33484}.top-card{z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(155deg,#e74c97,#7a287d);border:3px solid #ffdfa0;color:#fff;box-shadow:inset 0 0 0 4px #ffffff39,0 8px 0 #5a1e68}.top-card i{font-size:56px;font-style:normal;transform:rotate(-12deg)}.top-card b{font-size:24px;line-height:.9;margin:12px 0;letter-spacing:-.05em}.top-card small{font:10px 'DM Mono',monospace;letter-spacing:.1em}.deck-zone>p{font-size:13px;margin-top:22px}.notes-title{display:flex;justify-content:space-between;align-items:flex-end;gap:20px}.notes-title h2{font-size:42px}.notes-title>div>p:last-child{color:#805a79;margin:9px 0 0;font-size:13px}.note-key{display:flex;gap:8px;flex-wrap:wrap}.note-key span{padding:6px 9px;border-radius:99px;background:#f2e2ed;color:#a45580;font-size:11px}.note-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:15px;margin-top:28px}.note-group{border:1px solid #ead9e6;border-radius:13px;padding:13px}.note-group h3{font-size:16px;margin:0 0 9px;color:#743766}.note-item{display:flex;align-items:center;width:100%;border:0;background:transparent;color:#553151;padding:5px 3px;text-align:left;font-size:14px}.note-item i{display:inline-grid;place-items:center;width:24px;height:21px;margin-right:5px;font-style:normal;font-size:23px;color:#dc438d}.note-item.circled{font-weight:700;color:#6b287e}.note-item.circled i{border:2px solid #7d3dbb;border-radius:50%;font-size:0}.note-item.crossed{color:#b693ab;text-decoration:line-through}.note-item.crossed i{font-size:22px}.overlay{position:fixed;inset:0;z-index:5;display:grid;place-items:center;padding:20px;background:#1e082ddd}.clue-modal{position:relative;max-width:470px;width:100%;padding:38px;text-align:center;color:#4a214e;background:#fff7f7;border-radius:25px;box-shadow:0 14px 0 #12061e}.close{position:absolute;right:13px;top:11px;background:transparent;border:0;color:#a35980;font-size:30px}.call-phone{width:72px;height:72px;display:grid;place-items:center;margin:auto;border-radius:50%;background:#f85ba4;color:#fff;font-size:40px;transform:rotate(-13deg)}.clue-modal blockquote{padding:18px;margin:22px 0 14px;background:#f4e4ee;border-radius:15px;font-size:20px;font-weight:500;line-height:1.25}.listen-button,.notes-link{border:0;border-radius:11px;padding:11px 14px;font-weight:600}.listen-button{color:#fff;background:#754caa}.notes-link{display:block;margin:11px auto 0;background:transparent;color:#b13c77}.toast{position:fixed;bottom:26px;left:50%;z-index:12;transform:translateX(-50%);padding:13px 18px;border-radius:99px;background:#ffcf55;color:#562148;font-weight:700;box-shadow:0 5px 0 #b96a55}
.guide-screen{min-height:590px;border-radius:23px;background:#fff7f7;color:#44224e;box-shadow:0 12px 0 #210b34;padding:clamp(25px,5vw,52px)}.guide-in-notes{margin-top:28px;padding-top:25px;border-top:2px dashed #e6cddd}.guide-groups{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin-top:25px}.guide-group{padding:15px;border:1px solid #edd6e5;border-radius:15px;background:#fff}.guide-group h3{margin:0 0 9px;color:#743766;font-size:20px}.guide-group details{border-top:1px solid #f0e3e9}.guide-group summary{list-style:none;display:flex;justify-content:space-between;align-items:center;padding:11px 2px;cursor:pointer;color:#512e50;font-weight:600}.guide-group summary::-webkit-details-marker{display:none}.guide-group details[open] summary{color:#be3e85}.guide-group summary span{font-size:18px}.guide-group details p{margin:0;color:#9b6e8a;font-size:11px}.matching-guys{display:flex;flex-wrap:wrap;gap:6px;padding:8px 0 11px}.guide-guy{border:0;padding:5px 8px;border-radius:99px;background:#f8d8e9;color:#792c64;font-size:12px;font-weight:700}.guide-guy.crossed{opacity:.55;text-decoration:line-through}.call-with-notes{max-width:760px;max-height:calc(100vh - 28px);overflow:auto}.compact-notes{min-height:0;box-shadow:none;border-radius:16px;margin-top:22px;padding:22px;background:#fff}.compact-notes .note-grid{grid-template-columns:repeat(2,1fr);margin-top:0}.compact-notes .guide-groups{grid-template-columns:repeat(2,1fr)}@media(max-width:720px){.dream-app{padding:12px}.game-header{align-items:flex-start}.brand{font-size:16px}.room-pill span{display:none}.deck-screen{grid-template-columns:1fr;padding:35px 20px;min-height:0}.deck-copy{text-align:center}.deck-copy>p:last-child{margin:16px auto}.deck-zone{order:-1}.notes-screen{padding:27px 16px}.notes-title{align-items:flex-start;display:block}.note-key{margin-top:14px}.note-grid{grid-template-columns:repeat(2,1fr);gap:9px}.note-group{padding:10px}.note-item{font-size:13px}.card-stack{transform:scale(.88)}.deck-zone>p{margin-top:-5px}.tabs{overflow:auto}.tabs button{white-space:nowrap}.two-buttons{margin-top:18px}.guide-groups{grid-template-columns:1fr;gap:10px}.guide-screen{padding:26px 14px}.guide-group{padding:12px}.compact-notes{padding:15px}.compact-notes .guide-groups{grid-template-columns:1fr}}
`;

if (typeof document !== 'undefined' && !document.getElementById('dream-phone-styles')) { const tag = document.createElement('style'); tag.id = 'dream-phone-styles'; tag.textContent = `${styles}.note-item{font-weight:800;padding:7px 3px}.note-item.circled,.note-item.circled i{border:0;color:inherit}.turn-banner{max-width:1080px;margin:12px auto 0;padding:10px 14px;border-radius:13px;background:#ffffff19;color:#fff}.turn-banner b,.turn-banner span{display:block}.turn-banner span{margin-top:3px;color:#f7d9ea;font-size:13px}.avatar-picker{display:grid;gap:7px;color:#ffe5f1;font-size:13px;font-weight:600}.avatar-picker>div{display:flex;gap:7px;flex-wrap:wrap}.avatar-picker button{width:38px;height:38px;border:2px solid transparent;border-radius:11px;background:#ffffff19;font-size:21px}.avatar-picker button.selected{border-color:#ffcf56;background:#ffffff36}.winner-screen{width:min(540px,100%);text-align:center;padding:30px 20px}.winner-screen h1{font-size:clamp(55px,12vw,92px);line-height:.83;letter-spacing:-.06em;margin:8px 0;color:#fff;text-shadow:5px 6px 0 #ed5f9f;transform:rotate(-2deg)}.confetti{color:#ffcf56;font-size:26px;letter-spacing:3px;animation:party 1.2s ease-in-out infinite alternate}.winner-label{color:#ffdd6f;font:700 12px 'DM Mono',monospace;letter-spacing:.16em;margin:27px 0 8px}.winner-podium{display:flex;align-items:end;justify-content:center;gap:18px;margin:auto;min-height:150px}.winner-podium strong{display:grid;place-items:center;min-width:240px;min-height:122px;padding:20px;background:linear-gradient(160deg,#ffdb63,#e79836);color:#4b174e;border-radius:22px 22px 7px 7px;box-shadow:0 11px 0 #a95065;font-size:clamp(38px,9vw,66px);letter-spacing:-.06em}.winner-podium span{font-size:39px;color:#ffdd6f;transform:translateY(-44px)}.winner-screen>p:last-of-type{font-size:18px;color:#ffe4ef;margin:27px 0 18px}@keyframes party{to{transform:translateY(-7px) rotate(4deg)}}`; document.head.appendChild(tag); }
