import { RespondArguments } from '@slack/bolt';

export const linkCompanyBlock = (companyName): RespondArguments => {
  return {
    replace_original: false,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `You have successfully linked *${companyName}*.`
        }
      }
    ]
  };
};
