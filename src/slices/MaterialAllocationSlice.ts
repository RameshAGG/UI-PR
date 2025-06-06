import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import Axios from '../axios-config/axiosInstance.ts';
import { data } from 'react-router-dom';

// Define interfaces for the data structure
interface MaterialItem {
    id: number;
    materialName: string;
    materialSeqId: string;
    periorityId: number;
    periorityType: string;
    statusId: number;
    status: string;
    QtyRequiredValue: number;
    materialDate: string;
    allocatedStatus: boolean;
}

interface materialRequest {
    id: number;
    materialRequestId: string;
    statusId: number;
    status: string;
    requestDate: string;
    towerId: number;
    towerName: string;
    towerSeqId: string;
    towerAdminName: string;
    towerAdminContact: string;
    materialList: MaterialItem[];
}

interface MaterialAllocationState {
    materialRequest: materialRequest | null;
    loading: boolean;
    loadingAvailableMaterial: boolean;
    sendApprovalLoading: boolean;
    approvalLoading: boolean;
    dispatchLoading: boolean;
    sendRejectLoading: boolean;
    rejectLoading: boolean;
    dispatchUnavailableLoading: boolean;
    error: string | null;
    availableMaterials: any[];
    allocatedMaterialData: any;
    allMaterialRequestData: any[];
    MaterialRequestMockData: any[];
    approvalListData:any[];
    ebillLoading: boolean;
    ebillUrl: string;
    offset: number;
    limit: number;
    sortField: string;
    sortOrder: number;
    searchInput: string;
    dataCount: number;
    ackLoading: boolean;
    allocatedMaterialDataList:any[];
}
const initialState: MaterialAllocationState = {
    materialRequest: null,
    loading: false,
    loadingAvailableMaterial: false,
    sendApprovalLoading: false,
    approvalLoading: false,
    dispatchLoading: false,
    sendRejectLoading: false,
    rejectLoading: false,
    dispatchUnavailableLoading: false,
    error: null,
    availableMaterials: [],
    allocatedMaterialData: {},
    allMaterialRequestData:[],
    MaterialRequestMockData: [],
    approvalListData:[],
    ebillLoading: false,
    ebillUrl: "",
    offset: 0,
    limit: 10,
    sortOrder: 1,
    sortField:"createdOn",
    searchInput: '',
    dataCount: 0,
    ackLoading: false,
    allocatedMaterialDataList:[]
};


export const getAllAllocationList = createAsyncThunk<
    '',
    {
        offset: number;
        limit: number;
        sortField: string | null;
        sortOrder: number | null;
        searchInput: string;
    }
>('getAllAllocationList/getAllDetails', async (payload, { rejectWithValue }) => {
    try {
        // getAllMaterialRequestRequirements
        const response = await Axios.post('v1/material-allocation/getAllAllocationList', payload);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch material request');
    }
});


export const getAllApprovalList = createAsyncThunk<
    '',
    {
        offset: number;
        limit: number;
        sortField: string | null;
        sortOrder: number | null;
        searchInput: string;
    }
>('getAllApprovalList/get', async (payload, { rejectWithValue }) => {
    try {
        // getAllMaterialRequestRequirements
        const response = await Axios.post('v1/material-allocation/getAllApprovalList', payload);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch material request');
    }
});



export const getAllmaterialDispatachRequestDetails = createAsyncThunk<
    '',
    {
        offset: number;
        limit: number;
        sortField: string | null;
        sortOrder: number | null;
        searchInput: string;
    }
>(
    'materialAllocation/getAllDetailsDispatch',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await Axios.post('v1/material-allocation/material-requests-dispatch', payload);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch material request');
        }
    }
);


export const getAllmaterialAcceptRequestDetails = createAsyncThunk<
    '',
    {
        offset: number;
        limit: number;
        sortField: string | null;
        sortOrder: number | null;
        searchInput: string;
    }
>(
    'materialAllocation/getAllDetailsAccept',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await Axios.post('v1/material-allocation/material-requests-accepted', payload);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch material request');
        }
    }
);


export const fetchMaterialRequestDetails = createAsyncThunk<materialRequest, string>(
    'materialAllocation/fetchDetails',
    async (requestId: string): Promise<materialRequest> => {
        try {
            const response = await Axios.get<materialRequest>(`v1/material-allocation/getAllAllocationListById/${requestId}`);
            return response.data.data?.[0];
        } catch (error) {
            throw error;
        }
    }
);
export const acknowledgementPreview = createAsyncThunk<materialRequest, string>(
    'acknowledgementPreview/fetchDetails',
    async (requestId: string): Promise<materialRequest> => {
        try {
            const response = await Axios.get<materialRequest>(`v1/material-allocation/getAllocationListByIdForAcknowledgement/${requestId}`);
            return response.data.data?.[0];
        } catch (error) {
            throw error;
        }
    }
);

