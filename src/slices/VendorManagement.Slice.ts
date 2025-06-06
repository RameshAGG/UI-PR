import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IVendorReq, IVendorRes, IVendorResponse, ICommonListPayloadDto } from '../types/type';
import Axios from '../axios-config/axiosInstance.ts';

interface VendorManagementState {
  vendors: IVendorRes[];
  loading: boolean;
  error: string | null;
  offset: number;
  limit: number;
  sortField: string;
  sortOrder: number | null;
  searchInput: string;
  dataCount: number;
  getVendorbyIdValue: any;
}   

const initialState: VendorManagementState = {
  vendors: [],
  loading: false,
  error: null,
  offset: 0,
  limit: 10,
  sortField: '',
  sortOrder: null,
  searchInput: '',
  dataCount: 0,
  getVendorbyIdValue: null,
};

// Create async thunks for API calls
export const createVendor = createAsyncThunk<IVendorRes, IVendorReq, { rejectValue: string }>(
  'vendorManagement/createVendor',
  async (values, { rejectWithValue }) => {
    try {
      const response = await Axios.post<IVendorRes>('v1/management/createVendor', values);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllVendors = createAsyncThunk<IVendorResponse, ICommonListPayloadDto, { rejectValue: string }>(
  'vendorManagement/getAllVendors',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await Axios.post<IVendorResponse>('v1/management/getAllVendors', payload);
      if (!response.data.success) {
        return rejectWithValue(response.data.message);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vendors');
    }
  }
);

export const updateVendor = createAsyncThunk<IVendorRes, Partial<IVendorReq> & { id: number }, { rejectValue: string }>(
  'vendorManagement/updateVendor',
  async (value, { rejectWithValue }) => {
    try {
      const response = await Axios.put<IVendorRes>(`v1/management/updateVendor/${value.id}`, value);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getVendorbyId = createAsyncThunk<IVendorRes, { id: number }, { rejectValue: string }>(
  "vendorManagement/getVendorById",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await Axios.get<IVendorRes>(`v1/management/getVendorById/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateVendorStatus = createAsyncThunk<IVendorReq, { vendorId: number; values: any }, { rejectValue: string }>(
  "vendorManagement/updateStatusVendor",
  async ({ vendorId, values }, { rejectWithValue }) => {
    try {
      const response = await Axios.put<IVendorReq>(`v1/management/updateStatusVendor/${vendorId}`, values);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update vendor status");
    }
  }
);

const vendorManagementSlice = createSlice({
  name: 'vendorManagement',
  initialState,
  reducers: {
    setOffset: (state, action) => {
      state.offset = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
    setSortField: (state, action) => {
      state.sortField = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setSearchInput: (state, action) => {
      state.searchInput = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Vendor
      .addCase(createVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVendor.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get All Vendors
      .addCase(getAllVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllVendors.fulfilled, (state, action: PayloadAction<IVendorResponse>) => {
        state.loading = false;
        state.vendors = action.payload.data.listData || [];
        state.dataCount = action.payload.data.dataCount;
      })
      .addCase(getAllVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Vendor
      .addCase(updateVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.getVendorbyIdValue = action.payload.data;
      })
      .addCase(updateVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Vendor Status
      .addCase(updateVendorStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVendorStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateVendorStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Vendor by ID
      .addCase(getVendorbyId.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVendorbyId.fulfilled, (state, action) => {
        state.loading = false;
        state.getVendorbyIdValue = action.payload.data;
      })
      .addCase(getVendorbyId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setOffset, setLimit, setSortField, setSortOrder, setSearchInput } = vendorManagementSlice.actions;
export default vendorManagementSlice.reducer;