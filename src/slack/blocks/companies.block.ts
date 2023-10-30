import { RespondArguments } from '@slack/bolt';
import { SlackActions } from '~/globals';

export const companiesBlock = (companies): RespondArguments => {
  const companyOptions = companies.map(company => {
    return {
      text: {
        type: 'plain_text',
        text: company.name,
        emoji: true
      },
      value: company.uuid
    };
  });

  return {
    replace_original: false,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Select your WorkHub Company*'
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'static_select',
            action_id: SlackActions.SelectCompanyId,
            placeholder: {
              type: 'plain_text',
              text: SlackActions.SelectCompanyText,
              emoji: true
            },
            options: companyOptions
          }
        ]
      }
    ]
  };
};
