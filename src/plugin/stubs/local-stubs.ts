import { archiveMapping } from '../archive/archive-mapping';
import { storeStubEntries } from './stubs-entries';
import { localStubs, configVars } from './stubs-config';
import { debug, error } from '../utils/debug';
import { resolve } from 'path';
import { homedir } from 'os';
import globby from 'globby';

/**
 * Get all local stubs entries
 */
export function getLocalStubs(): void {
  debug('stubs:local', `${localStubs.length} local stubs configured`);

  localStubs.forEach(async (stubConfig) => {
    try {
      const archivePattern = stubConfig.path
        ? resolve(stubConfig.path, stubConfig.file)
        : resolve(homedir(), configVars.mavenRepo, '**', stubConfig.file);

      debug('stubs:local', `Search local stub ${archivePattern}`);
      const archivePath = (await globby(archivePattern)).shift();

      if (archivePath) {
        const stubs = await archiveMapping(archivePath);
        debug('stubs:entries', `${stubs.length} stubs found in ${stubConfig.file}`);
        storeStubEntries(stubs);
      } else {
        error(`No local stub found! ${stubConfig.file}`);
      }
    } catch (err) {
      error(err);
    }
  });
}
