export type ShipmentStatus =
  | 'in_transit'
  | 'delivered'
  | 'attempted_delivery'
  | 'out_for_delivery'
  | 'arrived_at_facility'
  | 'departed_facility'
  | 'exception';

export interface ShipmentEvent {
  shipmentId: string;
  timestamp: string;
  status: ShipmentStatus;
  location?: string;
  details?: string;
}

export interface CreateShipmentEventRequest {
  timestamp: string;
  status: ShipmentStatus;
  location?: string;
  details?: string;
}

export interface ShipmentEventResponse extends ShipmentEvent {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetShipmentEventsResponse {
  events: ShipmentEventResponse[];
  lastEvaluatedKey?: string;
}

export enum LAYERS {
  VALIDATION,
}
