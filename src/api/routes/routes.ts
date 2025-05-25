import { isProd } from '@/config/env';
import { LAYERS } from '@/shared/types';

export enum Handlers {
  HEALTH = 'health.handler',
  SHIPMENTS_GET_HISTORY = 'shipments/getHistory.handler',
  SHIPMENTS_GET_LATEST = 'shipments/getLatest.handler',
  SHIPMENTS_CREATE_EVENT = 'shipments/createEvent.handler',
  DOCS = 'docs.handler',
}

export type Route = {
  method: 'GET' | 'POST';
  path: string;
  handler: string;
  layers?: LAYERS[];
};

export const routes: Route[] = [
  {
    method: 'GET',
    path: 'health',
    handler: Handlers.HEALTH,
  },
  {
    method: 'GET',
    path: 'shipments/{shipmentId}/events',
    handler: Handlers.SHIPMENTS_GET_HISTORY,
    layers: [LAYERS.VALIDATION],
  },
  {
    method: 'GET',
    path: 'shipments/{shipmentId}/events/latest',
    handler: Handlers.SHIPMENTS_GET_LATEST,
    layers: [LAYERS.VALIDATION],
  },
  {
    method: 'POST',
    path: 'shipments/{shipmentId}/events',
    handler: Handlers.SHIPMENTS_CREATE_EVENT,
    layers: [LAYERS.VALIDATION],
  },
  ...(!isProd
    ? [
        <Route>{
          method: 'GET',
          path: 'docs',
          handler: Handlers.DOCS,
        },
      ]
    : []),
];
