import React, { Component } from "react";
import * as PropTypes from "prop-types";
import { shallowEqual } from "../../lib/utils";
import { DriverProvider } from "../DriverProvider";
import {
  DesktopIntegration,
  helpers as integrationHelpers
} from "../DesktopIntegration";
import { connectDriver, getActiveDatabaseCredentials } from "./helpers";

export const CONNECTED = "CONNECTED";
export const DISCONNECTED = "DISCONNECTED";

export class GraphAppBase extends Component {
  constructor(props) {
    super(props);
    this.driver = {};
    this.listeners = {};
  }
  state = {
    driverCredentials: null,
    connectionState: DISCONNECTED,
    connectionDetails: null,
    initialDesktopContext: null,
    retry: 0
  };
  shouldComponentUpdate(props, state) {
    return !(
      state.connectionState === this.state.connectionState &&
      state.retry === this.state.retry &&
      shallowEqual(state.connectionDetails, this.state.connectionDetails)
    );
  }
  componentDidCatch(e) {}
  onDiMount = context => {
    this.setState({ initialDesktopContext: context });
    this.onConnectionChange(context);
  };
  onConnectionChange = context => {
    const driverCredentials = getActiveDatabaseCredentials(context);
    driverCredentials.username =
      driverCredentials.username ||
      (this.state.driverCredentials && this.state.driverCredentials.username);
    driverCredentials.password =
      driverCredentials.password ||
      (this.state.driverCredentials && this.state.driverCredentials.password);
    this.setState({ driverCredentials }, this.connectDriver);
  };
  connectDriver = () => {
    if (this.driver && this.driver.close) this.driver.close();
    const success = driver => {
      this.driver = driver;
      this.setState({
        connectionState: CONNECTED,
        connectionDetails: null
      });
    };
    connectDriver(
      this.state.driverCredentials,
      this.props.driverFactory,
      success,
      this.handleDriverError
    );
  };

  handleDriverError = e => {
    this.setState(state => ({
      connectionState: DISCONNECTED,
      connectionDetails: e,
      retry: state.retry + 1
    }));
  };
  setCredentials = (username, password) => {
    const driverCredentials = {
      ...this.state.driverCredentials,
      username,
      password
    };
    this.setState({ driverCredentials }, this.connectDriver);
  };
  on = (type, fn) => {
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(fn);
  };
  off = (type, fn) => {
    if (!this.listeners[type]) return;
    const index = this.listeners[type].indexOf(fn);
    if (index < 0) return;
    this.listeners[type].splice(index, 1);
  };
  handleEvents = (typeObj, newContext, oldContext) => {
    const { type } = typeObj;
    if (this.listeners[type]) {
      this.listeners[type].forEach(fn => fn(type, newContext, oldContext));
    }
  };
  render() {
    const {
      connectionState,
      connectionDetails,
      initialDesktopContext
    } = this.state;
    const { setCredentials, handleEvents, on, off } = this;
    return (
      <div>
        <DesktopIntegration
          integrationPoint={this.props.integrationPoint}
          onMount={this.onDiMount}
          onGraphActive={(_, context) => this.onConnectionChange(context)}
          on={handleEvents}
        />
        <DriverProvider driver={this.driver}>
          {this.props.render({
            connectionState,
            connectionDetails,
            setCredentials,
            on,
            off,
            initialDesktopContext
          })}
        </DriverProvider>
      </div>
    );
  }
}

GraphAppBase.propTypes = {
  driverFactory: PropTypes.object.isRequired,
  render: PropTypes.func.isRequired,
  integrationPoint: PropTypes.object
};

export default GraphAppBase;
