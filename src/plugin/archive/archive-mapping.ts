import { ArchiveEntry, StubEntries, StubEntry } from './archive-entry-model';
import { list, readFile } from 'ls-archive';
import { parse, extname } from 'path';
import { promisify } from 'util';

/**
 * Map all json stub entries.
 *
 * @param archivePath A valid path for the file.
 * @param entry An json archive entry
 */
async function readJsonContent(archivePath: string, entry: ArchiveEntry): Promise<StubEntry> {
  const fileContent = await promisify(readFile)(archivePath, entry.path);

  const stub = JSON.parse(fileContent.toString());
  stub.name = parse(entry.path).name;

  try {
    stub.response.body = JSON.parse(stub.response.body);
    // eslint-disable-next-line no-empty
  } catch (e) {}

  return stub;
}

/**
 * Extract all stub entries from an archive file.
 *
 * @param archivePath A valid path for the file.
 * @returns A Promise for the completion of all stub entries.
 */
export async function archiveMapping(archivePath: string): Promise<StubEntries> {
  const entries = (await promisify(list)(archivePath))
    .filter((entry: ArchiveEntry) => extname(entry.path) === '.json')
    .map((entry: ArchiveEntry) => readJsonContent(archivePath, entry));

  return Promise.all(entries);
}