export const acknowledgementPreviewAvailableMaterial = createAsyncThunk<any[], number>(
    'acknowledgementPreviewAvailableMaterial/fetchAvailable',
    async (materialId: number): Promise<any[]> => {
        try {
            const response = await Axios.get<materialRequest>(`v1/material-allocation/allocated-details-for-acknowledgement/${materialId}`);
            return response.data.data
        } catch (error) {
            throw error;
        }
    }
);

export const fetchAvailableMaterial = createAsyncThunk<any[], number>(
    'materialAllocation/fetchAvailable',
    async (materialId: number): Promise<any[]> => {
        try {
            const response = await Axios.get<materialRequest>(`v1/material-allocation/avaliable-meterial/${materialId}`);
            return response.data.data
        } catch (error) {
            throw error;
        }
    }
);

export const submitMaterialAllocation = createAsyncThunk<void, any[]>(
    'materialAllocation/submit',
    async (allocatedDetails: any[]): Promise<void> => {
        try {
            await Axios.post(`v1/material-allocation/material-allocate`, allocatedDetails);
            return;
        } catch (error) {
            throw error;
        }
    }
);

// Add this new thunk
export const fetchMaterialAllocationDetails = createAsyncThunk<any, number>(
    'materialAllocation/fetchAllocationDetails',
    async (materialId: number) => {
        try {
            const response = await Axios.get(`v1/material-allocation/allocated-details/${materialId}`);
            let allocatedData = response.data.data;
            return allocatedData;
        } catch (error) {
            throw error;
        }
    }
);

