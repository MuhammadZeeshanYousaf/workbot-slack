import { database } from '~/app';
import { adminClient } from '~/clients/admin.client';
import { Messages, WorkHubCompany } from '~/globals';
import { basicBlock } from '~/slack/blocks';
import { updateView } from '~/slack/views/helpers';
import { companiesView, waitingView } from '~/slack/views/helpers';

export const connectWorkhubHandler = async ({
  body,
  client: { users, views },
  context: { teamId: teamId, userId: userId },
  logger
}) => {
  if (teamId !== undefined) {
    // Open view with waiting message within 3 seconds
    const result = await waitingView(views, body);
    const { linkedCompanyUuid } = await database.get(teamId);

    if (
      linkedCompanyUuid === null ||
      linkedCompanyUuid === undefined ||
      linkedCompanyUuid == 'null' ||
      linkedCompanyUuid == ''
    ) {
      const { user } = await users.info({
        user: userId!
      });
      const userEmail = user!.profile!.email!;

      const companies: Array<WorkHubCompany> = await adminClient.fetchUserCompanies(userEmail);

      if (companies.length < 1) {
        // Update view with No workhub account message
        await updateView(
          {
            viewClient: views,
            view: result.view,
            updatedBlock: basicBlock(Messages.NoWorkhubAccount)
          },
          logger
        );
      } else {
        // Update the view with companies dropdown
        await companiesView({ viewClient: views, view: result.view, companies }, logger);
      }
    } else {
      // Update view with company already linked message
      await updateView(
        {
          viewClient: views,
          view: result.view,
          updatedBlock: basicBlock(Messages.CompanyAlreadyLinked)
        },
        logger
      );
    }
  } else {
    logger.error('Invalid Request!');
  }
};
