import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {  ISiteReq, ISiteRes, ISiteResponse, ITowerManagement, ITowerManagementRes,ISiteManagerRes,ISiteManager, ISiteAPIPayload, ICommonListPayloadDto } from '../types/type';
import { RootState } from '../store/store';
// import { ISite } from '../types/type';
import Axios from '../axios-config/axiosInstance.ts';


interface SiteManagementState {
  sites: ISiteRes[];
  loading: boolean;
  error: string | null;
  towers: ITowerManagement[];
  siteManagers: ISiteManager[];
  siteSelect: {
    label: string;
    value: number;
  }[];
  getSitebyIdvalue: any;
  offset: number;
  limit: number;
  sortField: string;
  sortOrder: number;
  searchInput: string;
  dataCount: number;
  getIUserByIdValue:any
  
}

const initialState: SiteManagementState = {
  sites: [],
  siteSelect: [],
  loading: false,
  error: null,
  towers: [], 
  siteManagers: [],
  getSitebyIdvalue: [],
  offset: 0,
  limit: 10,
  sortField: 'createdOn',
  sortOrder: 1,
  searchInput: '',
  dataCount: 0,
  getIUserByIdValue:[]
};


// Create async thunks for API calls
export const createSite = createAsyncThunk
<
ISiteReq, 
ISiteAPIPayload, 
{ rejectValue: string }
>
(
  'siteManagement/createSite',
  async ( values,{ rejectWithValue }) => {
    try {
      const response = await Axios.post<ISiteReq>('v1/management/createSite', values);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);




export const getAllSites = createAsyncThunk<ISiteResponse,ICommonListPayloadDto,{ rejectValue: string }>(
  'siteManagement/getAllSites',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await Axios.post<ISiteResponse>('v1/management/getAllSites', payload);
      if (!response.data.success) {
        return rejectWithValue(response.data.message);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sites');
    }
  }
);


// upadte site
export const updateSite = createAsyncThunk
< ISiteRes, //resposne
Partial<ISiteReq> &{ id:number},//request
{ rejectValue: string }>
(
  'siteManagement/updateSite',
  async (value, { rejectWithValue }) => {
    try {
      const response = await Axios.put<ISiteRes>(`v1/management/updateSite/${value.id}`, value);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const fetchTowers = createAsyncThunk<
  ITowerManagementRes,  
  { siteId: number },
  { state: RootState; rejectValue: string }
>("tower/fetchAllTowers", async ({ siteId }, { rejectWithValue }) => {
  try {
    const response = await Axios.post<ITowerManagementRes>(
      "/v1/master/getAllTowersBySiteId",
      { siteId }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const updateStatus = createAsyncThunk<ISiteReq, { id: number; isActive: boolean }, { rejectValue: string }>(
  "siteManagement/updateStatus",
  async ({ id, isActive }, { rejectWithValue }) => {
      try {
          const response = await Axios.put<ISiteReq>(`v1/management/updateStatus/${id}`, { isActive });
          return response.data;
      } catch (error: any) {
          return rejectWithValue(error.response?.data?.message || "Failed to update priority status");
      }
  }
);

export const getSitebyId = createAsyncThunk<ISiteResponse, { id: number }, { rejectValue: string }>(
  "siteManagement/getSitebyId",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await Axios.get<ISiteResponse>(`v1/management/getSiteById/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateSitebyId = createAsyncThunk<ISiteRes, Partial<ISiteReq> &{ id:number}, { rejectValue: string }>(
  "siteManagement/updateSitebyId",
  async (values, { rejectWithValue }) => {
    try {
      const response = await Axios.put<ISiteRes>(`v1/management/updateSite/${values.id}`, values);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } 
  }
);


export const getIUserById = createAsyncThunk<ISiteResponse, { id: number }, { rejectValue: string }>(
  'user/getUserDetails',
  async (data , { rejectWithValue }) => {
    try {
      const response = await Axios.get<ISiteResponse>(`v1/user/getUserDetails/${data.id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch site by ID");
    }
  }
);

export const updateUserData = createAsyncThunk<ISiteReq, { siteId: number; values: any }, { rejectValue: string }>(
  "siteManagement/updateStatusSite",
  async ({ siteId, values }, { rejectWithValue }) => {
      try {
          const response = await Axios.put<ISiteReq>(`v1/management/updateStatusSite/${siteId}`, values);
          return response.data;
      } catch (error: any) {
          return rejectWithValue(error.response?.data?.message || "Failed to update priority status");
      }
  }
);




const siteManagementSlice = createSlice({
  name: 'siteManagement',
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
      // Create Site
      .addCase(createSite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSite.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createSite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get All Sites
      .addCase(getAllSites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSites.fulfilled, (state, action: PayloadAction<ISiteResponse>) => {
        state.loading = false;
        state.sites = action.payload.data.listData || [];
        state.dataCount = action.payload.data.dataCount;
      })
      .addCase(getAllSites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTowers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTowers.fulfilled, (state, action) => {
        state.loading = false;
        state.towers = action.payload.data;
      })
      .addCase(fetchTowers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSite.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateSite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getIUserById.pending, (state, action) => {
        state.loading = true;
        
      })
      .addCase(getIUserById.fulfilled, (state, action) => {
        state.getIUserByIdValue = action.payload.data;

        state.loading = false;
        
      })
      .addCase(getIUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        
      })
      .addCase(updateSitebyId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSitebyId.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateSitebyId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })  
      .addCase(getSitebyId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSitebyId.fulfilled, (state, action) => {
        state.loading = false;
        state.getSitebyIdvalue = action.payload.data;
      })
      .addCase(getSitebyId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserData.fulfilled, (state) => {
        state.loading = false;
        state.sites = state.sites;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      
  },
});

export const { setOffset, setLimit, setSortField, setSortOrder, setSearchInput } = siteManagementSlice.actions;
export default siteManagementSlice.reducer; 