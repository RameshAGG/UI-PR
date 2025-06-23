// // 


// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { Layout, Divider, Button, Select, Card, Row, Col, Table, message } from "antd";
// import { DownloadOutlined, LeftOutlined, MailOutlined, UploadOutlined } from "@ant-design/icons";
// import { AppDispatch, RootState } from '../../store/store';
// import { getPurchasebyId } from "../../slices/RequestSlice.ts";
// import PaginatedTable from "../../components/PaginatedTable.tsx";
// import { downloadRfq } from "../../slices/RfqSlice.ts";
// import * as XLSX from 'xlsx';
// import { fetchRfqData, submitRfqData } from "../../slices/Rfq_uploadslice.ts";
// import Axios from "../../axios-config/axiosInstance.ts";

// const { Content } = Layout;
// const { Option } = Select;

// interface SupplierData {
//     id: number;
//     name: string;
//     type: string;
//     email: string;
//     mob_num: string;
//     tel_num: string;
// }

// interface ItemData {
//     id: number;
//     name: string;
//     type: string;
//     quantity: number;
//     uom: string;
//     pack_size: number;
// }

// interface PurchaseRequestData {
//     id: number;
//     department: string;
//     date_requested: string;
//     status: string;
//     item_type: boolean;
//     purchase_request_id: number;
//     total_items: number;
//     total_suppliers: number;
//     items: ItemData[];
//     suppliers: SupplierData[];
// }

// interface ExcelData {
//     [key: string]: any;
// }


// // Add to your interfaces
// export interface RfqUploadPayload {
//     requestId: number;
//     supplierId: number;
//     items: Array<{
//         name: string;
//         code: string;
//         uom: string;
//         quantity: number;
//         unitPrice: number;
//         discount: string;
//         gst: string;
//         sgst: string;
//         cgst: string;
//         totalValue: string;
//         deliveryDate: string;
//         remarks: string;
//     }>;
// }

// export interface RfqUploadResponse {
//     success: boolean;
//     message: string;
//     data: any;
// }

// // Add to your RequestState interface
// interface RequestState {
//     // ... existing state
//     rfqUploading: boolean;
//     rfqUploadError: string | null;
//     rfqUploadSuccess: boolean;
// }

// // Add to initialState
// const initialState: RequestState = {
//     // ... existing state
//     rfqUploading: false,
//     rfqUploadError: null,
//     rfqUploadSuccess: false,
// };

// const RfqUploadPreview = () => {
//     const { id } = useParams() as { id: string };
//     const navigate = useNavigate();
//     const dispatch = useDispatch<AppDispatch>();
//     const { loading, error, purchaseRequest } = useSelector((state: RootState) => state.requestManagement);

//     const [submitting, setSubmitting] = useState(false);

//     // State for supplier selection (single select now)
//     const [selectedSupplier, setSelectedSupplier] = useState<number | undefined>(undefined);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [pageSize, setPageSize] = useState(10);

//     // States for file upload and Excel data
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [excelData, setExcelData] = useState<ExcelData[]>([]);
//     const [excelColumns, setExcelColumns] = useState<any[]>([]);
//     const [uploadLoading, setUploadLoading] = useState(false);

//     const handlePageChange = (page: number, size: number) => {
//         setCurrentPage(page);
//         setPageSize(size);
//     };

//     useEffect(() => {
//         if (id) {
//             dispatch(getPurchasebyId({ id: Number(id) }));
//         }
//     }, [id, dispatch]);

//     // Set first supplier as selected by default when data loads
//     useEffect(() => {
//         if (purchaseRequest?.data?.suppliers && purchaseRequest.data.suppliers.length > 0) {
//             setSelectedSupplier(purchaseRequest.data.suppliers[0].id);
//         }
//     }, [purchaseRequest?.data?.suppliers]);

//     const handleSupplierChange = (supplierId: number) => {
//         setSelectedSupplier(supplierId);
//     };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             // Check file type
//             const allowedTypes = [
//                 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
//                 'application/vnd.ms-excel', // .xls
//             ];

//             if (!allowedTypes.includes(file.type)) {
//                 message.error('Please select an Excel file (.xlsx or .xls)');
//                 return;
//             }

//             // Check file size (10MB limit)
//             if (file.size > 10 * 1024 * 1024) {
//                 message.error('File size should not exceed 10MB');
//                 return;
//             }

//             setSelectedFile(file);
//             // Clear previous data when new file is selected
//             setExcelData([]);
//             setExcelColumns([]);
//         }
//     };


//     // const handleSubmitRfqData = async () => {
//     //     if (!selectedSupplier || excelData.length === 0) {
//     //         message.warning('Please select a supplier and upload valid data first');
//     //         return;
//     //     }

//     //     setSubmitting(true);

//     //     try {
//     //         // Transform only valid items
//     //         const items = excelData
//     //             .filter(item => item['Item Name'] && item['Quantity'] > 0)
//     //             .map(item => ({
//     //                 name: item['Item Name'],
//     //                 code: item['Item Code'],
//     //                 uom: item['UOM'],
//     //                 quantity: item['Quantity'],
//     //                 unitPrice: item['Unit Price'],
//     //                 discount: item['Discount (%)'],
//     //                 gst: item['GST (%)'],
//     //                 sgst: item['SGST (%)'],
//     //                 cgst: item['CGST (%)'],
//     //                 totalValue: item['Total Value'],
//     //                 deliveryDate: item['Delivery Date'],
//     //                 remarks: item['Remarks']
//     //             }));

//     //         if (items.length === 0) {
//     //             throw new Error('No valid items to submit');
//     //         }

//     //         const response = await Axios.post(`/rfq/upload/${id}/supplier/${selectedSupplier}`, {
//     //             items
//     //         });

//     //         message.success('RFQ data submitted successfully!');
//     //         console.log('Clean response:', response.data);
//     //     } catch (error) {
//     //         console.error('Submission error:', error);
//     //         message.error(error.response?.data?.message || 'Failed to submit RFQ data');
//     //     } finally {
//     //         setSubmitting(false);
//     //     }
//     // };


//     // const handleUpload = async () => {
//     //     if (!selectedFile) {
//     //         message.warning('Please select a file first');
//     //         return;
//     //     }

//     //     setUploadLoading(true);

//     //     try {
//     //         const reader = new FileReader();

//     //         reader.onload = async (e) => {
//     //             try {
//     //                 const data = new Uint8Array(e.target?.result as ArrayBuffer);
//     //                 const workbook = XLSX.read(data, { type: 'array' });

//     //                 const worksheetName = workbook.SheetNames[0];
//     //                 const worksheet = workbook.Sheets[worksheetName];

//     //                 // Get the actual data range (skip headers and instructions)
//     //                 const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

//     //                 // Find the first row with actual data (skip header row)
//     //                 let firstDataRow = 0;
//     //                 for (let R = range.s.r; R <= range.e.r; ++R) {
//     //                     const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: 0 })];
//     //                     if (cell && cell.v && !cell.v.toString().match(/item name|instruction|note:/i)) {
//     //                         firstDataRow = R;
//     //                         break;
//     //                     }
//     //                 }

//     //                 // Convert to JSON starting from first data row
//     //                 const jsonData = XLSX.utils.sheet_to_json(worksheet, {
//     //                     header: ['Item Name', 'Item Code', 'UOM', 'Quantity', 'Unit Price', 'Discount (%)', 'GST (%)', 'SGST (%)', 'CGST (%)', 'Total Value', 'Delivery Date', 'Remarks'],
//     //                     range: firstDataRow, // Skip header and instructions
//     //                     defval: null
//     //                 });

