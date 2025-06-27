// import React, { useEffect, useState, useRef } from 'react';
// import * as yup from "yup";
// import CustomTable from '../../components/common/Table.tsx';
// import Searchbar from '../../components/common/Searchbar.tsx';
// import SideSheet from '../../components/common/Sidesheet.tsx';
// import { Formik, FormikProps } from 'formik';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '../../store/store';
// import RequiredLabel from '../../components/common/RequiredLabel.tsx';
// import Confirmation from '../../components/common/Confirmation.tsx';
// import { notification, Pagination } from 'antd';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { IRequest, IRequestListPayload } from '../../type/type.ts';
// import { getAllRequests, createPurchaseRequest } from '../../slices/RequestSlice.ts';
// import RequestsForm from '../../screens/requests/RequestsForm.tsx';
// import { capitalizeFirstLetter } from '../../utils/util.service.ts';
// import { setBreadcrumbs } from '../../slices/BreadcrumbSlice.ts';
// import { getAllItems } from '../../slices/itemSlice.ts';
// import { getAllSuppliers } from '../../slices/SupplierSlice.ts';
// import PaginatedTable from '../../components/PaginatedTable';

// // Define interfaces
// interface RequestFormValues {
//   department: string;
//   date_requested: string;
//   status: string;
//   items: {
//     item: {
//       id: number;
//       name: string;
//     };
//     itemName: string;
//     category: string;
//     subcategory: string;
//     suppliers: {
//       supplierId: number;
//       supplierName: string;
//       supplierEmail: string;
//       supplierContact: string;
//       supplierTel: string;
//       isNewSupplier: boolean;
//       selected: boolean;
//     }[];
//   }[];
//   suggestion_items: any[];
// }

// interface RequestItem {
//   item_id: number | null;
//   item_name: string;
//   category: string;
//   sub_category: string;
//   item_type: boolean;
//   is_new_item: boolean;
//   supplier: {
//     is_new_supplier: boolean;
//     supplier_id: number | null;
//     name: string;
//     email: string;
//     mob_num: string;
//     tel_num: string;
//   }[];
// }

// interface CreatePurchaseRequestPayload {
//   department: string;
//   date_requested: string;
//   status: string;
//   items: RequestItem[];
//   suggestion_items: Array<{
//     item_name: string;
//     category: string;
//     sub_category: string;
//   }>;
//   suggestion_suppliers: Array<{
//     name: string;
//     email: string;
//     mob_num: string;
//     tel_num: string;
//   }>;
// }

// const RequestsManagement: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const location = useLocation();
//   const navigate = useNavigate();

//   // State management
//   const [query, setQuery] = useState("");
//   const [isSideSheetOpen, setSideSheetOpen] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
//   const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
//   const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
//   const [confirmationMessage, setConfirmationMessage] = useState("Do you want to submit the form?");

//   // Pagination and sorting state
//   const [offset, setOffset] = useState(0);
//   const [limit, setLimit] = useState(10);
//   const [sortField, setSortField] = useState<string | null>(null);
//   const [sortOrder, setSortOrder] = useState<number | null>(null);

//   const [sortConfig, setSortConfig] = useState<{
//     key: string;
//     order: "ascend" | "descend" | null;
//   }>({
//     key: "",
//     order: null,
//   });


//   const handlePaginationChange = (page: number, newPageSize?: number) => {
//     const newOffset = page - 1; // Convert to 0-based index
//     setOffset(newOffset);

//     if (newPageSize && newPageSize !== limit) {
//       setLimit(newPageSize);
//       setOffset(0); // Reset to first page when page size changes
//     }
//   };
//   // Redux state - Update this to match your requests slice state structure
//   const { requests, loading, error, dataCount } = useSelector((state: RootState) => state.requestManagement);

//   // Updated initial values for Request form
//   const initialValues: RequestFormValues = {
//     department: '',
//     date_requested: new Date().toISOString().split('T')[0],
//     status: 'pending',
//     items: [{
//       item: { id: 0, name: '' },
//       itemName: '',
//       category: '',
//       subcategory: '',
//       suppliers: [{
//         supplierId: 0,
//         supplierName: '',
//         supplierEmail: '',
//         supplierContact: '',
//         supplierTel: '',
//         isNewSupplier: false,
//         selected: false
//       }]
//     }],
//     suggestion_items: []
//   };

//   const showNotification = (type: "success" | "error", message: string) => {
//     notification[type]({
//       message,
//       placement: "top",
//     });
//   };

//   const handleSearch = (value: string) => {
//     setQuery(value);
//     setOffset(0);
//   };

//   // const handlePaginationChange = (page: number, newPageSize?: number) => {
//   //   setOffset(page - 1);
//   //   if (newPageSize && newPageSize !== limit) {
//   //     setLimit(newPageSize);
//   //   }
//   // };

//   const handleRowClick = (request: IRequest) => {
//     try {
//       setSelectedRequest(request.id);
//       navigate(`/purchase-request/${request.id}`, {
//         state: {
//           selectedRequest: request
//         },
//         replace: true
//       });
//     } catch (error) {
//       showNotification("error", "Navigation failed");
//     }
//   };

//   const handleSortChange = (_: any, __: any, sorter: any) => {
//     if (Array.isArray(sorter)) {
//       sorter = sorter[0];
//     }

//     const { field, order } = sorter || {};
//     const sortOrderValue = order === 'ascend' ? 1 : order === 'descend' ? -1 : null;

