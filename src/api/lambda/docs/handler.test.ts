import { handler } from './handler';
import api from './api.json';

describe('OpenAPI JSON Lambda', () => {
  it('should return 200 with correct OpenAPI body', async () => {
    const result = await handler();

    expect(result.statusCode).toBe(200);
    expect(result.headers).toEqual({
      'Content-Type': 'application/json',
    });
    expect(result.body).toEqual(api);
  });
});
