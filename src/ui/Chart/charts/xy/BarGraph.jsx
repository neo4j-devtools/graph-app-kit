import React from "react";
import { XYChart, BarSeries, CrossHair, XAxis, YAxis } from "@data-ui/xy-chart";

export default ({
  data = [],
  width = 500,
  height = 500,
  margin = { top: 10, right: 10, bottom: 10, left: 10 }
}) => (
  <XYChart
    ariaLabel="Bar chart showing ..."
    width={width}
    height={height}
    margin={margin}
    xScale={{ type: "time" }}
    yScale={{ type: "linear" }}
    renderTooltip={({ event, datum, data, color }) => (
      <div>
        <strong style={{ color }}>{datum.label}</strong>
        <div>
          <strong>x </strong>
          {datum.x}
        </div>
        <div>
          <strong>y </strong>
          {datum.y}
        </div>
      </div>
    )}
  >
    <XAxis label="X-axis Label" />
    <YAxis label="Y-axis Label" />
    <BarSeries data={data} />
    <CrossHair showHorizontalLine={false} fullHeight stroke="pink" />
  </XYChart>
);
