import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {thunk} from 'redux-thunk'; // Correctly import thunk
import inactivityMiddleware from './SessionMiddleware';
import authReducer from './authReducer';

// Persist configuration
const persistConfig = {
  key: 'auth',
  storage,
  whitelist: ['isAuthenticated', 'user','subscribeUser'], // Persist only 'isAuthenticated' and 'user'
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, authReducer);

// Configure store
const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable state checks for Redux Persist
    }).concat(thunk, inactivityMiddleware), // Add thunk and inactivityMiddleware
});

// Persistor
const persistor = persistStore(store);

export { store, persistor };
