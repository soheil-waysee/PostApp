import { Stack } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { createRouter } from './createRouter';
import { Handlers, Route } from './routes';
import { LAYERS } from '@/shared/types';

describe('createRouter', () => {
  let stack: Stack;
  let api: apigateway.RestApi;

  beforeEach(() => {
    stack = new Stack();
    api = new apigateway.RestApi(stack, 'TestApi');
  });

  it('should create Lambda functions and API Gateway methods for given routes', () => {
    const routes: Route[] = [
      {
        method: 'GET',
        path: 'shipments/{shipmentId}/events',
        handler: Handlers.SHIPMENTS_GET_HISTORY,
        layers: [LAYERS.VALIDATION],
      },
      {
        method: 'POST',
        path: 'shipments/{shipmentId}/events',
        handler: Handlers.SHIPMENTS_CREATE_EVENT,
        layers: [LAYERS.VALIDATION],
      },
    ];

    createRouter(stack, api, routes);
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::Lambda::Function', 3);
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: Handlers.SHIPMENTS_GET_HISTORY,
    });
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: Handlers.SHIPMENTS_CREATE_EVENT,
    });

    template.resourceCountIs('AWS::Lambda::LayerVersion', 1);

    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      AuthorizationType: 'NONE',
    });

    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'POST',
      AuthorizationType: 'NONE',
    });
  });

  it('should create a Lambda integration for docs handler', () => {
    createRouter(stack, api, []);
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'api/lambda/docs.handler',
    });

    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
    });
  });
});
