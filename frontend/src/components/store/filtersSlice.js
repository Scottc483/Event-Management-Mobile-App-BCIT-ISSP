import { createSlice } from "@reduxjs/toolkit";

export const filtersSlice = createSlice({
  name: "filters",
  initialState: null,
  reducers: {
    setFilters: (state, action) => {
      return action.payload;
    },
  },
});

export const { setFilters } = filtersSlice.actions;

export default filtersSlice.reducer;
