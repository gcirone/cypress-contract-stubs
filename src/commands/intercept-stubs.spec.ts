import { interceptStubs } from './intercept-stubs';
import { mockStubs } from './__mocks__/stubs.mocks';

describe('Intercept Stubs Command', () => {
  const reqReplySpy = jest.fn();
  const asSpy = jest.fn();
  let mockedBody: any;

  beforeEach(() => {
    jest.spyOn(cy, 'task').mockResolvedValueOnce(mockStubs);
    jest.spyOn<any, any>(cy, 'intercept').mockImplementation((_, response: any) => {
      response({ body: mockedBody, reply: reqReplySpy });
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

    expect(cy.intercept).toHaveBeenCalledTimes(5);
    expect((cy.intercept as jest.Mock).mock.calls[2][0]).toMatchSnapshot();

    expect(reqReplySpy).toHaveBeenCalledTimes(5);
    expect(reqReplySpy).toHaveBeenNthCalledWith(3, 204, 'c', { hr: 'x' });

    expect(asSpy).toHaveBeenCalledTimes(5);
  });

  it('#interceptStubs should intercept only the named stubs', async () => {
    await interceptStubs({ names: ['b'] });

    expect(cy.task).toHaveBeenCalledWith('contract:stubs', null, { log: false });
    expect((cy.intercept as jest.Mock).mock.calls[0][0]).toMatchSnapshot();

    expect(asSpy).toHaveBeenCalledWith('b:f119');
  });

  it('#interceptStubs should intercept only the named stubs with options', async () => {
    await interceptStubs({ names: ['b'], headers: { tpl: 'tpl2' } });

    expect(cy.intercept).toHaveBeenCalledTimes(2);
    expect(asSpy).toHaveBeenCalledTimes(2);
    expect(asSpy).toHaveBeenNthCalledWith(1, 'b:f119');
    expect(asSpy).toHaveBeenNthCalledWith(2, 'b:5163');
  });

  it.only('#interceptStubs should intercept named stubs with body', async () => {
    mockedBody = JSON.stringify({ operationName: 'GetPost', variables: { id: 1 } });
    await interceptStubs({ names: ['d'] });
  });
});
