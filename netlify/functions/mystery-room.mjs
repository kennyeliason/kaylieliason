import { getStore } from '@netlify/blobs';

const store = getStore('mystery-mansion-rooms', { consistency: 'strong' });
const CODE = /^[A-HJ-NP-Z2-9]{4}$/;
const characters = [
  { id: 'scarlet', name: 'Scarlet Rose', icon: '🌹', color: '#d83a52' },
  { id: 'jade', name: 'Jade Green', icon: '💚', color: '#16835e' },
  { id: 'peacock', name: 'Azure Peacock', icon: '🦚', color: '#1777bd' },
  { id: 'mustard', name: 'Gold Mustard', icon: '💛', color: '#b87900' },
  { id: 'plum', name: 'Violet Plum', icon: '🍇', color: '#733b8f' },
  { id: 'slate', name: 'Gray Slate', icon: '🕵️', color: '#596573' },
];
const rooms = ['Ballroom', 'Library', 'Conservatory', 'Dining Room', 'Observatory', 'Gallery', 'Kitchen', 'Lounge', 'Study'];
const items = ['Brass Key', 'Silk Rope', 'Crystal Candle', 'Silver Spoon', 'Garden Shears', 'Pocket Watch'];
const cleanName = (value) => String(value ?? '').replace(/[^\p{L}\p{N} ._-]/gu, '').trim().slice(0, 18);
const makeCode = () => Array.from({ length: 4 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('');
const reply = (status, body) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
const shuffle = (list) => [...list].sort(() => Math.random() - 0.5);
const card = (type, value) => ({ id: `${type}:${value}`, type, value });

function advanceTurn(room) {
  let steps = 0;
  do {
    room.turnIndex = (room.turnIndex + 1) % room.players.length;
    steps += 1;
  } while (room.eliminated.includes(room.players[room.turnIndex].token) && steps < room.players.length);
  if (steps >= room.players.length && room.eliminated.includes(room.players[room.turnIndex].token)) room.phase = 'case-closed';
}

function startGame(room) {
  room.solution = {
    character: characters[Math.floor(Math.random() * characters.length)].name,
    room: rooms[Math.floor(Math.random() * rooms.length)],
    item: items[Math.floor(Math.random() * items.length)],
  };
  const deck = shuffle([
    ...characters.filter((entry) => entry.name !== room.solution.character).map((entry) => card('character', entry.name)),
    ...rooms.filter((entry) => entry !== room.solution.room).map((entry) => card('room', entry)),
    ...items.filter((entry) => entry !== room.solution.item).map((entry) => card('item', entry)),
  ]);
  room.hands = Object.fromEntries(room.players.map((player) => [player.token, []]));
  deck.forEach((entry, index) => room.hands[room.players[index % room.players.length].token].push(entry));
  room.phase = 'turn'; room.turnIndex = 0; room.eliminated = []; room.log = ['The case has begun. Keep your cards secret.'];
  delete room.suggestion; delete room.refuterToken; delete room.shownCard; delete room.winnerToken;
}

function findRefuter(room, suggestion) {
  for (let offset = 1; offset < room.players.length; offset += 1) {
    const player = room.players[(room.turnIndex + offset) % room.players.length];
    if (room.eliminated.includes(player.token)) continue;
    const hasCard = room.hands[player.token]?.some((entry) => [suggestion.character, suggestion.room, suggestion.item].includes(entry.value));
    if (hasCard) return player.token;
  }
  return null;
}

function view(room, token) {
  const player = room.players.find((entry) => entry.token === token);
  const mine = room.hands?.[token] || [];
  const result = {
    code: room.code, phase: room.phase, players: room.players.map((entry) => ({ name: entry.name, character: entry.character, host: entry.token === room.hostToken, eliminated: room.eliminated?.includes(entry.token) || false })),
    isHost: token === room.hostToken, me: player ? { name: player.name, character: player.character } : null,
    hand: mine, currentPlayer: room.players[room.turnIndex]?.name, isMyTurn: room.players[room.turnIndex]?.token === token,
    suggestion: room.suggestion, isRefuter: room.refuterToken === token, revealedCard: room.shownCard?.to === token ? room.shownCard.card : null,
    winner: room.players.find((entry) => entry.token === room.winnerToken)?.name || null, solution: room.phase === 'case-closed' ? room.solution : null,
    log: room.log?.slice(-5) || [], characters, rooms, items,
  };
  return result;
}

export default async (request) => {
  try {
    const url = new URL(request.url);
    if (request.method === 'GET') {
      const roomCode = url.searchParams.get('code')?.toUpperCase(); const token = url.searchParams.get('token');
      if (!roomCode || !CODE.test(roomCode) || !token) return reply(400, { error: 'Room details are missing.' });
      const room = await store.get(`room:${roomCode}`, { type: 'json' });
      if (!room) return reply(404, { error: 'That room is gone. Check the code.' });
      return reply(200, { room: view(room, token) });
    }
    if (request.method !== 'POST') return reply(405, { error: 'Use GET or POST.' });
    const { action, roomCode: rawCode, token, name, character, suggestion, shownCard, accusation } = await request.json();
    const playerName = cleanName(name);
    if (action === 'create') {
      if (!playerName || !token) return reply(400, { error: 'Add your name first.' });
      let roomCode = makeCode(); while (await store.get(`room:${roomCode}`)) roomCode = makeCode();
      const room = { code: roomCode, hostToken: token, phase: 'lobby', players: [{ token, name: playerName, character: characters[0] }], hands: {}, eliminated: [], log: [] };
      await store.setJSON(`room:${roomCode}`, room); return reply(200, { room: view(room, token) });
    }
    const roomCode = String(rawCode ?? '').toUpperCase();
    if (!CODE.test(roomCode) || !token) return reply(400, { error: 'Room code or player info is missing.' });
    const room = await store.get(`room:${roomCode}`, { type: 'json' });
    if (!room) return reply(404, { error: 'That room is gone. Check the code.' });
    const me = room.players.find((entry) => entry.token === token);
    if (action === 'join') {
      if (!playerName || room.phase !== 'lobby') return reply(409, { error: room.phase !== 'lobby' ? 'That mystery has already started.' : 'Add your name first.' });
      if (me) me.name = playerName;
      else if (room.players.some((entry) => entry.name.toLowerCase() === playerName.toLowerCase())) return reply(409, { error: 'That name is already in the room.' });
      else if (room.players.length >= 6) return reply(409, { error: 'The mansion is full.' });
      else room.players.push({ token, name: playerName, character: characters[room.players.length] });
    } else if (!me) return reply(403, { error: 'You are not in this room.' });
    else if (action === 'choose-character') {
      if (room.phase !== 'lobby' || !characters.some((entry) => entry.id === character)) return reply(400, { error: 'Choose a character in the lobby.' });
      if (room.players.some((entry) => entry.token !== token && entry.character.id === character)) return reply(409, { error: 'That character is already taken.' });
      me.character = characters.find((entry) => entry.id === character);
    } else if (action === 'start') {
      if (room.hostToken !== token || room.players.length < 2) return reply(403, { error: 'You need at least two detectives.' });
      startGame(room);
    } else if (action === 'suggest') {
      if (room.phase !== 'turn' || room.players[room.turnIndex]?.token !== token || room.eliminated.includes(token)) return reply(403, { error: 'Wait for your turn.' });
      if (!suggestion || !characters.some((entry) => entry.name === suggestion.character) || !rooms.includes(suggestion.room) || !items.includes(suggestion.item)) return reply(400, { error: 'Choose a character, room, and item.' });
      room.suggestion = suggestion; room.refuterToken = findRefuter(room, suggestion); room.shownCard = null;
      room.log.push(`${me.name} suggested ${suggestion.character} in the ${suggestion.room} with the ${suggestion.item}.`);
      if (room.refuterToken) room.phase = 'refute'; else { room.log.push('Nobody could disprove it.'); delete room.suggestion; advanceTurn(room); }
    } else if (action === 'show-card') {
      if (room.phase !== 'refute' || room.refuterToken !== token) return reply(403, { error: 'Only the next detective with a matching card can show one.' });
      const matching = room.hands[token]?.find((entry) => entry.id === shownCard && [room.suggestion.character, room.suggestion.room, room.suggestion.item].includes(entry.value));
      if (!matching) return reply(400, { error: 'Show one matching card from your hand.' });
      const suggester = room.players[room.turnIndex]; room.shownCard = { to: suggester.token, card: matching }; room.log.push(`${me.name} secretly showed a card to ${suggester.name}.`); delete room.suggestion; delete room.refuterToken; advanceTurn(room); room.phase = 'turn';
    } else if (action === 'accuse') {
      if (room.phase !== 'turn' || room.players[room.turnIndex]?.token !== token || !accusation) return reply(403, { error: 'You can only accuse on your turn.' });
      const correct = accusation.character === room.solution.character && accusation.room === room.solution.room && accusation.item === room.solution.item;
      if (correct) { room.winnerToken = token; room.phase = 'case-closed'; room.log.push(`${me.name} solved the case!`); }
      else { room.eliminated.push(token); room.log.push(`${me.name} made a wrong accusation and is out of the case.`); advanceTurn(room); }
    } else if (action === 'new-game') {
      if (room.hostToken !== token) return reply(403, { error: 'Only the host can start a new case.' });
      room.phase = 'lobby'; room.eliminated = []; room.log = []; delete room.solution; delete room.winnerToken; delete room.suggestion; delete room.refuterToken; delete room.shownCard;
    } else return reply(400, { error: 'Unknown room action.' });
    room.updatedAt = Date.now(); await store.setJSON(`room:${roomCode}`, room); return reply(200, { room: view(room, token) });
  } catch { return reply(500, { error: 'The mansion lights flickered. Try again.' }); }
};
