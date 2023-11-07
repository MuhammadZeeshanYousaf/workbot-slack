import { SlackActions } from '~/globals';
import { RespondArguments } from '@slack/bolt';

export const unlinkCompanyBlock = (
  messageText,
  buttonText: string = SlackActions.LinkCompanyText
): RespondArguments => {
  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: messageText
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: buttonText
            },
            action_id: SlackActions.ConnectWorkhubId
          }
        ]
      }
    ]
  };
};
