import React from "react";
import TestRenderer from "react-test-renderer";
import { Cypher, DriverProvider } from "./index";
import { mockDriver } from "../../config/test_helpers";

it("loads Cypher", () => {
  const out = TestRenderer.create(
    <Cypher query="x" driver={mockDriver()} render={() => null} />
  );
  expect(out.toJSON()).toEqual(null);
});
it("loads DriverProvider", () => {
  const out = TestRenderer.create(
    <DriverProvider driver={mockDriver()}>
      <div />
    </DriverProvider>
  );
  expect(out.toJSON()).toMatchSnapshot();
});
