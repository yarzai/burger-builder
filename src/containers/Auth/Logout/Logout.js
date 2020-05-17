import React, { Component } from "react";
import * as actions from "../../../store/actions";
import { connect } from "react-redux";
import { Redirect } from "react-router";

class Logout extends Component {
  componentWillMount() {
    this.props.onLougout();
  }
  render() {
    return <Redirect to="/" />;
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLougout: () => dispatch(actions.logout()),
  };
};

export default connect(null, mapDispatchToProps)(Logout);
