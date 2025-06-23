// components/PaginatedTable.tsx
import React from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import Pagination from './Pagination.tsx';

interface PaginatedTableProps<T> extends TableProps<T> {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  paginationClassName?: string;
}

const PaginatedTable = <T extends object>({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  paginationClassName,
  ...tableProps
}: PaginatedTableProps<T>) => {
  return (
    <div>
      <Table<T> 
        {...tableProps}
        pagination={false}
      />
      <div className="mt-4 flex justify-end">
        <Pagination
          current={currentPage}
          total={totalItems}
          pageSize={pageSize}
          onChange={onPageChange}
          className={paginationClassName}
        />
      </div>
    </div>
  );
};

export default PaginatedTable;