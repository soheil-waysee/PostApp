import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { createShipmentEvent } from '@/dynamodb/tables/shipment/service';
import { CreateShipmentEventRequest } from '@/shared/types';
import { TableNames } from '@/dynamodb/constants';
import { validateAgainstSchema, EventSchema } from 'lambda-layers';
import { getLogger } from '@/utils/logger';

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  const logger = getLogger(context);
  try {
    const shipmentId = event.pathParameters?.shipmentId;
    if (!shipmentId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Shipment ID is required' }),
      };
    }

    const body = JSON.parse(event.body || '{}') as CreateShipmentEventRequest;
    const { valid, errors, values } = validateAgainstSchema<CreateShipmentEventRequest>(
      body,
      EventSchema,
    );
    if (!valid) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Invalid parameters',
          errors: errors,
        }),
      };
    }
    const shipmentEvent = await createShipmentEvent(TableNames.SHIPMENT_EVENT_TABLE, {
      ...values,
      shipmentId,
    });

    return {
      statusCode: 201,
      body: JSON.stringify(shipmentEvent),
    };
  } catch (error) {
    logger.error('createEvent failed', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}
