import { Component } from "react";
import * as PropTypes from "prop-types";

export class DriverProvider extends Component {
  getChildContext() {
    return {
      driver: this.props.driver
    };
  }

  render() {
    return this.props.children;
  }
}

DriverProvider.childContextTypes = {
  driver: PropTypes.object
};

DriverProvider.propTypes = {
  driver: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
};

export default DriverProvider;
