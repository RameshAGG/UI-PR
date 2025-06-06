import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Axios from '../axios-config/axiosInstance.ts';

// Define types for the dashboard data
interface MivanStockItem {
  name: string;
  inuse: number;
  godown: number;
  [key: string]: string | number;  // Keep this for StackedBarChart compatibility
}

interface stats {
  label: string;
  value: any;
}

interface DashboardState {
  stateDataIndiaMap: { state: string; value: number }[];
  mivanStockAvailability: MivanStockItem[];
  mivanStockAvailabilitySiteData: MivanStockItem[];
  chartRegionData: { name: string; value: number }[];
  loading: boolean;
  siteLoading: boolean;
  stateStockLoading: boolean;
  siteStockLoading: boolean;
  loadingRunningMeters: boolean;
  error: string | null;
  allState: { name: string; value: string }[];
  allSitesByStateData: Array<{ id: number; name: string; }>;
  mivanStockAvailabilityMaterial: Array<{
    name: string;
    Panel: number;
    "Special Panel": number;
  }>;
  mivanStockAvailabilitySiteDataPanel: Array<{
    name: string;
    Panel: number;
    "Special Panel": number;
  }>;

  mivanStockSiteRunningMeter: Array<{
    name: string;
    "External Corner": number;
  }>;
  mivanStockSiteNos: Array<{
    name: string;
    "Nos": number;
  }>;

  stats: stats[];
  accessoriesListData: Array<{
    name: string;
    requested: number;
    inTransit: number;
    verified: number;
    delivered: number;
    available: number;
  }>;

  materialsListData: Array<{
    name: string;
    requiredQuantity:number
  }>;

  vendorListdata: Array<{
    vendorName: string;
    allocatedQuantity: number | string;
    returnedStock: number | string;
  }>;
  propsAndBracketsData: Array<{
    name: string;
    allocated_qty: number;
    godown_qty: number;
    total_qty: number;
  }>;
  mivanMaterialData: Array<{
    name: string;
    delivered: number;
  }>;
  mivanMaterialDataRunningMeters: Array<{
    name: string;
    delivered: number;
  }>;
  mivanMaterialDataRunningMeterData: Array<{
    name: string;
    "godown": number;
    "inuse": number;
  }>;
  loadingHeatMap: boolean;
  heatmapData: Array<{
    name: string;
    total: number;
    // siteData: []
  }>;
  sankeyDiagramData: any;
  loadingSankey: boolean;
  mivanMaterialDataNosEg: Array<{
    name: string;
    "godown": number;
    "inuse": number;
  }>;
  allSites: any;
  loadingSite: boolean;
}

// Initial state
const initialState: DashboardState = {
  stateDataIndiaMap: [],
  mivanStockAvailability: [],
  mivanStockAvailabilitySiteData: [],
  chartRegionData: [],
  loading: false,
  siteLoading: false,
  stateStockLoading: false,
  siteStockLoading: false,
  loadingRunningMeters: false,
  error: null,
  allState: [],
  allSitesByStateData: [],
  mivanStockAvailabilityMaterial: [],
  mivanStockAvailabilitySiteDataPanel: [],
  mivanStockSiteRunningMeter: [],
  mivanStockSiteNos: [],

  stats: [],
  accessoriesListData: [],
  materialsListData:[],
  vendorListdata:[],
  propsAndBracketsData: [],
  mivanMaterialData: [],
  mivanMaterialDataRunningMeterData: [],
  mivanMaterialDataNosEg: [],
  loadingHeatMap: false,
  heatmapData: [],
  mivanMaterialDataRunningMeters:[],
  sankeyDiagramData: [],
  loadingSankey: false,
  allSites: [],
  loadingSite: false
};

type StateData = { state: string; value: number }[];

interface ApiResponse {
  data: { state: string; value: number }[];
}


