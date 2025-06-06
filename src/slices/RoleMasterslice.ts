import { createAsyncThunk, createSlice, isActionCreator, PayloadAction } from "@reduxjs/toolkit";
import axios, { create } from "axios";
import { IRole, IRoleResponse} from "../types/type.ts";
import Axios from "../axios-config/axiosInstance.ts";
import { ICommonListPayloadDto } from "../types/type.ts";
import { RootState } from "../store/store.ts";
interface RoleMasterSlice {
    isLoading: boolean;
    error: string | null;
    roles: IRole[];
    offset: number;
    limit: number;
    sortField: string;
    sortOrder: number;
    searchInput: string;
    dataCount: number;
  }
  
  const initialState: RoleMasterSlice = {
    isLoading: false,
    error: null,
    roles: [],
    offset: 0,
    limit: 10,
    sortField: "createdOn",
    sortOrder: 1,
    searchInput: "",
    dataCount: 0,
  }
interface ApiResponse<T> {
    message: string;
    data: T;
    success: boolean;
}
// get all roles
export const getAllRole = createAsyncThunk<
IRoleResponse,//response
ICommonListPayloadDto,
{ rejectValue: string }
>(
    "Role/getAllRole",
    async (payload,{ rejectWithValue }) => {
        try{
                const response = await Axios.post<IRoleResponse>(`v1/master/getAllRole`,payload);
            if (response.data.success) {
                return response.data; // Return the full response structure
            } else {
                return rejectWithValue("Failed to fetch Role");
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch Role");
        }
    }
        
);

export const createRole = createAsyncThunk<ApiResponse<IRole>, IRole, { rejectValue: string }>(
  "Role/createRole",
  async(values,{ rejectWithValue }) => {
    try {
        const response = await Axios.post<ApiResponse<IRole>>("v1/master/createRole", values);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to create Role");
    }
  }
);
// Update a Role
export const updateRole = createAsyncThunk<ApiResponse<IRole>, { roleId: number; roleName: string }, { rejectValue: string }>(
    "role/updaterole",
    async ({ roleId, roleName }, { rejectWithValue }) => {
        try {
            const response = await Axios.put<ApiResponse<IRole>>(`v1/master/updateRole/${roleId}`, { roleName });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update Role");
        }
    }
);

//Delete a role 
export const deleteRole = createAsyncThunk< number , number, { rejectValue :string } >(
    "role/deleterole",
    async(id,{ rejectWithValue }) => {
        try{
            await Axios.delete(`v1/master/deleteRole/${id}`);
            return id;
        } catch(error:any){
            return rejectWithValue(error.response?.data?.message || 'failed to delete Role');
        }
    }
);
export const updateStatus = createAsyncThunk<ApiResponse<IRole>,{id:number; isActive:boolean},{rejectValue:string}>(
    "role/updateStatusrole",
    async ({ id, isActive }, { rejectWithValue }) => {
        try {
            const response = await Axios.put<ApiResponse<IRole>>(`v1/master/updateStatusrole/${id}`, { isActive });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update role status");
        }
    }
);


const RoleMasterslice = createSlice({
    name:"RoleMaster",
    initialState,
    reducers:{
        setOffset(state,action){
            state.offset = action.payload;
        },
        setLimit(state,action){
            state.limit =action.payload;
        },
        setSortField(state,action){
            state.sortField =action.payload;
        },
        setSortOrder(state,action){
            state.sortOrder =action.payload;
        },
        setSearchInput(state,action){
            state.searchInput =action.payload;
        },
    },
 extraReducers: (builder) =>{
    builder 
    .addCase(getAllRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
    })
.addCase(getAllRole.fulfilled ,(state, action) => {
    state.isLoading=false;
    state.roles =action.payload.data.listData;
    state.dataCount = action.payload.data.dataCount;
})
.addCase(getAllRole .rejected, (state, action) => {
    state.isLoading=false;
    state.error =action.payload as string;
})
.addCase(createRole.pending, (state) => {
    state.isLoading = true;
    state.error=null;
})
.addCase(createRole.fulfilled, (state,action:PayloadAction<ApiResponse<IRole>>) =>{
  state.isLoading = false;
  state.roles.push(action.payload.data);
  state.dataCount = state.roles.length;
})  
.addCase(createRole.rejected, (state,action)=> {
    state.isLoading =false;
    state.error=action.payload as string;
})
.addCase(updateRole.pending,(state)=>{
    state.isLoading =true;
    state.error =null;
})
.addCase(updateRole.fulfilled,(state,action: PayloadAction<ApiResponse<IRole>>) =>{
    state.isLoading = false;
    state.roles = state.roles?.map(Role => Role.roleId ===action.payload.data.roleId ? action.payload.data:Role );
    state.dataCount=state.roles?.length?? 0;
})
.addCase(updateRole.rejected,(state, action )=>{
    state.isLoading =false;
    state.error = action.payload as string;
})
 },
});

export const { setOffset, setLimit, setSortField, setSortOrder, setSearchInput } = RoleMasterslice.actions;

export default RoleMasterslice.reducer;