import { AllMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';
import { app, database } from '~/app';
import { handleAppHomeOpenedEventHandler } from './handlers';
import { MENTION_MSG } from '~/slack/blocks';
import { queryHandler } from '~/slack/messages/handlers';

app.event('app_home_opened', async (args: SlackEventMiddlewareArgs<'app_home_opened'> & AllMiddlewareArgs) => {
  await handleAppHomeOpenedEventHandler(args);
});

app.event('app_mention', async args => {
  const {
    client: { users },
    context: { userId: userId },
    say,
    payload: { text, channel }
  } = args;

  const query = text.split('>')[1];

  if (query.length > 1) {
    const { user } = await users.info({
      user: userId!
    });
    const userEmail = user?.profile?.email;

    if (userEmail !== undefined) {
      await queryHandler(args, query, userEmail, channel);
    }
  } else {
    await say({
      blocks: MENTION_MSG
    });
  }
});

app.event('app_uninstalled', async ({ context: { teamId: team_id }, logger }) => {
  if (team_id !== undefined) {
    return await database.update(team_id, 'uninstalledAt', new Date().toISOString());
  }

  logger.error('Unauthorized request!');
});
