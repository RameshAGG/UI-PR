import React, { useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';
import AppRoutes from './routes/Routes.tsx';
import { setupAxiosInterceptors } from '../src/axios-config/axiosInstance.ts';
// import axiosInstance from '../axios-config/axiosInstance';
import { AuthProvider } from '../src/context/AuthContext.tsx';
import { PermissionsProvider } from './casl/permissions-provider.js';

function App() {
  useEffect(() => {
    setupAxiosInterceptors();
  }, []);

  return (
    <AuthProvider>
       <PermissionsProvider>
        <AppRoutes />
       </PermissionsProvider>
    </AuthProvider>
  );
}

export default App;
