import React from "react";
import {
  XYChart,
  LineSeries,
  PointSeries,
  CrossHair,
  XAxis,
  YAxis
} from "@data-ui/xy-chart";

export default ({
  data = [],
  width = 500,
  height = 500,
  margin = { top: 50, right: 50, bottom: 50, left: 50 },
  withLines,
  withPoints,
  xAxisLabel,
  yAxisLabel,
  crossHair
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
    {xAxisLabel ? <XAxis label={xAxisLabel} /> : null}
    {yAxisLabel ? <YAxis label={yAxisLabel} /> : null}
    {withLines ? <LineSeries data={data} /> : null}
    {withPoints ? <PointSeries data={data} /> : null}
    {crossHair ? (
      <CrossHair showHorizontalLine={false} fullHeight stroke="grey" />
    ) : null}
  </XYChart>
);
