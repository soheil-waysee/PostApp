import { handler } from '@/api/lambda/health';
import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';

describe('health Lambda', () => {
  it('should return 200 and status ok', async () => {
    const response = (await handler(
      {} as APIGatewayProxyEvent,
      {} as Context,
      () => {},
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(JSON.stringify({ status: 'ok' }));
  });
});
