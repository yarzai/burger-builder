import React from "react";
import classes from "./Layout.module.css";

const Layout = (props) => {
  console.log(classes.content);
  return (
    <React.Fragment>
      <div>Toolbar, SideDrawer, Backdrop</div>
      <main className={classes.content}>{props.children}</main>
    </React.Fragment>
  );
};

export default Layout;
