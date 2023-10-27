import { DbClient } from '~/database/config';
import { WorkbotSchema } from '~/database/schema';
import { PutCommand, GetCommand, DeleteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

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

  async get(key: string): Promise<WorkbotSchema> {
    try {
      const command = new GetCommand({
        TableName: this.TableName,
        Key: {
          teamId: key
        }
      });

      const data = await this.Client.send(command);

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

      return await this.Client.send(command);
    } catch (e) {
      console.error(e);
    }

    throw new Error('Error in deleting user data!');
  }

  async update(team_id: string, key: string, value: string | null): Promise<any> {
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

      return await this.Client.send(command);
    } catch (e) {
      console.error(e);
    }

    throw new Error('Error in updating user data!');
  }
}
