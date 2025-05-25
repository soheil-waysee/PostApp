import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { routes, Handlers } from '@/api/routes/routes';
import { API } from '@/constants/aws';
import { stageName } from '@/config/env';
import { createTables } from '@/dynamodb';
import { createRouter } from '@/api/routes/createRouter';

export class PostAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const api = new apigateway.RestApi(this, API.ID, {
      restApiName: API.NAME,
      deployOptions: {
        stageName,
      },
    });

    const {
      [Handlers.SHIPMENTS_CREATE_EVENT]: shipmentsCreateEventLambda,
      [Handlers.SHIPMENTS_GET_HISTORY]: shipmentsGetHistoryLambda,
      [Handlers.SHIPMENTS_GET_LATEST]: shipmentsGetLatestLambda,
    } = createRouter(this, api, routes);
    const { shipmentEventTable } = createTables(this);

    shipmentEventTable.grantWriteData(shipmentsCreateEventLambda);
    shipmentEventTable.grantReadData(shipmentsGetHistoryLambda);
    shipmentEventTable.grantReadData(shipmentsGetLatestLambda);
  }
}
