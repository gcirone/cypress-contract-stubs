export const mockStubs = [
  {
    id: 'a:5885',
    name: 'a',
    request: {
      method: 'GET',
      url: '/a',
      headers: { h1: { matches: '.*' } }
    },
    response: {
      body: 'a'
    },
    uuid: '6eb5d8c6-5885-428e-9286-0855791b9a60'
  },
  {
    id: 'b:f0fa',
    name: 'b',
    request: {
      method: 'GET',
      urlPattern: '.*',
      headers: { tpl: { equalTo: 'tpl1' } },
      queryParameters: { q1: { equalTo: '1' } }
    },
    response: {
      body: 'b'
    },
    uuid: '3c00bb6a-f0fa-41fd-8ab0-c579830e7db8',
    priority: 1
  },
  {
    id: 'b:5163',
    name: 'b',
    request: {
      method: 'GET',
      urlPattern: '.*',
      headers: { tpl: { matches: 'tpl2' } },
      queryParameters: { q1: { equalTo: '1' } }
    },
    response: {
      body: 'b'
    },
    uuid: '9d58e8d3-5163-4d0e-81f9-4479740579c1',
    priority: 1
  },
  {
    id: 'b:f119',
    name: 'b',
    request: {
      method: 'GET',
      urlPattern: '.*',
      queryParameters: { q1: { equalTo: '1' } }
    },
    response: {
      body: 'b3'
    },
    uuid: '5f20fd44-f119-47fd-b475-53bf19d7f098'
  },
  {
    id: 'c:f70c',
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
    },
    uuid: '68693422-f70c-4019-ab7f-d44329729495'
  }
];
