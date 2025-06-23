// RfqComparativeTable.tsx
import React from 'react';
import { Table } from 'antd';

interface SupplierOffer {
  unitPrice: number;
  discount: string;
  gst: string;
  deliveryDate: string;
  remarks: string;
}

interface ComparativeRfqData {
  items: Array<{
    code: string;
    name: string;
    uom: string;
    quantity: number;
    suppliers: Record<string, SupplierOffer>;
  }>;
  suppliers: Array<{
    id: number;
    name: string;
  }>;
}

const RfqComparativeTable: React.FC<{ data: ComparativeRfqData }> = ({ data }) => {
  // Generate dynamic columns based on suppliers
  // const columns = [
  //   {
  //     title: 'Item Code',
  //     dataIndex: 'code',
  //     key: 'code',
  //     fixed: 'left',
  //     width: 120,
  //     render: (code: string, record: any) => code || record.name,
  //   },
  //   {
  //     title: 'UOM',
  //     dataIndex: 'uom',
  //     key: 'uom',
  //     width: 80,
  //   },
  //   {
  //     title: 'Quantity',
  //     dataIndex: 'quantity',
  //     key: 'quantity',
  //     width: 100,
  //   },
  //   ...data.suppliers.flatMap(supplier => [
  //     {
  //       title: supplier.name,
  //       children: [
  //         {
  //           title: 'Unit Price',
  //           dataIndex: ['suppliers', `${supplier.id}-${supplier.name}`, 'unitPrice'],
  //           key: `${supplier.id}-price`,
  //           width: 120,
  //           render: (price: number) => price ? `$${price.toFixed(2)}` : '-',
  //         },
  //         {
  //           title: 'Discount',
  //           dataIndex: ['suppliers', `${supplier.id}-${supplier.name}`, 'discount'],
  //           key: `${supplier.id}-discount`,
  //           width: 100,
  //           render: (discount: string) => discount || '-',
  //         },
  //         {
  //           title: 'GST',
  //           dataIndex: ['suppliers', `${supplier.id}-${supplier.name}`, 'gst'],
  //           key: `${supplier.id}-gst`,
  //           width: 80,
  //           render: (gst: string) => gst || '-',
  //         },
  //         {
  //           title: 'Total Value',
  //           dataIndex: ['suppliers', `${supplier.id}-${supplier.name}`, 'totalValue'],
  //           key: `${supplier.id}-totalValue`,
  //           width: 120,
  //           render: (date: string) => date || '-',
  //         },
  //       ],
  //     },
  //   ]),
  // ];

  // In your RfqComparativeTable component
const renderCellValue = (value: any) => {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'number') return value.toFixed(2);
  return value;
};
  // In RfqComparativeTable.tsx
const columns = [
  {
      title: 'Item Code',
      dataIndex: 'code',
      key: 'code',
      fixed: 'left',
      width: 120,
      render: (code: string, record: any) => code || record.name,
  },
  {
      title: 'UOM',
      dataIndex: 'uom',
      key: 'uom',
      width: 80,
  },
  {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
  },
  ...data.suppliers.flatMap(supplier => [
      {
          title: supplier.name,
          children: [
              {
                  title: 'Unit Price',
                  dataIndex: ['suppliers', `${supplier.id}-${supplier.name}`, 'unitPrice'],
                  key: `${supplier.id}-price`,
                  width: 120,
                  render: (price: number) => price ? `$${price.toFixed(2)}` : '-',
              },
              {
                  title: 'Discount',
                  dataIndex: ['suppliers', `${supplier.id}-${supplier.name}`, 'discount'],
                  key: `${supplier.id}-discount`,
                  width: 100,
                  render: (discount: string) => discount || '-',
              },
              {
                  title: 'GST',
                  dataIndex: ['suppliers', `${supplier.id}-${supplier.name}`, 'gst'],
                  key: `${supplier.id}-gst`,
                  width: 80,
                  render: (gst: string) => gst || '-',
              },
              {
                  title: 'CGST',
                  dataIndex: ['suppliers', `${supplier.id}-${supplier.name}`, 'cgst'],
                  key: `${supplier.id}-cgst`,
                  width: 80,
                  render: (cgst: string) => cgst || '-',
              },
              {
                  title: 'SGST',
                  dataIndex: ['suppliers', `${supplier.id}-${supplier.name}`, 'sgst'],
                  key: `${supplier.id}-sgst`,
                  width: 80,
                  render: (sgst: string) => sgst || '-',
              },
              {
                  title: 'Total',
                  dataIndex: ['suppliers', `${supplier.id}-${supplier.name}`, 'totalValue'],
                  key: `${supplier.id}-total`,
                  width: 120,
                  render: (total: string) => total || '-',
              }
          ],
      },
  ]),
];

  return (
    <Table
      columns={columns}
      dataSource={data.items}
      bordered
      size="small"
      scroll={{ x: 'max-content' }}
      pagination={false}
      rowKey="code"
    />
  );
};

export default RfqComparativeTable;