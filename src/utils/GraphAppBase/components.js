import React, { Component } from "react";
import * as PropTypes from "prop-types";

export class ConnectionForm extends ReactComponent {
  state = {
    username: "",
    password: ""
  };
  onChange = e => this.setState({ [e.target.name]: e.target.value });
  onSubmit = () =>
    this.props.onSubmit(this.state.username, this.state.password);
  render() {
    return (
      <div>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={this.state.username}
          onChange={this.onChange}
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={this.state.password}
          onChange={this.onChange}
        />
        <div>
          <button onClick={this.onSubmit}>Connect</button>
        </div>
        <span style={{ color: "red" }}>{this.props.connectionDetails}</span>
      </div>
    );
  }
}
