import { database } from '~/app';
import { AllMiddlewareArgs, SlackActionMiddlewareArgs } from '@slack/bolt';
import { linkCompanyBlock } from '~/slack/blocks';

export const linkCompanyHandler = async ({
  action,
  context: { teamId: teamId },
  say,
  logger
}: SlackActionMiddlewareArgs & AllMiddlewareArgs) => {
  if (action?.type === 'static_select' && teamId !== undefined) {
    const {
      selected_option: {
        text: { text: selectedCompanyName },
        value: selectedCompanyUuid
      }
    } = action;

    await database.update(teamId, 'companyUuid', selectedCompanyUuid);

    await say(linkCompanyBlock(selectedCompanyName));
  } else {
    logger.error('Invalid Request!');
  }
};
