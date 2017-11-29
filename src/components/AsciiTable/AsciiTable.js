import React, { Component } from "react";
import * as PropTypes from "prop-types";
import asciitable from "ascii-data-table";

export class AsciiTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serializedRows: []
    };
  }
  componentDidMount() {
    this.makeState(this.props);
  }
  componentWillReceiveProps(props) {
    this.makeState(props);
  }
  makeState(props) {
    const { data } = props;
    const serializedRows = asciitable.serializeData(data) || [];
    this.setState({ serializedRows });
  }
  render() {
    const { maxColWidth = 70 } = this.props;
    const { serializedRows } = this.state;
    if (!serializedRows.length) return null;
    return (
      <pre>
        {asciitable.tableFromSerializedData(serializedRows, maxColWidth)}
      </pre>
    );
  }
}

AsciiTable.propTypes = {
  data: PropTypes.array,
  maxColWidth: PropTypes.number
};

export default AsciiTable;
