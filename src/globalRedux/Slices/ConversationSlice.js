'use client'

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
    status: "",
    error: "",
    conversations: [],
  };




export const getConversations = createAsyncThunk(
    "conversations/get",
    async () => {
        try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BACK_URL}api/chat/v1`, 
        {
          withCredentials: true // Correct setting for axios
        })
      return response.data;
    } catch (error) {
  
     
        throw new Error(error.message);
    }
      
    }
  );



  export const conversationSlice = createSlice({
    name: "conv",
    initialState,
    reducers:{
        updateOnMsgSend: (state, action) => {
            const { conversationId, newMessage } = action.payload;
            const index = state.conversations.findIndex(convo => convo._id === conversationId);
            if (index !== -1) {
              // Update the lastMsg for the conversation
              state.conversations[index].lastMsg = newMessage;
          
              // Move the updated conversation to the top of the list
              const [updatedConversation] = state.conversations.splice(index, 1);
              state.conversations.unshift(updatedConversation);

            }
          }, 
           addConversation: (state, action) => {
            const newConversation = action.payload;
      
            // Insert new conversation at the beginning of the list
            state.conversations.unshift(newConversation);
    },
    },
   extraReducers(builder) {
      builder
      .addCase(getConversations.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.status = "succeeded";
      state.conversations = action.payload.data
    })
      .addCase(getConversations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message
      })

   }
} )

export const { addConversation,updateOnMsgSend } = conversationSlice.actions;
export default conversationSlice.reducer;