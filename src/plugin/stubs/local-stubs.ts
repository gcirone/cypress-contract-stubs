import { archiveMapping } from '../archive/archive-mapping';
import { storeStubEntries } from './stubs-entries';
import { localStubs, configVars, LocalStub } from './stubs-config';
import { filePattern } from '../utils/file-pattern';
import { logger } from '../utils/debug';
import { resolve } from 'path';
import { homedir } from 'os';
import globby from 'globby';

/**
 * Search local files
 *
 * @param stubConfig
 */
async function searchStubFile(stubConfig: LocalStub) {
  const archivePattern = filePattern(
    stubConfig.path
      ? resolve(stubConfig.path, stubConfig.file)
      : resolve(homedir(), configVars.mavenRepository, '**', stubConfig.file)
  );

  logger.debug('stubs:local', `Search local stub ${archivePattern}`);
  return (await globby(archivePattern)).shift();
}

/**
 * Get all local stubs entries
 */
export async function getLocalStubs(): Promise<void> {
  logger.debug('stubs:local', `${localStubs.length} local stubs configured`);

  for (const stubConfig of localStubs) {
    try {
      const archivePath = await searchStubFile(stubConfig);

      if (archivePath) {
        const stubs = await archiveMapping(archivePath);

        logger.debug('stubs:entries', `${stubs.length} stubs found in ${stubConfig.file}`);
        storeStubEntries(stubs);
      } else {
        logger.error(`No local stub found! ${stubConfig.file}`);
      }
    } catch (err) {
      logger.error(err);
    }
  }
}
