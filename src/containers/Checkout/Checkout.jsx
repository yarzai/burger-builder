import React, { Component } from "react";
import { Route } from "react-router-dom";
import CheckoutSammary from "../../components/Order/CheckoutSummary/CheckoutSummary";
import ContactData from "../../containers/Checkout/ContactData/ContactData";

class Checkout extends Component {
  constructor(props) {
    super();
    this.state = {
      ingredients: null,
      totalPrice: 0,
    };
  }

  fetchIngredientsFromUrl() {
    console.log(this.props);
    const query = new URLSearchParams(this.props.location.search);
    const ingredients = {};
    let price = null;
    for (let param of query.entries()) {
      // ['salad', '1']
      if (param[0] === "price") {
        price = param[1];
      } else {
        ingredients[param[0]] = +param[1];
      }
    }
    this.setState({ ingredients: ingredients, totalPrice: price });
  }

  componentWillMount() {
    this.fetchIngredientsFromUrl();
  }
  checkoutContinuedHandler = () => {
    // sending data in the url
    const queryParams = [];
    for (let i in this.state.ingredients) {
      queryParams.push(
        encodeURIComponent(i) +
          "=" +
          encodeURIComponent(this.state.ingredients[i])
      );
    }

    queryParams.push("price=" + this.state.totalPrice);

    const queryString = queryParams.join("&");
    this.props.history.replace({
      pathname: "/checkout/contact-data",
      search: "?" + queryString,
    });
  };

  checkoutCancelledHandler = () => {
    this.props.history.goBack();
  };
  render() {
    return (
      <div>
        <CheckoutSammary
          ingredients={this.state.ingredients}
          checkoutCancelled={this.checkoutCancelledHandler}
          checkoutContinued={this.checkoutContinuedHandler}
        />
        <Route
          path={this.props.match.url + "/contact-data"}
          render={() => (
            <ContactData
              ingredients={this.state.ingredients}
              price={this.state.totalPrice}
            />
          )}
        />
      </div>
    );
  }
}

export default Checkout;
