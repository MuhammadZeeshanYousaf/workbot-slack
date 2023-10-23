import { DbClient } from '~/database/config';
import { WorkbotSchema } from '~/database/schema';
import { PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { SlackInstallation } from '~/globals';

export class Database {
  private Client = DbClient;
  private TableName!: string;

  constructor() {
    this.Client = DbClient;
    this.TableName = process.env.AWS_DYNAMODB_TABLE!;
  }

  async set(data: WorkbotSchema): Promise<any> {
    try {
      const command = new PutCommand({
        TableName: this.TableName,
        Item: data
      });

      return await this.Client.send(command);
    } catch (e) {
      console.error(e);
    }

    throw new Error('Error in storing user data!');
  }

  async get(key: string): Promise<SlackInstallation> {
    try {
      const command = new GetCommand({
        TableName: this.TableName,
        Key: {
          teamId: key
        }
      });

      const data = await this.Client.send(command);

      const installation: SlackInstallation = {
        bot: {
          id: data.Item?.botId,
          token: data.Item?.botToken,
          userId: data.Item?.botUserId
        }
      };

      return installation;
    } catch (e) {
      console.error(e);
    }

    throw new Error('Error in fetching user data!');
  }

  async delete(key: string) {}
}
