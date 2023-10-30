import { AllMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';
import { database } from '~/app';
import { unlinkCompanyBlock } from '~/slack/blocks';

export const unlinkCompanySlashHandler = async ({
  context: { teamId: teamId },
  respond,
  logger
}: SlackCommandMiddlewareArgs & AllMiddlewareArgs) => {
  if (teamId !== undefined) {
    const { companyUuid } = await database.get(teamId);

    if (companyUuid === null) {
      await respond(unlinkCompanyBlock('You did not link your WorkHub company yet!'));
    } else {
      await database.update(teamId, 'companyUuid', null);

      await respond(unlinkCompanyBlock('You have unlinked your WorkHub company successfully.', 'Link Again'));
    }
  } else {
    logger.error('teamId does not exist');
  }
};
