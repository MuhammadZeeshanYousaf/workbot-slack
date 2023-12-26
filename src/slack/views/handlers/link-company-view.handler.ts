import { database } from '~/app';
import { Messages, SlackActions } from '~/globals';
import { basicBlock, linkCompanyBlock } from '~/slack/blocks';
import { viewAck } from '../helpers';

export const linkCompanyViewHandler = async ({ ack, view, context: { teamId: teamId } }) => {
  if (teamId !== undefined) {
    const selectedCompany =
      view.state.values[SlackActions.SelectCompanyBlockId][SlackActions.SelectCompanyId]['selected_option'];

    try {
      await database.update(teamId, 'linkedCompanyUuid', selectedCompany!.value);
      await viewAck(ack, linkCompanyBlock(selectedCompany!.text.text).blocks);
    } catch {
      await viewAck(ack, basicBlock(Messages.SomethingWrong));
    }
  }
};
