import React, { Component } from "react";
import ChartSwitch from "./ChartSwitch";
import { Cypher } from "../../../utils/Cypher";
import * as simpleMappers from "../utils/simpleMappers";

class CypherChartWrapper extends Component {
  constructor(props) {
    super(props);
    this.data = [];
  }
  renderChart(res, tick) {
    this.data =
      this.props.chartType === "pie" || this.props.chartType === "doughnut"
        ? simpleMappers.cypherResultToCircularChartData(
            res,
            this.data,
            this.props
          )
        : simpleMappers.cypherResultToXYChartData(
            res,
            this.data,
            tick,
            this.props
          );

    return <ChartSwitch {...this.props} data={this.data} />;
  }
  render() {
    return (
      <Cypher
        params={this.props.params}
        driver={this.props.driver}
        interval={this.props.refreshInterval || 2}
        query={this.props.query}
        render={({ pending, error, result, tick }) =>
          pending
            ? this.renderChart()
            : error ? error.message : this.renderChart(result, tick)
        }
      />
    );
  }
}

export default CypherChartWrapper;
