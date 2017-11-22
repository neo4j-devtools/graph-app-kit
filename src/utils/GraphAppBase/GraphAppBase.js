import React, { Component } from "react";
import * as PropTypes from "prop-types";
import { shallowEqual } from "../../helpers";
import { DriverProvider } from "../DriverProvider";
import {
  DesktopIntegration,
  helpers as integrationHelpers
} from "../DesktopIntegration";

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
    const creds = integrationHelpers.getActiveCredentials("bolt", context);
    const driverCredentials = {
      host: `bolt://${creds.host}:${creds.port}`,
      encrypted: creds.tlsLevel === "REQUIRED",
      username:
        creds.username ||
        (this.state.driverCredentials && this.state.driverCredentials.username),
      password:
        creds.password ||
        (this.state.driverCredentials && this.state.driverCredentials.password)
    };
    this.setState({ driverCredentials }, this.connectDriver);
  };
  connectDriver = () => {
    if (this.driver && this.driver.close) this.driver.close();
    const {
      host,
      username,
      password,
      encrypted
    } = this.state.driverCredentials;
    const auth =
      username && password
        ? this.props.driverFactory.auth.basic(username, password)
        : undefined;
    try {
      this.driver = this.props.driverFactory.driver(host, auth, { encrypted });
    } catch (e) {
      this.handleDriverError(e);
      return;
    }
    this.driver.onError = this.handleDriverError;
    const tmp = this.driver.session();
    if (tmp) {
      tmp
        .run("CALL db.indexes()")
        .then(() => {
          this.setState({
            connectionState: CONNECTED,
            connectionDetails: null
          });
          tmp.close();
        })
        .catch(this.handleDriverError);
    }
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
    return [
      <DesktopIntegration
        key="di"
        integrationPoint={this.props.integrationPoint}
        onMount={this.onDiMount}
        onGraphActive={(_, context) => this.onConnectionChange(context)}
        on={handleEvents}
      />,
      <DriverProvider driver={this.driver} key="dp">
        {this.props.render({
          connectionState,
          connectionDetails,
          setCredentials,
          on,
          off,
          initialDesktopContext
        })}
      </DriverProvider>
    ];
  }
}

GraphAppBase.propTypes = {
  driverFactory: PropTypes.object.isRequired,
  render: PropTypes.func.isRequired,
  integrationPoint: PropTypes.object
};

export default GraphAppBase;
