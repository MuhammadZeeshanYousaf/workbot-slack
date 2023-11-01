import { database } from '~/app';
import { AllMiddlewareArgs, SlackActionMiddlewareArgs } from '@slack/bolt';
import { unlinkCompanyBlock } from '~/slack/blocks';

export const unlinkCompanyHandler = async ({
  action,
  context: { teamId: teamId },
  say,
  logger
}: SlackActionMiddlewareArgs & AllMiddlewareArgs) => {
  if (action.type === 'button' && teamId !== undefined) {
    await database.update(teamId, 'linkedCompanyUuid', null);

    await say(unlinkCompanyBlock('You have unlinked your WorkHub company successfully.'));
  } else {
    logger.error('Invalid Request!');
  }
};
