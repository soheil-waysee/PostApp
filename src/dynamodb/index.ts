import { Construct } from 'constructs';
import { createShipmentTable } from './tables/shipment/createShipment';
import { TableNames } from './constants';

export function createTables(scope: Construct): {
  shipmentEventTable: ReturnType<typeof createShipmentTable>;
} {
  const shipmentEventTable = createShipmentTable(scope, TableNames.SHIPMENT_EVENT_TABLE);
  return {
    shipmentEventTable,
  };
}
