import React, { useEffect } from "react";
import { connect } from "react-redux";

import Order from "../../components/Order/Order";
import axios from "../../axios-orders";
import WithErrorHandler from "../../hoc/WithErrorHandler/WithErrorHandler";
import Spinner from "../../components/UI/Spinner/Spinner";
import * as actions from "../../store/actions";

const Orders = (props) => {
  const { onFetchOrders, token, userId, orders, loading } = props;

  useEffect(() => {
    onFetchOrders(token, userId);
  }, [onFetchOrders, token, userId]);

  let ordersList = <Spinner />;
  if (orders && !loading) {
    ordersList = orders.map((order) => (
      <Order
        key={order.id}
        ingredients={order.ingredients}
        price={+order.price}
      />
    ));
  }
  return <div>{ordersList}</div>;
};

const mapStateToProps = (state) => {
  return {
    orders: state.order.orders,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchOrders: (token, userId) =>
      dispatch(actions.fetchOrders(token, userId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithErrorHandler(Orders, axios));
