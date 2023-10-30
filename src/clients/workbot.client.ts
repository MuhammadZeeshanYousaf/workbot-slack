import { ChatPostMessageResponse, WebClient } from '@slack/web-api';
import { BaseClient } from './base.client';
import { Logger } from '@slack/bolt';

class Workbot extends BaseClient {
  constructor() {
    super(process.env.WORKBOT_API_URL!);
  }

  async getQueryResponse(
    { userQuery, userToken, companyUuid },
    client: WebClient,
    message: ChatPostMessageResponse,
    logger?: Logger
  ) {
    try {
      const response = await this.axios.get(`/companies/${companyUuid}/query`, {
        responseType: 'stream',
        params: { query: userQuery },
        headers: { Authorization: `Bearer ${userToken}` }
      });
      const stream = response.data;
      const queryResponse: string[] = [];

      stream.on('data', async (chunk: Buffer) => {
        // Convert the buffer to a string and write to slack
        const dataString: string = chunk.toString('utf8');
        queryResponse.push(dataString);

        await client.chat.update({
          channel: message.channel!,
          ts: message.ts!,
          text: `${queryResponse.join('')}`
        });
        console.log('Response meta data => Chunk Length:', chunk.length, 'Data:', dataString);
      });

      stream.on('end', async () => {
        await client.chat.update({
          channel: message.channel!,
          ts: message.ts!,
          text: `${queryResponse.join('')}`
        });
      });
    } catch (error) {
      logger?.error(error);
    }
  }
}

export const workbotClient = new Workbot();
