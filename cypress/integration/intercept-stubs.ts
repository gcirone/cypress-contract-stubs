describe('Intercept Stubs', () => {
  beforeEach(() => {
    cy.interceptStubs({ names: ['getStreamConfig', 'getEvents'] });

    cy.visit('cypress/fixtures/test-example.html');
  });

  it('should load the configuration', () => {
    cy.wait('@getStreamConfig:sports-ui').its('response.body').should('have.a.property', 'competitions');

    cy.get('#content1').should('contain.text', 'defaultOffset: 15');
  });

  it('should load the event', () => {
    cy.get('#load-events').click();

    cy.wait('@getEvents:sports-ui').its('response.body').should('have.length', 1);

    cy.get('#content2').should('contain.text', 'Manchester United');
  });

  it('should work with graphql', () => {
    
    cy.contractStubs().then(stubs => {
      const gqlStubNames = ['getPost', 'updatePost'];
      const gqlStubs = stubs
        .filter(stub => gqlStubNames.includes(stub.name))
        .map(stub => {
          const operationName = stub.request?.bodyPatterns
            ?.filter(p => p?.matchesJsonPath?.expression?.includes('operationName'))
            .map(p => Object.values(p?.matchesJsonPath).pop()).pop()
          return { ...stub, operationName };
        });
      
      cy.intercept('POST', '/graphql', (req => {
        const body = JSON.parse(req.body);
        const stub = gqlStubs.find(s => s.operationName === body.operationName);
        
        if (stub) {
          req.alias = stub.name;
          const { status, body, headers } = stub.response;
          req.reply(status || 200, body, headers);
        }
      })).as('gql');
    })

    cy.get('#get-post').click();
    cy.get('#update-post').click();
    
    cy.wait('@getPost').its('response.body.data.post.id').should('eq', '1');
    cy.wait('@updatePost').its('response.body.data.updatePost.id').should('eq', '1');
  });
});