//     //                 // Process only valid data rows
//     //                 const formattedData = jsonData
//     //                     .filter(row =>
//     //                         row['Item Name'] &&
//     //                         !row['Item Name'].toString().match(/item name|instruction|note:|tax calculation/i) &&
//     //                         (row['Quantity'] !== null || row['Unit Price'] !== null)
//     //                     )
//     //                     .map((row, index) => ({
//     //                         key: index,
//     //                         'Item Name': row['Item Name']?.toString().trim() || '',
//     //                         'Item Code': row['Item Code']?.toString().trim() || '',
//     //                         'UOM': row['UOM']?.toString().trim() || '',
//     //                         'Quantity': Number(row['Quantity']) || 0,
//     //                         'Unit Price': Number(row['Unit Price']) || 0,
//     //                         'Discount (%)': row['Discount (%)']?.toString().trim() || '0%',
//     //                         'GST (%)': row['GST (%)']?.toString().trim() || '0%',
//     //                         'SGST (%)': row['SGST (%)']?.toString().trim() || '0%',
//     //                         'CGST (%)': row['CGST (%)']?.toString().trim() || '0%',
//     //                         'Total Value': row['Total Value']?.toString().trim() || '0',
//     //                         'Delivery Date': row['Delivery Date']?.toString().trim() || '',
//     //                         'Remarks': row['Remarks']?.toString().trim() || ''
//     //                     }));

//     //                 setExcelData(formattedData);
//     //                 message.success(`Loaded ${formattedData.length} valid items`);
//     //             } catch (error) {
//     //                 console.error('Error parsing Excel:', error);
//     //                 message.error('Error processing Excel file');
//     //             } finally {
//     //                 setUploadLoading(false);
//     //             }
//     //         };

//     //         reader.readAsArrayBuffer(selectedFile);
//     //     } catch (error) {
//     //         console.error('Upload error:', error);
//     //         message.error('Failed to process file');
//     //         setUploadLoading(false);
//     //     }
//     // };

//     const handleFileUploadAndSubmit = async (file: File) => {
//         if (!selectedSupplier) {
//           message.warning('Please select a supplier first');
//           return;
//         }

//         setUploadLoading(true);

//         try {
//           const data = await readExcelFile(file);
//           const items = processExcelData(data);

//           if (items.length === 0) {
//             throw new Error('No valid items found in the Excel file');
//           }

//           const response = await Axios.post(`/rfq/upload/${id}/supplier/${selectedSupplier}`, {
//             items
//           });

//           message.success('RFQ data submitted successfully!');
//           console.log('Submission response:', response.data);
//         } catch (error) {
//           console.error('Error processing file:', error);
//           message.error(error.response?.data?.message || 'Failed to process Excel file');
//         } finally {
//           setUploadLoading(false);
//         }
//       };

// // Helper function to read Excel file
// const readExcelFile = (file: File): Promise<any[]> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();

//       reader.onload = (e) => {
//         try {
//           const data = new Uint8Array(e.target?.result as ArrayBuffer);
//           const workbook = XLSX.read(data, { type: 'array' });
//           const worksheetName = workbook.SheetNames[0];
//           const worksheet = workbook.Sheets[worksheetName];
//           resolve(XLSX.utils.sheet_to_json(worksheet));
//         } catch (error) {
//           reject(error);
//         }
//       };

//       reader.onerror = () => {
//         reject(new Error('Error reading file'));
//       };

//       reader.readAsArrayBuffer(file);
//     });
//   };

//   // Helper function to process Excel data
//   const processExcelData = (jsonData: any[]): any[] => {
//     // Skip header row and instructions
//     const dataRows = jsonData.filter(row => 
//       row['Item Name'] && 
//       !row['Item Name'].toString().match(/item name|instruction|note:|tax calculation/i) &&
//       (row['Quantity'] || row['Unit Price'])
//     );

//     return dataRows.map(row => ({
//       name: row['Item Name']?.toString().trim() || '',
//       code: row['Item Code']?.toString().trim() || '',
//       uom: row['UOM']?.toString().trim() || '',
//       quantity: Number(row['Quantity']) || 0,
//       unitPrice: Number(row['Unit Price']) || 0,
//       discount: row['Discount (%)']?.toString().trim() || '0%',
//       gst: row['GST (%)']?.toString().trim() || '0%',
//       sgst: row['SGST (%)']?.toString().trim() || '0%',
//       cgst: row['CGST (%)']?.toString().trim() || '0%',
//       totalValue: row['Total Value']?.toString().trim() || '0',
//       deliveryDate: row['Delivery Date']?.toString().trim() || '',
//       remarks: row['Remarks']?.toString().trim() || ''
//     }));
//   };



//     if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
//     if (error) return <div className="text-red-500 text-center">Error: {error}</div>;

//     return (
//         <Content className="relative flex flex-col bg-[#EDF1F6] items-center w-full py-4">
//             {/* Header Section */}
//             <div className="flex justify-between items-center h-[50px] w-full bg-white px-4 mb-4 rounded-md">
//                 {/* Left Section (Back) */}
//                 <div className="flex items-center gap-2">
//                     <LeftOutlined
//                         className="cursor-pointer text-[#444444]"
//                         onClick={() => navigate('/Rfq_Upload')}
//                     />
//                     <p className="font-Montserrat text-sm text-[#444444]">Back</p>
//                 </div>
//             </div>

//             <div className="w-full bg-white rounded-lg shadow-md">

//                 {/* Supplier Selection Section */}
//                 <div className="px-6 pt-6 pb-4">
//                     <h3 className="text-[#0F44BE] font-Montserrat text-base font-semibold mb-[5px]">SUPPLIER SELECTION</h3>
//                     <Divider className="my-0" />

//                     <div className="mt-4">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Select Supplier for RFQ Generation:
//                         </label>
//                         <Select
//                             placeholder="Select a supplier..."
//                             value={selectedSupplier}
//                             onChange={handleSupplierChange}
//                             className="w-full"
//                             size="large"
//                         >
//                             {purchaseRequest?.data?.suppliers?.map((supplier) => (
//                                 <Option key={supplier.id} value={supplier.id}>
//                                     <div className="flex flex-col mt-1">
//                                         <span className="font-medium">{supplier.name}</span>
//                                         <span className="text-xs text-gray-500 mt-1">
//                                             {/* {supplier.email} | {supplier.mob_num} */}
//                                         </span>
//                                     </div>
//                                 </Option>
//                             ))}
//                         </Select>
//                     </div>
//                 </div>

//                 {/* File Upload Section */}
//                 <div className="px-6 pb-4 mt-3">
//                     <h3 className="text-[#0F44BE] font-Montserrat text-base font-semibold mb-[5px]">FILE UPLOAD</h3>
//                     <Divider className="my-0" />

//                     <div className="mt-4">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Choose File:
//                         </label>
//                         <input
//                             type="file"
//                             accept=".xlsx,.xls"
//                             className="block w-full text-sm text-gray-500
//                                 file:mr-4 file:py-2 file:px-4
//                                 file:rounded-full file:border-0
//                                 file:text-sm file:font-semibold
//                                 file:bg-blue-50 file:text-blue-700
//                                 hover:file:bg-blue-100
//                                 border border-gray-300 rounded-lg p-2"
//                             // onChange={handleFileChange}
//                             onChange={(e) => {
//                                 const file = e.target.files?.[0];
//                                 if (file) {
//                                   handleFileUploadAndSubmit(file);
//                                 }
//                               }}
//                                   id="rfq-upload-input"
//                         />
//                         <p className="mt-1 text-xs text-gray-500">
//                             Supported formats: Excel files (.xlsx, .xls) - Max size: 10MB
//                         </p>

//                         // Add this to your JSX (in the UPLOADED DATA section)
//                         <div className="mt-4 flex justify-end">
//                             <Button
//                                 type="primary"
//                                 onClick={handleSubmitRfqData}
//                                 loading={submitting}
//                                 disabled={excelData.length === 0}
//                             >
//                                 Submit RFQ Data
//                             </Button>
//                         </div>

//                         {/* Upload Button */}
//                         <div className="mt-3">
//                             <Button
//                                 type="primary"
//                                 icon={<UploadOutlined />}
//                                 onClick={handleUpload}
//                                 loading={uploadLoading}
//                                 disabled={!selectedFile}
//                                 className="flex items-center"
//                             >
//                                 {uploadLoading ? 'Processing...' : 'Upload & Read Excel'}
//                             </Button>
//                             {selectedFile && (
//                                 <p className="mt-1 text-xs text-green-600">
//                                     Selected: {selectedFile.name}
//                                 </p>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {excelData.length > 0 && (
//                     <div className="px-6 pb-6">
//                         <h3 className="text-[#0F44BE] font-Montserrat text-base font-semibold mb-[5px]">UPLOADED DATA</h3>
//                         <Divider className="my-0" />

