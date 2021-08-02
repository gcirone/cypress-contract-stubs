import { StubEntries } from '../plugin/archive/archive-entry-model';

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
      contractStubs: typeof contractStubs;
      // contractStub: typeof contractStub;
    }
  }
}

export function contractStubs(): Cypress.Chainable<StubEntries> {
  return cy.task<StubEntries>('contract:stubs', null, { log: false }).then((stubs) => {
    Cypress.log({
      name: 'contractStubs',
      displayName: 'stubs',
      type: 'parent',
      message: [`${stubs.length} stubs entries`],
      consoleProps: () => ({ stubs })
    });

    return stubs;
  });
}

// export function contractStub(options: Cypress.StubOptions): Cypress.Chainable<StubEntry> {
//
// }

Cypress.Commands.add('contractStubs', contractStubs);
