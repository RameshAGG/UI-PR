import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    IMaterialName,
    IMaterialListMasterReq,
    IAddOrUpdateMaterialMasterList,
    IMaterialListNameRes,
    IMaterialListName,
    ICommonListPayloadDto,
    IMaterialListMaster,
    IMaterialListMasterRes,
    IMaterialListMasterToggle
} from "../types/type.ts";
import { RootState } from "../store/store.ts";
import Axios from "../axios-config/axiosInstance.ts";

interface MaterialListMasterSlice {
    isLoading: boolean;
    error: string | null;
    materialListMaster: IMaterialListMaster[];
    materialListMasterSelect: {
      label: string;
      value: number;
    }[];
    currentPage: number;
    offset: number;
    limit: number;
    sortField: string;
    sortOrder: number | null;
    searchInput: string;
    dataCount: number;
    // addMetrialMessage: string | null;
}
  

const initialState: MaterialListMasterSlice = {
    materialListMaster: [],
    materialListMasterSelect: [],
    isLoading: false,
    error: null,
    currentPage: 1,
    offset: 0,
    limit: 10,
    sortField: "",
    sortOrder: null,
    searchInput: "",
    dataCount: 0,
    // addMetrialMessage: null,
};


export const addMaterialListMaster = createAsyncThunk
<IAddOrUpdateMaterialMasterList,
 IMaterialListMasterReq,
  { rejectValue: string }>(
  "materialListMaster/add",
  async (values, { rejectWithValue }) => {
    try {
      const response = await Axios.post<IAddOrUpdateMaterialMasterList>("v1/master/createMaterialList", values);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add material");
    }
  }
);


export const getAllMaterialListMaster = createAsyncThunk<
    IMaterialListMasterRes,
    ICommonListPayloadDto,
    { rejectValue: string }
    >
("materialListMaster/getAll", async (payload, { rejectWithValue }) => {
    try {
        const response = await Axios.post<IMaterialListMasterRes>(
            "v1/master/getAllMaterialList",
            payload   
        );
        return response.data;
    } catch (error: any) {
        return rejectWithValue(
            error.response?.data?.message || "Failed to get material"
        );
    }
});

export const updateMaterialListMaster = createAsyncThunk
<IAddOrUpdateMaterialMasterList, IMaterialListMasterReq, 
{ rejectValue: string }>
("materialListMaster/update", async (values, { rejectWithValue }) => {
    try {
        const response = await Axios.put<IAddOrUpdateMaterialMasterList>(
            `v1/master/updateMaterialList/${values.materialListId}`,
            values
        );
        return response.data;
    } catch (error: any) {
        return rejectWithValue(
            error.response?.data?.message || "Failed to update material"
        );
    }
});

export const updateStatusMaterialList = createAsyncThunk<IMaterialListMasterToggle, { materialListId: number; isActive: boolean }, { rejectValue: string }>(
    "materialListMaster/updateStatus",
    async ({ materialListId, isActive }, { rejectWithValue }) => {
        try {
            const response = await Axios.put<IMaterialListMasterToggle>(
                `v1/master/updateStatusMaterialList/${materialListId}`,{ isActive }
            );
            return response.data;
    } catch (error: any) {
        return rejectWithValue(
            error.response?.data?.message || "Failed to update status material"
        );
    }
});



export const fetchSitewiseMaterialList = createAsyncThunk<
IMaterialListNameRes, // Changed from IMaterialCategoryRes to IMaterialNameRes
    { search?: string, page?: number, limit?: number, query?: string },
    { state: RootState; rejectValue: string }
>(
    "materialListMaster/fetch",
    async ({ search = "", page = 1, limit = 25, query = "" }, { getState,rejectWithValue }) => {
        const { currentPage, limit: stateLimit } = getState().MaterialListMaster;
        try {
            const response = await Axios.post<IMaterialListNameRes>(
                `v1/master/fetchSitewiseMaterialList?search=${search}&currentPage=${currentPage}&pageSize=${stateLimit}`
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch material list"
            );
        }
    }
);


