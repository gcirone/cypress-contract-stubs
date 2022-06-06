import type { RouteMatcherOptions } from 'cypress/types/net-stubbing';
import type { StubEntries, StubEntry, StubRequest } from '../plugin/stubs/stubs-entries';

declare global {
  namespace Cypress {
    interface InterceptStubsOptions {
      names?: string[];
      headers?: Record<string, any>;
    }

    interface Chainable {
      interceptStubs(options?: InterceptStubsOptions): Chainable<null>;
    }
  }
}

export function interceptStubs(options?: Cypress.InterceptStubsOptions) {
  cy.task<StubEntries>('contract:stubs', null, { log: false }).then((stubs) => {
    stubs
      .filter((stub) => filterByStubNames(stub.name, options?.names))
      .filter((stub) => filterByStubOptions(stub, options))
      .sort(sortByPriority)
      .forEach(({ id, name, request, response }) => {
        try {
          const matcher: RouteMatcherOptions = { query: {}, headers: {} };
          matcher.method = request.method;
          matchRequestUrl(request, matcher);
          matchRequestQueryParams(request, matcher);
          matchRequestHeaders(request, matcher);

          cy.intercept(matcher, (req) => {
            req.reply(response.status || 200, response.body, response.headers);
          }).as(id);
        } catch (e: any) {
          console.error(`Error when generating matcher for stub "${name}"`, e.message);
        }
      });
  });
}

function filterByStubNames(name: string, stubNames?: string[]) {
  if (stubNames?.length) {
    return stubNames.includes(name);
  } else {
    return true;
  }
}

function filterByStubOptions({ request }: StubEntry, options?: Cypress.InterceptStubsOptions) {
  let shouldBeIntercepted = true;

  for (const header in options?.headers) {
    const optionsValue = options?.headers[header];
    const stubValue = request.headers?.[header];

    if (stubValue?.equalTo) {
      if (stubValue.equalTo === optionsValue) {
        delete request.headers?.[header];
        shouldBeIntercepted = true;
      } else {
        shouldBeIntercepted = false;
      }
    } else if (stubValue?.matches) {
      if (matchPattern(stubValue.matches).test(optionsValue)) {
        delete request.headers?.[header];
        shouldBeIntercepted = true;
      } else {
        shouldBeIntercepted = false;
      }
    }
  }

  return shouldBeIntercepted;
}

function sortByPriority(stubA: StubEntry, stubB: StubEntry): number {
  const priorityA = stubA.priority || 0;
  const priorityB = stubB.priority || 0;
  return priorityA - priorityB;
}

function matchRequestUrl(request: StubRequest, matcher: RouteMatcherOptions) {
  if (request.url) {
    matcher.url = request.url;
  } else if (request.urlPath) {
    matcher.path = request.urlPath;
  } else if (request.urlPattern) {
    matcher.url = matchPattern(request.urlPattern);
  } else if (request.urlPathPattern) {
    matcher.path = matchPattern(request.urlPathPattern);
  }
}

function matchRequestQueryParams(request: StubRequest, matcher: RouteMatcherOptions) {
  for (const param in request.queryParameters) {
    const value = request.queryParameters[param];

    if (value.equalTo) {
      matcher.query![param] = value.equalTo;
    } else if (value.matches) {
      matcher.query![param] = matchPattern(value.matches);
    }
  }
}

function matchRequestHeaders(request: StubRequest, matcher: RouteMatcherOptions) {
  for (const header in request.headers) {
    const value = request.headers[header];

    if (value.equalTo) {
      matcher.headers![header] = value.equalTo;
    } else if (value.matches) {
      matcher.headers![header] = matchPattern(value.matches);
    }
  }
}

function matchPattern(pattern: string) {
  return new RegExp(pattern.replace('?+', '?.*'), 'g');
}

Cypress.Commands.add('interceptStubs', interceptStubs);
