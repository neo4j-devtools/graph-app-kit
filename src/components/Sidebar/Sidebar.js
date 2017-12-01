import React, { Component } from "react";
import * as PropTypes from "prop-types";

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
        <div
          onClick={() => {
            const openDrawer =
              item.name === this.state.openDrawer ? null : item.name;
            this.setState({ openDrawer });
          }}
          title={item.title}
          data-test-id={"drawer" + item.name}
          key={index}
        >
          <span name={item.name}>{icon}</span>
        </div>
      );
    });
  };

  render() {
    const { onNavClick, topNavItems, bottomNavItems } = this.props;
    const getContentToShow = openDrawer => {
      if (openDrawer) {
        const filteredList = [...topNavItems, ...bottomNavItems].filter(
          item => {
            return item.name === openDrawer;
          }
        );
        return filteredList[0].content;
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
        <div>
          <div>{renderedtopNavItemsList}</div>
          <div>{renderedbottomNavItemsList}</div>
        </div>
        <div
          open={
            this.state.transitionState === Open ||
            this.state.transitionState === Opening
          }
          ref={ref => {
            if (ref) {
              // Remove old listeners so we don't get multiple callbacks.
              // This function is called more than once with same html element
              ref.removeEventListener("transitionend", this._onTransitionEnd);
              ref.addEventListener("transitionend", this._onTransitionEnd);
            }
          }}
        >
          {getContentToShow(this.state.openDrawer)}
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
  drawerHasChanged: PropTypes.func
};

Sidebar.defaultProps = {
  openDrawer: null,
  onNavClick: () => {},
  topNavItems: [],
  bottomNavItems: []
};

export default Sidebar;
