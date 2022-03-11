# Cypress Contract Stubs

<p align="left">
  <a href="https://www.npmjs.com/package/cypress-contract-stubs">
    <img src="https://img.shields.io/npm/v/cypress-contract-stubs.svg" alt="Npm">
  </a>
  <a href="https://github.com/gcirone/cypress-contract-stubs/actions">
    <img src="https://github.com/gcirone/cypress-contract-stubs/actions/workflows/release.yaml/badge.svg?style=shield" alt="Github Action">
  </a>
  <a href="https://github.com/facebook/jest">
    <img src="https://img.shields.io/badge/tested_with-jest-99424f.svg" alt="Jest">
  </a>
  <a href="https://codecov.io/gh/gcirone/cypress-contract-stubs">
    <img src="https://codecov.io/gh/gcirone/cypress-contract-stubs/branch/master/graph/badge.svg" alt="Codecov" />
  </a>
</p>

The **cypress-contract-stubs** adds support for using [Spring Cloud Contract Stub](https://spring.io/projects/spring-cloud-contract) entries when testing with Cypress. 
This plugin is able to download artifacts form **nexus** and **nexus3** artifact repository and cache the stubs in local for better runtime performance. 

## Get started

### Installation

Install the plugin by running:

```shell
npm install --save-dev cypress-contract-stubs
```

### Cypress Configuration

Add it to your plugin file:

`cypress/plugins/index.js`

```javascript
const { contractStubsPlugin } = require('cypress-contract-stubs');

module.exports = async (on, config) => {
  await contractStubsPlugin(on, config);
  
  return config;
}
```

Add configuration for remote and local stubs to your Cypress configuration.

The default *mode* is `remote` and the default *type* is `nexus3`

`cypress.json`

```json
{
  "env": {
    "stubs": [
      {
        "mode": "remote",
        "id": "internal.contracts:artifact-name:+:stubs",
        "type": "nexus3",
        "server": "http://nexus3.proxy.internal",
        "repository": "maven-releases"
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

### Use cy commands

Add it to your support file:

`cypress/support/index.js`

```javascript
import 'cypress-contract-stubs/commands';
```

In your test files, will be available the following commands:

- `cy.contractStubs` Get all available stub entries
- `cy.contractStub` Get stub entry by options (if more stubs match the criteria will be returned the first occurrence)

```javascript
cy.contractStubs().then((stubs) => console.log(stubs));
cy.contractStub({ name: 'stubName' }).then((stub) => console.log(stub));
```

## License

cypress-contract-stubs is [MIT licensed](./LICENSE).
