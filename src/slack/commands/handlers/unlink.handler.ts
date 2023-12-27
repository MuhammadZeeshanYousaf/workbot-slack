import { AllMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';
import { database } from '~/app';
import { Messages, SlackActions } from '~/globals';
import { unlinkCompanyBlock } from '~/slack/blocks';

export const unlinkCompanySlashHandler = async ({
  context: { teamId: teamId },
  respond,
  logger
}: SlackCommandMiddlewareArgs & AllMiddlewareArgs) => {
  if (teamId !== undefined) {
    const { linkedCompanyUuid } = await database.get(teamId);

    if (linkedCompanyUuid === null) {
      await respond(unlinkCompanyBlock(Messages.NoCompanyLinkedYet));
    } else {
      await database.unLinkCompany(teamId);

      await respond(unlinkCompanyBlock(Messages.CompanyUnlinked, SlackActions.LinkAgain));
    }
  } else {
    logger.error('teamId does not exist');
  }
};
