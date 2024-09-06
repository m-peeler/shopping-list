import { configureStore } from "@reduxjs/toolkit";
import remoteDataReducer from "./entriesSlice";


const store = configureStore({
    reducer:  {
        remoteData: remoteDataReducer
    }
})

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch