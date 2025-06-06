import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {    IMaterialRequesRequirementstRes, ImaterialRequestRequirementscommonRes, IMaterialRequestRequirementsReq, IMaterialRequestSummary, IMaterialRequestSummaryRes, IDropDownMaterialNames, IDropDownMaterialNamesRes, IEditMaterialRequirement, IEditMaterialRequirementRes, MaterialReqStatusSummaryRes, MaterialReqStatusSummary, IMaterialRequirementResCommon, IMaterialRequirementRes, IinTransitRequirements, IinTransitRequirementsCommon, IHeight, IWidth, IHeightRes, IWidthRes, IspecialPanelAreasReq, ISpecialPanelAreasCommonRes, IspecialPanelAreasRes, IExternalCornerRunningMeterscommonRes, IExternalCornerRunningMetersReq, IExternalCornerRunningMetersRes, ICommonListPayloadDto, IVendorResponse, IReceivedRequirements, IReceivedRequirementsCommon } from "../types/type";
import { RootState } from "../store/store";
import { ApiResponse } from "./PriorityMasterSlice";
import Axios from "../axios-config/axiosInstance.ts";
import { MaterialRequestStatus } from "../types/type";

import axios from "axios";
interface MaterialRequestState{
  materialRequestRequirements: IMaterialRequesRequirementstRes[];
  materialRequestSummary: IMaterialRequestSummary | null;
  height: IHeight[]; 
  width:IWidth[];
  area:IspecialPanelAreasRes[];
  runningMeters:IExternalCornerRunningMetersRes[];
  panel: IDropDownMaterialNames[]; 
  specialPanel:IDropDownMaterialNames[];
  externalCorner: IDropDownMaterialNames[];
  elevationGrooves: IDropDownMaterialNames[];
  accessories:IDropDownMaterialNames[];
  materialReqStatusSummary :MaterialReqStatusSummary | null;
  requirements:IMaterialRequirementRes[];
  inTransitRequirements:IinTransitRequirements[];
  receivedRequirements:IReceivedRequirements[];
  materialRequestStatus: MaterialRequestStatus | null;
  offset: number;
  limit: number;
  dataCount:number;
  searchInput:string;
   loading:boolean;
  error: string | null;

}

const initialState:MaterialRequestState={

  materialRequestRequirements:[],
  materialRequestSummary:null,
  height: [],
  width:[],
  area:[],
  runningMeters:[],
  panel: [],
  specialPanel:[],
  externalCorner: [],
  elevationGrooves: [],
  accessories:[],
  materialReqStatusSummary:null,
  requirements:[],
  inTransitRequirements:[],
  receivedRequirements:[],
  materialRequestStatus: null,
  offset:0,
  limit:10,
  searchInput:"",
  dataCount:0,
  loading:false,
  error:null,


}

//summary cards
export const fetchAllMaterialRequestSummary = createAsyncThunk<
  IMaterialRequestSummaryRes,
  void,
  { rejectValue: string }
