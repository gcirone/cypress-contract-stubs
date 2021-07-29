import { archiveMapping } from './archive/archive-mapping';
import { StubEntries } from './archive/archive-entry-model';
import { StubsConfig } from './stub-config-model';
import { debug } from './utils/debug';
import { resolve } from 'path';

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

    archiveMapping(archivePath)
      .then((stubs) => {
        debug('stubs:file', `${stubs.length} stubs found in ${stubConfig.file}`);
        stubEntries.push(...stubs);
      })
      .catch((e) => console.error('[error]', e.message || e));
  });

  // todo: implement the remote behaviour
  // const stubRemotes = stubsConfig.filter((stub) => stub.mode === 'remote');

  on('task', {
    'contract:stubs': () => stubEntries
  });
}
