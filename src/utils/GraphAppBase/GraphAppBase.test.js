import React from "react";
import TestRenderer from "react-test-renderer";
import { mockDriver, flushPromises } from "../../../config/test_helpers";

import { GraphAppBase } from "./GraphAppBase";

test("GraphAppBase renders", () => {
  const out = TestRenderer.create(<GraphAppBase />);
  expect(out.toJSON()).toMatchSnapshot();
});
