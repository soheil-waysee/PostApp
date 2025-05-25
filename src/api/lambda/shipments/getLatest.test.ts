import { handler } from '@/api/lambda/shipments/getLatest';
import { getLatestEvent } from '@/dynamodb/tables/shipment/service';
import { TableNames } from '@/dynamodb/constants';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
jest.mock('@/utils/logger');
jest.mock('@/dynamodb/tables/shipment/service');

describe('getLatestEvent Lambda', () => {
  const mockShipmentId = 'SHIP-12345';

  const baseEvent = {
    httpMethod: 'GET',
    pathParameters: { shipmentId: mockShipmentId },
  } as unknown as APIGatewayProxyEvent;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if shipmentId is missing', async () => {
    const event = { ...baseEvent, pathParameters: null };
    const response = await handler(event, {} as Context);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({ message: 'Shipment ID is required' });
  });

  it('should return 404 if no event is found', async () => {
    (getLatestEvent as jest.Mock).mockResolvedValue(undefined);

    const response = await handler(baseEvent, {} as Context);

    expect(getLatestEvent).toHaveBeenCalledWith(TableNames.SHIPMENT_EVENT_TABLE, mockShipmentId);

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body)).toEqual({
      message: 'No events found for this shipment',
    });
  });

  it('should return 200 and the latest event', async () => {
    const mockEvent = {
      shipmentId: mockShipmentId,
      status: 'delivered',
      timestamp: new Date().toISOString(),
    };

    (getLatestEvent as jest.Mock).mockResolvedValue(mockEvent);

    const response = await handler(baseEvent, {} as Context);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(mockEvent);
  });

  it('should return 500 if an error is thrown', async () => {
    (getLatestEvent as jest.Mock).mockRejectedValue(new Error('Database error'));

    const response = await handler(baseEvent, {} as Context);
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({
      message: 'Internal server error',
    });
  });
});
