import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import CheckoutSammary from "../../components/Order/CheckoutSummary/CheckoutSummary";
import ContactData from "../../containers/Checkout/ContactData/ContactData";
import * as actions from "../../store/actions";

class Checkout extends Component {
  checkoutContinuedHandler = () => {
    this.props.history.replace("/checkout/contact-data");
  };

  checkoutCancelledHandler = () => {
    this.props.history.goBack();
  };
  render() {
    let summary = <Redirect to="/" />;
    if (this.props.ings && !this.props.purchased) {
      summary = (
        <div>
          <CheckoutSammary
            ingredients={this.props.ings}
            checkoutCancelled={this.checkoutCancelledHandler}
            checkoutContinued={this.checkoutContinuedHandler}
          />
          <Route
            path={this.props.match.url + "/contact-data"}
            component={ContactData}
          />
        </div>
      );
    }
    return summary;
  }
}

const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    purchased: state.order.purchased,
  };
};

export default connect(mapStateToProps)(Checkout);
