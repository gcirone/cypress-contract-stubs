export interface ArchiveEntry {
  path: string;
  type: number;
}

export interface StubEntry {
  id: string;
  request: Record<string, any>;
  response: Record<string, any>;
  uuid: string;
  name: string;
}

export type StubEntries = StubEntry[];
