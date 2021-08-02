import { ArchiveEntry, StubEntries } from './archive-entry-model';
import { list, readFile } from 'ls-archive';
import { parse, extname } from 'path';
import { promisify } from 'util';

/**
 * Extract all stub entries from an archive file
 * @param archivePath A valid path for the file.
 * @returns A Promise for the completion of all stub entries.
 */
export async function archiveMapping(archivePath: string): Promise<StubEntries> {
  const entries = (await promisify(list)(archivePath))
    .filter((entry: ArchiveEntry) => extname(entry.path) === '.json')
    .map(async (entry: ArchiveEntry) => {
      const stub = JSON.parse((await promisify(readFile)(archivePath, entry.path)).toString());
      stub.name = parse(entry.path).name;

      try {
        stub.response.body = JSON.parse(stub.response.body);
        // eslint-disable-next-line no-empty
      } catch (e) {}

      return stub;
    });

  return Promise.all(entries);
}
