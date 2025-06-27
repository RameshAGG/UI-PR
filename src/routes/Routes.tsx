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
import Items from "../screens/Managements/RFQ.tsx";
import RequestPreview from "../screens/requests/RequestPreview.tsx";
import CreateRequestPage from "../screens/requests/CreateRequestPage.tsx";
import BulkUpload from "../screens/Bulk_Upload/BulkUpload.tsx";
import RfqRequestPreview from "../screens/requests/RfqRequestPreview.tsx";
import RFQ_Upload from "../screens/Managements/RFQ_Upload.tsx";
import RfqUploadPriview from "../screens/requests/RfqUploadPriview.tsx";
import RFQDashboard from "../screens/requests/RFQDashboard.tsx";
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

                <Route path="rfq_dashboard" element={<RFQDashboard />} />
                <Route path="rfq" element={<Items />} />
                <Route path="requests" element={<Requests />} />
                <Route path="Rfq_Upload" element={<RFQ_Upload />} />
                <Route path="requestpreview" element={<RequestPreview />} />
                <Route path="site-management" element={<SiteManagement />} />
                <Route path="bulkupload" element={<BulkUpload />} />
              
{/* <Route path="/requests/new" element={<CreateRequestPage />} /> */}
{/* <Route path="/requests/edit/:id" element={<EditRequestPage />} /> */}
                <Route path="/purchase-request/:id" element={<RequestPreview />} />
                <Route path="/Rfq_RequestPreview/:id" element={<RfqRequestPreview />} />
                <Route path="/Rfq_UploadPreview/:id" element={<RfqUploadPriview />} />
                <Route path="site-management-preview/:siteId" element={<SiteManagementPreview />} />
                <Route path="/masters/material-category-master" element={< MaterialCategoryMaster />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;
