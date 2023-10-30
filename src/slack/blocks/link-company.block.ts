import { RespondArguments } from '@slack/bolt';

export const linkCompanyBlock = (companyName): RespondArguments => {
  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `You have successfully linked *${companyName}*`
        }
      }
    ]
  };
};
