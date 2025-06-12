import Axios from '../axios-config/axiosInstance';

export interface ExistingItem {
  id: number;
  name: string;
}

export interface ExistingSupplier {
  id: number;
  name: string;
}

export const getExistingItems = async (): Promise<ExistingItem[]> => {
  try {
    const response = await Axios.get('/items');
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    return response.data.data.listData;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch items');
  }
};

export const getExistingSuppliers = async (): Promise<ExistingSupplier[]> => {
  try {
    const response = await Axios.get('/suppliers');
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    return response.data.data.listData;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch suppliers');
  }
}; 