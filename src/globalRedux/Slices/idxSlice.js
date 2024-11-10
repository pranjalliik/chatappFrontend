// socketSlice.js
import { createSlice } from '@reduxjs/toolkit';

const idxSlice = createSlice({
    name: 'idx',
    initialState: {
        index : 0 ,
    },
    reducers: {
        incrementIdx: (state, action) => {
                state.index =   (state.index + 1) % 2
        } 
    }
});

export const { incrementIdx } = idxSlice.actions;
export default idxSlice.reducer;
