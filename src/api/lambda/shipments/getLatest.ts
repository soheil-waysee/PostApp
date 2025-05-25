import { TableNames } from '@/dynamodb/constants';
import { getLatestEvent } from '@/dynamodb/tables/shipment/service';
import { getLogger } from '@/utils/logger';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

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

    const latestEvent = await getLatestEvent(TableNames.SHIPMENT_EVENT_TABLE, shipmentId);
    if (!latestEvent) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No events found for this shipment' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(latestEvent),
    };
  } catch (error) {
    logger.error('createEvent failed', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}
