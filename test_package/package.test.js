import React from "react";
import TestRenderer from "react-test-renderer";

// Package exports ui/
import { Render } from "../dist/ui/Render";
import { AsciiTable } from "../dist/ui/AsciiTable";
import { Chart } from "../dist/ui/Chart";

// Package exports utils/
import { Cypher } from "../dist/utils/Cypher";
import { DesktopIntegration } from "../dist/utils/DesktopIntegration";
import { DriverProvider } from "../dist/utils/DriverProvider";

// ui/
test("Render works", () => {
  const out = TestRenderer.create(<Render if={true}>Hello</Render>);
  expect(out.toJSON()).toMatchSnapshot();
});
test("AsciiTable works", () => {
  const data = [["x"], ["y"]];
  const out = TestRenderer.create(<AsciiTable data={data} />);
  expect(out.toJSON()).toMatchSnapshot();
});
test("Chart works", () => {
  const data = [{ label: "Used", value: 30 }, { label: "Free", value: 20 }];
  const out = TestRenderer.create(
    <Chart
      data={data}
      title="Static circular data"
      chartType="doughnut"
      type="json"
    />
  );
  expect(out.toJSON()).toMatchSnapshot();
});

// utils/
test("Cypher works", () => {
  const out = TestRenderer.create(
    <Cypher
      driver={resolvingDriver(0, "no!")}
      query="RETURN rand() as n"
      render={({ pending, error, result, tick }) => {
        return pending ? "pending" : error ? error.message : result;
      }}
    />
  );
  expect(out.toJSON()).toMatchSnapshot();
});
test("DesktopIntegration works", () => {
  const out = TestRenderer.create(
    <DesktopIntegration integrationPoint={true} />
  );
  expect(out.toJSON()).toMatchSnapshot();
});
test("DriverProvider works", () => {
  const out = TestRenderer.create(
    <DriverProvider driver={resolvingDriver(0, "yes")}>Hello</DriverProvider>
  );
  expect(out.toJSON()).toMatchSnapshot();
});

// Helpers
const sleep = (secs, shouldResolve = true, message) =>
  new Promise((resolve, reject) => {
    setTimeout(
      () => (shouldResolve ? resolve(message) : reject(new Error(message))),
      secs * 1000
    );
  });

const driver = (shouldResolve = true, waitSecs = 0, message = "") => ({
  session: () => ({
    close: () => {},
    run: () => sleep(waitSecs, shouldResolve, message)
  })
});

const resolvingDriver = (waitSecs = 0, resolveTo = "Resolved") =>
  driver(true, waitSecs, resolveTo);
