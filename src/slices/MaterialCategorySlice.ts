import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IMaterialCategoryRes,
  IMaterialCategoryReq,
  ICategory,
  IAddOrUpdateCategory,
  ICommonListPayloadDto,
  IAddOrUpdateMaterialName,
} from "../types/type.ts";
import axios from "axios";
import { RootState } from "../store/store.ts";
import Axios from "../axios-config/axiosInstance.ts";

interface MaterialCategoryState {
  categories: ICategory[];
  loading: boolean;
  error: string | null;
  materialTypeSelect: {
    label: string;
    value: number;
  }[];
  offset: number;
  limit: number;
  sortField: string;
  sortOrder: number;
  dataCount: number;
  searchInput: string;
}

const initialState: MaterialCategoryState = {
  categories: [],
  loading: false,
  error: null,
  dataCount: 0,
  offset: 0,
  limit: 10,
  sortField: "createdOn",
  sortOrder: 1,
  materialTypeSelect: [],
  searchInput: ""
};

//fetch material categories
export const fetchMaterialCategories = createAsyncThunk<
  IMaterialCategoryRes, // Response type
  ICommonListPayloadDto,
  { state: RootState; rejectValue: string } // Error type should be string
>(
  "materialCategory/fetchAll",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await Axios.post<IMaterialCategoryRes>(
        "v1/master/getAllMaterialtype",payload);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "Failed to fetch categories";
      return rejectWithValue(errorMessage);
    }
  }
);

// post new materialcategory
export const addMaterialCategory = createAsyncThunk<
  IAddOrUpdateCategory,
  IMaterialCategoryReq,
  { rejectValue: string }
>("materialCategory/add", async (values, { rejectWithValue }) => {
  try {
    const response = await Axios.post<IAddOrUpdateCategory>(
      "v1/master/createMaterialType",
      values
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to add category"
    );
  }
});

//  update material category
export const updateMaterialCategory = createAsyncThunk<
  IAddOrUpdateCategory,
  Partial<ICategory> & { materialTypeId: number; materialtypeName: string },
  { rejectValue: string }
>("materialCategory/update", async (value, { rejectWithValue }) => {
  try {
      const response = await Axios.put<IAddOrUpdateCategory>(`v1/master/updateMaterialType/${value.materialTypeId}`, { materialtypeName: value.materialtypeName });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update material name");
    }
  }
);

// delete material category
export const deleteMaterialCategory = createAsyncThunk<
  number, // Return type (deleted ID)
  number, // Input type (ID to delete)
  { rejectValue: string }
>("materialCategory/delete", async (id, { rejectWithValue }) => {
  try {
    await Axios.delete(`v1/master/deleteMaterialType/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete category"
    );
  }
});

export const updateStatus = createAsyncThunk<IAddOrUpdateCategory, { materialTypeId: number; isActive: boolean }, { rejectValue: string }>(
  "materialCategory/updateStatus",
  async ({ materialTypeId, isActive }, { rejectWithValue }) => {
    try {
      const response = await Axios.put<IAddOrUpdateCategory>(`v1/master/updateStatusMaterialType/${materialTypeId}`, { isActive });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update material category status");
    }
  }
);
// Create Slice
const MaterialCategorySlice = createSlice({
  name: "materialCategory",
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
      .addCase(fetchMaterialCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaterialCategories.fulfilled, (state, action: PayloadAction<IMaterialCategoryRes>) => {
        state.loading = false;
        state.categories = action.payload.data.listData || [];
        state.dataCount = action.payload.data.dataCount;
      })

      .addCase(fetchMaterialCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load categories";
      })
      .addCase(addMaterialCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(addMaterialCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.categories = [...state.categories, action.payload.data];
      })

      .addCase(addMaterialCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add category";
      })

      .addCase(updateMaterialCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMaterialCategory.fulfilled, (state, action) => {
        if (!action.payload?.data) {
          console.error("Update payload missing data:", action.payload);
          return;
        }

        const index = state.categories.findIndex(
            (cat) => cat.materialTypeId === action.payload.data.materialTypeId
        );
        if (index !== -1) {
          state.categories[index] = action.payload.data;
        }

        state.loading = false;
        state.error = null;
      })

      .addCase(updateMaterialCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update category";
      })

      .addCase(deleteMaterialCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMaterialCategory.fulfilled, (state, action) => {
        if (typeof action.payload !== "number") {
          console.error("Delete failed, invalid payload:", action.payload);
          return;
        }

        state.categories = state.categories.filter(
          (cat) => cat.materialTypeId !== action.payload
        );
        state.loading = false;
      })

      .addCase(deleteMaterialCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete category";
      })

      .addCase(updateStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })

      .addCase(updateStatus.rejected, (state, action) => {  
        state.loading = false;
        state.error = action.payload || "Failed to update category status";
      });
  },
});

export const { setOffset, setLimit, setSortField, setSortOrder, setSearchInput } = MaterialCategorySlice.actions;
export default MaterialCategorySlice.reducer;
