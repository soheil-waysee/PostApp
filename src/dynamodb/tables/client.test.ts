import { getDynamoClientForTable } from './client';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

describe('getDynamoClientForTable', () => {
  it('should return a DynamoDBDocumentClient instance when table name is provided', () => {
    const client = getDynamoClientForTable('MyTestTable');

    expect(client).toBeInstanceOf(DynamoDBDocumentClient);
  });

  it('should throw an error when table name is missing', () => {
    expect(() => getDynamoClientForTable('')).toThrowError(
      'Table name is required to create DynamoDB client',
    );

    expect(() => getDynamoClientForTable(undefined as any)).toThrowError(
      'Table name is required to create DynamoDB client',
    );
  });
});
