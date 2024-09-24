// store.js
import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// Reducer for managing login state
const initialState = {
  staffLoggedIn: false,
};

function authReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, staffLoggedIn: true };
    case 'LOGOUT':
      return { ...state, staffLoggedIn: false };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);

// Wrap your App component
export function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
