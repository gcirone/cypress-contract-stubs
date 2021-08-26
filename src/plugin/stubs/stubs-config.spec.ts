import { configVars, localStubs, parseConfiguration, remoteStubs } from './stubs-config';
import { expect } from '@jest/globals';

describe('StubConfig Test', () => {
  const stubs = [{ mode: 'remote' }, { mode: 'local' }, { mode: 'remote' }];

  const customVars = {
    stubs_maven_repo: 'maven/.m2/repository',
    stubs_cache_path: 'dist/stubs',
    stubs_server: 'http://127.0.0.1:3333',
    stubs_repository: 'main-releases',
    stubs_endpoint_nexus3: 'service/rest/v2/search/assets',
    stubs_endpoint_nexus3_context: 'nexus3',
    stubs_endpoint_nexus: 'service/proxy/artifact/maven/resolve',
    stubs_endpoint_nexus_repos: 'proxy/service/local/repositories',
    stubs_endpoint_nexus_context: 'nexus'
  };

  it('should return default configuration variables', () => {
    expect(configVars).toMatchSnapshot();
  });

  it('should parse plugin configuration variables', () => {
    parseConfiguration(customVars);
    expect(configVars).toMatchSnapshot();
  });

  it('should filter and store local and remote stubs', () => {
    parseConfiguration({ stubs });
    expect(localStubs.length).toBe(1);
    expect(remoteStubs.length).toBe(2);
  });
});
