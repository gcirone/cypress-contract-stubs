// Cypress default mock
Object.assign(globalThis, {
  Cypress: {
    Commands: { add: jest.fn() },
    log: jest.fn()
  },
  cy: {
    as: jest.fn().mockReturnThis(),
    intercept: jest.fn().mockReturnThis(),
    task: jest.fn().mockResolvedValue(undefined)
  }
});
