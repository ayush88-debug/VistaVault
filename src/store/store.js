import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import blogsReducer from "./blogsSlice"
import userBlogsReducer from "./userBlogSlice"



export const store = configureStore({
    reducer : {
        auth: authReducer,
        blogs: blogsReducer,
        userBlogs: userBlogsReducer
    }
})