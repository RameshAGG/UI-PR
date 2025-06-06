import React, { useState, useEffect } from 'react';
import { Tabs, Card, Spin, Pagination } from 'antd';
import { IMaterialListMaster } from '../../types/type';
import CustomTable from './Table.tsx';
import { fetchIdwiseAccessoriesList, fetchMaterialListMaster, setCurrentPage, setLimit } from '../../slices/MaterialListMasterSlice.ts';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { setBreadcrumbs } from '../../slices/BreadcrumbSlice.ts';

interface MaterialTabsProps {
  categories: any[];
  materialListMaster: IMaterialListMaster[];
  handleCardClick: (material: IMaterialListMaster) => void;
  onTabChange?: (tabKey: string) => void;
  activeTab?: string;
}

const CustomTabs: React.FC<MaterialTabsProps> = ({ 
  categories, 
  materialListMaster, 
  handleCardClick,
  onTabChange,
  activeTab
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [showSite, setShowSite] = useState(true);
  const [showTower, setShowTower] = useState(false);
  const [showAccessories, setShowAccessories] = useState(false);
  const { dataCount: totalCount, currentPage, limit: pageSize } = useSelector((state: RootState) => state.MaterialListMaster);

  useEffect(() => {
    if (onTabChange && categories.length > 0) {
      onTabChange(activeTab || categories[0]?.materialTypeId?.toString() || "1");
    }
  }, [activeTab, onTabChange, categories]);

  const handleTabChange = (key: string) => {
    setLoading(true);
    dispatch(fetchMaterialListMaster({ search: key })).finally(() => setLoading(false));
    setShowSite(true);
    setShowTower(false);
    setShowAccessories(false);
    if (onTabChange) {
      onTabChange(key);
    }
  };

  const formatNumber = (value: number, decimals: number) => {
    if (isNaN(value)) {
      return '0';
    }
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };

  const handleRowClick = (record: any) => {
    const { siteId, towerId } = record;
    setLoading(true);

    const selectedCategory = categories.find(cat => cat.materialTypeId?.toString() === activeTab);
    const tabName = selectedCategory?.materialtypeName || "";
    const tabPath = `/inventory-management?tab=${activeTab}`;

    if (siteId) {
      dispatch(setBreadcrumbs([
        {
          title: "Inventory Management",
          path: '/inventory-management',
        },
        {
          title: tabName,
          path: tabPath
        },
        {
          title: record.siteName,
          path: `/inventory-management/details/${siteId}/${activeTab}`
        }
      ]));
      navigate(`details/${siteId}/${activeTab}`);
    } else if (towerId) {
      dispatch(setBreadcrumbs([
        {
          title: "Inventory Management",
          path: '/inventory-management',
        },
        {
          title: tabName,
          path: tabPath
        },
        {
          title: record.towerName,
          path: `/inventory-management/details/${towerId}/${activeTab}`
        }
      ]));
      dispatch(fetchIdwiseAccessoriesList({
        towerId: Number(towerId),
        materialNameId: Number(activeTab),
      })).finally(() => setLoading(false));
      setShowSite(false);
      setShowTower(false);
      setShowAccessories(true);
    } else {
      setLoading(false);
    }
  }

  const handlePaginationChange = (page: number, newPageSize?: number) => {
    if (newPageSize && newPageSize !== pageSize) {
      dispatch(setLimit(newPageSize));
      dispatch(setCurrentPage(1));
    } else {
      dispatch(setCurrentPage(page));
    }

    const updatedPage = newPageSize ? 1 : page;
    const updatedLimit = newPageSize || pageSize;
    setLoading(true);

    if (showAccessories) {
      dispatch(fetchIdwiseAccessoriesList({
        towerId: Number(materialListMaster[0]?.["towerId"]),
        materialNameId: Number(activeTab),
      })).finally(() => setLoading(false));
    }
  }

  const columns = [
    {
      title: <span className="text-[#6D6D6D]">Sl No</span>,
      render: (_, __, index) => <span className="text-[#0A0A0A]">{index + 1}</span>,
      key: 'slNo',
    },
    {
      title: <span className="text-[#6D6D6D]">Site Name</span>,
      dataIndex: 'siteName',
      key: 'siteName',
      hidden: !showSite,
      render: (text) => <span className="text-[#0A0A0A]">{text}</span>,
    },
    {
      title: <span className="text-[#6D6D6D]">Tower Name</span>,
      dataIndex: 'towerName',
      key: 'towerName',
      hidden: !showTower,
      render: (text) => <span className="text-[#0A0A0A]">{text}</span>,
    },
    {
      title: <span className="text-[#6D6D6D]">Accessories Name</span>,
      dataIndex: 'accessoryName',
      key: 'accessoryName',
      hidden: !showAccessories,
      render: (text) => <span className="text-[#0A0A0A]">{text}</span>,
    },
    {
      title: <span className="text-[#6D6D6D]">Quantity</span>,
      dataIndex: 'qty',
      key: 'qty',
      render: (text) => <span className="text-[#0A0A0A]">{formatNumber(text, 2)}</span>,
    }
  ];

  return (
    <Tabs
      activeKey={activeTab}
      onChange={handleTabChange}
      style={{
        fontSize: '13px',
      }}
      tabBarStyle={{
        marginLeft: 0,
      }}
      className="custom-tabs"
    >
      {categories?.map(item => (
        <Tabs.TabPane
          key={item?.materialTypeId?.toString()}
          tab={
            <span 
              className={`px-4 font-medium capitalize ${
                activeTab === item?.materialTypeId?.toString() 
                  ? 'text-[#0F44BE]' 
                  : 'text-[#000000]'
              }`}
            >
                {item.materialtypeName}
            </span>
          }
        >
          <Spin spinning={loading}>
            <div className={`flex flex-wrap ${item.materialtypeName?.toLocaleLowerCase() === 'mivan' ? 'gap-[20px] mt-[17px] my-[18px] mx-[20px]' : 'm-[0px]'}`}>
              {item.materialtypeName?.toLocaleLowerCase() === 'mivan' ? (
                materialListMaster?.map(material => (
                  <Card
                    key={material.id}
                    className="w-[270.5px] rounded-lg border-[1.5px] border-[#E0E0E0] px-[14px] py-[12px] cursor-pointer hover:border-[#0F44BE]"
                    onClick={() => handleCardClick(material)}
                  >
                    <p className="font-montserrat font-medium text-[14px] leading-[20px] text-[#333333]">
                      {material.materialName}
                    </p>
                    <p className="text-[#666] text-[13px]">{material.id}</p>
                    <div className="font-montserrat font-normal text-[13px] leading-[20px] text-[#444444] flex">
                      Material Count: {material?.["count"]}
                    </div>
                    <hr />
                    <div className="flex">
                      <p className="text-[#666] text-[13px]">
                        {material?.materialName?.toLocaleLowerCase() === 'external corner' 
                          ? `${material?.runningMeter ? (material.runningMeter / 1000).toFixed(2) : '0.00'} M` 
                          : `${material?.["stock"]?.toFixed(2)} SQM`}
                      </p>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="w-full">
                  <CustomTable
                    columns={columns}
                    dataSource={materialListMaster}
                    loading={loading}
                    rowKey="id"
                    className="w-full"
                    onRowClick={(record) => {
                      handleRowClick(record);
                    }}
                  />
                  <div className="sticky bottom-0 flex justify-end py-4">
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={totalCount}
                      showSizeChanger={false}
                      onChange={handlePaginationChange}
                      showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                    />
                  </div>
                </div>
              )}
            </div>
          </Spin>
        </Tabs.TabPane>
      ))}
    </Tabs>
  );
};

export default CustomTabs; 