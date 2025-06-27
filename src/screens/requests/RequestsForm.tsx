// import React, { useEffect, useState } from 'react';
// import { Formik, Form, FieldArray, ErrorMessage } from 'formik';
// import * as yup from 'yup';
// import { AppDispatch, RootState } from '../../store/store.ts';
// import { useDispatch, useSelector } from 'react-redux';
// import { createSite } from '../../slices/SiteManagementSlice.ts';
// import dayjs from 'dayjs';
// import RequiredLabel from '../../components/common/RequiredLabel.tsx';
// import FormInput from '../../components/common/FormInput.tsx';
// import MapComponent from '../../components/common/map/GoogleMap.tsx';
// import { Input } from 'antd';
// import { TrashIcon } from 'lucide-react';
// import { Color } from 'antd/es/color-picker/index';
// import { getAllItemPrices } from '../../slices/itemPricesSlice.ts';

// interface ISupplierDetails {
//   id: number;
//   address: string;
//   city: string;
//   state: string;
//   country: string;
//   pin: number;
//   panNumber: string;
//   gstNum: string;
//   supCode: string;
// }

// interface ISupplier {
//   id: number;
//   name: string;
//   email: string;
//   mob_num: string;
//   tel_num: string;
//   details: ISupplierDetails;
// }

// interface IItemDetails {
//   id: number;
//   item_grade: number;
//   item_colour: string;
//   car_model: number;
//   hsn: number;
//   gst: number;
//   rate: number;
//   maintain_stock: number;
//   stock_control: number;
//   Qc_stock_control: number;
//   wp_stock_control: number;
//   qc_requried: number;
//   active: number;
// }

// interface IItem {
//   id: number;
//   item_name: string;
//   uom: number;
//   pack_size: number;
//   erp_code: number;
//   item_code: number;
//   item_group_id: number;
//   item_subgroup_id: number;
//   itemGroup: {
//     id: number;
//     item_group_name: string;
//   };
//   itemSubGroup: {
//     id: number;
//     item_subgroup_name: string;
//   };
//   supplier: ISupplier;
//   details: IItemDetails;
// }


// interface IItemPrice {
//   id: number;
//   company: string;
//   unit: string;
//   effective_date: string;
//   rate: string;
//   default_user: string;
//   supplier: {
//     id: number;
//     name: string;
//     email: string;
//     mob_num: string;
//     tel_num: string;
//     code: string | null;
//   };
//   item: {
//     id: number;
//     item_name: string;
//     uom: string;
//     quantity: number;
//     item_group_id: number;
//     item_subgroup_id: number;
//     pack_size: number;
//     item_code: string;
//     erp_code: string;
//   };
// }

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
//     quantity: number; // Add this line
//     suppliers: {
//       supplierId: number | null;
//       supplierName: string;
//       supplierEmail: string;
//       supplierContact: string;
//       supplierTel: string;
//       isNewSupplier: boolean;
//       selected: boolean;
//     }[];
//   }[];
// }

// interface RequestsFormProps {
//   handleChange: any;
//   values: any;
//   touched: any;
//   errors: any;
//   setFieldValue: any;
//   setFieldTouched: any;
//   validateField: any;
//   initialValues: any;
// }

// const SiteManagementForm: React.FC<RequestsFormProps> = ({
//   handleChange,
//   values,
//   touched,
//   errors,
//   setFieldValue,
//   setFieldTouched,
//   validateField,
//   initialValues
// }) => {
//   const [selectedSiteManager, setSelectedSiteManager] = useState<any>(null);
//   const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
//   const [selectedSuppliers, setSelectedSuppliers] = useState<{ [itemIndex: number]: Set<number> }>({});
//   const [searchQueries, setSearchQueries] = useState<{ [key: number]: string }>({});
//   const [isDropdownOpen, setIsDropdownOpen] = useState<{ [key: number]: boolean }>({});
//   const [manualInputMode, setManualInputMode] = useState<{ [key: number]: boolean }>({});

//   const dispatch = useDispatch<AppDispatch>();

//   // Selectors
//   const { siteManagerMaster } = useSelector((state: RootState) => state.MasterSlice);




//   // const { items, loading: itemsLoading, error: itemsError } = useSelector((state: RootState) => state.items);
//   const { itemPrices, loading: itemPricesLoading, error: itemPricesError } = useSelector((state: RootState) => state.itemPrices);
//   const { suppliers, loading: suppliersLoading, error: suppliersError } = useSelector((state: RootState) => state.suppliers);

//   // API calls on component mount
//   useEffect(() => {
//     dispatch(getAllItemPrices({}));
//   }, [dispatch]);

//   // Optional: Log API data for debugging
//   // useEffect(() => {
//   //   if (items.length > 0) {
//   //     console.log('Items loaded:', items);
//   //   }
//   // }, [items]);

//   useEffect(() => {
//     if (suppliers.length > 0) {
//       console.log('Suppliers loaded:', suppliers);
//     }
//   }, [suppliers]);

//   if (itemPricesLoading) {
//     return (
//       <div className="flex justify-center items-center py-8">
//         <div className="text-[#0F44BE]">
//           Loading item prices...
//         </div>
//       </div>
//     );
//   }

//   // Handle API errors
//   // useEffect(() => {
//   //   if (itemsError) {
//   //     console.error('Items API Error:', itemsError);
//   //     // You can show a toast notification here
//   //   }
//   // }, [itemsError]);

//   useEffect(() => {
//     if (suppliersError) {
//       console.error('Suppliers API Error:', suppliersError);
//       // You can show a toast notification here
//     }
//   }, [suppliersError]);

//   const siteManagerOptions = siteManagerMaster
//     ?.filter(manager => manager.id !== null)
//     .map((manager) => ({
//       value: manager.id,
//       label: manager.managerName,
//       key: manager.id
//     })) ?? [];

//   // Create options for items dropdown (if needed)
//   // const itemOptions = items.map((item) => ({
//   //   value: item.id,
//   //   label: item.item_name,
//   //   key: item.id,
//   //   ...item // Include full item data
//   // }));

//   const itemOptions = itemPrices.map((itemPrice) => ({
//     value: itemPrice.item.id,
//     label: itemPrice.item.item_name,
//     key: itemPrice.id,
//     ...itemPrice // Include full item price data
//   }));

//   // Create options for suppliers dropdown (if needed)
//   const supplierOptions = suppliers.map((supplier) => ({
//     value: supplier.id,
//     label: supplier.supplier_name,
//     key: supplier.id,
//     ...supplier // Include full supplier data
//   }));

//   // Initialize items array if it doesn't exist
//   useEffect(() => {
//     if (!values.items || values.items.length === 0) {
//       setFieldValue('items', [{
//         itemName: '',
//         category: '',
//         subcategory: '',
//         suppliers: [{ itemName: '', itemPrice: '', supplierName: '', selected: false }]
//       }]);
//     }
//   }, [values.items, setFieldValue]);

//   useEffect(() => {
//     if (values && Object.keys(values).length > 0) {
//       Object.entries(values).forEach(([key, value]) => {
//         if (value !== undefined && value !== null) {
//           setFieldValue(key, value);
//         }
//       });
//     }
//   }, [values, setFieldValue]);

//   const toggleRowExpansion = (index: number) => {
//     const newExpandedRows = new Set(expandedRows);
//     if (newExpandedRows.has(index)) {
//       newExpandedRows.delete(index);
//     } else {
//       newExpandedRows.add(index);
//     }
//     setExpandedRows(newExpandedRows);
//   };

