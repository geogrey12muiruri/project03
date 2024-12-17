import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import clinicsReducer from './clinicSlice';
import doctorsReducer from './doctorSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Persist only the auth state
};

const rootReducer = combineReducers({
  auth: authReducer,
  clinics: clinicsReducer,
  doctors: doctorsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;