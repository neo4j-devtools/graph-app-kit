import React from "react";
import AreaGraph from "../charts/xy/AreaGraph";
import BarGraph from "../charts/xy/BarGraph";
import RadialChart from "../charts/circular/RadialChart";
import Textual from "../charts/Textual";

export default props => {
  const getChart = type => {
    switch (type) {
      case "area":
        return <AreaGraph {...props} />;
      case "bar":
        return <BarGraph {...props} />;
      case "pie":
        return <RadialChart {...props} />;
      case "doughnut":
        return <RadialChart {...props} />;
      case "text":
        return <Textual {...props} />;
      default:
        return <AreaGraph {...props} />;
    }
  };
  return (
    <div>
      {getChart(props.chartType)}
      {props.chartType !== "text" ? <h2>{props.title}</h2> : null}
    </div>
  );
};
