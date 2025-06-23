export interface IRequest {
  id: number;
  department: string;
  date_requested: string;
  status: string;
  item: {
    id: number;
    name: string;
    item_name?: string;
  };
  supplier?: {
    id: number;
    name: string;
  };
}

// export interface IRequestResponse {
//   success: boolean;
//   message: string;
//   data: {
//     listData: IRequest[];
//     dataCount: number;
//   };
// }



export interface IRequestListPayload {
  offset: number;
  limit: number;
  sortField?: string;
  sortOrder?: number;
  searchInput?: string;
}




















// Add these interfaces at the top of your file
export interface SupplierDetail {
  id: number;
  name: string;
  email: string;
  mob_num: string;
  tel_num: string;
  type: 'existing' | 'suggested';
}

export interface ItemDetail {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  uom?: string;
  pack_size?: number;
  type: 'existing' | 'suggested';
}

export interface PurchaseRequestDetail {
  id: number;
  department: string;
  date_requested: string;
  status: string;
  item_type: boolean;
  purchase_request_id: number;
  total_items: number;
  total_suppliers: number;
  items: ItemDetail[];
  suppliers: SupplierDetail[];
  created_at?: string;
  updated_at?: string;
}

export interface IRequestResponse {
  success: boolean;
  message: string;
  data: {
    data?: PurchaseRequestDetail[] | PurchaseRequestDetail;
    dataCount?: number;
    listData?: any[]; // Keep this if you still use it elsewhere
  };
  statusCode: number;
}

// Update your existing interfaces
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
  uom?: string;
  pack_size?: number;
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
  suggestion_items?: SuggestionItem[];
  suggestion_suppliers?: SuggestionSupplier[];
}

interface RequestState {
  requests: PurchaseRequestDetail[];
  purchaseRequest: PurchaseRequestDetail | null;
  loading: boolean;
  error: string | null;
  dataCount: number;
  offset: number;
  limit: number;
  sortField: string;
  sortOrder: number | null;
  searchInput: string;
}