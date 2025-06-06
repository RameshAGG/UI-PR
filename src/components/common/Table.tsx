import React from "react";
import { Table } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

interface CustomTableProps<T> {
  columns: any[];
  dataSource?: T[];
  loading?: boolean;
  rowKey?: keyof T;
  onChange?: (pagination: any, filters: any, sorter: any) => void;
  rowSelection?: object;
  className?: string;
  onRow?: (record: T) => React.HTMLAttributes<HTMLElement>;
  onRowClick?: (record: T) => void;
  scrollHeight?: number;
}

const CustomTable = <T,>({
  columns,
  dataSource = [],
  loading = false,
  rowKey = "id" as keyof T,
  onChange,
  rowSelection,
  className = "",
  onRow,
  onRowClick,
  scrollHeight 
}: CustomTableProps<T>) => {
  // Modify columns to show only one arrow at a time based on sort state
  const modifiedColumns = columns.map((col) => ({
    ...col,
    title: (
      <span className="flex items-center gap-1">
        {col.title}
        {col.sorter && (
          <span>
            {col.sortOrder === 'ascend' ? (
              <ArrowUpOutlined
                style={{
                  fontSize: 12,
                  cursor: "pointer",
                  color: '#000000'
                }}
              />
            ) : (
              <ArrowDownOutlined
                style={{
                  fontSize: 12,
                  cursor: "pointer",
                  color: '#000000'
                }}
              />
            )
              //  : (
              //   <ArrowDownOutlined 
              //     style={{ 
              //       fontSize: 12, 
              //       cursor: "pointer",
              //       color: '#000000'
              //     }} 
              //   />
              // )
            }
          </span>
        )}
      </span>
    ),
    showSorterTooltip: false,
  }));

  return (
    <Table
      className={`custom-table ${className}`}
      columns={modifiedColumns}
      dataSource={dataSource}
      loading={loading}
      rowKey={rowKey as string}
      pagination={false}
      onChange={onChange}
      rowSelection={rowSelection}
      scroll={{
        y: scrollHeight, 
      }}
      // scroll={{ y: "calc(100vh - 240px" }}
      onRow={(record) => ({
        onClick: () => onRowClick && onRowClick(record),
      })}
    />
  );
};

export default CustomTable;
