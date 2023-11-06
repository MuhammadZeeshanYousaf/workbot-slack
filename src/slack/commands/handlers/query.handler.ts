import { AllMiddlewareArgs, SlackCommandMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';
import { database } from '~/app';
import { adminClient } from '~/clients/admin.client';
import { workbotClient } from '~/clients/workbot.client';
import { PostQueryParams, STATUSCODE } from '~/globals';

export const queryHandler = async (
  args: (SlackEventMiddlewareArgs<'app_mention'> | SlackEventMiddlewareArgs<'message'>) & AllMiddlewareArgs,
  userQuery: string,
  channelId: string
) => {
  const {
    say,
    context: { teamId: teamId },
    logger
  } = args;

  if (teamId !== undefined) {
    const data = await database.get(teamId);
    const { linkedBy, linkedCompanyUuid } = data;
    let channelConversations = data.channelConversations;
    if (!channelConversations) channelConversations = {};
    let conversationUuid = channelConversations?.[channelId];

    if (linkedCompanyUuid !== undefined && linkedCompanyUuid !== null && linkedCompanyUuid !== '') {
      const message = await say(`Please wait....`);
      const { userToken } = await adminClient.fetchUserData(linkedBy!);

      if (conversationUuid === undefined || conversationUuid === null) {
        let conversationResponse = await workbotClient.createConversation(
          {
            userToken: userToken,
            companyUuid: linkedCompanyUuid
          },
          logger
        );

        if (conversationResponse.status === STATUSCODE.CREATED) {
          conversationUuid = channelConversations[channelId] = conversationResponse.uuid;
          await database.update(teamId, 'channelConversations', channelConversations);
        } else {
          return await say('Error in creating your conversation!');
        }
      }

      const params: PostQueryParams = {
        userQuery: userQuery,
        userToken: userToken,
        companyUuid: linkedCompanyUuid,
        conversationUuid: conversationUuid,
        channelConversations: channelConversations,
        channelId: channelId
      };

      await workbotClient.postQueryResponse(params, args, message);
    } else {
      await say(`No linked WorkHub Company found!`);
    }
  } else {
    logger.error('Invalid Request!');
  }
};
