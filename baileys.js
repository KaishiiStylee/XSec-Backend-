import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  Browsers,
} from '@whiskeysockets/baileys';
import QRCode from 'qrcode';
import pino from 'pino';
import fs from 'fs';
import path from 'path';

const SESSION_DIR = './sessions';
if (!fs.existsSync(SESSION_DIR)) fs.mkdirSync(SESSION_DIR, { recursive: true });

const senders = new Map();

export async function createSender(number) {
  if (senders.has(number) && senders.get(number).sock) {
    return senders.get(number);
  }
  const sessionPath = path.join(SESSION_DIR, `sender_${number}`);
  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    browser: Browsers.ubuntu('Chrome'),
    logger: pino({ level: 'silent' }),
    syncFullHistory: false,
    markOnlineOnConnect: false,
  });

  const sender = { sock, ws: null, number };
  senders.set(number, sender);

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      try {
        const qrDataUrl = await QRCode.toDataURL(qr, { margin: 1, width: 300 });
        if (sender.ws && sender.ws.readyState === 1) {
          sender.ws.send(JSON.stringify({ type: 'qr', data: qrDataUrl }));
        }
      } catch (e) {
        console.error('[XSec] QR error:', e.message);
      }
    }

    if (connection === 'open') {
      const user = sock.user;
      const info = {
        jid: user.id.split(':')[0] + '@s.whatsapp.net',
        pushName: user.name || user.verifiedName || 'Unknown',
      };
      if (sender.ws && sender.ws.readyState === 1) {
        sender.ws.send(JSON.stringify({ type: 'connected', data: info }));
      }
      console.log(`[XSec] Sender ${number} connected as ${info.pushName}`);
    }

    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      console.log(`[XSec] Sender ${number} closed. Code: ${code}`);
      if (sender.ws && sender.ws.readyState === 1) {
        sender.ws.send(JSON.stringify({ type: 'disconnected' }));
      }
      if (code !== DisconnectReason.loggedOut) {
        setTimeout(() => createSender(number), 2000);
      } else {
        try { fs.rmSync(sessionPath, { recursive: true, force: true }); } catch {}
        senders.delete(number);
      }
    }
  });

  return sender;
}

export function getSender(number) {
  return senders.get(number) || null;
}

export async function disconnectSender(number) {
  const sender = senders.get(number);
  if (!sender) return;
  try { await sender.sock?.logout(); } catch {}
  try {
    const sessionPath = path.join(SESSION_DIR, `sender_${number}`);
    fs.rmSync(sessionPath, { recursive: true, force: true });
  } catch {}
  senders.delete(number);
    }
