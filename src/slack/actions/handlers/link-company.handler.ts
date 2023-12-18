import { database } from '~/app';
import { linkCompanyBlock } from '~/slack/blocks';
import { SlackActions } from '~/globals';

export const linkCompanyHandler = async ({ body, client, action, context: { teamId: teamId }, respond, logger }) => {
  if (action?.type === 'static_select' && teamId !== undefined) {
    const {
      selected_option: {
        text: { text: selectedCompanyName },
        value: selectedCompanyUuid
      }
    } = action;

    await database.update(teamId, 'linkedCompanyUuid', selectedCompanyUuid);

    // Update view with success message
    try {
      await client.views.update({
        view_id: body.view.id,
        // Pass the current hash to avoid race conditions
        hash: body.view.hash,
        view: {
          type: 'modal',
          // View identifier
          callback_id: SlackActions.LinkCompanyViewId,
          title: {
            type: 'plain_text',
            text: SlackActions.LinkCompanyViewTitle
          },
          blocks: linkCompanyBlock(selectedCompanyName).blocks,
          close: {
            type: 'plain_text',
            text: 'Close'
          }
        }
      });
    } catch {
      logger.error(`INFO ${SlackActions.LinkCompanyViewTitle} operation canceled.`);
    }
  } else {
    logger.error('Invalid Request!');
  }
};
