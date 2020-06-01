import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import Button from "../../../components/UI/Button/Button";
import classes from "./ContactData.module.css";
import axios from "../../../axios-orders";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import WithErrorHandler from "../../../hoc/WithErrorHandler/WithErrorHandler";
import * as actions from "../../../store/actions/index";
import { checkValidaty } from "../../../shared/validation";

const ContactData = (props) => {
  const [orderForm, setOrderForm] = useState({
    name: {
      elementType: "input",
      elementConfig: {
        type: "text",
        placeholder: "Your Name",
      },
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    street: {
      elementType: "input",
      elementConfig: {
        type: "text",
        placeholder: "Street",
      },
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    zipCode: {
      elementType: "input",
      elementConfig: {
        type: "number",
        placeholder: "Zip Code",
      },
      value: "",
      validation: {
        required: true,
        minLength: 6,
        maxLength: 6,
      },
      valid: false,
      touched: false,
    },
    country: {
      elementType: "input",
      elementConfig: {
        type: "text",
        placeholder: "Country",
      },
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    email: {
      elementType: "input",
      elementConfig: {
        type: "email",
        placeholder: "Email",
      },
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    phone: {
      elementType: "input",
      elementConfig: {
        type: "number",
        placeholder: "Phone",
      },
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },

    deliveryMethod: {
      elementType: "select",
      elementConfig: {
        options: [
          {
            value: "fastest",
            displayValue: "Fastest",
          },
          {
            value: "cheapest",
            displayValue: "Cheapest",
          },
        ],
      },
      validation: {},
      valid: true,
      value: "fastest",
    },
  });

  const [formIsValid, setFormIsValid] = useState(false);
  //const [loading, setLoading] = useState(false);

  const { ings, loading, token, price, userId, onOrderHandler } = props;

  const orderHandler = (e) => {
    e.preventDefault();
    //setLoading(true);

    let formData = {};
    for (let formElementIdentifier in orderForm) {
      formData[formElementIdentifier] = orderForm[formElementIdentifier].value;
    }

    const order = {
      ingredients: ings,
      price: price,
      orderData: formData,
      userId: userId,
    };
    onOrderHandler(order, token);
  };

  const inputChangedHandler = (event, inputIdetifier) => {
    const form = { ...orderForm };

    // Deeply cloning the nested objects
    const formElement = {
      ...form[inputIdetifier],
    };

    // change element value
    formElement.value = event.target.value;

    // cheking input validaty
    formElement.valid = checkValidaty(
      formElement.value,
      formElement.validation
    );
    formElement.touched = true;

    // replacing the element with new element
    form[inputIdetifier] = formElement;

    // checking form validation
    let formIsValid = true;
    for (let inputIdentifier in form) {
      formIsValid = form[inputIdentifier].valid && formIsValid;
    }
    setOrderForm(form);
    setFormIsValid(formIsValid);
  };

  let formElementArray = [];

  for (let key in orderForm) {
    formElementArray.push({
      id: key,
      config: orderForm[key],
    });
  }

  let form = formElementArray.map((element) => (
    <Input
      key={element.id}
      elementType={element.config.elementType}
      {...element.config}
      value={element.value}
      valid={element.config.valid}
      shouldValidate={element.config.validation}
      touched={element.config.touched}
      changed={(event) => inputChangedHandler(event, element.id)}
    />
  ));

  form.push(
    <Button key="btn" btnType="Success" disabled={!formIsValid}>
      Order
    </Button>
  );
  if (loading) {
    form = <Spinner />;
  }
  return (
    <div className={classes.ContactData}>
      <h4>Enter Your Contact Data</h4>
      <form onSubmit={orderHandler}>{form}</form>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onOrderHandler: (orderData, token) =>
      dispatch(actions.purchaseBurger(orderData, token)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithErrorHandler(withRouter(ContactData), axios));
