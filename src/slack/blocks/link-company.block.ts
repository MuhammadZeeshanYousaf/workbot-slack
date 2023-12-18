import { RespondArguments } from '@slack/bolt';
import { Messages } from '~/globals';

export const linkCompanyBlock = companyName => {
  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: Messages.CompanyLinked + ` *${companyName}*.`
        }
      }
    ]
  };
};
