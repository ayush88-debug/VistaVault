import { createSlice } from "@reduxjs/toolkit"


const getLocalData=()=>{
    const themeMode=localStorage.getItem("themeMode")
    return themeMode ? themeMode : "light"
}

const initialState={
    themeMode:getLocalData()
}

const themeSlice=createSlice({
    name:"theme",
    initialState,
    reducers:{
        lightTheme:(state)=>{
            state.themeMode="light"
        },
        darkTheme:(state)=>{
            state.themeMode="dark"
        }
    }
})

export default themeSlice.reducer
export const {lightTheme, darkTheme}=themeSlice.actions