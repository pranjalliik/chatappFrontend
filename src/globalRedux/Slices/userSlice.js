'use client';

import axios from 'axios';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";





const initialState = {
  user: '',
  status : '',
  error : ''
};

export const signin = createAsyncThunk(
  "signin/user",
  async ({username,password}, { rejectWithValue }) => {
     let url = process.env.NEXT_PUBLIC_API_URL
    try {
      const response = await axios.post(
        `${url}api/auth/v1/signin`,
        JSON.stringify({ username, password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true // Correct setting for axios
        }
    );
      return response.data;
    } catch (error) {

      if (error.response && error.response.status === 401) {
        
        throw new Error('Wrong Credentials');

      }else{

      throw new Error('Sign-in request failed.');
    }
    }
  }
);

export const signup = createAsyncThunk(
  "signup/user",
  async ({name, username,password,confirmPassword}, { rejectWithValue }) => {
     
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}api/auth/v1/signup`,
        JSON.stringify({name, username,password,confirmPassword}),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
  
        if(error.response && error.response.data && error.response.data.message === 'Duplicate field Please use another value!'){
        throw new Error('invalid username');
        }    
      else{
      throw new Error('Sign up request failed.');
    }
    }
  }
);





export const signout = createAsyncThunk(
  "signout/user",
  async () => {
     
    try {
   

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}api/auth/v1/signout`, 
        { withCredentials: true});
      return response;
    } catch (error) {
      
       if (error.response && error.response.status === 401) {
        // Handle 401 Unauthorized error
        // You may dispatch an action to update the state indicating the user is not authenticated
      } 
      throw new Error('Signout request failed.');
    }
  }
);









const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateName(state, action) {
      state.user = action.payload.user;
    },
    logout(state) {
      // Reset all user properties on logout
      state.user = '';
    },

  },

  extraReducers(builder) {
    builder
    .addCase(signin.fulfilled, (state, action) => {

        state.user = action.payload.user
        state.status = "succeeded";
    })
    .addCase(signin.pending, (state, action) => {
      state.status = 'loading';
      })

    .addCase(signin.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
      state.user= ''

    }) .addCase(signup.fulfilled, (state, action) => {

      state.user = action.payload.data
      state.status = "succeeded";
    })
    .addCase(signup.pending, (state, action) => {
      state.status = 'loading';
     
    })
    .addCase(signup.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;

    })
    .addCase(signout.fulfilled, (state, action) => {

      state.user = '';
      state.status = 'succeeded';
    })
    .addCase(signout.pending, (state, action) => {
      state.status = 'loading';
      })
    .addCase(signout.rejected, (state, action) => {
      state.status = "failed";
    })
  
  }

});

export const { updateName,logout} = userSlice.actions;





export default userSlice.reducer;






