import React from "react";
import * as PropTypes from "prop-types";
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

Chart.propTypes = {
  /** Data source. */
  type: PropTypes.oneOf(["cypher", "json"]).isRequired,
  /** Type of chart to render. */
  chartType: PropTypes.oneOf([
    "area",
    "bar",
    "line",
    "point",
    "line-point",
    "text",
    "pie",
    "doughnut"
  ]).isRequired,
  /** Used in combination with `type: "json"` */
  data: PropTypes.array,
  /** Used in combination with `type: "cypher"` */
  query: PropTypes.string,
  title: PropTypes.string,
  /** Render with the y axis to always scale to value set */
  setYAxis: PropTypes.string,
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string,
  /** Display crosshair on mouseover */
  crossHair: PropTypes.bool
};

export default Chart;
