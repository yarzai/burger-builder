import React, { useEffect } from "react";
import * as actions from "../../../store/actions";
import { connect } from "react-redux";
import { Redirect } from "react-router";

const Logout = ({ onLougout }) => {
  useEffect(() => {
    onLougout();
  }, [onLougout]);

  return <Redirect to="/" />;
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLougout: () => dispatch(actions.logout()),
  };
};

export default connect(null, mapDispatchToProps)(Logout);
