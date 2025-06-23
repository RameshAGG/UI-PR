import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../axios-config/axiosInstance.ts';
import { IRequest, IRequestResponse, IRequestListPayload } from '../type/type';




export interface RfqUploadPayload {
  requestId: number;
  supplierId: number;
  items: Array<{
    name: string;
    code: string;
    uom: string;
    quantity: number;
    unitPrice: number;
    discount: string;
    gst: string;
    sgst: string;
    cgst: string;
    totalValue: string;
    deliveryDate: string;
    remarks: string;
  }>;
}


export interface RfqUploadResponse {
  success: boolean;
  message: string;
  data: any;
}
// Interfaces for Request Management
export interface Supplier {
  supplier_id: number | null;
  name: string;
  email: string;
  mob_num: string;
  tel_num: string;
  is_new_supplier: boolean;
}

export interface RequestItem {
  item_id: number | null;
  item_name: string;
  item_type: boolean;
  category: string;
  sub_category: string;
  is_new_item: boolean;
  supplier: Supplier[];
}

export interface SuggestionItem {
  item_name: string;
  category: string;
  sub_category: string;
}

export interface SuggestionSupplier {
  name: string;
  email: string;
  mob_num: string;
  tel_num: string;
}

export interface CreatePurchaseRequestPayload {
  department: string;
  date_requested: string;
  status: string;
  items: RequestItem[];
  suggestion_items: SuggestionItem[];
  suggestion_suppliers: SuggestionSupplier[];
}

// Interfaces for RFQ Management
export interface RfqSupplier {
  supplierId: number;
  supplierName: string;
  filename: string;
  downloadUrl: string;
}

export interface RfqDownloadInfo {
  success: boolean;
  message: string;
  suppliers: RfqSupplier[];
}

export interface RfqItem {
  name: string;
  code: string;
  uom: string;
  quantity: number;
  unitPrice: number;
  discount: string;
  gst: string;
  sgst: string;
  cgst: string;
  totalValue: string;
  deliveryDate: string;
  remarks: string;
}

export interface RfqData {
  id: number;
  purchaseRequest: {
    id: number;
  };
  supplier: {
    id: number;
    name: string;
    email?: string;
    mob_num?: string;
    tel_num?: string;
  };
  items: RfqItem[];
  uploadedAt: string;
}

// Combined State Interface
interface RequestState {
  // Request Management State
  requests: IRequest[];
  purchaseRequest: IRequestResponse | null;
  loading: boolean;
  error: string | null;
  dataCount: number;
  offset: number;
  limit: number;
  sortField: string;
  sortOrder: number | null;
  searchInput: string;
  
  // RFQ Download State
  rfqDownloading: boolean;
  rfqDownloadProgress: string | null;
  rfqSuppliers: RfqSupplier[];
  
  // RFQ Data State
  rfqData: {
    loading: boolean;
    error: string | null;
    success: boolean;
    data: RfqData[];
  };

  rfqUploading: boolean;
  rfqUploadError: string | null;
  rfqUploadSuccess: boolean;
}

const initialState: RequestState = {
  requests: [],
  purchaseRequest: null,
  loading: false,
  error: null,
  dataCount: 0,
  offset: 0,
  limit: 10,
  sortField: '',
  sortOrder: null,
  searchInput: '',
  
  // RFQ Download State
  rfqDownloading: false,
  rfqDownloadProgress: null,
  rfqSuppliers: [],
  

  rfqUploading: false,
  rfqUploadError: null,
  rfqUploadSuccess: false,
  // RFQ Data State
  rfqData: {
    loading: false,
    error: null,
    success: false,
    data: [],
  },
};

// Request Management Thunks
export const getAllRequests = createAsyncThunk<
  IRequestResponse,
  IRequestListPayload,
  { rejectValue: string }
>('requests/getAllRequests', async (payload, { rejectWithValue }) => {
  try {
    const response = await Axios.get<IRequestResponse>('purchase-request', {
      params: payload
    });
    if (!response.data.success) {
      return rejectWithValue(response.data.message);
    }
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch requests');
  }
});

export const getPurchasebyId = createAsyncThunk<
  IRequestResponse,
  { id: number },
  { rejectValue: string }