//                         <div className="mt-4">
//                             <div className="mb-3 flex justify-between items-center">
//                                 <span className="text-sm text-gray-600">
//                                     Total Records: {excelData.length} | Columns: {excelColumns.length}
//                                 </span>
//                                 <Button
//                                     type="link"
//                                     onClick={() => {
//                                         console.log('Full data:', excelData);
//                                         message.info('Check console for full data');
//                                     }}
//                                 >
//                                     View Raw Data (Console)
//                                 </Button>
//                             </div>

//                             <Table
//                                 columns={excelColumns}
//                                 dataSource={excelData}
//                                 pagination={{
//                                     current: currentPage,
//                                     pageSize: pageSize,
//                                     total: excelData.length,
//                                     showSizeChanger: true,
//                                     pageSizeOptions: ['10', '25', '50', '100'],
//                                     showQuickJumper: true,
//                                     showTotal: (total, range) =>
//                                         `${range[0]}-${range[1]} of ${total} items`,
//                                     onChange: handlePageChange,
//                                     onShowSizeChange: handlePageChange,
//                                 }}
//                                 scroll={{ x: 'max-content', y: 500 }}
//                                 size="small"
//                                 bordered
//                                 className="border border-gray-200 rounded-lg"
//                                 rowKey="key"
//                                 loading={uploadLoading}
//                                 locale={{
//                                     emptyText: 'No data found in the Excel file'
//                                 }}
//                             />
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </Content>
//     );
// };

// export default RfqUploadPreview;


// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { Layout, Divider, Button, Select, Card, message } from "antd";
// import { LeftOutlined, UploadOutlined } from "@ant-design/icons";
// import { AppDispatch, RootState } from '../../store/store';
// import { getPurchasebyId } from "../../slices/RequestSlice.ts";
// import * as XLSX from 'xlsx';
// import Axios from "../../axios-config/axiosInstance.ts";

// const { Content } = Layout;
// const { Option } = Select;

// interface SupplierData {
//     id: number;
//     name: string;
//     type: string;
//     email: string;
//     mob_num: string;
//     tel_num: string;
// }

// const RfqUploadPreview = () => {
//     const { id } = useParams() as { id: string };
//     const navigate = useNavigate();
//     const dispatch = useDispatch<AppDispatch>();
//     const { loading, error, purchaseRequest } = useSelector((state: RootState) => state.requestManagement);

//     // State for supplier selection
//     const [selectedSupplier, setSelectedSupplier] = useState<number | undefined>(undefined);
//     const [uploadLoading, setUploadLoading] = useState(false);

//     useEffect(() => {
//         if (id) {
//             dispatch(getPurchasebyId({ id: Number(id) }));
//         }
//     }, [id, dispatch]);

//     // Set first supplier as selected by default when data loads
//     useEffect(() => {
//         if (purchaseRequest?.data?.suppliers && purchaseRequest.data.suppliers.length > 0) {
//             setSelectedSupplier(purchaseRequest.data.suppliers[0].id);
//         }
//     }, [purchaseRequest?.data?.suppliers]);

//     const handleSupplierChange = (supplierId: number) => {
//         setSelectedSupplier(supplierId);
//     };
//     const handleFileUploadAndSubmit = async (file: File) => {
//         if (!selectedSupplier) {
//             message.warning('Please select a supplier first');
//             return;
//         }

//         setUploadLoading(true);

//         try {
//             // Read Excel file
//             const data = await new Promise((resolve, reject) => {
//                 const reader = new FileReader();
//                 reader.onload = (e) => {
//                     try {
//                         const data = new Uint8Array(e.target?.result as ArrayBuffer);
//                         const workbook = XLSX.read(data, { type: 'array' });
//                         const worksheetName = workbook.SheetNames[0];
//                         const worksheet = workbook.Sheets[worksheetName];

//                         // Convert to JSON - skip first 3 rows (header is in row 4)
//                         const jsonData = XLSX.utils.sheet_to_json(worksheet, {
//                             header: ['Item Name', 'Item Code', 'UOM', 'Quantity', 'Unit Price', 'Discount (%)', 'GST (%)', 'SGST (%)', 'CGST (%)', 'Total Value', 'Delivery Date', 'Remarks'],
//                             range: 3, // Skip first 3 rows
//                             defval: null
//                         });

//                         resolve(jsonData);
//                     } catch (error) {
//                         reject(error);
//                     }
//                 };
//                 reader.onerror = () => reject(new Error('Error reading file'));
//                 reader.readAsArrayBuffer(file);
//             });

//             // Process Excel data
//             const items = (data as any[])
//                 .filter(row => row['Item Name']) // Remove empty rows
//                 .map(row => {
//                     // Handle the '-' columns which actually contain quantity and unit price
//                     const quantity = row['Quantity'] === '-' ? row['-'] : row['Quantity'];
//                     const unitPrice = row['Unit Price'] === '-' ? row['-'] : row['Unit Price'];

//                     return {
//                         name: row['Item Name']?.toString().trim() || '',
//                         code: row['Item Code']?.toString().trim() || '',
//                         uom: row['UOM']?.toString().trim() || '',
//                         quantity: quantity ? Number(quantity) : 0,
//                         unitPrice: unitPrice ? Number(unitPrice) : 0,
//                         discount: row['Discount (%)']?.toString().trim() || '0%',
//                         gst: row['GST (%)']?.toString().trim() || '0%',
//                         sgst: row['SGST (%)']?.toString().trim() || '0%',
//                         cgst: row['CGST (%)']?.toString().trim() || '0%',
//                         totalValue: row['Total Value']?.toString().trim() || '0',
//                         deliveryDate: row['Delivery Date']?.toString().trim() || '',
//                         remarks: row['Remarks']?.toString().trim() || ''
//                     };
//                 });

//             if (items.length === 0) {
//                 throw new Error('No valid items found in the Excel file');
//             }

//             // Submit to backend
//             const response = await Axios.post(`/rfq/upload/${id}/supplier/${selectedSupplier}`, {
//                 items
//             });

//             message.success('RFQ data submitted successfully!');
//             console.log('Submission response:', response.data);
//         } catch (error) {
//             console.error('Error processing file:', error);
//             message.error(error.message || 'Failed to process Excel file');
//         } finally {
//             setUploadLoading(false);
//         }
//     };

//     if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
//     if (error) return <div className="text-red-500 text-center">Error: {error}</div>;

//     return (
//         <Content className="relative flex flex-col bg-[#EDF1F6] items-center w-full py-4">
//             {/* Header Section */}
//             <div className="flex justify-between items-center h-[50px] w-full bg-white px-4 mb-4 rounded-md">
//                 <div className="flex items-center gap-2">
//                     <LeftOutlined
//                         className="cursor-pointer text-[#444444]"
//                         onClick={() => navigate('/Rfq_Upload')}
//                     />
//                     <p className="font-Montserrat text-sm text-[#444444]">Back</p>
//                 </div>
//             </div>

//             <div className="w-full bg-white rounded-lg shadow-md">
//                 {/* Supplier Selection Section */}
//                 <div className="px-6 pt-6 pb-4">
//                     <h3 className="text-[#0F44BE] font-Montserrat text-base font-semibold mb-[5px]">SUPPLIER SELECTION</h3>
//                     <Divider className="my-0" />

//                     <div className="mt-4">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Select Supplier for RFQ Generation:
//                         </label>
//                         <Select
//                             placeholder="Select a supplier..."
//                             value={selectedSupplier}
//                             onChange={handleSupplierChange}
//                             className="w-full"
//                             size="large"
//                         >
//                             {purchaseRequest?.data?.suppliers?.map((supplier) => (
//                                 <Option key={supplier.id} value={supplier.id}>
//                                     <div className="flex flex-col mt-1">
//                                         <span className="font-medium">{supplier.name}</span>
//                                     </div>
//                                 </Option>
//                             ))}
//                         </Select>
//                     </div>
//                 </div>

