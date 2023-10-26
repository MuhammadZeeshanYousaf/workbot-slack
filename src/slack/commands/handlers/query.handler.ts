import { AllMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';
import { database } from '~/app';
import { adminClient } from '~/clients/admin.client';
import { workbotClient } from '~/clients/workbot.client';

export const queryHandler = async (args: SlackCommandMiddlewareArgs & AllMiddlewareArgs, userQuery: string) => {
  const {
    respond,
    context: { teamId: teamId },
    logger
  } = args;

  if (teamId !== undefined) {
    const { email, companyUuid } = await database.get(teamId);
    const { accessToken } = await adminClient.fetchUserData(email!);
    const params = { userQuery: userQuery, userToken: accessToken, companyUuid: companyUuid };
    const queryResponse = await workbotClient.getQueryResponse(params);

    await respond(queryResponse);
  } else {
    logger.error('Invalid Request!');
  }
};
