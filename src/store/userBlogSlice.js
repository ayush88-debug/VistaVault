import database from "@/Appwrite/database";
import conf from "@/conf/conf";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Query } from "appwrite";



const initialState={
    userBlogs:[],
    userblogsLoading:false,
    userblogsError:false
}


export const fetchUserBlogs=createAsyncThunk("fetchUserBlogs",
    async(userID)=>{
        try {
            return await database.listDocuments(conf.databaseId, conf.collectionId, [Query.equal('userID',userID)])
        } catch (err) {
            console.log("Error :: fetchUserBlogs: ", err.message)
        }
    }
)

const userBlogSlice=createSlice({
    name:"userBlogs",
    initialState,
    extraReducers:(builder)=>{
        builder.addCase(fetchUserBlogs.pending,(state)=>{
            state.userblogsLoading=true
        })
        builder.addCase(fetchUserBlogs.fulfilled, (state,action)=>{
            state.userblogsLoading=false;
            state.userBlogs=action.payload.documents
        })
        builder.addCase(fetchUserBlogs.rejected, (state)=>{
            state.userblogsLoading=false
            state.userblogsError=true
        })
    }
})

export default userBlogSlice.reducer