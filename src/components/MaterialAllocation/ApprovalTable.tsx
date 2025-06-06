import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';

// Define Type for Props
interface DataType {
    allocatedId: number;
    siteName: string;
    towerName: string;
    location: string;
    quantityAvailable: number;
    allocatedQuantity: number;
    type: string;
    materialId: number;
    materialRequestId: number;
}

interface ApprovalTableProps {
    data: DataType[];
    selectMaterialActive: boolean;
    columns?: any;
}

const ApprovalTable: React.FC<ApprovalTableProps> = ({ data, selectMaterialActive, columns }) => {

    const [selectionType] = useState<'checkbox'>('checkbox');
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    useEffect(() => {
        if (selectMaterialActive) {
            setSelectedRowKeys(data.map((item) => item.allocatedId));
        } else {
            setSelectedRowKeys([]);
        }
    }, [selectMaterialActive, data]);


    const rowSelection: TableProps<DataType>['rowSelection'] = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[], selectedRows: DataType[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
        getCheckboxProps: () => ({
            disabled: true,
        }),
    };

    return (
        <div style={{ margin: '10px 10px 10px 0px', background: '#fff', borderRadius: '5px' }}>
            <div style={{ margin: '16px', border: '1px solid #ddd', borderRadius: '6px' }}>
                <Table
                    rowSelection={{ type: selectionType, ...rowSelection }}
                    columns={columns}
                    dataSource={data}
                    rowKey="allocatedId"
                />
            </div>
        </div>
    );
};

export default ApprovalTable;