// Add this sorting function
const sortByConsistentOrder = (data: any[], keyField: 'state' | 'name') => {
  const orderPriority: { [key: string]: number } = {
    'Kolkata': 0,
    'WEST BENGAL': 0,
    'Bangalore': 1,
    'KARNATAKA': 1,
    'Chennai': 2,
    'TAMIL NADU': 2,
    // Add more entries as needed
  };

  return [...data].sort((a, b) => {
    const valueA = orderPriority[a[keyField]] ?? Number.MAX_VALUE;
    const valueB = orderPriority[b[keyField]] ?? Number.MAX_VALUE;
    return valueA - valueB;
  });
};

// Create async thunk for fetching map data
export const fetchMapData = createAsyncThunk<StateData>(
  'dashboard/fetchMapData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios.get<ApiResponse>(`v1/dashboard/getmapdata`);
      if (Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return rejectWithValue('Invalid data format received');
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch map data');
    }
  }
);

// Update the getMivanStock thunk
interface MivanStockApiResponse {
  getMiVanStockData: Array<{
    name: string; // State name like "Karnataka", "Tamil Nadu", "West Bengal"
    inuse: number; // Number of panels in use
    godown: number; // Number of panels in godown
  }>;
  // panelCountsByState: Array<{
  //   name: string; // State name
  //   Panel: number; // Regular panel count
  //   "Special Panel": number; // Special panel count
  // }>;
}

export const getMivanStock = createAsyncThunk<MivanStockApiResponse>(
  'dashboard/getMivanStock',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios.get<{ data: MivanStockApiResponse }>(`v1/dashboard/getmivanstock`);
      // if (response.data &&
      //   Array.isArray(response.data.data.getMiVanStockData) 
      //   // &&
      //   // Array.isArray(response.data.data.panelCountsByState)
      // )
      //  {
      return response.data.data;
      // }
      return rejectWithValue('Invalid data format received');
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch Mivan stock data');
    }
  }
);
interface MivanStockSiteApiResponse {
  data: {
    getMiVanStockSiteData: Array<{
      name: string;
      inuse: number;
      godown: number;
    }>;
    panelCountsBySite: Array<{
      name: string;
      Panel: number;
      "Special Panel": number;
    }>;
    runningMeter: Array<{
      name: string;
      "inuse": number;
      "godown": number;
    }>;
    nos: Array<{
      name: string;
      "inuse": number;
      "godown": number;
    }>;
  };
}

export const getMivanStockSite = createAsyncThunk<MivanStockSiteApiResponse['data']>(
  'dashboard/getMivanStockSite',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios.get<MivanStockSiteApiResponse>(`v1/dashboard/getmivanstocksite`);
      if (response.data &&
        Array.isArray(response.data.data.getMiVanStockSiteData) &&
        Array.isArray(response.data.data.panelCountsBySite) &&
        Array.isArray(response.data.data.runningMeter) &&
        Array.isArray(response.data.data.nos) 

      ) {
        return response.data.data;
      }
      return rejectWithValue('Invalid data format received');
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch Mivan stock site data');
    }
  }
);

interface GetAllStateResponse {
  data: {
    name: string;
    value: string;
  }[];
}

export const getAllState = createAsyncThunk<{ name: string; value: string }[]>(
  'dashboard/getAllState',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios.get<GetAllStateResponse>(`v1/dashboard/getallstate`);
      if (Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return rejectWithValue('Invalid data format received');
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch all states data');
    }
  }
);

interface GetAllSiteByStateIdResponse {
  data: Array<{
    id: number;
    name: string;
  }>;
}

export const getAllSiteByStateId = createAsyncThunk<GetAllSiteByStateIdResponse['data'], string>(
  'dashboard/getAllSiteByStateId',
  async (stateId, { rejectWithValue }) => {
    try {
      const response = await Axios.get<GetAllSiteByStateIdResponse>(
        `v1/dashboard/getallsitebystateid`, {
        params: { stateId }
      }
      );
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return rejectWithValue('Invalid data format received');
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch sites data');
    }
  }
);

interface ChartRegionMaterialResponse {
  data: {
    name: string;
    value: number;
  }[];
}

