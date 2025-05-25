import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { createTables } from './index';
import { TableNames } from './constants';

describe('createTables', () => {
  it('should create the shipmentEventTable using createShipmentTable', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const result = createTables(stack);

    expect(result.shipmentEventTable).toBeDefined();

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::DynamoDB::Table', {
      TableName: TableNames.SHIPMENT_EVENT_TABLE,
    });
  });
});