//                 {/* File Upload Section */}
//                 <div className="px-6 pb-6 mt-3">
//                     <h3 className="text-[#0F44BE] font-Montserrat text-base font-semibold mb-[5px]">FILE UPLOAD</h3>
//                     <Divider className="my-0" />

//                     <div className="mt-4">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Choose File:
//                         </label>
//                         <input
//                             type="file"
//                             accept=".xlsx,.xls"
//                             // className="hidden"
//                             id="rfq-upload-input"
//                             onChange={(e) => {
//                                 const file = e.target.files?.[0];
//                                 if (file) {
//                                     // Check file type and size
//                                     const allowedTypes = [
//                                         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//                                         'application/vnd.ms-excel',
//                                     ];

//                                     if (!allowedTypes.includes(file.type)) {
//                                         message.error('Please select an Excel file (.xlsx or .xls)');
//                                         return;
//                                     }

//                                     if (file.size > 10 * 1024 * 1024) {
//                                         message.error('File size should not exceed 10MB');
//                                         return;
//                                     }

//                                     handleFileUploadAndSubmit(file);
//                                 }
//                             }}
//                         />
//                         <label htmlFor="rfq-upload-input">
//                             <Button
//                                 type="primary"
//                                 icon={<UploadOutlined />}
//                                 loading={uploadLoading}
//                                 className="flex items-center"
//                             >
//                                 {uploadLoading ? 'Processing...' : 'Upload & Submit Excel'}
//                             </Button>
//                         </label>
//                         <p className="mt-1 text-xs text-gray-500">
//                             Supported formats: Excel files (.xlsx, .xls) - Max size: 10MB
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </Content>
//     );
// };

// export default RfqUploadPreview;




















// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { Layout, Divider, Button, Select, Table, message } from "antd";
// import { LeftOutlined, UploadOutlined } from "@ant-design/icons";
// import { AppDispatch, RootState } from '../../store/store';
// import { getPurchasebyId } from "../../slices/RequestSlice.ts";
// import * as XLSX from 'xlsx';
// import Axios from "../../axios-config/axiosInstance.ts";
// import RfqComparativeTable from "../Managements/RfqComparativeTable.tsx";
// // import RfqComparativeTable from './RfqComparativeTable'; 

// const { Content } = Layout;
// const { Option } = Select;

// interface SupplierData {
//     id: number;
//     name: string;
//     type: string;
//     email: string;
//     mob_num: string;
//     tel_num: string;
// }

// interface RfqItem {
//     id: number;
//     name: string;
//     code: string;
//     uom: string;
//     quantity: number;
//     unitPrice: number;
//     discount: string;
//     gst: string;
//     sgst: string;
//     cgst: string;
//     totalValue: string;
//     deliveryDate: string;
//     remarks: string;
// }

// const RfqUploadPreview = () => {
//     const { id } = useParams() as { id: string };
//     const navigate = useNavigate();
//     const dispatch = useDispatch<AppDispatch>();
//     const { loading, error, purchaseRequest } = useSelector((state: RootState) => state.requestManagement);

//     // State for supplier selection
//     const [selectedSupplier, setSelectedSupplier] = useState<number | undefined>(undefined);
//     const [uploadLoading, setUploadLoading] = useState(false);
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [excelData, setExcelData] = useState<any[]>([]);
//     const [excelColumns, setExcelColumns] = useState<any[]>([]);
//     const [submittedRfqData, setSubmittedRfqData] = useState<RfqItem[]>([]);
//     const [showSubmittedData, setShowSubmittedData] = useState(false);
//     const [comparativeData, setComparativeData] = useState<any>(null); // Add this for comparative view

//     useEffect(() => {
//         if (id) {
//             dispatch(getPurchasebyId({ id: Number(id) }));
//             fetchSubmittedRfqData(); // Fetch all RFQ data by default
//         }
//     }, [id, dispatch]);


//     // Fetch submitted data when component mounts or when selectedSupplier changes
//     // useEffect(() => {
//     //     if (selectedSupplier) {
//     //         fetchSubmittedRfqData();
//     //     }
//     // }, [selectedSupplier]);

//     // useEffect(() => {
//     //     fetchSubmittedRfqData()
//     // }, []);

//     // Set first supplier as selected by default when data loads
//     useEffect(() => {
//         if (purchaseRequest?.data?.suppliers && purchaseRequest.data.suppliers.length > 0) {
//             setSelectedSupplier(purchaseRequest.data.suppliers[0].id);
//         }
//     }, [purchaseRequest?.data?.suppliers]);

//     const handleSupplierChange = (supplierId: number) => {
//         setSelectedSupplier(supplierId);
//         // setShowSubmittedData(false); // Hide submitted data when changing supplier
//     };

//     const handleFileChange = async (file: File) => {
//         try {
//             const data = await new Promise((resolve, reject) => {
//                 const reader = new FileReader();
//                 reader.onload = (e) => {
//                     try {
//                         const data = new Uint8Array(e.target?.result as ArrayBuffer);
//                         const workbook = XLSX.read(data, { type: 'array' });
//                         const worksheetName = workbook.SheetNames[0];
//                         const worksheet = workbook.Sheets[worksheetName];

//                         // Convert to JSON - skip first 3 rows (header is in row 4)
//                         const jsonData = XLSX.utils.sheet_to_json(worksheet, {
//                             header: ['Item Name', 'Item Code', 'UOM', 'Quantity', 'Unit Price', 'Discount (%)', 'GST (%)', 'SGST (%)', 'CGST (%)', 'Total Value', 'Delivery Date', 'Remarks'],
//                             range: 3, // Skip first 3 rows
//                             defval: null
//                         });

//                         resolve(jsonData);
//                     } catch (error) {
//                         reject(error);
//                     }
//                 };
//                 reader.onerror = () => reject(new Error('Error reading file'));
//                 reader.readAsArrayBuffer(file);
//             });

//             // Process Excel data for preview
//             const items = (data as any[])
//                 .filter(row => row['Item Name']) // Remove empty rows
//                 .map((row, index) => {
//                     // Handle the '-' columns which actually contain quantity and unit price
//                     const quantity = row['Quantity'] === '-' ? row['-'] : row['Quantity'];
//                     const unitPrice = row['Unit Price'] === '-' ? row['-'] : row['Unit Price'];

//                     return {
//                         key: index,
//                         'Item Name': row['Item Name']?.toString().trim() || '',
//                         'Item Code': row['Item Code']?.toString().trim() || '',
//                         'UOM': row['UOM']?.toString().trim() || '',
//                         'Quantity': quantity ? Number(quantity) : 0,
//                         'Unit Price': unitPrice ? Number(unitPrice) : 0,
//                         'Discount (%)': row['Discount (%)']?.toString().trim() || '0%',
//                         'GST (%)': row['GST (%)']?.toString().trim() || '0%',
//                         'SGST (%)': row['SGST (%)']?.toString().trim() || '0%',
//                         'CGST (%)': row['CGST (%)']?.toString().trim() || '0%',
//                         'Total Value': row['Total Value']?.toString().trim() || '0',
//                         'Delivery Date': row['Delivery Date']?.toString().trim() || '',
//                         'Remarks': row['Remarks']?.toString().trim() || ''
//                     };
//                 });

//             // Set columns for the preview table
//             const columns = [
//                 { title: 'Item Name', dataIndex: 'Item Name', key: 'Item Name' },
//                 // { title: 'Item Code', dataIndex: 'Item Code', key: 'Item Code' },
//                 // { title: 'UOM', dataIndex: 'UOM', key: 'UOM' },
//                 // { title: 'Quantity', dataIndex: 'Quantity', key: 'Quantity' },
//                 { title: 'Unit Price', dataIndex: 'Unit Price', key: 'Unit Price' },
//                 { title: 'Discount (%)', dataIndex: 'Discount (%)', key: 'Discount (%)' },
//                 // { title: 'GST (%)', dataIndex: 'GST (%)', key: 'GST (%)' },
//                 // { title: 'SGST (%)', dataIndex: 'SGST (%)', key: 'SGST (%)' },
//                 // { title: 'CGST (%)', dataIndex: 'CGST (%)', key: 'CGST (%)' },
//                 { title: 'Total Value', dataIndex: 'Total Value', key: 'Total Value' },
//                 // { title: 'Delivery Date', dataIndex: 'Delivery Date', key: 'Delivery Date' },
//                 // { title: 'Remarks', dataIndex: 'Remarks', key: 'Remarks' }
//             ];

