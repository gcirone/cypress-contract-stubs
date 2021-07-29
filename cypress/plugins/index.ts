// ***********************************************************
// This example plugins/index.ts can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing) Cypress.PluginConfig

import { contractStubsPlugin } from 'cypress-contract-stubs';

// eslint-disable-next-line no-unused-vars
export default function(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions): void {
  contractStubsPlugin(on, config);
}
