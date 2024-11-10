import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";



const initialState = {
receiverInfo : ''
};






const receiverSlice = createSlice({
  name: 'receiver',
  initialState,
  reducers: {
      setReceiver: (state, action) => {
          state.receiverInfo = action.payload
      },

  },

});

export const { setReceiver } = receiverSlice.actions;

export default receiverSlice.reducer;