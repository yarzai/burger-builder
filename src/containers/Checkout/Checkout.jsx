import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import CheckoutSammary from "../../components/Order/CheckoutSummary/CheckoutSummary";
import ContactData from "../../containers/Checkout/ContactData/ContactData";

const Checkout = (props) => {
  console.log(props);
  const { ings, purchased } = props;
  const checkoutContinuedHandler = () => {
    props.history.replace("/checkout/contact-data");
  };

  const checkoutCancelledHandler = () => {
    props.history.goBack();
  };

  let summary = <Redirect to="/" />;
  if (ings && !purchased) {
    summary = (
      <div>
        <CheckoutSammary
          ingredients={ings}
          checkoutCancelled={checkoutCancelledHandler}
          checkoutContinued={checkoutContinuedHandler}
        />
        <Route
          path={props.match.url + "/contact-data"}
          component={ContactData}
        />
      </div>
    );
  }
  return summary;
};

const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients,
    purchased: state.order.purchased,
  };
};

export default connect(mapStateToProps)(Checkout);
