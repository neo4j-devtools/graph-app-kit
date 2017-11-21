import React from "react";
import TestRenderer from "react-test-renderer";

import { Component } from "./Component";

test.skip("Component renders", () => {
  const out = TestRenderer.create(<Component />);
  expect(out.toJSON()).toMatchSnapshot();
});
