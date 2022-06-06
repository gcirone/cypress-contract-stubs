# Cypress Contract Stubs

<p align="left">
  <a href="https://www.npmjs.com/package/cypress-contract-stubs">
    <img src="https://img.shields.io/npm/v/cypress-contract-stubs.svg" alt="Npm">
  </a>
  <a href="https://github.com/gcirone/cypress-contract-stubs/actions">
    <img src="https://github.com/gcirone/cypress-contract-stubs/actions/workflows/release.yaml/badge.svg?style=shield" alt="Github Action">
  </a>
  <a href="https://www.cypress.io/">
    <img src="https://img.shields.io/badge/tested_with-cypress-162332.svg" alt="Cypress">
  </a>  
  <a href="https://github.com/facebook/jest">
    <img src="https://img.shields.io/badge/tested_with-jest-933e4c.svg" alt="Jest">
  </a>
  <a href="https://codecov.io/gh/gcirone/cypress-contract-stubs">
    <img src="https://codecov.io/gh/gcirone/cypress-contract-stubs/branch/master/graph/badge.svg" alt="Codecov" />
  </a>
</p>

The **cypress-contract-stubs** add support for using [Spring Cloud Contract Stub](https://spring.io/projects/spring-cloud-contract) entries when testing with Cypress. 
This plugin can download artifacts from **nexus** and **nexus3** artifact repositories and cache them locally. 
Provide commands to automatically intercept application requests with stubs matched without the need of using the [stub runner](https://cloud.spring.io/spring-cloud-contract/1.2.x/multi/multi__spring_cloud_contract_stub_runner.html) server.

## Get started

### Installation

Install the plugin by running:

```shell
npm install --save-dev cypress-contract-stubs
```

### Plugin configuration

Add it to your plugin file: `cypress/plugins/index.js`

```javascript
const { contractStubsPlugin } = require('cypress-contract-stubs');

module.exports = async (on, config) => {
  await contractStubsPlugin(on, config);
  
  return config;
}
```

Add configuration for remote and local stubs to your `cypress.json` file.

The default *mode* is `remote` and the default *type* is `nexus3`. You can also configure default stub server and repository for the artifacts. 

```json
{
  "env": {
    "stubs_server": "http://nexus3.proxy.internal",
    "stubs_repository": "maven-releases",
    "stubs": [
      {
        "id": "internal.contracts:artifact-name:+:stubs"
      },
      {
        "mode": "remote",
        "id": "internal.contracts:artifact-name:+:stubs",
        "type": "nexus",
        "server": "http://nexus.proxy.internal",
        "repository": "releases"
      },
      {
        "mode": "local",
        "file": "artifact-name-1.318-SNAPSHOT-stubs.jar"
      },
      {
        "mode": "local",
        "file": "artifact-name-stubs.jar",
        "path": "cypress/fixtures"
      }
    ]
  }
}
```

*Note: The plugin will download the latest artifact version if the `+` or `latest` is added to the stubs **id** coordinate*

### Commands configuration

Add it to your support file: `cypress/support/index.js`

```javascript
import 'cypress-contract-stubs/commands';
```

In your test files, will be available the following commands:

- `cy.interceptStubs` Intercept network requests with matched stubs
- `cy.contractStubs` Get all available stub entries
- `cy.contractStub` Get stub entry by options (if more stubs match the criteria will be returned the first occurrence)

```javascript
cy.interceptStubs();
cy.contractStubs().then((stubs) => console.log(stubs));
cy.contractStub({ name: 'stubName' }).then((stub) => console.log(stub));
```

## Intercept network request

### Automatic intercept

To automatically intercept network requests use:

```javascript
cy.interceptStubs(); // Intercept all stub requests
cy.interceptStubs({ names: ['stubNameA', 'stubNameB'] }); // Intercept stub requests filtered by names

cy.visit('/')
```

*The command setup an intercept for each stub present with the syntax defined in [WireMock documentation](https://wiremock.org/docs/stubbing/)*

### Manual intercept

To manually intercept network request use:

```javascript
cy.contractStub({ name: 'stubName' }).then((stub) => {
  const { name, request, response } = stub;
  
  cy.intercept(request.url, (req) => {
    req.reply(response.status, response.body, response.headers)
  }).as(name);
});

cy.visit('/')
```

## Debug

Set an environment variable `DEBUG=cypress:stubs:*` to log all stubs plugin operations.

Check the Cypress documentation for more info about [printing debug logs](https://docs.cypress.io/guides/references/troubleshooting#Print-DEBUG-logs).

## Small print

Author: Gianluca Cirone &lt;gianluca.cirone@gmail.com&gt; &copy; 2022

- [@freshdevit](https://twitter.com/freshdevit)
- [gianlucacirone](https://www.linkedin.com/in/gianlucacirone)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open an issue](https://github.com/gcirone/cypress-contract-stubs/issues) on Github

## License

cypress-contract-stubs is [MIT licensed](./LICENSE).
