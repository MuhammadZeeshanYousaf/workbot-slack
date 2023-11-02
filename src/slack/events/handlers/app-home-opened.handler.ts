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

      const userName = user?.profile?.real_name;

      await say({
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text:
                'Hi there' +
                ` *${userName}*` +
                ' :wave: \n Great to see you here! \n\n WorkBot is an AI platform that centralizes knowledge management and enables automations across the organization. Slack integration for WorkBot makes it easier to answer your queries within Slack. \
                \n • To ask from your WorkBot use:\n' +
                `<@${process.env.BOT_USER_ID}> \`[question]\` or ` +
                '`/workbot query [question]`\
                \n • To get help use `/workbot help`\
                \n • To link company `/workbot link`\
                \n • To unlink company `/workbot unlink`'
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
