import { Logger } from '@slack/bolt';
import { Messages, SlackActions } from '~/globals';
import { basicBlock } from '~/slack/blocks';

export const waitingView = async (viewClient, body, logger?: Logger) => {
  try {
    return await viewClient.open({
      trigger_id: body.trigger_id,
      view: {
        type: 'modal',
        // View identifier
        callback_id: SlackActions.LinkCompanyViewId,
        title: {
          type: 'plain_text',
          text: SlackActions.LinkCompanyViewTitle
        },
        blocks: basicBlock(Messages.CheckingAccount),
        close: {
          type: 'plain_text',
          text: SlackActions.ViewCancel
        }
      }
    });
  } catch (error) {
    logger?.error(`Error in opening '${SlackActions.LinkCompanyViewTitle}' view:`, error);
  }
};
