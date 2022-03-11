import { contractStubsPlugin } from './contract-stubs';
import { parseConfiguration } from './stubs/stubs-config';
import { getLocalStubs } from './stubs/local-stubs';
import { getRemoteStubs } from './stubs/remote-stubs';
import { expect, jest } from '@jest/globals';

jest.mock('./stubs/stubs-config');
jest.mock('./stubs/local-stubs');
jest.mock('./stubs/remote-stubs');

describe('Contract Stubs', () => {
  const on = jest.fn();
  const config = { env: { a: true } };

  beforeEach(async () => await contractStubsPlugin(on, config as any));

  it('should parse the initial configuration', () => {
    expect(parseConfiguration).toHaveBeenCalledWith(config.env);
  });

  it('should get the local stubs', () => {
    expect(getLocalStubs).toHaveBeenCalled();
  });

  it('should get the remote stubs', () => {
    expect(getRemoteStubs).toHaveBeenCalled();
  });

  it('should register the correct tasks', () => {
    expect(on).toHaveBeenCalledWith(
      'task',
      expect.objectContaining({
        'contract:stub': expect.anything(),
        'contract:stubs': expect.anything()
      })
    );
  });
});