//     setSortConfig({
//       key: field || "",
//       order: order || null
//     });

//     setSortField(field || null);
//     setSortOrder(sortOrderValue);
//   };

//   // Fetch requests data
//   const fetchRequestsData = () => {
//     const payload: IRequestListPayload = {
//       offset,
//       limit,
//       // sortField,
//       // sortOrder,
//       searchInput: query
//     };

//     dispatch(getAllRequests(payload));
//   };

//   useEffect(() => {
//     fetchRequestsData();
//   }, [dispatch, offset, limit, sortField, sortOrder, query]);

//   useEffect(() => {
//     if (location.state?.editMode && location.state?.requestData) {
//       const requestData = location.state.requestData;
//       setSelectedRequest(requestData.id);
//       setSideSheetOpen(true);

//       setTimeout(() => {
//         if (formikRef.current) {
//           formikRef.current.setValues({
//             department: requestData.department || '',
//             date_requested: requestData.date_requested || '',
//             status: requestData.status || 'pending',
//             items: requestData.items.map(item => ({
//               item: { id: item.id, name: item.name },
//               itemName: item.name,
//               category: item.category,
//               subcategory: item.subcategory,
//               suppliers: item.suppliers.map(supplier => ({
//                 supplierId: supplier.id,
//                 supplierName: supplier.name,
//                 supplierEmail: supplier.email,
//                 supplierContact: supplier.contact,
//                 supplierTel: supplier.tel,
//                 isNewSupplier: false,
//                 selected: supplier.selected
//               })),
//             })),
//             suggestion_items: []
//           });
//         }
//       }, 0);
//     }
//   }, [location.state]);

//   useEffect(() => {
//     dispatch(setBreadcrumbs([
//       {
//         title: "Requests",
//         path: '/requests'
//       }
//     ]));
//   }, []);

//   // Add API calls when side sheet opens
//   useEffect(() => {
//     if (isSideSheetOpen) {
//       console.log('Side sheet opened, triggering API calls...');
//       dispatch(getAllItems({}));
//       dispatch(getAllSuppliers({}));
//     }
//   }, [isSideSheetOpen, dispatch]);

//   // Add debug logs for Redux state
//   const { items, loading: itemsLoading } = useSelector((state: RootState) => state.items);
//   const { suppliers, loading: suppliersLoading } = useSelector((state: RootState) => state.suppliers);

//   useEffect(() => {
//     console.log('Items state:', { items, itemsLoading });
//   }, [items, itemsLoading]);

//   useEffect(() => {
//     console.log('Suppliers state:', { suppliers, suppliersLoading });
//   }, [suppliers, suppliersLoading]);

//   // Updated columns for Request table
//   const columns = [
//     {
//       title: <span className="text-[#6D6D6D]">S.No</span>,
//       dataIndex: 'id',
//       key: 'id',
//       render: (_: any, __: any, index: number) =>
//         (offset * limit + index + 1).toString().padStart(2, "0"),
//       width: 80,
//     },
//     {
//       title: <span className="text-[#6D6D6D]">Request ID</span>,
//       dataIndex: 'id',
//       key: 'id',
//       sorter: true,
//       sortDirections: ["ascend", "descend"],
//       sortOrder: sortConfig.key === "id" ? sortConfig.order : null,
//       render: (id: number) => <span className="text-[#0A0A0A] font-medium text-sm">REQ-{id}</span>,
//     },
//     {
//       title: <span className="text-[#6D6D6D]">Department</span>,
//       dataIndex: 'department',
//       key: 'department',
//       sorter: true,
//       sortDirections: ["ascend", "descend"],
//       sortOrder: sortConfig.key === "department" ? sortConfig.order : null,
//       render: (department: string) => (
//         <span className="text-[#0A0A0A] font-medium text-sm">
//           {capitalizeFirstLetter(department)}
//         </span>
//       ),
//     },
//     // {
//     //   title: <span className="text-[#6D6D6D]">Item Name</span>,
//     //   dataIndex: 'item',
//     //   key: 'item_name',
//     //   sorter: true,
//     //   sortDirections: ["ascend", "descend"],
//     //   sortOrder: sortConfig.key === "item_name" ? sortConfig.order : null,
//     //   render: (item: { id: number; name: string }) => (
//     //     <span className="text-[#0A0A0A] font-medium text-sm">
//     //       {capitalizeFirstLetter(item?.item_name || 'N/A')}
//     //     </span>
//     //   ),
//     // },
//     {
//       title: <span className="text-[#6D6D6D]">Required date</span>,
//       dataIndex: 'date_requested',
//       key: 'date_requested',
//       sorter: true,
//       sortDirections: ["ascend", "descend"],
//       sortOrder: sortConfig.key === "date_requested" ? sortConfig.order : null,
//       render: (date_requested: string) => {
//         if (!date_requested) return '-';

//         try {
//           const date = new Date(date_requested);
//           const formattedDate = date.toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: '2-digit'
//           });
//           return <span className="text-[#0A0A0A] font-medium text-sm">{formattedDate}</span>;
//         } catch (error) {
//           return <span className="text-[#0A0A0A] font-medium text-sm">{date_requested}</span>;
//         }
//       }
//     },
//     {
//       title: <span className="text-[#6D6D6D]">Status</span>,
//       dataIndex: 'status',
//       key: 'status',
//       sorter: true,
//       sortDirections: ["ascend", "descend"],
//       sortOrder: sortConfig.key === "status" ? sortConfig.order : null,
//       render: (status: string) => {
//         const getStatusColor = (status: string | undefined | null) => {
//           if (!status) return 'text-gray-600 bg-gray-100';

