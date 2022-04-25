import { interceptStubs } from './intercept-stubs';

describe('Intercept Stubs Command', () => {
  const mockStubs = [
    {
      name: 'a',
      request: { method: 'GET', url: '/a', headers: { h1: { matches: '.*' } } },
      response: { body: 'a' }
    },
    {
      name: 'b',
      request: { method: 'GET', urlPattern: '.*', queryParameters: { q1: { equalTo: '1' } } },
      response: { body: 'b' }
    }
  ];

  beforeEach(() => {
    jest.spyOn(cy, 'task').mockResolvedValueOnce(mockStubs);
  });

  it('should register the cypress commands', () => {
    expect(Cypress.Commands.add).toHaveBeenCalledWith('interceptStubs', interceptStubs);
  });

  it('#interceptStubs should intercept all request with stubs', () => {
    interceptStubs();

    expect(cy.task).toHaveBeenCalledWith('contract:stubs', null, { log: false });
  });

  it('#interceptStubs should intercept the requestd request with stubs', () => {
    interceptStubs(['b']);

    expect(cy.task).toHaveBeenCalledWith('contract:stubs', null, { log: false });
  });
});
