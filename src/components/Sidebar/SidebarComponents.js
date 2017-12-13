import React, { Component, Children } from "react";
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

export const SidebarContainer = ({ fullscreenHeight, children }) => (
  <div
    style={{
      width: "86px",
      float: "left",
      minHeight: fullscreenHeight ? "100vh" : "400px",
      maxHeight: fullscreenHeight ? "100vh" : "auto",
      display: "flex",
      flexDirection: "column"
    }}
  >
    {children}
  </div>
);

const SidebarItem = ({ children, name }, context) => {
  const filteredSidebarButtonChildren = Children.map(children, child => {
    return child.type && child.type.name === "SidebarButton" ? child : null;
  }).filter(_ => !!_);
  const drawerContent = Children.map(children, child => {
    return child.type && child.type.name === "SidebarContent" ? child : null;
  }).filter(_ => !!_);
  return (
    <Menu.Item
      onClick={() => {
        context.selectDrawer(name, drawerContent);
      }}
    >
      {filteredSidebarButtonChildren}
    </Menu.Item>
  );
};

SidebarItem.contextTypes = {
  selected: PropTypes.string,
  selectDrawer: PropTypes.func
};

export { SidebarItem };

export const SidebarTop = ({ children, ...rest }) => {
  const filteredChildren = Children.map(children, child => {
    return child.type && child.type.prototype === SidebarItem.prototype
      ? child
      : null;
  }).filter(_ => !!_);
  return (
    <Menu vertical fitted="horizontally" icon="labeled" {...rest}>
      {filteredChildren}
    </Menu>
  );
};

export const SidebarBottom = ({ children, ...rest }) => {
  const filteredChildren = Children.map(children, child => {
    return child.type && child.type.prototype === SidebarItem.prototype
      ? child
      : null;
  }).filter(_ => !!_);
  return (
    <Menu
      style={{ marginTop: "auto" }}
      vertical
      fitted="horizontally"
      icon="labeled"
    >
      {children}
    </Menu>
  );
};

export const SidebarButton = ({ children, ...rest }) => <div>{children}</div>;

export const SidebarContent = ({ children, ...rest }) => <div>{children}</div>;
