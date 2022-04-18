export function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function promiseRetry(operation: () => Promise<any>, delay: number, retries: number): Promise<any> {
  return new Promise((resolve, reject) => {
    return operation()
      .then(resolve)
      .catch((reason: any) => {
        if (retries > 0) {
          return wait(delay)
            .then(promiseRetry.bind(null, operation, delay, retries - 1))
            .then(resolve)
            .catch(reject);
        }
        return reject(reason);
      });
  });
}
