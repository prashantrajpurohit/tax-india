import { persistConfig } from "./redux-config";
import authSlice from "./authSlice";
import editDataSlice from "./editIDataSlice";
import priceListSlice from "./priceListSlice";
import {
  AnyAction,
  combineReducers,
  configureStore,
  Reducer,
} from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

const appReducer = combineReducers({
  userdata: authSlice,
  editData: editDataSlice,
  priceList: priceListSlice,
});
export type RootState = ReturnType<typeof appReducer>;
const newrootReducer: Reducer<RootState, AnyAction> = (state, action) => {
  if (action.type === "auth/logout") {
    state = {} as RootState;
    localStorage.removeItem("persist:root");
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, newrootReducer);

const store = configureStore({
  reducer: {
    data: persistedReducer,
  },
  devTools: process.env.NODE_ENV === "development" ? true : false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, REGISTER],
      },
    }),
});

const persistedStore = persistStore(store);
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type StoreRootState = ReturnType<typeof store.getState>; // <- includes "data"
export type DataState = RootState; // state.data shape = RootState
export { store, persistedStore };
