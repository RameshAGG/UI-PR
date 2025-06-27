import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../axios-config/axiosInstance.ts';
import { ReactNode } from 'react';

interface SupplierState {
  suppliers: ISupplier[];
  loading: boolean;
  error: string | null;
  dataCount: number;
}

const initialState: SupplierState = {
  suppliers: [],
  loading: false,
  error: null,
  dataCount: 0,
};

interface ISupplierDetails {
  id: number;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gst_number: string;
  pan_number: string;
  payment_terms: number;
  credit_limit: number;
  active: number;
}

interface ISupplier {
  mob_num: ReactNode;
  name: ReactNode;
  email: ReactNode;
  id: number;
  supplier_name: string;
  supplier_code: string;
  supplier_type: number;
  registration_date: string;
  details: ISupplierDetails;
}

interface ISupplierResponse {
  success: boolean;
  data: ISupplier[];
  message: string;
  statusCode: number;
}

interface ISupplierListPayload {
  // Your optional query params here, e.g. page, search etc.
  [key: string]: any;
}

// Async thunk to get all suppliers using GET method
export const getAllSuppliers = createAsyncThunk<
  ISupplierResponse,
  ISupplierListPayload,
  { rejectValue: string }
>('suppliers/getAllSuppliers', async (payload, { rejectWithValue }) => {
  try {
    const response = await Axios.get<ISupplierResponse>('/suppliers/', {
      params: payload
    });
    if (!response.data.success) {
      return rejectWithValue(response.data.message);
    }
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch suppliers');
  }
});

const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSuppliers.fulfilled, (state, action: PayloadAction<ISupplierResponse>) => {
        state.loading = false;
        state.suppliers = action.payload.data || [];
        state.dataCount = action.payload.data.length;
      })
      .addCase(getAllSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default suppliersSlice.reducer;