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
import { notification, Pagination, Select, Dropdown, Menu, Input, Button, DatePicker, Table, Tag, Radio, Upload, AutoComplete } from 'antd';
import { PlusOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { createRequest, getAllRequests, setOffset, setLimit, setSortField, setSortOrder, setSearchInput } from '../../slices/RequestSlice.ts';
import { useNavigate } from 'react-router-dom';
import { setBreadcrumbs } from '../../slices/BreadcrumbSlice.ts';
import dayjs from 'dayjs';
import { fetchAllItems, selectAllItems } from '../../slices/itemSlice.ts';

const { Option } = Select;
const { Search } = Input;

interface RequestFormValues {
  id?: number;
  items: {
    item: Item;
    supplier: Supplier;
  }[];
  requesterId: string;
  requestedDate: string;
  status: string;
}

interface Supplier {
  id: number;
  name: string;
  contact: string;
  email: string;
}

interface Item {
  id: number;
  name: string;
  description: string;
  suppliers: Supplier[];
}

const Request: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [query, setQuery] = useState("");
  const [isSideSheetOpen, setSideSheetOpen] = useState(false);
  const { requests, loading, dataCount, offset, limit } = useSelector((state: RootState) => state.requestManagement);
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState("Do you want to submit the form?");
  const [newSupplierName, setNewSupplierName] = useState("");
  const [newSupplierContact, setNewSupplierContact] = useState("");
  const [newSupplierEmail, setNewSupplierEmail] = useState("");
  const [showNewSupplierForm, setShowNewSupplierForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [hasSearchResults, setHasSearchResults] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [allSuppliers, setAllSuppliers] = useState<Supplier[]>([]);
  const [selectedItems, setSelectedItems] = useState<{ item: Item, supplier: Supplier }[]>([]);
  const [entryMode, setEntryMode] = useState<'manual' | 'bulk'>('manual');
  const [description, setDescription] = useState('');

  // const dispatch = useDispatch();
  const allItems = useSelector(selectAllItems); // ✅ this will work now  

  useEffect(() => {
    dispatch(fetchAllItems());
  }, [dispatch]);

  const [existingSuppliers, setExistingSuppliers] = useState([
    { id: 1, name: 'ABC Supplies', contact: '9876543210', email: 'abc@example.com' },
    { id: 2, name: 'XYZ Traders', contact: '9123456789', email: 'xyz@example.com' },
  ]);

  const handleToggleAddSupplier = (index: number, showForm: boolean) => {
    setNewItems(prev =>
      prev.map((item, idx) =>
        idx === index
          ? { ...item, addingNewSupplier: showForm, selectedSupplier: showForm ? { name: '', contact: '', email: '' } : null }
          : item
      )
    );
  };

  const handleExistingSupplierSelect = (index: number, supplierId: number) => {
    const selected = existingSuppliers.find(s => s.id === supplierId);
    setNewItems(prev =>
      prev.map((item, idx) =>
        idx === index
          ? {
            ...item,
            selectedSupplier: selected ? { ...selected } : null,
            addingNewSupplier: false,
          }
          : item
      )
    );
  };

  const [newItems, setNewItems] = useState([
    { name: '', description: '', suppliers: [], selectedSupplier: null }
  ]);



  useEffect(() => {
    console.log('Selected Items:', selectedItems);
  }, [selectedItems]);


  const handleItemChange = (index, key, value) => {
    const updated = [...newItems];
    updated[index][key] = value;
    setNewItems(updated);
  };

  const handleAddRow = () => {
    setNewItems([...newItems, { name: '', description: '', suppliers: [], selectedSupplier: null }]);
  };

  const handleRemoveRow = (index) => {
    const updated = [...newItems];
    updated.splice(index, 1);
    setNewItems(updated);
  };

  const handleSupplierChange = (index, key, value) => {
    const updated = [...newItems];
    updated[index].selectedSupplier = {
      ...updated[index].selectedSupplier,
      [key]: value,
    };
    setNewItems(updated);
  };

  const handleAddToRequest = () => {
    const validEntries = newItems.filter(
      item => item.name && item.description && item.selectedSupplier?.name
    );
    setSelectedItems(prev => [...prev, ...validEntries]);
    setShowNewItemForm(false);
    setNewItems([{ name: '', description: '', suppliers: [], selectedSupplier: null }]);
  };


  useEffect(() => {
    console.log("Requests data:", requests); // Check the structure of your data
  }, [requests]);
  // Combine all suppliers from all items
  useEffect(() => {
    const suppliers = mockItems.flatMap(item => item.suppliers);
    const uniqueSuppliers = suppliers.filter(
      (supplier, index, self) =>
        index === self.findIndex(s => s.id === supplier.id)
    );
    setAllSuppliers(uniqueSuppliers);
  }, []);

  const handleEnter = e => {
    if (!query.trim()) return; // do nothing on empty
    if (searchResults.length === 0) {
      setNewItemName(query);
      setNewItemDescription('');
      setShowNewItemForm(true);
      setIsDropdownOpen(false);
      e.preventDefault();
    }
  };


  // Function to handle adding new item
  const handleAddNewItem = () => {
    if (newItemName && newItemDescription) {
      const newItem: Item = {
        id: Math.max(...mockItems.map(i => i.id)) + 1,
        name: newItemName,
        description: newItemDescription,
        suppliers: []
      };

      mockItems.push(newItem);
      setSelectedItem(newItem);
      setShowNewItemForm(false);
      setNewItemName("");
      setNewItemDescription("");
      showNotification("success", "New item added successfully");
    }
  };

  // Mock data for items and suppliers
  const mockItems: Item[] = [
    {
      id: 1,
      name: "Laptop",
      description: "High performance business laptop",
      suppliers: [
        { id: 1, name: "Tech Suppliers Inc", contact: "9876543210", email: "tech@example.com" },
        { id: 2, name: "Global Electronics", contact: "8765432109", email: "global@example.com" }
      ]
    },
    {
      id: 2,
      name: "Monitor",
      description: "27-inch 4K monitor",
      suppliers: [
        { id: 3, name: "Display World", contact: "7654321098", email: "display@example.com" },
        { id: 4, name: "Visual Tech", contact: "6543210987", email: "visual@example.com" }
      ]
    },
    {
      id: 3,
      name: "Keyboard",
      description: "Mechanical keyboard",
      suppliers: [
        { id: 5, name: "Input Devices Co", contact: "5432109876", email: "input@example.com" },
        { id: 6, name: "Peripheral Solutions", contact: "4321098765", email: "peripheral@example.com" }
      ]
    }
  ];

  const navigate = useNavigate();

  const initialValues: RequestFormValues = {
    items: [],
    requesterId: '',
    requestedDate: new Date().toISOString().split('T')[0],
    status: "Pending"
  };

  const showNotification = (type: "success" | "error", message: string) => {
    notification[type]({
      message,
      placement: "top",
    });
  };

  const handleSearch = (value: string) => {
    console.log("Search value:", value); // ✅ Make sure it prints
    setQuery(value);
    dispatch(setOffset(0));

    const results = mockItems.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase()) ||
      item.description.toLowerCase().includes(value.toLowerCase())
    );

    console.log("Filtered results:", results); // ✅ This should print matches
    setSearchResults(results);
    setHasSearchResults(results.length > 0);
  };



  const handleItemSelect = (item: Item) => {
    setSelectedItem(item);
    setQuery(item.name);
    setDescription(item.description || ''); // auto-fil
    setIsDropdownOpen(false);
    setSelectedSupplier(null);
  };

  const handleSupplierSelect = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
  };

  // const handleAddItemToRequest = () => {
  //   if (selectedItem && selectedSupplier) {
  //     setSelectedItems(prev => [...prev, { item: selectedItem, supplier: selectedSupplier }]);
  //     setSelectedItem(null);
  //     setSelectedSupplier(null);
  //     setQuery('');
  //     showNotification("success", "Item added to request");
  //   } else {
  //     showNotification("error", "Please select both an item and a supplier");
  //   }
  // };

  const handleAddItemToRequest = () => {
    console.log('Selected Item:', selectedItem);
    console.log('Selected Supplier:', selectedSupplier);

    if (selectedItem && selectedSupplier) {
      setSelectedItems(prev => [
        ...prev,
        {
          item: selectedItem,
          supplier: selectedSupplier,
        }
      ]);
      setSelectedItem(null);
      setSelectedSupplier(null);
      setQuery('');
      showNotification("success", "Item added to request");
    } else {
      showNotification("error", "Please select both an item and a supplier");
    }

  };


  const handleRemoveItem = (index: number) => {
    setSelectedItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddNewSupplier = () => {
    if (newSupplierName && newSupplierContact && newSupplierEmail) {
      const newSupplier: Supplier = {
        id: Math.max(...mockItems.flatMap(i => i.suppliers.map(s => s.id))) + 1,
        name: newSupplierName,
        contact: newSupplierContact,
        email: newSupplierEmail
      };

      if (selectedItem) {
        const updatedItem = {
          ...selectedItem,
          suppliers: [...selectedItem.suppliers, newSupplier]
        };
        setSelectedItem(updatedItem);
        setSelectedSupplier(newSupplier);
        setShowNewSupplierForm(false);
        setNewSupplierName("");
        setNewSupplierContact("");
        setNewSupplierEmail("");
        showNotification("success", "New supplier added successfully");
      }
    }
  };

  const handlePaginationChange = (page: number, newPageSize?: number) => {
    dispatch(setOffset(page - 1));
    if (newPageSize && newPageSize !== limit) {
      dispatch(setLimit(newPageSize));
    }
  };

  const handleRowClick = (request: RequestFormValues) => {
    setSelectedRequest(request.id || null);
  };

  const handleSortChange = (_: any, __: any, sorter: any) => {
    if (Array.isArray(sorter)) {
      sorter = sorter[0];
    }

    const { field, order } = sorter || {};
    const sortOrder = order === 'ascend' ? 1 : -1;

    dispatch(setSortField(field));
    dispatch(setSortOrder(sortOrder));
    dispatch(setOffset(offset));
  };

  useEffect(() => {
    dispatch(getAllRequests({
      offset: offset,
      limit: limit,
      sortField: "",
      sortOrder: null,
      searchInput: query
    }));
  }, [dispatch, offset, limit, query]);

  useEffect(() => {
    dispatch(setBreadcrumbs([
      {
        title: "Request Management",
        path: '/request'
      }
    ]));
  }, []);



  const columns = [
    {
      title: <span className="text-[#6D6D6D]">S.No</span>,
      dataIndex: 'id',
      key: 'id',
      render: (_: any, __: any, index: number) =>
        (offset * limit + index + 1).toString().padStart(2, "0"),
      width: 80,
    },


    // {
    //   title: <span className="text-[#6D6D6D]">Items</span>,
    //   dataIndex: 'items',
    //   key: 'items',
    //   render: (items: { item: Item, supplier: Supplier }[] | undefined) => (
    //     <div>
    //       {Array.isArray(items) && items.length > 0 ? (
    //         items.map((item, index) => (
    //           <div key={index} className="mb-1">
    //             <Tag color="blue">{item.item?.name || 'Unknown Item'}</Tag>
    //             {/* <Tag color="green">{item.supplier?.name || 'Unknown Supplier'}</Tag> */}
    //           </div>
    //         ))
    //       ) : (
    //         <span className="text-gray-400">No items</span>
    //       )}
    //     </div>
    //   ),
    //   //       render: (items: { item?: Item; supplier?: Supplier }[] | undefined) => (
    //   //   <div>
    //   //     {Array.isArray(items) && items.length > 0 ? (
    //   //       items.map((item, index) => {
    //   //         const itemId = item?.item?.id ?? `unknown-${index}`;
    //   //         const itemName = item?.item?.name ?? 'Unknown Item';
    //   //         return (
    //   //           <div key={itemId} className="mb-1">
    //   //             <Tag color="blue">{itemName}</Tag>
    //   //             {/* Optionally show supplier */}
    //   //             {/* <Tag color="green">{item?.supplier?.name || 'Unknown Supplier'}</Tag> */}
    //   //           </div>
    //   //         );
    //   //       })
    //   //     ) : (
    //   //       <span className="text-gray-400">No items</span>
    //   //     )}
    //   //   </div>
    //   // )

    // },

    {
      title: <span className="text-[#6D6D6D]">Items</span>,
      dataIndex: 'items',
      key: 'items',
      render: (items: any[] | undefined) => (
        <div>
          {Array.isArray(items) && items.length > 0 ? (
            items.map((entry, index) => {
              // Support both { item: { name }, supplier: { name } } and { name, description, ... }
              const itemName =
                entry?.item?.name ?? // old format
                entry?.name ??       // new format
                "Unknown Item";

              return (
                <div key={index} className="mb-1">
                  <Tag color="blue">{itemName}</Tag>
                </div>
              );
            })
          ) : (
            <span className="text-gray-400">No items</span>
          )}
        </div>
      ),
    }
    ,
    {
      title: <span className="text-[#6D6D6D]">Requester ID</span>,
      dataIndex: 'requesterId',
      key: 'requesterId',
      sorter: true,
      sortDirections: ["ascend", "descend"],
      render: (requesterId: string) =>
        <span className="text-[#0A0A0A] font-medium text-sm">{requesterId}</span>
    },
    {
      title: <span className="text-[#6D6D6D]">Requested Date</span>,
      dataIndex: 'requestedDate',
      key: 'requestedDate',
      sorter: true,
      sortDirections: ["ascend", "descend"],
      render: (date: string) =>
        <span className="text-[#0A0A0A] font-medium text-sm">{new Date(date).toLocaleDateString()}</span>
    },
    {
      title: <span className="text-[#6D6D6D]">Status</span>,
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      sortDirections: ["ascend", "descend"],
      render: (status: string) => (
        <span className={`font-semibold ${status === "Approved" ? "text-green-600" :
          status === "Rejected" ? "text-red-600" : "text-yellow-600"
          }`}>
          {status}
        </span>
      )
    },
  ];

  const formikRef = useRef<FormikProps<RequestFormValues>>(null);

  // const selectedItemsColumns = [
  //   {
  //     title: 'Item',
  //     dataIndex: 'item',
  //     key: 'item',
  //     render: (item: Item) => item.name,
  //   },
  //   {
  //     title: 'Supplier',
  //     dataIndex: 'supplier',
  //     key: 'supplier',
  //     render: (supplier: Supplier) => supplier.name,
  //   },
  //   {
  //     title: 'Action',
  //     key: 'action',
  //     render: (_: any, __: any, index: number) => (
  //       <Button
  //         danger
  //         icon={<DeleteOutlined />}
  //         onClick={() => handleRemoveItem(index)}
  //       />
  //     ),
  //   },
  // ];

  const selectedItemsColumns = [
    {
      title: 'Item',
      key: 'item',
      render: (_: any, record: any) => {
        // Handle both existing item structure and new item structure
        return record.item?.name || record.name || '—';
      },
    },
    {
      title: 'Supplier',
      key: 'supplier',
      render: (_: any, record: any) => {
        // Handle both existing supplier and selectedSupplier for new item
        return record.supplier?.name || record.selectedSupplier?.name || '—';
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, __: any, index: number) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(index)}
        />
      ),
    },
  ];


  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      enableReinitialize={true}
      onSubmit={async (values, { resetForm }) => {
        if (selectedItems.length === 0) {
          showNotification("error", "Please add at least one item to the request");
          return;
        }

        const requesterId = `REQ-${String(requests.length + 1).padStart(3, '0')}`;

        const data = {
          items: selectedItems,
          requesterId: requesterId,
          requestedDate: values.requestedDate,
          status: values.status
        };

        setConfirmationMessage("Do you want to submit the request?");
        setIsConfirmationOpen(true);
        setConfirmAction(() => async () => {
          try {
            await dispatch(createRequest(data)).unwrap();
            showNotification("success", "Request created successfully");
            resetForm();
            setSideSheetOpen(false);
            setSelectedItems([]);
            setSelectedItem(null);
            setSelectedSupplier(null);

            await dispatch(getAllRequests({
              offset: offset,
              limit: limit,
              sortField: "",
              sortOrder: null,
              searchInput: query
            }));
          } catch (error) {
            showNotification("error", error.message);
          }
          setIsConfirmationOpen(false);
        });
      }}
    >
      {({ handleSubmit, values, touched, errors, setFieldValue, handleChange, resetForm }) => (
        <>
          <div className="bg-[#EDF1F6] h-[76px] mt-[10px] flex justify-between items-center px-[20px]">
            <p className="font-Montserrat font-semibold text-[20px] leading-[24.38px] text-[#0A0A0A]">Request Management</p>
            <div className="flex justify-end gap-3">
              <div className="flex justify-end ">
                <Searchbar search={query} onSearch={handleSearch} />
                {/* <Search 
                  placeholder="Search items..." 
                  onSearch={handleSearch} 
                  onChange={(e) => handleSearch(e.target.value)}
                  enterButton 
                /> */}
              </div>
              <SideSheet
                btnLabel={selectedRequest ? "Edit Request" : "Create New Request"}
                width={1030}
                title={selectedRequest ? "Edit Request" : "Create New Request"}
                isOpen={isSideSheetOpen}
                setOpen={setSideSheetOpen}
                onCancel={() => {
                  setSideSheetOpen(false);
                  resetForm();
                  setSelectedRequest(null);
                  setSelectedItem(null);
                  setSelectedSupplier(null);
                  setShowNewItemForm(false);
                  setShowNewSupplierForm(false);
                  setSelectedItems([]);
                }}
                onSubmit={handleSubmit}
                submitLabel={selectedRequest ? "Update" : "Submit"}
              >
                <div className="space-y-6 p-6">

                  <div className="grid grid-cols-1 gap-6">
                    {/* Header */}
                    {/* <div className="flex items-center justify-between mb-2">
    <h1 className="text-lg font-bold">New Purchase Request</h1>
  </div> */}

                    {/* Top bar with Search and Add New Item */}
                    <div className="flex items-start justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        <h1 className="text-lg font-bold">New Purchase Request</h1>
                      </label>
                      <button
                        onClick={() => setShowNewItemForm(true)}
                        className={`text-sm font-medium text-blue-600 hover:text-blue-800 transition ${query && searchResults.length === 0 ? 'animate-pulse' : ''
                          }`}
                      >
                        + Add New Item
                      </button>
                    </div>
                  </div>


                  {entryMode === 'manual' && (
                    <div className="space-y-6 p-6">
                      {/* Your entire manual entry code already here (search, item form, supplier, etc.)
                      Selected Items Table */}
                      {selectedItems.length > 0 && (
                        <div>
                          <h3 className="font-medium mb-2">Items in Request</h3>
                          <Table
                            columns={selectedItemsColumns}
                            dataSource={selectedItems}
                            // rowKey={(record, index) => index?.toString() || ''}
                            rowKey={(record) => `${record.item?.id}-${record.supplier?.id}`}

                            pagination={false}
                            size="small"
                          />
                        </div>
                      )}






                    </div>
                  )}
                  {/* Item Selection Section */}
                  <div className="grid grid-cols-1 gap-6">
                    {/* Top bar with Search and Add New Item
                        <div className="flex items-cent er justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            <RequiredLabel>Search for items</RequiredLabel>
                          </label>
                          <button
                            onClick={() => setShowNewItemForm(true)}
                            className={`text-sm font-medium  text-blue-600 hover:text-blue-800 transition ${query && searchResults.length === 0 ? 'animate-pulse' : ''
                              }`}
                          >
                            + Add New Item
                          </button>
                        </div> */}

<div>
  <div className="flex gap-6 items-start">
    {/* Left: Item Search */}
    <div className="flex flex-col" style={{ flex: 1 }}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <RequiredLabel>Item Name</RequiredLabel>
      </label>
      <div className="relative">
        <Input
          placeholder="Search for items..."
          value={query}
          onChange={(e) => {
            handleSearch(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          onPressEnter={handleEnter}
          className={showNewItemForm ? "w-1/2" : "w-full"}
        />
        {isDropdownOpen && query && (
          <div className="absolute z-10 mt-2 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto">
            {searchResults.length > 0 ? (
              searchResults.map((item) => (
                <div
                  key={item.id}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b"
                  onClick={() => {
                    handleItemSelect(item);
                    setIsDropdownOpen(false);
                  }}
                >
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.description}</div>
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-500">
                No items found matching "{query}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>

    {/* Right: Description */}
    {/* {selectedItem && selectedItem?.description && ( */}
    {!showNewItemForm &&
    <div className="flex flex-col flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <RequiredLabel>Description</RequiredLabel>
      </label>
      <Input.TextArea
        placeholder="Description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        autoSize={{ minRows: 1, maxRows: 3 }}
        className="w-full"
      />
    </div>
}
      {/*  */}
  </div>
</div>



                    {/* Selected Item Display */}
                    {selectedItem && (
                      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">Selected Item</h4>
                            <p className="text-sm text-gray-600 mt-1">{selectedItem.description}</p>
                          </div>
                          <button
                            className="text-sm text-blue-600 hover:text-blue-800"
                            onClick={() => {
                              setSelectedItem(null);
                              setQuery('');
                            }}
                          >
                            Change
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Supplier Selection Section (only shown when item is selected) */}
                    {selectedItem && (
                      <div className="pt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <RequiredLabel>Select Supplier</RequiredLabel>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedItem.suppliers.map(supplier => (
                            <div
                              key={supplier.id}
                              className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedSupplier?.id === supplier.id
                                ? 'border-blue-300 bg-blue-50'
                                : 'border-gray-200 hover:bg-gray-50'
                                }`}
                              onClick={() => handleSupplierSelect(supplier)}
                            >
                              <div className="font-medium">{supplier.name}</div>
                              <div className="text-sm text-gray-600 mt-1">Contact: {supplier.contact}</div>
                              <div className="text-sm text-gray-600">Email: {supplier.email}</div>
                            </div>
                          ))}
                        </div>

                        {/* Add New Supplier Option */}
                        <div className="mt-4">
                          {!showNewSupplierForm ? (
                            <Button
                              type="dashed"
                              icon={<PlusOutlined />}
                              onClick={() => setShowNewSupplierForm(true)}
                              className="w-full"
                            >
                              Add New Supplier
                            </Button>
                          ) : (
                            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                              <h4 className="font-medium text-gray-900 mb-3">Add New Supplier</h4>
                              <div className="space-y-3">
                                <Input
                                  placeholder="Supplier Name"
                                  value={newSupplierName}
                                  onChange={(e) => setNewSupplierName(e.target.value)}
                                  className="w-full"
                                />
                                <Input
                                  placeholder="Contact Number"
                                  value={newSupplierContact}
                                  onChange={(e) => setNewSupplierContact(e.target.value)}
                                  className="w-full"
                                />
                                <Input
                                  placeholder="Email"
                                  value={newSupplierEmail}
                                  onChange={(e) => setNewSupplierEmail(e.target.value)}
                                  className="w-full"
                                />
                              </div>
                              <div className="flex justify-end space-x-3 mt-4">
                                <Button onClick={() => setShowNewSupplierForm(false)}>Cancel</Button>
                                <Button
                                  type="primary"
                                  onClick={handleAddNewSupplier}
                                  disabled={!newSupplierName || !newSupplierContact || !newSupplierEmail}
                                >
                                  Add Supplier
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Add to Request Button */}
                        {selectedSupplier && (
                          <div className="mt-4 flex justify-end">
                            <Button
                              type="primary"
                              onClick={handleAddItemToRequest}
                              icon={<PlusOutlined />}
                            >
                              Add to Request
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {showNewItemForm && (
                      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        {/* <h4 className="font-medium text-gray-900 mb-3">Add New Items</h4> */}

                        <table className="w-full table-auto border text-sm">
                          <thead>
                            <tr className="bg-gray-100 text-left">
                              <th className="px-4 py-2 border">Item Name</th>
                              <th className="px-4 py-2 border">Description</th>
                              <th className="px-4 py-2 border">Supplier</th>
                              <th className="px-4 py-2 border text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {newItems.map((item, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 border">
                                  {/* <Input
                                            placeholder="Item Name"
                                            value={item.name}
                                            onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                            className="w-full"
                                          /> */}
                                  <AutoComplete
                                    style={{ width: '100%' }}
                                    options={allItems.map(i => ({
                                      label: i.name,
                                      value: i.name,
                                    }))}
                                    placeholder="Search or enter item name"
                                    value={item.name}
                                    onChange={(value) => {
                                      handleItemChange(index, 'name', value);
                                      const selected = allItems.find(i => i.name === value);
                                      if (selected) {
                                        handleItemChange(index, 'description', selected.description || '');
                                      }
                                    }}
                                    filterOption={(inputValue, option) =>
                                      option?.label.toLowerCase().includes(inputValue.toLowerCase())
                                    }
                                  />

                                </td>
                                <td className="px-4 py-2 border">
                                  <Input.TextArea
                                    placeholder="Description"
                                    value={item.description}
                                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                    className="w-full"
                                    autoSize={{ minRows: 1, maxRows: 3 }}
                                  />
                                </td>
                                <td className="px-4 py-2 border">
                                  {/* <div className="space-y-1">
                                            <Input
                                              placeholder="Supplier Name"
                                              value={item.selectedSupplier?.name || ''}
                                              onChange={(e) => handleSupplierChange(index, 'name', e.target.value)}
                                            />
                                            <Input
                                              placeholder="Contact"
                                              value={item.selectedSupplier?.contact || ''}
                                              onChange={(e) => handleSupplierChange(index, 'contact', e.target.value)}
                                            />
                                            <Input
                                              placeholder="Email"
                                              value={item.selectedSupplier?.email || ''}
                                              onChange={(e) => handleSupplierChange(index, 'email', e.target.value)}
                                            />
                                          </div> */}
                                  {!item.addingNewSupplier && (
                                    <>
                                      <Select
                                        showSearch
                                        placeholder="Select supplier"
                                        value={item.selectedSupplier?.id}
                                        onChange={(value) => handleExistingSupplierSelect(index, value)}
                                        style={{ width: '100%' }}
                                        options={allSuppliers.map(supplier => ({
                                          label: supplier.name,
                                          value: supplier.id,
                                        }))}
                                        optionFilterProp="label"
                                      />
                                      <Button
                                        type="link"
                                        className="text-blue-600 p-0"
                                        onClick={() => handleToggleAddSupplier(index, true)}
                                      >
                                        + Add New Supplier
                                      </Button>
                                    </>
                                  )}

                                  {/* Inline add new supplier form */}
                                  {item.addingNewSupplier && (
                                    <div className="space-y-1">
                                      <Input
                                        placeholder="Supplier Name"
                                        value={item.selectedSupplier?.name || ''}
                                        onChange={(e) => handleSupplierChange(index, 'name', e.target.value)}
                                      />
                                      <Input
                                        placeholder="Contact"
                                        value={item.selectedSupplier?.contact || ''}
                                        onChange={(e) => handleSupplierChange(index, 'contact', e.target.value)}
                                      />
                                      <Input
                                        placeholder="Email"
                                        value={item.selectedSupplier?.email || ''}
                                        onChange={(e) => handleSupplierChange(index, 'email', e.target.value)}
                                      />
                                      <Button
                                        type="link"
                                        className="text-blue-600 p-0"
                                        onClick={() => handleToggleAddSupplier(index, false)}
                                      >
                                        Select Existing Supplier
                                      </Button>
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-2 border text-center">
                                  <Button danger size="small" onClick={() => handleRemoveRow(index)}>
                                    Remove
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div className="flex justify-between mt-4">
                          <Button onClick={handleAddRow} icon={<PlusOutlined />}>
                            Add Row
                          </Button>
                          <div className="space-x-2">
                            <Button onClick={() => setShowNewItemForm(false)}>Cancel</Button>
                            <Button
                              type="primary"
                              onClick={handleAddToRequest}
                              disabled={newItems.length === 0 || newItems.some(item => !item.name || !item.description || !item.selectedSupplier?.name)}
                            >
                              Add to Request
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Section */}
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-6 p-0">

                    {/* Requested Date */}
                    <div className="p-0">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <RequiredLabel>Requested Date</RequiredLabel>
                      </label>
                      <div className="flex items-start p-0">
                        <DatePicker
                          className="w-full"
                          value={values.requestedDate ? dayjs(values.requestedDate) : null}
                          onChange={(date) => {
                            setFieldValue('requestedDate', date ? date.format('YYYY-MM-DD') : '');
                          }}
                        />
                      </div>
                      {touched.requestedDate && errors.requestedDate && (
                        <div className="text-red-500 text-xs mt-1">{errors.requestedDate}</div>
                      )}
                    </div>
                  </div>
                  {/* <div className="border-b pb-4 px-6 pt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Entry Mode</label>
                      <Radio.Group
                        value={entryMode}
                        onChange={(e) => setEntryMode(e.target.value)}
                        optionType="button"
                        buttonStyle="solid"
                      >
                        <Radio.Button value="manual">Manual Entry</Radio.Button>
                        <Radio.Button value="bulk">Bulk Upload</Radio.Button>
                      </Radio.Group>
                    </div> */}
                  {/* 
                  {entryMode === 'bulk' && (
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-medium">Bulk Upload</h3>
                        <p className="text-sm text-gray-500">Upload a CSV file with item and supplier information.</p>
                      </div>

                      <Upload
                        beforeUpload={() => false}
                        maxCount={1}
                        accept=".csv"
                      >
                        <Button icon={<UploadOutlined />}>Upload CSV File</Button>
                      </Upload>

                      <div className="text-xs text-gray-500 mt-2">
                        Accepted format: CSV only. Columns: Item Name, Description, Supplier Name, Contact, Email.
                      </div>
                    </div>
                  )} */}





                </div>
              </SideSheet>
            </div>
          </div>
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
            onConfirm={confirmAction || (() => { })}
            confirmButtonLabel="Confirm"
          />
        </>
      )}
    </Formik>
  );
};

export default Request;