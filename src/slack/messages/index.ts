import { app } from '~/app';
import { queryHandler } from '~/slack/commands/handlers';

// Listens to incoming messages from Messages tab
app.message(async args => {
  // Filter out message events with subtypes (see https://api.slack.com/events/message)
  const {
    message,
    payload: { channel: channelId }
  } = args;

  if ((message.subtype === undefined || message.subtype === 'bot_message') && message.text !== undefined) {
    await queryHandler(args, message.text, channelId);
  }
});
