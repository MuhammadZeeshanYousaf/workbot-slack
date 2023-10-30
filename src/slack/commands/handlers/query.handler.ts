import { AllMiddlewareArgs, SlackCommandMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';
import { ChatPostMessageResponse } from '@slack/web-api';
import { database } from '~/app';
import { adminClient } from '~/clients/admin.client';
import { workbotClient } from '~/clients/workbot.client';

export const queryHandler = async (
  args: (SlackEventMiddlewareArgs<'message'> | SlackCommandMiddlewareArgs) & AllMiddlewareArgs,
  userQuery: string
) => {
  const {
    say,
    client,
    context: { teamId: teamId },
    logger
  } = args;

  if (teamId !== undefined) {
    const { email, companyUuid } = await database.get(teamId);
    if (companyUuid !== undefined && companyUuid !== null && companyUuid !== '') {
      const message = await say(`Please wait....`);
      const { accessToken } = await adminClient.fetchUserData(email!);

      const params = { userQuery: userQuery, userToken: accessToken, companyUuid: companyUuid };
      await workbotClient.getQueryResponse(params, client, message, logger);
    } else {
      await say(`No linked WorkHub company found!`);
    }
  } else {
    logger.error('Invalid Request!');
  }
};
