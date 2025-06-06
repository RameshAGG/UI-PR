import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { ICommonListPayloadDto, IPriority, IPriorityResponse } from "../types/type";
import Axios from "../axios-config/axiosInstance.ts";
interface PriorityMasterSlice {
    isLoading: boolean;
    error: string | null;
    priorities: IPriority[];
    dataCount: number;
    offset: number;
    limit: number;
    sortField: string | null;
    sortOrder: number | null;
    searchInput: string;
}

export interface ApiResponse<T> {
    message: string;
    data: T;
    success: boolean;
}

// Fetch all priorities
export const getAllPriority = createAsyncThunk<IPriorityResponse, ICommonListPayloadDto, { rejectValue: string }>(
    "priority/getAllPriority",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await Axios.post<IPriorityResponse>(`v1/master/getAllPriority`, payload);
            if (response.data.success) {
                return response.data; 
            } else {
                return rejectWithValue("Failed to fetch priorities");
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch priorities");
        }
    }
);

// Create a new priority
export const createPriority = createAsyncThunk<IPriority, { priorityName: string },  { rejectValue: string }>(
    "priority/createPriority",
    async (values, { rejectWithValue }) => {
        try {
            const response = await Axios.post<IPriority>("v1/master/createPriority", values);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to create priority");
        }
    }
);

// Update a priority
export const updatePriority = createAsyncThunk<ApiResponse<IPriority>, { priorityId: number; priorityName: string }, { rejectValue: string }>(
    "priority/updatePriority",
    async ({ priorityId, priorityName }, { rejectWithValue }) => {
        try {
            const response = await Axios.put<ApiResponse<IPriority>>(`v1/master/updatePriority/${priorityId}`, { priorityName });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update priority");
        }
    }
);

// Delete a priority
export const deletePriority = createAsyncThunk<number, number, { rejectValue: string }>(
    "priority/deletePriority",
    async (id, { rejectWithValue }) => {
        try {
            await Axios.delete(`v1/master/deletePriority/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete priority");
        }
    }
);

export const updateStatus = createAsyncThunk<IAddOrUpdatePriority, { id: number; isActive: boolean }, { rejectValue: string }>(
    "priority/updateStatus",
    async ({ id, isActive }, { rejectWithValue }) => {
        try {
            const response = await Axios.put<IAddOrUpdatePriority>(`v1/master/updateStatus/${id}`, { isActive });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update priority status");
        }
    }
);

const initialState: PriorityMasterSlice = {
    isLoading: false,
    error: null,
    priorities: [],
    dataCount: 0,
    offset: 0,
    limit: 10,
    sortField: null,
    sortOrder: null,
    searchInput: "",
};

// Create the slice
const priorityMasterSlice = createSlice({
    name: "priorityMaster",
    initialState,
    reducers: {
        setPageSize(state, action) {
            state.limit = action.payload;
        },
        setOffset(state, action) {
            state.offset = action.payload;
        },
        setLimit(state, action) {
            state.limit = action.payload;
        },
        setSortField(state, action) {
            state.sortField = action.payload;
        },
        setSortOrder(state, action) {
            state.sortOrder = action.payload;
        },
        setSearchInput(state, action) {
            state.searchInput = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllPriority.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllPriority.fulfilled, (state, action: PayloadAction<IPriorityResponse>) => {
                state.isLoading = false;
                state.priorities = action.payload.data.listData ?? [];
                state.dataCount = action.payload.data.dataCount ?? 0;
            })
            .addCase(getAllPriority.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(createPriority.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })      
            .addCase(createPriority.fulfilled, (state, action: PayloadAction<IPriority>) => {
                state.isLoading = false;
                state.priorities.push(action.payload);
                state.dataCount = state.priorities.length;
            })
            .addCase(createPriority.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(updatePriority.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updatePriority.fulfilled, (state, action: PayloadAction<ApiResponse<IPriority>>) => {
                state.isLoading = false;
                state.priorities = state.priorities?.map(priority => priority.priorityId === action.payload.data.priorityId ? action.payload.data : priority);
                state.dataCount = state.priorities?.length ?? 0;
            })
            .addCase(updatePriority.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
    },
});

// Export the actions
export const { setOffset, setLimit, setSortField, setSortOrder, setSearchInput } = priorityMasterSlice.actions; 

export default priorityMasterSlice.reducer; 