//           switch (status.toLowerCase()) {
//             case 'pending':
//               return 'text-yellow-600 bg-yellow-100';
//             case 'approved':
//               return 'text-green-600 bg-green-100';
//             case 'rejected':
//               return 'text-red-600 bg-red-100';
//             case 'in-progress':
//               return 'text-blue-600 bg-blue-100';
//             case 'completed':
//               return 'text-green-600 bg-green-100';
//             default:
//               return 'text-gray-600 bg-gray-100';
//           }
//         };

//         return (
//           <span className={`font-semibold px-2 py-1 rounded-full text-xs ${getStatusColor(status)}`}>
//             {status ? capitalizeFirstLetter(status) : 'N/A'}
//           </span>
//         );
//       }
//     },
//   ];

//   // Updated validation schema for Request form
//   const requestSchema = yup.object().shape({
//     department: yup.string()
//       .required("Department is required"),
//     date_requested: yup.date()
//       .required("Requested Date is required")
//       .typeError("Invalid date format"),
//     status: yup.string().required("Status is required"),
//     items: yup.array().of(
//       yup.object().shape({
//         item: yup.object().shape({
//           id: yup.number(),
//           name: yup.string().required("Item name is required")
//         }),
//         category: yup.string().required("Category is required"),
//         subcategory: yup.string().required("Subcategory is required"),
//         suppliers: yup.array().of(
//           yup.object().shape({
//             supplierId: yup.number(),
//             supplierName: yup.string().required("Supplier name is required"),
//             selected: yup.boolean()
//           })
//         )
//       })
//     )
//   });

//   const formikRef = useRef<FormikProps<RequestFormValues>>(null);

//   return (
//     <Formik
//       innerRef={formikRef}
//       initialValues={initialValues}
//       // validationSchema={requestSchema}
//       enableReinitialize={true}
//       onSubmit={async (values, { resetForm }) => {
//         // Validate items before submission
//         const hasInvalidItems = values.items.some(item => !item.itemName);
//         if (hasInvalidItems) {
//           showNotification("error", "Please enter valid items for all entries");
//           return;
//         }

//         // Check if each item has at least one selected supplier
//         const hasInvalidSuppliers = values.items.some(item => {
//           const selectedSuppliers = item.suppliers?.filter(supplier => supplier.selected);
//           return !selectedSuppliers || selectedSuppliers.length === 0;
//         });

//         if (hasInvalidSuppliers) {
//           showNotification("error", "Please select at least one supplier for each item");
//           return;
//         }

//         // Format the date properly
//         const formattedDate = values.date_requested 
//           ? new Date(values.date_requested).toISOString().split('T')[0]
//           : new Date().toISOString().split('T')[0];

//         const payload: CreatePurchaseRequestPayload = {
//           department: values.department,
//           date_requested: formattedDate,
//           status: values.status,
//           items: values.items.map(item => {
//             const isNewItem = item.item.id === 0;

//             const requestItem: RequestItem = {
//               item_id: isNewItem ? null : item.item.id,
//               item_name: item.itemName,
//               category: item.category,
//               sub_category: item.subcategory,
//               item_type: !isNewItem,
//               is_new_item: isNewItem,
//               supplier: item.suppliers
//                 .filter(s => s.selected)
//                 .map(s => ({
//                   supplier_id: s.isNewSupplier ? null : s.supplierId,
//                   is_new_supplier: s.isNewSupplier,
//                   name: s.supplierName,
//                   email: s.supplierEmail,
//                   mob_num: s.supplierContact,
//                   tel_num: s.supplierTel
//                 }))
//             };
//             return requestItem;
//           }),
//           suggestion_items: values.items
//             .filter(item => item.item.id === 0)
//             .map(item => ({
//               item_name: item.itemName,
//               category: item.category,
//               sub_category: item.subcategory
//             })),
//           suggestion_suppliers: values.items
//             .flatMap(item => item.suppliers)
//             .filter(s => s.isNewSupplier && s.selected)
//             .map(s => ({
//               name: s.supplierName,
//               email: s.supplierEmail,
//               mob_num: s.supplierContact,
//               tel_num: s.supplierTel
//             }))
//         };

//         setConfirmationMessage("Do you want to submit the request?");
//         setIsConfirmationOpen(true);
//         setConfirmAction(() => async () => {
//           try {
//             setSideSheetOpen(false);
//             try {
//               if (selectedRequest) {
//                 // Update request logic here if needed
//                 showNotification("success", "Request updated successfully");
//               } else {
//                 // Create new request
//                 await dispatch(createPurchaseRequest(payload)).unwrap();
//                 showNotification("success", "Request created successfully");
//               }
//             } catch (error: any) {
//               showNotification("error", error?.message || "Operation failed");
//             }

