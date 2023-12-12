import { app } from '~/app';
import { HELP_MSG, MENTION_MSG } from '~/slack/blocks';
import { linkCompanySlashHandler, unlinkCompanySlashHandler } from './handlers';

app.command(process.env.SLACK_SLASH_COMMAND!, async args => {
  const {
    ack,
    say,
    command: { text }
  } = args;

  await ack();

  const helpMatch = /^\s*help\s*/.test(text);
  const linkMatch = /^\s*link\s*/.test(text);
  const unlinkMatch = /^\s*unlink\s*/.test(text);

  if (helpMatch) {
    await say({ blocks: HELP_MSG });
  } else if (linkMatch) {
    await linkCompanySlashHandler(args);
  } else if (unlinkMatch) {
    await unlinkCompanySlashHandler(args);
  } else {
    await say({ blocks: MENTION_MSG });
  }
});
