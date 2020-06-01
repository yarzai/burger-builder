import React from "react";
import Button from "../../UI/Button/Button";

const OrderSummary = (props) => {
  const ingredientsSummary = Object.keys(props.ingredients).map((igKey) => {
    return (
      <li key={igKey}>
        <span style={{ textTransform: "capitalize" }}>{igKey}</span>:
        {props.ingredients[igKey]}
      </li>
    );
  });
  return (
    <React.Fragment>
      <h1>Your Order Summary</h1>
      <p>A delicious burger with the following ingredients:</p>
      <ul>{ingredientsSummary}</ul>
      <p>
        <strong>Total Price: {props.totalPrice.toFixed(2)}$</strong>
      </p>
      <p>Continue to checkout?</p>
      <Button btnType="Danger" clicked={props.purchaseCancelled}>
        CANCEL
      </Button>
      <Button btnType="Success" clicked={props.purchaseContinued}>
        CONTINUE
      </Button>
    </React.Fragment>
  );
};

export default OrderSummary;
