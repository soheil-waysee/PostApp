import { Context, CognitoIdentity, ClientContext } from 'aws-lambda';

interface ExtraLogFields {
  [key: string]: any;
  error?: Error;
}

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  functionName?: string;
  functionVersion?: string;
  invokedFunctionArn?: string;
  memoryLimitInMB?: string;
  awsRequestId?: string;
  logGroupName?: string;
  logStreamName?: string;
  identity?: CognitoIdentity | null;
  clientContext?: ClientContext | null;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  [key: string]: any;
}

function log(level: string, message: string, extra: ExtraLogFields, context: Context): void {
  const { error, ...rest } = extra;

  const logEntry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    functionName: context.functionName,
    functionVersion: context.functionVersion,
    invokedFunctionArn: context.invokedFunctionArn,
    memoryLimitInMB: context.memoryLimitInMB,
    awsRequestId: context.awsRequestId,
    logGroupName: context.logGroupName,
    logStreamName: context.logStreamName,
    identity: context.identity || null,
    clientContext: context.clientContext || null,
    ...rest,
  };

  if (error) {
    const err: Error = error instanceof Error ? error : new Error(String(error));
    logEntry.error = {
      name: err.name,
      message: err.message,
      stack: err.stack,
    };
  }

  console.log(JSON.stringify(logEntry));
}

export function getLogger(context: Context) {
  return {
    info: (message: string, extra: ExtraLogFields = {}) => log('INFO', message, extra, context),
    debug: (message: string, extra: ExtraLogFields = {}) => log('DEBUG', message, extra, context),
    warn: (message: string, extra: ExtraLogFields = {}) => log('WARN', message, extra, context),
    error: (message: string, error: any, extra: ExtraLogFields = {}) =>
      log('ERROR', message, { ...extra, error }, context),
  };
}
