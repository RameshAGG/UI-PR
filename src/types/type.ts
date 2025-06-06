export interface ICommonAPIResponse {
  message: string;
  success: boolean;
}

export interface IMaterialCategoryRes extends ICommonAPIResponse {
  data: {
    listData: ICategory[];
    dataCount: number;
  };
}
export interface ICategory {
  materialTypeId: number;
  materialtypeName: string;
  createdOn: string;
  isActive: boolean;
}
export interface IUserRes {
  id: number;
  userName: string;
  email: string;
  phoneNumber: string;
  city: string;
  state: string;
  country: string;
  zipCode: string | null;
  createdOn: string;
}
export interface IUser extends ICommonAPIResponse {
  data: {
    listData: IUserRes[];
    dataCount: number;
  };
}


export interface IMaterialCategoryReq {
  materialtypeName: string;
}

export interface IAddOrUpdateCategory extends ICommonAPIResponse {
  data: ICategory;
}


export interface ISiteReq {
  sitename: string;
  email: string;
  // sitecontact: string;
  operationalSince: string;
  siteownername: string;
  sitemanager: string;
  phoneNumber: string;
  alternatePhoneNumber: string;
  // isActive: boolean;
  handOverDate: string ;
  // ownershiptype?: string ;
  city: string;
  state: string;
  // country: string;
  zipcode: number| null ;
  address: string;
  latitude: string ;
  longitude: string ;
}
  export interface ISiteRes {
    siteId: number;
    sitename: string;
    email: string;
    sitecontact: string;
    operationalsince: Date;
    siteownername: string;
    sitemanager: string ;
    // managercontact: string ;
    // manageralternatecontact: string  | null;
    alternatePhoneNumber: string  | null;
    isActive: boolean;
    handoverdate: Date ;
    // ownershiptype: string ;
    city: string;
    state: string;
    // country: string;
    zipcode: string ;
    address: string;
    latitude: string;
    longitude: string;
  }
export interface ISiteAPIPayload {
  siteId: number;
  siteName: string;
  operationalSince: string;
  siteOwnerName: string;
  siteManagerName: string;
  emailId: string;
  phoneNumber: string;
  siteAddress: string;
  city: string;
  state: string;
  zipcode?: number | null;
  latitude?: string;
  longitude?: string;
  alternatePhoneNumber?: string;
  // ownershiptypeId?: string;
  handOverDate?: string;
  isActive?: boolean;
}
export interface ISiteResponse extends ICommonAPIResponse {
    data: {
      listData: ISiteRes[];
      dataCount: number;
    };
}

//  -------------------- tower management
export interface ITowerManagement {
  id: number | null;
  towerName: string;
  shortName: string;
  originDate: Date;
  handOverDate: Date;
  isActive: boolean;
}

export interface ITowerListRes extends ICommonAPIResponse {
  data: {
  listData: ITowerManagement[];
  dataCount: number;
 }
}
export interface ISitesTower {
  id: number;
  siteName: string;
  siteId: number;
  city: string;
  towerCount: number;
}

export interface IAllSitesRes extends ICommonAPIResponse {
  data: {
    data: ISitesTower[];
    sitecount: number;
  }
}
export interface ICreateTowerReq {
  towerName: string;
  shortName: string;
  originDate: Date;
  handOverDate: Date;
}
export interface ITowerManagementRes extends ICommonAPIResponse {
  data: {
    listData: ITowerManagement[];
    dataCount: number;
  }
}

export interface IAddOrUpdateTower extends ICommonAPIResponse {
  data: ITowerManagement;
}

//  -------------------- material name master
export interface IMaterialName {
  materialNameId: number;
  materialName: string;
  isActive: boolean;
  createdOn: string;
}

