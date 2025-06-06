import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios";
import { ICommonListPayloadDto, IMaterialData, IMaterialName, IMaterialNameRes, IAddOrUpdateMaterialName } from "../types/type";
import Axios from "../axios-config/axiosInstance.ts";

interface materialMasterSlice {
  isLoading: boolean;
  error: string | null;
  materialMaster: IMaterialName[];
  materialMasterSelect: {
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

interface ApiResponse<T> {
  message: string;
  data: T;
  success: boolean;
}

// Fetch all material names
export const getAllMaterialName = createAsyncThunk<IMaterialNameRes, ICommonListPayloadDto, { rejectValue: string }>(
  "materialName/getAllMaterialNames",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await Axios.post<IMaterialNameRes>(`v1/master/getAllMaterialName`, payload);
      if (response.data.success) {
        return response.data; // Return the full response structure
      } else {
        return rejectWithValue("Failed to fetch material names");
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch material names");
    }
  }
);

// Create a new material name
export const addMaterialName = createAsyncThunk<IAddOrUpdateMaterialName, { materialName: string }, { rejectValue: string }>(
  "materialName/createMaterialName",
  async (values, { rejectWithValue }) => {
    try {
      const response = await Axios.post<IAddOrUpdateMaterialName>("v1/master/createMaterialName", values);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add material name");
    }
  }
);

// Update an existing material name
export const updateMaterialName = createAsyncThunk<IAddOrUpdateMaterialName, { materialNameId: number; materialName: string }, { rejectValue: string }>(
  "materialName/updateMaterialName",
  async ({ materialNameId, materialName }, { rejectWithValue }) => {
    try {
      const response = await Axios.put<IAddOrUpdateMaterialName>(`v1/master/updateMaterialName/${materialNameId}`, { materialName });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update material name");
    }
  }
);

// Delete a material name
export const deleteMaterialName = createAsyncThunk<number, number, { rejectValue: string }>(
  "materialName/deleteMaterialName",
  async (id, { rejectWithValue }) => {
    try {
      await Axios.delete(`v1/master/deleteMaterialName/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete material name");
    }
  }
);

export const updateStatus = createAsyncThunk<IAddOrUpdateMaterialName, { materialNameId: number; isActive: boolean }, { rejectValue: string }>(
  "materialName/updateStatus",
  async ({ materialNameId, isActive }, { rejectWithValue }) => {
    try {
      const response = await Axios.put<IAddOrUpdateMaterialName>(`v1/master/updateStatusMaterialName/${materialNameId}`, { isActive });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update material name status");
    }
  }
);

const initialState: materialMasterSlice = {
  isLoading: false,
  error: null,
  materialMaster: [],
  materialMasterSelect: [],
  offset: 0,
  limit: 10,
  sortField: "createdOn",
  sortOrder: 1,
  searchInput: "",
  dataCount: 0,
}

const materialMasterSlice = createSlice({
  name: "MeterialMaster",
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
      .addCase(getAllMaterialName.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllMaterialName.fulfilled, (state, action: PayloadAction<IMaterialNameRes>) => {
        state.isLoading = false;
        state.materialMaster = action.payload.data.listData || [];
        state.dataCount = action.payload.data.dataCount;
      })

      .addCase(getAllMaterialName.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addMaterialName.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addMaterialName.fulfilled, (state, action: PayloadAction<IAddOrUpdateMaterialName>) => {
        state.isLoading = false;
        state.materialMaster.push(action.payload.data);
        state.dataCount = state.materialMaster?.length ?? 0;
      })

      .addCase(addMaterialName.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(updateMaterialName.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(updateMaterialName.fulfilled, (state, action: PayloadAction<IAddOrUpdateMaterialName>) => {
        state.isLoading = false;
        state.materialMaster = state.materialMaster?.map(item => item.materialNameId === action.payload.data.materialNameId ? action.payload.data : item);
        state.dataCount = state.materialMaster?.length ?? 0;
      })

      .addCase(updateMaterialName.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
  },
})

export const { setOffset, setLimit, setSortField, setSortOrder, setSearchInput } = materialMasterSlice.actions;
export default materialMasterSlice.reducer;
