import { getLogger } from './logger';

describe('logger', () => {
  let logger: ReturnType<typeof getLogger>;
  let spy: jest.SpyInstance;

  const fixedDate = '2025-05-21T12:00:00.000Z';
  const context = {
    functionName: 'TestContext',
  } as any;

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date(fixedDate));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    spy = jest.spyOn(console, 'log').mockImplementation();
    logger = getLogger(context);
  });

  afterEach(() => {
    spy.mockRestore();
  });

  it('should log info with context and data', () => {
    logger.info('Hello', { data: { key: 'value' } });

    const expected = {
      timestamp: fixedDate,
      level: 'INFO',
      message: 'Hello',
      functionName: 'TestContext',
      identity: null,
      clientContext: null,
      data: { key: 'value' },
    };
    const logged = JSON.parse(spy.mock.calls[0][0]);
    expect(logged).toEqual(expected);
  });

  it('should log warn without context or data', () => {
    logger.warn('Something strange happened');

    const expected = {
      timestamp: fixedDate,
      level: 'WARN',
      message: 'Something strange happened',
      functionName: 'TestContext',
      identity: null,
      clientContext: null,
    };
    const logged = JSON.parse(spy.mock.calls[0][0]);
    expect(logged).toEqual(expected);
  });

  it('should log error with data only', () => {
    const error = new Error('Failed');
    logger.error('Critical failure', error, { code: 500 });

    const logged = JSON.parse(spy.mock.calls[0][0]);

    expect(logged).toMatchObject({
      timestamp: fixedDate,
      level: 'ERROR',
      message: 'Critical failure',
      functionName: 'TestContext',
      code: 500,
      error: {
        name: 'Error',
        message: 'Failed',
        stack: expect.any(String),
      },
    });
  });

  it('should log debug with extra fields', () => {
    logger.debug('Debugging', { context: 'System', active: true });

    const logged = JSON.parse(spy.mock.calls[0][0]);

    expect(logged).toMatchObject({
      timestamp: fixedDate,
      level: 'DEBUG',
      message: 'Debugging',
      functionName: 'TestContext',
      context: 'System',
      active: true,
    });
  });
});
