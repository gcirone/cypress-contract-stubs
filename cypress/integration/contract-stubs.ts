describe('Contract Stubs', () => {
  it('should get all available stubs', () => {
    cy.contractStubs().should('have.length.at.least', 3);
  });

  it('should get the stub by name', () => {
    cy.contractStub({ name: 'getStreamConfig' }).its('response.body.defaultOffset').should('equal', 15);
  });

  it('should get the stub by filters', () => {
    cy.contractStub({ url: '/v2/nav/A/description/soccer', method: 'GET', status: 200 })
      .its('response.body.current.description')
      .should('equal', 'Soccer');
  });
});
