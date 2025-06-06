import { Table, TableProps } from "antd";
import React from "react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

interface AccordionTableProps<T> extends TableProps<T> {
    nestedColumns?: TableProps<any>["columns"];
    nestedDataKey?: keyof T;
    expandedRowKeys: React.Key[];
    onExpand: (expanded: boolean, record: T) => void;
    onRowClick?: (record: T) => void;
    onNestedRowClick?: (record: any) => void;
    triggerPagination?: (page: number, pageSize: number) => void;
    totalDataCount: any
    scrollHeight?: number;
}

const AccordianTable = <T extends object>({
    columns,
    dataSource,
    nestedColumns,
    nestedDataKey,
    expandedRowKeys,
    onExpand,
    onRowClick,
    onNestedRowClick,
    totalDataCount,
    triggerPagination,
    scrollHeight,
    // pagination = { pageSize: 10 },
    ...props
}: AccordionTableProps<T>) => {
    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            rowKey={(record) => (record as any).id}
            pagination={false}
            // pagination={{
            //     pageSize: 10,
            //     total: totalDataCount,
            //     showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            //     onChange: (page, pageSize) => {
            //         triggerPagination?.(page, pageSize);
            //     },
            // }}
            onRow={(record) => ({
                onClick: () => onRowClick?.(record),
            })}
            rowClassName={(record) =>
                expandedRowKeys.includes((record as any).id) ? "bg-[#F2F2F2]" : ""
            }
            scroll={{
                y: scrollHeight, 
              }}
            expandable={
                nestedColumns && nestedDataKey
                    ? {
                        expandedRowRender: (record) =>
                            record[nestedDataKey] && Array.isArray(record[nestedDataKey]) ? (
                                <div className="m-[16px] ">
                                    <Table
                                        columns={nestedColumns}
                                        dataSource={record[nestedDataKey] as T[]}
                                        pagination={false}
                                        bordered={false}
                                        rowKey={(row) => (row as any).id || Math.random()}
                                        onRow={(nestedRecord) => ({
                                            onClick: () => onNestedRowClick?.({ parent: record, nested: nestedRecord }),
                                        })}
                                    />
                                </div>
                            ) : (
                                <p>No data available.</p>
                            ),
                        rowExpandable: (record) =>
                            !!record[nestedDataKey] &&
                            Array.isArray(record[nestedDataKey]) &&
                            (record[nestedDataKey] as T[]).length > 0,
                        onExpand,
                        expandedRowKeys,
                        expandIconColumnIndex: columns?.length ?? 0,
                        expandIcon: ({ expanded, onExpand, record }) => (
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onExpand(record, e);
                                }}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 24,
                                    height: 24,
                                    border: "1px solid #d9d9d9",
                                    borderRadius: 4,
                                    cursor: "pointer",
                                    background: expanded ? "#0F44BE" : "#E3E3E3",
                                }}
                            >
                                {expanded ? <UpOutlined className="text-[#FFFFFF]" /> : <DownOutlined className="text-[#777777]" />}
                            </span>
                        ),
                    }
                    : undefined
            }
            {...props}
        />
    );
};

export default AccordianTable;
