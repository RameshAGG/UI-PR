import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SiteManagement from "../screens/Managements/SiteManagement.tsx";
import LayoutComponent from "../components/layout/Layout.tsx"
import MaterialCategoryMaster from "../screens/Masters/MaterialCategoryMaster.tsx";
import Login from "../screens/Login.tsx";
import SiteManagementPreview from "../screens/Managements/Sitemanagement_preview.tsx";
import ForgetPassword from "../screens/forgetpassword.tsx";
import AuthGuard from '../../src/components/AuthGuard.tsx';
import Requests from "../screens/requests/Requests.tsx";
import Items from "../screens/Managements/Items.tsx";
import RequestPreview from "../screens/requests/RequestPreview.tsx";
import CreateRequestPage from "../screens/requests/CreateRequestPage.tsx";
const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes - No AuthGuard */}
            <Route path="/login" element={<Login />} />
            {/* <Route path="/setpassword" element={<SetPassword />} /> */}
            <Route path="/forgetpassword" element={<ForgetPassword />} />

            {/* Protected Routes - Wrapped in AuthGuard */}
            {/* <Route element={<AuthGuard><LayoutComponent /></AuthGuard>}> */}
            <Route element={<LayoutComponent />}>

                <Route path="items" element={<Items />} />
                <Route path="requests" element={<Requests />} />
                <Route path="requestpreview" element={<RequestPreview />} />
                <Route path="site-management" element={<SiteManagement />} />
              
{/* <Route path="/requests/new" element={<CreateRequestPage />} /> */}
{/* <Route path="/requests/edit/:id" element={<EditRequestPage />} /> */}
                <Route path="site-management-preview/:siteId" element={<SiteManagementPreview />} />
                <Route path="/masters/material-category-master" element={< MaterialCategoryMaster />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;
