import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../axios-config/axiosInstance.ts';

interface ISupplier {
  id: number;
  name: string;
  email: string;
  mob_num: string;
  tel_num: string;
}

interface IItemDetails {
  id: number;
  item_grade: number;
  item_colour: string;
  car_model: number;
  hsn: number;
  gst: number;
  rate: number;
  maintain_stock: number;
  stock_control: number;
  Qc_stock_control: number;
  wp_stock_control: number;
  qc_requried: number;
  active: number;
}

interface IItem {
  id: number;
  item_name: string;
  uom: number;
  pack_size: number;
  erp_code: number;
  item_code: number;
  supplier: ISupplier;
  details: IItemDetails;
}

interface ItemState {
  items: IItem[];
  loading: boolean;
  error: string | null;
  dataCount: number;
}

const initialState: ItemState = {
  items: [],
  loading: false,
  error: null,
  dataCount: 0,
};

interface IItemResponse {
  success: boolean;
  data: IItem[];
  message: string;
  statusCode: number;
}

interface IItemListPayload {
  // Your optional query params here, e.g. page, search etc.
  [key: string]: any;
}

// Async thunk to get all items using GET method
export const getAllItems = createAsyncThunk<
  IItemResponse,
  IItemListPayload,
  { rejectValue: string }
>('items/getAllItems', async (payload, { rejectWithValue }) => {
  try {
    const response = await Axios.get<IItemResponse>('items', {
      params: payload
    });
    if (!response.data.success) {
      return rejectWithValue(response.data.message);
    }
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch items');
  }
});

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllItems.fulfilled, (state, action: PayloadAction<IItemResponse>) => {
        state.loading = false;
        state.items = action.payload.data;
        state.dataCount = action.payload.data.length;
      })
      .addCase(getAllItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default itemsSlice.reducer;