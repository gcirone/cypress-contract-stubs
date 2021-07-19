declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface StubOptions {
      name?: string;
      url?: string;
      method?: HttpMethod;
      status?: number;
      consumer?: string;
    }

    interface Chainable {
      contractStub: typeof contractStub;
    }
  }
}

export function contractStub(options: Cypress.StubOptions): void {
  console.log('contractStub', options);
}

export function contractStubCommands(): void {
  Cypress.Commands.add('contractStub', contractStub);
}
