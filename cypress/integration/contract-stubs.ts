describe('Contract Stubs', () => {
  it('should get all available stubs', () => {
    cy.contractStubs().should((stubs) => {
      expect(stubs.length).to.be.at.least(3);
    });
  });
});
