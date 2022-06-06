import { archiveMapping } from './archive-mapping';
import * as ls from 'ls-archive';
import * as util from 'util';

jest.mock('ls-archive');
jest.mock('util');

describe('ArchiveMapping Test', () => {
  const archivePath = '/path/archive/stub.jar';
  const archiveList = [{ path: 'internal/consumer/stub.json' }];
  const archiveContent = JSON.stringify({
    id: 'ef4e991f-3ec4-4c04-8291-656f5a03e7fd',
    request: { url: 'url/stub' },
    response: { body: JSON.stringify([{ value: true }]) },
    uuid: 'ef4e991f-3ec4-4c04-8291-656f5a03e7fd'
  });

  const promisified = jest.fn();

  beforeEach(() => {
    promisified.mockResolvedValueOnce(archiveList as never).mockResolvedValueOnce(archiveContent as never);
    jest.spyOn(util, 'promisify').mockReturnValue(promisified);
  });

  it('should extract all stub entries from an archive file', () => {
    archiveMapping(archivePath);
    expect(util.promisify).toHaveBeenNthCalledWith(1, ls.list);
    expect(promisified).toHaveBeenNthCalledWith(1, archivePath);
  });

  it('should map all json stub entries', async () => {
    const mappedArchive = await archiveMapping(archivePath);
    expect(util.promisify).toHaveBeenNthCalledWith(2, ls.readFile);
    expect(promisified).toHaveBeenNthCalledWith(2, archivePath, archiveList[0].path);
    expect(mappedArchive).toMatchSnapshot();
  });

  it('should throw exception in case of archive fail', async () => {
    promisified.mockReset().mockRejectedValue('error');
    expect.assertions(1);

    try {
      await archiveMapping(archivePath);
    } catch (error) {
      expect(error).toBe('error');
    }
  });
});
