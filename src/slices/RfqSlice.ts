import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../axios-config/axiosInstance.ts';
import { IRequest, IRequestResponse, IRequestListPayload } from '../type/type';

// Export the interfaces
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

// New interfaces for RFQ downloads
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

interface RequestState {
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
  // New state for RFQ downloads
  rfqDownloading: boolean;
  rfqDownloadProgress: string | null;
  rfqSuppliers: RfqSupplier[];
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
  // New state initialization
  rfqDownloading: false,
  rfqDownloadProgress: null,
  rfqSuppliers: [],
};





// Async thunk to get all requests using GET method
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

// Async thunk to create a suggestion item
export const createSuggestionItem = createAsyncThunk<
  IRequestResponse,
  SuggestionItem,
  { rejectValue: string }
>('requests/createSuggestionItem', async (payload, { rejectWithValue }) => {
  try {
    const response = await Axios.post<IRequestResponse>('suggestion-item', payload);
    if (!response.data.success) {
      return rejectWithValue(response.data.message);
    }
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create suggestion item');
  }
});

// Async thunk to create a suggestion supplier
export const createSuggestionSupplier = createAsyncThunk<
  IRequestResponse,
  SuggestionSupplier,
  { rejectValue: string }
>('requests/createSuggestionSupplier', async (payload, { rejectWithValue }) => {
  try {
    const response = await Axios.post<IRequestResponse>('suggestion-supplier', payload);
    if (!response.data.success) {
      return rejectWithValue(response.data.message);
    }
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create suggestion supplier');
  }
});

export const createPurchaseRequest = createAsyncThunk<
  IRequestResponse,
  CreatePurchaseRequestPayload,
  { rejectValue: string }
>('requests/createPurchaseRequest', async (payload, { rejectWithValue }) => {
  try {
    // Process each item
    const processedItems = await Promise.all(
      payload.items.map(async (item) => {
        let itemId = item.item_id;
        let itemType = item.item_type;

        // If item is new, create suggestion-item
        if (!itemType) {
          const suggestionItemResponse = await Axios.post<IRequestResponse>('suggestion-item', {
            item_name: item.item_name,
            category: item.category,
            sub_category: item.sub_category,
          });

          if (!suggestionItemResponse.data.success) {
            throw new Error(suggestionItemResponse.data.message);
          }

          itemId = null;
          itemType = false;
        }

        // Process suppliers
        const processedSuppliers = await Promise.all(
          item.supplier.map(async (supplier) => {
            if (supplier.is_new_supplier) {
              const suggestionSupplierResponse = await Axios.post<IRequestResponse>('suggestion-supplier', {
                name: supplier.name,
                email: supplier.email,
                mob_num: supplier.mob_num,
                tel_num: supplier.tel_num,
              });

              if (!suggestionSupplierResponse.data.success) {
                throw new Error(suggestionSupplierResponse.data.message);
              }

              return {
                ...supplier,
                supplier_id: suggestionSupplierResponse.data.data.listData[0].id,
                is_new_supplier: false,
              };
            }

            return {
              ...supplier,
              is_new_supplier: false,
            };
          })
        );

        return {
          ...item,
          item_id: itemId,
          item_type: itemType,
          supplier: processedSuppliers,
        };
      })
    );

    // Final post to create purchase request
    const response = await Axios.post<IRequestResponse>('purchase-request', {
      ...payload,
      items: processedItems,
    });

    if (!response.data.success) {
      return rejectWithValue(response.data.message);
    }

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create purchase request');
  }
});

// Updated RFQ download thunk - gets supplier info first
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

// Download individual supplier RFQ
export const downloadSupplierRfq = createAsyncThunk<
  { supplierId: number; supplierName: string },
  { id: number; supplierId: number; supplierName: string; filename: string },
  { rejectValue: string }
>('requests/downloadSupplierRfq', async ({ id, supplierId, supplierName, filename }, { rejectWithValue }) => {
  try {
    const response = await Axios.get(`/rfq/download/${id}/supplier/${supplierId}`, {
      responseType: 'blob',
    });

    // Create download link and trigger download
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

// Main download function that handles multiple suppliers
export const downloadAllRfqFiles = createAsyncThunk<
  void,
  { id: number; delay?: number },
  { rejectValue: string; dispatch: any }
>('requests/downloadAllRfqFiles', async ({ id, delay = 1000 }, { rejectWithValue, dispatch }) => {
  try {
    // First, get supplier information
    const rfqInfo = await dispatch(getRfqDownloadInfo({ id })).unwrap();
    
    if (!rfqInfo.success || rfqInfo.suppliers.length === 0) {
      return rejectWithValue('No suppliers found for this purchase request');
    }

    // Download each supplier's file with delay
    for (let i = 0; i < rfqInfo.suppliers.length; i++) {
      const supplier = rfqInfo.suppliers[i];
      
      try {
        // Update progress
        dispatch(setRfqDownloadProgress(`Downloading: ${supplier.supplierName} (${i + 1}/${rfqInfo.suppliers.length})`));
        
        await dispatch(downloadSupplierRfq({
          id,
          supplierId: supplier.supplierId,
          supplierName: supplier.supplierName,
          filename: supplier.filename
        })).unwrap();
        
        // Add delay between downloads (except for the last one)
        if (i < rfqInfo.suppliers.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        console.error(`Failed to download file for ${supplier.supplierName}:`, error);
        // Continue with other downloads even if one fails
      }
    }

    dispatch(setRfqDownloadProgress(`Successfully downloaded ${rfqInfo.suppliers.length} RFQ file(s)`));
    
    // Clear progress after 3 seconds
    setTimeout(() => {
      dispatch(setRfqDownloadProgress(null));
    }, 3000);

  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to download RFQ files');
  }
});

// Legacy single download function (for backward compatibility)
export const downloadRfq = createAsyncThunk<
  void,
  { id: number },
  { rejectValue: string; dispatch: any }
>('requests/downloadRfq', async ({ id }, { rejectWithValue, dispatch }) => {
  // Use the new multi-supplier download function
  return dispatch(downloadAllRfqFiles({ id }));
});

const requestsSlice = createSlice({
  name: 'requests',
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
    // New actions for RFQ downloads
    setRfqDownloadProgress: (state, action) => {
      state.rfqDownloadProgress = action.payload;
    },
    clearRfqError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(createPurchaseRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPurchaseRequest.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPurchaseRequest.rejected, (state, action) => {
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
      // RFQ Download Info cases
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
      // Individual supplier download cases
      .addCase(downloadSupplierRfq.pending, (state) => {
        // Keep downloading state active
      })
      .addCase(downloadSupplierRfq.fulfilled, (state, action) => {
        // Individual download completed
      })
      .addCase(downloadSupplierRfq.rejected, (state, action) => {
        // Individual download failed - log but continue
        console.error('Supplier download failed:', action.payload);
      })
      // All downloads cases
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
      // Legacy download cases (for backward compatibility)
      .addCase(downloadRfq.pending, (state) => {
        state.rfqDownloading = true;
        state.error = null;
      })
      .addCase(downloadRfq.fulfilled, (state) => {
        state.rfqDownloading = false;
      })
      .addCase(downloadRfq.rejected, (state, action) => {
        state.rfqDownloading = false;
        state.error = action.payload as string;
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
  clearRfqError
} = requestsSlice.actions;

export default requestsSlice.reducer;