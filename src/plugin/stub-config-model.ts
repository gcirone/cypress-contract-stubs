export type StubConfigMode = 'remote' | 'local' | 'file';

export interface RemoteStubConfig {
  mode: StubConfigMode;
  id: string;
  type?: 'nexus';
  server: string;
  repository: string;
}

export interface FileStubConfig {
  mode: StubConfigMode;
  file: string;
  path: string;
}

export type StubConfig = RemoteStubConfig & FileStubConfig;

export type StubsConfig = StubConfig[];
