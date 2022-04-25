describe('Intercept Stubs', () => {
  beforeEach(() => {
    cy.interceptStubs();

    cy.visit('cypress/fixtures/test-example.html');
  });

  it.only('should load the configuration', () => {
    cy.wait('@getStreamConfig').its('response.body').should('have.a.property', 'competitions');

    cy.get('#content1').should('contain.text', 'defaultOffset: 15');
  });

  it('should load the event', () => {
    cy.get('button').click();

    cy.wait('@getEvents').its('response.body').should('have.length', 1);

    cy.get('#content2').should('contain.text', 'Manchester United');
  });
});
