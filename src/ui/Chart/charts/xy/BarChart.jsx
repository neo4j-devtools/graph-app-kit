import React from "react";
import { XYChart, BarSeries, CrossHair, XAxis, YAxis } from "@data-ui/xy-chart";

export default ({
  data = [],
  width = 500,
  height = 500,
  margin = { top: 50, right: 50, bottom: 50, left: 50 },
  xLabelName,
  yLabelName,
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
          <strong>{xLabelName}</strong>
          {datum.x}
        </div>
        <div>
          <strong>{yLabelName}</strong>
          {datum.y}
        </div>
      </div>
    )}
  >
    {xAxisLabel ? <XAxis label={xAxisLabel} /> : null}
    {yAxisLabel ? <YAxis label={yAxisLabel} /> : null}
    <BarSeries data={data} />
    {crossHair ? (
      <CrossHair showHorizontalLine={false} fullHeight stroke="grey" />
    ) : null}
  </XYChart>
);
