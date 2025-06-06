import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios";
import { IAccessoriesName, IAccessoriesNameReq, IAccessoriesNameRes, IAddOrUpdateAccessoriesName, ICommonListPayloadDto } from "../types/type";
import { RootState } from "../store/store";
import Axios from "../axios-config/axiosInstance.ts";

interface AccessoriesMasterSlice {
  isLoading: boolean;
  error: string | null;
  accessoriesMaster: IAccessoriesName[];
  accessoriesMasterSelect: {
    label: string;
    value: number;
  }[];
  offset: number;
  limit: number;
  sortField: string;
  sortOrder: number;
  searchInput: string;
  dataCount: number;
}

const initialState: AccessoriesMasterSlice = {
  isLoading: false,
  error: null,
  accessoriesMaster: [],
  accessoriesMasterSelect: [],
  offset: 0,
  limit: 10,
  sortField: "createdOn",
  sortOrder: 1,
  searchInput: "",
  dataCount: 0,
}
// Fetch all material names
export const getAllAccessoriesName = createAsyncThunk<
  IAccessoriesNameRes,
  ICommonListPayloadDto,
  { state: RootState; rejectValue: string }
>(
  "accessoryMaster/getAllAccessoryNames",
  async (payload, { rejectWithValue }) => {
    try {

    const response = await Axios.post<IAccessoriesNameRes>(`v1/master/getAllAccessoriesName`, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch accessory names");
    }
  }
);

// Create a new material name
export const addAccessoryName = createAsyncThunk<
IAddOrUpdateAccessoriesName,
{ materialTypeId: number; accessoriesName: string },
{ rejectValue: string }
>(
  "accessoryMaster/createAccessoryName",
  async (values, { rejectWithValue }) => {
    try {
      const response = await Axios.post<IAddOrUpdateAccessoriesName>("v1/master/createAccessoriesName", values);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add accessories name");
    }
  }
);

// Update an existing material name
export const updateAccessoryName = createAsyncThunk<IAddOrUpdateAccessoriesName, { materialTypeId: number; accessoriesNameId: number; accessoriesName: string }, { rejectValue: string }>(
  "accessoryMaster/updateAccessoryName",
  async ({ materialTypeId, accessoriesNameId, accessoriesName }, { rejectWithValue }) => {
    try {
      const response = await Axios.put<IAddOrUpdateAccessoriesName>(`v1/master/updateAccessoriesName/${accessoriesNameId}`, { materialTypeId, accessoriesName });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update accessory name");
    }
  }
);

// Delete a material name
export const deleteAccessoryName = createAsyncThunk<number, number, { rejectValue: string }>(
  "accessoryMaster/deleteAccessoryName",
  async (id, { rejectWithValue }) => {
    try {
      await Axios.delete(`v1/master/deleteAccessoriesName/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete accessory name");
    }
  }
);

export const updateStatus = createAsyncThunk<IAddOrUpdateAccessoriesName, { accessoriesNameId: number; isActive: boolean }, { rejectValue: string }>(
  "accessoryMaster/updateStatus",
  async ({ accessoriesNameId, isActive }, { rejectWithValue }) => {
    try {
      const response = await Axios.put<IAddOrUpdateAccessoriesName>(`v1/master/updateStatusAccessoriesName/${accessoriesNameId}`, { isActive });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update accessory name status");
    }
  }
);


const accessoriesMasterSlice = createSlice({
  name: "AccessoriesMaster",
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
      .addCase(getAllAccessoriesName.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(getAllAccessoriesName.fulfilled, (state, action: PayloadAction<IAccessoriesNameRes>) => {
        state.isLoading = false;
        state.accessoriesMaster = action.payload.data.listData ?? [];
        state.dataCount = action.payload.data.dataCount;
      })

      .addCase(getAllAccessoriesName.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addAccessoryName.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addAccessoryName.fulfilled, (state, action: PayloadAction<IAddOrUpdateAccessoriesName>) => {
        state.isLoading = false;
        state.accessoriesMaster.push(action.payload.data);
        state.dataCount = state.accessoriesMaster?.length ?? 0;
      })

      .addCase(addAccessoryName.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(updateAccessoryName.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(updateAccessoryName.fulfilled, (state, action: PayloadAction<IAddOrUpdateAccessoriesName>) => {
        state.isLoading = false;
        state.accessoriesMaster = state.accessoriesMaster?.map(item => item.accessoriesNameId === action.payload.data.accessoriesNameId ? action.payload.data : item);
        state.dataCount = state.accessoriesMaster?.length ?? 0;
      })

      .addCase(updateAccessoryName.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
  },
})

export const { setOffset, setLimit, setSortField, setSortOrder, setSearchInput } = accessoriesMasterSlice.actions;
export default accessoriesMasterSlice.reducer;
