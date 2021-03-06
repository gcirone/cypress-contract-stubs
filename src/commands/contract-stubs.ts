import { StubEntries, StubEntry } from '../plugin/stubs/stubs-entries';

declare global {
  namespace Cypress {
    interface StubOptions {
      id?: string;
      name?: string;
      method?: string;
      url?: string;
      status?: number;
      consumer?: string;
    }

    interface Chainable {
      contractStubs(): Chainable<StubEntries>;
      contractStub(options: StubOptions): Chainable<StubEntry | null>;
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

export function contractStub(options: Cypress.StubOptions): Cypress.Chainable<StubEntry | null> {
  return cy.task<StubEntry | null>('contract:stub', options, { log: false }).then((stub) => {
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
