import React from "react";

import { Button } from "semantic-ui-react";
import { Chart } from "graph-app-kit/ui/Chart"; // This is aliased to the `src/` dir

export const Component = () => [
  <Chart
    data={[{ label: "Used", value: 30 }, { label: "Free", value: 20 }]}
    title="Static circular data"
    chartType="doughnut"
    type="json"
  />,
  <Button primary>Primarys</Button>,
  <Button secondary>Secondary</Button>
];
