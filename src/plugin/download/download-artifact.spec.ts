import { downloadArtifact } from './download-artifact';
import { RemoteStub } from '../stubs/stubs-config';
import download from 'download';
import globby from 'globby';
import got from 'got';

jest.mock('download');
jest.mock('globby');
jest.mock('got');

describe('DownloadArtifact Test', () => {
  const path = 'internal/location/stub.jar';
  const cachePath = `cache/folder/${path}`;
  const stubConfig: RemoteStub = { id: 'test.group:test-artifact:1.2:stubs', type: 'nexus3' };

  describe('when download from nexus3', () => {
    it('should perform the search request correctly', () => {
      whenDownloadArtifact(true);
      expect(got).toHaveBeenCalledWith(expect.stringMatching('search/assets'), { json: true, retries: 0 });
    });

    it('should search the stub in cache and return the most recent one', async () => {
      const stubPath = await whenDownloadArtifact(true);
      expect(globby).toHaveBeenCalledWith(expect.stringMatching('cache/stubs/internal/'), {
        objectMode: true,
        stats: true
      });
      expect(stubPath).toEqual(cachePath);
    });

    it('should download the stub if not available in cache', async () => {
      const stubPath = await whenDownloadArtifact(true, false);
      expect(download).toHaveBeenCalledWith(
        expect.stringMatching(/server\/repos/),
        expect.stringMatching(/node_modules/),
        expect.objectContaining({ filename: 'stub.jar', retries: 0 })
      );
      expect(stubPath).toEqual(expect.stringMatching(`node_modules/.cache/stubs/${path}`));
    });

    it('should search the stub by id in cache if search request return errors', async () => {
      const stubPath = await whenDownloadArtifact(true, true, false);
      expect(globby).toHaveBeenCalledWith(expect.stringMatching('cache/stubs/\\*\\*/\\*test-artifact\\*'), {
        objectMode: true,
        stats: true
      });
      expect(stubPath).toEqual(cachePath);
    });
  });

  describe('when download from nexus', () => {
    it('should perform the search request correctly', () => {
      whenDownloadArtifact(false);
      expect(got).toHaveBeenCalledWith(expect.stringMatching('maven/resolve'), { json: true, retries: 0 });
    });

    it('should search the stub in cache and return the most recent one', async () => {
      const stubPath = await whenDownloadArtifact(false);
      expect(stubPath).toEqual(cachePath);
    });

    it('should download the stub if not available in cache', async () => {
      const stubPath = await whenDownloadArtifact(false, false);
      expect(download).toHaveBeenCalledWith(
        expect.stringMatching(/releases\/content/),
        expect.stringMatching(/node_modules/),
        expect.objectContaining({ filename: 'stub.jar', retries: 0 })
      );
      expect(stubPath).toEqual(expect.stringMatching(`node_modules/.cache/stubs/${path}`));
    });
  });

  async function whenDownloadArtifact(isNexus3: boolean, globFound = true, gotSuccess = true) {
    const nexus3Response = { items: [{ path, downloadUrl: `http://server/repos/${path}` }] };
    const nexusResponse = { data: { repositoryPath: path } };

    const globbyResponse = [
      { path: cachePath.replace('stub', 'stub-old'), stats: { ctime: 0 } },
      { path: cachePath, stats: { ctime: 1 } }
    ];

    if (gotSuccess) {
      const gotResponse = isNexus3 ? { body: nexus3Response } : { body: nexusResponse };
      (got as any).mockResolvedValue(gotResponse);
    } else {
      (got as any).mockRejectedValue('error');
    }

    (globby as any).mockResolvedValue(globFound ? globbyResponse : []);
    (download as any).mockResolvedValue();

    stubConfig.type = isNexus3 ? 'nexus3' : 'nexus';
    return await downloadArtifact(stubConfig);
  }
});
