import React, { Children } from "react";
import * as PropTypes from "prop-types";
import { Menu } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

export const SidebarContainer = ({
  fullscreenHeight,
  children,
  style,
  ...rest
}) => (
  <div
    style={{
      width: "86px",
      float: "left",
      minHeight: fullscreenHeight ? "100vh" : "300px",
      maxHeight: fullscreenHeight ? "100vh" : "auto",
      display: "flex",
      flexDirection: "column",
      ...style
    }}
    {...rest}
  >
    {children}
  </div>
);

const filterChildrenByType = (children, type) => {
  return Children.map(children, child => {
    return child.type && child.type.name === type
      ? React.cloneElement(child)
      : null;
  });
};

const SidebarItem = ({ children, name, ...rest }, context) => {
  const filteredSidebarButtonChildren = filterChildrenByType(
    children,
    "SidebarButton"
  );
  const content = filterChildrenByType(children, "SidebarContent");
  const updateDrawerSelection = () => {
    context.selectDrawer({ name, content });
  };

  const defaultContentSelected =
    context.defaultOpenDrawer &&
    name === context.defaultOpenDrawer &&
    !context.openDrawer.content;

  const openDrawerHasNoContent =
    context.openDrawer &&
    name === context.openDrawer.name &&
    !context.openDrawer.content;

  if (defaultContentSelected || openDrawerHasNoContent) {
    updateDrawerSelection();
  }

  return (
    <Menu.Item
      onClick={!context.defaultOpenDrawer ? updateDrawerSelection : () => {}}
    >
      {filteredSidebarButtonChildren}
    </Menu.Item>
  );
};

SidebarItem.contextTypes = {
  openDrawer: PropTypes.object,
  selectDrawer: PropTypes.func,
  defaultOpenDrawer: PropTypes.string
};

const SidebarTop = ({ children, ...rest }) => {
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

const SidebarBottom = ({ children, ...rest }) => {
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
      {filteredChildren}
    </Menu>
  );
};

const SidebarButton = ({ children, ...rest }) => <div>{children}</div>;

const SidebarContent = ({ children, ...rest }, context) => (
  <div {...rest}>{children}</div>
);

export {
  SidebarItem,
  SidebarButton,
  SidebarContent,
  SidebarTop,
  SidebarBottom
};
