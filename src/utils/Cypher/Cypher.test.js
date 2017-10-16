import React from "react";
import TestRenderer from "react-test-renderer";
import { mockDriver } from "../../../config/test_helpers";
import Cypher, {
  missingRenderPropError,
  missingQueryError,
  missingDriverError
} from "./Cypher";
import DriverProvider from "../DriverProvider";

it("renders without crashing", () => {
  const out = TestRenderer.create(
    <Cypher query="x" driver={mockDriver()} render={() => null} />
  );
  expect(out.toJSON()).toEqual(null);
});

it("throws on missing render prop", () => {
  expect(() => {
    TestRenderer.create(<Cypher />);
  }).toThrowError(missingRenderPropError);
});

it("throws on missing query prop", () => {
  expect(() => {
    TestRenderer.create(<Cypher render={() => null} />);
  }).toThrowError(missingQueryError);
});

it("throws on missing driver prop and driver context", () => {
  expect(() => {
    TestRenderer.create(<Cypher query="x" render={() => null} />);
  }).toThrowError(missingDriverError);
});

it("renders with driver as a prop", () => {
  const out = TestRenderer.create(
    <Cypher driver={mockDriver()} query="x" render={() => null} />
  );
  expect(out.toJSON()).toEqual(null);
});

it("renders with driver context", () => {
  const out = TestRenderer.create(
    <DriverProvider driver={mockDriver()}>
      <Cypher query="x" render={() => null} />
    </DriverProvider>
  );
  expect(out.toJSON()).toEqual(null);
});

it("runs cypher query on mount and not on new props", () => {
  // Given
  const spy = jest.fn((query, params) => Promise.resolve());
  const query = "RETURN rand()";

  // When
  const r = TestRenderer.create(
    <DriverProvider driver={mockDriver(spy)}>
      <Cypher query={query} render={() => null} />
    </DriverProvider>
  );

  // Then
  expect(spy).toHaveBeenLastCalledWith(query, undefined);
  expect(spy).toHaveBeenCalledTimes(1);

  // When
  r.update(
    <DriverProvider driver={mockDriver(spy)}>
      <Cypher query={"xxx"} render={() => null} />
    </DriverProvider>
  );

  // Then
  expect(spy).toHaveBeenLastCalledWith(query, undefined);
  expect(spy).toHaveBeenCalledTimes(1);
});

it("runs cypher query at an interval", () => {
  // Given
  jest.useFakeTimers();

  const spy = jest.fn((query, params) => Promise.resolve());
  const query = "RETURN rand()";

  // When
  const r = TestRenderer.create(
    <DriverProvider driver={mockDriver(spy)}>
      <Cypher
        interval={1} // every second
        query={query}
        render={() => null}
      />
    </DriverProvider>
  );

  // Then
  expect(spy).toHaveBeenLastCalledWith(query, undefined);
  expect(spy).toHaveBeenCalledTimes(1);

  // When
  jest.runOnlyPendingTimers();

  // Then
  expect(spy).toHaveBeenLastCalledWith(query, undefined);
  expect(spy).toHaveBeenCalledTimes(2);

  // When
  jest.runOnlyPendingTimers();

  // Then
  expect(spy).toHaveBeenLastCalledWith(query, undefined);
  expect(spy).toHaveBeenCalledTimes(3);
});

it("passes result argument to render function", () => {
  // Given

  const renderSpy = jest.fn();
  renderSpy.mockImplementation(({ pending, error, result }) => {
    return pending ? "pending" : error ? error : result;
  });
  const closeSpy = jest.fn();
  const runSpy = jest.fn();
  runSpy.mockImplementation(() => Promise.resolve(10));
  const query = "CALL mock";

  // When
  const r = TestRenderer.create(
    <DriverProvider driver={mockDriver(runSpy, closeSpy)}>
      <Cypher query={query} render={renderSpy} />
    </DriverProvider>
  );

  // Then
  let tree = r.toJSON();
  expect(runSpy).toHaveBeenLastCalledWith(query, undefined);
  expect(runSpy).toHaveBeenCalledTimes(1);
  expect(closeSpy).toHaveBeenCalledTimes(0);
  expect(renderSpy).toHaveBeenLastCalledWith({
    pending: true,
    error: null,
    result: null,
    tick: 0
  });
  expect(renderSpy).toHaveBeenCalledTimes(2); // Initial render + pending
  expect(tree).toMatchSnapshot();

  // This is needed to flush the promise chain
  return flushPromises().then(() => {
    tree = r.toJSON();
    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(renderSpy).toHaveBeenLastCalledWith({
      pending: false,
      error: null,
      result: 10,
      tick: 1
    });
    expect(renderSpy).toHaveBeenCalledTimes(3);
    expect(tree).toMatchSnapshot();
  });
});

it("passes error argument to render function", () => {
  // Given

  const renderSpy = jest.fn();
  renderSpy.mockImplementation(({ pending, error, result }) => {
    return pending ? "pending" : error ? error : result;
  });
  const runSpy = jest.fn();
  runSpy.mockImplementation(() => Promise.reject("ERROR"));
  const closeSpy = jest.fn();
  const query = "CALL mock";

  // When
  const r = TestRenderer.create(
    <DriverProvider driver={mockDriver(runSpy, closeSpy)}>
      <Cypher query={query} render={renderSpy} />
    </DriverProvider>
  );

  // Then
  let tree = r.toJSON();
  expect(runSpy).toHaveBeenLastCalledWith(query, undefined);
  expect(runSpy).toHaveBeenCalledTimes(1);
  expect(closeSpy).toHaveBeenCalledTimes(0);
  expect(renderSpy).toHaveBeenCalledTimes(2); // Initial render + pending
  expect(tree).toMatchSnapshot();

  // This is needed to flush the promise chain
  return flushPromises().then(() => {
    tree = r.toJSON();
    expect(closeSpy).toHaveBeenCalledTimes(0); // no closing sessions on error
    expect(renderSpy).toHaveBeenLastCalledWith({
      pending: false,
      error: "ERROR",
      result: null,
      tick: 1
    });
    expect(renderSpy).toHaveBeenCalledTimes(3);
    expect(tree).toMatchSnapshot();
  });
});

function flushPromises() {
  return new Promise(resolve => setImmediate(resolve));
}
