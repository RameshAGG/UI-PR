import React, { useEffect, useState } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import * as yup from 'yup';
import { AppDispatch, RootState } from '../../store/store.ts';
import { useDispatch, useSelector } from 'react-redux';
import { createSite } from '../../slices/SiteManagementSlice.ts';
import { getAllItems } from '../../slices/itemSlice.ts';
import { getAllSuppliers } from '../../slices/SupplierSlice.ts';
import dayjs from 'dayjs';
import RequiredLabel from '../../components/common/RequiredLabel.tsx';
import FormInput from '../../components/common/FormInput.tsx';
import MapComponent from '../../components/common/map/GoogleMap.tsx';
import { Input } from 'antd';

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

interface IItemDetails {
  id: number;
  item_grade: number;
  item_colour: string;
  car_model: number;
  hsn: number;
  gst: number;
  rate: number;
  maintain_stock: number;
  stock_control: number;
  Qc_stock_control: number;
  wp_stock_control: number;
  qc_requried: number;
  active: number;
}

interface IItem {
  id: number;
  item_name: string;
  uom: number;
  pack_size: number;
  erp_code: number;
  item_code: number;
  item_group_id: number;
  item_subgroup_id: number;
  itemGroup: {
    id: number;
    item_group_name: string;
  };
  itemSubGroup: {
    id: number;
    item_subgroup_name: string;
  };
  supplier: ISupplier;
  details: IItemDetails;
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
    suppliers: {
      supplierId: number | null;
      supplierName: string;
      supplierEmail: string;
      supplierContact: string;
      supplierTel: string;
      isNewSupplier: boolean;
      selected: boolean;
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
  const [selectedSiteManager, setSelectedSiteManager] = useState<any>(null);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [selectedSuppliers, setSelectedSuppliers] = useState<{ [itemIndex: number]: Set<number> }>({});
  const [searchQueries, setSearchQueries] = useState<{ [key: number]: string }>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState<{ [key: number]: boolean }>({});
  const [manualInputMode, setManualInputMode] = useState<{ [key: number]: boolean }>({});

  const dispatch = useDispatch<AppDispatch>();

  // Selectors
  const { siteManagerMaster } = useSelector((state: RootState) => state.MasterSlice);
  const { items, loading: itemsLoading, error: itemsError } = useSelector((state: RootState) => state.items);
  const { suppliers, loading: suppliersLoading, error: suppliersError } = useSelector((state: RootState) => state.suppliers);

  // API calls on component mount
  useEffect(() => {
    dispatch(getAllItems({}));
    dispatch(getAllSuppliers({}));
  }, [dispatch]);

  // Optional: Log API data for debugging
  useEffect(() => {
    if (items.length > 0) {
      console.log('Items loaded:', items);
    }
  }, [items]);

  useEffect(() => {
    if (suppliers.length > 0) {
      console.log('Suppliers loaded:', suppliers);
    }
  }, [suppliers]);

  // Handle API errors
  useEffect(() => {
    if (itemsError) {
      console.error('Items API Error:', itemsError);
      // You can show a toast notification here
    }
  }, [itemsError]);

  useEffect(() => {
    if (suppliersError) {
      console.error('Suppliers API Error:', suppliersError);
      // You can show a toast notification here
    }
  }, [suppliersError]);

  const siteManagerOptions = siteManagerMaster
    ?.filter(manager => manager.id !== null)
    .map((manager) => ({
      value: manager.id,
      label: manager.managerName,
      key: manager.id
    })) ?? [];

  // Create options for items dropdown (if needed)
  const itemOptions = items.map((item) => ({
    value: item.id,
    label: item.item_name,
    key: item.id,
    ...item // Include full item data
  }));

  // Create options for suppliers dropdown (if needed)
  const supplierOptions = suppliers.map((supplier) => ({
    value: supplier.id,
    label: supplier.supplier_name,
    key: supplier.id,
    ...supplier // Include full supplier data
  }));

  // Initialize items array if it doesn't exist
  useEffect(() => {
    if (!values.items || values.items.length === 0) {
      setFieldValue('items', [{
        itemName: '',
        category: '',
        subcategory: '',
        suppliers: [{ itemName: '', itemPrice: '', supplierName: '', selected: false }]
      }]);
    }
  }, [values.items, setFieldValue]);

  useEffect(() => {
    if (values && Object.keys(values).length > 0) {
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          setFieldValue(key, value);
        }
      });
    }
  }, [values, setFieldValue]);

  const toggleRowExpansion = (index: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

  const initializeSuppliers = (itemIndex: number) => {
    if (!values.items[itemIndex].suppliers || values.items[itemIndex].suppliers.length === 0) {
      setFieldValue(`items.${itemIndex}.suppliers`, [{ itemName: '', itemPrice: '', supplierName: '', selected: false }]);
    }
  };

  // Handle individual supplier checkbox selection
  const handleSupplierSelection = (itemIndex: number, supplierIndex: number, isSelected: boolean) => {
    setFieldValue(`items.${itemIndex}.suppliers.${supplierIndex}.selected`, isSelected);

    // Update local state for UI management
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

  // Handle select all suppliers for an item
  const handleSelectAllSuppliers = (itemIndex: number, selectAll: boolean) => {
    const suppliers = values.items[itemIndex].suppliers;
    if (!suppliers) return;

    suppliers.forEach((_, supplierIndex) => {
      setFieldValue(`items.${itemIndex}.suppliers.${supplierIndex}.selected`, selectAll);
    });

    // Update local state
    setSelectedSuppliers(prev => {
      const newSelected = { ...prev };
      if (selectAll) {
        newSelected[itemIndex] = new Set(suppliers.map((_, idx) => idx));
      } else {
        newSelected[itemIndex] = new Set();
      }
      return newSelected;
    });
  };

  // Check if all suppliers are selected for an item
  const areAllSuppliersSelected = (itemIndex: number) => {
    const suppliers = values.items[itemIndex].suppliers;
    if (!suppliers || suppliers.length === 0) return false;
    return suppliers.every(supplier => supplier.selected);
  };

  // Get selected suppliers for an item
  const getSelectedSuppliers = (itemIndex: number) => {
    const suppliers = values.items[itemIndex].suppliers;
    if (!suppliers) return [];
    return suppliers.filter(supplier => supplier.selected);
  };

  // Function to populate supplier data from API
  const populateSupplierFromAPI = (itemIndex: number, supplierIndex: number, selectedSupplierId: number) => {
    const selectedSupplier = suppliers.find(supplier => supplier.id === selectedSupplierId);
    if (selectedSupplier) {
      setFieldValue(`items.${itemIndex}.suppliers.${supplierIndex}.supplierName`, selectedSupplier.supplier_name);
      setFieldValue(`items.${itemIndex}.suppliers.${supplierIndex}.supplierEmail`, selectedSupplier.details?.email || '');
      setFieldValue(`items.${itemIndex}.suppliers.${supplierIndex}.supplierContact`, selectedSupplier.details?.phone || '');
    }
  };

  // Function to populate item data from API
  const populateItemFromAPI = (itemIndex: number, selectedItemId: number) => {
    const selectedItem = items.find(item => item.id === selectedItemId);
    if (selectedItem) {
      setFieldValue(`items.${itemIndex}.itemName`, selectedItem.item_name);
      // You can populate other fields if available in your API response
    }
  };

  const handleItemSearch = (index: number, value: string) => {
    // Update search query
    setSearchQueries(prev => ({
      ...prev,
      [index]: value
    }));

    // Set the item name
    setFieldValue(`items.${index}.itemName`, value);

    // Show dropdown if there's input
    if (value.trim()) {
      setIsDropdownOpen(prev => ({
        ...prev,
        [index]: true
      }));

      // Find if this matches any existing item
      const matchingItem = items.find(item =>
        item.item_name.toLowerCase() === value.toLowerCase()
      );

      if (matchingItem) {
        // If it's an existing item, set the full item data
        setFieldValue(`items.${index}.item`, {
          id: matchingItem.id,
          name: matchingItem.item_name
        });

        // Set category and subcategory from the existing item
        if (matchingItem.itemGroup && matchingItem.itemSubGroup) {
          setFieldValue(`items.${index}.category`, matchingItem.itemGroup.item_group_name);
          setFieldValue(`items.${index}.subcategory`, matchingItem.itemSubGroup.item_subgroup_name);
        }
      }
    } else {
      // Clear item data if input is empty
      setFieldValue(`items.${index}.itemName`, '');
      setFieldValue(`items.${index}.category`, '');
      setFieldValue(`items.${index}.subcategory`, '');
      setIsDropdownOpen(prev => ({
        ...prev,
        [index]: false
      }));
    }
  };

  const handleKeyPress = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value) {
        const matchingItem = items.find(item =>
          item.item_name.toLowerCase() === value.toLowerCase()
        );
        if (!matchingItem) {
          // Just set the item name for new items
          setFieldValue(`items.${index}.itemName`, value);
          setIsDropdownOpen(prev => ({
            ...prev,
            [index]: false
          }));
        }
      }
    }
  };

  const handleItemSelect = (index: number, selectedItem: IItem) => {
    setFieldValue(`items.${index}.item`, {
      id: selectedItem.id,
      name: selectedItem.item_name
    });
    setFieldValue(`items.${index}.itemName`, selectedItem.item_name);

    if (selectedItem.itemGroup && selectedItem.itemSubGroup) {
      setFieldValue(`items.${index}.category`, selectedItem.itemGroup.item_group_name);
      setFieldValue(`items.${index}.subcategory`, selectedItem.itemSubGroup.item_subgroup_name);
    }

    setIsDropdownOpen(prev => ({
      ...prev,
      [index]: false
    }));
    setSearchQueries(prev => ({
      ...prev,
      [index]: selectedItem.item_name
    }));
  };

  const filteredItems = (index: number) => {
    const query = searchQueries[index]?.toLowerCase() || '';
    return items.filter(item =>
      item.item_name.toLowerCase().includes(query)
    );
  };

  // Add date handling
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    if (date) {
      setFieldValue('date_requested', date);
    }
  };

  // Toggle between manual input and item selection
  const toggleInputMode = (index: number) => {
    setManualInputMode(prev => ({
      ...prev,
      [index]: !prev[index]
    }));

    // Clear item data when switching modes
    if (!manualInputMode[index]) {
      setFieldValue(`items.${index}.item`, { id: 0, name: '' });
      setFieldValue(`items.${index}.itemName`, '');
      setFieldValue(`items.${index}.category`, '');
      setFieldValue(`items.${index}.subcategory`, '');
    }
  };

  // Handle manual item input
  const handleManualItemInput = (index: number, field: string, value: string) => {
    setFieldValue(`items.${index}.${field}`, value);

    // If this is a new item, set a temporary ID
    if (field === 'itemName' && !values.items[index].item.id) {
      setFieldValue(`items.${index}.item`, {
        id: -1, // Use -1 to indicate a new item
        name: value
      });
    }
  };

  // Add new supplier handling
  const handleAddNewSupplier = (itemIndex: number) => {
    const newSupplier = {
      supplierId: -1, // Use -1 to indicate a new supplier
      supplierName: '',
      supplierEmail: '',
      supplierContact: '',
      supplierTel: '', // Add tel_num field
      isNewSupplier: true, // Add flag for new supplier
      selected: true // Auto-select new suppliers
    };

    const currentSuppliers = values.items[itemIndex]?.suppliers || [];
    setFieldValue(`items.${itemIndex}.suppliers`, [...currentSuppliers, newSupplier]);
  };

  // Show loading state
  if (itemsLoading || suppliersLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-[#0F44BE]">
          Loading {itemsLoading ? 'items' : ''} {itemsLoading && suppliersLoading ? 'and' : ''} {suppliersLoading ? 'suppliers' : ''}...
        </div>
      </div>
    );
  }

  return (
    <Form>
      <p className='text-[#0F44BE] mb-3'>Create New Purchase Request</p>

      {/* Show API errors if any */}
      {(itemsError || suppliersError) && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {itemsError && <div>Items Error: {itemsError}</div>}
          {suppliersError && <div>Suppliers Error: {suppliersError}</div>}
        </div>
      )}

      {/* Basic Information Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-[#0F44BE]">Basic Information</h3>
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
            <RequiredLabel>Request Date</RequiredLabel>
            <input
              type="date"
              name="date_requested"
              value={values.date_requested}
              onChange={handleDateChange}
              className="w-full px-3 mt-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {touched.date_requested && errors.date_requested && (
              <div className="text-red-500 text-sm mt-1">{errors.date_requested}</div>
            )}
          </div>
        </div>
      </div>

      {/* Items Table Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-[#0F44BE]">
          Purchase Items
          <span className="text-sm font-normal text-gray-600 ml-2">
            ({items.length} items, {suppliers.length} suppliers available)
          </span>
        </h3>

        <FieldArray name="items">
          {({ push, remove }) => (
            <div>
              {/* Table Header */}
              <div className="">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                        <RequiredLabel>Item Name</RequiredLabel>
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                        <RequiredLabel>Category</RequiredLabel>
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                        <RequiredLabel>Subcategory</RequiredLabel>
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-center font-semibold">
                        Suppliers
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-center font-semibold w-20">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {values.items && values.items.map((item, index) => (
                      <React.Fragment key={index}>
                        {/* Main Row */}
                        <tr className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-2 py-2">
                            <div className="flex flex-col gap-2">
                              {/* Toggle button */}
                              <button
                                type="button"
                                onClick={() => toggleInputMode(index)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                              >
                                {/* {manualInputMode[index] ? 'Select Existing Item' : 'Enter New Item'} */}
                              </button>

                              {manualInputMode[index] ? (
                                // Manual input fields
                                <div className="space-y-2">
                                  <div className="relative">
                                    <Input
                                      placeholder="Enter item name..."
                                      value={item.itemName || ''}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        handleItemSearch(index, value);
                                      }}
                                      onKeyPress={(e) => handleKeyPress(index, e)}
                                      className="w-full"
                                    />
                                    {isDropdownOpen[index] && searchQueries[index]?.trim() && (
                                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                        {filteredItems(index).map(item => (
                                          <div
                                            key={item.id}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleItemSelect(index, item)}
                                          >
                                            {item.item_name}
                                          </div>
                                        ))}
                                        {filteredItems(index).length === 0 && (
                                          <div className="px-4 py-2 text-gray-500">
                                            Press Enter to add as new item
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <FormInput
                                    name={`items.${index}.category`}
                                    type="text"
                                    placeholder="Enter Category"
                                    onChange={(e) => handleManualItemInput(index, 'category', e.target.value)}
                                    value={item.category || ''}
                                    error={touched.items?.[index]?.category && errors.items?.[index]?.category}
                                  />
                                  <FormInput
                                    name={`items.${index}.subcategory`}
                                    type="text"
                                    placeholder="Enter Subcategory"
                                    onChange={(e) => handleManualItemInput(index, 'subcategory', e.target.value)}
                                    value={item.subcategory || ''}
                                    error={touched.items?.[index]?.subcategory && errors.items?.[index]?.subcategory}
                                  />
                                </div>
                              ) : (
                                // Existing item selection
                                <div className="relative">
                                  <Input
                                    placeholder="Search for items or enter new item..."
                                    value={searchQueries[index] || values.items[index]?.itemName || ''}
                                    onChange={(e) => handleItemSearch(index, e.target.value)}
                                    onFocus={() => setIsDropdownOpen(prev => ({ ...prev, [index]: true }))}
                                    className="w-full px-2 py-2 mb-4"
                                  />
                                  {isDropdownOpen[index] && searchQueries[index]?.trim() && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                      {filteredItems(index).map(item => (
                                        <div
                                          key={item.id}
                                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                          onClick={() => handleItemSelect(index, item)}
                                        >
                                          {item.item_name}
                                        </div>
                                      ))}
                                      {filteredItems(index).length === 0 && (
                                        // <div >
                                        //   Press Enter to add as new item
                                        // </div>
                                        <p className='text-white'></p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            {touched.items?.[index]?.item?.id && errors.items?.[index]?.item?.id && (
                              <div className="text-red-500 text-sm mt-1">
                                {errors.items[index].item.id}
                              </div>
                            )}
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <FormInput
                              name={`items.${index}.category`}
                              type="text"
                              placeholder="Enter Category"
                              onChange={handleChange}
                              value={item.category || ''}
                              error={
                                touched.items?.[index]?.category &&
                                errors.items?.[index]?.category
                              }
                              className="border-0 focus:ring-0 p-1"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <FormInput
                              name={`items.${index}.subcategory`}
                              type="text"
                              placeholder="Enter Subcategory"
                              onChange={handleChange}
                              value={item.subcategory || ''}
                              error={
                                touched.items?.[index]?.subcategory &&
                                errors.items?.[index]?.subcategory
                              }
                              className="border-0 focus:ring-0 p-1"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                initializeSuppliers(index);
                                toggleRowExpansion(index);
                              }}
                              className="bg-[#0F44BE] hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 mx-auto transition-colors"
                            >
                              <span className={`transform transition-transform ${expandedRows.has(index) ? 'rotate-180' : ''}`}>
                                ▼
                              </span>
                              Suppliers
                              {item.suppliers && getSelectedSuppliers(index).length > 0 && (
                                <span className="bg-white text-[#0F44BE] px-1 rounded-full text-xs ml-1">
                                  {getSelectedSuppliers(index).length}
                                </span>
                              )}
                            </button>
                          </td>
                          <td className="border border-gray-300 px-2 py-2 text-center">
                            {values.items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                                title="Remove Item"
                              >
                                ×
                              </button>
                            )}
                          </td>
                        </tr>

                        {/* Collapsible Supplier Row */}
                        {expandedRows.has(index) && (
                          <tr>
                            <td colSpan={5} className="border border-gray-300 p-0">
                              <div className="bg-gray-50 p-4">
                                <FieldArray name={`items.${index}.suppliers`}>
                                  {({ push: pushSupplier, remove: removeSupplier }) => (
                                    <div>
                                      <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-[#0F44BE]">
                                          Suppliers for {item.itemName || 'this item'}
                                        </h4>

                                        {/* Select All Checkbox */}
                                        {item.suppliers && item.suppliers.length > 0 && (
                                          <div className="flex items-center gap-2">
                                            <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                                              <input
                                                type="checkbox"
                                                checked={areAllSuppliersSelected(index)}
                                                onChange={(e) => handleSelectAllSuppliers(index, e.target.checked)}
                                                className="rounded border-gray-300 text-[#0F44BE] focus:ring-[#0F44BE]"
                                              />
                                              Select All
                                            </label>
                                            {getSelectedSuppliers(index).length > 0 && (
                                              <span className="text-sm text-gray-600">
                                                ({getSelectedSuppliers(index).length} selected)
                                              </span>
                                            )}
                                          </div>
                                        )}
                                      </div>

                                      {/* Supplier Table */}
                                      <div className="overflow-x-auto mb-3">
                                        <table className="w-full border-collapse border border-gray-400">
                                          <thead>
                                            <tr className="bg-gray-200">
                                              <th className="border border-gray-400 px-3 py-2 text-center font-semibold w-12">
                                                Select
                                              </th>
                                              <th className="border border-gray-400 px-3 py-2 text-left font-semibold">
                                                Supplier Name
                                              </th>
                                              <th className="border border-gray-400 px-3 py-2 text-left font-semibold">
                                                Supplier Email
                                              </th>
                                              <th className="border border-gray-400 px-3 py-2 text-left font-semibold">
                                                Supplier Contact
                                              </th>
                                              <th className="border border-gray-400 px-3 py-2 text-left font-semibold">
                                                Supplier Tel
                                              </th>
                                              <th className="border border-gray-400 px-3 py-2 text-center font-semibold w-20">
                                                Action
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {/* Existing suppliers from API */}
                                            {suppliers.map((apiSupplier) => (
                                              <tr key={`api-${apiSupplier.id}`} className="hover:bg-gray-100">
                                                <td className="border border-gray-400 px-2 py-2 text-center">
                                                  <input
                                                    type="checkbox"
                                                    checked={values.items[index]?.suppliers?.some(s => s.supplierId === apiSupplier.id && s.selected) || false}
                                                    onChange={(e) => {
                                                      const isSelected = e.target.checked;
                                                      const existingSupplierIndex = values.items[index]?.suppliers?.findIndex(s => s.supplierId === apiSupplier.id);

                                                      if (existingSupplierIndex >= 0) {
                                                        handleSupplierSelection(index, existingSupplierIndex, isSelected);
                                                      } else if (isSelected) {
                                                        const newSupplier = {
                                                          supplierId: apiSupplier.id,
                                                          supplierName: apiSupplier.name,
                                                          supplierEmail: apiSupplier.email,
                                                          supplierContact: apiSupplier.mob_num,
                                                          selected: true
                                                        };
                                                        const currentSuppliers = values.items[index]?.suppliers || [];
                                                        setFieldValue(`items.${index}.suppliers`, [...currentSuppliers, newSupplier]);
                                                      }
                                                    }}
                                                    className="rounded border-gray-300 text-[#0F44BE] focus:ring-[#0F44BE]"
                                                  />
                                                </td>
                                                <td className="border border-gray-400 px-2 py-2">
                                                  <div className="p-1">{apiSupplier.name}</div>
                                                </td>
                                                <td className="border border-gray-400 px-2 py-2">
                                                  <div className="p-1">{apiSupplier.email}</div>
                                                </td>
                                                <td className="border border-gray-400 px-2 py-2">
                                                  <div className="p-1">{apiSupplier.mob_num}</div>
                                                </td>
                                                <td className="border border-gray-400 px-2 py-2">
                                                  <div className="p-1">{apiSupplier.tel_num}</div>
                                                </td>
                                                <td className="border border-gray-400 px-2 py-2 text-center">
                                                  {/* No action for API suppliers */}
                                                </td>
                                              </tr>
                                            ))}

                                            {/* Manual suppliers */}
                                            {item.suppliers?.map((supplier, supplierIndex) => (
                                              <tr key={supplierIndex} className="hover:bg-gray-100">
                                                <td className="border border-gray-400 px-2 py-2 text-center">
                                                  <input
                                                    type="checkbox"
                                                    checked={supplier.selected}
                                                    onChange={(e) => handleSupplierSelection(index, supplierIndex, e.target.checked)}
                                                    className="rounded border-gray-300 text-[#0F44BE] focus:ring-[#0F44BE]"
                                                  />
                                                </td>
                                                <td className="border border-gray-400 px-2 py-2">
                                                  <FormInput
                                                    name={`items.${index}.suppliers.${supplierIndex}.supplierName`}
                                                    type="text"
                                                    placeholder="Enter supplier name"
                                                    onChange={handleChange}
                                                    value={supplier.supplierName || ''}
                                                    className="border-0 focus:ring-0 p-1 w-full"
                                                  />
                                                </td>
                                                <td className="border border-gray-400 px-2 py-2">
                                                  <FormInput
                                                    name={`items.${index}.suppliers.${supplierIndex}.supplierEmail`}
                                                    type="email"
                                                    placeholder="Enter supplier email"
                                                    onChange={handleChange}
                                                    value={supplier.supplierEmail || ''}
                                                    className="border-0 focus:ring-0 p-1 w-full"
                                                  />
                                                </td>
                                                <td className="border border-gray-400 px-2 py-2">
                                                  <FormInput
                                                    name={`items.${index}.suppliers.${supplierIndex}.supplierContact`}
                                                    type="text"
                                                    placeholder="Enter supplier contact"
                                                    onChange={handleChange}
                                                    value={supplier.supplierContact || ''}
                                                    className="border-0 focus:ring-0 p-1 w-full"
                                                  />
                                                </td>
                                                <td className="border border-gray-400 px-2 py-2">
                                                  <FormInput
                                                    name={`items.${index}.suppliers.${supplierIndex}.supplierTel`}
                                                    type="text"
                                                    placeholder="Enter supplier tel"
                                                    onChange={handleChange}
                                                    value={supplier.supplierTel || ''}
                                                    className="border-0 focus:ring-0 p-1 w-full"
                                                  />
                                                </td>
                                                <td className="border border-gray-400 px-2 py-2 text-center">
                                                  {item.suppliers && item.suppliers.length > 1 && (
                                                    <button
                                                      type="button"
                                                      onClick={() => removeSupplier(supplierIndex)}
                                                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                                                      title="Remove Supplier"
                                                    >
                                                      ×
                                                    </button>
                                                  )}
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>

                                      {/* Action Buttons */}
                                      <div className="flex gap-2">
                                        <button
                                          type="button"
                                          onClick={() => handleAddNewSupplier(index)}
                                          className="bg-black hover:bg-black-300 text-white px-3 py-2 rounded text-sm flex items-center gap-1"
                                        >
                                          <span className="text-sm">+</span>
                                          Add New Supplier
                                        </button>

                                        {/* {getSelectedSuppliers(index).length > 0 && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const selectedCount = getSelectedSuppliers(index).length;
                                              alert(`${selectedCount} supplier(s) selected for ${item.itemName || 'this item'}`);
                                            }}
                                            className="bg-[#0F44BE] hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
                                          >
                                            View Selected ({getSelectedSuppliers(index).length})
                                          </button>
                                        )} */}
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

              {/* Add New Item Button */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    push({
                      item: { id: 0, name: '' },
                      itemName: '',
                      category: '',
                      subcategory: '',
                      suppliers: [{
                        supplierId: 0,
                        supplierName: '',
                        supplierEmail: '',
                        supplierContact: '',
                        selected: false
                      }]
                    });
                    // Initialize manual input mode for new item
                    setManualInputMode(prev => ({
                      ...prev,
                      [values.items.length]: false
                    }));
                  }}
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