import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { getDynamoClientForTable } from '../client';
import { TableNames } from '@/dynamodb/constants';

const docClient = getDynamoClientForTable(TableNames.SHIPMENT_EVENT_TABLE);

const seedShipment = async (shipmentId: string) => {
  const events = [
    {
      shipmentId: 'SHIP-12345',
      timestamp: '2025-05-20T08:00:00Z',
      createdAt: '2025-05-20T08:00:00Z',
      status: 'created',
      location: 'Stockholm',
      details: 'Shipment created',
    },
    {
      shipmentId: 'SHIP-12345',
      timestamp: '2025-05-20T12:00:00Z',
      createdAt: '2025-05-20T12:00:00Z',
      status: 'picked_up',
      location: 'Stockholm',
      details: 'Picked up by carrier',
    },
    {
      shipmentId: 'SHIP-12345',
      timestamp: '2025-05-21T09:30:00Z',
      createdAt: '2025-05-21T09:30:00Z',
      status: 'in_transit',
      location: 'Copenhagen',
      details: 'Departed sorting facility',
    },
    {
      shipmentId: 'SHIP-12345',
      timestamp: '2025-05-22T17:45:00Z',
      createdAt: '2025-05-22T17:45:00Z',
      status: 'delivered',
      location: 'Berlin',
      details: 'Delivered to recipient',
    },
  ];

  for (const event of events) {
    const item = {
      shipmentId,
      timestamp: event.timestamp,
      createdAt: event.createdAt,
      status: event.status,
      location: event.location,
      details: event.details,
    };

    await docClient.send(
      new PutCommand({
        TableName: TableNames.SHIPMENT_EVENT_TABLE,
        Item: item,
      }),
    );

    console.log(`Seeded event: ${event.status} at ${event.timestamp}`);
  }
};

seedShipment('SHIP-12345').catch(console.error);
