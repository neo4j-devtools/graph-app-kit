import React from "react";
import { Group } from "@vx/group";
import { scaleTime, scaleLinear } from "@vx/scale";
import { AreaClosed } from "@vx/shape";
import { AxisLeft, AxisBottom } from "@vx/axis";
import { LinearGradient } from "@vx/gradient";
import { extent, max } from "d3-array";

export default props => {
  const data = props.data;
  const width = props.width || 500;
  const height = props.height || 500;

  const x = d => d.x;
  const y = d => d.y;

  // Bounds
  const margin = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50
  };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const xScale = scaleTime({
    range: [0, xMax],
    domain: extent(data, x)
  });
  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [0, props.setYAxis || max(data, y)]
  });

  return (
    <div>
      <svg width={width} height={height}>
        <LinearGradient from="#008ec2" to="#64b346" id="gradient" />

        <Group top={margin.top} left={margin.left}>
          <AreaClosed
            data={data}
            xScale={xScale}
            yScale={yScale}
            x={x}
            y={y}
            fill={"url(#gradient)"}
            stroke={""}
          />

          <AxisLeft
            scale={yScale}
            top={0}
            left={0}
            label={props.yLabel}
            stroke={"#1b1a1e"}
            tickTextFill={"#1b1a1e"}
          />

          <AxisBottom
            scale={xScale}
            top={yMax}
            label={props.xLabel}
            stroke={"#1b1a1e"}
            tickTextFill={"#1b1a1e"}
          />
        </Group>
      </svg>
    </div>
  );
};
