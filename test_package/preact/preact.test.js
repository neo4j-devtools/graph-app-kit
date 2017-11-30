import { h } from "preact";
/** @jsx h */
import { deep } from "preact-render-spy";

// Package exports ui/
import { Render } from "../../dist/components/Render";
import { AsciiTable } from "../../dist/components/AsciiTable";
import { Chart } from "../../dist/components/Chart";
import { Cypher } from "../../dist/components/Cypher";
import { DesktopIntegration } from "../../dist/components/DesktopIntegration";
import { DriverProvider } from "../../dist/components/DriverProvider";
import { CypherEditor } from "../../dist/components/Editor";
import { GraphAppBase } from "../../dist/components/GraphAppBase";

// Package exports components/
import {
  Render as RenderC,
  AsciiTable as AsciiTableC,
  Chart as ChartC,
  Cypher as CypherC,
  DesktopIntegration as DesktopIntegrationC,
  DriverProvider as DriverProviderC,
  CypherEditor as CypherEditorC,
  GraphAppBase as GraphAppBaseC
} from "../../dist/components";

// Package exports lib/
import { shallowEqual } from "../../dist/lib/utils";

// components
test("Render works", () => {
  const cs = [
    <Render if={true}>
      <p>Hello</p>
    </Render>,
    <RenderC if={true}>
      <p>Hello</p>
    </RenderC>
  ];
  cs.forEach(c => {
    const context = deep(c);
    expect(context.output()).toMatchSnapshot();
  });
});
test("AsciiTable works", () => {
  const data = [["x"], ["y"]];
  const cs = [<AsciiTable data={data} />, <AsciiTableC data={data} />];

  cs.forEach(c => {
    const context = deep(c);
    context.rerender();
    expect(context.output()).toMatchSnapshot();
  });
});
test("Chart works", () => {
  const data = [{ label: "Used", value: 30 }, { label: "Free", value: 20 }];
  const cs = [
    <Chart
      data={data}
      title="Static circular data"
      chartType="doughnut"
      type="json"
    />,
    <ChartC
      data={data}
      title="Static circular data"
      chartType="doughnut"
      type="json"
    />
  ];

  cs.forEach(c => {
    const context = deep(c);
    expect(context.output()).toMatchSnapshot();
  });
});
test("CypherEditor works", () => {
  const cs = [<CypherEditor />, <CypherEditorC />];

  cs.forEach(c => {
    const context = deep(c);
    expect(context.output()).toMatchSnapshot();
  });
});
test("Cypher works", () => {
  const cs = [
    <Cypher
      driver={resolvingDriver(0, "no!")}
      query="RETURN rand() as n"
      render={({ pending, error, result, tick }) => {
        return pending ? "pending" : error ? error.message : result;
      }}
    />,
    <CypherC
      driver={resolvingDriver(0, "no!")}
      query="RETURN rand() as n"
      render={({ pending, error, result, tick }) => {
        return pending ? "pending" : error ? error.message : result;
      }}
    />
  ];

  cs.forEach(c => {
    const context = deep(c);
    expect(context.output()).toMatchSnapshot();
  });
});
test("DesktopIntegration works", () => {
  const cs = [
    <DesktopIntegration integrationPoint={true} />,
    <DesktopIntegrationC integrationPoint={true} />
  ];

  cs.forEach(c => {
    const context = deep(c);
    expect(context.output()).toMatchSnapshot();
  });
});
test("DriverProvider works", () => {
  const cs = [
    <DriverProvider driver={resolvingDriver(0, "yes")}>Hello</DriverProvider>,
    <DriverProviderC driver={resolvingDriver(0, "yes")}>Hello</DriverProviderC>
  ];

  cs.forEach(c => {
    const context = deep(c);
    expect(context.output()).toMatchSnapshot();
  });
});
test("GraphAppBase works", () => {
  const cs = [
    <GraphAppBase
      integrationPoint={null}
      render={() => "Hello"}
      driverFactory={{ driver: () => resolvingDriver(0, "yes") }}
    />,
    <GraphAppBaseC
      integrationPoint={null}
      render={() => "Hello"}
      driverFactory={{ driver: () => resolvingDriver(0, "yes") }}
    />
  ];

  cs.forEach(c => {
    const context = deep(c);
    expect(context.output()).toMatchSnapshot();
  });
});

// Utils
test("shallowEqual works", () => {
  expect(shallowEqual({ x: 1 }, { x: 1 })).toBeTruthy();
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
