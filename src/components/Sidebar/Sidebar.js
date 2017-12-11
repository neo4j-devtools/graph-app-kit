import React, { Component } from "react";
import * as PropTypes from "prop-types";

import {
  Grid,
  Sidebar as SemanticSidebar,
  Segment,
  Button,
  Menu,
  Image,
  Icon,
  Header
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

const Closing = "CLOSING";
const Closed = "CLOSED";
const Open = "OPEN";
const Opening = "OPENING";

export class Sidebar extends Component {
  constructor(props) {
    super(props);
    this._onTransitionEnd = this.onTransitionEnd.bind(this);
    this.drawerContent = null;
    this.state = {
      openDrawer: props.openDrawer,
      transitionState: Closed
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.openDrawer !== this.props.openDrawer) {
      this.props.drawerHasChanged(this.state.openDrawer);
      var newState = {};
      if (nextProps.openDrawer) {
        this.drawerContent = nextProps.openDrawer;
        if (
          this.state.transitionState === Closed ||
          this.state.transitionState === Closing
        ) {
          newState.transitionState = Opening;
        }
      } else {
        this.drawerContent = "";
        if (
          this.state.transitionState === Open ||
          this.state.transitionState === Opening
        ) {
          newState.transitionState = Closing;
        }
      }
      this.setState(newState);
    }
  }

  onTransitionEnd() {
    if (this.transitionState === Closing) {
      this.setState({
        transitionState: Closed,
        drawerContent: null
      });
    }
    if (this.transitionState === Opening) {
      this.setState({
        transitionState: Open
      });
    }
  }

  buildNavList = (list, selected) => {
    return list.map((item, index) => {
      const isOpen = item.name.toLowerCase() === selected;
      const icon = item.icon(isOpen);
      return (
        <Menu.Item
          name={item.name}
          onClick={() => {
            const openDrawer =
              item.name === this.state.openDrawer ? null : item.name;
            this.setState({ openDrawer });
          }}
          title={item.title}
          data-test-id={"drawer" + item.name}
          key={index}
          icon={icon}
        />
      );
    });
  };

  render() {
    const { onNavClick, topNavItems, bottomNavItems, minHeight } = this.props;
    const getContentToShow = openDrawer => {
      if (openDrawer) {
        return [...topNavItems, ...bottomNavItems].find(item => {
          return item.name === openDrawer;
        }).content;
      }
      return null;
    };
    const renderedtopNavItemsList = this.buildNavList(
      topNavItems,
      this.drawerContent
    );
    const renderedbottomNavItemsList = this.buildNavList(
      bottomNavItems,
      this.drawerContent
    );

    return (
      <div>
        <div
          style={{
            width: "86px",
            float: "left",
            minHeight: this.props.fullscreenHeight ? "100vh" : "400px",
            maxHeight: this.props.fullscreenHeight ? "100vh" : "auto"
          }}
        >
          <Menu vertical fitted="horizontally" icon="labeled">
            {renderedtopNavItemsList}
          </Menu>
          <Menu vertical fitted="horizontally" icon="labeled">
            {renderedbottomNavItemsList}
          </Menu>
        </div>
        <div>
          <SemanticSidebar.Pushable
            style={{
              minHeight: this.props.fullscreenHeight ? "100vh" : "400px",
              maxHeight: this.props.fullscreenHeight ? "100vh" : "auto"
            }}
          >
            <SemanticSidebar
              as={Menu}
              animation="push"
              width="thin"
              visible={!!this.state.openDrawer}
              vertical
            >
              <SemanticSidebar.Pusher>
                <Segment basic>
                  {getContentToShow(this.state.openDrawer)}
                </Segment>
              </SemanticSidebar.Pusher>
            </SemanticSidebar>
          </SemanticSidebar.Pushable>
        </div>
      </div>
    );
  }
}

Sidebar.propTypes = {
  openDrawer: PropTypes.string,
  onNavClick: PropTypes.func,
  topNavItems: PropTypes.array,
  bottomNavItems: PropTypes.array,
  drawerHasChanged: PropTypes.func,
  fullscreenHeight: PropTypes.bool
};

Sidebar.defaultProps = {
  openDrawer: null,
  onNavClick: () => {},
  topNavItems: [],
  bottomNavItems: []
};

export default Sidebar;
