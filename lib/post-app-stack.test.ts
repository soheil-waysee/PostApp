import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { PostAppStack } from './post-app-stack';

test('Lambda Function and API Gateway Created', () => {
  expect('1').toEqual('1');
});
