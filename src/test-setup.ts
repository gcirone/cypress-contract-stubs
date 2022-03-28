// Cypress default mock
Object.assign(globalThis, {
  Cypress: {
    Commands: { add: jest.fn() },
    log: jest.fn()
  },
  cy: {
    task: jest.fn().mockResolvedValue(undefined)
  }
});
