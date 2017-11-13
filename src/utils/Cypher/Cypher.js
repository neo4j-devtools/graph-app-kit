import { Component } from "react";
import * as PropTypes from "prop-types";

export const missingRenderPropError =
  "Pass render property to render something. <Cypher render={({pending, error, response} => {})} />";
export const missingQueryError =
  "A property named 'query' is missing. Component needs a query to be executed.";
export const missingDriverError =
  "A property or conext object named 'driver' is missing. Component needs a connected driver to send queries over. See <Provider>.";

export class Cypher extends Component {
  constructor(props, context) {
    super(props, context);
    this.driver = props.driver || context.driver;
  }
  state = {
    result: null,
    pending: true,
    error: null,
    tick: 0
  };
  componentDidMount() {
    this.setupQuery(this.props);
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.pending !== nextState.pending) return true;
    if (this.state.tick !== nextState.tick) return true;
    if (nextProps.cTag && this.props.cTag !== nextProps.cTag) return true;
    return false;
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.cTag && this.props.cTag !== nextProps.cTag) {
      clearInterval(this.interval);
      this.setupQuery(nextProps);
    }
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  setupQuery(props) {
    this.query(props);
    if (props.interval) {
      this.interval = setInterval(
        () => this.query(props),
        props.interval * 1000
      );
    }
  }
  query(props) {
    const { query, params = undefined } = props;
    if (!query) throw new Error(missingQueryError);
    if (!this.driver) throw new Error(missingDriverError);
    this.setState({ pending: true }, () => {
      const session = this.driver.session();
      session
        .run(query, params)
        .then(res => {
          session.close();
          this.setState(state => ({
            pending: false,
            result: res,
            error: null,
            tick: state.tick + 1
          }));
        })
        .catch(error => {
          this.setState(state => ({
            pending: false,
            result: null,
            error: error,
            tick: state.tick + 1
          }));
        });
    });
  }
  render() {
    if (!this.props.render) {
      throw new Error(missingRenderPropError);
    }
    return this.props.render({ ...this.state });
  }
}

Cypher.contextTypes = {
  driver: PropTypes.object
};

Cypher.propTypes = {
  driver: PropTypes.object,
  params: PropTypes.object,
  query: PropTypes.string.isRequired,
  render: PropTypes.func.isRequired,
  cTag: PropTypes.any
};

export default Cypher;