export const chartRegionMatirial = createAsyncThunk<ChartRegionMaterialResponse['data']>(
  'dashboard/chartRegionMaterial',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios.get<ChartRegionMaterialResponse>(`v1/dashboard/chartregionmaterial`);
      if (Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return rejectWithValue('Invalid data format received');
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch chart region material data');
    }
  }
);

interface GetMivanStockByStateIdResponse {
  data: {
    getMiVanStockSiteData: Array<{
      name: string;
      inuse: number;
      godown: number;
    }>;
    panelCountsBySite: Array<{
      name: string;
      Panel: number;
      "Special Panel": number;
    }>;
    runningMeter: Array<{
      name: string;
      "External Corner": number;
      "Elevation Grooves": number;
    }>;
    nos: Array<{
      name: string;
      "Nos": number;
 
    }>;
  };
}

export const getMivanStockByStateId = createAsyncThunk<GetMivanStockByStateIdResponse['data'], string>(
  'dashboard/getMivanStockByStateId',
  async (stateId, { rejectWithValue }) => {
    try {
      const response = await Axios.get<GetMivanStockByStateIdResponse>(
        `v1/dashboard/getmivanstockbystateid`, {
        params: {
          stateId
        }
      }
      );
      if (response.data &&
        Array.isArray(response.data.data.getMiVanStockSiteData) &&
        Array.isArray(response.data.data.panelCountsBySite) &&
        Array.isArray(response.data.data.runningMeter)
      ) {
        return response.data.data;
      }
      return rejectWithValue('Invalid data format received');
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch mivan stock data');
    }
  }
);


interface GetMivanStockBySiteIdResponse {
  data: {
    getMiVanStockSiteData: Array<{
      name: string;
      inuse: number;
      godown: number;
    }>;
    panelCountsBySite: Array<{
      name: string;
      Panel: number;
      "Special Panel": number;
    }>;
    runningMeter: Array<{
      name: string;
      "External Corner": number;
      "Elevation Grooves": number;
    }>;
    nos: Array<{
      name: string;
      "Nos": number;
    }>;
  };
}

export const getMivanStockBySiteId = createAsyncThunk<GetMivanStockBySiteIdResponse['data'], { siteId: number, selectedKey1: string }>(
  'dashboard/getMivanStockBySiteId',
  async ({ siteId, selectedKey1 }, { rejectWithValue }) => {
    try {
      const response = await Axios.get<GetMivanStockBySiteIdResponse>(
        `v1/dashboard/getmivanstockbysiteid`, {
        params: {
          siteId,
          selectedKey1
        }
      }
      );
      if (response.data &&
        Array.isArray(response.data.data.getMiVanStockSiteData) &&
        Array.isArray(response.data.data.panelCountsBySite) &&
        Array.isArray(response.data.data.runningMeter)
      ) {
        return response.data.data;
      }
      return rejectWithValue('Invalid data format received');
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch mivan stock data');
    }
  }
);

interface GetTotalMivanCountResponse {
  data: {
    label: string;
    value: string;
  }[];
}

export const getTotalMivanCount = createAsyncThunk<GetTotalMivanCountResponse['data']>(
  'dashboard/getTotalMivanCount',
  async (siteId, { rejectWithValue }) => {
    try {
      const response = await Axios.get<GetTotalMivanCountResponse>(
        `v1/dashboard/gettotalmivancount`,{ params: { siteId }}
      );
      if (response.data.data) {
        return response.data.data;
      }
      return rejectWithValue('Invalid data format received');
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch dashboard stats');
    }
  }
);


interface GetAccessoriesListDataResponse {
  data: {
    name: string;
    requested: number;
    inTransit: number;
    verified: number;
    delivered: number;
    available: number;
  }[];
}

interface GetMaterialsDataResponse {
  data: {
    name: string;
    requiredQuantity:number
  }[];
}

interface GetVendorDataResponse {
  data: {
    vendorName: string;
    allocatedQuantity: number | string;
    returnedStock: number | string;
  }[];
}

