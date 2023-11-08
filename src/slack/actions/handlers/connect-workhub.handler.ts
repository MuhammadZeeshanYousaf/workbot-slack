import { database } from '~/app';
import { adminClient } from '~/clients/admin.client';
import { WorkHubCompany } from '~/globals';
import { AllMiddlewareArgs, SlackActionMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';
import { companiesBlock } from '~/slack/blocks';

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
        await respond({
          replace_original: false,
          text: "You don't have an existing account on WorkHub. In order to use this app, you must have a WorkHub account, Please <https://www.workhub.ai/contact/|contact> our support team for more information or get yourself registered <https://app.workhub.ai/signup/workbot|here>."
        });
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
