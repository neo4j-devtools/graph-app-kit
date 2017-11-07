import React from "react";
import CypherChartWrapper from "./wrappers/CypherChartWrapper";
import ChartSwitch from "./wrappers/ChartSwitch";

export const Chart = props => {
  if (!props.type) return "No chart type set";
  switch (props.type) {
    case "cypher":
      return <CypherChartWrapper {...props} />;
    case "json":
      return <ChartSwitch {...props} />;
    default:
      return `${props.type} is an invalid chart type`;
  }
};

export default Chart;
