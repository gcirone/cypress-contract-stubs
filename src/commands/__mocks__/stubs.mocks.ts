export const mockStubs = [
  {
    name: 'a',
    request: {
      method: 'GET',
      url: '/a',
      headers: { h1: { matches: '.*' } }
    },
    response: {
      body: 'a'
    }
  },
  {
    name: 'b',
    request: {
      method: 'GET',
      urlPattern: '.*',
      queryParameters: { q1: { equalTo: '1' } }
    },
    response: {
      body: 'b'
    }
  },
  {
    name: 'c',
    request: {
      method: 'POST',
      urlPathPattern: '/path/?+other',
      headers: { h1: { matches: '.*' }, h2: { equalTo: '2' } },
      queryParameters: { q1: { equalTo: '1' }, q2: { matches: '.*' } }
    },
    response: {
      status: 204,
      body: 'c',
      headers: {
        hr: 'x'
      }
    }
  }
];
