import { parseConfiguration } from './stubs/stubs-config';
import { getLocalStubs } from './stubs/local-stubs';
import { getRemoteStubs } from './stubs/remote-stubs';
import { stubEntries } from './stubs/stubs-entries';

/**
 * Contract stubs plugin
 *
 * @param on
 * @param config
 */
export function contractStubsPlugin(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions): void {
  // Parse initial configuration
  parseConfiguration(config.env);

  // Get local stubs
  getLocalStubs();

  // Get remote stubs
  getRemoteStubs();

  // Setup stub tasks
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
