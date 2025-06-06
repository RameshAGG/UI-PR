import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  ITowerManagement,
  IAllSitesRes,
  ITowerManagementRes,
  ISitesTower,
  ICreateTowerReq,
  IAddOrUpdateTower,
  IMaterialRequestSummaryRes,
  ITowerManagementReqDto,
  ITowerListRes,
  ICommonAPIResponse,
  ICommonListPayloadDto,
} from "../types/type";
import axios from "axios";
import { RootState } from "../store/store";
import Axios from "../axios-config/axiosInstance.ts";

interface TowerState {
  sites: ISitesTower[];
  towers: ITowerManagement[];
  towersList: ITowerManagement[];

  towerSelect: {
    label: string;
    value: number;
  }[];
  towerSelectList: {
    label: string;
    value: number;
  }[];
  loading: boolean;
  error: string | null;
  offset: number;
  limit: number;
  sortField: string;
  sortOrder: number | null;
  searchInput: string;
  dataCount: number;
  sitecount: number;
}

const initialState: TowerState = {
  sites: [],
  towers: [],
  towerSelect: [],
  towersList: [],
  towerSelectList: [],
  loading: false,
  error: null,
  offset: 0,
  limit: 10,
  sortField: "",
  sortOrder: null,
  searchInput: "",
  dataCount: 0,
  sitecount: 0,
};

// ** Fetch all sites **
export const fetchAllSites = createAsyncThunk<
  IAllSitesRes,
  ICommonListPayloadDto,
  { rejectValue: string }
>("tower/fetchAllSites", 
  async (payload, { rejectWithValue }) => {
  try {
    const response = await Axios.post<IAllSitesRes > ("/v1/master/getAllSites",payload
    );
    if(response.data.success){
      return response.data;
    }else{
      return rejectWithValue(response.data.message);
    }
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch sites"
    );
  }
});


export const getAllSitesForDropdown = createAsyncThunk<
  IAllSitesRes,
  ICommonListPayloadDto,
  { rejectValue: string }
>("tower/getAllSitesForDropdown", 
  async (payload, { rejectWithValue }) => {
  try {
    const response = await Axios.get<IAllSitesRes > ("/v1/master/getAllSitesForDropdown",payload
    );
    if(response.data.success){
      return response.data;
    }else{
      return rejectWithValue(response.data.message);
    }
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch sites"
    );
  }
});



// ** Fetch all towers based on site ID **
export const fetchTowers = createAsyncThunk<
  ITowerManagementRes,
  { siteId: number ,search?: string},
  { state: RootState; rejectValue: string }
>("tower/fetchAllTowers", async ({ siteId,search="" }, { rejectWithValue }) => {
  try {
    const response = await Axios.post<ITowerManagementRes>(
      "/v1/master/getAllTowersBySiteId",
      { siteId ,search}
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch towers"
    );
  }
});

export const fetchTowersById = createAsyncThunk<
ITowerListRes,
  ITowerManagementReqDto,
  { rejectValue: string }
>("tower/fetchTowersById", async (payload , { rejectWithValue }) => {
  try {
    const response = await Axios.post<ITowerListRes>(
      `/v1/master/getAllTowersListById`,
     payload
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch towers"
    );
  }
});
// ** create new tower **

export const createTower = createAsyncThunk<
IAddOrUpdateTower,
ICreateTowerReq,
{ rejectValue: string }>(
    "tower/create",async(tower,{rejectWithValue})=>{
        try{
            const response = await Axios.post<IAddOrUpdateTower>(
              "v1/master/createTower",
              tower
            );
            return response.data;
        }
        catch (error: any) {
            return rejectWithValue(
              error.response?.data?.message || "Failed to add tower"
            );
          }
 });

        export const updateTower = createAsyncThunk<
        IAddOrUpdateTower,
        Partial<ITowerManagement> & { id: number },
        { rejectValue: string }
      >("tower/update", async (tower, { rejectWithValue }) => {
        try {
      
          const response = await Axios.put<IAddOrUpdateTower>(
            `/v1/master/updateTower/${tower.id}`, 
            tower
          );
          
          return response.data;
        } catch (error: any) {
          return rejectWithValue(
            error.response?.data?.message || "Failed to update tower"
          );
        }
      });
      




// ** Tower Slice **
const towerSlice = createSlice({
  name: "tower",
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
      // ** Fetch All Sites **
      .addCase(fetchAllSites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSites.fulfilled, (state, action) => {
        state.sites = action.payload.data.data;
        state.sitecount = action.payload.data.sitecount;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchAllSites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch sites";
      })


      .addCase(getAllSitesForDropdown.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSitesForDropdown.fulfilled, (state, action) => {
        state.sites = action.payload.data.data;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllSitesForDropdown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch sites";
      })

      // ** Fetch Towers by Site ID **
      .addCase(fetchTowers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTowers.fulfilled, (state, action) => {
        state.towers = action.payload.data; 
        state.towerSelect = state.towers?.map(element => ({
          value: element.id,
          label: element.towerName
        }));
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchTowers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch towers";
      })

      .addCase(fetchTowersById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTowersById.fulfilled, (state, action) => {
        state.towersList = action.payload.data.listData; 
        state.towerSelectList = state.towersList?.map(element => ({
          value: element.id,
          label: element.towerName
        }));
        state.dataCount = action.payload.data.dataCount;


        state.loading = false;
        state.error = null;
      })
      .addCase(fetchTowersById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch towers";
      })

      .addCase(createTower.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTower.fulfilled, (state, action) => {
        state.towers.push(action.payload.data); 
        state.loading = false;
        state.error = null;
      })
      .addCase(createTower.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create tower";
      })
      .addCase(updateTower.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTower.fulfilled, (state, action) => {
        const index = state.towers.findIndex(tower => tower.id === action.payload.data.id);
        if (index !== -1) {
          state.towers[index] = action.payload.data;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(updateTower.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update tower";
      });
      
  },
});
export const { setOffset, setLimit, setSortField, setSortOrder, setSearchInput } = towerSlice.actions;
export default towerSlice.reducer;
