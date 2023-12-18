import { database } from '~/app';
import { adminClient } from '~/clients/admin.client';
import { Messages, SlackActions, WorkHubCompany } from '~/globals';
import { basicBlock, companiesBlock, updateView } from '~/slack/blocks';

export const connectWorkhubHandler = async ({
  body,
  client: { users, views },
  context: { teamId: teamId, userId: userId },
  logger
}) => {
  if (teamId !== undefined) {
    let result;
    try {
      // Open view with waiting message within 3 seconds
      result = await views.open({
        trigger_id: body.trigger_id,
        view: {
          type: 'modal',
          // View identifier
          callback_id: SlackActions.LinkCompanyViewId,
          title: {
            type: 'plain_text',
            text: SlackActions.LinkCompanyViewTitle
          },
          blocks: basicBlock(Messages.CheckingAccount),
          close: {
            type: 'plain_text',
            text: 'Cancel'
          }
        }
      });
    } catch (error) {
      logger.error(`Error in opening '${SlackActions.LinkCompanyViewTitle}' view:`, error);
    }

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
            closeText: SlackActions.ViewClose,
            updatedBlock: basicBlock(Messages.NoWorkhubAccount)
          },
          logger
        );
      } else {
        // Update view with companies dropdown
        await updateView(
          {
            viewClient: views,
            view: result.view,
            closeText: SlackActions.ViewCancel,
            updatedBlock: companiesBlock(companies).blocks
          },
          logger
        );
      }
    } else {
      // Update view with company already linked message
      await updateView(
        {
          viewClient: views,
          view: result.view,
          closeText: SlackActions.ViewClose,
          updatedBlock: basicBlock(Messages.CompanyAlreadyLinked)
        },
        logger
      );
    }
  } else {
    logger.error('Invalid Request!');
  }
};
