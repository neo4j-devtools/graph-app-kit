import {
  connectDriver,
  getActiveDatabaseCredentials,
  subscribeToDatabaseCredentialsForActiveGraph
} from "./helpers";
import { mockDriver, flushPromises } from "../../../config/test_helpers";

const createApiResponse = graphs => ({
  projects: [{ graphs }]
});

describe("getActiveDatabaseCredentials", () => {
  test("getActiveDatabaseCredentials finds the active connection from a context object and returns the credentials for bolt in driver friendly format", () => {
    // Given
    const bolt1 = {
      username: "one",
      password: "one1",
      host: "localhost",
      port: "0001",
      tlsLevel: "REQUIRED"
    };
    const bolt2 = {
      username: "two",
      password: "two2",
      host: "localhost",
      port: "0002",
      tlsLevel: "NOT_REQUIRED"
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
    const firstActive = getActiveDatabaseCredentials(id1Active);
    const secondActive = getActiveDatabaseCredentials(id2Active);
    const zeroActive = getActiveDatabaseCredentials(noActive);

    // Then
    expect(firstActive).toEqual({
      host: `bolt://${bolt1.host}:${bolt1.port}`,
      encrypted: true,
      username: bolt1.username,
      password: bolt1.password
    });
    expect(secondActive).toEqual({
      host: `bolt://${bolt2.host}:${bolt2.port}`,
      encrypted: false,
      username: bolt2.username,
      password: bolt2.password
    });
    expect(zeroActive).toEqual(null);
  });
});

describe("connectriver", () => {
  const driverFactory = driver => ({
    auth: { basic: (u, p) => `${u}:${p}` },
    driver
  });

  test("calls onConnectionSuccessful with driver if db.indexes query is successful", () => {
    const sessionRunSpy = jest.fn(() => Promise.resolve());
    const sessionCloseSpy = jest.fn(() => Promise.resolve());
    const driverMock = mockDriver(sessionRunSpy, sessionCloseSpy);
    const driver = jest.fn(() => driverMock);
    const factoryDriver = driverFactory(driver);
    const credentials = {
      host: "bolt://localhost:0001",
      encrypted: true,
      username: "one",
      password: "one1"
    };
    const onConnectionSuccessful = jest.fn();
    const onConnectionFailed = jest.fn();
    // When
    connectDriver(
      credentials,
      factoryDriver,
      onConnectionSuccessful,
      onConnectionFailed
    );

    // Then
    expect(driver).toHaveBeenCalledWith(
      credentials.host,
      factoryDriver.auth.basic(credentials.username, credentials.password),
      { encrypted: credentials.encrypted }
    );
    expect(sessionRunSpy).toHaveBeenCalledWith("CALL db.indexes()");
    return flushPromises().then(() => {
      expect(onConnectionSuccessful).toHaveBeenCalledWith(driverMock);
      expect(sessionCloseSpy).toHaveBeenCalled();
    });
  });

  test("calls onConnectionFailed if db.indexes query is unsuccessful", () => {
    const sessionRunSpy = jest.fn(() => Promise.reject());
    const sessionCloseSpy = jest.fn(() => Promise.resolve());
    const driverMock = mockDriver(sessionRunSpy, sessionCloseSpy);
    const driver = jest.fn(() => driverMock);
    const factoryDriver = driverFactory(driver);
    const credentials = {
      host: "bolt://localhost:0001",
      encrypted: true,
      username: "one",
      password: "one1"
    };
    const onConnectionSuccessful = jest.fn();
    const onConnectionFailed = jest.fn();
    // When
    connectDriver(
      credentials,
      factoryDriver,
      onConnectionSuccessful,
      onConnectionFailed
    );

    // Then
    expect(driver).toHaveBeenCalledWith(
      credentials.host,
      factoryDriver.auth.basic(credentials.username, credentials.password),
      { encrypted: credentials.encrypted }
    );
    expect(sessionRunSpy).toHaveBeenCalledWith("CALL db.indexes()");
    return flushPromises().then(() => {
      expect(onConnectionFailed).toHaveBeenCalled();
      expect(sessionCloseSpy).toHaveBeenCalled();
    });
  });

  test("calls onConnectionFailed if driver.onError callback is invoked", () => {
    const driverMock = mockDriver();
    const driver = jest.fn(() => driverMock);
    const factoryDriver = driverFactory(driver);
    const credentials = {
      host: "bolt://localhost:0001",
      encrypted: true,
      username: "one",
      password: "one1"
    };
    const onConnectionSuccessful = jest.fn();
    const onConnectionFailed = jest.fn();
    // When
    connectDriver(
      credentials,
      factoryDriver,
      onConnectionSuccessful,
      onConnectionFailed
    );

    // Then
    expect(driver).toHaveBeenCalledWith(
      credentials.host,
      factoryDriver.auth.basic(credentials.username, credentials.password),
      { encrypted: credentials.encrypted }
    );
    expect(driverMock.onError).toBeDefined();

    // When
    driverMock.onError();

    // Then
    expect(onConnectionFailed).toHaveBeenCalled();
  });
});

describe("subscribeToDatabaseCredentialsForActiveGraph", () => {
  test("subscribeToDatabaseCredentialsForActiveGraph calls onNewActiveGraph with new credentials when integration point update function is called with GRAPH_ACTIVE event", () => {
    // Given
    const onNewActiveGraph = jest.fn();
    const bolt1 = {
      username: "one",
      password: "one1",
      host: "localhost",
      port: "0001",
      tlsLevel: "REQUIRED"
    };

    const bolt2 = {
      username: "two",
      password: "two2",
      host: "localhost",
      port: "0002",
      tlsLevel: "NOT_REQUIRED"
    };

    const context1 = createApiResponse([
      {
        status: "ACTIVE",
        connection: {
          configuration: {
            protocols: { bolt: bolt1 }
          }
        }
      }
    ]);
    const context2 = createApiResponse([
      {
        status: "ACTIVE",
        connection: {
          configuration: {
            protocols: { bolt: bolt2 }
          }
        }
      }
    ]);
    var updateFuntion = () => {};
    const integrationPoint = {
      getContext: () => {
        return {
          // Fake promise
          then: fn => {
            fn(context1);
            return { catch: () => {} };
          }
        };
      },
      onContextUpdate: newUpdateFunction => {
        updateFuntion = newUpdateFunction;
      }
    };

    // When
    subscribeToDatabaseCredentialsForActiveGraph(
      integrationPoint,
      onNewActiveGraph,
      () => {}
    );

    expect(updateFuntion).toBeDefined();

    //When
    updateFuntion({ type: "GRAPH_ACTIVE" }, context2, context1);

    // Then
    expect(onNewActiveGraph).toHaveBeenLastCalledWith({
      host: `bolt://${bolt2.host}:${bolt2.port}`,
      encrypted: false,
      username: bolt2.username,
      password: bolt2.password
    });
  });
  test("subscribeToDatabaseCredentialsForActiveGraph calls onNoActiveGraph when integration point update function is called with GRAPH_INACTIVE event", () => {
    // Given
    const onNoActiveGraph = jest.fn();
    const bolt1 = {
      username: "one",
      password: "one1",
      host: "localhost",
      port: "0001",
      tlsLevel: "REQUIRED"
    };

    const context1 = createApiResponse([
      {
        status: "ACTIVE",
        connection: {
          configuration: {
            protocols: { bolt: bolt1 }
          }
        }
      }
    ]);
    const context2 = createApiResponse([
      {
        status: "INACTIVE",
        connection: {
          configuration: {
            protocols: { bolt: bolt1 }
          }
        }
      }
    ]);

    var updateFuntion = () => {};
    const integrationPoint = {
      getContext: () => {
        return {
          // Fake promise
          then: fn => {
            fn(context1);
            return { catch: () => {} };
          }
        };
      },
      onContextUpdate: newUpdateFunction => {
        updateFuntion = newUpdateFunction;
      }
    };

    // When
    subscribeToDatabaseCredentialsForActiveGraph(
      integrationPoint,
      () => {},
      onNoActiveGraph
    );

    expect(updateFuntion).toBeDefined();

    //When
    updateFuntion({ type: "GRAPH_INACTIVE" }, context2, context1);

    // Then
    expect(onNoActiveGraph).toHaveBeenCalled();
  });
});
