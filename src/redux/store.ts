import { configureStore, Tuple } from "@reduxjs/toolkit";
import { encryptTransform } from "redux-persist-transform-encrypt";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import { rootReducers } from "./rootReducers";
import persistStore from "redux-persist/es/persistStore";
import { thunk } from "redux-thunk";

const persistConfig: any = {
    key: 'auth',
    storage,
    whitelist: ['auth'],
    transforms: [encryptTransform({ secretKey: 'my-secret-key' })],
  };

const pReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
    reducer: pReducer,
    middleware: () => new Tuple(thunk),
})

export const persistor: any = persistStore(store);