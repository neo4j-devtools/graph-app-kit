import React, { Component, Children } from "react";
import * as PropTypes from "prop-types";
import { Sidebar as SemanticSidebar, Segment, Menu } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import {
  SidebarContainer,
  SidebarItem,
  SidebarTop,
  SidebarBottom,
  SidebarButton,
  SidebarContent
} from "./SidebarComponents";

class Sidebar extends Component {
  constructor(props, context) {
    super(props, context);
    this.initalState = { openDrawer: null, drawerContent: null };
    this.state = {
      ...this.initalState,
      openDrawer: props.defaultOpenDrawer || props.openDrawer || null
    };
  }
  getChildContext() {
    return {
      openDrawer: this.state.openDrawer,
      selectDrawer: this.selectDrawer
    };
  }
  selectDrawer = (name, drawerContent) => {
    if (name !== this.state.openDrawer) {
      this.setState({
        openDrawer: name,
        drawerContent
      });
    } else {
      this.setState({ ...this.initalState });
    }
  };
  render() {
    this.props.onChange(this.state.openDrawer);
    return (
      <SidebarComponent
        {...this.props}
        openDrawer={this.state.openDrawer}
        drawerContent={this.state.drawerContent}
      />
    );
  }
}

const SidebarComponent = (props, context) => {
  const applySelectedClass = () => {};
  return (
    <div>
      {props.render({
        selected: props.openDrawer,
        applySelectedClass
      })}
      <SemanticSidebar.Pushable
        style={{
          minHeight: props.fullscreenHeight ? "100vh" : "400px",
          maxHeight: props.fullscreenHeight ? "100vh" : "auto"
        }}
      >
        <SemanticSidebar
          as={Menu}
          animation="push"
          visible={!!props.openDrawer}
          vertical
        >
          <SemanticSidebar.Pusher>
            <Segment basic>{props.drawerContent}</Segment>
          </SemanticSidebar.Pusher>
        </SemanticSidebar>
      </SemanticSidebar.Pushable>
      <SidebarItem>Hello</SidebarItem>
    </div>
  );
};

SidebarComponent.contextTypes = {
  selected: PropTypes.string,
  selectDrawer: PropTypes.func
};

Sidebar.childContextTypes = {
  openDrawer: PropTypes.string,
  selectDrawer: PropTypes.func
};

Sidebar.propTypes = {
  onChange: PropTypes.func,
  openDrawer: PropTypes.string,
  defaultOpenDrawer: PropTypes.string,
  contentWidth: PropTypes.string,
  fullscreenHeight: PropTypes.bool,
  render: PropTypes.func
};

Sidebar.defaultProps = {
  onChange: () => {},
  openDrawer: null,
  defaultOpenDrawer: null,
  contentWidth: undefined,
  fullscreenHeight: false,
  render: () => {}
};

Sidebar.Container = SidebarContainer;
Sidebar.Item = SidebarItem;
Sidebar.Top = SidebarTop;
Sidebar.Bottom = SidebarBottom;
Sidebar.Button = SidebarButton;
Sidebar.Content = SidebarContent;

export { Sidebar };
export default Sidebar;
