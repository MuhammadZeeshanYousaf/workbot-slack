import { database } from '~/app';
import { adminClient } from '~/clients/admin.client';
import { WorkHubCompany } from '~/globals';
import { AllMiddlewareArgs, SlackActionMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';
import { companiesBlock, linkCompanyBlock } from '~/slack/blocks';

export const connectWorkhubHandler = async ({
  client: { users },
  context: { teamId: teamId, userId: userId },
  respond,
  logger
}: (SlackCommandMiddlewareArgs | SlackActionMiddlewareArgs) & AllMiddlewareArgs) => {
  if (teamId !== undefined) {
    const { linkedCompanyUuid } = await database.get(teamId);

    if (linkedCompanyUuid === null) {
      await respond({
        replace_original: false,
        text: 'Please wait, while we are checking your account...'
      });

      const { user } = await users.info({
        user: userId!
      });
      const userEmail = user!.profile!.email!;

      const companies: Array<WorkHubCompany> = await adminClient.fetchUserCompanies(userEmail);

      if (companies.length < 1) {
        await respond({ replace_original: false, text: 'No company found on your email!' });
      } else if (companies.length === 1) {
        const { uuid, name } = companies[0];
        await database.update(teamId, 'linkedCompanyUuid', uuid);
        await respond(linkCompanyBlock(name));
      } else {
        try {
          await respond(companiesBlock(companies));
        } catch (e) {
          logger.error(e);
        } finally {
          await database.update(teamId, 'linkedBy', userEmail);
        }
      }
    } else {
      await respond({ replace_original: false, text: 'You have already linked your WorkHub company.' });
    }
  } else {
    logger.error('Invalid Request!');
  }
};
