import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import Axios from '../axios-config/axiosInstance.ts'; // Import the axios instance
import {ICommonListPayloadDto, IUser} from "../types/type"
import { encryptData } from "../storageHelper.ts";


// Define Login API response type
interface LoginResponse {
  message: string;
  success: boolean;
  data: {
    token: string;
    roleName:string;
    permission:string[];
  };
}

interface addUserResponse {
  response?: {
    data?: {
      message: string;
      success: string
    };
  };
}

// Define login form values
interface LoginFormValues {
  email: string;
  password: string;
}

interface addUserFormValues {
  userName: string;
  email: string;
  phoneNumber: string;
  roleId: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string
}

// Add these interfaces at the top with other interfaces

interface ApiResponse<T> {
  message: string;
  data: T;
  success: boolean;
}

// Add this interface to define the structure of the API response
interface GetAllUserResponse {
  listData: IUser[];
  dataCount: number;
}

// Update the UserRegistration interface
interface UserRegistration {
  isLoading: boolean;
  isLoggedIn: boolean;
  error: string | null;
  getAllUserData: IUser[];
  token: string | null;
  offset: number;
  limit: number;
  sortField: string;
  sortOrder: number;
  searchInput: string;
  dataCount: number;
  roleName:string | null;
}

export const createUser = createAsyncThunk<
addUserResponse, // Expected return type
addUserFormValues, // Input type
  { rejectValue: string } // Explicit reject type
>(
  "user/createUser",
  async (values, { rejectWithValue }) => {
    try {
      const response = await Axios.post<addUserResponse>("v1/user/createUser", values);
      // await getAllUser();
      return response.data; // Ensure correct return type
      
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Creation of user failed");
    }
  }
);

// Add getAllUser thunk
export const getAllUser = createAsyncThunk<
  ApiResponse<GetAllUserResponse>,
  ICommonListPayloadDto,
  { rejectValue: string }
>(
  "user/getAllUsers",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await Axios.post<ApiResponse<GetAllUserResponse>>(`v1/user/getAllUsers`,payload);
      if (response.data.success) {
        return response.data;
      } else {
        return rejectWithValue("Failed to fetch users");
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
    }
  }
);

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginFormValues,
  { rejectValue: string }
>(
  "user/login",
  async (values, { rejectWithValue }) => {
    try {
      const response = await Axios.post<LoginResponse>("v1/auth/login", values); // Use Axios here
      // Check if the response is successful and has the token
      if (response.data && response.data.success === true && response.data.data && response.data.data.token) {
        // Store the token in local storage
        localStorage.setItem('token', encryptData(response.data.data.token));
        localStorage.setItem('roleName', encryptData(response.data.data.roleName));
        localStorage.setItem('permission', encryptData(response.data.data.permission || []));
        
        // Store the token in axios defaults for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
        
        return response.data;
      } else {
        return rejectWithValue(response.data?.message || "Login failed");
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const sendResetLink = createAsyncThunk<
  ApiResponse<null>,
  string,
  { rejectValue: string }
>(
  "user/sendResetLink", 
  async (email, { rejectWithValue }) => {
    try {
      const response = await Axios.post<ApiResponse<null>>("v1/auth/forgotpassword", { email });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to send reset link");
    }
  }
);  


export const updateUser = createAsyncThunk<
addUserResponse, // Expected return type
any, // Input type
  { rejectValue: string } // Explicit reject type
>(
  "user/updateUser",
  async ({id , values}, { rejectWithValue }) => {
    try {
      const response = await Axios.put<addUserResponse>(`v1/user/updateUser/${id}`, values);
      return response.data; // Ensure correct return type
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "updation of user failed");
    }
  }
);


export const updateUserStatus = createAsyncThunk<any, { userId: number; values: any }, { rejectValue: string }>(
  "user/updateUserStatus",
  async ({ userId, values }, { rejectWithValue }) => {
    try {
      const response = await Axios.put(`v1/user/userActiveStatus/${userId}`, values);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update user status");
    }
  }
);





// Initial state
const initialState: UserRegistration = {
  isLoading: false,
  isLoggedIn: false,
  error: null,
  getAllUserData: [],
  token: null,
  offset: 0,
  limit: 10,
  sortField: "createdOn",
  sortOrder: 1,
  searchInput: "",
  dataCount: 0,
  roleName:"",
};

// Create login slice
const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      localStorage.removeItem('token');
      axios.defaults.headers.common['Authorization'] = '';
    },
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
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<addUserResponse>) => {
        state.isLoading = false;
       
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add getAllUser cases
      .addCase(getAllUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getAllUserData = action.payload.data.listData || [];
        state.dataCount = action.payload.data.dataCount;

      })
      .addCase(getAllUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.token = action.payload.data?.token || null;
        // state.roleName = action.payload.data?.roleName || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle successful update (you may want to update the user data in the state)
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
    ;
  },
});

// Export actions & reducer
export const { logout, setOffset, setLimit, setSortField, setSortOrder, setSearchInput } = loginSlice.actions;
export default loginSlice.reducer;