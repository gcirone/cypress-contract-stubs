import type { RouteMatcherOptions, CyHttpMessages } from 'cypress/types/net-stubbing';
import type { StubEntries, StubEntry, StubRequest } from '../plugin/stubs/stubs-entries';
import jsonpath from 'jsonpath';

declare global {
  namespace Cypress {
    interface InterceptStubsOptions {
      names?: string[];
      headers?: Record<string, any>;
      matchRequestHandler?: (request: CyHttpMessages.IncomingRequest) => boolean;
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
            const replayWithStubResponse = () => {
              const { status, body, headers } = response;
              req.reply(status || 200, body, headers);
            };

            if (options?.matchRequestHandler) {
              if (options.matchRequestHandler(req)) {
                replayWithStubResponse();
              }
            } else {
              if (request.bodyPatterns) {
                if (matchRequestBody(request, JSON.parse(req.body))) {
                  replayWithStubResponse();
                }
              } else {
                replayWithStubResponse();
              }
            }
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

function matchRequestBody(request: StubRequest, body: any) {
  const shouldReplyWithStub: boolean[] = [];
  
  for (const { matchesJsonPath } of request?.bodyPatterns || []) {
    const { expression, equalTo, equalToJson } = matchesJsonPath;
    const [value] = expression && jsonpath.query(body, expression);

    if (equalTo && value) {
      shouldReplyWithStub.push(equalTo === value);
    } else if (equalToJson && value) {
      shouldReplyWithStub.push(equalToJson === JSON.stringify(value));
    }
  }

  return shouldReplyWithStub.every((r) => r);
}

function matchPattern(pattern: string) {
  return new RegExp(pattern.replace('?+', '?.*'), 'g');
}

Cypress.Commands.add('interceptStubs', interceptStubs);
