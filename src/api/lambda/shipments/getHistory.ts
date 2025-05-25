import { TableNames } from '@/dynamodb/constants';
import { getEventHistory } from '@/dynamodb/tables/shipment/service';
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

    const limit = parseInt(event.queryStringParameters?.limit || '50', 10);
    const lastEvaluatedKey = event.queryStringParameters?.lastEvaluatedKey
      ? JSON.parse(decodeURIComponent(event.queryStringParameters.lastEvaluatedKey))
      : undefined;

    const result = await getEventHistory(
      TableNames.SHIPMENT_EVENT_TABLE,
      shipmentId,
      limit,
      lastEvaluatedKey,
    );

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    logger.error('getHistory failed', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}