//             setExcelData(items);
//             setExcelColumns(columns);
//             setSelectedFile(file);
//             message.success('File loaded successfully!');
//         } catch (error) {
//             console.error('Error processing file:', error);
//             message.error('Failed to process Excel file');
//         }
//     };

//     // const fetchSubmittedRfqData = async () => {
//     //     if (!selectedSupplier) return;

//     //     try {
//     //         const response = await Axios.get(`/rfq/data/${id}/supplier/${selectedSupplier}`);
//     //         setSubmittedRfqData(response.data.data.items || []);
//     //         setShowSubmittedData(true);
//     //     } catch (error) {
//     //         console.error('Error fetching submitted RFQ data:', error);
//     //         message.error('Failed to fetch submitted RFQ data');
//     //     }
//     // };

//     // const fetchSubmittedRfqData = async () => {
//     //     if (!selectedSupplier) return;

//     //     try {
//     //       const response = await Axios.get(`/rfq/data/${id}`);
//     //       const entries: any[] = response.data.data;

//     //       const supplierEntry = entries.find(entry => entry.supplier.id === selectedSupplier);
//     //       if (supplierEntry) {
//     //         setSubmittedRfqData(supplierEntry.items || []);
//     //         setShowSubmittedData(true);
//     //       } else {
//     //         message.info('No data submitted yet for this supplier.');
//     //         setSubmittedRfqData([]);
//     //         setShowSubmittedData(true);
//     //       }

//     //     } catch (error) {
//     //       console.error('Error fetching submitted RFQ data:', error);
//     //       message.error('Failed to fetch submitted RFQ data');
//     //     }
//     //   };

//     // const fetchSubmittedRfqData = async () => {
//     //     if (!selectedSupplier) return;

//     //     try {
//     //         const response = await Axios.get(`/rfq/data/${id}`);
//     //         const entries: any[] = response.data.data;

//     //         const supplierEntry = entries.find(entry => entry.supplier.id === selectedSupplier);
//     //         if (supplierEntry) {
//     //             setSubmittedRfqData(supplierEntry.items || []);

//     //             // Transform the data for comparative view
//     //             const comparativeFormat = {
//     //                 items: supplierEntry.items.map(item => ({
//     //                     code: item.code || item.name,
//     //                     name: item.name,
//     //                     uom: item.uom,
//     //                     quantity: item.quantity,
//     //                     suppliers: {
//     //                         [`${supplierEntry.supplier.id}-${supplierEntry.supplier.name}`]: {
//     //                             unitPrice: item.unitPrice,
//     //                             discount: item.discount,
//     //                             gst: item.gst,
//     //                             deliveryDate: item.deliveryDate,
//     //                             remarks: item.remarks
//     //                         }
//     //                     }
//     //                 })),
//     //                 suppliers: [{
//     //                     id: supplierEntry.supplier.id,
//     //                     name: supplierEntry.supplier.name
//     //                 }]
//     //             };

//     //             setComparativeData(comparativeFormat);
//     //             setShowSubmittedData(true);
//     //         } else {
//     //             message.info('No data submitted yet for this supplier.');
//     //             setSubmittedRfqData([]);
//     //             setComparativeData(null);
//     //             setShowSubmittedData(true);
//     //         }
//     //     } catch (error) {
//     //         console.error('Error fetching submitted RFQ data:', error);
//     //         message.error('Failed to fetch submitted RFQ data');
//     //     }
//     // };


//     // const fetchSubmittedRfqData = async () => {
//     //     try {
//     //         const response = await Axios.get(`/rfq/data/${id}`);
//     //         const allEntries: any[] = response.data.data;

//     //         if (!allEntries || allEntries.length === 0) {
//     //             message.info('No RFQ data submitted yet for this request.');
//     //             setSubmittedRfqData([]);
//     //             setComparativeData(null);
//     //             setShowSubmittedData(true);
//     //             return;
//     //         }

//     //         // Create a map to organize items by their code/name
//     //         const itemsMap = new Map<string, any>();
//     //         const suppliersSet = new Set<string>();

//     //         allEntries.forEach(entry => {
//     //             const supplierKey = `${entry.supplier.id}-${entry.supplier.name}`;
//     //             suppliersSet.add(supplierKey);

//     //             entry.items.forEach((item: any) => {
//     //                 const itemKey = item.code || item.name;

//     //                 if (!itemsMap.has(itemKey)) {
//     //                     itemsMap.set(itemKey, {
//     //                         code: item.code,
//     //                         name: item.name,
//     //                         uom: item.uom,
//     //                         quantity: item.quantity,
//     //                         suppliers: {}
//     //                     });
//     //                 }

//     //                 itemsMap.get(itemKey).suppliers[supplierKey] = {
//     //                     unitPrice: item.unitPrice,
//     //                     discount: item.discount,
//     //                     gst: item.gst,
//     //                     deliveryDate: item.deliveryDate,
//     //                     remarks: item.remarks
//     //                 };
//     //             });
//     //         });

//     //         // Convert to the format expected by RfqComparativeTable
//     //         const comparativeFormat = {
//     //             items: Array.from(itemsMap.values()),
//     //             suppliers: Array.from(suppliersSet).map(s => {
//     //                 const [id, name] = s.split('-');
//     //                 return { id: parseInt(id), name };
//     //             })
//     //         };

//     //         setComparativeData(comparativeFormat);
//     //         setShowSubmittedData(true);

//     //     } catch (error) {
//     //         console.error('Error fetching submitted RFQ data:', error);
//     //         message.error('Failed to fetch submitted RFQ data');
//     //     }
//     // };



//     const fetchSubmittedRfqData = async () => {
//         try {
//             const response = await Axios.get(`/rfq/data/${id}`);
//             const allEntries: any[] = response.data.data;

//             if (!allEntries || allEntries.length === 0) {
//                 message.info('No RFQ data submitted yet for this request.');
//                 setComparativeData(null);
//                 setShowSubmittedData(true);
//                 return;
//             }

//             // Create a map to organize items by their code
//             const itemsMap = new Map<string, any>();
//             const suppliersMap = new Map<number, any>();

//             // First pass: collect all suppliers
//             allEntries.forEach(entry => {
//                 if (!suppliersMap.has(entry.supplier.id)) {
//                     suppliersMap.set(entry.supplier.id, {
//                         id: entry.supplier.id,
//                         name: entry.supplier.name
//                     });
//                 }
//             });

//             // Second pass: organize items with all suppliers
//             allEntries.forEach(entry => {
//                 entry.items.forEach((item: any) => {
//                     const itemKey = item.code || item.name;

//                     if (!itemsMap.has(itemKey)) {
//                         // Initialize item with all possible suppliers
//                         const itemData: any = {
//                             code: item.code,
//                             name: item.name,
//                             uom: item.uom,
//                             quantity: item.quantity,
//                             suppliers: {}
//                         };

//                         // Initialize all suppliers with null values
//                         suppliersMap.forEach(supplier => {
//                             itemData.suppliers[`${supplier.id}-${supplier.name}`] = null;
//                         });

//                         itemsMap.set(itemKey, itemData);
//                     }

//                     // Update with actual data for this supplier
//                     const supplierKey = `${entry.supplier.id}-${entry.supplier.name}`;
//                     itemsMap.get(itemKey).suppliers[supplierKey] = {
//                         unitPrice: item.unitPrice,
//                         discount: item.discount,
//                         gst: item.gst,
//                         cgst: item.cgst,
//                         sgst: item.sgst,
//                         deliveryDate: item.deliveryDate,
//                         remarks: item.remarks,
//                         totalValue: item.totalValue
//                     };
//                 });
//             });

//             // Convert to the format expected by RfqComparativeTable
//             const comparativeFormat = {
//                 items: Array.from(itemsMap.values()),
//                 suppliers: Array.from(suppliersMap.values())
//             };

