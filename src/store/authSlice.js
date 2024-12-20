
import account from "@/Appwrite/services"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const initialState={
    userData:null,
    isLoading:false,
    isError:false
}

export const fetchAuth=createAsyncThunk('fetchAuth',
    async ()=>{
        try {
            return await account.get()
        } catch (err) {
            console.log("Error in fetchAuth:", err.message);
        }
    }
)

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        deleteData:(state)=>{
            state.userData=null
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchAuth.pending,(state)=>{
            state.isLoading=true
        })
        builder.addCase(fetchAuth.fulfilled , (state,action)=>{
            state.isLoading=false
            state.userData=action.payload
        })
        builder.addCase(fetchAuth.rejected, (state)=>{
            state.isLoading=false
            state.isError=true
        })
    }

})

export default authSlice.reducer
export const {deleteData}=authSlice.actions