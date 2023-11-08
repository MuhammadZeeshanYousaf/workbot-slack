import { app } from '~/app';
import { queryHandler } from '~/slack/commands/handlers';
import { MENTION_MSG } from '~/slack/blocks';

// Listens to incoming messages from Messages tab
app.message(async args => {
  // Filter out message events with subtypes (see https://api.slack.com/events/message)
  const {
    say,
    message,
    payload: { channel: channelId }
  } = args;

  if ((message.subtype === undefined || message.subtype === 'bot_message') && message.text !== undefined) {
    if (message.text.includes(`${process.env.BOT_USER_ID}`)) {
      await say("Don't need to mention, you can ask directly in here.");
    } else {
      await queryHandler(args, message.text, channelId);
    }
  }
});
