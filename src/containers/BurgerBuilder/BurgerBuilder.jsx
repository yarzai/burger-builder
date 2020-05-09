import React, { Component } from "react";
import { connect } from "react-redux";
import Burger from "../../components/Burger/Burger";
import BuilControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import WithErrorHandler from "../../hoc/WithErrorHandler/WithErrorHandler";
import * as actions from "../../store/actions/index";

class BurgerBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      purchasable: false,
      purchasing: false,
    };
  }

  componentDidMount() {
    this.props.onFetchIngredients();
  }

  updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map((igkey) => {
        return ingredients[igkey];
      })
      .reduce((total, el) => {
        return total + el;
      }, 0);
    return sum > 0;
  };

  purchasingHandler = () => {
    this.setState({ purchasing: true });
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinuedHandler = () => {
    this.props.onPurchaseInit();
    this.props.history.replace("/checkout");
  };

  render() {
    const disabledInfo = { ...this.props.ings };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0 ? true : false;
    }

    let orderSummary = null;

    let burger = this.props.error ? (
      <p>Ingredients can't be loaded</p>
    ) : (
      <Spinner />
    );
    if (this.props.ings) {
      burger = (
        <React.Fragment>
          <Burger ingredients={this.props.ings} />
          <BuilControls
            addIngredientHandler={this.props.onIngredientAdded}
            removeIngredientHandler={this.props.onIngredientRemoved}
            disabledInfo={disabledInfo}
            price={this.props.price}
            purchasable={this.updatePurchaseState(this.props.ings)}
            ordered={this.purchasingHandler}
          />
        </React.Fragment>
      );

      orderSummary = (
        <OrderSummary
          ingredients={this.props.ings}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinuedHandler}
          totalPrice={this.props.price}
        />
      );

      if (this.state.loading) {
        orderSummary = <Spinner />;
      }
    }

    return (
      <React.Fragment>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onIngredientAdded: (ingName) => dispatch(actions.addIngredients(ingName)),
    onIngredientRemoved: (ingName) =>
      dispatch(actions.removeIngredient(ingName)),
    onFetchIngredients: () => dispatch(actions.initIngredients()),
    onPurchaseInit: () => dispatch(actions.purchaseInit()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithErrorHandler(BurgerBuilder, axios));
