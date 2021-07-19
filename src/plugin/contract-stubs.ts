export function contractStubsPlugin(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions): void {
  console.log('stubs', config.env.stubs?.length);
  config.experimentalInteractiveRunEvents = true;

  on('before:run', () => {
    console.log('before:run');
  });

  on('before:browser:launch', () => {
    console.log('before:browser:launch');
  });
}
