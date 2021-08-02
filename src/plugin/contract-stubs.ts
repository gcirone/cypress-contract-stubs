import { archiveMapping } from './archive/archive-mapping';
import { StubEntries } from './archive/archive-entry-model';
import { StubsConfig } from './stub-config-model';
import { debug } from './utils/debug';
import { resolve } from 'path';
import { getArtifact } from './download/get-artifact';

/**
 * Contract stubs plugin
 * @param on
 * @param config
 */
export function contractStubsPlugin(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions): void {
  const stubsConfig: StubsConfig = config.env.stubs || [];
  const stubEntries: StubEntries = [];

  const stubFiles = stubsConfig.filter((stub) => stub.mode === 'file');
  debug('stubs:file', `${stubFiles.length} archive files configured`);

  stubFiles.forEach((stubConfig) => {
    const archivePath = resolve(stubConfig.path, stubConfig.file);

    debug('stubs:file', `Search file stub ${archivePath}`);
    archiveMapping(archivePath)
      .then((stubs) => {
        debug('stubs:file', `${stubs.length} stubs found in ${stubConfig.file}`);
        stubEntries.push(...stubs);
      })
      .catch((e) => console.error('[error]', e.message || e));
  });

  const stubRemotes = stubsConfig.filter((stub) => stub.mode === 'remote');
  debug('stubs:remote', `${stubRemotes.length} remote archives configured`);

  stubRemotes.forEach((stubConfig) => {
    getArtifact(stubConfig, config.env)
      .then((stubPath) => archiveMapping(stubPath))
      .then((stubs) => {
        debug('stubs:remote', `${stubs.length} stubs found in ${stubConfig.id}`);
        stubEntries.push(...stubs);
      })
      .catch((e) => console.error('[error]', e.message || e));
  });

  on('task', {
    'contract:stubs': () => stubEntries
  });
}
