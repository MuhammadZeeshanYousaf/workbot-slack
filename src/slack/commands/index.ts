import { app } from '~/app';

app.command('/workbot', async args => {
  const {
    ack,
    respond,
    say,
    command: { text }
  } = args;

  await ack();

  // Respond the request
  await say({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Hey there <@${text}>!`
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Click Me'
          },
          action_id: 'button_click'
        }
      }
    ]
  });

  // Ephemeral message using response URL
  await respond(`Please wait...`);
});
