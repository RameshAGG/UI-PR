import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HandoverMaterialByIdResCommonRes, ICommonListPayloadDto, IHandoverMaterialByIdRes, IMaterialRequesRequirementstRes, ImaterialRequestRequirementscommonRes, IReturnedStockReq, IReturnStock } from "../types/type";
import Axios from "../axios-config/axiosInstance.ts";
import { getMockMaterials } from "../HandOverMockData.ts";
import * as XLSX from "xlsx";

interface HandOverState{
    materials:IMaterialRequesRequirementstRes[];
    handoverPreview:IHandoverMaterialByIdRes[]
    loading:boolean;
    error:boolean;
    dataCount:number;
    offset: number;
    limit: number;
    searchInput:string;
    sortField: string;
  sortOrder: number;
}

const initialState:HandOverState={
    materials:[],
    handoverPreview:[],
    loading:false,
    error:false,
    dataCount:0,
    offset:0,
  limit:10,
  searchInput:"",
  sortField: "createdOn",
  sortOrder: 1,
}

type ReturnToGodownPayload = {
  reqId: number;
  ReturnToGodownDto: {
    requirementId: number;
    returnedStock: number;
    siteId: number;
    towerId: number;
    materialNameId: number;
    godownId: number;
  }[];
};

export const getAllHandOverMaterails =createAsyncThunk<
ImaterialRequestRequirementscommonRes,
ICommonListPayloadDto,
{rejectValue:string}
>
("getAllHandOverMaterails/post",
async (payload,{rejectWithValue})=>{
try{
    const response =await Axios.post<ImaterialRequestRequirementscommonRes>
    (
        `v1/material-request/getFulfiledRequestForHandover
`,payload
    );
    return response.data;
}
catch(error:any){
    return rejectWithValue(error.response?.data?.message || "Something went wrong");
}
}
)


export const getHandOverMaterialsById = createAsyncThunk<
  HandoverMaterialByIdResCommonRes,
  number,
  { rejectValue: string }
>(
  "handoverMaterials/getById", // More accurate name
  async (HandoverMaterialId, { rejectWithValue }) => {
    try {
      const response = await Axios.get<HandoverMaterialByIdResCommonRes>(
        `v1/material-allocation/getcurrentrequeststock/${HandoverMaterialId}` 
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);


export const returnToGodown = createAsyncThunk<
{mesaage:string,success:boolean},
  IReturnStock, 

  { rejectValue: string }
>("returnToGodown/post", async (payload, { rejectWithValue }) => {
  try {
    const response = await Axios.post<{mesaage:string,success:boolean}>("/v1/material-allocation/return-to-godown",payload);

    const requestId = payload.ReturnToGodownDto[0]?.requestId;

    const { data } = await Axios.get(
      `/v1/material-allocation/getcurrentrequeststock/${requestId}`
    );

    const materialData = data?.data; // Access `data` inside response wrapper

    if (!Array.isArray(materialData)) {
      throw new Error("Invalid data format");
    }

    const excelData = materialData.map((item) => ({
      "Site": item.siteName,
      "Tower": item.towerName,
      "Material Name": item.materialName,
      Height: item.height,
      Width: item.width,
      "Allocated Quantity": item.totalAllocatedQuantity ?? 0,
      "Returned Stock": item.returnedstock,
      "Differenced Stock" : item.totalAllocatedQuantity - item.returnedstock
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ReturnedStock");

    XLSX.writeFile(workbook, `Returned_Stock_${requestId}.xlsx`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Something went wrong"
    );
  }
});


const HandOverSlice =createSlice({
    name:"handOver",
    initialState,
    reducers:{
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
    extraReducers:(builder)=>{
        builder
        .addCase(getAllHandOverMaterails.pending,(state)=>{
            state.loading=true;
            state.error=false
        })
        .addCase(getAllHandOverMaterails.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=false
          
                state.materials = action.payload.data.data;
                state.dataCount = action.payload.data.dataCount;
            
        })
        
        .addCase(getAllHandOverMaterails.rejected,(state,action)=>{
            state.loading=false;
            state.error=true
        })

        .addCase(getHandOverMaterialsById.pending,(state)=>{
          state.loading=true;
          state.error=false
      })
      .addCase(getHandOverMaterialsById.fulfilled,(state,action)=>{
          state.loading=false;
          state.error=false
        
              state.handoverPreview = action.payload.data;
          
      })
      
      .addCase(getHandOverMaterialsById.rejected,(state,action)=>{
          state.loading=false;
          state.error=true
      })

      .addCase(returnToGodown.pending,(state)=>{
        state.loading=true;
        state.error=false
      })
      .addCase(returnToGodown.fulfilled,(state,action)=>{
        state.loading=false;
        state.error=false
      })
      .addCase(returnToGodown.rejected,(state,action)=>{
        state.loading=false;
        state.error=true
      })
      
      
      
    }
})
export const { setOffset, setLimit, setSortField, setSortOrder, setSearchInput } = HandOverSlice.actions;

export default HandOverSlice.reducer;