import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import Axios from '../axios-config/axiosInstance.ts';

interface InventoryReportState {
    loading: boolean;
    error: string | null;
    data: any;
}

const initialState: InventoryReportState = {
    loading: false,
    error: null,
    data: null
};

export const fetchInventoryReport = createAsyncThunk(
    'inventoryReport/fetch',
    async (values: any, { rejectWithValue }) => {
        try {
            const response = await Axios.post('v1/master/inventoryReport', values, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch inventory report');
        }
    }
);

const inventoryReportSlice = createSlice({
    name: 'inventoryReport',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInventoryReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInventoryReport.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchInventoryReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export default inventoryReportSlice.reducer; 