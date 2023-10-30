import { SlackActions } from '~/globals';
import { RespondArguments } from '@slack/bolt';

export const unlinkCompanyBlock = (companyName): RespondArguments => {
  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `You have unlinked *${companyName}* successfully`
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: SlackActions.LinkCompanyText
            },
            action_id: SlackActions.ConnectWorkhubId
          }
        ]
      }
    ]
  };
};
