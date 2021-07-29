import nodeDebug from 'debug';

export function debug(type: string, ...args: unknown[]): void {
  nodeDebug(`cypress:${type}`)(...args);
}
