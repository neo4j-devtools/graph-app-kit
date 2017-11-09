import React from "react";
import AreaChart from "../charts/xy/AreaChart";
import LineChart from "../charts/xy/LineChart";
import BarChart from "../charts/xy/BarChart";
import RadialChart from "../charts/circular/RadialChart";
import Textual from "../charts/Textual";

export default props => {
  const getChart = type => {
    switch (type) {
      case "area":
        return <AreaChart {...props} />;
      case "bar":
        return <BarChart {...props} />;
      case "pie":
        return <RadialChart {...props} />;
      case "doughnut":
        return <RadialChart {...props} innerRadius={0.35} />;
      case "line":
        return <LineChart {...props} withLines />;
      case "point":
        return <LineChart {...props} withPoints />;
      case "line-point":
        return <LineChart {...props} withPoints withLines />;
      case "text":
        return <Textual {...props} />;
      default:
        return <AreaChart {...props} />;
    }
  };
  return (
    <div>
      {getChart(props.chartType)}
      {props.chartType !== "text" ? <h2>{props.title}</h2> : null}
    </div>
  );
};
