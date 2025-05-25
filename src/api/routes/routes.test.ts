import { routes, Handlers, Route } from './routes';
import { LAYERS } from '@/shared/types';

describe('Route definitions', () => {
  it('should include all expected routes', () => {
    const routePaths = routes.map((r) => r.path);
    expect(routePaths).toEqual(
      expect.arrayContaining([
        'health',
        'shipments/{shipmentId}/events',
        'shipments/{shipmentId}/events/latest',
        'docs',
      ]),
    );
  });

  it('should define correct handlers for each route', () => {
    const routeMap = Object.fromEntries(routes.map((r) => [r.path, r.handler]));

    expect(routeMap['health']).toBe(Handlers.HEALTH);
    expect(routeMap['shipments/{shipmentId}/events']).toBe(Handlers.SHIPMENTS_CREATE_EVENT);
    expect(routeMap['shipments/{shipmentId}/events/latest']).toBe(Handlers.SHIPMENTS_GET_LATEST);
    expect(routeMap['docs']).toBe(Handlers.DOCS);
  });

  it('should apply LAYERS.VALIDATION only to appropriate routes', () => {
    const validationRoutes = routes.filter((r) => r.layers?.includes(LAYERS.VALIDATION));
    const paths = validationRoutes.map((r) => r.path);

    expect(paths).toEqual(
      expect.arrayContaining([
        'shipments/{shipmentId}/events',
        'shipments/{shipmentId}/events/latest',
        'shipments/{shipmentId}/events',
      ]),
    );

    const noValidation = routes.find((r) => r.path === 'health');
    expect(noValidation?.layers).toBeUndefined();
  });

  it('should only include valid HTTP methods', () => {
    const validMethods = ['GET', 'POST'];
    for (const route of routes) {
      expect(validMethods).toContain(route.method);
    }
  });

  it('should have unique route + method combinations', () => {
    const seen = new Set<string>();
    for (const route of routes) {
      const key = `${route.method}:${route.path}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });
});
