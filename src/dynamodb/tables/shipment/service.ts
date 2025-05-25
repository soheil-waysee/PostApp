import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

import { getDynamoClientForTable } from '../client';
import { ShipmentEvent, ShipmentEventResponse } from '@/shared/types';
import { TableNames } from '@/dynamodb/constants';

const client = getDynamoClientForTable(TableNames.SHIPMENT_EVENT_TABLE);
export async function createShipmentEvent(
  tableName: string,
  event: ShipmentEvent,
  docClient = client,
): Promise<ShipmentEventResponse> {
  const now = new Date().toISOString();
  const eventWithMetadata: ShipmentEventResponse = {
    ...event,
    id: `${event.shipmentId}-${event.timestamp}`,
    createdAt: now,
    updatedAt: now,
  };

  await docClient.send(
    new PutCommand({
      TableName: tableName,
      Item: eventWithMetadata,
    }),
  );

  return eventWithMetadata;
}

export async function getLatestEvent(
  tableName: string,
  shipmentId: string,
  docClient = client,
): Promise<ShipmentEventResponse | null> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: 'shipmentId = :shipmentId',
      ExpressionAttributeValues: {
        ':shipmentId': shipmentId,
      },
      ScanIndexForward: false,
      Limit: 1,
    }),
  );

  return (result.Items?.[0] as ShipmentEventResponse) || null;
}

export async function getEventHistory(
  tableName: string,
  shipmentId: string,
  limit: number = 50,
  lastEvaluatedKey?: Record<string, any>,
  docClient = client,
): Promise<{
  events: ShipmentEventResponse[];
  lastEvaluatedKey?: Record<string, any>;
}> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: 'shipmentId = :shipmentId',
      ExpressionAttributeValues: {
        ':shipmentId': shipmentId,
      },
      ScanIndexForward: false,
      Limit: limit,
      ExclusiveStartKey: lastEvaluatedKey,
    }),
  );

  return {
    events: (result.Items as ShipmentEventResponse[]) || [],
    lastEvaluatedKey: result.LastEvaluatedKey,
  };
}
