import { app } from '~/app';
import { HELP_MSG } from '../blocks';

// Listens to incoming messages that contain "hello"
app.message('help', async ({ message, say }) => {
  // Filter out message events with subtypes (see https://api.slack.com/events/message)
  if (message.subtype === undefined || message.subtype === 'bot_message') {
    // say() sends a message to the channel where the event was triggered
    await say({
      blocks: HELP_MSG
    });
  }
});
