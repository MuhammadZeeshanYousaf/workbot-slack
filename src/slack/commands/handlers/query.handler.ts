import { AllMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';
import { database } from '~/app';
import { adminClient } from '~/clients/admin.client';
import { workbotClient } from '~/clients/workbot.client';
import { WorkbotSchema } from '~/database/schema';
import { ChannelConversation, ErrorMessages, PostQueryParams, STATUSCODE } from '~/globals';
import { unlinkCompanyBlock } from '~/slack/blocks';

export const queryHandler = async (
  args: (SlackEventMiddlewareArgs<'app_mention'> | SlackEventMiddlewareArgs<'message'>) & AllMiddlewareArgs,
  userQuery: string,
  userEmail: string,
  channelId: string
) => {
  const {
    say,
    context: { teamId: teamId },
    logger
  } = args;

  if (teamId !== undefined) {
    const data = await database.get(teamId);
    const { linkedCompanyUuid } = data;
    let channelConversations = data.channelConversations;
    if (!channelConversations) channelConversations = {};
    let conversationUuid = channelConversations?.[channelId]?.conversationUuid;
    const conversationOwnerEmail = channelConversations?.[channelId]?.ownerEmail;

    if (
      linkedCompanyUuid !== undefined &&
      linkedCompanyUuid !== null &&
      linkedCompanyUuid != 'null' &&
      linkedCompanyUuid != ''
    ) {
      // company is linked
      const message = await say(`Please wait....`);
      const { userToken, uuid } = await adminClient.fetchUserData(userEmail);

      if (
        userToken === null ||
        userToken === undefined ||
        userToken == 'null' ||
        userToken == '' ||
        uuid === null ||
        uuid === undefined ||
        uuid == 'null' ||
        uuid == ''
      ) {
        // not a workhub user
        return await say(ErrorMessages.NoWorkhubAccount);
      }

      // an authorized workhub user
      if (
        conversationUuid === undefined ||
        conversationUuid === null ||
        conversationUuid == 'null' ||
        conversationUuid == '' ||
        conversationOwnerEmail === undefined ||
        conversationOwnerEmail === null ||
        conversationOwnerEmail == 'null' ||
        conversationOwnerEmail == ''
      ) {
        // conversation was not made in this channel
        const conversationResponse = await workbotClient.createConversation({
          userToken: userToken,
          companyUuid: linkedCompanyUuid
        });


        if (+conversationResponse.status == STATUSCODE.CREATED) {
          conversationUuid = conversationResponse.uuid;
          const newConversation: ChannelConversation = { conversationUuid: conversationUuid, ownerEmail: userEmail };

          await database.updateConversations(teamId, channelId, newConversation, channelConversations);
        } else {
          return await say('_Failed to establish your conversation with WorkBot!_');
        }
      }

      // conversation was created or fetched for this channel
      if (
        conversationOwnerEmail !== undefined &&
        conversationOwnerEmail !== null &&
        conversationOwnerEmail != 'null' &&
        conversationOwnerEmail != '' &&
        userEmail != conversationOwnerEmail
      ) {
        // query recieved from non conversation user
        // add the user as member of this conversation
        const ownerData = await adminClient.fetchUserData(conversationOwnerEmail);

        const addConversationRes = await workbotClient.addConversationMember({
          ownerToken: ownerData.userToken,
          conversationUuid: conversationUuid,
          memberUuid: uuid
        });

        if (+addConversationRes.status !== STATUSCODE.CREATED) {
          // user was not added to conversation
          return await say(
            '_Failed to add you to this conversation. Either you are not a part of linked WorkHub company or you do not have exisiting WorkHub account._'
          );
        }
      }

      // finally post query response back to Slack
      const params: PostQueryParams = {
        userQuery: userQuery,
        userToken: userToken,
        userUuid: uuid,
        userEmail: userEmail,
        ownerEmail: conversationOwnerEmail,
        companyUuid: linkedCompanyUuid,
        conversationUuid: conversationUuid,
        channelConversations: channelConversations,
        channelId: channelId
      };
      await workbotClient.postQueryResponse(params, args, message);
    } else {
      // company was not linked
      await say(unlinkCompanyBlock('No linked WorkHub Company found!'));
    }
  } else {
    logger.error('Invalid Request!');
  }
};
