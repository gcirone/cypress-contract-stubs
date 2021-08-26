import { nexus3Url, nexusDownloadUrl, nexusUrl } from './nexus-url';
import { expect } from '@jest/globals';

describe('NexusUrl Test', () => {
  const fixedVersionId = 'test.group:test-artifact:1.2:stubs';
  const latestVersionId = 'test.group:test-artifact:+:stubs';

  describe('when Nexus3 repository manager', () => {
    it('should return the url with fixed version', () => {
      const url = nexus3Url({ id: fixedVersionId });
      expect(url.toString()).toMatchSnapshot();
    });

    it('should return the url with latest version', () => {
      const url = nexus3Url({ id: latestVersionId });
      expect(url.toString()).toMatchSnapshot();
    });
  });

  describe('when Nexus repository manager', () => {
    it('should return the url with fixed version', () => {
      const url = nexusUrl({ id: fixedVersionId });
      expect(url.toString()).toMatchSnapshot();
    });

    it('should return the url with latest version', () => {
      const url = nexusUrl({ id: latestVersionId });
      expect(url.toString()).toMatchSnapshot();
    });

    it('should return the download url', () => {
      const url = nexusDownloadUrl('internal/path/stub.jar', { id: fixedVersionId });
      expect(url.toString()).toMatchSnapshot();
    });
  });
});