export const getAccessoriesListData = createAsyncThunk<GetAccessoriesListDataResponse['data']>(
  'dashboard/getAccessoriesListData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios.get<GetAccessoriesListDataResponse>(
        `v1/dashboard/getaccessorieslistdata`
      );
      if (response.data.data) {
        return response.data.data;
      }
      return rejectWithValue('Invalid data format received');
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch accessories list data');
    }
  }
);

export const getMaterialsData = createAsyncThunk<GetMaterialsDataResponse['data']>(
  'dashboard/getMaterialsData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios.get<GetMaterialsDataResponse>(
        `v1/dashboard/materialDetails`
      );
      if (response.data.data) {
        return response.data.data;
      }
      return rejectWithValue('Invalid data format received');
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch accessories list data');
    }
  }
);

export const getVendorData = createAsyncThunk<GetVendorDataResponse['data']>(
  'dashboard/getVendorData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios.get<GetVendorDataResponse>(
        `v1/dashboard/vendorDetails`
      );
      if (response.data.data) {
        return response.data.data;
      }
      return rejectWithValue('Invalid data format received');
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch accessories list data');
    }
  }
);


interface GetPropsandBracketsResponse {
  data: {
    name: string;
    allocated_qty: number;
    godown_qty: number;
    total_qty: number;
  }[];
}

export const getPropsandBrackets = createAsyncThunk<GetPropsandBracketsResponse['data']>(
  'dashboard/getPropsandBrackets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios.get<GetPropsandBracketsResponse>(
        `v1/dashboard/getpropsandbrackets`
      );
      if (response.data.data) {
        return response.data.data;
      }
      return rejectWithValue('Invalid data format received');
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch props and brackets data');
    }
  }
);


interface GetMivanMaterialsDataResponse {
  data: {
    name: string;
    delivered: number;
  }[];
}

export const getMivanMaterialsData = createAsyncThunk<GetMivanMaterialsDataResponse['data']>(
  'dashboard/getMivanMaterialsData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios.get<GetMivanMaterialsDataResponse>(
        `v1/dashboard/getmivanmaterialsdata`
      );
      if (response.data.data) {
        return response.data.data;
      }
      return rejectWithValue('Invalid data format received');
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch mivan materials data');
    }
  }
);


export const getMivanMaterialsDataRunningMeters = createAsyncThunk<GetMivanMaterialsDataResponse['data']>(
  'dashboard/getMivanMaterialsDataRunningMeters',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios.get<GetMivanMaterialsDataResponse>(
        `v1/dashboard/getMiVanMaterialsDataRunningMeters`
      );
      if (response.data.data) {
        return response.data.data;
      }
      return rejectWithValue('Invalid data format received');
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch mivan materials data');
    }
  }
);


interface GetMivanMaterialsRunningMetersResponse {
  data: Array<{
    name: string;
    "inuse": number;
    "godown": number;
  }>;
}

export const getMivanMaterialsRunningMeters = createAsyncThunk<GetMivanMaterialsRunningMetersResponse['data']>(
  'dashboard/getMivanMaterialsRunningMeters',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios.get<GetMivanMaterialsRunningMetersResponse>(
        `v1/dashboard/getmivanmaterialsrunningmeters`
      );
      if (response.data.data) {
        return response.data.data;
      }
      return rejectWithValue('Invalid data format received');
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch mivan materials running meters data');
    }
  }
);


export const getMivanMaterialsNosEg = createAsyncThunk<GetMivanMaterialsRunningMetersResponse['data']>(
  'dashboard/getMivanMaterialsNosEg',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios.get<GetMivanMaterialsRunningMetersResponse>(
        `v1/dashboard/getmivanmaterialsNosEg`
      );
      if (response.data.data) {
        return response.data.data;
      }
      return rejectWithValue('Invalid data format received');
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch mivan materials running meters data');
    }
  }
);


interface GetHeatMapDataResponse {
  data: any;
} 

