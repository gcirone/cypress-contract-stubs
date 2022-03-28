import { parseConfiguration } from './stubs/stubs-config';
import { getLocalStubs } from './stubs/local-stubs';
import { getRemoteStubs } from './stubs/remote-stubs';
import { stubsTasks } from './stubs/stubs-tasks';

/**
 * Contract stubs plugin
 *
 * @param on
 * @param config
 */
export async function contractStubsPlugin(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Promise<void> {
  // Parse configuration
  parseConfiguration(config.env);

  // Resolve local and remote stubs
  await getLocalStubs();
  await getRemoteStubs();

  // Setup tasks
  stubsTasks(on);
}