//   const initializeSuppliers = (itemIndex: number) => {
//     if (!values.items[itemIndex].suppliers || values.items[itemIndex].suppliers.length === 0) {
//       setFieldValue(`items.${itemIndex}.suppliers`, [{ itemName: '', itemPrice: '', supplierName: '', selected: false }]);
//     }
//   };

//   // Handle individual supplier checkbox selection
//   const handleSupplierSelection = (itemIndex: number, supplierIndex: number, isSelected: boolean) => {
//     setFieldValue(`items.${itemIndex}.suppliers.${supplierIndex}.selected`, isSelected);

//     // Update local state for UI management
//     setSelectedSuppliers(prev => {
//       const newSelected = { ...prev };
//       if (!newSelected[itemIndex]) {
//         newSelected[itemIndex] = new Set();
//       }

//       if (isSelected) {
//         newSelected[itemIndex].add(supplierIndex);
//       } else {
//         newSelected[itemIndex].delete(supplierIndex);
//       }

//       return newSelected;
//     });
//   };

//   // Handle select all suppliers for an item
//   const handleSelectAllSuppliers = (itemIndex: number, selectAll: boolean) => {
//     const suppliers = values.items[itemIndex].suppliers;
//     if (!suppliers) return;

//     suppliers.forEach((_, supplierIndex) => {
//       setFieldValue(`items.${itemIndex}.suppliers.${supplierIndex}.selected`, selectAll);
//     });

//     // Update local state
//     setSelectedSuppliers(prev => {
//       const newSelected = { ...prev };
//       if (selectAll) {
//         newSelected[itemIndex] = new Set(suppliers.map((_, idx) => idx));
//       } else {
//         newSelected[itemIndex] = new Set();
//       }
//       return newSelected;
//     });
//   };

//   // Check if all suppliers are selected for an item
//   const areAllSuppliersSelected = (itemIndex: number) => {
//     const suppliers = values.items[itemIndex].suppliers;
//     if (!suppliers || suppliers.length === 0) return false;
//     return suppliers.every(supplier => supplier.selected);
//   };

//   // Get selected suppliers for an item
//   const getSelectedSuppliers = (itemIndex: number) => {
//     const suppliers = values.items[itemIndex].suppliers;
//     if (!suppliers) return [];
//     return suppliers.filter(supplier => supplier.selected);
//   };

//   // Function to populate supplier data from API
//   const populateSupplierFromAPI = (itemIndex: number, supplierIndex: number, selectedSupplierId: number) => {
//     const selectedSupplier = suppliers.find(supplier => supplier.id === selectedSupplierId);
//     if (selectedSupplier) {
//       setFieldValue(`items.${itemIndex}.suppliers.${supplierIndex}.supplierName`, selectedSupplier.supplier_name);
//       setFieldValue(`items.${itemIndex}.suppliers.${supplierIndex}.supplierEmail`, selectedSupplier.details?.email || '');
//       setFieldValue(`items.${itemIndex}.suppliers.${supplierIndex}.supplierContact`, selectedSupplier.details?.phone || '');
//     }
//   };

//   // Function to populate item data from API
//   const populateItemFromAPI = (itemIndex: number, selectedItemId: number) => {
//     const selectedItem = items.find(item => item.id === selectedItemId);
//     if (selectedItem) {
//       setFieldValue(`items.${itemIndex}.itemName`, selectedItem.item_name);
//       // You can populate other fields if available in your API response
//     }
//   };

//   const handleItemSearch = (index: number, value: string) => {
//     // Update search query
//     setSearchQueries(prev => ({
//       ...prev,
//       [index]: value
//     }));

//     // Set the item name
//     setFieldValue(`items.${index}.itemName`, value);

//     // Show dropdown if there's input
//     if (value.trim()) {
//       setIsDropdownOpen(prev => ({
//         ...prev,
//         [index]: true
//       }));

//       // Find if this matches any existing item
//       const matchingItem = items.find(item =>
//         item.item_name.toLowerCase() === value.toLowerCase()
//       );

//       if (matchingItem) {
//         // If it's an existing item, set the full item data
//         setFieldValue(`items.${index}.item`, {
//           id: matchingItem.id,
//           name: matchingItem.item_name
//         });

//         // Set category and subcategory from the existing item
//         if (matchingItem.itemGroup && matchingItem.itemSubGroup) {
//           setFieldValue(`items.${index}.category`, matchingItem.itemGroup.item_group_name);
//           setFieldValue(`items.${index}.subcategory`, matchingItem.itemSubGroup.item_subgroup_name);
//         }
//       }
//     } else {
//       // Clear item data if input is empty
//       setFieldValue(`items.${index}.itemName`, '');
//       setFieldValue(`items.${index}.category`, '');
//       setFieldValue(`items.${index}.subcategory`, '');
//       setIsDropdownOpen(prev => ({
//         ...prev,
//         [index]: false
//       }));
//     }
//   };

//   const handleKeyPress = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       const value = e.currentTarget.value.trim();
//       if (value) {
//         const matchingItem = items.find(item =>
//           item.item_name.toLowerCase() === value.toLowerCase()
//         );
//         if (!matchingItem) {
//           // Just set the item name for new items
//           setFieldValue(`items.${index}.itemName`, value);
//           setIsDropdownOpen(prev => ({
//             ...prev,
//             [index]: false
//           }));
//         }
//       }
//     }
//   };

//   const handleItemSelect = (index: number, selectedItemPrice: IItemPrice) => {
//     const { item, supplier } = selectedItemPrice;

//     setFieldValue(`items.${index}.item`, {
//       id: item.id,
//       name: item.item_name
//     });
//     setFieldValue(`items.${index}.itemName`, item.item_name);
//     setFieldValue(`items.${index}.quantity`, 1); // Default quantity

//     // Set category and subcategory if available in your data structure
//     // You may need to adjust these based on your actual data
//     setFieldValue(`items.${index}.category`, item.item_group_id.toString());
//     setFieldValue(`items.${index}.subcategory`, item.item_subgroup_id.toString());

//     // Auto-add the supplier from the item price
//     setFieldValue(`items.${index}.suppliers`, [{
//       supplierId: supplier.id,
//       supplierName: supplier.name,
//       supplierEmail: supplier.email,
//       supplierContact: supplier.mob_num,
//       supplierTel: supplier.tel_num,
//       isNewSupplier: false,
//       selected: true
//     }]);

//     setIsDropdownOpen(prev => ({
//       ...prev,
//       [index]: false
//     }));
//     setSearchQueries(prev => ({
//       ...prev,
//       [index]: item.item_name
//     }));
//   };


//   // const handleItemSelect = (index: number, selectedItem: IItem) => {
//   //   setFieldValue(`items.${index}.item`, {
//   //     id: selectedItem.id,
//   //     name: selectedItem.item_name
//   //   });
//   //   setFieldValue(`items.${index}.itemName`, selectedItem.item_name);

//   //   // If the item has quantity data, use it (adjust based on your API structure)
//   //   setFieldValue(`items.${index}.quantity`, selectedItem.details?.maintain_stock || 1);

//   //   if (selectedItem.itemGroup && selectedItem.itemSubGroup) {
//   //     setFieldValue(`items.${index}.category`, selectedItem.itemGroup.item_group_name);
//   //     setFieldValue(`items.${index}.subcategory`, selectedItem.itemSubGroup.item_subgroup_name);
//   //   }

