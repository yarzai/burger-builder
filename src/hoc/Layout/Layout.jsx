import React, { useState } from "react";
import { connect } from "react-redux";

import classes from "./Layout.module.css";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";

const Layout = (props) => {
  const [showSideDrawer, setSideDrawer] = useState(false);

  const { isAuthenticated, children } = props;

  const sideDrawerClosedHandler = () => {
    setSideDrawer(false);
  };

  const sideDrawerToggleHandler = () => {
    setSideDrawer((prevState) => !prevState);
  };

  return (
    <React.Fragment>
      <Toolbar
        drawerToggleClicked={sideDrawerToggleHandler}
        isAuthenticated={isAuthenticated}
      />
      <SideDrawer
        closed={sideDrawerClosedHandler}
        open={showSideDrawer}
        isAuthenticated={isAuthenticated}
      />
      <div>Toolbar, SideDrawer, Backdrop</div>
      <main className={classes.content}>{children}</main>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default connect(mapStateToProps)(Layout);
