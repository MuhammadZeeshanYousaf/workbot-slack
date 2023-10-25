import { AllMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';
import { database } from '~/app';
import { unlinkCompanyBlock } from '~/slack/blocks';

export const unlinkCompanySlashHandler = async ({
  context: { teamId: teamId },
  say,
  logger
}: SlackCommandMiddlewareArgs & AllMiddlewareArgs) => {
  if (teamId !== undefined) {
    await database.update(teamId, 'companyUuid', null);
    await say(unlinkCompanyBlock('Company'));
  }
};
