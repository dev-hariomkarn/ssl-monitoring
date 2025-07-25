"use client";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import axios from "axios";
import setupAxios from "./setupAxios";
import { persistor, store } from "./store";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    setupAxios(axios, store)
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor} loading={null}>
                {children}
            </PersistGate>
        </Provider>
    );
}