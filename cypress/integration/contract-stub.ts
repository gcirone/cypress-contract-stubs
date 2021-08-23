describe('Contract Stub', () => {
  it('should get the stub by name', () => {
    cy.contractStub({ name: 'getStreamConfig' }).should((stub) => {
      expect(stub?.response.body.defaultOffset).to.eq(15);
    });
  });
});
