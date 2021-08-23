export interface LocalStub {
  file: string;
  mode?: 'local';
  path?: string;
}

export interface RemoteStub {
  id: string;
  mode?: 'remote';
  type?: 'nexus';
  server?: string;
  repository?: string;
}

export let localStubs: LocalStub[];

export let remoteStubs: RemoteStub[];

export let configVars: {
  mavenRepo: string;
  cachePath: string;
  server: string;
  repository: string;
  endpoint: string;
};

export function parseConfiguration(env: Record<string, any>): void {
  const stubs = Array.isArray(env.stubs_artifacts) ? env.stubs_artifacts : [];
  localStubs = stubs.filter((stub) => stub.mode === 'file');
  remoteStubs = stubs.filter((stub) => stub.mode === 'remote');

  configVars = {
    mavenRepo: env.stubs_maven_repo || '.m2/repository',
    cachePath: env.stubs_cache_path || 'node_modules/.cache/stubs',

    server: env.stubs_server || 'http://localhost:8081',
    repository: env.stubs_repository || 'maven-releases',
    endpoint: env.stubs_endpoint || 'service/rest/v1/search/assets'
  };
}
