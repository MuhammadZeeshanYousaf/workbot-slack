import { AllMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';
import { ChatPostMessageResponse } from '@slack/web-api';
import { database } from '~/app';
import { adminClient } from '~/clients/admin.client';
import { workbotClient } from '~/clients/workbot.client';

export const queryHandler = async (
  args: SlackCommandMiddlewareArgs & AllMiddlewareArgs,
  userQuery: string,
  message: ChatPostMessageResponse
) => {
  const {
    client,
    context: { teamId: teamId },
    logger
  } = args;

  if (teamId !== undefined) {
    const { email, companyUuid } = await database.get(teamId);
    const { accessToken } = await adminClient.fetchUserData(email!);
    const params = { userQuery: userQuery, userToken: accessToken, companyUuid: companyUuid };
    await workbotClient.getQueryResponse(params, client, message, logger);
  } else {
    logger.error('Invalid Request!');
  }
};
