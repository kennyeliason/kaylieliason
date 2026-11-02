import { getStore } from '@netlify/blobs';

const store = getStore('sidequest-rooms', { consistency: 'strong' });
const CODE = /^[A-HJ-NP-Z2-9]{4}$/;
const WORDS = [['Movie Night', 'Popcorn'], ['Summer', 'Watermelon'], ['School', 'Backpack'], ['Carnival', 'Ferris Wheel'], ['Breakfast', 'Pancakes'], ['Ocean', 'Dolphin'], ['Sleepover', 'Pillow Fight'], ['Candy', 'Gummy Bears'], ['Space', 'Astronaut'], ['Vacation', 'Suitcase'], ['Music', 'Headphones'], ['Sports', 'Roller Skates']];
const cleanName = (value) => String(value ?? '').replace(/[^\p{L}\p{N} ._-]/gu, '').trim().slice(0, 18);
const code = () => Array.from({ length: 4 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('');
const reply = (status, body) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
const scores = (room) => room.players.map((player) => ({ name: player.name, score: room.scores[player.token] || 0 }));

function startRound(room) {
  const card = WORDS[Math.floor(Math.random() * WORDS.length)];
  room.category = card[0]; room.word = card[1]; room.chameleonToken = room.players[Math.floor(Math.random() * room.players.length)].token;
  room.phase = 'clue'; room.turnIndex = 0; room.votes = {}; room.voteDeadline = null; delete room.accused; delete room.caught; delete room.correctVotes;
}
function finishVote(room) {
  if (room.phase !== 'vote') return;
  const counts = {}; Object.values(room.votes).forEach((choice) => { counts[choice] = (counts[choice] || 0) + 1; });
  room.accused = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Nobody';
  const chameleon = room.players.find((player) => player.token === room.chameleonToken)?.name;
  room.correctVotes = Object.entries(room.votes).filter(([, choice]) => choice === chameleon).map(([token]) => token);
  room.caught = room.correctVotes.length >= 3;
  if (room.caught) room.correctVotes.forEach((token) => { room.scores[token] = (room.scores[token] || 0) + 1; });
  else room.scores[room.chameleonToken] = (room.scores[room.chameleonToken] || 0) + 1;
  room.phase = room.round >= 5 ? 'final-results' : 'round-results'; room.voteDeadline = null;
}
function view(room, token) {
  const player = room.players.find((entry) => entry.token === token);
  const result = { code: room.code, phase: room.phase, round: room.round, category: room.category, players: room.players.map(({ name, token: playerToken }) => ({ name, host: playerToken === room.hostToken, score: room.scores[playerToken] || 0 })), isHost: token === room.hostToken, me: player ? { name: player.name, role: token === room.chameleonToken ? 'chameleon' : 'player' } : null, currentPlayer: room.phase === 'clue' ? room.players[room.turnIndex]?.name : null, clueNumber: room.phase === 'clue' ? room.turnIndex + 1 : null, voteCount: Object.keys(room.votes).length, voteDeadline: room.voteDeadline, scores: scores(room) };
  if (room.phase === 'clue' && token !== room.chameleonToken) result.word = room.word;
  if (['round-results', 'final-results'].includes(room.phase)) Object.assign(result, { word: room.word, chameleon: room.players.find((entry) => entry.token === room.chameleonToken)?.name, accused: room.accused, caught: room.caught, correctVote: room.correctVotes?.includes(token) || false });
  return result;
}

export default async (request) => {
  try {
    const url = new URL(request.url);
    if (request.method === 'GET') {
      const roomCode = url.searchParams.get('code')?.toUpperCase(); const token = url.searchParams.get('token'); if (!roomCode || !CODE.test(roomCode) || !token) return reply(400, { error: 'Room details are missing.' });
      const room = await store.get(`room:${roomCode}`, { type: 'json' }); if (!room) return reply(404, { error: 'That room is gone. Check the code.' });
      if (room.phase === 'vote' && Date.now() >= room.voteDeadline) { finishVote(room); await store.setJSON(`room:${roomCode}`, room); }
      return reply(200, { room: view(room, token) });
    }
    if (request.method !== 'POST') return reply(405, { error: 'Use GET or POST.' }); const { action, roomCode: rawCode, token, name, target } = await request.json(); const playerName = cleanName(name);
    if (action === 'create') {
      if (!playerName || !token) return reply(400, { error: 'Add your name first.' }); let roomCode = code(); while (await store.get(`room:${roomCode}`)) roomCode = code();
      const room = { code: roomCode, hostToken: token, phase: 'lobby', round: 0, players: [{ token, name: playerName }], scores: { [token]: 0 }, votes: {}, updatedAt: Date.now() };
      await store.setJSON(`room:${roomCode}`, room); return reply(200, { room: view(room, token) });
    }
    const roomCode = String(rawCode ?? '').toUpperCase(); if (!CODE.test(roomCode) || !token) return reply(400, { error: 'Room code or player info is missing.' }); const room = await store.get(`room:${roomCode}`, { type: 'json' }); if (!room) return reply(404, { error: 'That room is gone. Check the code.' });
    if (room.phase === 'vote' && Date.now() >= room.voteDeadline) finishVote(room);
    if (action === 'join') { if (!playerName) return reply(400, { error: 'Add your name first.' }); if (room.phase !== 'lobby') return reply(409, { error: 'That game already started.' }); const existing = room.players.find((entry) => entry.token === token); if (existing) existing.name = playerName; else if (room.players.some((entry) => entry.name.toLowerCase() === playerName.toLowerCase())) return reply(409, { error: 'That name is already in the room.' }); else if (room.players.length >= 8) return reply(409, { error: 'That room is full.' }); else { room.players.push({ token, name: playerName }); room.scores[token] = 0; } }
    else if (action === 'start') { if (room.hostToken !== token || room.players.length < 3) return reply(403, { error: 'Chameleon needs at least three players.' }); room.round = 1; room.scores = Object.fromEntries(room.players.map((player) => [player.token, 0])); startRound(room); }
    else if (action === 'share-clue') { if (room.phase !== 'clue' || room.players[room.turnIndex]?.token !== token) return reply(403, { error: 'Wait for your clue turn.' }); room.turnIndex += 1; if (room.turnIndex >= room.players.length) { room.phase = 'vote'; room.voteDeadline = Date.now() + 60_000; } }
    else if (action === 'vote') { if (room.phase !== 'vote' || Date.now() >= room.voteDeadline || !room.players.some((entry) => entry.token === token) || !room.players.some((entry) => entry.name === target)) return reply(403, { error: 'Voting is closed.' }); room.votes[token] = target; if (Object.keys(room.votes).length === room.players.length) finishVote(room); }
    else if (action === 'next-round') { if (room.hostToken !== token || room.phase !== 'round-results') return reply(403, { error: 'Only the host can start the next round.' }); room.round += 1; startRound(room); }
    else if (action === 'new-game') { if (room.hostToken !== token) return reply(403, { error: 'Only the host can start a new game.' }); room.phase = 'lobby'; room.round = 0; room.votes = {}; room.scores = Object.fromEntries(room.players.map((player) => [player.token, 0])); delete room.word; delete room.category; delete room.chameleonToken; delete room.accused; }
    else return reply(400, { error: 'Unknown room action.' });
    room.updatedAt = Date.now(); await store.setJSON(`room:${roomCode}`, room); return reply(200, { room: view(room, token) });
  } catch { return reply(500, { error: 'The room hiccupped. Try again.' }); }
};
