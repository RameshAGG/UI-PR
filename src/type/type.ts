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

export interface IRequestResponse {
  success: boolean;
  message: string;
  data: {
    listData: IRequest[];
    dataCount: number;
  };
}

export interface IRequestListPayload {
  offset: number;
  limit: number;
  sortField?: string;
  sortOrder?: number;
  searchInput?: string;
}
