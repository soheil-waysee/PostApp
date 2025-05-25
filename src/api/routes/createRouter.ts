import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as path from 'path';
import { Route } from './routes';
import { NODE_RUNTIME } from '@/constants/aws';
import { LAYERS } from '@/shared/types';
import { sanitizeId } from '../utils/sanitizeId';

export function createRouter(scope: Construct, api: apigateway.RestApi, routes: Route[]) {
  const lambdas: { [key: string]: any } = {};
  const layers = {
    [LAYERS.VALIDATION]: new lambda.LayerVersion(scope, 'ValidationLayer', {
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../lambda-layers/dist/lambda-layers.zip'),
      ),
      compatibleRuntimes: [NODE_RUNTIME],
      description: 'Reusable validation functions',
    }),
  };

  const docsLambda = new lambda.Function(scope, 'DocsHandler', {
    runtime: NODE_RUNTIME,
    handler: 'api/lambda/docs.handler',
    code: lambda.Code.fromAsset('dist'),
  });
  const openApiResource = createNestedResource(api.root, 'openapi.json');
  openApiResource.addMethod('GET', new apigateway.LambdaIntegration(docsLambda));

  for (const route of routes) {
    const handler = route.handler;
    const lambdaFunction = new lambda.Function(
      scope,
      sanitizeId(`${route.method}_${route.path}_Handler`),
      {
        runtime: NODE_RUNTIME,
        layers: route.layers?.map((key: LAYERS) => layers[key]),
        environment: {
          NODE_PATH: '/opt',
        },
        handler,
        code: lambda.Code.fromAsset('dist'),
      },
    );

    lambdas[handler] = lambdaFunction;
    const integration = new apigateway.LambdaIntegration(lambdaFunction);

    const resource = createNestedResource(api.root, route.path);
    resource.addMethod(route.method, integration);
  }
  return lambdas;
}

export function createNestedResource(
  root: apigateway.IResource,
  fullPath: string,
): apigateway.IResource {
  const parts = fullPath.split('/');

  return parts.reduce((resource, part) => {
    const cleanPart = part.startsWith(':') ? `{${part.slice(1)}}` : part;
    return resource.getResource(cleanPart) ?? resource.addResource(cleanPart);
  }, root);
}
