import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/Spinner/Spinner";
import classes from "./Auth.module.css";
import * as actions from "../../store/actions";
import { Redirect } from "react-router";
import { checkValidaty } from "../../shared/validation";

const Auth = (props) => {
  const [authForm, setAuthForm] = useState({
    email: {
      elementType: "input",
      elementConfig: {
        type: "email",
        placeholder: "Email",
      },

      value: "",
      validation: {
        required: true,
        isEmail: true,
      },
      valid: false,
      touched: false,
    },
    password: {
      elementType: "input",
      elementConfig: {
        type: "password",
        placeholder: "Password",
      },
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
  });

  const [isSignup, setIsSignup] = useState(false);

  const {
    building,
    loading,
    onSetAuthRedirectPath,
    authRedirectPath,
    error,
    isAuthenticated,
    onAuth,
  } = props;

  useEffect(() => {
    if (!building && authRedirectPath !== "/") {
      onSetAuthRedirectPath("/");
    }
  }, [authRedirectPath, building, onSetAuthRedirectPath]);

  const switchAuthModeHandler = () => {
    setIsSignup((prevState) => !prevState);
  };

  const inputChangedHandler = (event, elementName) => {
    const value = event.target.value;
    const form = {
      ...authForm,
      [elementName]: {
        ...authForm[elementName],
        value: value,
        valid: checkValidaty(value, authForm[elementName].validation),
        touched: true,
      },
    };
    setAuthForm(form);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    onAuth(authForm.email.value, authForm.password.value, isSignup);
  };

  let formElementArray = [];
  for (let key in authForm) {
    formElementArray.push({
      id: key,
      config: authForm[key],
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

  let errorMessage = null;
  if (error) {
    errorMessage = <p>{error.message}</p>;
  }

  let authRedirect = null;
  if (isAuthenticated) {
    authRedirect = <Redirect to={authRedirectPath} />;
  }
  return (
    <div className={classes.Auth}>
      {authRedirect}
      {errorMessage}
      {!loading ? (
        <React.Fragment>
          <form onSubmit={submitHandler}>
            {form}
            <Button btnType="Success">{isSignup ? "SIGNUP" : "SIGNIN"}</Button>
          </form>
          <Button btnType="Danger" clicked={switchAuthModeHandler}>
            SWITCH TO {isSignup ? "SIGNIN" : "SIGNUP"}
          </Button>
        </React.Fragment>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    authRedirectPath: state.auth.authRedirectPath,
    building: state.burgerBuilder.building,
  };
};
const mapDispachToProps = (dispatch) => {
  return {
    onAuth: (email, password, isSignup) =>
      dispatch(actions.auth(email, password, isSignup)),
    onSetAuthRedirectPath: (path) =>
      dispatch(actions.setAuthRedirectPath(path)),
  };
};

export default connect(mapStateToProps, mapDispachToProps)(Auth);