//   //   setIsDropdownOpen(prev => ({
//   //     ...prev,
//   //     [index]: false
//   //   }));
//   //   setSearchQueries(prev => ({
//   //     ...prev,
//   //     [index]: selectedItem.item_name
//   //   }));
//   // };

//   // const filteredItems = (index: number) => {
//   //   const query = searchQueries[index]?.toLowerCase() || '';
//   //   return items.filter(item =>
//   //     item.item_name.toLowerCase().includes(query)
//   //   );
//   // };

//   const filteredItems = (index: number) => {
//     const query = searchQueries[index]?.toLowerCase() || '';
//     return itemPrices.filter(itemPrice =>
//       itemPrice.item.item_name.toLowerCase().includes(query)
//     );
//   };



//   // Add date handling
//   const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const date = e.target.value;
//     if (date) {
//       setFieldValue('date_requested', date);
//     }
//   };

//   // Toggle between manual input and item selection
//   const toggleInputMode = (index: number) => {
//     setManualInputMode(prev => ({
//       ...prev,
//       [index]: !prev[index]
//     }));

//     // Clear item data when switching modes
//     if (!manualInputMode[index]) {
//       setFieldValue(`items.${index}.item`, { id: 0, name: '' });
//       setFieldValue(`items.${index}.itemName`, '');
//       setFieldValue(`items.${index}.category`, '');
//       setFieldValue(`items.${index}.subcategory`, '');
//     }
//   };

//   // Handle manual item input
//   const handleManualItemInput = (index: number, field: string, value: string) => {
//     setFieldValue(`items.${index}.${field}`, value);

//     // If this is a new item, set a temporary ID
//     if (field === 'itemName' && !values.items[index].item.id) {
//       setFieldValue(`items.${index}.item`, {
//         id: -1, // Use -1 to indicate a new item
//         name: value
//       });
//     }
//   };

//   // Add new supplier handling
//   const handleAddNewSupplier = (itemIndex: number) => {
//     const newSupplier = {
//       supplierId: -1, // Use -1 to indicate a new supplier
//       supplierName: '',
//       supplierEmail: '',
//       supplierContact: '',
//       supplierTel: '', // Add tel_num field
//       isNewSupplier: true, // Add flag for new supplier
//       selected: true // Auto-select new suppliers
//     };

//     const currentSuppliers = values.items[itemIndex]?.suppliers || [];
//     setFieldValue(`items.${itemIndex}.suppliers`, [...currentSuppliers, newSupplier]);
//   };

//   // // Show loading state
//   // if (itemsLoading || suppliersLoading) {
//   //   return (
//   //     <div className="flex justify-center items-center py-8">
//   //       <div className="text-[#0F44BE]">
//   //         Loading {itemsLoading ? 'items' : ''} {itemsLoading && suppliersLoading ? 'and' : ''} {suppliersLoading ? 'suppliers' : ''}...
//   //       </div>
//   //     </div>
//   //   );
//   // }

//   return (
//     <Form>
//       {/* <p className='text-[#0F44BE] mb-3'>Create New Purchase Request</p> */}

//       {/* Show API errors if any */}
//       {/* {(itemsError || suppliersError) && (
//         <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//           {itemsError && <div>Items Error: {itemsError}</div>}
//           {suppliersError && <div>Suppliers Error: {suppliersError}</div>}
//         </div>
//       )} */}

//       {/* Basic Information Section */}
//       <div className="mb-6">
//         {/* <h3 className="text-lg font-semibold mb-4 text-[#0F44BE]">Basic Information</h3> */}
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <RequiredLabel>Department</RequiredLabel>
//             <FormInput
//               name="department"
//               type="text"
//               placeholder="Enter Department"
//               onChange={handleChange}
//               value={values.department}
//               error={touched.department && errors.department}
//             />
//           </div>
//           <div>
//             <RequiredLabel>Required date</RequiredLabel>
//             <FormInput
//               type="date"
//               name="date_requested"
//               value={values.date_requested}
//               onChange={handleDateChange}
//               className="w-full px-3 mt-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//             {/* {touched.date_requested && errors.date_requested && (
//               <div className="text-red-500 text-sm mt-1">{errors.date_requested}</div>
//             )} */}
//           </div>
//         </div>
//       </div>

//       {/* Items Table Section */}
//       <div className="mb-6">
//         <h3 className="text-lg font-semibold mb-4 text-[#0F44BE]">
//           Purchase Items
//           {/* <span className="text-sm font-normal text-gray-600 ml-2">
//             ({items.length} items, {suppliers.length} suppliers available)
//           </span> */}
//         </h3>

