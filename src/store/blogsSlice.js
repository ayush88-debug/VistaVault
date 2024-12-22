import database from "@/Appwrite/database";
import conf from "@/conf/conf";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Query } from "appwrite";



const initialState={
    allBlogs:[],
    blogloading:false,
    blogError: false
}


export const fetchBlogs=createAsyncThunk("fetchBlogs",
    async(keywords=[""])=>{
        try {
            return await database.listDocuments(conf.databaseId, conf.collectionId, [Query.equal('status','public') , Query.contains('title', keywords)])
        } catch (err) {
            console.log("Error :: fetchBlogs: ", err.message)
        }
    }
)

const blogsSlice=createSlice({
    name: "blogs",
    initialState,
    extraReducers:(builder)=>{
        builder.addCase(fetchBlogs.pending,(state)=>{
            state.blogloading=true
        })
        builder.addCase(fetchBlogs.fulfilled, (state,action)=>{
            state.blogloading=false;
            state.allBlogs=action.payload.documents
        })
        builder.addCase(fetchBlogs.rejected, (state)=>{
            state.blogloading=false
            state.blogError=true
        })
    }

})

export default blogsSlice.reducer