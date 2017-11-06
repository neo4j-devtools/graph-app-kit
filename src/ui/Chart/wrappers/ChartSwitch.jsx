import React from "react";
import AreaGraph from "../charts/xy/AreaGraph";
import BarGraph from "../charts/xy/BarGraph";
import GlyphGraph from "../charts/xy/GlyphGraph";
import LineGraph from "../charts/xy/LineGraph";
import RadialChart from "../charts/circular/RadialChart";
import Textual from "../charts/Textual";
import { Segment } from "semantic-ui-react";

export default props => {
  const getChart = type => {
    switch (type) {
      case "area":
        return <AreaGraph {...props} />;
      case "bar":
        return <BarGraph {...props} />;
      case "glyph":
        return <GlyphGraph {...props} />;
      case "line":
        return <LineGraph {...props} />;
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
    <Segment>
      {getChart(props.chartType)}
      {props.chartType !== "text" ? <h2>{props.title}</h2> : null}
    </Segment>
  );
};
