import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IAccessoriesListMaster, IAccessoriesListMasterReq, IAccessoriesListMasterRes, IAccessoriesListMasterToggle, IAddOrUpdateAccessoriesListMaster} from "../types/type";
import { RootState } from "../store/store";
import { ICommonListPayloadDto } from "../types/type";
import Axios from "../axios-config/axiosInstance.ts";

interface AccessoriesListMasterSlice {
  isLoading: boolean;
  error: string | null;
  accessoriesListMaster: IAccessoriesListMaster[];
  accessoriesListMasterSelect: {
    label: string;
    value: number;
  }[];
  currentPage: number;
  offset: number;
  limit: number;
  sortField: string;
  sortOrder: number;
  searchInput: string;
  dataCount: number;
}

const initialState: AccessoriesListMasterSlice = {
  isLoading: false,
  error: null,
  accessoriesListMaster: [],
  accessoriesListMasterSelect: [],
  currentPage: 1,
  offset: 0,
  limit: 10,
  sortField: "createdOn",
  sortOrder: 1,
  searchInput: "",
  dataCount: 0,
}
// Fetch all material names
export const getAllAccessoriesListMaster = createAsyncThunk<
  IAccessoriesListMasterRes,
  ICommonListPayloadDto,
  { rejectValue: string }
>(
  "accessoryMaster/getAllAccessoriesList",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await Axios.post<IAccessoriesListMasterRes>(`v1/master/getAllAccessoriesList`, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch accessory list master");
    }
  }
);

interface IAddAccessoriesList {
  accessoriesNameId: number;
  quantity: number;
}


// Create a new material name
export const addAccessoryListMaster = createAsyncThunk<
  IAddOrUpdateAccessoriesListMaster,
  IAddAccessoriesList,
  { rejectValue: string }
>(
  "accessoryMaster/addAccessoryListMaster",
  async (values, { rejectWithValue }) => {
    try {
      const response = await Axios.post<IAddOrUpdateAccessoriesListMaster>("v1/master/createAccessoriesList", values);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add accessories list master");
    }
  }
);

// Update an existing material name
export const updateAccessoryListMaster = createAsyncThunk<IAddOrUpdateAccessoriesListMaster, { accessoriesListId: number ,accessoriesNameId:number,quantity:number}, { rejectValue: string }>(
  "accessoryMaster/updateAccessoryListMaster",
  async ({ accessoriesListId,accessoriesNameId,quantity }, { rejectWithValue }) => {
    try {
      const response = await Axios.put<IAddOrUpdateAccessoriesListMaster>(`v1/master/updateAccessoriesList/${accessoriesListId}`,{accessoriesNameId,quantity});
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update accessory list master");
    }
  }
);

// Delete a material name
export const deleteAccessoryListMaster = createAsyncThunk<number, number, { rejectValue: string }>(
  "accessoryMaster/deleteAccessoryListMaster",
  async (id, { rejectWithValue }) => {
    try {
      await Axios.delete(`v1/master/deleteAccessoriesListMaster/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete accessory list master");
    }
  }
);

export const updateStatusAccessoriesList = createAsyncThunk<IAccessoriesListMasterToggle, { accessoriesListId: number; isActive: boolean }, { rejectValue: string }>(
  "accessoryMaster/updateStatusAccessoriesList",
  async ({ accessoriesListId, isActive }, { rejectWithValue }) => {
    try {
      const response = await Axios.put<IAccessoriesListMasterToggle>(`v1/master/updateStatusAccessoriesList/${accessoriesListId}`, { isActive });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update accessory list master status");
    }
  }
);

const accessoriesListMasterSlice = createSlice({
  name: "AccessoriesListMaster",
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

      // Get All Accessories List Master

      .addCase(getAllAccessoriesListMaster.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(getAllAccessoriesListMaster.fulfilled, (state, action: PayloadAction<IAccessoriesListMasterRes>) => {
        state.isLoading = false;
        state.accessoriesListMaster = action.payload.data.listData;
        state.dataCount = action.payload.data.dataCount;
      })

      .addCase(getAllAccessoriesListMaster.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Add Accessories List Master

      .addCase(addAccessoryListMaster.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addAccessoryListMaster.fulfilled, (state, action: PayloadAction<IAddOrUpdateAccessoriesListMaster>) => {
        state.isLoading = false;
      })

      .addCase(addAccessoryListMaster.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string; 
      })

      .addCase(updateAccessoryListMaster.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAccessoryListMaster.fulfilled, (state, action: PayloadAction<IAddOrUpdateAccessoriesListMaster>) => {
        state.isLoading = false;
        state.dataCount = state.accessoriesListMaster?.length ?? 0;
      })

      .addCase(updateAccessoryListMaster.rejected, (state, action) => {
        state.isLoading = false;    
        state.error = action.payload as string;
      })

      .addCase(updateStatusAccessoriesList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(updateStatusAccessoriesList.fulfilled, (state, action: PayloadAction<IAccessoriesListMasterToggle>) => {
        state.isLoading = false;
        state.accessoriesListMaster = state.accessoriesListMaster;
        state.dataCount = state.dataCount;
      })

      .addCase(updateStatusAccessoriesList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

  },
})

export const { setOffset, setLimit, setSortField, setSortOrder, setSearchInput } = accessoriesListMasterSlice.actions;
export default accessoriesListMasterSlice.reducer;