export const fetchTowerwiseMaterialList = createAsyncThunk<
IMaterialListNameRes, // Changed from IMaterialCategoryRes to IMaterialNameRes
    { siteId?: Number, materialNameId?: Number },
    { state: RootState; rejectValue: string }
>(
    "materialListMaster/fetch",
    async ({ siteId, materialNameId }, { getState,rejectWithValue }) => {
        const { currentPage, limit: stateLimit } = getState().MaterialListMaster;
        try {
            const response = await Axios.post<IMaterialListNameRes>(
                `v1/master/fetchTowerwiseMaterialList?siteId=${siteId}&materialNameId=${materialNameId}&currentPage=${currentPage}&pageSize=${stateLimit}`
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch material list"
            );
        }
    }
);


export const fetchTowerwiseAccessoriesList = createAsyncThunk<
IMaterialListNameRes, // Changed from IMaterialCategoryRes to IMaterialNameRes
    { siteId?: Number, materialNameId?: Number, page?: number, pageSize?: number },
    { state: RootState; rejectValue: string }
>(
    "materialListMaster/fetch",
    async ({ siteId, materialNameId}, { getState,rejectWithValue }) => {
        const { currentPage, limit } = getState().MaterialListMaster;
        try {
            const response = await Axios.post<IMaterialListNameRes>(
                `v1/master/fetchTowerwiseAccessoriesList?siteId=${siteId}&materialNameId=${materialNameId}&currentPage=${currentPage}&pageSize=${limit}`
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch material list"
            );
        }
    }
);


export const fetchIdwiseAccessoriesList = createAsyncThunk<
IMaterialListNameRes, // Changed from IMaterialCategoryRes to IMaterialNameRes
    { towerId?: Number, materialNameId?: Number },
    { state: RootState; rejectValue: string }
>(
    "materialListMaster/fetch",
    async ({ towerId, materialNameId }, { getState,rejectWithValue }) => {
        const { currentPage, limit } = getState().MaterialListMaster;
        try {
            const response = await Axios.post<IMaterialListNameRes>(
                `v1/master/fetchIdwiseAccessoriesList?towerId=${towerId}&materialNameId=${materialNameId}&currentPage=${currentPage}&pageSize=${limit}`
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch material list"
            );
        }
    }
);


export const fetchMaterialListByMaterialName = createAsyncThunk<
IMaterialListNameRes, // Changed from IMaterialCategoryRes to IMaterialNameRes
    { search?: string },
    { state: RootState; rejectValue: string }
>(
    "materialListMaster/fetch",
    async ({ search = "" }, { getState,rejectWithValue }) => {
        const { currentPage, limit } = getState().MaterialListMaster;
        try {
            const response = await Axios.post<IMaterialListNameRes>(
                `v1/master/getAllListByMaterialName?search=${search}&currentPage=${currentPage}&pageSize=${limit}`
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch material list"
            );
        }
    }
);



export const fetchMaterialListByHeightAndWidth = createAsyncThunk<
IMaterialListNameRes, // Changed from IMaterialCategoryRes to IMaterialNameRes
    { towerId?: Number, materialNameId?: Number, height?: Number, width?: Number },
    { state: RootState; rejectValue: string }
>(
    "materialListMaster/fetch",
    async ({ towerId, materialNameId, height, width }, { getState,rejectWithValue }) => {
        const { currentPage, limit } = getState().MaterialListMaster;
        try {
            const response = await Axios.post<IMaterialListNameRes>(
                `v1/master/getAllListByHeightAndWidth?towerId=${towerId}&materialNameId=${materialNameId}&height=${height}&width=${width}&currentPage=${currentPage}&pageSize=${limit}`
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch material list"
            );
        }
    }
);

