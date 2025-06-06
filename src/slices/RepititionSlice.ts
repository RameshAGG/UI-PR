import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios";
import { ICommonListPayloadDto, IMaterialData, IMaterialName, IMaterialNameRes, IAddOrUpdateMaterialName, IRepetitionReq, IRepetitionRes } from "../types/type.ts";
import Axios from "../axios-config/axiosInstance.ts";

interface repetitionSlice {
  isLoading: boolean;
  error: string | null;
  repetitionData: IRepetitionReq[];
  offset: number;
  limit: number;
  sortField: string;
  sortOrder: number | null;
  searchInput: string;
  dataCount: number;
  sitecount: number;
}


// Fetch all material names
export const getAllRepetitionHistory = createAsyncThunk<IRepetitionRes, ICommonListPayloadDto & { siteId: number }, { rejectValue: string }>(
  "repetition/getAllRepetitionHistory",
  async ({ siteId, ...payload }, { rejectWithValue }) => {
    try {
      const response = await Axios.put<IRepetitionRes>(`v1/management/getAllRepetitionHistory/${siteId}`, payload);
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


// Update an existing material name
export const updateCurrentRepetation = createAsyncThunk<
  IRepetitionRes, 
  { 
    towerId: number; 
    siteId: number;
    currentrepititioncount: number 
  }, 
  { rejectValue: string }
>(
  "repetition/updateCurrentRepetation",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await Axios.put<IRepetitionRes>(
        `v1/management/updateCurrentRepetation/${payload.towerId}`, 
        { 
          towerId: payload.towerId,
          siteId: payload.siteId,
          currentrepititioncount: payload.currentrepititioncount
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update current repetation");
    }
  }
);


const initialState: repetitionSlice = {
  isLoading: false,
  error: null,
  repetitionData: [],
  offset: 0,
  limit: 10,
  sortField: "",
  sortOrder: null,
  searchInput: "",
  dataCount: 0,
  sitecount: 0,
}

const repetitionSlice = createSlice({
  name: "repetition",
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
      .addCase(getAllRepetitionHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllRepetitionHistory.fulfilled, (state, action: PayloadAction<IRepetitionRes>) => {
        state.isLoading = false;
        state.repetitionData = action.payload?.data?.listData || [];
        state.dataCount = action.payload.data.dataCount;
      })

      .addCase(getAllRepetitionHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(updateCurrentRepetation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

        .addCase(updateCurrentRepetation.fulfilled, (state, action: PayloadAction<IRepetitionRes>) => {
        state.isLoading = false;
      })

      .addCase(updateCurrentRepetation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
  },
})

export const { setOffset, setLimit, setSortField, setSortOrder, setSearchInput } = repetitionSlice.actions;
    export default repetitionSlice.reducer;
