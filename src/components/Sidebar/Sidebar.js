import React, { Component } from "react";
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
    this.selectDrawer = updatedItem => {
      if (updatedItem.name !== this.state.openDrawer.name) {
        return this.setState({
          openDrawer: { ...updatedItem }
        });
      }
      if (!this.state.openDrawer.content) {
        return this.setState({
          openDrawer: { ...this.state.openDrawer, content: updatedItem.content }
        });
      }

      if (
        updatedItem.name === this.state.openDrawer.name &&
        this.state.openDrawer.content
      ) {
        return this.setState({ ...this.initalState });
      }
    };
    this.initalState = {
      openDrawer: {
        name: null,
        content: null
      }
    };
    this.state = {
      ...this.initalState,
      openDrawer: { name: props.openDrawer },
      defaultOpenDrawer: props.defaultOpenDrawer
    };
  }
  getChildContext() {
    return {
      openDrawer: this.state.openDrawer,
      selectDrawer: this.selectDrawer,
      defaultOpenDrawer: this.props.defaultOpenDrawer
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.openDrawer !== this.props.openDrawer) {
      this.setState({ ...this.initalState, openDrawer: nextProps.openDrawer });
    }
  }
  render() {
    debugger;
    this.props.onChange(this.state.openDrawer);
    return (
      <SidebarComponent
        {...this.props}
        openDrawer={this.state.openDrawer.name}
        drawerContent={this.state.openDrawer.content}
        contentWidth={this.props.contentWidth}
      />
    );
  }
}

const SidebarComponent = (props, context) => {
  const applySelectedClass = classNames => name =>
    props.openDrawer === name ? { className: classNames } : {};
  return (
    <div>
      {props.render({
        selected: props.openDrawer,
        applySelectedClass
      })}
      <SemanticSidebar.Pushable
        style={{
          minHeight: props.fullscreenHeight ? "100vh" : "300px",
          maxHeight: props.fullscreenHeight ? "100vh" : "auto"
        }}
      >
        <SemanticSidebar
          as={Menu}
          animation="push"
          visible={!!props.openDrawer}
          vertical
          style={{ width: props.contentWidth }}
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
  selectDrawer: PropTypes.func,
  defaultOpenDrawer: PropTypes.string
};

Sidebar.childContextTypes = {
  openDrawer: PropTypes.object,
  selectDrawer: PropTypes.func,
  defaultOpenDrawer: PropTypes.string
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
  contentWidth: "auto",
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
