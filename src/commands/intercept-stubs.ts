import type { RouteMatcherOptions } from 'cypress/types/net-stubbing';
import type { StubEntries, StubRequest } from '../plugin/stubs/stubs-entries';

declare global {
  namespace Cypress {
    interface Chainable {
      interceptStubs(stubNames?: string[]): Chainable<null>;
    }
  }
}

export function interceptStubs(stubNames?: string[]) {
  cy.task<StubEntries>('contract:stubs', null, { log: false }).then((stubs) => {
    stubs
      .filter(({ name }) => filterByStubNames(name, stubNames))
      .forEach(({ name, request, response }) => {
        try {
          const matcher: RouteMatcherOptions = { query: {}, headers: {} };
          matcher.method = request.method;
          matchRequestUrl(request, matcher);
          matchRequestQueryParams(request, matcher);
          matchRequestHeaders(request, matcher);

          cy.intercept(matcher, (req) => {
            req.reply(response.status || 200, response.body, response.headers);
          }).as(name);
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
