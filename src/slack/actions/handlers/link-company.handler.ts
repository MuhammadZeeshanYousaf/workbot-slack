import { database } from '~/app';
import { linkCompanyBlock } from '~/slack/blocks';
import { updateView } from '~/slack/views/helpers';

export const linkCompanyHandler = async ({ body, client: { views }, action, context: { teamId: teamId }, logger }) => {
  if (action?.type === 'static_select' && teamId !== undefined) {
    const {
      selected_option: {
        text: { text: selectedCompanyName },
        value: selectedCompanyUuid
      }
    } = action;

    await database.update(teamId, 'linkedCompanyUuid', selectedCompanyUuid);

    // Update view with success message
    await updateView(
      {
        viewClient: views,
        view: body.view,
        updatedBlock: linkCompanyBlock(selectedCompanyName).blocks
      },
      logger
    );
  } else {
    logger.error('Invalid Request!');
  }
};
