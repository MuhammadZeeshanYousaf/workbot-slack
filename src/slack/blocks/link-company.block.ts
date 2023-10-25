import { RespondArguments } from '@slack/bolt';

export const linkCompanyBlock = (companyName): RespondArguments => {
  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${companyName}* linked :white_check_mark:`
        }
      }
    ]
  };
};
