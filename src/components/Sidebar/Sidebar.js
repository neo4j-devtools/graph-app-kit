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

export class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDrawer: props.openDrawer
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.openDrawer !== this.state.openDrawer) {
      this.props.drawerHasChanged(this.state.openDrawer);
      this.setState(newState);
    }
  }

  renderItem = ({ name, title, icon }, selected, index) => {
    const isOpen = name === selected;
    const onClick = () => {
      const openDrawer = name === this.state.openDrawer ? null : name;
      this.setState({ openDrawer }, this.props.onNavClick(openDrawer));
    };
    return this.props._renderItem ? (
      <Menu.Item onClick={onClick} key={index}>
        {this.props._renderItem({ name, title, icon, isOpen })}
      </Menu.Item>
    ) : (
      <Menu.Item
        onClick={onClick}
        title={title}
        data-test-id={"drawer" + name}
        key={index}
        icon={icon}
      />
    );
  };

  buildNavList = (list, selected) => {
    return list.map((item, index) => {
      return this.renderItem(item, selected, index);
    });
  };

  render() {
    const { topNavItems, bottomNavItems, minHeight } = this.props;
    const getContentToShow = openDrawer => {
      if (openDrawer) {
        return [...topNavItems, ...bottomNavItems].find(item => {
          return item.name === openDrawer;
        }).drawerContent;
      }
      return null;
    };

    return (
      <div>
        <div
          style={{
            width: "86px",
            float: "left",
            minHeight: this.props.fullscreenHeight ? "100vh" : "400px",
            maxHeight: this.props.fullscreenHeight ? "100vh" : "auto",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Menu vertical fitted="horizontally" icon="labeled">
            {this.buildNavList(topNavItems, this.state.openDrawer)}
          </Menu>
          <Menu
            style={{ marginTop: "auto" }}
            vertical
            fitted="horizontally"
            icon="labeled"
          >
            {this.buildNavList(bottomNavItems, this.state.openDrawer)}
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
  _renderItem: PropTypes.func,
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
  bottomNavItems: [],
  _renderItem: undefined
};

export default Sidebar;
