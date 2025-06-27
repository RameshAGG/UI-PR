import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Divider, Button, Table } from "antd";
import { DownloadOutlined, LeftOutlined } from "@ant-design/icons";
import { AppDispatch, RootState } from '../../store/store';
import { getPurchasebyId } from "../../slices/RequestSlice.ts";
import PaginatedTable from "../../components/PaginatedTable.tsx";
import { downloadRfq } from "../../slices/RfqSlice.ts";
// import {downloadSeparateSupplierRfqFiles } from "../../slices/RfqSlice.ts";
// import PaginatedTable from '../../components/PaginatedTable';

const { Content } = Layout;

interface PurchaseRequestData {
    id: number;
    department: string;
    date_requested: string;
    status: string;
    item_type: boolean;
    item: {
        id: number;
        item_name: string;
        uom: string;
        item_group_id: number;
        item_subgroup_id: number;
        pack_size: number;
        item_code: string;
        erp_code: string;
    };
}

const PurchaseRequestPreview = () => {
    const { id } = useParams() as { id: string };
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, purchaseRequest } = useSelector((state: RootState) => state.requestManagement);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const handlePageChange = (page: number, size: number) => {
        setCurrentPage(page);
        setPageSize(size);
        // You might want to fetch new data here if you're implementing server-side pagination
    };
    useEffect(() => {
        if (id) {
            dispatch(getPurchasebyId({ id: Number(id) }));
        }
    }, [id, dispatch]);

    const handleDownloadRfq = () => {
        if (id) {
            dispatch(downloadRfq({ id: Number(id) }));
        }
    };




    // Prepare data for the table
    const itemDetail = purchaseRequest?.data?.items ? [purchaseRequest.data.items] : [];

    // const itemDetails = purchaseRequest?.data?.items || [];

    // Transform the data before passing to the table
    const itemDetails = purchaseRequest?.data?.items?.map(item => ({
        ...item,
        purchase_request_id: purchaseRequest.data.purchase_request_id,
        total_items: purchaseRequest.data.total_items,
        total_suppliers: purchaseRequest.data.total_suppliers
    })) || [];


    const itemColumns = [
        {
            title: <span className="font-Montserrat text-sm text-[#6D6D6D]">Request ID</span>,
            dataIndex: 'purchase_request_id',
            key: 'purchase_request_id',
            render: (text: string) => <span className="font-Montserrat text-sm">{text}</span>,
        },
        {
            title: <span className="font-Montserrat text-sm text-[#6D6D6D]">Item Name</span>,
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <span className="font-Montserrat text-sm">{text}</span>,
        },
        {
            title: <span className="font-Montserrat text-sm text-[#6D6D6D]">total_items</span>,
            dataIndex: 'total_items',
            key: 'total_items',
            render: (text: string) => <span className="font-Montserrat text-sm">{text}</span>,
        },
        {
            title: <span className="font-Montserrat text-sm text-[#6D6D6D]">total_suppliers</span>,
            dataIndex: 'total_suppliers',
            key: 'total_suppliers',
            render: (text: string) => <span className="font-Montserrat text-sm">{text}</span>,
        },
        {
            title: <span className="font-Montserrat text-sm text-[#6D6D6D]">UOM</span>,
            dataIndex: 'uom',
            key: 'uom',
            render: (text: string) => <span className="font-Montserrat text-sm">{text}</span>,
        },
        {
            title: <span className="font-Montserrat text-sm text-[#6D6D6D]">quantity</span>,
            dataIndex: 'quantity',
            key: 'quantity',
            render: (text: string) => <span className="font-Montserrat text-sm">{text}</span>,
        },
        {
            title: <span className="font-Montserrat text-sm text-[#6D6D6D]">type</span>,
            dataIndex: 'type',
            key: 'type',
            render: (text: string) => <span className="font-Montserrat text-sm capitalize">{text}</span>,
        },
        {
            title: <span className="font-Montserrat text-sm text-[#6D6D6D]">Pack Size</span>,
            dataIndex: 'pack_size',
            key: 'pack_size',
            render: (text: number) => <span className="font-Montserrat text-sm">{text}</span>,
        },
    ];



    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Content className="relative flex flex-col bg-[#EDF1F6] items-center w-full py-4">
            {/* <div className="flex justify-between h-[50px] w-full bg-white items-center px-4 mb-4 rounded-md">
                <div className="flex items-center justify-between gap-2">
                    <LeftOutlined
                        className="cursor-pointer text-[#444444]"
                        onClick={() => navigate('/requests')}
                    />
                    <p className="font-Montserrat text-sm text-[#444444]">Back</p>

                    <Button
                        icon={<DownloadOutlined />}
                        onClick={handleDownloadRfq}
                        className="flex items-center justify-end"
                        loading={loading} // Uses the existing loading state from Redux
                        disabled={loading}
                    >
                        Download RFQ
                    </Button>
                </div>
            </div> */}

            <div className="flex justify-between items-center h-[50px] w-full bg-white px-4 mb-4 rounded-md">
                {/* Left Section (Back) */}
                <div className="flex items-center gap-2">
                    <LeftOutlined
                        className="cursor-pointer text-[#444444]"
                        onClick={() => navigate('/rfq')}
                    />
                    <p className="font-Montserrat text-sm text-[#444444]">Back</p>
                </div>

                <div className="flex justify-between gap-5">
                    {/* Right Section (Download Button) */}
                    <Button
                        icon={<DownloadOutlined />}
                        onClick={handleDownloadRfq}
                        className="flex items-center"
                        loading={loading}
                        disabled={loading}
                    >
                        Download RFQ
                    </Button>
                    <Button
                        icon={<DownloadOutlined />}
                        // onClick={handleDownloadRfq}
                        className="flex items-center justify-end"
                        loading={loading} // Uses the existing loading state from Redux
                        disabled={loading}
                    >
                        Sent mail
                    </Button>
                </div>


                {/* // Add a new button next to your existing download button */}
                {/* <div className="flex justify-between h-[50px] w-full bg-white items-center px-4 mb-4 rounded-md"> */}
                {/* <div className="flex items-center gap-2">
    <LeftOutlined
      className="cursor-pointer text-[#444444]"
      onClick={() => navigate('/requests')}
    />
    <p className="font-Montserrat text-sm text-[#444444]">Back</p>
  </div> */}
                {/* <div className="flex gap-2">
    <Button 
      type="primary" 
      icon={<DownloadOutlined />}
      onClick={() => handleDownloadRfq()}
      className="flex items-center"
      loading={loading}
    >
      Download RFQ (Single Sheet)
    </Button>
    <Button 
      type="primary" 
      icon={<DownloadOutlined />}
      onClick={() => handleDownloadRfqBySupplier()}
      className="flex items-center"
      loading={loading}
    >
      Download RFQ (By Supplier)
    </Button>
  </div> */}


            </div>




            <div className="w-full bg-white rounded-lg shadow-md">
                <div className="p-6">
                    <h2 className="text-2xl font-Montserrat text-[#104E70] mb-3">Purchase Request Details</h2>

                    <h3 className="text-[#0F44BE] font-Montserrat text-base font-semibold mb-[5px]">REQUEST INFORMATION</h3>
                    <Divider className="my-0" />
                    <div className="grid grid-cols-2 gap-6 mt-[15px]">
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 font-Montserrat">Request ID</span>
                            <span className="font-semibold">{purchaseRequest?.data?.purchase_request_id}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 font-Montserrat">Department</span>
                            <span className="font-semibold">{purchaseRequest?.data?.department}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 font-Montserrat">Date Requested</span>
                            <span className="font-semibold">{purchaseRequest?.data?.date_requested}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 w-48 font-Montserrat">Status</span>
                            <span className="font-semibold capitalize bg-yellow-100 px-1">{purchaseRequest?.data?.status}</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-gray-100">
                    <h3 className="text-[#0F44BE] font-Montserrat text-base font-semibold mb-[5px]">ITEM DETAILS</h3>
                    <Divider className="my-0" />
                    <PaginatedTable
                        columns={itemColumns}
                        dataSource={itemDetails}
                        rowKey="id"
                        currentPage={currentPage}
                        totalItems={itemDetails.length} // Or your total count from API for server-side pagination
                        pageSize={pageSize}
                        onPageChange={handlePageChange}
                        paginationClassName="mr-4"
                        bordered
                        size="middle"
                    />
                </div>
            </div>
        </Content>
    );
};

export default PurchaseRequestPreview;