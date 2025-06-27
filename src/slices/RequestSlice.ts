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
}


// interface RequestState {
//   requests: IRequest[];
//   loading: boolean;
//   error: string | null;
//   dataCount: number;
// }



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
    // You might want to validate the response structure here
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
    const response = await Axios.post<IRequestResponse>('suggestion-suppliers', payload);
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
          itemType = false; // Mark it as now created
        }

        // Process suppliers
        const processedSuppliers = await Promise.all(
          item.supplier.map(async (supplier) => {
            if (supplier.is_new_supplier) {
              const suggestionSupplierResponse = await Axios.post<IRequestResponse>('suggestion-suppliers', {
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
                supplier_id: null,
                is_new_supplier: false,
              };
            }

            return {
              ...supplier,
              is_new_supplier: false, // Mark as existing
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRequests.fulfilled, (state, action: PayloadAction<IRequestResponse>) => {
        state.loading = false;
        state.requests = action.payload.data|| [];
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

      // Add this to your extraReducers
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
      });

  },
});

export const { setOffset, setLimit, setSortField, setSortOrder, setSearchInput } = requestsSlice.actions;

export default requestsSlice.reducer;
