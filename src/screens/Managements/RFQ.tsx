import React, { useEffect, useState, useRef } from 'react';
import * as yup from "yup";
import CustomTable from '../../components/common/Table.tsx';
import Searchbar from '../../components/common/Searchbar.tsx';
import SideSheet from '../../components/common/Sidesheet.tsx';
import { Formik, FormikProps } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store.ts';
import RequiredLabel from '../../components/common/RequiredLabel.tsx';
import Confirmation from '../../components/common/Confirmation.tsx';
import { notification, Pagination } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { IRequest, IRequestListPayload } from '../../type/type.ts';
import { getAllRequests, createPurchaseRequest , setOffset, setLimit, setSortField, setSortOrder, setSearchInput  } from '../../slices/RequestSlice.ts';
import RequestsForm from '../requests/RequestsForm.tsx';
import { capitalizeFirstLetter } from '../../utils/util.service.ts';
import { setBreadcrumbs } from '../../slices/BreadcrumbSlice.ts';
import { getAllItems } from '../../slices/itemSlice.ts';
import { getAllSuppliers } from '../../slices/SupplierSlice.ts';
import PaginatedTable from '../../components/PaginatedTable.tsx';

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

const RFQManagement: React.FC = () => {
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
  const { requests, loading, error, dataCount, offset,limit } = useSelector((state: RootState) => state.requestManagement);
  
  // Pagination and sorting state
  // const [offset, setOffset] = useState(0);
  // const [limit, setLimit] = useState(10);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<number | null>(null);
  
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    order: "ascend" | "descend" | null;
  }>({
    key: "",
    order: null,
  });

  // const handlePaginationChange = (page: number, newPageSize?: number) => {
  //   const newOffset = page - 1; // Convert to 0-based index
  //   setOffset(newOffset);
    
  //   if (newPageSize && newPageSize !== limit) {
  //     setLimit(newPageSize);
  //     setOffset(0); // Reset to first page when page size changes
  //   }
  // };

  const handlePaginationChange = (page: number, newPageSize?: number) => {

    dispatch(setOffset(page - 1));
    if (newPageSize && newPageSize !== limit) {
      dispatch(setLimit(newPageSize));
    }
  };

  // Redux state - Update this to match your requests slice state structure

  console.log("asdgs",requests)
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
      quantity: 1, // Default to 1
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
    setOffset(0);
  };

  const handleRowClick = (request: IRequestResponse) => {
    try {
      setSelectedRequest(request.id);
      navigate(`/Rfq_RequestPreview/${request.purchase_request_id}`, {
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
    const sortOrderValue = order === 'ascend' ? 1 : order === 'descend' ? -1 : null;

    setSortConfig({
      key: field || "",
      order: order || null
    });

    setSortField(field || null);
    setSortOrder(sortOrderValue);
  };

  // Fetch requests data
  const fetchRequestsData = () => {
    const payload: IRequestListPayload = {
      offset,
      limit,
      // sortField,
      // sortOrder,
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
        title: "Rfq_lists",
        path: '/requests'
      }
    ]));
  }, []);

  // Add API calls when side sheet opens
  useEffect(() => {
    if (isSideSheetOpen) {
      console.log('Side sheet opened, triggering API calls...');
      dispatch(getAllItems({}));
      dispatch(getAllSuppliers({}));
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

  const requestSchema = yup.object().shape({
    department: yup.string()
      .required("Department is required"),
    date_requested: yup.date()
      .required("Requested Date is required")
      .typeError("Invalid date format"),
    status: yup.string().required("Status is required"),
    items: yup.array().of(
      yup.object().shape({
        item: yup.object().shape({
          id: yup.number(),
          name: yup.string().required("Item name is required")
        }),
        category: yup.string().required("Category is required"),
        subcategory: yup.string().required("Subcategory is required"),
        quantity: yup.number() // Add this validation
          .required("Quantity is required")
          .min(1, "Quantity must be at least 1")
          .integer("Quantity must be a whole number"),
        suppliers: yup.array().of(
          yup.object().shape({
            supplierId: yup.number(),
            supplierName: yup.string().required("Supplier name is required"),
            selected: yup.boolean()
          })
        )
      })
    )
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
            <p className="font-Montserrat font-semibold text-[20px] leading-[24.38px] text-[#0A0A0A]">Rfq lists</p>
            <div className="flex justify-end gap-3">
              <div className="flex justify-end">
                <Searchbar search={query} onSearch={handleSearch} />
              </div>

              {/* <SideSheet
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
              </SideSheet> */}
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
          
          <div className="sticky bottom-0 flex justify-end py-4">
         {/* Pagination */}
         {/* <Pagination
              current={offset + 1}
              total={dataCount}
              pageSize={limit}
              onChange={handlePaginationChange}
              showSizeChanger={true}
              pageSizeOptions={[10, 20, 50, 100]}
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} requests`}
            /> */}
              <Pagination
              total={dataCount}
              showSizeChanger={false}
              onChange={handlePaginationChange}
            />
          </div>
          
          <Confirmation
            label="Confirmation"
            message={confirmationMessage}
            isOpen={isConfirmationOpen}
            onClose={() => setIsConfirmationOpen(false)}
            onConfirm={confirmAction || (() => {})}
            confirmButtonLabel="Confirm"
          />
        </>
      )}
    </Formik>
  );
};

export default RFQManagement;