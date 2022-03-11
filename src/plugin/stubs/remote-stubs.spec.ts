import { archiveMapping } from '../archive/archive-mapping';
import { downloadArtifact } from '../download/download-artifact';
import { parseConfiguration } from './stubs-config';
import { getRemoteStubs } from './remote-stubs';
import { stubEntries } from './stubs-entries';
import { logger } from '../utils/debug';
import { expect, jest } from '@jest/globals';

jest.mock('../archive/archive-mapping');
jest.mock('../download/download-artifact');
jest.mock('../utils/debug');
jest.mock('globby');

describe('RemoteStubs Test', () => {
  const stubs = [{ mode: 'remote', id: 'test.group:test-artifact:1.2:stubs' }];

  beforeEach(() => parseConfiguration({ stubs }));

  it('should download the artifact from remote maven repository', (done) => {
    whenGetRemoteStubs();

    process.nextTick(() => {
      expect(stubEntries.length).toEqual(1);
      done();
    });
  });

  it('should log when stub get not found on remote repository', (done) => {
    whenGetRemoteStubs('');

    process.nextTick(() => {
      expect(logger.error).toHaveBeenCalledWith('No remote stub found! test.group:test-artifact:1.2:stubs');
      done();
    });
  });

  function whenGetRemoteStubs(path = 'local/artifact.jar') {
    (downloadArtifact as any).mockResolvedValue(path);
    (archiveMapping as any).mockResolvedValue([{ id: '1122' }]);
    getRemoteStubs();
  }
});
