import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../axios-config/axiosInstance.ts';

interface ISupplier {
  id: number;
  name: string;
  email: string;
  mob_num: string;
  tel_num: string;
  code: string | null;
}

interface IItem {
  id: number;
  item_name: string;
  uom: string;
  quantity: number;
  item_group_id: number;
  item_subgroup_id: number;
  pack_size: number;
  item_code: string;
  erp_code: string;
}

interface IItemPrice {
  id: number;
  company: string;
  unit: string;
  effective_date: string;
  rate: string;
  default_user: string;
  supplier: ISupplier;
  item: IItem;
}

interface ItemPriceState {
  itemPrices: IItemPrice[];
  loading: boolean;
  error: string | null;
  dataCount: number;
}

const initialState: ItemPriceState = {
  itemPrices: [],
  loading: false,
  error: null,
  dataCount: 0,
};

interface IItemPriceResponse {
  success: boolean;
  data: IItemPrice[];
  message: string;
  statusCode: number;
}

interface IItemPriceListPayload {
  [key: string]: any;
}

// Async thunk to get all item prices using GET method
export const getAllItemPrices = createAsyncThunk<
  IItemPriceResponse,
  IItemPriceListPayload,
  { rejectValue: string }
>('itemPrices/getAllItemPrices', async (payload, { rejectWithValue }) => {
  try {
    const response = await Axios.get<IItemPriceResponse>('item-prices', {
      params: payload
    });
    if (!response.data.success) {
      return rejectWithValue(response.data.message);
    }
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch item prices');
  }
});

const itemPricesSlice = createSlice({
  name: 'itemPrices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllItemPrices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllItemPrices.fulfilled, (state, action: PayloadAction<IItemPriceResponse>) => {
        state.loading = false;
        state.itemPrices = action.payload.data;
        state.dataCount = action.payload.data.length;
      })
      .addCase(getAllItemPrices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default itemPricesSlice.reducer;