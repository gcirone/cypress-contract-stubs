// eslint-disable-next-line @typescript-eslint/triple-slash-reference
///<reference path="../../src/command/contract-stubs.ts"/>

describe('Contract Stubs', () => {
  it('should get all available stubs', () => {
    cy.contractStubs().should((stubs) => {
      expect(stubs.length).to.be.at.least(3);
    });
  });

  it('should get stub by name', () => {
    cy.contractStub({ name: 'getStreamConfig' }).should((stub) => {
      expect(stub.response.body.defaultOffset).to.eq(15);
    });
  });
});
