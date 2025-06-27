import { configureStore } from "@reduxjs/toolkit";
import userRegisterSlice from "../slices/UserRegistrationSlice.ts";
import MaterialCategorySlice from "../slices/MaterialCategorySlice.ts";
import MasterSlice from "../slices/MasterSlice.ts";
import siteManagementReducer from '../slices/SiteManagementSlice.ts';
import TowerManagementSlice from "../slices/TowerManagementSlice.ts";
import dashboardReducer from '../slices/dashboardSlice.ts';
import MeterialMasterSlice from "../slices/MeterialMasterSlice.ts";
import materialListMasterSlice from "../slices/MaterialListMasterSlice.ts";
import PriorityMasterSlice from "../slices/PriorityMasterSlice.ts";
// import RoleMaster from "../screens/Masters/RoleMaster.tsx";
import RoleMasterslice from "../slices/RoleMasterslice.ts";
import MaterialRequestSlice from "../slices/MaterialRequestSlice.ts";
import materialAllocationSlice from "../slices/MaterialAllocationSlice.ts";

import accessoryMaster from '../slices/AccessorySlice.ts';
import accessoriesListMasterSlice from '../slices/AccessoriesListMasterSlice.ts';
import vendorManagementSlice from '../slices/VendorManagement.Slice.ts';
import breadcrumbReducer from '../slices/BreadcrumbSlice.ts';
import repetitionReducer from '../slices/RepititionSlice.ts';
import HandOverSlice from '../slices/HandOverslice.ts';




import requestReducer from '../slices/RequestSlice.ts';
import itemReducer from '../slices/itemSlice.ts';
import itemPricesSlice from '../slices/itemPricesSlice.ts';
import SupplierSlice from '../slices/SupplierSlice.ts';

const store = configureStore({
    reducer: {
        requestManagement: requestReducer,
        items: itemReducer, // ✅ register here
        suppliers: SupplierSlice,
        itemPrices: itemPricesSlice,








        userRegister: userRegisterSlice,
        materialCategory: MaterialCategorySlice,
        MasterSlice: MasterSlice,
        MeterialMasterSlice: MeterialMasterSlice,
        MaterialListMaster: materialListMasterSlice,
        siteManagement: siteManagementReducer,
        towerManagement: TowerManagementSlice,
        dashboard: dashboardReducer,
        PriorityMasterSlice: PriorityMasterSlice,
        RoleMaster: RoleMasterslice,
        accessoryMaster: accessoryMaster,
        accessoriesListMaster: accessoriesListMasterSlice,
        MaterialRequest: MaterialRequestSlice,
        materialAllocation: materialAllocationSlice,
        vendorManagement: vendorManagementSlice,
        breadcrumb: breadcrumbReducer,
        repetition: repetitionReducer,
        handOver: HandOverSlice
    }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
