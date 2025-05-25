import { APP_PREFIX, ENV } from '@/config/env';

enum TableResource {
  SHIPMENT_EVENT_TABLE = 'SHIPMENT_EVENT_TABLE_4',
}

function getTableName(resource: TableResource): string {
  return `${APP_PREFIX}-${ENV}-${resource}`;
}

export const TableNames = {
  SHIPMENT_EVENT_TABLE: getTableName(TableResource.SHIPMENT_EVENT_TABLE),
};
