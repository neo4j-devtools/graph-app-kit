import {
  getCredentials,
  getActiveGraph,
  eventToHandler,
  didChangeActiveGraph,
  getActiveCredentials
} from "./helpers";

test("getActiveGraph handles non objects and non-active projects", () => {
  // Given
  const graphs = [
    null,
    "string",
    undefined,
    [1],
    { project: null },
    { projects: { x: 1 } },
    { projects: [null] },
    { projects: [{ x: 1 }] },
    { projects: [{ graphs: [{ status: "NOPE" }] }] }
  ];

  // When && Then
  graphs.forEach(graph => {
    expect(getActiveGraph(graph)).toEqual(null);
  });
});
test("getActiveGraph handles expected objects", () => {
  // Given
  const graph = {
    status: "ACTIVE"
  };
  const graph2 = {
    status: "INACTIVE"
  };
  const apiResponse = {
    projects: [
      {
        graphs: [graph, graph2]
      }
    ]
  };

  // When
  const activeGraph = getActiveGraph(apiResponse);

  // Then
  expect(activeGraph).toEqual(graph);
});

test("getCredentials handles non objects", () => {
  // Given
  const configs = [
    null,
    "string",
    undefined,
    [1],
    { configuration: { protocols: "hello" } }
  ];

  // When && Then
  configs.forEach(config => {
    expect(getCredentials("xxx", config)).toBe(null);
  });
});

test("getCredentials finds credentials on expected format", () => {
  // Given

  const config = {
    bolt: {
      username: "molly",
      password: "stella"
    },
    http: {
      username: "oskar",
      password: "picachu"
    }
  };
  const connection = {
    configuration: { protocols: config }
  };

  // When
  const boltRes = getCredentials("bolt", connection);
  const httpRes = getCredentials("http", connection);
  const notFoundRes = getCredentials("https", connection);

  // Then
  expect(boltRes).toEqual(config.bolt);
  expect(httpRes).toEqual(config.http);
  expect(notFoundRes).toBe(null);
});

test("XXX_YYY -> onXxxYyy", () => {
  // Given
  const tests = [
    { type: undefined, expect: null },
    { type: true, expect: null },
    { type: "XXX", expect: "onXxx" },
    { type: "_XXX", expect: "onXxx" },
    { type: "XXX_YYY", expect: "onXxxYyy" },
    { type: "XXX_YYY_ZZZ", expect: "onXxxYyyZzz" },
    { type: "xxx", expect: "onXxx" },
    { type: "xxx_yyy", expect: "onXxxYyy" },
    { type: "XXX_123", expect: "onXxx123" },
    { type: "0", expect: "on0" },
    { type: "1", expect: "on1" },
    { type: 1, expect: null }
  ];

  // When && Then
  tests.forEach(test => {
    expect(eventToHandler(test.type)).toEqual(test.expect);
  });
});

test("didChangeActiveGraph detects if the active graph changed", () => {
  // Given
  const createApiResponse = graphs => ({
    projects: [{ graphs }]
  });
  const id1Active = createApiResponse([
    { id: 1, status: "ACTIVE" },
    { id: 2, status: "INACTIVE" }
  ]);
  const id2Active = createApiResponse([
    { id: 1, status: "INACTIVE" },
    { id: 2, status: "ACTIVE" }
  ]);
  const noActive = createApiResponse([
    { id: 1, status: "INACTIVE" },
    { id: 2, status: "INACTIVE" }
  ]);

  // When
  const noChange = didChangeActiveGraph(id1Active, id1Active);
  const didChange = didChangeActiveGraph(id2Active, id1Active);
  const didChange2 = didChangeActiveGraph(noActive, id1Active);
  const noChange2 = didChangeActiveGraph(noActive, noActive);

  // Then
  expect(noChange).toBe(false);
  expect(didChange).toBe(true);
  expect(didChange2).toBe(true);
  expect(noChange2).toBe(false);
});

test("getActiveCredentials finds the active connection from a context object and returns the creds", () => {
  // Given
  const bolt1 = {
    username: "one",
    password: "one1"
  };
  const bolt2 = {
    username: "two",
    password: "two2"
  };
  const createApiResponse = graphs => ({
    projects: [{ graphs }]
  });
  const id1Active = createApiResponse([
    {
      id: 1,
      status: "ACTIVE",
      connection: {
        configuration: {
          protocols: { bolt: bolt1 }
        }
      }
    },
    {
      id: 2,
      status: "INACTIVE",
      connection: {
        configuration: {
          protocols: { bolt: bolt2 }
        }
      }
    }
  ]);
  const id2Active = createApiResponse([
    {
      id: 1,
      status: "INACTIVE",
      connection: {
        configuration: {
          protocols: { bolt: bolt1 }
        }
      }
    },
    {
      id: 2,
      status: "ACTIVE",
      connection: {
        configuration: {
          protocols: { bolt: bolt2 }
        }
      }
    }
  ]);
  const noActive = createApiResponse([
    {
      id: 1,
      status: "INACTIVE",
      connection: {
        configuration: {
          protocols: { bolt: bolt1 }
        }
      }
    },
    {
      id: 2,
      status: "INACTIVE",
      connection: {
        configuration: {
          protocols: { bolt: bolt2 }
        }
      }
    }
  ]);

  // When
  const firstActive = getActiveCredentials("bolt", id1Active);
  const secondActive = getActiveCredentials("bolt", id2Active);
  const zeroActive = getActiveCredentials("bolt", noActive);

  // Then
  expect(firstActive).toEqual(bolt1);
  expect(secondActive).toEqual(bolt2);
  expect(zeroActive).toEqual(null);
});

test("getActiveCredentials returns null if no active graph", () => {
  // Given
  const bolt1 = {
    username: "one",
    password: "one1"
  };
  const bolt2 = {
    username: "two",
    password: "two2"
  };
  const createApiResponse = graphs => ({
    projects: [{ graphs }]
  });
  const noBolt = createApiResponse([
    {
      id: 1,
      status: "INACTIVE",
      connection: {
        configuration: {
          protocols: { bolt: bolt1 }
        }
      }
    },
    {
      id: 2,
      status: "ACTIVE",
      connection: {
        configuration: {
          protocols: { bolt: bolt2 }
        }
      }
    }
  ]);

  // When
  const zeroActive = getActiveCredentials("https", noBolt);

  // Then
  expect(zeroActive).toEqual(null);
});
