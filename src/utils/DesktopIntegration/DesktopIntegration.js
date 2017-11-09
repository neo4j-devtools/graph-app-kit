import { Component } from "react";
import * as PropTypes from "prop-types";
import { eventToHandler } from "./helpers";

export class DesktopIntegration extends Component {
  setupListener() {
    const { integrationPoint } = this.props;
    if (integrationPoint && integrationPoint.onContextUpdate) {
      integrationPoint.onContextUpdate((event, newContext, oldContext) => {
        const handlerPropName = eventToHandler(event.type);
        if (!handlerPropName) return;
        if (typeof this.props[handlerPropName] === "undefined") return;
        this.props[handlerPropName](event, newContext, oldContext);
      });
    }
  }
  loadInitialContext() {
    const { integrationPoint, onMount = null } = this.props;
    if (integrationPoint && integrationPoint.getContext) {
      integrationPoint
        .getContext()
        .then(context => {
          if (onMount) {
            onMount(context);
          }
        })
        .catch(e => {}); // Catch but don't bother
    }
  }
  componentDidMount() {
    this.loadInitialContext();
    this.setupListener();
  }
  render() {
    return null;
  }
}

DesktopIntegration.propTypes = {
  integrationPoint: PropTypes.object,
  onMount: PropTypes.func,
  onEventType: PropTypes.func
};

export default DesktopIntegration;
