import React from "react";
import TestRenderer from "react-test-renderer";
import { utils, ui } from "./index";
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
it("loads Render (with output)", () => {
  const out = TestRenderer.create(
    <ui.Render if={true}>
      <span>Hello</span>
    </ui.Render>
  );
  expect(out.toJSON()).toMatchSnapshot();
});
