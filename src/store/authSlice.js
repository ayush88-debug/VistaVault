
import { createSlice } from "@reduxjs/toolkit"

const initialState={
    data:{
        username:null,
        userId:null,
        isLoading:true,
    }
}

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        addData:(state,action)=>{
            const temp={
                username:action.payload.username,
                userId:action.payload.userId,
                isLoading:action.payload.isLoading
            }
            state.data=temp
        },
        toggleLoading:(state,action)=>{
            state.data.isLoading= action.payload
        }
    }

})

export default authSlice.reducer
export const {addData, toggleLoading}=authSlice.actions