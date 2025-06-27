import React, { useEffect, useState, useRef } from 'react';
import * as yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { createSite, getAllSites, fetchTowers, updateSite, setOffset, setLimit, setSortField, setSortOrder, setSearchInput } from '../../slices/SiteManagementSlice.ts';
import { useNavigate, useLocation } from 'react-router-dom';
import { setBreadcrumbs } from '../../slices/BreadcrumbSlice.ts';


interface UserFormValues {
    id: number;
    siteName: string;
    operationalSince: string;
    ownershipType?: string;
    siteOwnerName: string;
    siteManagerName: string;
    emailId: string;
    phoneNumber: string;
    alternatePhoneNumber: string;
    siteAddress: string;
    city: string;
    state: string;
    pincode: string;
    latitude: string;
    longitude: string;
}


const RFQDashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const [query, setQuery] = useState("");
    const [isSideSheetOpen, setSideSheetOpen] = useState(false);
    const { sites, loading, dataCount, offset, limit } = useSelector((state: RootState) => state.siteManagement);
    const [sortedData, setSortedData] = useState<UserFormValues[]>([]);
    const [selectedSite, setSelectedSite] = useState<number | null>(null);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
    const [confirmationMessage, setConfirmationMessage] = useState("Do you want to submit the form?");
    const { getSitebyIdvalue } = useSelector((state: RootState) => state.siteManagement);

    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<UserFormValues | null>(
        null
    );
    const [sortConfig, setSortConfig] = useState<{
        key: string;
        order: "ascend" | "descend" | null;
    }>({
        key: "",
        order: null,
    });


    useEffect(() => {
        dispatch(setBreadcrumbs([
            {
                title: "Dashboard Management",
                path: '/rfq_dashboard'
            }
        ]));
    }, []);




    return (
     <div>

     </div>
    );
};
export default RFQDashboard;