//             console.log('Comparative Data Format:', comparativeFormat); // Debug log
//             setComparativeData(comparativeFormat);
//             setShowSubmittedData(true);

//         } catch (error) {
//             console.error('Error fetching submitted RFQ data:', error);
//             message.error('Failed to fetch submitted RFQ data');
//         }
//     };





//     const handleSubmit = async () => {
//         if (!selectedSupplier || !selectedFile) {
//             message.warning('Please select a supplier and upload a file first');
//             return;
//         }

//         if (excelData.length === 0) {
//             message.warning('No valid data to submit');
//             return;
//         }

//         setUploadLoading(true);

//         try {
//             // Prepare data for submission
//             const items = excelData.map(item => ({
//                 name: item['Item Name'],
//                 code: item['Item Code'],
//                 uom: item['UOM'],
//                 quantity: item['Quantity'],
//                 unitPrice: item['Unit Price'],
//                 discount: item['Discount (%)'],
//                 gst: item['GST (%)'],
//                 sgst: item['SGST (%)'],
//                 cgst: item['CGST (%)'],
//                 totalValue: item['Total Value'],
//                 deliveryDate: item['Delivery Date'],
//                 remarks: item['Remarks']
//             }));

//             // Submit to backend
//             await Axios.post(`/rfq/upload/${id}/supplier/${selectedSupplier}`, {
//                 items
//             });

//             message.success('RFQ data submitted successfully!');

//             // Fetch the submitted data after successful submission
//             await fetchSubmittedRfqData();
//         } catch (error) {
//             console.error('Error submitting data:', error);
//             message.error(error.response?.data?.message || 'Failed to submit RFQ data');
//         } finally {
//             setUploadLoading(false);
//         }
//     };

//     const submittedColumns = [
//         { title: 'Item Name', dataIndex: 'name', key: 'name' },
//         // { title: 'Item Code', dataIndex: 'code', key: 'code' },
//         // { title: 'UOM', dataIndex: 'uom', key: 'uom' },
//         // { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
//         { title: 'Unit Price', dataIndex: 'unitPrice', key: 'unitPrice' },
//         { title: 'Discount (%)', dataIndex: 'discount', key: 'discount' },
//         // { title: 'GST (%)', dataIndex: 'gst', key: 'gst' },
//         // { title: 'SGST (%)', dataIndex: 'sgst', key: 'sgst' },
//         // { title: 'CGST (%)', dataIndex: 'cgst', key: 'cgst' },
//         { title: 'Total Value', dataIndex: 'totalValue', key: 'totalValue' },
//         // { title: 'Delivery Date', dataIndex: 'deliveryDate', key: 'deliveryDate' },
//         // { title: 'Remarks', dataIndex: 'remarks', key: 'remarks' }
//     ];

//     if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
//     if (error) return <div className="text-red-500 text-center">Error: {error}</div>;

//     return (
//         <Content className="relative flex flex-col bg-[#EDF1F6] items-center w-full py-4">
//             {/* Header Section */}
//             <div className="flex justify-between items-center h-[50px] w-full bg-white px-4 mb-4 rounded-md">
//                 <div className="flex items-center gap-2">
//                     <LeftOutlined
//                         className="cursor-pointer text-[#444444]"
//                         onClick={() => navigate('/Rfq_Upload')}
//                     />
//                     <p className="font-Montserrat text-sm text-[#444444]">Back</p>
//                 </div>
//             </div>

//             <div className="w-full bg-white rounded-lg shadow-md">
//                 {/* Supplier Selection Section */}
//                 <div className="px-6 pt-6 pb-4">
//                     <h3 className="text-[#0F44BE] font-Montserrat text-base font-semibold mb-[5px]">SUPPLIER SELECTION</h3>
//                     <Divider className="my-0" />

//                     <div className="mt-4">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Select Supplier for RFQ Generation:
//                         </label>
//                         <Select
//                             placeholder="Select a supplier..."
//                             value={selectedSupplier}
//                             onChange={handleSupplierChange}
//                             className="w-full"
//                             size="large"
//                         >
//                             {purchaseRequest?.data?.suppliers?.map((supplier) => (
//                                 <Option key={supplier.id} value={supplier.id}>
//                                     <div className="flex flex-col mt-1">
//                                         <span className="font-medium">{supplier.name}</span>
//                                     </div>
//                                 </Option>
//                             ))}
//                         </Select>
//                     </div>
//                 </div>

//                 {/* File Upload Section */}
//                 <div className="px-6 pb-6 mt-3">
//                     <h3 className="text-[#0F44BE] font-Montserrat text-base font-semibold mb-[5px]">FILE UPLOAD</h3>
//                     <Divider className="my-0" />

//                     <div className="mt-4">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Choose File:
//                         </label>
//                         <input
//                             type="file"
//                             accept=".xlsx,.xls"
//                             className="block w-full text-sm text-gray-500
//                                 file:mr-4 file:py-2 file:px-4
//                                 file:rounded-md file:border-0
//                                 file:text-sm file:font-semibold
//                                 file:bg-blue-50 file:text-blue-700
//                                 hover:file:bg-blue-100
//                                 border border-gray-300 rounded-lg p-2"
//                             onChange={(e) => {
//                                 const file = e.target.files?.[0];
//                                 if (file) {
//                                     // Check file type and size
//                                     const allowedTypes = [
//                                         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//                                         'application/vnd.ms-excel',
//                                     ];

//                                     if (!allowedTypes.includes(file.type)) {
//                                         message.error('Please select an Excel file (.xlsx or .xls)');
//                                         return;
//                                     }

//                                     if (file.size > 10 * 1024 * 1024) {
//                                         message.error('File size should not exceed 10MB');
//                                         return;
//                                     }

//                                     handleFileChange(file);
//                                 }
//                             }}
//                         />
//                         <p className="mt-1 text-xs text-gray-500">
//                             Supported formats: Excel files (.xlsx, .xls) - Max size: 10MB
//                         </p>
//                     </div>
//                     {comparativeData && (
//                         <div className="mt-6">
//                             <div className="flex justify-between items-center">
//                                 <h4 className="text-[#0F44BE] font-Montserrat text-sm font-semibold mb-2">
//                                     RFQ COMPARATIVE ANALYSIS
//                                 </h4>
//                                 <Button
//                                     type="link"
//                                     onClick={() => setShowSubmittedData(!showSubmittedData)}
//                                 >
//                                     {showSubmittedData ? 'Hide' : 'Show'}
//                                 </Button>
//                             </div>
//                             {showSubmittedData && (
//                                 <>
//                                     <Divider className="my-0" />
//                                     <div className="mt-4 overflow-x-auto">
//                                         <RfqComparativeTable data={comparativeData} />
//                                     </div>
//                                 </>
//                             )}
//                         </div>
//                     )}

//                     {/* Submit Button */}
//                     <div className="mt-6 flex justify-end gap-4">
//                         {showSubmittedData ? (
//                             <Button
//                                 type="primary"
//                                 onClick={() => setShowSubmittedData(false)}
//                             >
//                                 Back to Upload
//                             </Button>
//                         ) : (
//                             <>
//                                 {submittedRfqData.length > 0 && (
//                                     <Button
//                                         onClick={fetchSubmittedRfqData}
//                                     >
//                                         View Submitted Data
//                                     </Button>
//                                 )}
//                                 <Button
//                                     type="primary"
//                                     icon={<UploadOutlined />}
//                                     onClick={handleSubmit}
//                                     loading={uploadLoading}
//                                     disabled={!selectedFile || excelData.length === 0}
//                                 >
//                                     Upload & Submit Excel
//                                 </Button>
//                             </>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </Content>
//     );
// };

// export default RfqUploadPreview;


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Divider, Button, Select, Table, message } from "antd";
import { EyeInvisibleOutlined, FileExcelOutlined, LeftOutlined, UploadOutlined } from "@ant-design/icons";
import { AppDispatch, RootState } from '../../store/store';
import { getPurchasebyId } from "../../slices/RequestSlice.ts";
import Axios from "../../axios-config/axiosInstance.ts";
import * as XLSX from 'xlsx';


