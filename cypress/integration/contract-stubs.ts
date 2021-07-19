// eslint-disable-next-line @typescript-eslint/triple-slash-reference
///<reference path="../../src/command/contract-stubs.ts"/>

describe('Contract stubs', () => {
  it('should work', () => {
    cy.log('work');

    cy.contractStub({ name: 'work' })
  });
});
