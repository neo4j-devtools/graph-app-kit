import React from "react";
import TestRenderer from "react-test-renderer";
import DesktopIntegration from "./DesktopIntegration";

describe("<DesktopIntegration>", () => {
  test("does not render anything if no integration point", () => {
    // Given
    const integrationPoint = null;

    // When
    const out = TestRenderer.create(
      <DesktopIntegration integrationPoint={integrationPoint} />
    );

    // Then
    expect(out.toJSON()).toEqual(null);
  });
  test("does not render anything if there is an integration point", () => {
    // Given
    const integrationPoint = { x: true };

    // When
    const out = TestRenderer.create(
      <DesktopIntegration integrationPoint={integrationPoint} />
    );

    // Then
    expect(out.toJSON()).toEqual(null);
  });
  test("does not break if theres no onMount", () => {
    // Given
    const integrationPoint = {
      getContext: () => {
        return {
          // Fake promise
          then: fn => {
            fn({ x: 1 });
            return { catch: () => {} };
          }
        };
      }
    };

    // When
    const out = TestRenderer.create(
      <DesktopIntegration integrationPoint={integrationPoint} />
    );

    // Then
    expect(out.toJSON()).toEqual(null);
  });
  test("catches errors in onMount", () => {
    // Given
    const mFn = jest.fn();
    const integrationPoint = {
      getContext: () => Promise.reject()
    };

    // When
    const out = TestRenderer.create(
      <DesktopIntegration integrationPoint={integrationPoint} onMount={mFn} />
    );

    // Then
    expect(out.toJSON()).toEqual(null);
    expect(mFn).not.toHaveBeenCalled();
  });
  test("calls onMount with data on mounting", () => {
    // Given
    const mFn = jest.fn();
    const context = {
      projects: [
        {
          graphs: [
            {
              status: "ACTIVE",
              configuration: {
                protocols: {
                  bolt: {
                    username: "neo4j"
                  }
                }
              }
            }
          ]
        }
      ]
    };
    const integrationPoint = {
      getContext: () => {
        return {
          // Fake promise
          then: fn => {
            fn(context);
            return { catch: () => {} };
          }
        };
      }
    };
    const props = { integrationPoint, onMount: mFn };

    // When
    const out = TestRenderer.create(<DesktopIntegration {...props} />);

    // Then
    expect(out.toJSON()).toEqual(null);
    expect(mFn).toHaveBeenCalledTimes(1);
    out.update(<DesktopIntegration {...props} x={1} />);
    expect(mFn).toHaveBeenCalledTimes(1);
  });
  test("does not break on strange event names", () => {
    // Given
    let componentOnContextUpdate;
    const fn = jest.fn();
    const oldContext = { projects: [] };
    const newContext = { projects: [{ project: {} }] };
    const event = { type: 1 };
    const integrationPoint = {
      onContextUpdate: fn => (componentOnContextUpdate = fn)
    };
    // We want to get called onXxx for XXX type events
    const props = { integrationPoint };

    // When
    const out = TestRenderer.create(<DesktopIntegration {...props} />);

    // Then
    expect(out.toJSON()).toEqual(null);
    expect(fn).toHaveBeenCalledTimes(0);

    // When
    componentOnContextUpdate(event, newContext, oldContext);

    // Then
    expect(fn).not.toHaveBeenCalled();
  });
  test("calls onXxx with data on event XXX", () => {
    // Given
    let componentOnContextUpdate;
    const fn = jest.fn();
    const oldContext = { projects: [] };
    const newContext = { projects: [{ project: {} }] };
    const event = { type: "XXX" };
    const nonListenEvent = { type: "YYY" };
    const integrationPoint = {
      onContextUpdate: fn => (componentOnContextUpdate = fn)
    };
    // We want to get called onXxx for XXX type events
    const props = { integrationPoint, onXxx: fn };

    // When
    const out = TestRenderer.create(<DesktopIntegration {...props} />);

    // Then
    expect(out.toJSON()).toEqual(null);
    expect(fn).toHaveBeenCalledTimes(0);

    // When
    componentOnContextUpdate(event, newContext, oldContext);

    // Then
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenLastCalledWith(event, newContext, oldContext);

    // When
    componentOnContextUpdate(nonListenEvent, newContext, oldContext); // We don't listen for this

    // Then
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenLastCalledWith(event, newContext, oldContext);

    // When
    componentOnContextUpdate(event, newContext, oldContext); // Another one we're listening on

    // Then
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith(event, newContext, oldContext);
  });
});
