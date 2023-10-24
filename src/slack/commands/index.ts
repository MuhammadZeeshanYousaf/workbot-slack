import { app } from '~/app';
import { HELP_MSG, MENTION_MSG } from '~/slack/blocks';

app.command('/workbot', async args => {
  const {
    ack,
    respond,
    say,
    command: { text }
  } = args;

  await ack();

  const queryMatch = text.match(/^\s*query\s(.*)/);
  const helpMatch = /^\s*help\s/.test(text);

  if (queryMatch) {
    // Generate Query response from workbot
    const query = queryMatch[1];

    await say(`This is your query: ${query}`);
  } else if (helpMatch) {
    await say({ blocks: HELP_MSG });
  } else {
    await say({ blocks: MENTION_MSG });
  }
});
