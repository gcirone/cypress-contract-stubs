export interface ArchiveEntry {
  path: string;
  type: number;
}

export interface StubEntry {
  id: string;
  request: Record<string, any>; // eslint-disable-line
  response: Record<string, any>; // eslint-disable-line
  uuid: string;
  name: string;
}

export type StubEntries = StubEntry[];

/**
 * Array containing all stubs entries
 */
export const stubEntries: StubEntries = [];

/**
 * Append stub entries
 *
 * @param stubs
 */
export function storeStubEntries(stubs: StubEntries): void {
  stubEntries.push(...stubs);
}