export interface IMaterialListNameRes extends ICommonAPIResponse {
  data: {
  data: IMaterialListName[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  }
}

export interface IMaterialListName {
  id: number;
  count: number;
  stock: number;
  runningMeter: number;
  height: number;
  width: number;
  area: number;
  materialName: string;
  materialNameId: number;
  idsequence: string;
  siteName: string;
  towerName: string;
  city: string;
  state: string;
  siteId: number;
  towerId: number;
}

export interface IMaterialNameRes extends ICommonAPIResponse {
 data: {
  listData: IMaterialName[];
  dataCount: number;
 }
}

export interface IAddOrUpdateMaterialName extends ICommonAPIResponse {
  data: IMaterialName;
}

export interface IMaterialData extends ICommonAPIResponse {
  data: IMaterialNameRes[]
}


//  -------------------- material list master
export interface IMaterialListMaster {
  id: number;
  idsequence: number;
  materialName: string;
  materialTypeId: string;
  quantity: number;
  height: number | null;
  width: number | null;
  area: number | null;
  runningMeter: number | null;
  createdOn: string;
  isActive: boolean;
  materialTypeName: string;
  materialListId: number;
  materialNameId: number;
  repetitionCount: number;
}

export interface IMaterialListMasterToggle {
  materialListId: number;
  isActive: boolean;
}

export interface IMaterialListMasterRes extends ICommonAPIResponse {
  data: {
    listData: IMaterialListMaster[];
    dataCount: number;
  };
}

export interface IGetVendorRes extends ICommonAPIResponse {
  data: IVendorRes[]
}


export interface IMaterialListMasterReq {
  id?:number,
  materialName: string;
  materialTypeId: string;
  quantity: number | null;
  height: number | null;
  width: number | null;
  area: number | null;
  runningMeter: number | null;
  materialListId: number;
}

export interface IAddOrUpdateMaterialMasterList extends ICommonAPIResponse {
  data: IMaterialListMaster;
}

//  -------------------- priority master
export interface IPriority {
  priorityId: number;
  priorityName: string;
  isActive: boolean;
  createdOn: string;
}
export interface IPriorityResponse extends ICommonAPIResponse {
  data: {
    listData: IPriority[];
    dataCount: number;
  };
}

export interface IAddOrUpdatePriority extends ICommonAPIResponse {
  data: IPriority;
}

export interface IRole{
  roleId:number;
  roleName:string;
  isActive:boolean;
  createdOn:string;
}

// for get req
export interface IRoleResponse extends ICommonAPIResponse{
  data :{
  listData: IRole[];
  dataCount: number;
  }
}


export interface IAddOrUpdateRole extends ICommonAPIResponse{
  data:IRole;
}
//  -------------------- accessory master
export interface IAccessoriesName {
  materialTypeId: number;
  accessoriesNameId: number;
  accessoriesName: string;
  materialTypeName: string;
  isActive: boolean;
}

export interface IAccessoriesNameRes extends ICommonAPIResponse {
  data: {
    listData: IAccessoriesName[];
    dataCount: number;
  };
}

export interface IAccessoriesNameReq {
  materialTypeId: number;
  accessoriesName: string;
  isActive: boolean;
  createdOn: string;
}

export interface IAddOrUpdateAccessoriesName extends ICommonAPIResponse {
  data: IAccessoriesName;
}

