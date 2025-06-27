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
















const DashboardSlices = createSlice({
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
      
      
  },
});

export const { setOffset, setLimit, setSortField, setSortOrder, setSearchInput } = DashboardSlices.actions;
export default DashboardSlices.reducer; 