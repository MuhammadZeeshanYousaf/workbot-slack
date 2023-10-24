import { AllMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';
import { SlackActions } from '~/globals';

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

      const [userEmail, userName] = [user?.profile?.email, user?.profile?.real_name];

      say({
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text:
                'Hi there' +
                ` *${userName}*` +
                ' :wave: \n Great to see you here! \n\n Workbot is a platform that answer your queries from your knowledge base. Slack integration with Workbot makes it easier to query within slack. \n • To query from your workbot (use `/workbot query <your-query>`) \n • And take help using `/workbot help`'
            }
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: SlackActions.ConnectWorkhubText
                },
                action_id: SlackActions.ConnectWorkhubId,
                style: 'primary'
              }
            ]
          }
        ]
      });
    }
  }
};
