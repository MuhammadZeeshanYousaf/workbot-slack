import { database } from '~/app';
import { adminClient } from '~/clients/admin.client';
import { Messages, SlackActions, WorkHubCompany } from '~/globals';
import { basicBlock, companiesBlock } from '~/slack/blocks';

export const connectWorkhubHandler = async ({ body, client, context: { teamId: teamId, userId: userId }, logger }) => {
  if (teamId !== undefined) {
    let result;
    try {
      // Open view with waiting message within 3 seconds
      result = await client.views.open({
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
      const { user } = await client.users.info({
        user: userId!
      });
      const userEmail = user!.profile!.email!;

      const companies: Array<WorkHubCompany> = await adminClient.fetchUserCompanies(userEmail);

      if (companies.length < 1) {
        // Update view with No workhub account message
        try {
          await client.views.update({
            view_id: result.view.id,
            // Pass the current hash to avoid race conditions
            hash: result.view.hash,
            view: {
              type: 'modal',
              // View identifier
              callback_id: SlackActions.LinkCompanyViewId,
              title: {
                type: 'plain_text',
                text: SlackActions.LinkCompanyViewTitle
              },
              blocks: basicBlock(Messages.NoWorkhubAccount),
              close: {
                type: 'plain_text',
                text: 'Close'
              }
            }
          });
        } catch {
          logger.error(`INFO ${SlackActions.LinkCompanyViewTitle} operation canceled.`);
        }
      } else {
        // Update view with companies dropdown
        try {
          await client.views.update({
            view_id: result.view.id,
            // Pass the current hash to avoid race conditions
            hash: result.view.hash,
            view: {
              type: 'modal',
              // View identifier
              callback_id: SlackActions.LinkCompanyViewId,
              title: {
                type: 'plain_text',
                text: SlackActions.LinkCompanyViewTitle
              },
              blocks: companiesBlock(companies).blocks,
              close: {
                type: 'plain_text',
                text: 'Cancel'
              }
            }
          });
          await database.update(teamId, 'linkedBy', userEmail);
        } catch {
          logger.error(`INFO ${SlackActions.LinkCompanyViewTitle} operation canceled.`);
        }
      }
    } else {
      try {
        // Update view with company already linked message
        await client.views.update({
          view_id: result.view.id,
          // Pass the current hash to avoid race conditions
          hash: result.view.hash,
          view: {
            type: 'modal',
            // View identifier
            callback_id: SlackActions.LinkCompanyViewId,
            title: {
              type: 'plain_text',
              text: SlackActions.LinkCompanyViewTitle
            },
            blocks: basicBlock(Messages.CompanyAlreadyLinked),
            close: {
              type: 'plain_text',
              text: 'Close'
            }
          }
        });
      } catch {
        logger.error(`INFO ${SlackActions.LinkCompanyViewTitle} operation canceled.`);
      }
    }
  } else {
    logger.error('Invalid Request!');
  }
};
