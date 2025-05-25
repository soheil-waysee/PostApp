import { handler } from '@/api/lambda/shipments/getHistory';
import { getEventHistory } from '@/dynamodb/tables/shipment/service';
import { TableNames } from '@/dynamodb/constants';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
jest.mock('@/utils/logger');
jest.mock('@/dynamodb/tables/shipment/service');

describe('getEventHistory Lambda', () => {
  const mockShipmentId = 'SHIP-12345';

  const baseEvent = {
    httpMethod: 'GET',
    pathParameters: { shipmentId: mockShipmentId },
    queryStringParameters: {},
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

  it('should call getEventHistory with default limit and no lastEvaluatedKey', async () => {
    const mockResult = { items: [{ status: 'delivered' }] };
    (getEventHistory as jest.Mock).mockResolvedValue(mockResult);

    const event = { ...baseEvent };
    const response = await handler(event, {} as Context);

    expect(getEventHistory).toHaveBeenCalledWith(
      TableNames.SHIPMENT_EVENT_TABLE,
      mockShipmentId,
      50,
      undefined,
    );

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(mockResult);
  });

  it('should handle custom limit and lastEvaluatedKey', async () => {
    const mockResult = { items: [{ status: 'in_transit' }] };
    (getEventHistory as jest.Mock).mockResolvedValue(mockResult);

    const lastKey = { shipmentId: 'SHIP-99999' };
    const event: APIGatewayProxyEvent = {
      ...baseEvent,
      queryStringParameters: {
        limit: '25',
        lastEvaluatedKey: encodeURIComponent(JSON.stringify(lastKey)),
      },
    };

    const response = await handler(event, {} as Context);
    expect(getEventHistory).toHaveBeenCalledWith(
      TableNames.SHIPMENT_EVENT_TABLE,
      mockShipmentId,
      25,
      lastKey,
    );

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(mockResult);
  });

  it('should return 500 if getEventHistory throws', async () => {
    (getEventHistory as jest.Mock).mockRejectedValue(new Error('DB error'));

    const response = await handler(baseEvent, {} as Context);
    expect(response.statusCode).toBe(500);
    const parsed = JSON.parse(response.body);
    expect(parsed.message).toBe('Internal server error');
  });
});
