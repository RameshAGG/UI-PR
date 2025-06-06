import React, { useState } from 'react';
import {
  SettingOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Menu, Dropdown, Breadcrumb } from 'antd';
import type { MenuProps } from 'antd';
import Confirmation from '../common/Confirmation.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Link } from 'react-router-dom';
import { decryptData } from '../../storageHelper.ts';

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const [isLogoutConfirmation, setLogoutConfirmation] = useState(false);
  const [confirmText, setConfirmText] = useState('Confirm');
  const { logout } = useAuth();
  const breadcrumbs = useSelector((state: RootState) => state.breadcrumb.items);

  // const roleName = localStorage.getItem('roleName');
  const encryptedRole = localStorage.getItem("roleName");
  const roleName = encryptedRole ? decryptData(encryptedRole) : null;
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'logout') {
      setLogoutConfirmation(true);
    }
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined className="w-[24px] h-[24px]" />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined className="w-[24px] h-[24px]" />,
      label: 'Settings',
    },
    {
      type: 'divider',
      key: 'divider-1',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined className="w-[24px] h-[24px]" />,
      label: (
        <span className="flex items-center gap-2 px-2 py-1 rounded-md">
          Logout
        </span>
      ),
      className: 'ant-dropdown-menu-item ant-logout',
    },
  ];

  const handleCloseConfirmation = () => {
    setLogoutConfirmation(false);
  };

  const handleSubmitConfirm = () => {
    setLogoutConfirmation(false);
    handleLogout();
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('roleName');
      logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="fixed h-[40px] w-[calc(100%-250px)] bg-[#FFFFFF] py-[8.5px] px-[20px] flex justify-between items-center" style={{ zIndex: 1 }}>
      <div className="flex-1">
        <Breadcrumb>
          {breadcrumbs.map((item, index) => (
            <Breadcrumb.Item key={index}>
              {index === breadcrumbs.length - 1 ? (
                <span>{item.title}</span>
              ) : (
                <Link to={item.path} onClick={item.onClick}>{item.title}</Link>
              )}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      </div>
      <div className="flex items-center border-r-2 border-[#BDBDBD] ">
        <SettingOutlined className="w-[24px] h-[24px]  cursor-pointer" />
        <BellOutlined className="w-[24px] h-[24px] cursor-pointer" />
      </div>
      <Dropdown
        menu={{
          items: menuItems,
          onClick: handleMenuClick,
        }}
        trigger={['click']}
        className="ml-0"
      >
        <div className=" cursor-pointer px-[10px] pt-[12px] pb-[15px] flex items-center justify-center gap-1 hover:bg-[rgba(0, 0, 0, 0.04)] transition-colors duration-300 ease-in-out">
          <span className='capitalize'>
            {roleName ?
              roleName
              : 'null'}
          </span>                 <DownOutlined className="w-[12.25px] h-[7px]" />
        </div>
      </Dropdown>
      <Confirmation
        label="Logout Confirmation"
        message="Do you want to logout?"
        isOpen={isLogoutConfirmation}
        onClose={handleCloseConfirmation}
        onConfirm={handleSubmitConfirm}
        confirmButtonLabel={confirmText}
        cancelButtonLabel="Cancel"
      />
    </div>
  );
};

export default AppHeader;