  //  -------------------- accessories list master
export interface IAccessoriesListMaster {
  accessoriesListId: number;
  accessoriesNameId: number;
  isActive: boolean;
  quantity: number;
  createdOn: string;
  accessoriesName: string;
}

export interface IAccessoriesListMasterReq {
  accessoriesListId: number;
  // accessoriesNameId: number;
  quantity: number;
  // createdOn: string;
  // accessoriesName: string;
} 

export interface IAccessoriesListMasterToggle {
  accessoriesListId: number;
  isActive: boolean;
}

export interface IAccessoriesListMasterRes extends ICommonAPIResponse {
  data: {
    listData: IAccessoriesListMaster[];
    dataCount: number;
  };
}
export interface IAddOrUpdateAccessoriesListMaster extends ICommonAPIResponse {
  data: IAccessoriesListMasterReq;
} 

export interface IUnit {
  unitId: number;
  unitName: string;
}

export interface IUnitRes extends ICommonAPIResponse {
  data: IUnit[];
}

export interface IAddOrUpdateUnit extends ICommonAPIResponse {
  data: IUnit;
}


export interface IAccessoriesNameByUnit {
  accessoriesNameId: number;
  accessoriesName: string;
} 

export interface IAccessoriesNameByUnitRes extends ICommonAPIResponse {
  data: IAccessoriesNameByUnit[];
}

export interface IAccessoriesUpdateByUnit extends ICommonAPIResponse {
  data: IAccessoriesNameByUnit;
}         

export interface ICommonListPayloadDto {
  searchInput: string;
  offset: number;
  limit: number;
  sortField: string;
  sortOrder: number | null;
}

export interface ITowerManagementReqDto extends ICommonListPayloadDto {
siteId : number
searchInput: string;
offset: number;
limit: number;
sortField: string;
sortOrder: number | null;
}

// material request
// card  type 
export interface IMaterialRequestSummary  {
  total_requests: number;
  total_received: number;
  total_allocated: number;
  total_in_transit: number;
  total_approved: number;
  total_rejected: number;
}

// card response
export interface IMaterialRequestSummaryRes extends ICommonAPIResponse{
  data:IMaterialRequestSummary;

}

//  request and requirement table 

// request
//  for panel amnd special panels
export interface IMaterialRequirementReqPanelSpecialReq {
  towerId: number; 
  materialNameId: number;
  width: number;
  height: number;
  requiredQuantity: number | undefined  ;
  area: number;
  priorityId: number; 
  dateOfRequirement: Date  | string;
  materialPurpose: string;
  issueInReceivedMaterial?: string;
 
}

//  for ec and eg
export interface IMaterialRequirementExternalCornerReq {
  towerId: number; 
  materialNameId: number;
  width: number;
  height: number;
  requiredQuantity: number | undefined  ;
  runningMeters: number;
  priorityId: number; 
  dateOfRequirement: Date  | string;
  materialPurpose: string;
  issueInReceivedMaterial?: string;
}

export interface IMaterialRequirementElevationGroovesReq {
  towerId: number; 
  materialNameId: number;
  width: number;
  height: number;
  requiredQuantity: number | undefined  ;
  priorityId: number; 
  dateOfRequirement: Date  | string;
  materialPurpose: string;
  issueInReceivedMaterial?: string;
}
// accessories req iinterface

export interface IAccessoriesNameReq{
  towerId: number;
  materialNameId: number;
  requiredQuantity:  number | undefined  ;
  priorityId: number;
  dateOfRequirement:  Date  | string;
  materialPurpose: string;
  issueInReceivedMaterial: string;
}

export interface IMaterialRequestRequirementsReq{
  siteId:number | null;
  description:string;
  statusId?: number;
  materialRequirementsPanel:IMaterialRequirementReqPanelSpecialReq[];
  materialRequirementsSpecialPanel:IMaterialRequirementReqPanelSpecialReq[];
  materialRequirementsExternalCorner:IMaterialRequirementExternalCornerReq[];  
  materialRequirementsExternalGrooves:IMaterialRequirementElevationGroovesReq[];  
  accessories:IAccessoriesNameReq[];
}



export interface IMaterialRequestRequirementsCommomnReq extends ICommonAPIResponse{

  data:IMaterialRequestRequirementsReq[];
}

// resposne
export interface IMaterialRequirementRes {
  materialRequirementId: number; 
  materialNameId: number | null;   
  materialName: string | null;  
  accessoriesNameId: number | null;  
  accessoriesName: string | null;   
  requiredQuantity: number;
  width: number;
  height: number;
  dateOfRequirement: Date;
  materialPurpose: string;
  issueInReceivedMaterial: string;  
  priorityName: string;
  priorityId: number; 
  statusId: number;  
  statusName: string;
  towerName: string;
  towerId: number | null ;    
  siteId: number;
  materialRequestId:number
}





export interface IMaterialRequesRequirementstRes{
  id:number;
  materialRequestId:number
  // materialNames:[];
  count:number;
  description:string;
  dateOfRequest:Date,
  requestStatus?: string;
  materialRequirements:IMaterialRequirementRes[];
}
export interface ImaterialRequestRequirementscommonRes extends ICommonAPIResponse{
 
  data:{
    data:IMaterialRequesRequirementstRes[];
    dataCount:number;

  }

}

export interface IHeight{
  height: number;
}

export interface IHeightRes extends ICommonAPIResponse {
  data: IHeight[]; 
}


export interface IWidth{
  width: number;
}

export interface IWidthRes extends ICommonAPIResponse {
  data: IWidth[]; 
}

export interface IspecialPanelAreasReq{
  materialNameId:number
  height:number;
  width:number;
  search:string;
}

export interface IspecialPanelAreasRes{
  area:number
}
export interface ISpecialPanelAreasCommonRes extends ICommonAPIResponse{
  data:IspecialPanelAreasRes[] 
}

export interface IExternalCornerRunningMetersReq{
  materialNameId:number
  height:number | null;
  width:number | null;
  search:string;
}

export interface IExternalCornerRunningMetersRes{
  runningMeters:number
}

export interface IExternalCornerRunningMeterscommonRes{
  data:IExternalCornerRunningMetersRes[];
}
export interface IDropDownMaterialNames{
  id:number;
  MaterialName:string
}

export interface IDropDownMaterialNamesRes extends ICommonAPIResponse {
  data: {
    panel: IDropDownMaterialNames[];
    specialPanel: IDropDownMaterialNames[];
    externalCorner: IDropDownMaterialNames[];
    elevationGrooves: IDropDownMaterialNames[];
    accessories:IDropDownMaterialNames[]
  };
}


export interface ISiteManagerRes extends ICommonAPIResponse {
    data: ISiteManager[];
}

export interface ISiteManager {
  id: number;
  sitemanager: string;
  role: string;
}

export interface IEditMaterialRequirement {
  id:number | undefined;
  materialNameId: number | undefined;
  accessoriesNameId:number | undefined;
  towerId: number | undefined;
  height:number;
  width:number;
  requiredQuantity: string;
  dateOfRequirement: string;
  materialPurpose: string;
  priorityId: number | undefined;
}

export interface IEditMaterialRequirementRes extends ICommonAPIResponse{

