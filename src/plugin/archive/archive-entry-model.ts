export interface ArchiveEntry {
  path: string;
  type: number;
}

export interface StubEntry {
  id: string;
  request: Record<string, unknown>;
  response: Record<string, unknown>;
  uuid: string;
  name: string;
}

export type StubEntries = StubEntry[];
