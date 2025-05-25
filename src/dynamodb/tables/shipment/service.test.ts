import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { createShipmentEvent, getLatestEvent, getEventHistory } from './service';
import { getDynamoClientForTable } from '../client';
import { ShipmentStatus } from '@/shared/types';

jest.mock('../client', () => ({
  getDynamoClientForTable: jest.fn(),
}));

const mockSend = jest.fn();
const mockClient = {
  send: mockSend,
} as Partial<DynamoDBDocumentClient> as DynamoDBDocumentClient;

beforeEach(() => {
  jest.clearAllMocks();
  (getDynamoClientForTable as jest.Mock).mockReturnValue(mockClient);
});

describe('shipmentEvent functions', () => {
  const tableName = 'ShipmentEvents';
  const baseEvent = {
    shipmentId: 'abc123',
    timestamp: '2025-05-22T10:00:00.000Z',
    type: 'CREATED',
    status: 'pending' as ShipmentStatus,
  };

  test('createShipmentEvent should put event with metadata', async () => {
    mockSend.mockResolvedValueOnce({});

    const result = await createShipmentEvent(tableName, baseEvent, mockClient);

    expect(mockSend).toHaveBeenCalledTimes(1);
    const sentCommand = mockSend.mock.calls[0][0];

    expect(sentCommand).toBeInstanceOf(PutCommand);
    expect(sentCommand.input).toMatchObject({
      TableName: tableName,
      Item: expect.objectContaining({
        shipmentId: baseEvent.shipmentId,
        type: baseEvent.type,
        status: baseEvent.status,
        id: `${baseEvent.shipmentId}-${baseEvent.timestamp}`,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    });

    expect(result.id).toBe(`${baseEvent.shipmentId}-${baseEvent.timestamp}`);
  });

  test('getLatestEvent should query with correct parameters', async () => {
    const item = { ...baseEvent, id: 'abc123-2025-05-22T10:00:00.000Z' };
    mockSend.mockResolvedValueOnce({ Items: [item] });

    const result = await getLatestEvent(tableName, baseEvent.shipmentId, mockClient);

    expect(mockSend).toHaveBeenCalledTimes(1);
    const sentCommand = mockSend.mock.calls[0][0];

    expect(sentCommand).toBeInstanceOf(QueryCommand);

    expect(result).toEqual(item);
  });

  test('getEventHistory should return events and lastEvaluatedKey', async () => {
    const items = [{ ...baseEvent, id: 'abc123-2025-05-22T10:00:00.000Z' }];
    const lastKey = { id: 'abc123-older' };

    mockSend.mockResolvedValueOnce({ Items: items, LastEvaluatedKey: lastKey });

    const result = await getEventHistory(
      tableName,
      baseEvent.shipmentId,
      10,
      undefined,
      mockClient,
    );

    expect(mockSend).toHaveBeenCalledTimes(1);
    const sentCommand = mockSend.mock.calls[0][0];

    expect(sentCommand).toBeInstanceOf(QueryCommand);
    expect(sentCommand.input).toMatchObject({
      TableName: tableName,
      KeyConditionExpression: 'shipmentId = :shipmentId',
      ExpressionAttributeValues: { ':shipmentId': baseEvent.shipmentId },
      ScanIndexForward: false,
      Limit: 10,
      ExclusiveStartKey: undefined,
    });

    expect(result).toEqual({
      events: items,
      lastEvaluatedKey: lastKey,
    });
  });
});
