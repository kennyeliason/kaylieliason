import { getStore } from '@netlify/blobs';

const store = getStore('sidequest-rooms');
const CODE = /^[A-HJ-NP-Z2-9]{4}$/;
const cleanName = (value) => String(value ?? '').replace(/[^\p{L}\p{N} ._-]/gu, '').trim().slice(0, 18);
const code = () => Array.from({ length: 4 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('');
const reply = (status, body) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
const publicRoom = (room) => ({ code: room.code, hostToken: room.hostToken, phase: room.phase, round: room.round, players: room.players.map(({ token, name }) => ({ token, name })), votes: room.votes });

export default async (request) => {
  try {
    const url = new URL(request.url);
    if (request.method === 'GET') {
      const roomCode = url.searchParams.get('code')?.toUpperCase();
      if (!roomCode || !CODE.test(roomCode)) return reply(400, { error: 'Enter a real room code.' });
      const room = await store.get(`room:${roomCode}`, { type: 'json' });
      if (!room) return reply(404, { error: 'That room is gone. Check the code.' });
      return reply(200, { room: publicRoom(room) });
    }
    if (request.method !== 'POST') return reply(405, { error: 'Use GET or POST.' });
    const { action, roomCode: rawCode, token, name, side } = await request.json();
    const playerName = cleanName(name);
    if (action === 'create') {
      if (!playerName || !token) return reply(400, { error: 'Add your name first.' });
      let roomCode = code(); while (await store.get(`room:${roomCode}`)) roomCode = code();
      const room = { code: roomCode, hostToken: token, phase: 'lobby', round: 0, players: [{ token, name: playerName }], votes: {}, updatedAt: Date.now() };
      await store.setJSON(`room:${roomCode}`, room); return reply(200, { room: publicRoom(room) });
    }
    const roomCode = String(rawCode ?? '').toUpperCase();
    if (!CODE.test(roomCode) || !token) return reply(400, { error: 'Room code or player info is missing.' });
    const room = await store.get(`room:${roomCode}`, { type: 'json' });
    if (!room) return reply(404, { error: 'That room is gone. Check the code.' });
    if (action === 'join') {
      if (!playerName) return reply(400, { error: 'Add your name first.' });
      if (room.phase !== 'lobby') return reply(409, { error: 'That game already started.' });
      const existing = room.players.find((player) => player.token === token);
      if (existing) existing.name = playerName;
      else if (room.players.length >= 8) return reply(409, { error: 'That room is full.' });
      else room.players.push({ token, name: playerName });
    } else if (action === 'start') {
      if (room.hostToken !== token || room.players.length < 2) return reply(403, { error: 'Only the host can start with at least two players.' });
      room.phase = 'play'; room.votes = {};
    } else if (action === 'vote') {
      if (room.phase !== 'play' || !room.players.some((player) => player.token === token) || !['left', 'right'].includes(side)) return reply(403, { error: 'That vote cannot be used right now.' });
      room.votes[token] = side; if (Object.keys(room.votes).length >= room.players.length) room.phase = 'results';
    } else if (action === 'next') {
      if (room.hostToken !== token || room.phase !== 'results') return reply(403, { error: 'Only the host can move to the next round.' });
      room.phase = 'play'; room.round += 1; room.votes = {};
    } else return reply(400, { error: 'Unknown room action.' });
    room.updatedAt = Date.now(); await store.setJSON(`room:${roomCode}`, room); return reply(200, { room: publicRoom(room) });
  } catch { return reply(500, { error: 'The room hiccupped. Try again.' }); }
};
