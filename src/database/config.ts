import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

// Configure AWS credentials
const AwsCredentials = {
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};

export const DbClient = new DynamoDBClient(AwsCredentials);