// Add new action
export const reallocateMaterial = createAsyncThunk(
    'materialAllocation/reallocate',
    async (reallocateData: any) => {
        try {
            const response = await Axios.post('v1/material-allocation/reallocate', reallocateData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
);

export const sendMaterialApproval = createAsyncThunk(
    'material/sendApproval',
    async (sendApprovalData: any) => {
        try {
            const response = await Axios.post('v1/material-allocation/sendApproval', sendApprovalData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
);

export const materialApproval = createAsyncThunk(
    'material/approval',
    async (approvalData: any) => {
        try {
            const response = await Axios.post('v1/material-allocation/approval', approvalData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
);


export const materialAccept = createAsyncThunk(
    'material/accept',
    async (acceptData: any) => {
        try {
            const response = await Axios.post('v1/material-allocation/updateStatusOfMaterialRequirement', acceptData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
);

export const materialVendorAcknowledgment = createAsyncThunk(
    'material/vendorAcknowledgment',
    async ({ vendorAcknowledgmentData, id }: { vendorAcknowledgmentData: any; id: number }) => {
        try {
            const response = await Axios.put(`v1/material-request/updateMaterialRequirement/${id}`, vendorAcknowledgmentData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
);

export const sendMaterialDispatch = createAsyncThunk(
    'material/dispatch',
    async (dispatchData: any) => {
        try {
            const response = await Axios.post('v1/material-allocation/dispatch', dispatchData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
);

export const sendMaterialReject = createAsyncThunk(
    'material/sendReject',
    async (sendRejectData: any) => {
        try {
            const response = await Axios.post('v1/material-allocation/sendReject', sendRejectData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
);

export const materialReject = createAsyncThunk(
    'material/reject',
    async (rejectData: any) => {
        try {
            const response = await Axios.post('v1/material-allocation/reject', rejectData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
);

export const sendMaterialDispatchUnavailable = createAsyncThunk(
    'material/dispatchUnavailable',
    async (dispatchUnavailable: any) => {
        try {
            const response = await Axios.post('v1/material-allocation/dispatchUnavailable', dispatchUnavailable);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
);

export const ebillFileUpload = createAsyncThunk(
    'material/ebillFileUpload',
    async (data: FormData) => {
        try {
            const response = await Axios.post('v1/material-allocation/ebillFileUpload', data)
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
);

export const getInvoiceAndEbill = createAsyncThunk(
    'material/getInvoiceAndEbill',
    async (materialId) => {
        try {
            const response = await Axios.get(`v1/material-allocation/getInvoiceAndEbill/${materialId}`)
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
);






const materialAllocationSlice = createSlice({
    name: 'materialAllocation',
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
            .addCase(getAllAllocationList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllAllocationList.fulfilled, (state, action) => {
                state.loading = false;
                state.MaterialRequestMockData = action.payload?.data || [];
                state.dataCount = action.payload?.dataCount;
            })
            .addCase(getAllAllocationList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null;
            })
            .addCase(getAllApprovalList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllApprovalList.fulfilled, (state, action) => {
                state.loading = false;
                state.approvalListData = action.payload?.data || [];
                state.dataCount = action.payload?.dataCount;
            })
            .addCase(getAllApprovalList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null;
            })

             // dispatch
             .addCase(getAllmaterialDispatachRequestDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllmaterialDispatachRequestDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.MaterialRequestMockData = action.payload?.data || [];
                state.dataCount = action.payload?.dataCount?.totalcount;
            })
            .addCase(getAllmaterialDispatachRequestDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null;
            })


            .addCase(getAllmaterialAcceptRequestDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllmaterialAcceptRequestDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.MaterialRequestMockData = action.payload?.data || [];
                state.dataCount = action.payload?.dataCount;
            })
            .addCase(getAllmaterialAcceptRequestDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null;
            })

            .addCase(fetchMaterialRequestDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMaterialRequestDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.materialRequest = action.payload;
            })
            .addCase(fetchMaterialRequestDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null;
            })
// acknowledgement preview
            .addCase(acknowledgementPreview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(acknowledgementPreview.fulfilled, (state, action) => {
                state.loading = false;
                state.materialRequest = action.payload;
            })
            .addCase(acknowledgementPreview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null;
            })
// acknowledgementPreviewAvailableMaterial

            .addCase(acknowledgementPreviewAvailableMaterial.pending, (state) => {
                state.ackLoading = true;
                state.error = null;
            })
            .addCase(acknowledgementPreviewAvailableMaterial.fulfilled, (state, action) => {
                state.ackLoading = false;
                state.allocatedMaterialData = action.payload;
            })
            .addCase(acknowledgementPreviewAvailableMaterial.rejected, (state, action) => {
                state.ackLoading = false;
                state.error = action.error.message || null;
            })
            .addCase(fetchAvailableMaterial.pending, (state) => {
                state.loadingAvailableMaterial = true;
                state.error = null;
            })
            .addCase(fetchAvailableMaterial.fulfilled, (state, action) => {
                state.loadingAvailableMaterial = false;
                state.availableMaterials = action.payload;
            })
            .addCase(fetchAvailableMaterial.rejected, (state, action) => {
                state.loadingAvailableMaterial = false;
                state.error = action.error.message || null;
            })

       


            .addCase(submitMaterialAllocation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitMaterialAllocation.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(submitMaterialAllocation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null;
            })
            .addCase(fetchMaterialAllocationDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMaterialAllocationDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.allocatedMaterialData = action.payload

            })
            .addCase(fetchMaterialAllocationDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null;
            })
            .addCase(reallocateMaterial.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(reallocateMaterial.fulfilled, (state, action) => {
                state.loading = false;
                // Update state as needed based on successful reallocation
            })
            .addCase(reallocateMaterial.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null;
            })

            .addCase(sendMaterialApproval.pending, (state) => {
                state.sendApprovalLoading = true;
                state.error = null;
            })
            .addCase(sendMaterialApproval.fulfilled, (state, action) => {
                state.sendApprovalLoading = false;
            })
            .addCase(sendMaterialApproval.rejected, (state, action) => {
                state.sendApprovalLoading = false;
                state.error = action.error.message || null;
            })

            .addCase(sendMaterialReject.pending, (state) => {
                state.sendRejectLoading = true;
                state.error = null;
            })
            .addCase(sendMaterialReject.fulfilled, (state, action) => {
                state.sendRejectLoading = false;
            })
            .addCase(sendMaterialReject.rejected, (state, action) => {
                state.sendRejectLoading = false;
                state.error = action.error.message || null;
            })

            .addCase(materialReject.pending, (state) => {
                state.rejectLoading = true;
                state.error = null;
            })
            .addCase(materialReject.fulfilled, (state, action) => {
                state.rejectLoading = false;
            })
            .addCase(materialReject.rejected, (state, action) => {
                state.rejectLoading = false;
                state.error = action.error.message || null;
            })

            .addCase(materialApproval.pending, (state) => {
                state.approvalLoading = true;
                state.error = null;
            })
            .addCase(materialApproval.fulfilled, (state, action) => {
                state.approvalLoading = false;
            })
            .addCase(materialApproval.rejected, (state, action) => {
                state.approvalLoading = false;
                state.error = action.error.message || null;
            })

            .addCase(sendMaterialDispatch.pending, (state) => {
                state.dispatchLoading = true;
                state.error = null;
            })
            .addCase(sendMaterialDispatch.fulfilled, (state, action) => {
                state.dispatchLoading = false;
            })
            .addCase(sendMaterialDispatch.rejected, (state, action) => {
                state.dispatchLoading = false;
                state.error = action.error.message || null;
            })

            .addCase(sendMaterialDispatchUnavailable.pending, (state) => {
                state.dispatchUnavailableLoading = true;
                state.error = null;
            })
            .addCase(sendMaterialDispatchUnavailable.fulfilled, (state, action) => {
                state.dispatchUnavailableLoading = false;
            })
            .addCase(sendMaterialDispatchUnavailable.rejected, (state, action) => {
                state.dispatchUnavailableLoading = false;
                state.error = action.error.message || null;
            })


            .addCase(ebillFileUpload.pending, (state) => {
                state.ebillLoading = true;
                state.error = null;
            })
            .addCase(ebillFileUpload.fulfilled, (state, action) => {
                state.ebillLoading = false;
                state.ebillUrl = action?.payload.data.url
            })
            .addCase(ebillFileUpload.rejected, (state, action) => {
                state.ebillLoading = false;
                state.error = action.error.message || null;
            })


    }
});

export const { setOffset, setLimit, setSortField, setSortOrder, setSearchInput } = materialAllocationSlice.actions;
export default materialAllocationSlice.reducer;