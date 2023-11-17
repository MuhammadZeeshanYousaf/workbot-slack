import { app } from '~/app';
import { queryHandler } from '~/slack/messages/handlers';

// Listens to incoming messages from Messages tab
app.message(async args => {
  // Filter out message events with subtypes (see https://api.slack.com/events/message)
  const {
    client: { users },
    context: { userId: userId },
    message,
    payload: { channel: channelId }
  } = args;

  if ((message.subtype === undefined || message.subtype === 'bot_message') && message.text !== undefined) {
    let query = message.text;
    if (query.includes('<@')) query = query.split('>')[1];

    const { user } = await users.info({
      user: userId!
    });
    const userEmail = user?.profile?.email;

    if (userEmail !== undefined) {
      await queryHandler(args, query, userEmail, channelId);
    }
  }
});
