import { interceptStubs } from './intercept-stubs';
import { mockStubs } from './__mocks__/stubs.mocks';

describe('Intercept Stubs Command', () => {
  const reqReplySpy = jest.fn();
  const asSpy = jest.fn();

  beforeEach(() => {
    jest.spyOn(cy, 'task').mockResolvedValueOnce(mockStubs);
    jest.spyOn<any, any>(cy, 'intercept').mockImplementation((_, response: any) => {
      response({ reply: reqReplySpy });
      return { as: asSpy };
    });
  });

  afterEach(() => jest.clearAllMocks());

  it('should register the cypress commands', () => {
    expect(Cypress.Commands.add).toHaveBeenCalledWith('interceptStubs', interceptStubs);
  });

  it('#interceptStubs should intercept all request with stubs', async () => {
    await interceptStubs();

    expect(cy.task).toHaveBeenCalledWith('contract:stubs', null, { log: false });

    expect(cy.intercept).toHaveBeenCalledTimes(3);
    expect((cy.intercept as jest.Mock).mock.calls[2][0]).toMatchSnapshot();

    expect(reqReplySpy).toHaveBeenCalledTimes(3);
    expect(reqReplySpy).toHaveBeenNthCalledWith(3, 204, 'c', { hr: 'x' });

    expect(asSpy).toHaveBeenCalledTimes(3);
  });

  it('#interceptStubs should intercept only the named stubs', async () => {
    await interceptStubs(['b']);

    expect(cy.task).toHaveBeenCalledWith('contract:stubs', null, { log: false });
    expect((cy.intercept as jest.Mock).mock.calls[0][0]).toMatchSnapshot();

    expect(asSpy).toHaveBeenCalledWith('b');
  });
});
