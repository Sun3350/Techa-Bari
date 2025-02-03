// Initial state for the auth reducer
const initialState = {
  isAuthenticated: false,
  user: null,
  isAdminLoggedIn: false,
  isAdminLoggedOut: false,
  loginTime: null, // To track session start time
  showLoginModal: false,
  subscribeUser: false,
};

// Action Types
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const ADMIN_LOGIN = 'ADMIN_LOGIN';
export const ADMIN_LOGOUT = 'ADMIN_LOGOUT';
export const UPDATE_LOGIN_TIME = 'UPDATE_LOGIN_TIME';
export const SHOW_LOGIN_POPUP = 'SHOW_LOGIN_POPUP';
export const HIDE_LOGIN_POPUP = 'HIDE_LOGIN_POPUP';
export const SUBSCRIBE_USER = 'SUBSCRIBE_USER';

// Reducer function
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        isAdminLoggedOut: false,
      };

    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isAdminLoggedOut: false,
      };

    case ADMIN_LOGIN:
      return {
        ...state,
        isAdminLoggedIn: true,
        user: action.payload.user,
        loginTime: Date.now(), // Save the session start time when admin logs in
      };

    case ADMIN_LOGOUT:
      return {
        ...state,
        isAdminLoggedIn: false,
        isAdminLoggedOut: true,
        user: null,
        loginTime: null,
      };

    case UPDATE_LOGIN_TIME:
      return {
        ...state,
        loginTime: action.payload?.time || state.loginTime, // Prevent undefined errors with fallback
      };

    case SUBSCRIBE_USER:
      return { ...state, subscribeUser: true };
    case SHOW_LOGIN_POPUP:
      return { ...state, showLoginModal: true };

    case HIDE_LOGIN_POPUP:
      return { ...state, showLoginModal: false };

    default:
      return state;
  }
};

export default authReducer;
