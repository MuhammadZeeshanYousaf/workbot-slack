import { database } from '~/app';
import { AllMiddlewareArgs, SlackActionMiddlewareArgs } from '@slack/bolt';
import { unlinkCompanyBlock } from '~/slack/blocks';
import { Messages } from '~/globals';

export const unlinkCompanyHandler = async ({
  action,
  context: { teamId: teamId },
  say,
  logger
}: SlackActionMiddlewareArgs & AllMiddlewareArgs) => {
  if (action.type === 'button' && teamId !== undefined) {
    await database.update(teamId, 'linkedCompanyUuid', null);

    await say(unlinkCompanyBlock(Messages.CompanyUnlinked));
  } else {
    logger.error('Invalid Request!');
  }
};
