import * as actionTypes from "./actionTypes";
import axios from "../../axios-orders";

export const addIngredients = (ingName) => {
  return {
    type: actionTypes.ADD_INGREDIENT,
    ingredientName: ingName,
  };
};

export const removeIngredient = (ingName) => {
  return {
    type: actionTypes.REMOVE_INGREDIENT,
    ingredientName: ingName,
  };
};

// Getting ingredients from server's actions
const setIngredients = (ingredients) => {
  return {
    type: actionTypes.SET_INGREDIENTS,
    ingredients: ingredients,
  };
};

const fetchIngredientFaild = (error) => {
  return {
    type: actionTypes.FETCH_INGREDIENTS_FAILD,
    error: error,
  };
};

export const initIngredients = () => {
  return (dispatch) => {
    axios
      .get("ingredients.json")
      .then((response) => dispatch(setIngredients(response.data)))
      .catch((error) => dispatch(fetchIngredientFaild(error)));
  };
};
