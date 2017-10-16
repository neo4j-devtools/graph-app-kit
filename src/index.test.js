import React from "react";
import TestRenderer from "react-test-renderer";
import * as utils from "./index";
import { mockDriver } from "../config/test_helpers";

it("loads Cypher", () => {
  const out = TestRenderer.create(
    <utils.Cypher query="x" driver={mockDriver()} render={() => null} />
  );
  expect(out.toJSON()).toEqual(null);
});
it("loads DriverProvider", () => {
  const out = TestRenderer.create(
    <utils.DriverProvider driver={mockDriver()}>
      <div />
    </utils.DriverProvider>
  );
  expect(out.toJSON()).toMatchSnapshot();
});
