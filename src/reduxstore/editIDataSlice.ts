import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EditDataState {
  editId: string | null;
  editData: any;
}

const initialState: EditDataState = {
  editId: null,
  editData: null,
};

const editDataSlice = createSlice({
  name: "addEditData",
  initialState,
  reducers: {
    addId: (state, action: PayloadAction<string | null>) => {
      state.editId = action.payload;
    },
    addEditData: (state, action: PayloadAction<any>) => {
      state.editData = action.payload;
    },
  },
});

export const { addId, addEditData } = editDataSlice.actions;
export default editDataSlice.reducer;
