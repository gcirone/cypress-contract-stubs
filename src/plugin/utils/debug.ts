import nodeDebug from 'debug';

export function debug(type: string, ...args: unknown[]): void {
  nodeDebug(`cypress:${type}`)(...args);
}

export function error(error: string | ErrorEvent): void {
  const message = typeof error === 'string' ? error : error.message;
  console.error('[stubs:error]', message);
}