//         <FieldArray name="items">
//           {({ push, remove }) => (
//             <div>
//               {/* Table Header */}
//               <div className="">
//                 <table className="w-full table-auto">
//                   <thead>
//                     <tr className="">
//                       <th className="border border-gray-300 bg-blue-50 px-4 py-2 text-left font-semibold">
//                         <RequiredLabel>Item Name</RequiredLabel>
//                       </th>
//                       <th className="border border-gray-300 bg-blue-50 px-4 py-2 text-left font-semibold">
//                         <RequiredLabel>Category</RequiredLabel>
//                       </th>
//                       <th className="border border-gray-300 bg-blue-50 px-4 py-2 text-left font-semibold">
//                         <RequiredLabel>Subcategory</RequiredLabel>
//                       </th>
//                       <th className="border border-gray-300 bg-blue-50 px-4 py-2 text-left font-semibold">
//                         <RequiredLabel>Quantity</RequiredLabel>
//                       </th>
//                       <th className="border border-gray-300 bg-blue-50 px-4 py-2 text-center font-semibold">
//                         Suppliers
//                       </th>
//                       <th className="border border-gray-300 bg-blue-50 px-4 py-2 text-center font-semibold w-20">
//                         Action
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {values.items && values.items.map((item, index) => (
//                       <React.Fragment key={index}>
//                         {/* Main Row */}
//                         <tr className="hover:bg-gray-50">
//                           <td className="border-t border-b  border-gray-300 px-2 py-2">
//                             <div className="flex flex-col gap-2">
//                               {/* Toggle button */}
//                               <button
//                                 type="button"
//                                 onClick={() => toggleInputMode(index)}
//                                 className="text-sm text-blue-600 hover:text-blue-800"
//                               >
//                                 {/* {manualInputMode[index] ? 'Select Existing Item' : 'Enter New Item'} */}
//                               </button>

//                               {manualInputMode[index] ? (
//                                 // Manual input fields
//                                 <div className="space-y-2">
//                                   <div className="relative">
//                                     <Input
//                                       placeholder="Enter item name..."
//                                       value={item.itemName || ''}
//                                       onChange={(e) => {
//                                         const value = e.target.value;
//                                         handleItemSearch(index, value);
//                                       }}
//                                       onKeyPress={(e) => handleKeyPress(index, e)}
//                                       className="w-full"
//                                     />
//                                     {/* <ErrorMessage className="text-red-500 text-sm mt-1" errors={errors} touched={touched} name={`items[${index}].itemName`} /> */}

//                                     {isDropdownOpen[index] && searchQueries[index]?.trim() && (
//                                       <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
//                                         {filteredItems(index).map(item => (
//                                           <div
//                                             key={item.id}
//                                             className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                                             onClick={() => handleItemSelect(index, item)}
//                                           >
//                                             {item.item_name}
//                                             <hr className='text-black' />
//                                           </div>
//                                         ))}
//                                         {filteredItems(index).length === 0 && (
//                                           <div className="px-4 py-2 text-gray-500">
//                                             Press Enter to add as new item
//                                           </div>
//                                         )}
//                                       </div>
//                                     )}
//                                   </div>
//                                   <FormInput
//                                     name={`items.${index}.category`}
//                                     type="text"
//                                     placeholder="Enter Category"
//                                     onChange={(e) => handleManualItemInput(index, 'category', e.target.value)}
//                                     value={item.category || ''}
//                                     error={touched.items?.[index]?.category && errors.items?.[index]?.category}
//                                   />

//                                   <FormInput
//                                     name={`items.${index}.subcategory`}
//                                     type="text"
//                                     placeholder="Enter Subcategory"
//                                     onChange={(e) => handleManualItemInput(index, 'subcategory', e.target.value)}
//                                     value={item.subcategory || ''}
//                                     error={touched.items?.[index]?.subcategory && errors.items?.[index]?.subcategory}
//                                   />

//                                 </div>
//                               ) : (
//                                 // Existing item selection
//                                 // <div className="relative mb-4">
//                                 //   <Input
//                                 //     placeholder="Search for items or enter new item..."
//                                 //     value={searchQueries[index] || values.items[index]?.itemName || ''}
//                                 //     onChange={(e) => handleItemSearch(index, e.target.value)}
//                                 //     onFocus={() => setIsDropdownOpen(prev => ({ ...prev, [index]: true }))}
//                                 //     className="w-full px-2 py-2 mb-1"
//                                 //   />
//                                 //   <div style={{ color: 'red' }}>
//                                 //     <ErrorMessage errors={errors} touched={touched} name={`items[${index}].itemName`} />
//                                 //   </div>

//                                 //   {isDropdownOpen[index] && searchQueries[index]?.trim() && (
//                                 //     <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
//                                 //       {filteredItems(index).map(item => (
//                                 //         <div
//                                 //           key={item.id}
//                                 //           className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                                 //           onClick={() => handleItemSelect(index, item)}
//                                 //         >
//                                 //           {item.item_name}
//                                 //         </div>
//                                 //       ))}
//                                 //       {filteredItems(index).length === 0 && (
//                                 //         // <div >
//                                 //         //   Press Enter to add as new item
//                                 //         // </div>
//                                 //         <p className='text-white'></p>
//                                 //       )}
//                                 //     </div>
//                                 //   )}
//                                 // </div>

//                                 <div className="relative mb-4">
//                                 <Input
//                                   placeholder="Search for items..."
//                                   value={searchQueries[index] || values.items[index]?.itemName || ''}
//                                   onChange={(e) => handleItemSearch(index, e.target.value)}
//                                   onFocus={() => setIsDropdownOpen(prev => ({ ...prev, [index]: true }))}
//                                 />

//                                 {isDropdownOpen[index] && searchQueries[index]?.trim() && (
//                                   <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
//                                     {filteredItems(index).map(itemPrice => (
//                                       <div
//                                         key={itemPrice.id}
//                                         className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                                         onClick={() => handleItemSelect(index, itemPrice)}
//                                       >
//                                         <div>{itemPrice.item.item_name}</div>
//                                         <div className="text-sm text-gray-500">
//                                           {itemPrice.supplier.name} - ₹{itemPrice.rate}
//                                         </div>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 )}
//                               </div>

//                               )}
//                             </div>
//                             {touched.items?.[index]?.item?.id && errors.items?.[index]?.item?.id && (
//                               <div className="text-red-500 text-sm mt-1">
//                                 {errors.items[index].item.id}
//                               </div>
//                             )}
//                           </td>
//                           <td className="border-t border-b border-gray-300 px-2 py-2">
//                             <FormInput
//                               name={`items.${index}.category`}
//                               type="text"
//                               placeholder="Enter Category"
//                               onChange={handleChange}
//                               value={item.category || ''}
//                               error={
//                                 touched.items?.[index]?.category &&
//                                 errors.items?.[index]?.category
//                               }
//                               className="border-0 focus:ring-0 p-1"
//                             />
//                           </td>
//                           <td className="border-t border-b border-gray-300 px-2 py-2">
//                             <FormInput
//                               name={`items.${index}.subcategory`}
//                               type="text"
//                               placeholder="Enter Subcategory"
//                               onChange={handleChange}
//                               value={item.subcategory || ''}
//                               error={
//                                 touched.items?.[index]?.subcategory &&
//                                 errors.items?.[index]?.subcategory
//                               }
//                               className="border-0 focus:ring-0 p-1"
//                             />
//                           </td>
//                           <td className="border-t border-b border-gray-300 px-2 py-2">
//                             <FormInput
//                               name={`items.${index}.quantity`}
//                               type="number"
//                               min="1"
//                               placeholder="Enter quantity"
//                               onChange={handleChange}
//                               value={item.quantity}
//                               error={
//                                 touched.items?.[index]?.quantity &&
//                                 errors.items?.[index]?.quantity
//                               }
//                               className="border-0 focus:ring-0 p-1 w-full"
//                             />
//                           </td>
//                           <td className="border-t border-b border-gray-300 px-2 py-2 text-center">
//                             <button
//                               type="button"
//                               onClick={() => {
//                                 initializeSuppliers(index);
//                                 toggleRowExpansion(index);
//                               }}
//                               className="bg-[#000] text-white px-3 py-1 rounded text-sm flex items-center gap-1 mx-auto transition-colors"
//                             >
//                               <span className={`transform transition-transform ${expandedRows.has(index) ? 'rotate-180' : ''}`}>
//                                 ▼
//                               </span>
//                               Suppliers
//                               {item.suppliers && getSelectedSuppliers(index).length > 0 && (
//                                 <span className="bg-white text-[#0F44BE] px-1 rounded-full text-xs ml-1">
//                                   {getSelectedSuppliers(index).length}
//                                 </span>
//                               )}
//                             </button>
//                           </td>
//                           <td className="border-t border-b border-gray-300 px-2 py-2 text-center">
//                             {values.items.length > 1 && (
//                               <button
//                                 type="button"
//                                 onClick={() => remove(index)}
//                                 className="text-red-500 px-2 py-1 rounded text-sm"
//                                 title="Remove Item"
//                               >
//                                 {/* × */}
//                                 <TrashIcon className="h-4 w-4 inline-block" />
//                               </button>
//                             )}
//                           </td>
//                         </tr>

//                         {/* Collapsible Supplier Row */}
//                         {expandedRows.has(index) && (
//                           <tr>
//                             <td colSpan={5} className="border p-0">
//                               <div className="bg-white-50 p-4">
//                                 <FieldArray name={`items.${index}.suppliers`}>
//                                   {({ push: pushSupplier, remove: removeSupplier }) => (
//                                     <div>
//                                       <div className="flex items-center justify-between mb-3">
//                                         <h4 className="font-semibold text-[#0F44BE]">
//                                           Suppliers for {item.itemName || 'this item'}
//                                         </h4>
//                                       </div>

//                                       {/* Supplier Table */}
//                                       <div className="overflow-x-auto mb-3">
//                                         <table className="w-full">
//                                           <thead>
//                                             <tr className="">
//                                               <th className="border border-gray-300 bg-blue-50 px-3 py-2 text-center font-semibold w-12">
//                                                 Select
//                                               </th>
//                                               <th className="border border-gray-300 bg-blue-50 px-3 py-2 text-left font-semibold">
//                                                 Supplier Name
//                                               </th>
//                                               <th className="border border-gray-300 bg-blue-50 px-3 py-2 text-left font-semibold">
//                                                 Supplier Email
//                                               </th>
//                                               <th className="border border-gray-300 bg-blue-50 px-3 py-2 text-left font-semibold">
//                                                 Supplier Contact
//                                               </th>
//                                               <th className="border border-gray-300 bg-blue-50 px-3 py-2 text-left font-semibold">
//                                                 Supplier Tel
//                                               </th>
//                                               <th className="border border-gray-300 bg-blue-50 px-3 py-2 text-center font-semibold w-20">
//                                                 Action
//                                               </th>
//                                             </tr>
//                                           </thead>
//                                           <tbody>
//                                             {/* Existing suppliers from API */}
//                                             {suppliers.map((apiSupplier) => (
//                                               <tr key={`api-${apiSupplier.id}`} className="hover:bg-gray-100">
//                                                 <td className="border-t border-b border-gray-300 px-2 py-2 text-center">
//                                                   <input
//                                                     type="checkbox"
//                                                     checked={values.items[index]?.suppliers?.some(s => s.supplierId === apiSupplier.id && s.selected) || false}
//                                                     onChange={(e) => {
//                                                       const isSelected = e.target.checked;
//                                                       const existingSupplierIndex = values.items[index]?.suppliers?.findIndex(s => s.supplierId === apiSupplier.id);

//                                                       if (existingSupplierIndex >= 0) {
//                                                         handleSupplierSelection(index, existingSupplierIndex, isSelected);
//                                                       } else if (isSelected) {
//                                                         const newSupplier = {
//                                                           supplierId: apiSupplier.id,
//                                                           supplierName: apiSupplier.name,
//                                                           supplierEmail: apiSupplier.email,
//                                                           supplierContact: apiSupplier.mob_num,
//                                                           selected: true
//                                                         };
//                                                         const currentSuppliers = values.items[index]?.suppliers || [];
//                                                         setFieldValue(`items.${index}.suppliers`, [...currentSuppliers, newSupplier]);
//                                                       }
//                                                     }}
//                                                     className="rounded border-gray-300 text-[#0F44BE] focus:ring-[#0F44BE]"
//                                                   />
//                                                 </td>
//                                                 <td className="border-t border-b border-gray-300 px-2 py-2">
//                                                   <div className="p-1">{apiSupplier.name}</div>
//                                                 </td>
//                                                 <td className="border-t border-b border-gray-300 px-2 py-2">
//                                                   <div className="p-1">{apiSupplier.email}</div>
//                                                 </td>
//                                                 <td className="border-t border-b border-gray-300 px-2 py-2">
//                                                   <div className="p-1">{apiSupplier.mob_num}</div>
//                                                 </td>
//                                                 <td className="border-t border-b border-gray-300 px-2 py-2">
//                                                   <div className="p-1">{apiSupplier.tel_num}</div>
//                                                 </td>
//                                                 <td className="border-t border-b border-gray-300 px-2 py-2 text-center">
//                                                   {/* No action for API suppliers */}
//                                                 </td>
//                                               </tr>
//                                             ))}

//                                             {/* Manual suppliers */}
//                                             {item.showManualSuppliers && item.suppliers?.map((supplier, supplierIndex) => (
//                                               <tr key={supplierIndex} className="hover:bg-gray-100">
//                                                 <td className="border-t border-b border-gray-300 px-2 py-2 text-center">
//                                                   <input
//                                                     type="checkbox"
//                                                     checked={supplier.selected}
//                                                     onChange={(e) => handleSupplierSelection(index, supplierIndex, e.target.checked)}
//                                                     className="rounded border-gray-300 text-[#0F44BE] focus:ring-[#0F44BE]"
//                                                   />
//                                                 </td>
//                                                 <td className="border-t border-b border-gray-300 px-2 py-2">
//                                                   <FormInput
//                                                     name={`items.${index}.suppliers.${supplierIndex}.supplierName`}
//                                                     type="text"
//                                                     placeholder="Enter supplier name"
//                                                     onChange={handleChange}
//                                                     value={supplier.supplierName || ''}
//                                                     className="border-0 focus:ring-0 p-1 w-full"
//                                                   />
//                                                 </td>
//                                                 <td className="border-t border-b border-gray-300 px-2 py-2">
//                                                   <FormInput
//                                                     name={`items.${index}.suppliers.${supplierIndex}.supplierEmail`}
//                                                     type="email"
//                                                     placeholder="Enter supplier email"
//                                                     onChange={handleChange}
//                                                     value={supplier.supplierEmail || ''}
//                                                     className="border-0 focus:ring-0 p-1 w-full"
//                                                   />
//                                                 </td>
//                                                 <td className="border-t border-b border-gray-300 px-2 py-2">
//                                                   <FormInput
//                                                     name={`items.${index}.suppliers.${supplierIndex}.supplierContact`}
//                                                     type="text"
//                                                     placeholder="Enter supplier contact"
//                                                     onChange={handleChange}
//                                                     value={supplier.supplierContact || ''}
//                                                     className="border-0 focus:ring-0 p-1 w-full"
//                                                   />
//                                                 </td>
//                                                 <td className="border-t border-b border-gray-300 px-2 py-2">
//                                                   <FormInput
//                                                     name={`items.${index}.suppliers.${supplierIndex}.supplierTel`}
//                                                     type="text"
//                                                     placeholder="Enter supplier tel"
//                                                     onChange={handleChange}
//                                                     value={supplier.supplierTel || ''}
//                                                     className="border-0 focus:ring-0 p-1 w-full"
//                                                   />
//                                                 </td>
//                                                 <td className="border-t border-b border-gray-300 px-2 py-2 text-center">
//                                                   {item.suppliers && item.suppliers.length > 1 && (
//                                                     <button
//                                                       type="button"
//                                                       onClick={() => removeSupplier(supplierIndex)}
//                                                       className="text-red-500 px-2 py-1 rounded text-sm"
//                                                       title="Remove Supplier"
//                                                     >
//                                                       <TrashIcon className="h-4 w-4 inline-block" />
//                                                     </button>
//                                                   )}
//                                                 </td>
//                                               </tr>
//                                             ))}
//                                           </tbody>
//                                         </table>
//                                       </div>



//                                       {/* Action Buttons */}
//                                       <div className="flex gap-2">
//                                         <button
//                                           type="button"
//                                           onClick={() => {
//                                             // setFieldValue(`items.${index}.showManualSuppliers`, true);
//                                             // handleAddNewSupplier(index)
//                                             if (!item.showManualSuppliers) {
//                                               setFieldValue(`items.${index}.showManualSuppliers`, true);
//                                             } else {
//                                               handleAddNewSupplier(index);
//                                             }
//                                           }}
//                                           className="bg-black hover:bg-black-300 text-white px-3 py-2 rounded text-sm flex items-center gap-1"
//                                         >
//                                           <span className="text-sm">+</span>
//                                           Add New Supplier
//                                         </button>

//                                         {/* {getSelectedSuppliers(index).length > 0 && (
//                                             <button
//                                               type="button"
//                                               onClick={() => {
//                                                 const selectedCount = getSelectedSuppliers(index).length;
//                                                 alert(`${selectedCount} supplier(s) selected for ${item.itemName || 'this item'}`);
//                                               }}
//                                               className="bg-[#0F44BE] hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
//                                             >
//                                               View Selected ({getSelectedSuppliers(index).length})
//                                             </button>
//                                           )} */}
//                                       </div>
//                                     </div>
//                                   )}
//                                 </FieldArray>
//                               </div>
//                             </td>
//                           </tr>
//                         )}
//                       </React.Fragment>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Add New Item Button */}
//               <div className="mt-4">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     push({
//                       item: { id: 0, name: '' },
//                       itemName: '',
//                       category: '',
//                       subcategory: '',
//                       quantity: '', // Default to 1
//                       suppliers: [{
//                         supplierId: 0,
//                         supplierName: '',
//                         supplierEmail: '',
//                         supplierContact: '',
//                         selected: false
//                       }]
//                     });
//                     // Initialize manual input mode for new item
//                     setManualInputMode(prev => ({
//                       ...prev,
//                       [values.items.length]: false
//                     }));
//                   }}
//                   className="text-blue-500 rounded flex items-center gap-2 transition-colors"
//                 >
//                   <span className="text-xl">+</span>
//                   Add New Item
//                 </button>
//               </div>
//             </div>
//           )}
//         </FieldArray>
//       </div>
//     </Form>
//   );
// };

// export default SiteManagementForm;

import React, { useEffect, useState } from 'react';
import { Formik, Form, FieldArray, ErrorMessage } from 'formik';
import { AppDispatch, RootState } from '../../store/store.ts';
import { useDispatch, useSelector } from 'react-redux';
import RequiredLabel from '../../components/common/RequiredLabel.tsx';
import FormInput from '../../components/common/FormInput.tsx';
import { Input } from 'antd';
import { TrashIcon } from 'lucide-react';
import { getAllItemPrices } from '../../slices/itemPricesSlice.ts';
import { getAllSuppliers } from '../../slices/SupplierSlice.ts';

interface ISupplierDetails {
  id: number;
  address: string;
  city: string;
  state: string;
  country: string;
  pin: number;
  panNumber: string;
  gstNum: string;
  supCode: string;
}

interface ISupplier {
  id: number;
  name: string;
  email: string;
  mob_num: string;
  tel_num: string;
  details: ISupplierDetails;
}

interface IItemPrice {
  id: number;
  company: string;
  unit: string;
  effective_date: string;
  rate: string;
  default_user: string;
  supplier: ISupplier;
  item: {
    id: number;
    item_name: string;
    uom: string;
    quantity: number;
    item_group_id: number;
    item_subgroup_id: number;
    itemGroup: {
      id: number;
      item_group_name: string;
    }
    itemSubGroup: {
      id: number;
      item_subgroup_name: string;
    }
    pack_size: number;
    item_code: string;
    erp_code: string;
  };
}

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
    quantity: number;
    suppliers: {
      supplierId: number | null;
      supplierName: string;
      supplierEmail: string;
      supplierContact: string;
      supplierTel: string;
      isNewSupplier: boolean;
      selected: boolean;
      rate?: string;
      effectiveDate?: string;
    }[];
  }[];
}

interface RequestsFormProps {
  handleChange: any;
  values: any;
  touched: any;
  errors: any;
  setFieldValue: any;
  setFieldTouched: any;
  validateField: any;
  initialValues: any;
}

const SiteManagementForm: React.FC<RequestsFormProps> = ({
  handleChange,
  values,
  touched,
  errors,
  setFieldValue,
  setFieldTouched,
  validateField,
  initialValues
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [selectedSuppliers, setSelectedSuppliers] = useState<{ [itemIndex: number]: Set<number> }>({});
  const [searchQueries, setSearchQueries] = useState<{ [key: number]: string }>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState<{ [key: number]: boolean }>({});
  const [supplierSearchQueries, setSupplierSearchQueries] = useState<{ [key: string]: string }>({});
  const [isSupplierDropdownOpen, setIsSupplierDropdownOpen] = useState<{ [key: string]: boolean }>({});

  const dispatch = useDispatch<AppDispatch>();
  const { itemPrices, loading: itemPricesLoading } = useSelector((state: RootState) => state.itemPrices);
  const { suppliers, loading: suppliersLoading } = useSelector((state: RootState) => state.suppliers);

  useEffect(() => {
    dispatch(getAllItemPrices({}));
    dispatch(getAllSuppliers({}));
  }, [dispatch]);

  useEffect(() => {
    if (!values.items || values.items.length === 0) {
      setFieldValue('items', [{
        item: { id: 0, name: '' },
        itemName: '',
        category: '',
        subcategory: '',
        quantity: 1,
        suppliers: [{
          supplierId: null,
          supplierName: '',
          supplierEmail: '',
          supplierContact: '',
          supplierTel: '',
          isNewSupplier: false,
          selected: false
        }]
      }]);
    }
  }, [values.items, setFieldValue]);

  const toggleRowExpansion = (index: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleSupplierSelection = (itemIndex: number, supplierIndex: number, isSelected: boolean) => {
    setFieldValue(`items.${itemIndex}.suppliers.${supplierIndex}.selected`, isSelected);

    setSelectedSuppliers(prev => {
      const newSelected = { ...prev };
      if (!newSelected[itemIndex]) {
        newSelected[itemIndex] = new Set();
      }

      if (isSelected) {
        newSelected[itemIndex].add(supplierIndex);
      } else {
        newSelected[itemIndex].delete(supplierIndex);
      }

      return newSelected;
    });
  };

  const getSelectedSuppliers = (itemIndex: number) => {
    const suppliers = values.items[itemIndex]?.suppliers;
    return suppliers?.filter((supplier: any) => supplier.selected) || [];
  };

  const handleItemSearch = (index: number, value: string) => {
    setSearchQueries(prev => ({ ...prev, [index]: value }));
    setFieldValue(`items.${index}.itemName`, value);

    if (value.trim()) {
      setIsDropdownOpen(prev => ({ ...prev, [index]: true }));
    } else {
      setIsDropdownOpen(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleKeyPress = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value) {
        const matchingItem = itemPrices.find(itemPrice =>
          itemPrice.item.item_name.toLowerCase() === value.toLowerCase()
        );
        if (!matchingItem) {
          setFieldValue(`items.${index}.itemName`, value);
          setIsDropdownOpen(prev => ({ ...prev, [index]: false }));
        }
      }
    }
  };

  const handleItemSelect = (index: number, selectedItemPrice: IItemPrice) => {
    const itemSuppliers = itemPrices.filter(ip =>
      ip.item.id === selectedItemPrice.item.id
    );

    setFieldValue(`items.${index}.item`, {
      id: selectedItemPrice.item.id,
      name: selectedItemPrice.item.item_name
    });
    setFieldValue(`items.${index}.itemName`, selectedItemPrice.item.item_name);
    setFieldValue(`items.${index}.quantity`, 1);
    setFieldValue(`items.${index}.category`, selectedItemPrice.item.itemGroup.item_group_name);
    setFieldValue(`items.${index}.subcategory`, selectedItemPrice.item.itemSubGroup.item_subgroup_name);

    const suppliers = itemSuppliers.map(supplier => ({
      supplierId: supplier.supplier.id,
      supplierName: supplier.supplier.name,
      supplierEmail: supplier.supplier.email,
      supplierContact: supplier.supplier.mob_num,
      supplierTel: supplier.supplier.tel_num,
      isNewSupplier: false,
      selected: false,
      rate: supplier.rate,
      effectiveDate: supplier.effective_date
    }));

    setFieldValue(`items.${index}.suppliers`, suppliers);
    setIsDropdownOpen(prev => ({ ...prev, [index]: false }));
    setSearchQueries(prev => ({ ...prev, [index]: selectedItemPrice.item.item_name }));
  };

  const filteredItems = (index: number) => {
    const query = searchQueries[index]?.toLowerCase() || '';
    return itemPrices.filter(itemPrice =>
      itemPrice.item.item_name.toLowerCase().includes(query)
    );
  };

  const handleSupplierSearch = (itemIndex: number, supplierIndex: number, value: string) => {
    const key = `${itemIndex}-${supplierIndex}`;
    setSupplierSearchQueries(prev => ({ ...prev, [key]: value }));
    setFieldValue(`items.${itemIndex}.suppliers.${supplierIndex}.supplierName`, value);

    if (value.trim()) {
      setIsSupplierDropdownOpen(prev => ({ ...prev, [key]: true }));
    } else {
      setIsSupplierDropdownOpen(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleSupplierSelect = (itemIndex: number, supplierIndex: number, selectedSupplier: ISupplier) => {
    const key = `${itemIndex}-${supplierIndex}`;

    setFieldValue(`items.${itemIndex}.suppliers.${supplierIndex}`, {
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.name,
      supplierEmail: selectedSupplier.email,
      supplierContact: selectedSupplier.mob_num,
      supplierTel: selectedSupplier.tel_num,
      isNewSupplier: false,
      selected: true
    });

    setIsSupplierDropdownOpen(prev => ({ ...prev, [key]: false }));
    setSupplierSearchQueries(prev => ({ ...prev, [key]: selectedSupplier.name }));
  };

  const filteredSuppliers = (itemIndex: number, supplierIndex: number) => {
    const key = `${itemIndex}-${supplierIndex}`;
    const query = supplierSearchQueries[key]?.toLowerCase() || '';
    return suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(query)
    );
  };

  const handleAddNewSupplier = (itemIndex: number) => {
    const currentSuppliers = values.items[itemIndex]?.suppliers || [];
    setFieldValue(`items.${itemIndex}.suppliers`, [...currentSuppliers, {
      supplierId: null,
      supplierName: '',
      supplierEmail: '',
      supplierContact: '',
      supplierTel: '',
      isNewSupplier: true,
      selected: true
    }]);
  };

  // if (itemPricesLoading || suppliersLoading) {
  //   return (
  //     <div className="flex justify-center items-center py-8">
  //       <div className="text-[#0F44BE]">
  //         Loading {itemPricesLoading ? 'item prices' : ''}
  //         {itemPricesLoading && suppliersLoading ? ' and ' : ''}
  //         {suppliersLoading ? 'suppliers' : ''}...
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <Form>
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <RequiredLabel>Department</RequiredLabel>
            <FormInput
              name="department"
              type="text"
              placeholder="Enter Department"
              onChange={handleChange}
              value={values.department}
              error={touched.department && errors.department}
            />
          </div>
          <div>
            <RequiredLabel>Required date</RequiredLabel>
            <FormInput
              type="date"
              name="date_requested"
              value={values.date_requested}
              onChange={handleChange}
              className="w-full px-3 mt-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-[#0F44BE]">Purchase Items</h3>

        <FieldArray name="items">
          {({ push, remove }) => (
            <div>
              <div className="">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="">
                      <th className="border border-gray-300 bg-blue-50 px-4 py-2 text-left font-semibold">
                        <RequiredLabel>Item Name</RequiredLabel>
                      </th>
                      <th className="border border-gray-300 bg-blue-50 px-4 py-2 text-left font-semibold">
                        <RequiredLabel>Category</RequiredLabel>
                      </th>
                      <th className="border border-gray-300 bg-blue-50 px-4 py-2 text-left font-semibold">
                        <RequiredLabel>Subcategory</RequiredLabel>
                      </th>
                      <th className="border border-gray-300 bg-blue-50 px-4 py-2 text-left font-semibold">
                        <RequiredLabel>Quantity</RequiredLabel>
                      </th>
                      <th className="border border-gray-300 bg-blue-50 px-4 py-2 text-center font-semibold">
                        Suppliers
                      </th>
                      <th className="border border-gray-300 bg-blue-50 px-4 py-2 text-center font-semibold w-20">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {values.items && values.items.map((item: any, index: number) => (
                      <React.Fragment key={index}>
                        <tr className="hover:bg-gray-50">
                          <td className="border-t border-b border-gray-300 px-2 py-2">
                            <div className="relative space-y-2">
                              <Input
                                placeholder="Search for items..."
                                value={searchQueries[index] || item.itemName || ''}
                                onChange={(e) => handleItemSearch(index, e.target.value)}
                                onKeyPress={(e) => handleKeyPress(index, e)}
                                onFocus={() => setIsDropdownOpen(prev => ({ ...prev, [index]: true }))}
                                className="border focus:ring-0 p-2"

                              />
                              <div style={{ color: 'red' }}>
                                <ErrorMessage errors={errors} touched={touched} name={`items[${index}].itemName`} />
                              </div>
                              {isDropdownOpen[index] && searchQueries[index]?.trim() && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                  {filteredItems(index).map(itemPrice => (
                                    <div
                                      key={itemPrice.id}
                                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() => handleItemSelect(index, itemPrice)}
                                    >
                                      {itemPrice.item.item_name}
                                      <div className="text-sm text-gray-500">
                                        {itemPrice.supplier.name} - ₹{itemPrice.rate}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="border-t border-b border-gray-300 px-2 py-2">
                            <FormInput
                              name={`items.${index}.category`}
                              type="text"
                              placeholder="Enter Category"
                              onChange={handleChange}
                              value={item.category || ''}
                              error={touched.items?.[index]?.category && errors.items?.[index]?.category}
                              className="border-0 focus:ring-0 p-1"
                            />
                          </td>
                          <td className="border-t border-b border-gray-300 px-2 py-2">
                            <FormInput
                              name={`items.${index}.subcategory`}
                              type="text"
                              placeholder="Enter Subcategory"
                              onChange={handleChange}
                              value={item.subcategory || ''}
                              error={touched.items?.[index]?.subcategory && errors.items?.[index]?.subcategory}
                              className="border-0 focus:ring-0 p-1"
                            />
                          </td>
                          <td className="border-t border-b border-gray-300 px-2 py-2">
                            <FormInput
                              name={`items.${index}.quantity`}
                              type="number"
                              min="1"
                              placeholder="Enter quantity"
                              onChange={handleChange}
                              value={item.quantity}
                              error={touched.items?.[index]?.quantity && errors.items?.[index]?.quantity}
                              className="border-0 focus:ring-0 p-1 w-full"
                            />
                          </td>
                          <td className="border-t border-b border-gray-300 px-2 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => toggleRowExpansion(index)}
                              className="bg-[#000] text-white px-3 py-1 rounded text-sm flex items-center gap-1 mx-auto transition-colors"
                            >
                              <span className={`transform transition-transform ${expandedRows.has(index) ? 'rotate-180' : ''}`}>
                                ▼
                              </span>
                              Suppliers
                              {getSelectedSuppliers(index).length > 0 && (
                                <span className="bg-white text-[#0F44BE] px-1 rounded-full text-xs ml-1">
                                  {getSelectedSuppliers(index).length}
                                </span>
                              )}
                            </button>
                          </td>
                          <td className="border-t border-b border-gray-300 px-2 py-2 text-center">
                            {values.items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-500 px-2 py-1 rounded text-sm"
                                title="Remove Item"
                              >
                                <TrashIcon className="h-4 w-4 inline-block" />
                              </button>
                            )}
                          </td>
                        </tr>

                        {expandedRows.has(index) && (
                          <tr>
                            <td colSpan={6} className="border p-0">
                              <div className="bg-white-50 p-4">
                                <FieldArray name={`items.${index}.suppliers`}>
                                  {({ push: pushSupplier, remove: removeSupplier }) => (
                                    <div>
                                      <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-[#0F44BE]">
                                          Suppliers for {item.itemName || 'this item'}
                                        </h4>
                                      </div>

                                      <div className="overflow-x-auto mb-3">
                                        <table className="w-full">
                                          <thead>
                                            <tr className="">
                                              <th className="border border-gray-300 bg-blue-50 px-3 py-2 text-center font-semibold w-12">
                                                Select
                                              </th>
                                              <th className="border border-gray-300 bg-blue-50 px-3 py-2 text-left font-semibold">
                                                Supplier Name
                                              </th>
                                              <th className="border border-gray-300 bg-blue-50 px-3 py-2 text-left font-semibold">
                                                Rate (₹)
                                              </th>
                                              <th className="border border-gray-300 bg-blue-50 px-3 py-2 text-left font-semibold">
                                                Effective Date
                                              </th>
                                              <th className="border border-gray-300 bg-blue-50 px-3 py-2 text-left font-semibold">
                                                Supplier Email
                                              </th>
                                              <th className="border border-gray-300 bg-blue-50 px-3 py-2 text-left font-semibold">
                                                Supplier Contact
                                              </th>
                                              <th className="border border-gray-300 bg-blue-50 px-3 py-2 text-left font-semibold">
                                                Supplier Tel
                                              </th>
                                              <th className="border border-gray-300 bg-blue-50 px-3 py-2 text-center font-semibold w-20">
                                                Action
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {item.suppliers?.map((supplier: any, supplierIndex: number) => (
                                              <tr key={supplierIndex} className="hover:bg-gray-100">
                                                <td className="border-t border-b border-gray-300 px-2 py-2 text-center">
                                                  <input
                                                    type="checkbox"
                                                    checked={supplier.selected}
                                                    onChange={(e) => handleSupplierSelection(index, supplierIndex, e.target.checked)}
                                                    className="rounded border-gray-300 text-[#0F44BE] focus:ring-[#0F44BE]"
                                                  />
                                                </td>
                                                <td className="border-t border-b border-gray-300 px-2 py-2">
                                                  <div className="relative">
                                                    <Input
                                                      placeholder="Search suppliers..."
                                                      value={supplierSearchQueries[`${index}-${supplierIndex}`] || supplier.supplierName || ''}
                                                      onChange={(e) => handleSupplierSearch(index, supplierIndex, e.target.value)}
                                                      onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                          e.preventDefault();
                                                          const value = e.currentTarget.value.trim();
                                                          if (value) {
                                                            const matchingSupplier = suppliers.find(s =>
                                                              s.name.toLowerCase() === value.toLowerCase()
                                                            );
                                                            if (!matchingSupplier) {
                                                              setFieldValue(`items.${index}.suppliers.${supplierIndex}.supplierName`, value);
                                                              setIsSupplierDropdownOpen(prev => ({
                                                                ...prev,
                                                                [`${index}-${supplierIndex}`]: false
                                                              }));
                                                            }
                                                          }
                                                        }
                                                      }}
                                                      onFocus={() => setIsSupplierDropdownOpen(prev => ({
                                                        ...prev,
                                                        [`${index}-${supplierIndex}`]: true
                                                      }))}
                                                      className="w-full"
                                                    />
                                                    {isSupplierDropdownOpen[`${index}-${supplierIndex}`] && supplierSearchQueries[`${index}-${supplierIndex}`]?.trim() && (
                                                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                                        {filteredSuppliers(index, supplierIndex).map(supplier => (
                                                          <div
                                                            key={supplier.id}
                                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                            onClick={() => handleSupplierSelect(index, supplierIndex, supplier)}
                                                          >
                                                            {supplier.name}
                                                            <div className="text-sm text-gray-500">
                                                              {supplier.email} | {supplier.mob_num}
                                                            </div>
                                                          </div>
                                                        ))}
                                                      </div>
                                                    )}
                                                  </div>
                                                </td>
                                                <td className="border-t border-b border-gray-300 px-2 py-2">
                                                  {supplier.rate || '-'}
                                                </td>
                                                <td className="border-t border-b border-gray-300 px-2 py-2">
                                                  {supplier.effectiveDate ? new Date(supplier.effectiveDate).toLocaleDateString() : '-'}
                                                </td>
                                                <td className="border-t border-b border-gray-300 px-2 py-2">
                                                  <FormInput
                                                    name={`items.${index}.suppliers.${supplierIndex}.supplierEmail`}
                                                    type="email"
                                                    placeholder="Enter supplier email"
                                                    onChange={handleChange}
                                                    value={supplier.supplierEmail || ''}
                                                    className="border-0 focus:ring-0 p-1 w-full"
                                                  />
                                                </td>
                                                <td className="border-t border-b border-gray-300 px-2 py-2">
                                                  <FormInput
                                                    name={`items.${index}.suppliers.${supplierIndex}.supplierContact`}
                                                    type="text"
                                                    placeholder="Enter supplier contact"
                                                    onChange={handleChange}
                                                    value={supplier.supplierContact || ''}
                                                    className="border-0 focus:ring-0 p-1 w-full"
                                                  />
                                                </td>
                                                <td className="border-t border-b border-gray-300 px-2 py-2">
                                                  <FormInput
                                                    name={`items.${index}.suppliers.${supplierIndex}.supplierTel`}
                                                    type="text"
                                                    placeholder="Enter supplier tel"
                                                    onChange={handleChange}
                                                    value={supplier.supplierTel || ''}
                                                    className="border-0 focus:ring-0 p-1 w-full"
                                                  />
                                                </td>
                                                <td className="border-t border-b border-gray-300 px-2 py-2 text-center">
                                                  {item.suppliers.length > 1 && (
                                                    <button
                                                      type="button"
                                                      onClick={() => removeSupplier(supplierIndex)}
                                                      className="text-red-500 px-2 py-1 rounded text-sm"
                                                      title="Remove Supplier"
                                                    >
                                                      <TrashIcon className="h-4 w-4 inline-block" />
                                                    </button>
                                                  )}
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>

                                      <div className="flex gap-2">
                                        <button
                                          type="button"
                                          onClick={() => handleAddNewSupplier(index)}
                                          className="bg-black hover:bg-black-300 text-white px-3 py-2 rounded text-sm flex items-center gap-1"
                                        >
                                          <span className="text-sm">+</span>
                                          Add New Supplier
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </FieldArray>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => push({
                    item: { id: 0, name: '' },
                    itemName: '',
                    category: '',
                    subcategory: '',
                    quantity: '',
                    suppliers: [{
                      supplierId: null,
                      supplierName: '',
                      supplierEmail: '',
                      supplierContact: '',
                      supplierTel: '',
                      isNewSupplier: false,
                      selected: false
                    }]
                  })}
                  className="text-blue-500 rounded flex items-center gap-2 transition-colors"
                >
                  <span className="text-xl">+</span>
                  Add New Item
                </button>
              </div>
            </div>
          )}
        </FieldArray>
      </div>
    </Form>
  );
};

export default SiteManagementForm;