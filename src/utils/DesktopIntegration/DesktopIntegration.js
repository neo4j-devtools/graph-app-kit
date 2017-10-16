import { Component } from "react";
import { getActiveGraph, getCredentials, eventToHandler } from "./helpers";

export default class DesktopIntegration extends Component {
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
          const activeGraph = getActiveGraph(context);
          if (onMount) {
            const connectionCredentials = getCredentials(
              "bolt",
              activeGraph.connection
            );
            onMount(activeGraph, connectionCredentials, context);
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
