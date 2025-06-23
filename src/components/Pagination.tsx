// components/Pagination.tsx
import React from 'react';
import { Pagination as AntPagination } from 'antd';
import type { PaginationProps } from 'antd';

interface CustomPaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  showTotal?: PaginationProps['showTotal'];
  className?: string;
}

const Pagination: React.FC<CustomPaginationProps> = ({
  current,
  total,
  pageSize,
  onChange,
  showSizeChanger = true,
  pageSizeOptions = [10, 20, 50, 100],
  showTotal = (total, range) => `${range[0]}-${range[1]} of ${total} items`,
  className = '',
}) => {
  return (
    <AntPagination
      current={current}
      total={total}
      pageSize={pageSize}
      onChange={onChange}
      showSizeChanger={showSizeChanger}
      pageSizeOptions={pageSizeOptions}
      showTotal={showTotal}
      className={`font-Montserrat ${className}`}
    />
  );
};

export default Pagination;