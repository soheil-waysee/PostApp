import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const baseClient = new DynamoDBClient({});

const docClient = DynamoDBDocumentClient.from(baseClient, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

export function getDynamoClientForTable(tableName: string) {
  if (!tableName) {
    throw new Error('Table name is required to create DynamoDB client');
  }

  return docClient;
}
