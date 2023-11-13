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
    let query = message.text;

    if (query.includes('<@')) query = query.split('>')[1];

    await queryHandler(args, query, channelId);
  }
});
