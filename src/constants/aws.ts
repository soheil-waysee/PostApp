import * as lambda from 'aws-cdk-lib/aws-lambda';

export const NODE_RUNTIME = lambda.Runtime.NODEJS_22_X;

export const API = {
  ID: 'PostApi',
  NAME: 'Post Service',
};
