import { AllMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';
import { welcomeBlock } from '~/slack/blocks';

export const handleAppHomeOpenedEventHandler = async ({
  event,
  client: { conversations, users },
  say
}: SlackEventMiddlewareArgs<'app_home_opened'> & AllMiddlewareArgs) => {
  if (event.tab === 'messages') {
    const { messages } = await conversations.history({
      channel: event.channel,
      limit: 1
    });

    if (!messages?.length) {
      const { user } = await users.info({
        user: event.user
      });

      const userName = user?.profile?.real_name;
      const userId = user?.id;

      await say({ blocks: welcomeBlock(userId) });
    }
  }
};
