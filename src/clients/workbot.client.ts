import { ChatPostMessageResponse } from '@slack/web-api';
import { BaseClient } from './base.client';
import { AllMiddlewareArgs, SlackCommandMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';
import { ChannelConversation, PostQueryParams, STATUSCODE } from '~/globals';
import { database } from '~/app';
import mrkdwn from 'html-to-mrkdwn';
import { adminClient } from './admin.client';

class Workbot extends BaseClient {
  constructor() {
    super(process.env.WORKBOT_API_URL!);
  }

  async createConversation({ userToken, companyUuid }) {
    try {
      const {
        status,
        data: { uuid }
      } = await this.axios.post(
        `/companies/${companyUuid}/conversations`,
        {},
        {
          headers: { Authorization: `Bearer ${userToken}` }
        }
      );

      return { uuid: uuid, status: status };
    } catch (e) {
      return { uuid: null, status: e?.response?.status };
    }
  }

  async addConversationMember({ ownerToken, conversationUuid, memberUuid }) {
    try {
      const { status } = await this.axios.post(
        `/conversations/${conversationUuid}/users`,
        { conversation_users: [memberUuid] },
        { headers: { Authorization: `Bearer ${ownerToken}` } }
      );

      return { status: status };
    } catch (e) {
      return { status: e?.response?.status };
    }
  }

  async postQueryResponse(
    params: PostQueryParams,
    args: (SlackEventMiddlewareArgs<'app_mention'> | SlackEventMiddlewareArgs<'message'> | SlackCommandMiddlewareArgs) &
      AllMiddlewareArgs,
    message: ChatPostMessageResponse,
    retryOnError = true
  ) {
    let {
      userQuery,
      userToken,
      userUuid,
      userEmail,
      ownerEmail,
      companyUuid,
      conversationUuid,
      channelConversations,
      channelId
    } = params;
    const {
      client,
      context: { teamId: teamId },
      logger
    } = args;

    try {
      const response = await this.axios.post(
        `/conversations/${conversationUuid}/message`,
        { content: userQuery, format_output: true },
        {
          headers: { Authorization: `Bearer ${userToken}` },
          responseType: 'stream'
        }
      );
      const stream = response.data;
      const queryResponse: string[] = [];
      let maxThread = 0;

      stream.on('data', async (chunk: Buffer) => {
        const dataString: string = chunk.toString('utf8');
        queryResponse.push(dataString);
        ++maxThread;

        if (maxThread < 10) {
          return;
        }
        maxThread = 0;

        if (chunk.length > 0) {
          try {
            client.chat
              .update({
                channel: message.channel!,
                ts: message.ts!,
                text: `${mrkdwn(queryResponse.join('')).text}_`
              })
              .then(res => {
                message = res;
              });
            return;
          } catch (e) {
            logger.error('Tier pause in message updating:', e.message);
          }
        }
      });

      stream.on('end', () => {
        try {
          client.chat
            .update({
              channel: message.channel!,
              ts: message.ts!,
              text: `${mrkdwn(queryResponse.join('')).text}`
            })
            .then(res => {
              message = res;
            });
          return;
        } catch (e) {
          logger.error('Tier pause in message updating:', e.message);
        }
        stream.destroy();
      });

      return { status: response.status };
    } catch (error) {
      if (retryOnError) {
        if (this.hasStatus(error, STATUSCODE.NOT_FOUND)) {
          // conversation was deleted by another source, create new one
          let conversationRes = await this.createConversation({
            userToken: userToken,
            companyUuid: companyUuid
          });

          if (+conversationRes.status == STATUSCODE.CREATED) {
            if (!channelConversations) channelConversations = {};
            conversationUuid = conversationRes.uuid;
            const newConversation: ChannelConversation = { conversationUuid: conversationUuid, ownerEmail: userEmail };
            await database.updateConversations(teamId!, channelId, newConversation, channelConversations);

            this.postQueryResponse(
              { ...params, conversationUuid: conversationUuid, channelConversations: channelConversations },
              args,
              message,
              false
            );
          }
        } else if (this.hasStatus(error, STATUSCODE.UNAUTHORIZED)) {
          // add the user as member of this conversation
          const ownerData = await adminClient.fetchUserData(ownerEmail);
          const addConvRes = await this.addConversationMember({
            ownerToken: ownerData.userToken,
            conversationUuid: conversationUuid,
            memberUuid: userUuid
          });

          if (+addConvRes.status == STATUSCODE.CREATED) {
            this.postQueryResponse(params, args, message, false);
          }
        }
      } else {
        logger?.error(error);
      }
    }
  }
}

export const workbotClient = new Workbot();
