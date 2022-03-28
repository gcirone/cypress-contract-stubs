import { storeStubEntries, stubEntries } from './stubs-entries';

describe('StubEntries Test', () => {
  const stubEntry = { id: '1', request: {}, response: {}, uuid: '1a', name: 'stub' };

  it('should store stub entries', () => {
    storeStubEntries([stubEntry]);
    expect(stubEntries.length).toBe(1);
  });
});
