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

export const stubEntries: StubEntries = [];

export function storeStubEntries(stubs: StubEntries): void {
  stubEntries.push(...stubs);
}

export function cleanStubEntries(): void {
  stubEntries.splice(0, stubEntries.length);
}
