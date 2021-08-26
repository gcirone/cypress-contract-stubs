import nodeDebug from 'debug';

function debugLog(type: string, ...args: unknown[]): void {
  nodeDebug(`cypress:${type}`)(...args);
}

function errorLog(error: string | ErrorEvent): void {
  const message = typeof error === 'string' ? error : error.message;
  console.error('[stubs:error]', message);
}

export const logger = { debug: debugLog, error: errorLog };
