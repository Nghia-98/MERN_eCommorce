import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_RESET,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
} from '../constants/userContants';
import axios from 'axios';
import { ORDER_LIST_MY_RESET } from '../constants/orderConstants';

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    const config = {
      header: {
        'Content-Type': 'application/json',
      },
    };

    // send email, password to login route in server
    const { data } = await axios.post(
      '/api/users/login',
      {
        email,
        password,
      },
      config
    );

    // dispatch action for save userInfo in redux state (state.userLogin)
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

    // save userInfo after login success
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    // there are 2 kind of error
    // 1. error from client ( -> use error.message)
    // 2. error response from defaultErrorHandler middleware on backend server (-> use error.response.data)
    // console.log({ ...error });

    // if err dispatch action to save err in redux state
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// logout action
export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_DETAILS_RESET });
  dispatch({ type: ORDER_LIST_MY_RESET });
};

// register action
export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_REGISTER_REQUEST,
    });

    const config = {
      header: {
        'Content-Type': 'application/json',
      },
    };

    // send email, password to login route in server
    const { data } = await axios.post(
      '/api/users',
      { name, email, password },
      config
    );

    // dispatch action for save userInfo in redux state (state.userLogin)
    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

    // save userInfo after login success
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    // there are 2 kind of error
    // 1. error from client ( -> use error.message)
    // 2. error response from defaultErrorHandler middleware on backend server (-> use error.response.data)
    // console.log({ ...error });

    // if err dispatch action to save err in redux state
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// get user details action
export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DETAILS_REQUEST,
    });

    const { userInfo } = getState().userLogin;

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/users/${id}`, config);

    // dispatch action for save userInfo in redux state (state.userLogin)
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    // there are 2 kind of error
    // 1. error from client ( -> use error.message)
    // 2. error response from defaultErrorHandler middleware on backend server (-> use error.response.data)
    // console.log({ ...error });

    // if err dispatch action to save err in redux state
    dispatch({
      type: USER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// update user profile action
export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_PROFILE_REQUEST,
    });

    const { userInfo } = getState().userLogin;

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(`/api/users/profile`, user, config);

    // Dispatch action for save user info in redux state (reduxState.userUpdateProfile)
    dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: data });

    // After update user info success, we must update userInfo in others field of reduxState & localStorage
    // update reduxState.userLogin -> This help update user_name in Navbar
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    // userLogin info must persistent storage in localstorage
    //This will help reduxState.userLogin updated after page reload
    localStorage.setItem('userInfo', JSON.stringify(data));

    // update reduxState.userDetails -> This help update info of form in ProfileScreen;
    const userDetails = { ...data };
    delete userDetails.token;
    dispatch({ type: USER_DETAILS_SUCCESS, payload: userDetails });
  } catch (error) {
    // there are 2 kind of error
    // 1. error from client ( -> use error.message)
    // 2. error response from defaultErrorHandler middleware on backend server (-> use error.response.data)
    // console.log({ ...error });

    // if err dispatch action to save err in redux state
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
