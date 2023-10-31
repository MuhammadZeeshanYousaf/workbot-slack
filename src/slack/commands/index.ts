import { app } from '~/app';
import { HELP_MSG, MENTION_MSG } from '~/slack/blocks';
import { linkCompanySlashHandler, queryHandler, unlinkCompanySlashHandler } from './handlers';

app.command('/workbot', async args => {
  const {
    ack,
    say,
    command: { text },
    payload: { channel_id: channelId }
  } = args;

  await ack();

  const queryMatch = text.match(/^\s*query\s(.*)/);
  const helpMatch = /^\s*help\s*/.test(text);
  const linkMatch = /^\s*link\s*/.test(text);
  const unlinkMatch = /^\s*unlink\s*/.test(text);

  if (queryMatch) {
    // Generate Query response from workbot
    const query = queryMatch[1];

    await queryHandler(args, query, channelId);
  } else if (helpMatch) {
    await say({ blocks: HELP_MSG });
  } else if (linkMatch) {
    await linkCompanySlashHandler(args);
  } else if (unlinkMatch) {
    await unlinkCompanySlashHandler(args);
  } else {
    await say({ blocks: MENTION_MSG });
  }
});
