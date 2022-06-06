import { ArchiveEntry, StubEntries, StubEntry } from '../stubs/stubs-entries';
import { promiseRetry } from '../utils/promise-retry';
import { list, readFile } from 'ls-archive';
import { logger } from '../utils/debug';
import { extname, parse, basename } from 'path';
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

  const stubPath = parse(entry.path);
  stub.name = stubPath.name;
  stub.consumer = basename(stubPath.dir);
  stub.id = `${stub.name}:${stub.consumer}`;

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
  const entries: StubEntry[] = [];

  const archiveList = () => promisify(list)(archivePath);
  const archiveEntries: ArchiveEntry[] = (await promiseRetry(archiveList, 100, 10)).filter(
    (entry: ArchiveEntry) => extname(entry.path) === '.json'
  );

  for (const entry of archiveEntries) {
    try {
      const stubContent = () => readJsonContent(archivePath, entry);
      const stubEntry = await promiseRetry(stubContent, 100, 10);
      entries.push(stubEntry);
    } catch (e) {
      logger.error(`Archive not mapped "${entry.path}" ${e}`);
    }
  }

  return entries;
}