 data:IEditMaterialRequirement;
}

export interface MaterialReqStatusSummary {
  requested: number;
  received: number;
  allocation: number;
  allocated: number;
  intransit: number;
  approved: number;
  rejected: number;
}

export interface MaterialReqStatusSummaryRes extends ICommonAPIResponse{
  data:MaterialReqStatusSummary;

}
//  get all material requiremenst by req id
export interface IMaterialRequirementResCommon extends ICommonAPIResponse{
  data:IMaterialRequirementRes[]
}

export interface IUserDetails {
    userName: string;
    email: string;
    phoneNumber: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    address: string;
    isActive: boolean;
}
export interface IinTransitRequirements {
  allocatedSiteId: number;
  siteName: string;
  location: string;
  dispatchedDate: string;  
  items: string[];        
  ebilid: number;         
}


export interface IinTransitRequirementsCommon extends ICommonAPIResponse{
  data:IinTransitRequirements[]
}
export interface IVendorReq {
  vendorName: string;
  // businessType: string;
  gstOrTaxNumber: string;
  panNumber: string;
  businessRegistrationNumber: string;
  contactPersonName: string;
  emailId: string;
  phoneNumber: string;
  alternatePhoneNumber?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
}

export interface  IReceivedRequirements {
  allocatedSiteId: number;
  siteName: string;
  location: string;
  dispatchedDate: string;  
  items: string[];        
  ebilid: number; 
  receivedDate:string;
}

export interface IReceivedRequirementsCommon extends ICommonAPIResponse{
  data:IReceivedRequirements[]
}

export interface IVendorRes {
  vendorId: number;
  vendorName: string;
  // businessType: string;
  gstOrTaxNumber: string;
  contactNumber: string;
  city: string;
  isActive: boolean;
}

export interface IVendorResponse extends ICommonAPIResponse {
  data: {
    listData: IVendorRes[];
    dataCount: number;
  };
}

export interface MaterialRequestStatus {
  totalRequests: number;
  pendingRequests: number;
  fulfilledRequests: number;
  averageFulfillmentDays: number;
}

export interface MaterialRequestStatusRes extends ICommonAPIResponse{
  data:MaterialRequestStatus;
}

//  -------------------- repetition
export interface IRepetitionReq {
  id: number;
  towerId: number;
  siteId:number;
  currentRepititionCount: number;
  towerName: string;
  towerShortName: string;

}

export interface IRepetitionRes extends ICommonAPIResponse{
  data: {
    listData: IRepetitionReq[];
    dataCount: number;
  };
}

export interface IRepetitionResCommon extends ICommonAPIResponse{
  data: {
    listData: IRepetitionReq[];
    dataCount: number;
    sitecount: number;
  };
}
export interface IHandoverMaterialByIdRes {
  id: number; //requirement id
  materialNameId: number;
  height: number;
  width: number;
  area: number;
  returnedstock: number | null;
  totalAllocatedQuantity: number | null;
siteId:number;
towerId:number
godownId:number;

}
export interface HandoverMaterialByIdResCommonRes extends ICommonAPIResponse{
  data:IHandoverMaterialByIdRes[]

}

export interface IReturnedStockReq{
  
  requestId:number;
  requirementId:number;
  materialNameId: number;
  height: number;
  width: number;
  returnedStock: number | null;
  // totalAllocatedQuantity:number;
siteId:number;
towerId:number
godownId:number;
}

export interface IReturnStock{
  ReturnToGodownDto:IReturnedStockReq[];
}
