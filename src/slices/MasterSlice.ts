import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios";
import { IUnit, IAccessoriesNameByUnit, IAccessoriesListMasterRes, IMaterialListMasterRes, ICommonListPayloadDto, IGetVendorRes } from "../types/type";
import Axios from "../axios-config/axiosInstance.ts";
interface MasterSlice {
  isLoading: boolean;
  error: string | null;
  roleMaster:Array<any>
  siteManagerMaster: Array<{
    id: number;
    userId: number;
    managerName: string;
  }> | null;
  unitMaster: Array<{
    unitId: number;
    unitName: string;
  }> | null;

accessoriesNameMaster: Array<{
  accessoriesNameId: number;
  accessoriesName: string;
}> | null;

materialListMaster: Array<{
  id: number;
  materialtypeName: string;
}> | null;


getVendorListMaster: Array<{
  id: number;
  vendorName: string;
}> | null;
}

interface Role {
    id: number;
    name: string;
  }

  interface SiteManager {
    id: number;
    userId: number;   
    managerName: string;
  }

  

  interface ApiResponse<T> {
    message: string;
    data: T;
    success: boolean;
  }
  export const getAllRole = createAsyncThunk<ApiResponse<Role[]>, void, { rejectValue: string }>(
    "getAllRole/getAllRoles",
    async (_, { rejectWithValue }) => {
      try {
        const response = await Axios.get<ApiResponse<Role[]>>("v1/master/getAllRoles");
        if (response.data.success) {
          return response.data;
        } else {
          return rejectWithValue("Failed to fetch roles");
        }
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch roles");
      }
    }
  );

  export const getAllSiteManager = createAsyncThunk<ApiResponse<SiteManager[]>, void, { rejectValue: string }>(
    "getAllSiteManager/getAllSiteManager",
    async (_, { rejectWithValue }) => {
      try {
        const response = await Axios.get<ApiResponse<SiteManager[]>>("v1/management/getAllSiteManagers");
          if (response.data.success) {
          return response.data;
        } else {
          return rejectWithValue("Failed to fetch roles");
        }
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch roles");
      }
    }
  );

  export const getAllUnits = createAsyncThunk<ApiResponse<IUnit[]>, void, { rejectValue: string }>(
    "getAllUnits/getAllUnits",
    async (_, { rejectWithValue }) => {
      try {
        const response = await Axios.get<ApiResponse<IUnit[]>>("v1/master/getAllUnits");  
        if (response.data.success) {
          return response.data;
        } else {
          return rejectWithValue("Failed to fetch roles");
        }
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch roles");
      }
    }
  );

  export const getAllAccessoriesNameByUnit = createAsyncThunk<ApiResponse<IAccessoriesNameByUnit[]>, void, { rejectValue: string }>(
    "getAllAccessoriesNameByUnit/",
    async (_, { rejectWithValue }) => {
      try {
        const response = await Axios.get<ApiResponse<IAccessoriesNameByUnit[]>>("v1/master/getAllAccessoriesNameByUnit");
        if (response.data.success) {
          return response.data;
        } else {
          return rejectWithValue("Failed to fetch accessories name by unit");
        }
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch accessories name by unit"); 
      }
    }
  );


  export const getSearchAccessoriesListMaster = createAsyncThunk<IAccessoriesListMasterRes, { searchInput: string }, { rejectValue: string }>(
    "accessoryMaster/getAllAccessoriesListMaster",
    async ({ searchInput }, { rejectWithValue }) => {
      try {
        const response = await Axios.get<IAccessoriesListMasterRes>(`v1/master/getAllAccessoriesListUnit?searchInput=${searchInput}`);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to get accessories list");
      }
    }
  );

  export const getMaterialListMaster = createAsyncThunk<IMaterialListMasterRes, ICommonListPayloadDto, { rejectValue: string }>(
    "materialListMaster/getMaterialListMaster",
    async (payload, { rejectWithValue }) => {
      try {
        const response = await Axios.get<IMaterialListMasterRes>("v1/master/getAllMaterialTypeList", { params: payload });
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to get material list master");
      }
    }
  );


  export const getVendorName = createAsyncThunk<IGetVendorRes, { rejectValue: string }>(
    "vendorManagement/getVendorName",
    async (_,{ rejectWithValue }) => {
      try {
        const response = await Axios.get<IGetVendorRes>("v1/master/getVendorName");
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to get vendor list master");
      }
    }
  );
  

  const initialState: MasterSlice = {
    isLoading: false,
    error: null,
    roleMaster: [] as Role[],
    siteManagerMaster: [],
    unitMaster: [],
    accessoriesNameMaster: [],
    materialListMaster: [],
    getVendorListMaster:[]
  }

  const MasterSlice = createSlice({
    name: "Master",
    initialState,
    reducers: {
      
    }, 

    extraReducers: (builder) => {
      builder
        .addCase(getAllRole.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })

        .addCase(getAllRole.fulfilled, (state, action: PayloadAction<ApiResponse<Role[]>>) => {
          state.isLoading = false;
          state.roleMaster = action.payload.data ?? [];
        })

        .addCase(getAllRole.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
        })

        .addCase(getAllSiteManager.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })

        .addCase(getAllSiteManager.fulfilled, (state, action: PayloadAction<ApiResponse<SiteManager[]>>) => {
          state.isLoading = false;
          state.siteManagerMaster = action.payload.data ?? [];
        })

        .addCase(getAllSiteManager.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
        })

        .addCase(getAllUnits.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })

        .addCase(getAllUnits.fulfilled, (state, action: PayloadAction<ApiResponse<IUnit[]>>) => {
          state.isLoading = false;
          state.unitMaster = action.payload.data ?? [];
        })

        .addCase(getAllUnits.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
        })

        .addCase(getAllAccessoriesNameByUnit.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })

        .addCase(getAllAccessoriesNameByUnit.fulfilled, (state, action: PayloadAction<ApiResponse<IAccessoriesNameByUnit[]>>) => {
          state.isLoading = false;
          state.accessoriesNameMaster = action.payload.data || [];
        })

        .addCase(getAllAccessoriesNameByUnit.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
        })

        .addCase(getSearchAccessoriesListMaster.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })

      .addCase(getSearchAccessoriesListMaster.fulfilled, (state, action: PayloadAction<IAccessoriesListMasterRes>) => {
        state.isLoading = false;
        state.accessoriesNameMaster = action.payload.data || [];
      })

      .addCase(getSearchAccessoriesListMaster.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(getMaterialListMaster.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(getMaterialListMaster.fulfilled, (state, action: PayloadAction<IMaterialListMasterRes>) => {
        state.isLoading = false;
        state.materialListMaster = action.payload.data || [];
      })

      .addCase(getMaterialListMaster.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })


      .addCase(getVendorName.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(getVendorName.fulfilled, (state, action: PayloadAction<IGetVendorRes>) => {
        state.isLoading = false;
        state.getVendorListMaster = action.payload.data || [];
      })

      .addCase(getVendorName.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
    },
  })

export default MasterSlice.reducer;
