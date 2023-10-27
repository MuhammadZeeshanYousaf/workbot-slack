import { database } from '~/app';
import { adminClient } from '~/clients/admin.client';
import { WorkHubCompany } from '~/globals';
import { AllMiddlewareArgs, SlackActionMiddlewareArgs } from '@slack/bolt';
import { companiesBlock } from '~/slack/blocks';

export const connectWorkhubHandler = async ({
  client: { users },
  context: { teamId: teamId, userId: userId },
  respond,
  logger
}: SlackActionMiddlewareArgs & AllMiddlewareArgs) => {
  const { user } = await users.info({
    user: userId!
  });

  const userEmail = user!.profile!.email!;

  const companies: Array<WorkHubCompany> = await adminClient.fetchUserCompanies(userEmail);

  if (companies.length < 1) {
    return await respond({ replace_original: false, text: 'No company  found on your email!' });
  } else if (teamId !== undefined) {
    try {
      await respond(companiesBlock(companies));
    } catch (e) {
      logger.error(e);
    } finally {
      await database.update(teamId, 'email', userEmail);
    }
  } else {
    logger.error('Invalid Request!');
  }
};