export const getHeatMapData = createAsyncThunk<GetHeatMapDataResponse['data']>(
  'dashboard/getHeatMapData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios.get<GetHeatMapDataResponse>(
        `v1/dashboard/getallheadmap`
      );
      if (response.data.data) {
        return response.data.data;
      }
      return rejectWithValue('Invalid data format received');
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch heat map data');
    }
  }
);


interface GetSankeyDiagramDataResponse {
  data: any;
}

export const getSankeyDiagramData = createAsyncThunk<GetSankeyDiagramDataResponse['data']>(
  'dashboard/getSankeyDiagramData',
  async (id, { rejectWithValue }) => {
    try {
      const response = await Axios.get<GetSankeyDiagramDataResponse>(
        `v1/dashboard/getMaterialMovementDetails/${id}`
      );
      if (response.data.data) {
        return response.data.data;
      }
      return rejectWithValue('Invalid data format received');
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch Sankey diagram data');
    }
  }
);

interface GetAllSiteDataResponse {
  data: any;
}

export const getAllSite = createAsyncThunk<GetAllSiteDataResponse['data']>(
  'dashboard/getAllSite',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios.get<GetAllSiteDataResponse>(
        `v1/dashboard/getAllSite`
      );
      if (response.data.data) {
        return response.data.data;
      }
      return rejectWithValue('Invalid data format received');
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch site data');
    }
  }
);



