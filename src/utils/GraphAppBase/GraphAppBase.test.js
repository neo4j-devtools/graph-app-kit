import React from "react";
import TestRenderer from "react-test-renderer";
import {
  mockDriver,
  flushPromises,
  desktopApiContexts
} from "../../../config/test_helpers";
import { helpers as integrationHelpers } from "../DesktopIntegration";

import { GraphAppBase, CONNECTED, DISCONNECTED } from "./GraphAppBase";

const driverFactory = driver => ({
  auth: { basic: (u, p) => `${u}:${p}` },
  driver
});

test("GraphAppBase renders", () => {
  const out = TestRenderer.create(
    <GraphAppBase
      driverFactory={driverFactory()}
      render={() => "Hello from render prop"}
    />
  );
  expect(out.toJSON()).toMatchSnapshot();
});

test("GraphAppBase passes connection state and connection details to render prop", () => {
  // Given
  const integrationPoint = {
    getContext: () => Promise.resolve(desktopApiContexts.activeGraph)
  };
  const render = jest.fn(() => "Hello from render props (spy)");
  const driverMock = mockDriver();
  const driver = jest.fn(() => driverMock);

  // When
  const out = TestRenderer.create(
    <GraphAppBase
      driverFactory={driverFactory(driver)}
      render={render}
      integrationPoint={integrationPoint}
    />
  );

  // Then
  expect(render).toHaveBeenCalledTimes(1);
  expect(render).toHaveBeenLastCalledWith(
    expect.objectContaining({
      connectionState: DISCONNECTED,
      connectionDetails: null
    })
  );

  return flushPromises().then(() => {
    expect(out.toJSON()).toMatchSnapshot();
    expect(driver).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenCalledTimes(2);
    expect(render).toHaveBeenLastCalledWith(
      expect.objectContaining({
        connectionState: CONNECTED,
        connectionDetails: null
      })
    );

    // When
    driverMock.onError({ message: "no!" });

    // Then
    expect(render).toHaveBeenCalledTimes(3);
    expect(render).toHaveBeenLastCalledWith(
      expect.objectContaining({
        connectionState: DISCONNECTED,
        connectionDetails: { message: "no!" }
      })
    );
  });
});

test("GraphAppBase passes the context object to render prop", () => {
  // Given
  const integrationPoint = {
    getContext: () => Promise.resolve(desktopApiContexts.activeGraph)
  };
  const render = jest.fn(() => "Hello from render props (spy)");
  const driverMock = mockDriver();
  const driver = jest.fn(() => driverMock);

  // When
  const out = TestRenderer.create(
    <GraphAppBase
      driverFactory={driverFactory(driver)}
      render={render}
      integrationPoint={integrationPoint}
    />
  );

  // Then
  expect(render).toHaveBeenCalledTimes(1);

  return flushPromises().then(() => {
    expect(render).toHaveBeenLastCalledWith(
      expect.objectContaining({
        initialDesktopContext: desktopApiContexts.activeGraph
      })
    );
  });
});

test("GraphAppBase exposes 'setCredentials' and tries to connect when called", () => {
  // Given
  const integrationPoint = {
    getContext: () => Promise.resolve(desktopApiContexts.activeGraph)
  };
  let outerSetCredentials;
  const render = jest.fn(({ setCredentials }) => {
    outerSetCredentials = setCredentials;
    return "In render";
  });
  const driverMock = mockDriver();
  const driver = jest.fn(() => driverMock);
  const factoryDriver = driverFactory(driver);
  const creds = integrationHelpers.getActiveCredentials(
    "bolt",
    desktopApiContexts.activeGraph
  );
  const host = `bolt://${creds.host}:${creds.port}`;
  const encrypted = creds.tlsLevel === "REQUIRED";
  const username = "Stella";
  const password = "password";

  // When
  TestRenderer.create(
    <GraphAppBase
      driverFactory={factoryDriver}
      render={render}
      integrationPoint={integrationPoint}
    />
  );

  // Then
  expect(render).toHaveBeenCalledTimes(1);
  expect(render).toHaveBeenLastCalledWith(
    expect.objectContaining({
      setCredentials: expect.anything()
    })
  );

  // When
  outerSetCredentials(username, password);

  // Then
  return flushPromises().then(() => {
    expect(driver).toHaveBeenCalledTimes(2);
    expect(driver).toHaveBeenLastCalledWith(
      host,
      factoryDriver.auth.basic(username, password),
      { encrypted }
    );
  });
});

