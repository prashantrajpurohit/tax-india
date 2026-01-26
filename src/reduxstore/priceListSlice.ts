import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PriceListData {
  pan_application_form_filled_fees: number;
  pan_application_fees: number;
  convenience_fees: number;
  delivery_fees: number;
  agency_type_fees: number;
  affidavit_date_of_birth_fees: number;
  notary_test_fees: number;
  total_amount_of_pan_card: number;
  deliver_in_shop: number;
  itr_application_fees: number;
  e_verify_fees: number;
  pvc_print_fees: number;
  gst_fees: number;
  aadhaar_card_address: number;
  old_itr: number;
  mp_mla_gazetted: number;
  find_pan_card: number;
  find_aadhar_card: number;
}

interface PriceListState {
  priceList: PriceListData | null;
}

const initialState: PriceListState = {
  priceList: null,
};

const priceListSlice = createSlice({
  name: "priceList",
  initialState,
  reducers: {
    setPriceList: (state, action: PayloadAction<PriceListData>) => {
      state.priceList = action.payload;
    },
    clearPriceList: (state) => {
      state.priceList = null;
    },
  },
});

export const { setPriceList, clearPriceList } = priceListSlice.actions;
export default priceListSlice.reducer;
