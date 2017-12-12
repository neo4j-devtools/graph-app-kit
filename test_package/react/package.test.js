import React from "react";
import TestRenderer from "react-test-renderer";

// Package exports ui/
import { Render } from "../../dist/components/Render";
import { AsciiTable } from "../../dist/components/AsciiTable";
import { Chart } from "../../dist/components/Chart";
import { Cypher } from "../../dist/components/Cypher";
import { DesktopIntegration } from "../../dist/components/DesktopIntegration";
import { DriverProvider } from "../../dist/components/DriverProvider";
import { CypherEditor } from "../../dist/components/Editor";
import { GraphAppBase } from "../../dist/components/GraphAppBase";
import { Sidebar } from "../../dist/components/Sidebar";

// Package exports lib/
import { shallowEqual } from "../../dist/lib/utils";
import { resultHasRows } from "../../dist/lib/boltTransforms";

// components/
test("Render works", () => {
  const out = TestRenderer.create(
    <Render if={true}>
      <p>Hello</p>
    </Render>
  );
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
test("CypherEditor works", () => {
  const out = TestRenderer.create(<CypherEditor />);
  expect(out.toJSON()).toMatchSnapshot();
});
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
test("GraphAppBase works", () => {
  const out = TestRenderer.create(
    <GraphAppBase
      integrationPoint={null}
      render={() => "Hello"}
      driverFactory={{ driver: () => resolvingDriver(0, "yes") }}
    />
  );
  expect(out.toJSON()).toMatchSnapshot();
});
test("Sidebar works", () => {
  const out = TestRenderer.create(
    <Sidebar
      openDrawer="Tick"
      topNavItems={[
        {
          name: "Tick",
          title: "Tick button",
          icon: <div>{"\u2714"}</div>,
          drawerContent: <span>Tick</span>
        }
      ]}
    />
  );
  expect(out.toJSON()).toMatchSnapshot();
});

// Utils
test("shallowEqual works", () => {
  expect(shallowEqual({ x: 1 }, { x: 1 })).toBeTruthy();
});
test("resultHasRows works", () => {
  expect(resultHasRows({ result: { records: [{ x: 1 }] } })).toBeTruthy();
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