const { Content } = Layout;
const { Option } = Select;

interface SupplierData {
    id: number;
    name: string;
    type: string;
    email: string;
    mob_num: string;
    tel_num: string;
}

interface RfqItem {
    id: number;
    name: string;
    code: string;
    uom: string;
    quantity: number;
    unitPrice: number;
    discount: string;
    gst: string;
    sgst: string;
    cgst: string;
    totalValue: string;
    deliveryDate: string;
    remarks: string;
}

const RfqUploadPreview = () => {
    const { id } = useParams() as { id: string };
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, purchaseRequest } = useSelector((state: RootState) => state.requestManagement);

    const [selectedSupplier, setSelectedSupplier] = useState<number | undefined>(undefined);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [excelData, setExcelData] = useState<any[]>([]);
    const [excelColumns, setExcelColumns] = useState<any[]>([]);
    const [comparativeData, setComparativeData] = useState<any>(null);
    const [showUploadForm, setShowUploadForm] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(getPurchasebyId({ id: Number(id) }));
            fetchComparativeData();
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (purchaseRequest?.data?.suppliers && purchaseRequest.data.suppliers.length > 0) {
            setSelectedSupplier(purchaseRequest.data.suppliers[0].id);
        }
    }, [purchaseRequest?.data?.suppliers]);

    const handleSupplierChange = (supplierId: number) => {
        setSelectedSupplier(supplierId);
    };

    const handleFileChange = async (file: File) => {
        try {
            const data = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = new Uint8Array(e.target?.result as ArrayBuffer);
                        const workbook = XLSX.read(data, { type: 'array' });
                        const worksheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[worksheetName];

                        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                            header: ['Item Name', 'Item Code', 'UOM', 'Quantity', 'Unit Price', 'Discount (%)', 'GST (%)', 'SGST (%)', 'CGST (%)', 'Total Value', 'Delivery Date', 'Remarks'],
                            range: 3,
                            defval: null
                        });

                        resolve(jsonData);
                    } catch (error) {
                        reject(error);
                    }
                };
                reader.onerror = () => reject(new Error('Error reading file'));
                reader.readAsArrayBuffer(file);
            });

            const items = (data as any[])
                .filter(row => row['Item Name'])
                .map((row, index) => {
                    const quantity = row['Quantity'] === '-' ? row['-'] : row['Quantity'];
                    const unitPrice = row['Unit Price'] === '-' ? row['-'] : row['Unit Price'];

                    return {
                        key: index,
                        'Item Name': row['Item Name']?.toString().trim() || '',
                        'Item Code': row['Item Code']?.toString().trim() || '',
                        'UOM': row['UOM']?.toString().trim() || '',
                        'Quantity': quantity ? Number(quantity) : 0,
                        'Unit Price': unitPrice ? Number(unitPrice) : 0,
                        'Discount (%)': row['Discount (%)']?.toString().trim() || '0%',
                        'GST (%)': row['GST (%)']?.toString().trim() || '0%',
                        'SGST (%)': row['SGST (%)']?.toString().trim() || '0%',
                        'CGST (%)': row['CGST (%)']?.toString().trim() || '0%',
                        'Total Value': row['Total Value']?.toString().trim() || '0',
                        'Delivery Date': row['Delivery Date']?.toString().trim() || '',
                        'Remarks': row['Remarks']?.toString().trim() || ''
                    };
                });

            const columns = [
                { title: 'Item Name', dataIndex: 'Item Name', key: 'Item Name' },
                { title: 'Unit Price', dataIndex: 'Unit Price', key: 'Unit Price' },
                { title: 'Discount (%)', dataIndex: 'Discount (%)', key: 'Discount (%)' },
                { title: 'Total Value', dataIndex: 'Total Value', key: 'Total Value' },
            ];

            setExcelData(items);
            setExcelColumns(columns);
            setSelectedFile(file);
            message.success('File loaded successfully!');
        } catch (error) {
            console.error('Error processing file:', error);
            message.error('Failed to process Excel file');
        }
    };

    const fetchComparativeData = async () => {
        try {
            const prResponse = await Axios.get(`/purchase-request/${id}`);
            const prData = prResponse.data.data;

            const rfqResponse = await Axios.get(`/rfq/data/${id}`);
            const rfqEntries: any[] = rfqResponse.data.data || [];

            const displayData = prData.items.map((item: any) => {
                const itemSuppliers = prData.suppliers.map((supplier: any) => {
                    const rfqEntry = rfqEntries.find(entry =>
                        entry.supplier.id === supplier.id
                    );

                    const itemData = rfqEntry?.items.find((i: any) =>
                        i.code === item.code || i.name === item.name
                    );

                    return {
                        supplierId: supplier.id,
                        supplierName: supplier.name,
                        unitPrice: itemData?.unitPrice || null,
                        discount: itemData?.discount || null,
                        gst: itemData?.gst || null,
                        cgst: itemData?.cgst || null,
                        sgst: itemData?.sgst || null,
                        totalValue: itemData?.totalValue || null,
                        submitted: !!itemData
                    };
                });

                return {
                    itemId: item.id,
                    itemName: item.name,
                    itemCode: item.code,
                    uom: item.uom,
                    quantity: item.quantity,
                    suppliers: itemSuppliers
                };
            });

            setComparativeData({
                items: displayData,
                allSuppliers: prData.suppliers
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            message.error('Failed to fetch comparative data');
        }
    };

    const handleSubmit = async () => {
        if (!selectedSupplier || !selectedFile) {
          message.warning('Please select a supplier and upload a file first');
          return;
        }
      
        // Filter out invalid rows
        const validItems = excelData.filter(item => 
          item['Item Name'] && 
          !item['Item Name'].toString().match(/item name|instruction|note:|tax calculation/i) &&
          !isNaN(item['Quantity']) && 
          !isNaN(item['Unit Price']) &&
          item['Quantity'] > 0 &&
          item['Unit Price'] > 0
        );
      
        if (validItems.length === 0) {
          message.warning('No valid data to submit');
          return;
        }
      
        setUploadLoading(true);
      
        try {
          const items = validItems.map(item => ({
            name: item['Item Name'].toString().trim(),
            code: item['Item Code']?.toString().trim() || '',
            uom: item['UOM']?.toString().trim() || 'EA',
            quantity: Number(item['Quantity']),
            unitPrice: Number(item['Unit Price']),
            discount: item['Discount (%)']?.toString().trim() || '0%',
            gst: item['GST (%)']?.toString().trim() || '0%',
            sgst: item['SGST (%)']?.toString().trim() || '0%',
            cgst: item['CGST (%)']?.toString().trim() || '0%',
            totalValue: item['Total Value']?.toString().trim() || 
                      (Number(item['Quantity']) * Number(item['Unit Price'])).toFixed(2),
            deliveryDate: item['Delivery Date']?.toString().trim() || '',
            remarks: item['Remarks']?.toString().trim() || ''
          }));
      
          console.log('Sending payload:', { items });
      
          const response = await Axios.post(
            `/rfq/upload/${id}/supplier/${selectedSupplier}`,
            { items },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
      
          // Handle response
          if (response.data.warning === 'duplicate') {
            message.success('Existing RFQ data updated successfully!');
          } else {
            message.success('New RFQ data created successfully!');
          }
      
          await fetchComparativeData();
          setShowUploadForm(false);
          setExcelData([]);
          setSelectedFile(null);
        } catch (error) {
          console.error('Error submitting data:', error);
          message.error(error.response?.data?.message || 'Failed to submit RFQ data');
        } finally {
          setUploadLoading(false);
        }
      };


    // const handleSubmit = async () => {


    //     if (!selectedSupplier || !selectedFile) {
    //         message.warning('Please select a supplier and upload a file first');
    //         return;
    //     }

    //     if (excelData.length === 0) {
    //         message.warning('No valid data to submit');
    //         return;
    //     }

    //     setUploadLoading(true);

    //     try {
    //         const items = excelData.map(item => ({
    //             name: item['Item Name'],
    //             code: item['Item Code'],
    //             uom: item['UOM'],
    //             quantity: item['Quantity'],
    //             unitPrice: item['Unit Price'],
    //             discount: item['Discount (%)'],
    //             gst: item['GST (%)'],
    //             sgst: item['SGST (%)'],
    //             cgst: item['CGST (%)'],
    //             totalValue: item['Total Value'],
    //             deliveryDate: item['Delivery Date'],
    //             remarks: item['Remarks']
    //         }));

    //         console.log('Sending payload:', { items }); // Add this line

    //         const response = await Axios.post(`/rfq/upload/${id}/supplier/${selectedSupplier}`, {
    //             items
    //           }, {
    //             headers: {
    //               'Content-Type': 'application/json'
    //             }
    //           });


    //         // In your handleSubmit function:
    //         if (response.statusCode === 201) {
    //             message.success('New RFQ data created successfully!');
    //         } else {
    //             message.success('RFQ data updated successfully!');
    //         }


    //         // message.success('RFQ data submitted successfully!');
    //         await fetchComparativeData();
    //         setShowUploadForm(false);
    //         setExcelData([]);
    //         setSelectedFile(null);
    //     } catch (error) {
    //         console.error('Error submitting data:', error);
    //         message.error(error.response?.data?.message || 'Failed to submit RFQ data');
    //     } finally {
    //         setUploadLoading(false);
    //     }
    // };

    const renderComparativeTable = () => {
        if (!comparativeData) return null;

        return (
            <div className="relative w-full overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="sticky left-0 z-10 border p-2 bg-blue-50  min-w-[200px]">Item Code/Name</th>
                                <th className="sticky left-[200px] border p-2 bg-blue-50 min-w-[100px]">UOM</th>
                                <th className="sticky left-[300px] border p-2 bg-blue-50  min-w-[100px]">Quantity</th>
                                {comparativeData.allSuppliers.map((supplier: any) => (
                                    <th key={supplier.id} className="border p-2 bg-blue-50 min-w-[250px]" colSpan={5}>
                                        {supplier.name}
                                    </th>
                                ))}
                            </tr>
                            <tr>
                                <th className="sticky left-0 z-10 border p-2 bg-gray-50"></th>
                                <th className="sticky left-[200px] border p-2 bg-gray-50"></th>
                                <th className="sticky left-[300px] border p-2 bg-gray-50"></th>
                                {comparativeData.allSuppliers.map((supplier: any) => (
                                    <React.Fragment key={supplier.id}>
                                        <th className="border p-2 bg-gray-50  min-w-[100px]">Unit Price</th>
                                        <th className="border p-2 bg-gray-50  min-w-[80px]">Discount</th>
                                        <th className="border p-2 bg-gray-50  min-w-[80px]">GST</th>
                                        <th className="border p-2 bg-gray-50  min-w-[80px]">CGST</th>
                                        <th className="border p-2 bg-gray-50  min-w-[100px]">Total</th>
                                    </React.Fragment>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {comparativeData.items.map((item: any) => (
                                <tr key={item.itemId}>
                                    <td className="sticky left-0 z-10 border p-2  bg-white min-w-[200px]">{item.itemCode || item.itemName}</td>
                                    <td className="sticky left-[200px] border p-2   bg-white min-w-[100px]">{item.uom || "-"}</td>
                                    <td className="sticky left-[300px] border p-2  bg-white min-w-[100px]">{item.quantity}</td>
                                    {item.suppliers.map((supplier: any) => (
                                        <React.Fragment key={supplier.supplierId}>
                                            <td className={`border p-2 ${supplier.submitted ? 'bg-blue-50' : ''}`}>
                                                {supplier.unitPrice || '-'}
                                            </td>

                                            <td className={`border p-2 ${supplier.submitted ? 'bg-blue-50' : ''}`}>
                                                {supplier.discount || '-'}
                                            </td>
                                            <td className={`border p-2 ${supplier.submitted ? 'bg-blue-50' : ''}`}>
                                                {supplier.gst || '-'}
                                            </td>
                                            <td className={`border p-2 ${supplier.submitted ? 'bg-blue-50' : ''}`}>
                                                {supplier.cgst || '-'}
                                            </td>
                                            <td className={`border p-2 ${supplier.submitted ? 'bg-blue-50' : ''}`}>
                                                {supplier.totalValue || '-'}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">Error: {error}</div>;

    return (
        <Content className="relative flex flex-col bg-[#EDF1F6] items-center w-full py-4">
            <div className="flex justify-between items-center h-[50px] w-full bg-white px-4 mb-4 rounded-md">
                <div className="flex items-center gap-2">
                    <LeftOutlined
                        className="cursor-pointer text-[#444444]"
                        onClick={() => navigate('/Rfq_Upload')}
                    />
                    <p className="font-Montserrat text-sm text-[#444444]">Back</p>
                </div>
            </div>

            <div className="w-full bg-white rounded-lg shadow-md">
                <div className="px-6 pt-6 pb-4">
                    <h3 className="text-[#0F44BE] font-Montserrat text-base font-semibold mb-[5px]">SUPPLIER SELECTION</h3>
                    <Divider className="my-0" />

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Supplier for RFQ Generation:
                        </label>
                        <Select
                            placeholder="Select a supplier..."
                            value={selectedSupplier}
                            onChange={handleSupplierChange}
                            className="w-full"
                            size="large"
                        >
                            {purchaseRequest?.data?.suppliers?.map((supplier) => (
                                <Option key={supplier.id} value={supplier.id}>
                                    <div className="flex flex-col mt-1">
                                        <span className="font-medium">{supplier.name}</span>
                                    </div>
                                </Option>
                            ))}
                        </Select>
                    </div>
                </div>
            </div>


            {showUploadForm && (
                <div className="w-full bg-white rounded-lg shadow-md mt-4">
                    <div className="px-6 py-4">
                        <h4 className="text-[#0F44BE] font-Montserrat text-sm font-semibold mb-2">
                            UPLOAD NEW RFQ DATA
                        </h4>
                        <Divider className="my-0" />

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Choose File:
                            </label>
                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100
                                    border border-gray-300 rounded-lg p-2"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const allowedTypes = [
                                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                            'application/vnd.ms-excel',
                                        ];

                                        if (!allowedTypes.includes(file.type)) {
                                            message.error('Please select an Excel file (.xlsx or .xls)');
                                            return;
                                        }

                                        if (file.size > 10 * 1024 * 1024) {
                                            message.error('File size should not exceed 10MB');
                                            return;
                                        }

                                        handleFileChange(file);
                                    }
                                }}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Supported formats: Excel files (.xlsx, .xls) - Max size: 10MB
                            </p>
                        </div>

                        <div className="mt-6 flex justify-end gap-4">
                            <Button
                                className="m-1 bg-gray-900 text-white"

                                onClick={() => {
                                    setShowUploadForm(false);
                                    setExcelData([]);
                                    setSelectedFile(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                // type="primary"
                                className="m-1 bg-gray-900 text-white"

                                icon={<UploadOutlined />}
                                onClick={handleSubmit}
                                loading={uploadLoading}
                                disabled={!selectedFile || excelData.length === 0}
                            >
                                Submit RFQ Data
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full bg-white rounded-lg shadow-md mt-4">
                <div className="px-6 py-4">
                    <div className="flex justify-between items-center">
                        <h4 className="text-[#0F44BE] font-Montserrat text-sm font-semibold mb-2">
                            RFQ COMPARATIVE ANALYSIS
                        </h4>
                        <Button
                            // type="black"
                            className="m-1 bg-gray-900 text-white"
                            onClick={() => setShowUploadForm(!showUploadForm)}
                            disabled={!selectedSupplier}
                            icon={showUploadForm ? <EyeInvisibleOutlined /> : <UploadOutlined />}
                        >
                            {showUploadForm ? 'Hide Upload Form' : 'Upload New RFQ'}
                        </Button>
                    </div>
                    <Divider className="my-0" />
                    <div className="mt-4">
                        {comparativeData ? (
                            renderComparativeTable()
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <FileExcelOutlined className="text-3xl mb-2" />
                                No RFQ data available for comparison yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </Content>
    );
};

export default RfqUploadPreview;