//             // Refresh the requests list
//             fetchRequestsData();
//             resetForm();
//             setSideSheetOpen(false);
//             setSelectedRequest(null);
//           } catch (error: any) {
//             showNotification("error", error?.message || "Operation failed");
//           }
//           setIsConfirmationOpen(false);
//         });
//       }}
//     >
//       {({ handleSubmit, values, touched, errors, setFieldValue, handleChange, resetForm, setFieldTouched, validateField }) => (
//         <>
//           <div className="bg-[#EDF1F6] h-[76px] mt-[10px] flex justify-between items-center px-[20px]">
//             <p className="font-Montserrat font-semibold text-[20px] leading-[24.38px] text-[#0A0A0A]">Requests</p>
//             <div className="flex justify-end gap-3">
//               <div className="flex justify-end">
//                 <Searchbar search={query} onSearch={handleSearch} />
//               </div>

//               <SideSheet
//                 btnLabel={selectedRequest ? "Edit Request" : "Add New Purchase Request"}
//                 width={1030}
//                 title={selectedRequest ? "Edit Request" : "Add New Purchase Request"}
//                 isOpen={isSideSheetOpen}
//                 setOpen={setSideSheetOpen}
//                 onCancel={() => {
//                   setSideSheetOpen(false);
//                   resetForm();
//                   setSelectedRequest(null);
//                 }}
//                 onSubmit={handleSubmit}
//                 submitLabel={selectedRequest ? "Update" : "Submit"}
//               >
//                 <RequestsForm
//                   handleChange={handleChange}
//                   values={values}
//                   touched={touched} 
//                   errors={errors}
//                   setFieldTouched={setFieldTouched}
//                   validateField={validateField}
//                   setFieldValue={setFieldValue}
//                   initialValues={initialValues}
//                 />
//               </SideSheet>
//             </div>
//           </div>

//           {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//               {error}
//             </div>
//           )}

//           <div>
//             <CustomTable
//               columns={columns}
//               dataSource={requests}
//               loading={loading}
//               rowKey="id"
//               onChange={handleSortChange}
//               onRowClick={(record) => {
//                 handleRowClick(record);
//               }}
//               scrollHeight={800}
//             />
//           </div>

//           <div className="sticky bottom-0 flex justify-end py-4">
//          {/* Pagination */}
//          <Pagination
//               current={offset + 1}
//               total={dataCount}
//               pageSize={limit}
//               onChange={handlePaginationChange}
//               showSizeChanger={true}
//               pageSizeOptions={[10, 20, 50, 100]}
//               showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} requests`}
//             />

//           </div>

//           <Confirmation
//             label="Confirmation"
//             message={confirmationMessage}
//             isOpen={isConfirmationOpen}
//             onClose={() => setIsConfirmationOpen(false)}
//             onConfirm={confirmAction || (() => {})}
//             confirmButtonLabel="Confirm"
//           />
//         </>
//       )}
//     </Formik>
//   );
// };

// export default RequestsManagement;


import React, { useEffect, useState, useRef } from 'react';
import * as yup from "yup";
import CustomTable from '../../components/common/Table.tsx';
import Searchbar from '../../components/common/Searchbar.tsx';
import SideSheet from '../../components/common/Sidesheet.tsx';
import { Formik, FormikProps } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import RequiredLabel from '../../components/common/RequiredLabel.tsx';
import Confirmation from '../../components/common/Confirmation.tsx';
import { notification, Pagination } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { IRequest, IRequestListPayload } from '../../type/type.ts';
import { getAllRequests, createPurchaseRequest, setOffset, setLimit, setSortField, setSortOrder, setSearchInput } from '../../slices/RequestSlice.ts';
import RequestsForm from '../../screens/requests/RequestsForm.tsx';
import { capitalizeFirstLetter } from '../../utils/util.service.ts';
import { setBreadcrumbs } from '../../slices/BreadcrumbSlice.ts';
import PaginatedTable from '../../components/PaginatedTable';
import { getAllItemPrices } from '../../slices/itemPricesSlice.ts';

// Updated interface to match the new API response
interface IRequestResponse {
  id: number;
  department: string;
  date_requested: string;
  status: string;
  item_type: boolean;
  purchase_request_id: number;
  total_items: number;
  total_suppliers: number;
  items: {
    item: {
      id: number;
      name: string;
      uom: string;
      pack_size: number;
    };
  }
}

// Define interfaces
interface RequestFormValues {
  department: string;
  date_requested: string;
  status: string;
  items: {
    item: {
      id: number;
      name: string;
    };
    itemName: string;
    category: string;
    subcategory: string;
    quantity: number; // Add this line
    suppliers: {
      supplierId: number;
      supplierName: string;
      supplierEmail: string;
      supplierContact: string;
      supplierTel: string;
      isNewSupplier: boolean;
      selected: boolean;
    }[];
  }[];
  suggestion_items: any[];
}

interface RequestItem {
  item_id: number | null;
  item_name: string;
  category: string;
  sub_category: string;
  quantity: number; // Add this line
  item_type: boolean;
  is_new_item: boolean;
  supplier: {
    is_new_supplier: boolean;
    supplier_id: number | null;
    name: string;
    email: string;
    mob_num: string;
    tel_num: string;
  }[];
}

interface CreatePurchaseRequestPayload {
  department: string;
  date_requested: string;
  status: string;
  items: RequestItem[];
  suggestion_items: Array<{
    item_name: string;
    category: string;
    sub_category: string;
  }>;
  suggestion_suppliers: Array<{
    name: string;
    email: string;
    mob_num: string;
    tel_num: string;
  }>;
}

const RequestsManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();

  // State management
  const [query, setQuery] = useState("");
  const [isSideSheetOpen, setSideSheetOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState("Do you want to submit the form?");
  const { requests, loading, error, dataCount, offset, limit } = useSelector((state: RootState) => state.requestManagement);


  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<number | null>(null);

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    order: "ascend" | "descend" | null;
  }>({
    key: "",
    order: null,
  });


  // In your component
  // const handlePaginationChange = (page: number, pageSize: number) => {

  //   const newOffset = (page - 1) * pageSize;

  //   dispatch(setOffset(newOffset));
  //   dispatch(setLimit(pageSize));
  // };



  const handlePaginationChange = (page: number, newPageSize?: number) => {

    dispatch(setOffset(page - 1));
    if (newPageSize && newPageSize !== limit) {
      dispatch(setLimit(newPageSize));
    }
  };


  // Redux state - Update this to match your requests slice state structure

  console.log("asdgs", requests)
  // Updated initial values for Request form
  const initialValues: RequestFormValues = {
    department: '',
    date_requested: new Date().toISOString().split('T')[0],
    status: 'pending',
    items: [{
      item: { id: 0, name: '' },
      itemName: '',
      category: '',
      subcategory: '',
      quantity: '', // Default to 1
      suppliers: [{
        supplierId: 0,
        supplierName: '',
        supplierEmail: '',
        supplierContact: '',
        supplierTel: '',
        isNewSupplier: false,
        selected: false
      }]
    }],
    suggestion_items: []
  };

  const showNotification = (type: "success" | "error", message: string) => {
    notification[type]({
      message,
      placement: "top",
    });
  };

  const handleSearch = (value: string) => {
    setQuery(value);
    dispatch(setOffset(0));
    };

  const handleRowClick = (request: IRequestResponse) => {
    try {
      setSelectedRequest(request.id);
      navigate(`/purchase-request/${request.purchase_request_id}`, {
        state: {
          selectedRequest: request
        },
        replace: true
      });
    } catch (error) {
      showNotification("error", "Navigation failed");
    }
  };

  const handleSortChange = (_: any, __: any, sorter: any) => {
    if (Array.isArray(sorter)) {
      sorter = sorter[0];
    }

    const { field, order } = sorter || {};
    // const sortOrderValue = order === 'ascend' ? 1 : order === 'descend' ? -1 : null;
    const sortOrder = order === "ascend" ? 1 : -1;

    setSortConfig({
      key: field || "",
      order: order || null
    });

    // setSortField(field || null);
    // setSortOrder(sortOrderValue);\
    dispatch(setSortField(field));
    dispatch(setSortOrder(sortOrder));
    dispatch(setOffset(offset));
  };

  // Fetch requests data
  const fetchRequestsData = () => {
    const payload: IRequestListPayload = {
      offset: offset,
      limit: limit,
      sortField: sortConfig.key ?? null,
      sortOrder: sortConfig.order && sortConfig.order === 'ascend' ? 1 : sortConfig.order === 'descend' ? -1 : null,
      searchInput: query
    };

    dispatch(getAllRequests(payload));
  };


  useEffect(() => {
    fetchRequestsData();
  }, [dispatch, offset, limit, sortField, sortOrder, query]);

  useEffect(() => {
    if (location.state?.editMode && location.state?.requestData) {
      const requestData = location.state.requestData;
      setSelectedRequest(requestData.id);
      setSideSheetOpen(true);

      setTimeout(() => {
        if (formikRef.current) {
          formikRef.current.setValues({
            department: requestData.department || '',
            date_requested: requestData.date_requested || '',
            status: requestData.status || 'pending',
            items: requestData.items?.map(item => ({
              item: { id: item.id, name: item.name },
              itemName: item.name,
              category: item.category,
              subcategory: item.subcategory,
              quantity: item.quantity || 1, // Add this line
              suppliers: item.suppliers?.map(supplier => ({
                supplierId: supplier.id,
                supplierName: supplier.name,
                supplierEmail: supplier.email,
                supplierContact: supplier.contact,
                supplierTel: supplier.tel,
                isNewSupplier: false,
                selected: supplier.selected
              })) || [],
            })) || [],
            suggestion_items: []
          });
        }
      }, 0);
    }
  }, [location.state]);

  useEffect(() => {
    dispatch(setBreadcrumbs([
      {
        title: "Purchase Requests",
        path: '/requests'
      }
    ]));
  }, []);

  // Add API calls when side sheet opens
  useEffect(() => {
    if (isSideSheetOpen) {
      console.log('Side sheet opened, triggering API calls...');
      dispatch(getAllItemPrices({}));
    }
  }, [isSideSheetOpen, dispatch]);

  // Add debug logs for Redux state
  const { items, loading: itemsLoading } = useSelector((state: RootState) => state.items);
  const { suppliers, loading: suppliersLoading } = useSelector((state: RootState) => state.suppliers);

  useEffect(() => {
    console.log('Items state:', { items, itemsLoading });
  }, [items, itemsLoading]);

  useEffect(() => {
    console.log('Suppliers state:', { suppliers, suppliersLoading });
  }, [suppliers, suppliersLoading]);

  // Updated columns for Request table to match new API response
  const columns = [
    {
      title: <span className="text-[#6D6D6D]">S.No</span>,
      dataIndex: 'id',
      key: 'id',
      render: (_: any, __: any, index: number) =>
        (offset * limit + index + 1).toString().padStart(2, "0"),
      width: 80,
    },
    {
      title: <span className="text-[#6D6D6D]">Request ID</span>,
      dataIndex: 'purchase_request_id',
      key: 'purchase_request_id',
      sorter: true,
      sortDirections: ["ascend", "descend"],
      sortOrder: sortConfig.key === "purchase_request_id" ? sortConfig.order : null,
      render: (purchase_request_id: number) => <span className="text-[#0A0A0A] font-medium text-sm">REQ-{purchase_request_id}</span>,
    },
    {
      title: <span className="text-[#6D6D6D]">Department</span>,
      dataIndex: 'department',
      key: 'department',
      sorter: true,
      sortDirections: ["ascend", "descend"],
      sortOrder: sortConfig.key === "department" ? sortConfig.order : null,
      render: (department: string) => (
        <span className="text-[#0A0A0A] font-medium text-sm">
          {capitalizeFirstLetter(department)}
        </span>
      ),
    },
    {
      title: <span className="text-[#6D6D6D]">Total Items</span>,
      dataIndex: 'total_items',
      key: 'total_items',
      sorter: true,
      sortDirections: ["ascend", "descend"],
      sortOrder: sortConfig.key === "total_items" ? sortConfig.order : null,
      render: (total_items: number) => (
        <span className="text-[#0A0A0A] font-medium text-sm">
          {total_items}
        </span>
      ),
    },
    {
      title: <span className="text-[#6D6D6D]">Total Suppliers</span>,
      dataIndex: 'total_suppliers',
      key: 'total_suppliers',
      sorter: true,
      sortDirections: ["ascend", "descend"],
      sortOrder: sortConfig.key === "total_suppliers" ? sortConfig.order : null,
      render: (total_suppliers: number) => (
        <span className="text-[#0A0A0A] font-medium text-sm">
          {total_suppliers}
        </span>
      ),
    },
    {
      title: <span className="text-[#6D6D6D]">Required Date</span>,
      dataIndex: 'date_requested',
      key: 'date_requested',
      sorter: true,
      sortDirections: ["ascend", "descend"],
      sortOrder: sortConfig.key === "date_requested" ? sortConfig.order : null,
      render: (date_requested: string) => {
        if (!date_requested) return '-';

        try {
          const date = new Date(date_requested);
          const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
          });
          return <span className="text-[#0A0A0A] font-medium text-sm">{formattedDate}</span>;
        } catch (error) {
          return <span className="text-[#0A0A0A] font-medium text-sm">{date_requested}</span>;
        }
      }
    },
    {
      title: <span className="text-[#6D6D6D]">Status</span>,
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      sortDirections: ["ascend", "descend"],
      sortOrder: sortConfig.key === "status" ? sortConfig.order : null,
      render: (status: string) => {
        const getStatusColor = (status: string | undefined | null) => {
          if (!status) return 'text-gray-600 bg-gray-100';

          switch (status.toLowerCase()) {
            case 'pending':
              return 'text-yellow-600 bg-yellow-100';
            case 'approved':
              return 'text-green-600 bg-green-100';
            case 'rejected':
              return 'text-red-600 bg-red-100';
            case 'in-progress':
              return 'text-blue-600 bg-blue-100';
            case 'completed':
              return 'text-green-600 bg-green-100';
            default:
              return 'text-gray-600 bg-gray-100';
          }
        };

        return (
          <span className={`font-semibold px-2 py-1 rounded-full text-xs ${getStatusColor(status)}`}>
            {status ? capitalizeFirstLetter(status) : 'N/A'}
          </span>
        );
      }
    },
  ];

  // const requestSchema = yup.object().shape({
  //   department: yup.string()
  //     .required("Department is required"),
  //   date_requested: yup.date()
  //     .required("Requested Date is required")
  //     .typeError("Invalid date format")
  //     .min(new Date(), "Requested date cannot be in the past"),
  //   status: yup.string().required("Status is required"),
  //   items: yup.array().of(
  //     yup.object().shape({
  //       item: yup.object().shape({
  //         id: yup.number(),
  //         name: yup.string().required("Item name is required")
  //       }),
  //       category: yup.string().required("Category is required"),
  //       subcategory: yup.string().required("Subcategory is required"),
  //       quantity: yup.number() // Add this validation
  //         .required("Quantity is required")
  //         .min(1, "Quantity must be at least 1")
  //         .integer("Quantity must be a whole number"),
  //       suppliers: yup.array().of(
  //         yup.object().shape({
  //           supplierId: yup.number(),
  //           supplierName: yup.string().required("Supplier name is required"),
  //           selected: yup.boolean()
  //         })
  //       )
  //     })
  //   )
    
  // });


    // Enhanced validation schema with proper error handling for nested arrays
 
    const requestSchema = yup.object().shape({
    department: yup.string()
      .required("Department is required")
      .min(2, "Department must be at least 2 characters")
      .max(50, "Department cannot exceed 50 characters")
      .matches(/^[a-zA-Z\s]+$/, "Department can only contain letters and spaces"),

    date_requested: yup.date()
      .required("Requested Date is required")
      .typeError("Invalid date format")
      .min(new Date(), "Requested date cannot be in the past"),

    status: yup.string()
      .required("Status is required")
      .oneOf(['pending', 'approved', 'rejected', 'in-progress', 'completed'], "Invalid status"),

    items: yup.array()
      .of(
        yup.object().shape({
          item: yup.object().shape({
            id: yup.number()
              .min(0, "Invalid item ID")
              .typeError("Item ID must be a number"),
            name: yup.string()
          }),
          itemName: yup.string()
            .required("Item name is required")
            .min(2, "Item name must be at least 2 characters")
            .max(100, "Item name cannot exceed 100 characters")
            .test('trim-check', 'Item name cannot be empty spaces', function (value) {
              return value ? value.trim().length > 0 : false;
            }),
          category: yup.string()
            .required("Category is required")
            .min(2, "Category must be at least 2 characters")
            .max(50, "Category cannot exceed 50 characters")
            .test('trim-check', 'Category cannot be empty spaces', function (value) {
              return value ? value.trim().length > 0 : false;
            }),
          subcategory: yup.string()
            .required("Subcategory is required")
            .min(2, "Subcategory must be at least 2 characters")
            .max(50, "Subcategory cannot exceed 50 characters")
            .test('trim-check', 'Subcategory cannot be empty spaces', function (value) {
              return value ? value.trim().length > 0 : false;
            }),
          quantity: yup.string()
            .required("Quantity is required")
            .matches(/^\d+$/, "Quantity must be a positive whole number")
            .test('min-value', 'Quantity must be at least 1', (value) => {
              const num = parseInt(value || '0', 10);
              return num >= 1;
            })
            .test('max-value', 'Quantity cannot exceed 99999', (value) => {
              const num = parseInt(value || '0', 10);
              return num <= 99999;
            }),
          suppliers: yup.array()
            .of(
              yup.object().shape({
                supplierId: yup.number()
                  .min(0, "Invalid supplier ID")
                  .typeError("Supplier ID must be a number"),
                supplierName: yup.string()
                  .when('selected', {
                    is: true,
                    then: (schema) => schema
                      .required("Supplier name is required")
                      .min(2, "Supplier name must be at least 2 characters")
                      .max(100, "Supplier name cannot exceed 100 characters")
                      .test('trim-check', 'Supplier name cannot be empty spaces', function (value) {
                        return value ? value.trim().length > 0 : false;
                      }),
                    otherwise: (schema) => schema
                  }),
                supplierEmail: yup.string()
                  .when(['selected', 'isNewSupplier'], {
                    is: (selected: boolean, isNewSupplier: boolean) => selected && isNewSupplier,
                    then: (schema) => schema
                      .required("Supplier email is required")
                      .email("Invalid email format")
                      .max(100, "Email cannot exceed 100 characters"),
                    otherwise: (schema) => schema
                      .nullable()
                      .test('email-format', 'Invalid email format', function (value) {
                        if (!value) return true;
                        return /\S+@\S+\.\S+/.test(value);
                      })
                  }),
                supplierContact: yup.string()
                  .when(['selected', 'isNewSupplier'], {
                    is: (selected: boolean, isNewSupplier: boolean) => selected && isNewSupplier,
                    then: (schema) => schema
                      .required("Supplier contact is required")
                      .matches(/^\+?[\d\s\-\(\)]+$/, "Invalid contact number format")
                      .min(8, "Contact number must be at least 8 digits")
                      .max(15, "Contact number cannot exceed 15 digits"),
                    otherwise: (schema) => schema
                      .nullable()
                      .test('contact-format', 'Invalid contact number format', function (value) {
                        if (!value) return true;
                        return /^\+?[\d\s\-\(\)]*$/.test(value);
                      })
                  }),
                // supplierTel: yup.string()
                //   .nullable()
                //   .test('tel-format', 'Invalid telephone number format', function (value) {
                //     if (!value) return true;
                //     return /^\+?[\d\s\-\(\)]*$/.test(value) && value.length <= 15;
                //   }),
                isNewSupplier: yup.boolean(),
                selected: yup.boolean()
              })
            )
            .test('at-least-one-selected', 'At least one supplier must be selected', function (suppliers) {
              const selectedSuppliers = suppliers?.filter(supplier => supplier.selected);
              return selectedSuppliers && selectedSuppliers.length > 0;
            })
        })
      )
      .min(1, "At least one item is required")
      .max(50, "Cannot exceed 50 items per request")
      .test('items-validation', 'Please check item details', function (items) {
        const errors: any[] = [];

        items?.forEach((item, index) => {
          if (!item.itemName?.trim()) {
            errors.push(this.createError({
              path: `items[${index}].itemName`,
              message: `Item ${index + 1}: Item name is requiredt`
            }));
          }

          if (!item.category?.trim()) {
            errors.push(this.createError({
              path: `items[${index}].category`,
              message: `Item ${index + 1}: Category is requiredd`
            }));
          }

          if (!item.subcategory?.trim()) {
            errors.push(this.createError({
              path: `items[${index}].subcategory`,
              message: `Item ${index + 1}: Subcategory is required`
            }));
          }

          const quantity = parseInt(item.quantity || '0', 10);
          if (isNaN(quantity) || quantity < 1) {
            errors.push(this.createError({
              path: `items[${index}].quantity`,
              message: `Item ${index + 1}: Valid quantity is required`
            }));
          }

          const selectedSuppliers = item.suppliers?.filter(supplier => supplier.selected);
          if (!selectedSuppliers || selectedSuppliers.length === 0) {
            errors.push(this.createError({
              path: `items[${index}].suppliers`,
              message: `Item ${index + 1}: At least one supplier must be selected`
            }));
          }
        });

        if (errors.length > 0) {
          throw new yup.ValidationError(errors);
        }

        return true;
      }),

    suggestion_items: yup.array()
  });

  const formikRef = useRef<FormikProps<RequestFormValues>>(null);

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      // validationSchema={requestSchema}
      enableReinitialize={true}
      onSubmit={async (values, { resetForm }) => {
        // Validate items before submission
        const hasInvalidItems = values.items.some(item => !item.itemName);
        if (hasInvalidItems) {
          showNotification("error", "Please enter valid items for all entries");
          return;
        }

        // Check if each item has at least one selected supplier
        const hasInvalidSuppliers = values.items.some(item => {
          const selectedSuppliers = item.suppliers?.filter(supplier => supplier.selected);
          return !selectedSuppliers || selectedSuppliers.length === 0;
        });

        if (hasInvalidSuppliers) {
          showNotification("error", "Please select at least one supplier for each item");
          return;
        }

        // Format the date properly
        const formattedDate = values.date_requested
          ? new Date(values.date_requested).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];

        const payload: CreatePurchaseRequestPayload = {
          department: values.department,
          date_requested: formattedDate,
          status: values.status,
          items: values.items.map(item => {
            const isNewItem = item.item.id === 0;

            const requestItem: RequestItem = {
              item_id: isNewItem ? null : item.item.id,
              item_name: item.itemName,
              category: item.category,
              sub_category: item.subcategory,
              quantity: item.quantity || 1, // Add this line
              item_type: !isNewItem,
              is_new_item: isNewItem,
              supplier: item.suppliers
                .filter(s => s.selected)
                .map(s => ({
                  supplier_id: s.isNewSupplier ? null : s.supplierId,
                  is_new_supplier: s.isNewSupplier,
                  name: s.supplierName,
                  email: s.supplierEmail,
                  mob_num: s.supplierContact,
                  tel_num: s.supplierTel
                }))
            };
            return requestItem;
          }),
          suggestion_items: values.items
            .filter(item => item.item.id === 0)
            .map(item => ({
              item_name: item.itemName,
              category: item.category,
              sub_category: item.subcategory
            })),
          suggestion_suppliers: values.items
            .flatMap(item => item.suppliers)
            .filter(s => s.isNewSupplier && s.selected)
            .map(s => ({
              name: s.supplierName,
              email: s.supplierEmail,
              mob_num: s.supplierContact,
              tel_num: s.supplierTel
            }))
        };

        setConfirmationMessage("Do you want to submit the request?");
        setIsConfirmationOpen(true);
        setConfirmAction(() => async () => {
          try {
            setSideSheetOpen(false);
            try {
              if (selectedRequest) {
                // Update request logic here if needed
                showNotification("success", "Request updated successfully");
              } else {
                // Create new request
                await dispatch(createPurchaseRequest(payload)).unwrap();
                showNotification("success", "Request created successfully");
              }
            } catch (error: any) {
              showNotification("error", error?.message || "Operation failed");
            }

            // Refresh the requests list
            fetchRequestsData();
            resetForm();
            setSideSheetOpen(false);
            setSelectedRequest(null);
          } catch (error: any) {
            showNotification("error", error?.message || "Operation failed");
          }
          setIsConfirmationOpen(false);
        });
      }}
    >
      {({ handleSubmit, values, touched, errors, setFieldValue, handleChange, resetForm, setFieldTouched, validateField }) => (
        <>
          <div className="bg-[#EDF1F6] h-[76px] mt-[10px] flex justify-between items-center px-[20px]">
            <p className="font-Montserrat font-semibold text-[20px] leading-[24.38px] text-[#0A0A0A]">Purchase Requests</p>
            <div className="flex justify-end gap-3">
              <div className="flex justify-end">
                <Searchbar search={query} onSearch={handleSearch} />
              </div>

              <SideSheet
                btnLabel={selectedRequest ? "Edit Request" : "Add New Purchase Request"}
                width={1030}
                title={selectedRequest ? "Edit Request" : "Add New Purchase Request"}
                isOpen={isSideSheetOpen}
                setOpen={setSideSheetOpen}
                onCancel={() => {
                  setSideSheetOpen(false);
                  resetForm();
                  setSelectedRequest(null);
                }}
                onSubmit={handleSubmit}
                submitLabel={selectedRequest ? "Update" : "Submit"}
              >
                <RequestsForm
                  handleChange={handleChange}
                  values={values}
                  touched={touched}
                  errors={errors}
                  setFieldTouched={setFieldTouched}
                  validateField={validateField}
                  setFieldValue={setFieldValue}
                  initialValues={initialValues}
                />
              </SideSheet>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div>
            <CustomTable
              columns={columns}
              dataSource={requests}
              loading={loading}
              rowKey="id"
              onChange={handleSortChange}
              onRowClick={(record) => {
                handleRowClick(record);
              }}
              scrollHeight={800}
            />
          </div>

          <div className=" sticky bottom-0 flex justify-end py-4">
            <Pagination
              total={dataCount}
              showSizeChanger={false}
              onChange={handlePaginationChange}
            />
               {/* <Pagination
                total={dataCount}
                current={offset + 1}
                pageSize={limit}
                showSizeChanger={false}
                onChange={handlePaginationChange}
              /> */}
          </div>

          <Confirmation
            label="Confirmation"
            message={confirmationMessage}
            isOpen={isConfirmationOpen}
            onClose={() => setIsConfirmationOpen(false)}
            onConfirm={confirmAction || (() => { })}
            confirmButtonLabel="Confirm"
          />
        </>
      )}
    </Formik>
  );
};

export default RequestsManagement;