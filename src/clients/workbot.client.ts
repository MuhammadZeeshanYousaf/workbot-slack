import { ChatPostMessageResponse } from '@slack/web-api';
import { BaseClient } from './base.client';
import { AllMiddlewareArgs, Logger, SlackCommandMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';
import { PostQueryParams, STATUSCODE } from '~/globals';
import { database } from '~/app';
import mrkdwn from 'html-to-mrkdwn';

class Workbot extends BaseClient {
  constructor() {
    super(process.env.WORKBOT_API_URL!);
  }

  async createConversation({ userToken, companyUuid }, logger?: Logger) {
    try {
      const {
        status,
        data: { uuid }
      } = await this.axios.post(
        `companies/${companyUuid}/conversations`,
        { name: 'New Slack Chat' },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      return { uuid: uuid, status: status };
    } catch (e) {
      logger?.error(e);
      return { status: e.status };
    }
  }

  async postQueryResponse(
    params: PostQueryParams,
    args: (SlackEventMiddlewareArgs<'app_mention'> | SlackEventMiddlewareArgs<'message'> | SlackCommandMiddlewareArgs) &
      AllMiddlewareArgs,
    message: ChatPostMessageResponse,
    retryOnError = true
  ) {
    let { userQuery, userToken, companyUuid, conversationUuid, channelConversations, channelId } = params;
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

      stream.on('data', (chunk: Buffer) => {
        const dataString: string = chunk.toString('utf8');
        queryResponse.push(dataString);

        if (chunk.length > 0) {
          try {
            client.chat
              .update({
                channel: message.channel!,
                ts: message.ts!,
                text: `${mrkdwn(queryResponse.join('')).text} `
              })
              .then(res => {
                message = res;
              });
          } catch (e) {
            logger.error('Tier pause in message updating:', e.message);
          }
        }

        console.info('Query Response meta data => Chunk length:', chunk.length, 'Data:', dataString);
      });

      return { status: response.status };
    } catch (error) {
      if (retryOnError) {
        let conversationRes = await workbotClient.createConversation(
          {
            userToken: userToken,
            companyUuid: companyUuid
          },
          logger
        );

        if (conversationRes?.status === STATUSCODE.CREATED) {
          if (!channelConversations) channelConversations = {};
          channelConversations[channelId] = conversationRes.uuid;
          await database.update(teamId!, 'channelConversations', channelConversations);
          this.postQueryResponse(
            { ...params, conversationUuid: conversationRes.uuid, channelConversations: channelConversations },
            args,
            message,
            false
          );
        }
      } else {
        logger?.error(error);
      }
    }
  }
}

export const workbotClient = new Workbot();
