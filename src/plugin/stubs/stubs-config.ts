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

export let configVars = {
  mavenRepository: '.m2/repository',
  cachePath: 'node_modules/.cache/stubs',
  server: 'http://localhost:8081',
  repository: 'maven-releases',
  endpointNexus3: 'service/rest/v1/search/assets',
  endpointNexus3Context: '',
  endpointNexus: 'service/local/artifact/maven/resolve',
  endpointNexusRepositories: 'service/local/repositories',
  endpointNexusContext: ''
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
  remoteStubs = stubs.filter((stub) => stub.mode === undefined || stub.mode === 'remote');

  configVars = {
    mavenRepository: env.stubs_maven_repo || configVars.mavenRepository,
    cachePath: env.stubs_cache_path || configVars.cachePath,
    server: env.stubs_server || configVars.server,
    repository: env.stubs_repository || configVars.repository,
    endpointNexus3: env.stubs_endpoint_nexus3 || configVars.endpointNexus3,
    endpointNexus3Context: env.stubs_endpoint_nexus3_context || configVars.endpointNexus3Context,
    endpointNexus: env.stubs_endpoint_nexus || configVars.endpointNexus,
    endpointNexusRepositories: env.stubs_endpoint_nexus_repos || configVars.endpointNexusRepositories,
    endpointNexusContext: env.stubs_endpoint_nexus_context || configVars.endpointNexusContext
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
