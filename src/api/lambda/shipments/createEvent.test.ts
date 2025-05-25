import { handler } from '@/api/lambda/shipments/createEvent';
import { createShipmentEvent } from '@/dynamodb/tables/shipment/service';
import { TableNames } from '@/dynamodb/constants';
import * as validation from 'lambda-layers';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
jest.mock('@/utils/logger');

import { getLogger } from '@/utils/logger';

jest.mock('@/dynamodb/tables/shipment/service');
jest.mock('lambda-layers', () => ({
  validateAgainstSchema: jest.fn(),
  EventSchema: {},
}));

describe('createEvent Lambda', () => {
  const mockShipmentId = 'SHIP-12345';

  const baseEvent = {
    httpMethod: 'POST',
    pathParameters: { shipmentId: mockShipmentId },
    body: '',
  } as unknown as APIGatewayProxyEvent;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if shipmentId is missing', async () => {
    const response = await handler({ ...baseEvent, pathParameters: null }, {} as Context);
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).message).toBe('Shipment ID is required');
  });

  it('should return 400 if validation fails', async () => {
    (validation.validateAgainstSchema as jest.Mock).mockReturnValue({
      valid: false,
      errors: ['timestamp is required'],
    });

    const event = {
      ...baseEvent,
      body: JSON.stringify({ status: 'delivered' }),
    };

    const response = await handler(event, {} as Context);
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      message: 'Invalid parameters',
      errors: ['timestamp is required'],
    });
  });

  it('should return 201 and created shipment event on success', async () => {
    const mockPayload = {
      timestamp: new Date().toISOString(),
      status: 'delivered',
      location: 'Stockholm',
      details: 'Delivered successfully',
    };

    (validation.validateAgainstSchema as jest.Mock).mockReturnValue({
      valid: true,
      errors: [],
      values: mockPayload,
    });

    (createShipmentEvent as jest.Mock).mockResolvedValue({
      ...mockPayload,
      shipmentId: mockShipmentId,
    });

    const event = {
      ...baseEvent,
      body: JSON.stringify(mockPayload),
    };

    const response = await handler(event, {} as Context);
    expect(response.statusCode).toBe(201);

    const body = JSON.parse(response.body);
    expect(body.shipmentId).toBe(mockShipmentId);
    expect(body.status).toBe('delivered');

    expect(createShipmentEvent).toHaveBeenCalledWith(TableNames.SHIPMENT_EVENT_TABLE, {
      ...mockPayload,
      shipmentId: mockShipmentId,
    });
  });

  it('should return 500 on unexpected error', async () => {
    (validation.validateAgainstSchema as jest.Mock).mockReturnValue({ valid: true, errors: [] });
    (createShipmentEvent as jest.Mock).mockRejectedValue(new Error('Database error'));

    const event = {
      ...baseEvent,
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        status: 'delivered',
      }),
    };

    const response = await handler(event, {} as Context);
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).message).toBe('Internal server error');

    const loggerInstance = (getLogger as jest.Mock).mock.results[0].value;
    expect(loggerInstance.error).toHaveBeenCalledWith('createEvent failed', expect.any(Error));
  });
});
