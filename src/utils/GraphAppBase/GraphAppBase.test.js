import React from "react";
import TestRenderer from "react-test-renderer";
import {
  mockDriver,
  flushPromises,
  desktopApiContexts
} from "../../../config/test_helpers";

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
        connectionDetails: "no!"
      })
    );
  });
});
// test("GraphAppBase passes connection state to render prop", () => {
//   // Given
//   let componentOnContextUpdate;
//   const onContextUpdate = jest.fn();
//   const getContext = jest.fn(() =>
//     Promise.resolve(desktopApiContexts.activeGraph)
//   );
//   const integrationPoint = {
//     getContext: () => getContext(),
//     onContextUpdate: fn => (componentOnContextUpdate = fn)
//   };
//   const render = jest.fn(({ on }) => {
//     on("EVENT", onContextUpdate);
//     return "Hello from render props (spy)";
//   });
//   const runSpy = jest.fn(() => Promise.resolve());
//   const closeSpy = jest.fn(() => Promise.resolve());
//   const driver = jest.fn(() => mockDriver(runSpy, closeSpy));

//   // When
//   const out = TestRenderer.create(
//     <GraphAppBase
//       driverFactory={driverFactory(driver)}
//       render={render}
//       integrationPoint={integrationPoint}
//     />
//   );
//   componentOnContextUpdate({ type: "EVENT" }, "x", "y");

//   // Then
//   return flushPromises().then(() => {
//     expect(out.toJSON()).toMatchSnapshot();
//     expect(driver).toHaveBeenCalledTimes(1);
//     expect(render).toHaveBeenCalledTimes(3);
//     expect(render).toHaveBeenLastCalledWith(
//       expect.objectContaining({ connectionState: CONNECTED })
//     );
//   });

//   // When
// });
