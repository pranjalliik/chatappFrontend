
'use client'
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

const initialState = {
    status: "",
    error: "",
    messages: [],
    notifications: [],
    conversation : '', 
  };


  


  export const getConversationMessages = createAsyncThunk(
    "message/get",
    async (values) => {
      let {id} = values
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BACK_URL}api/chat/v1/${id}`, 
            {
              withCredentials: true // Correct setting for axios
            }
        );
      return response.data;
    } catch (error) {
 

   
      throw new Error(error.message);
    }
      
    }
  );









  export const msgSlice = createSlice({
    name: "msg",
    initialState,
    reducers: {
      setMsg: (state, action) => {
       
    },   
    updateChatMsgs :(state,action)=>{
      state.messages = [...state.messages,action.payload]
    } ,
    updateConversation :(state,action)=>{
      state.conversation = action.payload;
    },
    msgStatusUpdate : (state,action)=>{
              for(let i = state.messages.length-1 ;i>=0;i--){
                if(state.messages[i]._id === action.payload.id){
                  state.messages[i].createdAt = action.payload.status
                  break;
                }
              }
    }
    },
   extraReducers(builder) {
      builder
        .addCase(getConversationMessages.pending, (state, action) => {
          state.messages = []
          state.error = ''
          state.conversation = ''       
         state.status = "loading";
        })
        .addCase(getConversationMessages.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.messages = action.payload.msg;
          state.conversation = action.payload.conversation
        })

    }
  })

  export const {setMsg,updateChatMsgs,updateConversation,msgStatusUpdate} = msgSlice.actions

export default msgSlice.reducer;
