import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import blogsReducer from "./blogsSlice"



export const store = configureStore({
    reducer : {
        auth: authReducer,
        blogs: blogsReducer
    }
})