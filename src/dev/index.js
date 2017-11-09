import React from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";
import { Button } from "semantic-ui-react";

import { Chart } from "graph-app-kit/ui/Chart"; // This is aliased to the `src/` dir

const App = () => [
  <Chart
    data={[{ label: "Used", value: 30 }, { label: "Free", value: 20 }]}
    title="Static circular data"
    chartType="doughnut"
    type="json"
  />,
  <Button primary>Primary</Button>,
  <Button secondary>Secondary</Button>
];

ReactDOM.render(<App />, document.getElementById("root"));
