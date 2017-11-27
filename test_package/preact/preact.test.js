import { h } from "preact";
/** @jsx h */
import { deep } from "preact-render-spy";

// Package exports ui/
import { Render } from "../../dist/ui/Render";
import { AsciiTable } from "../../dist/ui/AsciiTable";
import { Chart } from "../../dist/ui/Chart";

// Package exports utils/
import { Cypher } from "../../dist/utils/Cypher";
import { DesktopIntegration } from "../../dist/utils/DesktopIntegration";
import { DriverProvider } from "../../dist/utils/DriverProvider";
import { GraphAppBase } from "../../dist/utils/GraphAppBase";

// ui/
test("Render works", () => {
  const context = deep(
    <Render if={true}>
      <p>Hello</p>
    </Render>
  );
  expect(context.output()).toMatchSnapshot();
});
test("AsciiTable works", () => {
  const data = [["x"], ["y"]];
  const context = deep(<AsciiTable data={data} />);
  context.rerender();
  expect(context.text()).toMatchSnapshot();
});
test("Chart works", () => {
  const data = [{ label: "Used", value: 30 }, { label: "Free", value: 20 }];
  const context = deep(
    <Chart
      data={data}
      title="Static circular data"
      chartType="doughnut"
      type="json"
    />
  );
  expect(context.output()).toMatchSnapshot();
});

// utils/
test("Cypher works", () => {
  const context = deep(
    <Cypher
      driver={resolvingDriver(0, "no!")}
      query="RETURN rand() as n"
      render={({ pending, error, result, tick }) => {
        return pending ? "pending" : error ? error.message : result;
      }}
    />
  );
  expect(context.output()).toMatchSnapshot();
});
test("DesktopIntegration works", () => {
  const context = deep(<DesktopIntegration integrationPoint={true} />);
  expect(context.output()).toMatchSnapshot();
});
test("DriverProvider works", () => {
  const context = deep(
    <DriverProvider driver={resolvingDriver(0, "yes")}>Hello</DriverProvider>
  );
  expect(context.output()).toMatchSnapshot();
});
test("GraphAppBase works", () => {
  const context = deep(
    <GraphAppBase
      integrationPoint={null}
      render={() => <p>Hello</p>}
      driverFactory={{ driver: () => resolvingDriver(0, "yes") }}
    />
  );
  expect(context.output()).toMatchSnapshot();
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
