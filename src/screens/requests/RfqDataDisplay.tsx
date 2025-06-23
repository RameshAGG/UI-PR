import React from 'react';
import { Table, Card, Divider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchRfqData } from '../../slices/Rfq_uploadslice';

const RfqDataDisplay = ({ requestId }) => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.requestManagement.rfqData);

  React.useEffect(() => {
    if (requestId) {
      dispatch(fetchRfqData(requestId));
    }
  }, [requestId, dispatch]);

  if (loading) return <div>Loading RFQ data...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const columns = [
    {
      title: 'Supplier',
      dataIndex: ['supplier', 'name'],
      key: 'supplier',
    },
    {
      title: 'Items Count',
      dataIndex: 'items',
      key: 'itemsCount',
      render: (items) => items.length,
    },
    {
      title: 'Uploaded At',
      dataIndex: 'uploadedAt',
      key: 'uploadedAt',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => console.log('View details', record)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <Card className="mt-4">
      <h3 className="text-[#0F44BE] font-Montserrat text-base font-semibold mb-[5px]">
        SUBMITTED RFQ DATA
      </h3>
      <Divider className="my-0" />
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={false}
        className="mt-4"
      />
    </Card>
  );
};

export default RfqDataDisplay;