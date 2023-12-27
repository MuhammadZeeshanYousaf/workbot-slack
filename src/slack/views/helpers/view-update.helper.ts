import { Logger } from '@slack/bolt';
import { SlackActions } from '~/globals';

export const updateView = async ({ viewClient, view, updatedBlock }, logger?: Logger) => {
  try {
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
        blocks: updatedBlock,
        close: {
          type: 'plain_text',
          text: SlackActions.ViewClose
        }
      }
    });
  } catch {
    logger?.error(`INFO ${SlackActions.LinkCompanyViewTitle} operation canceled.`);
  }
};
