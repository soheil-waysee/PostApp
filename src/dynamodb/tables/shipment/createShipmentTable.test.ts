import { App, Stack } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { createShipmentTable } from './createShipment';

describe('createShipmentTable', () => {
  it('should create a DynamoDB table with correct schema and GSI', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    createShipmentTable(stack, 'ShipmentEventTable');

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::DynamoDB::Table', {
      TableName: 'ShipmentEventTable',
      BillingMode: 'PAY_PER_REQUEST',
      KeySchema: [
        { AttributeName: 'shipmentId', KeyType: 'HASH' },
        { AttributeName: 'timestamp', KeyType: 'RANGE' },
      ],
      PointInTimeRecoverySpecification: {
        PointInTimeRecoveryEnabled: true,
      },
    });
  });
});
