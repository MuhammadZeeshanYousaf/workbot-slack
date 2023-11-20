import { SlackActions } from '~/globals';

export const welcomeBlock = userId => {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text:
          'Hi there' +
          ` <@${userId}>` +
          ' :wave: \n Great to see you here! \n\n WorkBot is an AI platform that centralizes knowledge management and enables automations across the organization. Slack integration for WorkBot makes it easier to answer your queries within Slack. \
              \n • To ask from your WorkBot use: ' +
          `*@WorkBot* _[question]_` +
          '\n • To link company `/workbot link`\
              \n • To unlink company `/workbot unlink`\
              \n • For help use `/workbot help`'
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
  ];
};
