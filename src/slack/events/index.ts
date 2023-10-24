import { AllMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';
import { app, database } from '~/app';
import { handleAppHomeOpenedEventHandler } from './handlers';
import { MENTION_MSG } from '~/slack/blocks';

app.event('app_home_opened', async (args: SlackEventMiddlewareArgs<'app_home_opened'> & AllMiddlewareArgs) => {
  await handleAppHomeOpenedEventHandler(args);
});

app.event('app_mention', async ({ say }) => {
  await say({
    blocks: MENTION_MSG
  });
});

app.event('app_uninstalled', async ({ context: { teamId: team_id } }) => {
  if (team_id !== undefined) {
    return await database.delete(team_id);
  }

  throw new Error('Unauthorized request!');
});
