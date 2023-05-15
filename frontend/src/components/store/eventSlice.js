import { createSlice } from "@reduxjs/toolkit";

export const eventSlice = createSlice({
  name: "event",
  initialState: null,
  reducers: {
    setEvent: (state, action) => {
      return action.payload;
    },
  },
});

export const { setEvent } = eventSlice.actions;

export default eventSlice.reducer;
