import { SlackActions } from '~/globals';
import { RespondArguments } from '@slack/bolt';

export const unlinkCompanyBlock = (companyName): RespondArguments => {
  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${companyName}* unlinked :ballot_box_with_check:`
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
            action_id: SlackActions.ConnectWorkhubId,
            style: 'primary'
          }
        ]
      }
    ]
  };
};