>(
  "MaterialRequestSummary/get",
  async (_, { rejectWithValue }) => {
    try {

      const response = await Axios.get<IMaterialRequestSummaryRes>(
        "v1/material-request/getMaterialRequestSummary"
      );
      return response.data; 
    } catch (error: any) { 
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);




// get all material  request and requirements

export const fetchAllMaterialRequestRequirements = createAsyncThunk<
ImaterialRequestRequirementscommonRes,
ICommonListPayloadDto,
  { rejectValue: string }
>(
  "MaterialRequest/get",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await Axios.post<ImaterialRequestRequirementscommonRes>(
        `v1/material-request/getAllMaterialRequestRequirements`,payload,
       
      );

      return response.data; 
    } catch (error: any) { 
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);



// create material request -form

export const createMaterialRequestRequirements = createAsyncThunk<
ImaterialRequestRequirementscommonRes,
  IMaterialRequestRequirementsReq, 
  { rejectValue: string }
>(
  "MaterialRequest/post",
  async (requestData, { rejectWithValue }) => {
    try {
      const response = await Axios.post<ImaterialRequestRequirementscommonRes>(
        "v1/material-request/createMaterialRequestRequirements",
        requestData
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);


// get all heights 

export const fetchAllMaterialHeights = createAsyncThunk<
IHeightRes,
  { materialNameId: number, search: string },
  { rejectValue: string }
>(
  "fetchAllMaterialHeights/get",
  async ({ materialNameId,search }, { rejectWithValue }) => {
    try {
      const response = await Axios.get<IHeightRes>(
        `v1/material-request/getDistinctHeight/${materialNameId}`,
        {
          params: { search } // Pass the search term as a query parameter
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

// get all  width

export const fetchAllMaterialWidths = createAsyncThunk<
IWidthRes,
  { materialNameId: number, height?: number, search: string },
  { rejectValue: string }
>(
  "fetchAllMaterialWidths/get",
  async ({materialNameId, height,search }, { rejectWithValue }) => {
    try {
      if (!height) {
        return rejectWithValue("Height is required");
      }
      const response = await Axios.get<IWidthRes>(
        `v1/material-request/getDistinctWidth/${materialNameId}`,
        { params: { search, ...(height !== undefined ? { height } : {}) } }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);




// get all material names

export const getDropDownMaterialNames = createAsyncThunk<IDropDownMaterialNamesRes,void , { rejectValue: string }>(
  "getDropDownMaterialNames/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios.get<IDropDownMaterialNamesRes>(`v1/material-request/getDropDownMaterialName`);
        return response.data; // Return the full response structure
     
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch material names");
    }
  }
);

// get all areas for special panels using height and width

export const getAllSpecialPanelAreas = createAsyncThunk<
ISpecialPanelAreasCommonRes,
IspecialPanelAreasReq,
  { rejectValue: string }
>(
  "getAllSpecialPanelAreas/get",
  async ({ materialNameId, height, width }, { rejectWithValue }) => {
    try {
      const response = await Axios.get<ISpecialPanelAreasCommonRes>(
        `v1/material-request/getSpecialPanelArea/${materialNameId}`,
        {
          params: {height, width }, 
        }
      );

      return response.data; // Return fetched areas
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch special panel areas");
    }
  }
);


// get all running meters using height and width for external corners

export const getAllExternalConrerRunningMeters = createAsyncThunk<
IExternalCornerRunningMeterscommonRes,
IExternalCornerRunningMetersReq,
  { rejectValue: string }
>(
  "getAllExternalConrerRunningMeters/get",
  async ({ materialNameId, height, width }, { rejectWithValue }) => {
    try {
      const response = await Axios.get<IExternalCornerRunningMeterscommonRes>(
        `v1/material-request/getExternalCornerRunningMeter/${materialNameId}`,
        {
          params: {height, width }, 
        }
      );

      return response.data; // Return fetched areas
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch special panel areas");
    }
  }
);

// material requirement  edit

export const materialRequirementEdit = createAsyncThunk<
  IEditMaterialRequirementRes, 
  IEditMaterialRequirement, 
  { rejectValue: string } 
>(
  "materialRequirementEdit/update",
  async (editedData, { rejectWithValue }) => {
    try {
      const response = await axios.put<IEditMaterialRequirementRes>(
        `v1/material-request/updateFormRequirement/${editedData.id}`,
        editedData
      );
      return response.data; // API returns updated material requirement
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update material requirement");
    }
  }
);

//get request by id summary
export const getRequestByIdSummary = createAsyncThunk<
MaterialReqStatusSummaryRes,
  {materialRequestId?:number},
  { rejectValue: string }
>(
  "getRequestByIdSummary/get",
  async (materialRequestId, { rejectWithValue }) => {
    try {

      const response = await Axios.get<MaterialReqStatusSummaryRes>(
        `v1/material-request/getRequestByIdSummary/${materialRequestId}`    
      );
      return response.data; 
    } catch (error: any) { 
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

// get all requirement detail by reqid

export const getAllRequirementsByReqId = createAsyncThunk<
  IMaterialRequirementResCommon,
  { search?: string; requestId: number,statusId:number | null },
  { rejectValue: string }
>(
  "getAllRequirementsByReqId/post", 
  async (payload, { rejectWithValue }) => {
    try {
      // const param: any = search;

      const response = await Axios.get<IMaterialRequirementResCommon>(
        `v1/material-request/getAllRequirementsByReqId/${payload.requestId}`,
        {
          params: {
            statusId: payload.statusId 
          }        }
        
      );


      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

// in-transist requirement 
export const getAllInTransitRequirementsByReqId = createAsyncThunk<
IinTransitRequirementsCommon,
  { search?: string; requestId: number },
  { rejectValue: string }
>(
  "getAllInTransitRequirementsByReqId/get",
  async ({ search, requestId }, { rejectWithValue }) => {
    try {
      // const param: any = search;

      const response = await Axios.get<IinTransitRequirementsCommon>(
        `v1/material-request/getAllInTransitDetailsByReqId/${requestId}`,
        {params: search ? {search}:{}}
      );


      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);
// getAllReceivedDetailsByReqId

export const getAllReceivedDetailsByReqId = createAsyncThunk<
IReceivedRequirementsCommon,
  { search?: string; requestId: number },
  { rejectValue: string }
>(
  "getAllReceivedDetailsByReqId/get",
  async ({ search, requestId }, { rejectWithValue }) => {
    try {
      // const param: any = search;

      const response = await Axios.get<IReceivedRequirementsCommon>(
        `v1/material-request/getAllReceivedDetailsByReqId/${requestId}`,
        {params: search ? {search}:{}}
      );


      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);
export const getAllMaterialRequestStatus = createAsyncThunk<MaterialRequestStatus,void, { rejectValue: string }>(
  'dashboard/getAllMaterialRequestStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios.get<MaterialRequestStatus>('/v1/material-request/getAllMaterialRequestStatus');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

const MaterialRequestSlice = createSlice({
  name: "materialRequest",
  initialState,
  reducers: {
      setOffset: (state, action) => {
          state.offset = action.payload;
        },
        setLimit: (state, action) => {
          state.limit = action.payload;
        },
        setSearchInput: (state, action) => {
          state.searchInput = action.payload;
        },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Material Request Summary
      .addCase(fetchAllMaterialRequestSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMaterialRequestSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.materialRequestSummary = action.payload.data || null;
      })
      .addCase(fetchAllMaterialRequestSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch material request summary";
      })

      // Fetch All Material Request Requirements
      .addCase(fetchAllMaterialRequestRequirements.pending, (state,action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMaterialRequestRequirements.fulfilled, (state, action) => {

        state.loading = false;
        const dataArray = action.payload?.data?.data ?? []; // Handle missing data
        state.dataCount = action.payload.data.dataCount;
        state.materialRequestRequirements =
        Array.isArray(dataArray)
        ? dataArray.map((req) => ({
            id: req.id, 
            materialRequestId: req.materialRequestId,
        
            description: req.description || "",
            requestStatus: req.requestStatus || "",
            count: req.count || 0,
            // materialNames: Array.isArray(req.materialNames) ? req.materialNames : [],
            dateOfRequest: req.dateOfRequest || "",
            materialRequirements: Array.isArray(req.materialRequirements) ? req.materialRequirements : []
          }))
        : [];
      
      })
      
      
      .addCase(fetchAllMaterialRequestRequirements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch material requests";
      })

      // Create Material Request Requirements
      .addCase(createMaterialRequestRequirements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMaterialRequestRequirements.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createMaterialRequestRequirements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create material request";
      })
       // fetchAllMaterialHeights
      .addCase(fetchAllMaterialHeights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMaterialHeights.fulfilled, (state, action) => {
        state.loading = false;
        state.height = action.payload.data; 
      })
      .addCase(fetchAllMaterialHeights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
        // fetchAllMaterialwidths
        .addCase(fetchAllMaterialWidths.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchAllMaterialWidths.fulfilled, (state, action) => {
          state.loading = false;
          state.width = action.payload.data; 
        })
        .addCase(fetchAllMaterialWidths.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || "Something went wrong";
        })
         // getAllSpecialPanelAreas
         .addCase(getAllSpecialPanelAreas.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getAllSpecialPanelAreas.fulfilled, (state, action) => {
          state.loading = false;
          state.area = action.payload.data; 
        })
        .addCase(getAllSpecialPanelAreas.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || "Something went wrong";
        })


        // getAllExternalConrerRunningMeters
        .addCase(getAllExternalConrerRunningMeters.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getAllExternalConrerRunningMeters.fulfilled, (state, action) => {
          state.loading = false;
          state.runningMeters = action.payload.data; 
        })
        .addCase(getAllExternalConrerRunningMeters.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || "Something went wrong";
        })
      // getDropDownMaterialNames
      .addCase(getDropDownMaterialNames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDropDownMaterialNames.fulfilled, (state, action) => {
        state.loading = false;
        state.panel = action.payload.data.panel || [];
        state.specialPanel = action.payload.data.specialPanel || [];
        state.externalCorner = action.payload.data.externalCorner || []; 
        state.elevationGrooves = action.payload.data.elevationGrooves || []; 
        state.accessories =  action.payload.data.accessories || [];
       

       })

      .addCase(getDropDownMaterialNames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })

      .addCase(materialRequirementEdit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        materialRequirementEdit.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(materialRequirementEdit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch each Material Request Summary
      .addCase(getRequestByIdSummary.pending, (state,action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRequestByIdSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.materialReqStatusSummary = action.payload.data || null;
      })
      .addCase(getRequestByIdSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch material request summary";
      })
      // get all material requirements by req id
      .addCase(getAllRequirementsByReqId.pending, (state,action)=>{
        state.loading=false;
        state.error = null;
       })
       .addCase(getAllRequirementsByReqId.fulfilled, (state,action)=>{
        state.loading=false;
        state.error = null;
        state.requirements =action.payload.data
       })
       .addCase(getAllRequirementsByReqId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch material requirements";
      })

       // get all materials intransit requirements by req id
       .addCase(getAllInTransitRequirementsByReqId.pending, (state,action)=>{
        state.loading=false;
        state.error = null;
       })
       .addCase(getAllInTransitRequirementsByReqId.fulfilled, (state,action)=>{
        state.loading=false;
        state.error = null;
        state.inTransitRequirements =action.payload.data;
        console.log("getAllInTransitRequirementsByReqId",state.inTransitRequirements);
       })
       .addCase(getAllInTransitRequirementsByReqId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch material requirements";
      })

      // get all received materails  getAllReceivedDetailsByReqId

      .addCase(getAllReceivedDetailsByReqId.pending, (state,action)=>{
        state.loading=false;
        state.error = null;
       })
       .addCase(getAllReceivedDetailsByReqId.fulfilled, (state,action)=>{
        state.loading=false;
        state.error = null;
        state.receivedRequirements =action.payload.data;
        console.log("getAllReceivedDetailsByReqId",state.inTransitRequirements);
       })
       .addCase(getAllReceivedDetailsByReqId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch material requirements";
      })

      .addCase(getAllMaterialRequestStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMaterialRequestStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.materialRequestStatus = action.payload.data;

      })
      .addCase(getAllMaterialRequestStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch material request status";
      });
  },
});
export const { setOffset, setLimit, setSearchInput } = MaterialRequestSlice.actions;

export default MaterialRequestSlice.reducer;