>("requests/getPurchasebyId", async ({ id }, { rejectWithValue }) => {
  try {
    const response = await Axios.get<IRequestResponse>(`purchase-request/${id}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

// RFQ Data Management Thunks
export const submitRfqData = createAsyncThunk<
  RfqData,
  {
    requestId: number;
    supplierId: number;
    items: RfqItem[];
  },
  { rejectValue: string }
>('requests/submitRfqData', async (payload, { rejectWithValue }) => {
  try {
    const response = await Axios.post<RfqData>(
      `/purchase-requests/${payload.requestId}/rfq-data`,
      {
        supplierId: payload.supplierId,
        items: payload.items,
      }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to submit RFQ data');
  }
});

export const fetchRfqData = createAsyncThunk<
  RfqData[],
  number,
  { rejectValue: string }
>('requests/fetchRfqData', async (requestId, { rejectWithValue }) => {
  try {
    const response = await Axios.get<RfqData[]>(
      `/purchase-requests/${requestId}/rfq-data`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch RFQ data');
  }
});

// RFQ Download Thunks
export const getRfqDownloadInfo = createAsyncThunk<
  RfqDownloadInfo,
  { id: number },
  { rejectValue: string }
>('requests/getRfqDownloadInfo', async ({ id }, { rejectWithValue }) => {
  try {
    const response = await Axios.get<RfqDownloadInfo>(`/rfq/download/${id}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to get RFQ download info');
  }
});

export const downloadSupplierRfq = createAsyncThunk<
  { supplierId: number; supplierName: string },
  { id: number; supplierId: number; supplierName: string; filename: string },
  { rejectValue: string }
>('requests/downloadSupplierRfq', async ({ id, supplierId, supplierName, filename }, { rejectWithValue }) => {
  try {
    const response = await Axios.get(`/rfq/download/${id}/supplier/${supplierId}`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { supplierId, supplierName };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || `Failed to download RFQ for ${supplierName}`);
  }
});

export const downloadAllRfqFiles = createAsyncThunk<
  void,
  { id: number; delay?: number },
  { rejectValue: string; dispatch: any }
>('requests/downloadAllRfqFiles', async ({ id, delay = 1000 }, { rejectWithValue, dispatch }) => {
  try {
    const rfqInfo = await dispatch(getRfqDownloadInfo({ id })).unwrap();
    
    if (!rfqInfo.success || rfqInfo.suppliers.length === 0) {
      return rejectWithValue('No suppliers found for this purchase request');
    }

    for (let i = 0; i < rfqInfo.suppliers.length; i++) {
      const supplier = rfqInfo.suppliers[i];
      
      try {
        dispatch(setRfqDownloadProgress(`Downloading: ${supplier.supplierName} (${i + 1}/${rfqInfo.suppliers.length})`));
        
        await dispatch(downloadSupplierRfq({
          id,
          supplierId: supplier.supplierId,
          supplierName: supplier.supplierName,
          filename: supplier.filename
        })).unwrap();
        
        if (i < rfqInfo.suppliers.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        console.error(`Failed to download file for ${supplier.supplierName}:`, error);
      }
    }

    dispatch(setRfqDownloadProgress(`Successfully downloaded ${rfqInfo.suppliers.length} RFQ file(s)`));
    
    setTimeout(() => {
      dispatch(setRfqDownloadProgress(null));
    }, 3000);

  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to download RFQ files');
  }
});

export const downloadRfq = createAsyncThunk<
  void,
  { id: number },
  { rejectValue: string; dispatch: any }
>('requests/downloadRfq', async ({ id }, { rejectWithValue, dispatch }) => {
  return dispatch(downloadAllRfqFiles({ id }));
});

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    setOffset: (state, action: PayloadAction<number>) => {
      state.offset = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setSortField: (state, action: PayloadAction<string>) => {
      state.sortField = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<number | null>) => {
      state.sortOrder = action.payload;
    },
    setSearchInput: (state, action: PayloadAction<string>) => {
      state.searchInput = action.payload;
    },
    setRfqDownloadProgress: (state, action: PayloadAction<string | null>) => {
      state.rfqDownloadProgress = action.payload;
    },
    clearRfqError: (state) => {
      state.error = null;
    },
    resetRfqDataState: (state) => {
      state.rfqData.loading = false;
      state.rfqData.error = null;
      state.rfqData.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Request Management Cases
      .addCase(getAllRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRequests.fulfilled, (state, action: PayloadAction<IRequestResponse>) => {
        state.loading = false;
        state.requests = action.payload.data || [];
        state.dataCount = action.payload.dataCount;
      })
      .addCase(getAllRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getPurchasebyId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPurchasebyId.fulfilled, (state, action: PayloadAction<IRequestResponse>) => {
        state.loading = false;
        state.purchaseRequest = action.payload;
      })
      .addCase(getPurchasebyId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // RFQ Download Cases
      .addCase(getRfqDownloadInfo.pending, (state) => {
        state.rfqDownloading = true;
        state.error = null;
        state.rfqDownloadProgress = 'Preparing RFQ files...';
      })
      .addCase(getRfqDownloadInfo.fulfilled, (state, action: PayloadAction<RfqDownloadInfo>) => {
        state.rfqSuppliers = action.payload.suppliers;
        state.rfqDownloadProgress = `Found ${action.payload.suppliers.length} supplier(s). Starting downloads...`;
      })
      .addCase(getRfqDownloadInfo.rejected, (state, action) => {
        state.rfqDownloading = false;
        state.error = action.payload as string;
        state.rfqDownloadProgress = null;
      })
      .addCase(downloadAllRfqFiles.pending, (state) => {
        state.rfqDownloading = true;
        state.error = null;
      })
      .addCase(downloadAllRfqFiles.fulfilled, (state) => {
        state.rfqDownloading = false;
      })
      .addCase(downloadAllRfqFiles.rejected, (state, action) => {
        state.rfqDownloading = false;
        state.error = action.payload as string;
        state.rfqDownloadProgress = null;
      })

    // Add to your extraReducers
.addCase(submitRfqData.pending, (state) => {
  state.rfqUploading = true;
  state.rfqUploadError = null;
  state.rfqUploadSuccess = false;
})
.addCase(submitRfqData.fulfilled, (state, action: PayloadAction<RfqData>) => {
  state.rfqUploading = false;
  state.rfqUploadSuccess = true;
  state.rfqData.data = [action.payload, ...state.rfqData.data];
})
.addCase(submitRfqData.rejected, (state, action) => {
  state.rfqUploading = false;
  state.rfqUploadError = action.payload as string;
})
.addCase(fetchRfqData.pending, (state) => {
  state.rfqData.loading = true;
  state.rfqData.error = null;
})
.addCase(fetchRfqData.fulfilled, (state, action: PayloadAction<RfqData[]>) => {
  state.rfqData.loading = false;
  state.rfqData.data = action.payload;
})
.addCase(fetchRfqData.rejected, (state, action) => {
  state.rfqData.loading = false;
  state.rfqData.error = action.payload as string;
});

  },
});

export const { 
  setOffset, 
  setLimit, 
  setSortField, 
  setSortOrder, 
  setSearchInput,
  setRfqDownloadProgress,
  clearRfqError,
  resetRfqDataState
} = requestsSlice.actions;

export default requestsSlice.reducer;