import { contractStubs, contractStub } from './contract-stubs';
import { mockStubs } from './__mocks__/stubs.mocks';

describe('Contract Stubs Command', () => {
  beforeEach(() => {
    jest.spyOn(cy, 'task').mockResolvedValueOnce(mockStubs).mockResolvedValueOnce(mockStubs[0]);
  });

  it('should register the cypress commands', () => {
    expect(Cypress.Commands.add).toHaveBeenCalledWith('contractStubs', contractStubs);
    expect(Cypress.Commands.add).toHaveBeenCalledWith('contractStub', contractStub);
  });

  it('#contractStubs should return all stubs founded', (done) => {
    contractStubs().then((stubs) => {
      expect(stubs).toHaveLength(mockStubs.length);
      expect(getLogCallArg(0)).toMatchSnapshot();
      done();
    });

    expect(cy.task).toHaveBeenCalledWith('contract:stubs', null, { log: false });
  });

  it('#contractStub should return the stub founded', (done) => {
    contractStub(mockStubs[0]).then((stub) => {
      expect(stub).toEqual(mockStubs[0]);
      expect(getLogCallArg(1)).toMatchSnapshot();
      done();
    });

    expect(cy.task).toHaveBeenCalledWith('contract:stub', mockStubs[0], { log: false });
  });

  function getLogCallArg(index: number) {
    return (Cypress.log as jest.Mock).mock.calls[index][0];
  }
});
