import { Logger } from '@slack/bolt';
import { SlackActions } from '~/globals';

export const companiesView = async ({ viewClient, view, companies }, logger?: Logger) => {
  try {
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

    return await viewClient.update({
      view_id: view.id,
      // Pass the current hash to avoid race conditions
      hash: view.hash,
      view: {
        type: 'modal',
        // View identifier
        callback_id: SlackActions.LinkCompanyViewId,
        title: {
          type: 'plain_text',
          text: SlackActions.LinkCompanyViewTitle
        },
        blocks: [
          {
            type: 'input',
            block_id: SlackActions.SelectCompanyBlockId,
            label: {
              type: 'plain_text',
              text: 'Select your WorkHub Company'
            },
            element: {
              type: 'static_select',
              placeholder: {
                type: 'plain_text',
                text: SlackActions.SelectCompanyText,
                emoji: true
              },
              options: companyOptions,
              initial_option: companyOptions[0],
              action_id: SlackActions.SelectCompanyId
            },
            optional: false
          }
        ],
        close: {
          type: 'plain_text',
          text: SlackActions.ViewCancel
        },
        submit: {
          type: 'plain_text',
          text: 'Link'
        }
      }
    });
  } catch {
    logger?.error(`INFO ${SlackActions.LinkCompanyViewTitle} operation canceled.`);
  }
};
