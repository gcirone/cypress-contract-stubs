import { archiveMapping } from '../archive/archive-mapping';
import { parseConfiguration } from './stubs-config';
import { getLocalStubs } from './local-stubs';
import { logger } from '../utils/debug';
import { stubEntries } from './stubs-entries';
import globby from 'globby';

jest.mock('../archive/archive-mapping');
jest.mock('../utils/debug');
jest.mock('globby');

describe('LocalStubs Test', () => {
  const path = 'internal/location/stub.jar';
  const stubs = [
    { mode: 'local', file: 'test-artifact-1.2-stubs.jar' },
    { mode: 'local', file: 'fixture-artifact-2.8-stubs.jar', path: 'cypress/fixtures' }
  ];

  beforeEach(() => parseConfiguration({ stubs }));

  it('should search the local stub through local maven repository', (done) => {
    whenGetLocalStubs();
    expect(globby).toHaveBeenCalledWith(expect.stringMatching('.m2/repository/\\*\\*/test'));
    process.nextTick(() => {
      expect(stubEntries.length).toEqual(1);
      done();
    });
  });

  it('should log when stub get not found on local machine', (done) => {
    whenGetLocalStubs(false);
    process.nextTick(() => {
      expect(logger.error).toHaveBeenCalledWith('No local stub found! test-artifact-1.2-stubs.jar');
      done();
    });
  });

  function whenGetLocalStubs(globbySuccess = true) {
    (globby as any).mockResolvedValue(globbySuccess ? [path] : []);
    (archiveMapping as any).mockResolvedValue([{ id: '1122' }]);
    getLocalStubs();
  }
});
