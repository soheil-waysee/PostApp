import { isProd } from '@/config/env';
import { RemovalPolicy } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export function createShipmentTable(scope: Construct, tableName: string): dynamodb.Table {
  const table = new dynamodb.Table(scope, tableName, {
    tableName,
    partitionKey: { name: 'shipmentId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    pointInTimeRecoverySpecification: {
      pointInTimeRecoveryEnabled: true,
    },
  });

  if (!isProd) {
    table.applyRemovalPolicy(RemovalPolicy.DESTROY);
  }

  return table;
}
