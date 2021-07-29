export interface RemoteStubConfig {
  mode?: 'remote';
  id?: string;
  type?: 'nexus';
  server?: string;
  repository?: string;
}

export interface FileStubConfig {
  mode?: 'file';
  file: string;
  path: string;
}

export type StubConfig = RemoteStubConfig & FileStubConfig;

export type StubsConfig = StubConfig[];
