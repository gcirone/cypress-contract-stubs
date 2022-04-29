import { StubEntries, stubEntries, StubEntry } from './stubs-entries';
import { filter, pickBy, set } from 'lodash';

function filterStubEntries(config: Cypress.StubOptions): StubEntry | null {
  const filters = pickBy({
    name: config?.name,
    'request.method': config?.method,
    'request.url': config?.url,
    'response.status': config?.status
  });

  const stubFilters = Object.keys(filters).reduce((value, key) => set(value, key, filters[key]), {});

  const stubs = filter(stubEntries, stubFilters);

  return stubs.length ? stubs[0] : null;
}

function getAllStubEntries(): StubEntries {
  return stubEntries;
}

export function stubsTasks(on: Cypress.PluginEvents) {
  on('task', {
    'contract:stubs': getAllStubEntries,
    'contract:stub': filterStubEntries
  });
}
