import { StubEntries, StubEntry } from '../plugin/archive/archive-entry-model';

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
      contractStub: typeof contractStub;
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

export function contractStub(options: Cypress.StubOptions): Cypress.Chainable<StubEntry> {
  return cy.task<StubEntry>('contract:stub', options, { log: false }).then((stub) => {
    Cypress.log({
      name: 'contractStub',
      displayName: 'stub',
      type: 'parent',
      message: [`${stub ? 'stub found' : 'stub not found!'}`, options.name || options.url],
      consoleProps: () => ({ options, stub })
    });

    return stub;
  });
}

Cypress.Commands.add('contractStubs', contractStubs);
Cypress.Commands.add('contractStub', contractStub);
