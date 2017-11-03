import React from "react";
import TestRenderer from "react-test-renderer";
import { AsciiTable } from "./AsciiTable";

it("loads AsciiTable without data(no output)", () => {
  const out = TestRenderer.create(<AsciiTable />);
  expect(out.toJSON()).toEqual(null);
});
it("loads AsciiTable data", () => {
  const data = [["h1"], ["r1c1"]];
  const out = TestRenderer.create(<AsciiTable data={data} />);
  expect(out.toJSON().children[0]).toMatchSnapshot();
});
it("re-renders on new data", () => {
  const data1 = [["h1"], ["r1c1"]];
  const data2 = [["h2"], ["r1c1"]];

  const out = TestRenderer.create(<AsciiTable data={data1} />);
  expect(out.toJSON().children[0]).toMatchSnapshot();

  out.update(<AsciiTable data={data2} />);
  expect(out.toJSON().children[0]).toMatchSnapshot();
});
