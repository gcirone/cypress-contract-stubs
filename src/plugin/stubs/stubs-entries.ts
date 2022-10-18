export interface ArchiveEntry {
  path: string;
  type: number;
}

export interface StubMatcher {
  equalTo?: string;
  equalToJson?: string;
  matches?: string;
  expression?: string;
}

export interface StubRequest {
  method?: string;
  url?: string;
  urlPath?: string;
  urlPattern?: string;
  urlPathPattern?: string;
  queryParameters?: Record<string, StubMatcher>;
  headers?: Record<string, StubMatcher>;
  bodyPatterns?: { matchesJsonPath: StubMatcher }[];
}

export interface StubResponse {
  status?: number;
  body?: any;
  headers?: Record<string, string>;
  transformers?: string[];
}

export interface StubEntry {
  id: string;
  request: StubRequest;
  response: StubResponse;
  uuid: string;
  name: string;
  consumer?: string;
  priority?: number;
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