test("GraphAppBase exposes 'on' so we can listen on events", () => {
  // Given
  let componentOnContextUpdate;
  const integrationPoint = {
    getContext: () => Promise.resolve(desktopApiContexts.activeGraph),
    onContextUpdate: fn => (componentOnContextUpdate = fn)
  };
  const onContextUpdate = jest.fn();
  const type = "EVENT";
  const type2 = "EVENT2";
  const oldContext = "newContext";
  const oldContext2 = "newContext2";
  const newContext = "newContext";
  const newContext2 = "newContext2";
  const render = jest.fn(({ on }) => {
    on(type, onContextUpdate); // Listen
    on(type2, onContextUpdate); // on two event types
    return "yo!";
  });
  const driver = jest.fn(() => mockDriver());

  // When
  TestRenderer.create(
    <GraphAppBase
      driverFactory={driverFactory(driver)}
      render={render}
      integrationPoint={integrationPoint}
    />
  );

  // Then
  expect(render).toHaveBeenCalledTimes(1);
  expect(render).toHaveBeenLastCalledWith(
    expect.objectContaining({
      on: expect.anything()
    })
  );

  // When
  componentOnContextUpdate({ type }, oldContext, newContext);

  // Then
  return flushPromises().then(() => {
    expect(driver).toHaveBeenCalledTimes(1);
    expect(onContextUpdate).toHaveBeenCalledTimes(1);
    expect(onContextUpdate).toHaveBeenLastCalledWith(
      type,
      newContext,
      oldContext
    );

    // When
    componentOnContextUpdate({ type: type2 }, oldContext2, newContext2);

    // Then
    return flushPromises().then(() => {
      expect(driver).toHaveBeenCalledTimes(1);
      expect(onContextUpdate).toHaveBeenCalledTimes(2);
      expect(onContextUpdate).toHaveBeenLastCalledWith(
        type2,
        newContext2,
        oldContext2
      );
    });
  });
});

test("GraphAppBase exposes 'off' so we can stop listening on events", () => {
  // Given
  let componentOnContextUpdate;
  const integrationPoint = {
    getContext: () => Promise.resolve(desktopApiContexts.activeGraph),
    onContextUpdate: fn => (componentOnContextUpdate = fn)
  };
  const onContextUpdate = jest.fn();
  const type = "EVENT";
  const type2 = "EVENT2";
  const oldContext = "newContext";
  const newContext = "newContext";
  const render = jest.fn(({ on, off }) => {
    on(type, onContextUpdate); // Listen on one event
    on(type2, onContextUpdate);
    off(type2, onContextUpdate); // Stop listening on second
    return "yo!";
  });
  const driver = jest.fn(() => mockDriver());

  // When
  TestRenderer.create(
    <GraphAppBase
      driverFactory={driverFactory(driver)}
      render={render}
      integrationPoint={integrationPoint}
    />
  );

  // Then
  expect(render).toHaveBeenCalledTimes(1);
  expect(render).toHaveBeenLastCalledWith(
    expect.objectContaining({
      off: expect.anything()
    })
  );

  // When
  componentOnContextUpdate({ type }, oldContext, newContext);

  // Then
  return flushPromises().then(() => {
    expect(driver).toHaveBeenCalledTimes(1);
    expect(onContextUpdate).toHaveBeenCalledTimes(1);
    expect(onContextUpdate).toHaveBeenLastCalledWith(
      type,
      newContext,
      oldContext
    );

    // When
    componentOnContextUpdate({ type: type2 }, null, null);

    // Then
    return flushPromises().then(() => {
      expect(driver).toHaveBeenCalledTimes(1);
      expect(onContextUpdate).toHaveBeenCalledTimes(1);
    });
  });
});
