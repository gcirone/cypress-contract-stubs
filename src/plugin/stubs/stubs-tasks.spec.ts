import { stubsTasks } from './stubs-tasks';
import { storeStubEntries } from './stubs-entries';

describe('StubsTasks Test', () => {
  const stubEntriesMock = [
    { id: '1', request: { url: '/url/a' }, response: {}, uuid: '1x', name: 'stubA' },
    { id: '2', request: {}, response: {}, uuid: '1y', name: 'stubB', consumer: 'web' },
    { id: '3', request: { method: 'POST' }, response: { status: 204 }, uuid: '1y', name: 'stubC' }
  ];

  beforeAll(() => storeStubEntries(stubEntriesMock));

  it('should register all tasks', () => {
    const on = givenOnStubsTasks();

    expect(on).toHaveBeenCalledWith('task', {
      'contract:stubs': expect.any(Function),
      'contract:stub': expect.any(Function)
    });
  });

  it('should return all stub entries', () => {
    const on = givenOnStubsTasks();

    const contractStubsTask = on.mock.calls[0][1]['contract:stubs'];
    const stubs = contractStubsTask();

    expect(stubs).toHaveLength(3);
  });

  it('should return the stub requested', () => {
    const on = givenOnStubsTasks();

    const contractStubTask = on.mock.calls[0][1]['contract:stub'];

    const stubA = contractStubTask({ url: '/url/a' });
    expect(stubA.id).toEqual('1');

    const stubB = contractStubTask({ name: 'stubB' });
    expect(stubB.id).toEqual('2');

    const stubC = contractStubTask({ method: 'POST', status: 204 });
    expect(stubC.id).toEqual('3');

    const stubD = contractStubTask({ id: '2', consumer: 'web' });
    expect(stubD.name).toEqual('stubB');
  });

  function givenOnStubsTasks() {
    const on = jest.fn();
    stubsTasks(on);
    return on;
  }
});
