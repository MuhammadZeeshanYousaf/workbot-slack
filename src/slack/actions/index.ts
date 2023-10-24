import { app, database } from '~/app';
import { adminClient } from '~/clients/admin.client';
import { STATUSCODE, SlackActions } from '~/globals';

app.action(
  SlackActions.ConnectWorkhubId,
  async ({ body, client: { users }, context: { teamId: teamId }, ack, respond, say, logger }) => {
    await ack();
    await say('Please wait, we are checking your account...');

    const { user } = await users.info({
      user: body.user.id
    });

    const [userEmail, userName] = [user?.profile?.email, user?.profile?.real_name];
    const { status, companies, message } = await adminClient.getUserCompanies(userEmail);

    if ((companies === undefined && status !== STATUSCODE.SUCCESS) || message !== undefined) {
      await respond(message);
      return;
    } else if (teamId !== undefined && userEmail !== undefined) {
      const companyOptions = companies.map(company => {
        return {
          text: {
            type: 'plain_text',
            text: company.name,
            emoji: true
          },
          value: company.uuid
        };
      });

      try {
        await respond({
          replace_original: false,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: '*Select company to connect:*'
              }
            },
            {
              type: 'actions',
              elements: [
                {
                  type: 'static_select',
                  action_id: SlackActions.SelectCompanyId,
                  placeholder: {
                    type: 'plain_text',
                    text: SlackActions.SelectCompanyText,
                    emoji: true
                  },
                  options: companyOptions
                }
              ]
            }
          ]
        });
      } catch (e) {
        logger.error(e);
      } finally {
        await database.update(teamId, 'email', userEmail);
      }
    } else {
      logger.error('Invalid Request!');
    }
  }
);

app.action(SlackActions.SelectCompanyId, async ({ action, context: { teamId: teamId }, ack, say, logger }) => {
  await ack();

  if (action?.type === 'static_select') {
    const selectedCompanyName = action.selected_option.text.text;
    const selectedCompanyUuid = action.selected_option.value;

    if (teamId !== undefined) await database.update(teamId, 'companyUuid', selectedCompanyUuid);

    await say(`"${selectedCompanyName}" connected :white_check_mark:`);
  } else {
    logger.error('Invalid Request!');
  }
});
