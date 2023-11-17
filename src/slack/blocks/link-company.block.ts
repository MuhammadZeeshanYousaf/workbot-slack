import { RespondArguments } from '@slack/bolt';
import { Messages } from '~/globals';

export const linkCompanyBlock = (companyName): RespondArguments => {
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
