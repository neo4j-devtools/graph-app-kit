import React from "react";
import { Group } from "@vx/group";
import { GlyphDot } from "@vx/glyph";
import { LinePath } from "@vx/shape";
import { scaleTime, scaleLinear } from "@vx/scale";
import { curveBasis, curveMonotoneX } from "@vx/curve";
import { extent, max } from "d3-array";

export default props => {
  const data = props.data;

  // accessors
  const x = d => d.x;
  const y = d => d.y;

  const width = props.width || 500;
  const height = props.height || 500;
  const margin = { top: 50, right: 50, bottom: 50, left: 50 };
  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // scales
  const xScale = scaleTime({
    range: [0, xMax],
    domain: extent(data, x)
  });
  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [0, max(data, y)],
    nice: true
  });

  return (
    <svg width={width} height={height}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="transparent"
        rx={14}
      />
      <Group top={margin.top}>
        <LinePath
          data={data}
          xScale={xScale}
          yScale={yScale}
          x={x}
          y={y}
          stroke="#7e20dc"
          strokeWidth={2}
          strokeDasharray="2,2"
          curve={curveBasis}
        />
        <LinePath
          data={data}
          xScale={xScale}
          yScale={yScale}
          x={x}
          y={y}
          stroke="#7e20dc"
          strokeWidth={3}
          curve={curveMonotoneX}
          glyph={(d, i) => {
            return (
              <g key={`line-point-${i}`}>
                <GlyphDot
                  cx={xScale(x(d))}
                  cy={yScale(y(d))}
                  r={6}
                  fill="#fff"
                  stroke="#01f2ff"
                  strokeWidth={10}
                />
                <GlyphDot
                  cx={xScale(x(d))}
                  cy={yScale(y(d))}
                  r={6}
                  fill="#01f2ff"
                  stroke="#7e20dc"
                  strokeWidth={3}
                />
                <GlyphDot
                  cx={xScale(x(d))}
                  cy={yScale(y(d))}
                  r={4}
                  fill="#ffffff"
                />
              </g>
            );
          }}
        />
      </Group>
    </svg>
  );
};
