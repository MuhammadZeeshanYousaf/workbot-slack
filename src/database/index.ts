import { DbClient } from '~/database/config';
import { WorkbotSchema } from '~/database/schema';
import {
  PutCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
  ScanCommand,
  DynamoDBDocumentClient
} from '@aws-sdk/lib-dynamodb';
import { ChannelConversation } from '~/globals';

export class Database {
  private DocClient!: DynamoDBDocumentClient;
  private TableName!: string;

  constructor() {
    this.DocClient = DynamoDBDocumentClient.from(DbClient);
    this.TableName = process.env.AWS_DYNAMODB_TABLE!;
  }

  async set(data: WorkbotSchema): Promise<any> {
    try {
      const command = new PutCommand({
        TableName: this.TableName,
        Item: data
      });

      return await this.DocClient.send(command);
    } catch (e) {
      console.error(e);
    }

    throw new Error('Error in storing user data!');
  }

  async get(key: string): Promise<WorkbotSchema> {
    try {
      const command = new GetCommand({
        TableName: this.TableName,
        Key: {
          teamId: key
        }
      });

      const data = await this.DocClient.send(command);

      return data.Item as WorkbotSchema;
    } catch (e) {
      console.error(e);
    }

    throw new Error('Error in fetching user data!');
  }

  async delete(key: string): Promise<any> {
    try {
      const command = new DeleteCommand({
        TableName: this.TableName,
        Key: {
          teamId: key
        }
      });

      return await this.DocClient.send(command);
    } catch (e) {
      console.error(e);
    }

    throw new Error('Error in deleting user data!');
  }

  async update(team_id: string, key: string, value: string | object | null): Promise<any> {
    try {
      const command = new UpdateCommand({
        TableName: this.TableName,
        Key: {
          teamId: team_id
        },
        UpdateExpression: `set ${key} = :newValue`,
        ExpressionAttributeValues: {
          ':newValue': value
        },
        ReturnValues: 'ALL_NEW'
      });

      const updated = await this.DocClient.send(command);
      return updated.Attributes;
    } catch (e) {
      console.error(e);
    }

    throw new Error('Error in updating user data!');
  }

  async unLinkCompany(team_id: string) {
    try {
      const command = new UpdateCommand({
        TableName: this.TableName,
        Key: {
          teamId: team_id
        },
        UpdateExpression: `set linkedCompanyUuid = :Null, channelConversations = :Empty`,
        ExpressionAttributeValues: {
          ':Null': null,
          ':Empty': {}
        },
        ReturnValues: 'ALL_NEW'
      });

      const updated = await this.DocClient.send(command);
      return updated.Attributes;
    } catch (e) {
      console.error(e);
    }

    throw new Error('Error in unlinking company data!');
  }

  async updateConversations(
    team_id: string,
    channelId: string,
    conversation: ChannelConversation,
    channelConversations?: object
  ) {
    if (channelConversations === undefined) {
      const data = await this.get(team_id);
      channelConversations = data.channelConversations;
    }
    channelConversations[channelId] = conversation;

    return await this.update(team_id, 'channelConversations', channelConversations);
  }

  async scanByLinkedBy(linkedByValue: string): Promise<WorkbotSchema[]> {
    try {
      const command = new ScanCommand({
        TableName: this.TableName,
        FilterExpression: 'linkedBy = :value',
        ExpressionAttributeValues: {
          ':value': linkedByValue
        }
      });

      const data = await this.DocClient.send(command);

      return data.Items as WorkbotSchema[];
    } catch (e) {
      console.error(e);
    }

    throw new Error('Error in scanning by linkedBy (WorkHub email) key attribute!');
  }
}
