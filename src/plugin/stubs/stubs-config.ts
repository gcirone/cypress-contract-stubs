export interface LocalStub {
  file: string;
  mode?: 'local';
  path?: string;
}

export interface RemoteStub {
  id: string;
  mode?: 'remote';
  type?: 'nexus' | 'nexus3';
  server?: string;
  repository?: string;
}

export let configVars: {
  mavenRepo: string;
  cachePath: string;
  server: string;
  repository: string;
  endpointNexus3: string;
  endpointNexus3Context: string;
  endpointNexus: string;
  endpointNexusContext: string;
  endpointNexusRepos: string;
};

export let localStubs: LocalStub[] = [];
export let remoteStubs: RemoteStub[] = [];

/**
 * Parse plugin configuration
 *
 * @param env
 */
// eslint-disable-next-line
export function parseConfiguration(env: Record<string, any>): void {
  const stubs = Array.isArray(env.stubs) ? env.stubs : [];
  localStubs = stubs.filter((stub) => stub.mode === 'local');
  remoteStubs = stubs.filter((stub) => stub.mode === 'remote');

  configVars = {
    mavenRepo: env.stubs_maven_repo || '.m2/repository',
    cachePath: env.stubs_cache_path || 'node_modules/.cache/stubs',
    server: env.stubs_server || 'http://localhost:8081',
    repository: env.stubs_repository || 'maven-releases',
    endpointNexus3: env.stubs_endpoint_nexus3 || 'service/rest/v1/search/assets',
    endpointNexus3Context: env.stubs_endpoint_nexus3_context || '',
    endpointNexus: env.stubs_endpoint_nexus || 'service/local/artifact/maven/resolve',
    endpointNexusRepos: env.stubs_endpoint_nexus || 'service/local/repositories',
    endpointNexusContext: env.stubs_endpoint_nexus_context || 'nexus'
  };
}

/**
 * Retrieve component coordinates from artifact id
 * @param id
 */
export function stubCoordinate(id: string): {
  groupId: string;
  artifactId: string;
  version: string;
  classifier: string;
} {
  const [groupId, artifactId, version, classifier] = id.split(':');
  return { groupId, artifactId, version, classifier };
}