// Create the dashboard slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMapData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMapData.fulfilled, (state, action) => {
        state.loading = false;
        state.stateDataIndiaMap = sortByConsistentOrder(action.payload, 'state');
      })
      .addCase(fetchMapData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getMivanStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMivanStock.fulfilled, (state, action) => {
        state.loading = false;
        state.mivanStockAvailability = action.payload;
        // state.mivanStockAvailabilityMaterial = action.payload.panelCountsByState;
      })
      .addCase(getMivanStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getMivanStockSite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMivanStockSite.fulfilled, (state, action) => {
        state.loading = false;
        state.mivanStockAvailabilitySiteData = action.payload.getMiVanStockSiteData;
        state.mivanStockAvailabilitySiteDataPanel = action.payload.panelCountsBySite;
        state.mivanStockSiteRunningMeter = action.payload.runningMeter;
        state.mivanStockSiteNos = action.payload.nos;
      })
      .addCase(getMivanStockSite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(chartRegionMatirial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(chartRegionMatirial.fulfilled, (state, action) => {
        state.loading = false;
        state.chartRegionData = sortByConsistentOrder(action.payload, 'name');
      })
      .addCase(chartRegionMatirial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getAllState.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllState.fulfilled, (state, action) => {
        state.loading = false;
        state.allState = action.payload;
      })
      .addCase(getAllState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getAllSiteByStateId.pending, (state) => {
        state.siteLoading = true;
        state.error = null;
      })
      .addCase(getAllSiteByStateId.fulfilled, (state, action) => {
        state.siteLoading = false;
        state.allSitesByStateData = action.payload
      })
      .addCase(getAllSiteByStateId.rejected, (state, action) => {
        state.siteLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getMivanStockByStateId.pending, (state) => {
        state.stateStockLoading = true;
        state.error = null;
      })
      .addCase(getMivanStockByStateId.fulfilled, (state, action) => {
        state.stateStockLoading = false;
        state.mivanStockAvailabilitySiteData = action.payload.getMiVanStockSiteData;
        state.mivanStockAvailabilitySiteDataPanel = action.payload.panelCountsBySite;
        state.mivanStockSiteRunningMeter = action.payload.runningMeter;
        state.mivanStockSiteNos = action.payload.nos;

      })
      .addCase(getMivanStockByStateId.rejected, (state, action) => {
        state.stateStockLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getMivanStockBySiteId.pending, (state) => {
        state.siteStockLoading = true;
        state.error = null;
      })
      .addCase(getMivanStockBySiteId.fulfilled, (state, action) => {
        state.siteStockLoading = false;
        state.mivanStockAvailabilitySiteData = action.payload.getMiVanStockSiteData;
        state.mivanStockAvailabilitySiteDataPanel = action.payload.panelCountsBySite;
        state.mivanStockSiteRunningMeter = action.payload.runningMeter;
        state.mivanStockSiteNos = action.payload.nos;

      })
      .addCase(getMivanStockBySiteId.rejected, (state, action) => {
        state.siteStockLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getTotalMivanCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTotalMivanCount.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getTotalMivanCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getAccessoriesListData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAccessoriesListData.fulfilled, (state, action) => {
        state.loading = false;
        state.accessoriesListData = action.payload;
      })
      .addCase(getAccessoriesListData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getMaterialsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMaterialsData.fulfilled, (state, action) => {
        state.loading = false;
        state.materialsListData = action.payload;
      })
      .addCase(getMaterialsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getVendorData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVendorData.fulfilled, (state, action) => {
        state.loading = false;
        state.vendorListdata = action.payload;
      })
      .addCase(getVendorData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getPropsandBrackets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPropsandBrackets.fulfilled, (state, action) => {
        state.loading = false;
        state.propsAndBracketsData = action.payload;
      })
      .addCase(getPropsandBrackets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getMivanMaterialsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMivanMaterialsData.fulfilled, (state, action) => {
        state.loading = false;
        state.mivanMaterialData = action.payload;
      })
      .addCase(getMivanMaterialsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getMivanMaterialsDataRunningMeters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMivanMaterialsDataRunningMeters.fulfilled, (state, action) => {
        state.loading = false;
        state.mivanMaterialDataRunningMeters = action.payload;
      })
      .addCase(getMivanMaterialsDataRunningMeters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getMivanMaterialsRunningMeters.pending, (state) => {
        state.loadingRunningMeters = true;
        state.error = null;
      })
      .addCase(getMivanMaterialsRunningMeters.fulfilled, (state, action) => {
        state.loadingRunningMeters = false;
        state.mivanMaterialDataRunningMeterData = action.payload;
      })
      .addCase(getMivanMaterialsRunningMeters.rejected, (state, action) => {
        state.loadingRunningMeters = false;
        state.error = action.payload as string;
      })

      .addCase(getMivanMaterialsNosEg.pending, (state) => {
        state.loadingRunningMeters = true;
        state.error = null;
      })
      .addCase(getMivanMaterialsNosEg.fulfilled, (state, action) => {
        state.loadingRunningMeters = false;
        state.mivanMaterialDataNosEg = action.payload;
      })
      .addCase(getMivanMaterialsNosEg.rejected, (state, action) => {
        state.loadingRunningMeters = false;
        state.error = action.payload as string;
      })
      
      .addCase(getHeatMapData.pending, (state) => {
        state.loadingHeatMap = true;
        state.error = null;
      })
      .addCase(getHeatMapData.fulfilled, (state, action) => {
        state.loadingHeatMap = false;
        state.heatmapData = action.payload;
      })
      .addCase(getHeatMapData.rejected, (state, action) => {
        state.loadingHeatMap = false;
        state.error = action.payload as string;
      })

      .addCase(getSankeyDiagramData.pending, (state) => {
        state.loadingSankey = true;
        state.error = null;
      })
      .addCase(getSankeyDiagramData.fulfilled, (state, action) => {
        state.loadingSankey = false;
        state.sankeyDiagramData = action.payload;
      })
      .addCase(getSankeyDiagramData.rejected, (state, action) => {
        state.loadingSankey = false;
        state.error = action.payload as string;
      })

      .addCase(getAllSite.pending, (state) => {
        state.loadingSite = true;
        state.error = null;
      })
      .addCase(getAllSite.fulfilled, (state, action) => {
        state.loadingSite = false;
        state.allSites = action.payload;
      })
      .addCase(getAllSite.rejected, (state, action) => {
        state.loadingSite = false;
        state.error = action.payload as string;
      });
      
  },
});

export default dashboardSlice.reducer; 