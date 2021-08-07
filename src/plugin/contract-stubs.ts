import { archiveMapping } from './archive/archive-mapping';
import { remoteArtifact } from './download/remote-artifact';
import { StubEntries } from './archive/archive-entry-model';
import { StubsConfig } from './stub-config-model';
import { debug } from './utils/debug';
import { resolve } from 'path';
import { homedir } from 'os';
import globby from 'globby';

/**
 * Contract stubs plugin
 *
 * @param on
 * @param config
 */
export function contractStubsPlugin(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions): void {
  const stubsConfig: StubsConfig = config.env.stubs || [];
  const stubEntries: StubEntries = [];

  const appendStubEntries = (stubs: StubEntries, artifact: string) => {
    debug('stubs:entries', `${stubs.length} stubs found in ${artifact}`);
    stubEntries.push(...stubs);
  };

  const catchStubErrors = (error: Error) => {
    console.error('[stubs:error]', error.message || error);
  };

  const stubFiles = stubsConfig.filter((stub) => stub.mode === 'file');
  debug('stubs:file', `${stubFiles.length} archive files configured`);

  stubFiles.forEach(async (stubConfig) => {
    const archivePattern = stubConfig.path
      ? resolve(stubConfig.path, stubConfig.file)
      : resolve(homedir(), config.env.stubs_maven_repo || '.m2/repository', '**', stubConfig.file);

    debug('stubs:file', `Search file stub ${archivePattern}`);
    const archivePath = (await globby(archivePattern)).shift();

    if (archivePath) {
      const stubs = await archiveMapping(archivePath);

      appendStubEntries(stubs, stubConfig.file);
    } else {
      catchStubErrors(new Error(`No local stub found! ${stubConfig.file} ${archivePattern}`));
    }
  });

  const stubRemotes = stubsConfig.filter((stub) => stub.mode === 'remote');
  debug('stubs:remote', `${stubRemotes.length} remote archives configured`);

  stubRemotes.forEach(async (stubConfig) => {
    try {
      const stubPath = await remoteArtifact(stubConfig, config.env);
      const stubs = await archiveMapping(stubPath);

      appendStubEntries(stubs, stubConfig.id);
    } catch (error) {
      catchStubErrors(error);
    }
  });

  on('task', {
    'contract:stubs': () => stubEntries,
    'contract:stub': (config: Cypress.StubOptions) => {
      const stubs = stubEntries.filter((entry) => {
        if (config.name) {
          return entry.name === config.name;
        }
      });

      return stubs.length ? stubs[0] : undefined;
    }
  });
}
