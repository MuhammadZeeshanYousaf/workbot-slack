import { Logger } from '@slack/bolt';
import { SlackActions } from '~/globals';

export const updateView = async ({ viewClient, view, closeText, updatedBlock }, logger?: Logger) => {
  try {
    await viewClient.update({
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
          text: closeText
        }
      }
    });
  } catch {
    logger?.error(`INFO ${SlackActions.LinkCompanyViewTitle} operation canceled.`);
  }
};
