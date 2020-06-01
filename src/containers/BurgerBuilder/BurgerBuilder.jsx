import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Burger from "../../components/Burger/Burger";
import BuilControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import WithErrorHandler from "../../hoc/WithErrorHandler/WithErrorHandler";
import * as actions from "../../store/actions/index";

const BurgerBuilder = (props) => {
  const [purchasing, setPurchasing] = useState(false);

  // States
  const dispatch = useDispatch();
  const [ings, price, error, isAuthenticated] = useSelector((state) => {
    return [
      state.burgerBuilder.ingredients,
      state.burgerBuilder.totalPrice,
      state.burgerBuilder.error,
      state.auth.token !== null,
    ];
  });

  console.log(isAuthenticated);
  // Actions
  const onIngredientAdded = (ingName) =>
    dispatch(actions.addIngredients(ingName));
  const onIngredientRemoved = (ingName) =>
    dispatch(actions.removeIngredient(ingName));
  const onFetchIngredients = useCallback(
    () => dispatch(actions.initIngredients()),
    [dispatch]
  );
  const onPurchaseInit = () => dispatch(actions.purchaseInit());
  const onSetAuthRedirectPath = (path) =>
    dispatch(actions.setAuthRedirectPath(path));

  useEffect(() => {
    onFetchIngredients();
  }, [onFetchIngredients]);

  const updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map((igkey) => {
        return ingredients[igkey];
      })
      .reduce((total, el) => {
        return total + el;
      }, 0);
    return sum > 0;
  };

  const purchasingHandler = () => {
    if (isAuthenticated) {
      setPurchasing(true);
    } else {
      props.history.push("/auth");
      onSetAuthRedirectPath("/checkout");
    }
  };

  const purchaseCancelHandler = () => {
    setPurchasing(false);
  };

  const purchaseContinuedHandler = () => {
    onPurchaseInit();
    props.history.replace("/checkout");
  };

  const disabledInfo = { ...ings };
  for (let key in disabledInfo) {
    disabledInfo[key] = disabledInfo[key] <= 0 ? true : false;
  }

  let orderSummary = null;

  let burger = error ? <p>Ingredients can't be loaded</p> : <Spinner />;
  if (ings) {
    burger = (
      <React.Fragment>
        <Burger ingredients={ings} />
        <BuilControls
          addIngredientHandler={onIngredientAdded}
          removeIngredientHandler={onIngredientRemoved}
          disabledInfo={disabledInfo}
          price={price}
          purchasable={updatePurchaseState(ings)}
          ordered={purchasingHandler}
          isAuthenticated={isAuthenticated}
        />
      </React.Fragment>
    );

    orderSummary = (
      <OrderSummary
        ingredients={ings}
        purchaseCancelled={purchaseCancelHandler}
        purchaseContinued={purchaseContinuedHandler}
        totalPrice={price}
      />
    );

    if (props.loading) {
      orderSummary = <Spinner />;
    }
  }

  return (
    <React.Fragment>
      <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
        {orderSummary}
      </Modal>
      {burger}
    </React.Fragment>
  );
};

export default WithErrorHandler(BurgerBuilder, axios);
