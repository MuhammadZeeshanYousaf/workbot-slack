import { SlackActions } from '~/globals';

export const viewAck = async (ack, block) => {
  return await ack({
    response_action: 'update',
    view: {
      type: 'modal',
      callback_id: SlackActions.LinkCompanyViewId,
      title: {
        type: 'plain_text',
        text: SlackActions.LinkCompanyViewTitle
      },
      blocks: block,
      close: {
        type: 'plain_text',
        text: SlackActions.ViewClose
      }
    }
  });
};