export const fetchMaterialListByMaterial = createAsyncThunk<
IMaterialListNameRes, // Changed from IMaterialCategoryRes to IMaterialNameRes
    { towerId?: Number, height?: Number, width?: Number, materialNameId?: Number, idSequence?: Number },
    { state: RootState; rejectValue: string }
>(
    "materialListMaster/fetch",
    async ({ towerId, height, width, materialNameId, idSequence }, { getState,rejectWithValue }) => {
        const { currentPage, limit } = getState().MaterialListMaster;
        try {
            const response = await Axios.post<IMaterialListNameRes>(
                `v1/master/getAllListByMaterial?towerId=${towerId}&height=${height}&width=${width}&materialNameId=${materialNameId}&idSequence=${idSequence}&currentPage=${currentPage}&pageSize=${limit}`
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch material list"
            );
        }
    }
);


export const fetchMaterialListByIdSequence = createAsyncThunk<
IMaterialListNameRes, // Changed from IMaterialCategoryRes to IMaterialNameRes
    { idsequence?: string },
    { state: RootState; rejectValue: string }
>(
    "materialListMaster/fetch",
    async ({ idsequence }, { getState,rejectWithValue }) => {
        try {
            const response = await Axios.post<IMaterialListNameRes>(
                `v1/master/getAllListByIdSequence?idsequence=${idsequence}`
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch material list"
            );
        }
    }
);


export const fetchMaterialListMaster = createAsyncThunk<
IMaterialListMasterRes, // Changed from IMaterialListNameRes
    { search?: string, type?: number },
    { state: RootState; rejectValue: string }
>(
    "materialListMaster/fetch",
    async ({ search = "", type = 0 }, { rejectWithValue }) => {
        try {
            const response = await Axios.post<IMaterialListMasterRes>(
                `v1/master/getAllListMaterialName?search=${search}&type=${type}`
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch material list"
            );
        }
    }
);


const materialListMasterSlice = createSlice({
    name: 'materialListMaster',
    initialState,
    reducers: {
        setOffset: (state, action) => {
            state.offset = action.payload;
          },
          setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
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
            .addCase(fetchMaterialListMaster.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMaterialListMaster.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.materialListMaster = action.payload?.data?.listData;
                state.dataCount = action.payload?.data?.dataCount;
            })
            .addCase(fetchMaterialListMaster.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Failed to fetch material list";
            })
            .addCase(addMaterialListMaster.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addMaterialListMaster.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                //state.addMaterialMessage = action.payload.message; // Fixed typo in variable name
                // state.addMetrialMessage = action.payload.message
                state.materialListMaster = [...state.materialListMaster, action.payload.data];
                state.dataCount = state.dataCount + 1;
            })
            .addCase(addMaterialListMaster.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Failed to add material";
            })
            .addCase(getAllMaterialListMaster.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllMaterialListMaster.fulfilled, (state, action: PayloadAction<IMaterialListMasterRes>) => {
                state.isLoading = false;
                state.error = null;
                state.materialListMaster = action.payload.data.listData;
                state.dataCount = action.payload.data.dataCount;
            })  
            .addCase(getAllMaterialListMaster.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(updateMaterialListMaster.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateMaterialListMaster.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.materialListMaster = state.materialListMaster?.map(item => item.materialListId === action.payload.data.materialListId ? action.payload.data : item);
                state.dataCount = state.dataCount;
                // state.addMetrialMessage = action.payload.message
            })
            .addCase(updateMaterialListMaster.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Failed to update material";
            })
            .addCase(updateStatusMaterialList.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateStatusMaterialList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                // state.addMetrialMessage = action.payload.message
            })
            .addCase(updateStatusMaterialList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Failed to update status material";
            })
    }
});

export const { setOffset, setCurrentPage, setLimit, setSortField, setSortOrder, setSearchInput } = materialListMasterSlice.actions;
export default materialListMasterSlice.reducer;