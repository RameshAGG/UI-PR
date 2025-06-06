import { useNavigate } from 'react-router-dom';
import Axios from '../axios-config/axiosInstance.ts';
import { decryptData, encryptData } from '../storageHelper.ts';


export const useAuth = () => {
  const navigate = useNavigate();

  const login = async (credentials: any) => {
    try {
      // Your login API call here
      const response: any= await Axios.post('/auth/login', credentials);
      localStorage.setItem('token', encryptData(response.data.token));
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isAuthenticated = () => {
    // return !!localStorage.getItem('token');
    const encryptedToken = localStorage.getItem('token');
    const token = decryptData(encryptedToken);
    return !!token;
  };

  return { login, logout, isAuthenticated };
}; 