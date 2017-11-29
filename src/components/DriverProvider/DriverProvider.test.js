import React, { Component } from "react";
import PropTypes from "prop-types";
import TestRenderer from "react-test-renderer";
import { DriverProvider } from "./DriverProvider";

it("Passes driver in context to one child", () => {
  // Given
  const spy = jest.fn();
  const driver = { session: spy };
  class CheckContext extends Component {
    constructor(props, context) {
      super(props, context);
      context.driver.session(true);
    }
    render() {
      return null;
    }
  }
  CheckContext.contextTypes = {
    driver: PropTypes.object.isRequired
  };

  // When
  const out = TestRenderer.create(
    <DriverProvider driver={driver}>
      <CheckContext />
    </DriverProvider>
  );
  expect(out.toJSON()).toEqual(null);
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenLastCalledWith(true);
});

it("Passes driver in context to array of children", () => {
  // Given
  const spy = jest.fn();
  const driver = { session: spy };
  class CheckContext extends Component {
    constructor(props, context) {
      super(props, context);
      context.driver.session(true);
    }
    render() {
      return null;
    }
  }
  CheckContext.contextTypes = {
    driver: PropTypes.object.isRequired
  };

  const ArrayReturn = () => [
    <CheckContext key="1" />,
    <div key="2">Check this out</div>
  ];

  // When
  const out = TestRenderer.create(
    <DriverProvider driver={driver}>
      <ArrayReturn />
    </DriverProvider>
  );
  expect(out.toJSON()).toMatchSnapshot();
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenLastCalledWith(true);
});
