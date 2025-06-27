import { Layout, Menu } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { decryptData } from '../../storageHelper.ts';
const { Sider } = Layout;

const items = [
  { key: "/rfq_dashboard",icon: <img src="/assets/sidebarIcons/fluent_form-28-regular (3).svg" width="22" height="22"  alt="img"/>, label: <Link to="/rfq_dashboard">Dashboard</Link>,ability:"rfq_dashboard" },
  { key: "/requests",icon: <img src="/assets/sidebarIcons/fluent_form-28-regular (3).svg" width="22" height="22"  alt="img"/>, label: <Link to="/requests">Purchase Request</Link>,ability:"requests" },
  { key: "/rfq",icon: <img src="/assets/sidebarIcons/site-05.svg" width="22" height="22"  alt="img"/>, label: <Link to="/rfq">Rfq_lists</Link>,ability:"rfq" },
  // { key: "/site-management",icon: <img src="/assets/sidebarIcons/site-05.svg" width="22" height="22"  alt="img"/>, label: <Link to="/site-management">Site Management</Link>,ability:"site-management" },
  { key: "/Rfq_Upload",icon: <img src="/assets/sidebarIcons/site-05.svg" width="22" height="22"  alt="img"/>, label: <Link to="/Rfq_Upload">Rfq_Upload</Link>,ability:"Rfq_Upload" },
  { key: "/bulkupload",icon: <img src="/assets/sidebarIcons/fluent_form-28-regular (3).svg" width="22" height="22"  alt="img"/>, label: <Link to="/bulkupload">Bulk Upload</Link>,ability:"bulkupload" },
  {
    key: "/master", icon: <img src="/assets/sidebarIcons/master.svg" width="22" height="22" alt="img" />, label: "Masters",
    children: [
      { key: "/masters/material-category-master", label: <Link to="/masters/material-category-master">Category Master</Link>,ability:"master" },
    ],
    ability: "master"
  }
];
//icon: <img src="/assets/sidebarIcons/Building.svg" width="22" height="22"  alt="img"/>,
const Sidebar = () => {
  const location = useLocation();


  const [menuItems, setMenuItems] = useState<any[]>([]);

  // useEffect(() => {
  //   async function loadMenuItems() {
  //     try {
  //       // const userPermissions = localStorage.getItem('permission');
  //       const encryptedPermission = localStorage.getItem('permission');
  //       const userPermissions = decryptData(encryptedPermission);
  //       // const parsedPermissions = userPermissions ? JSON.parse(userPermissions) : [];

  //       if (userPermissions.length > 0) {
  //         const subjects = userPermissions.map((perm: any) => perm.subject);
  //         const visibleItems = items.filter(item => {
  //           const hasPermission = item.ability && subjects.includes(item.ability.toLowerCase());
  //           if (item.children && item.children.length > 0) {
  //             item.children = item.children.filter(child => child.ability && subjects.includes(child.ability.toLowerCase()));
  //           }
  //           return hasPermission || (item.children && item.children.length > 0);
  //         });
  //         const formattedItems = visibleItems.map(({ key, icon, label, children }) => ({ key, icon, label, children }));

  //         setMenuItems(formattedItems);
  //       }
  //     } catch (error) {
  //       console.error('Error loading menu items:', error);
  //       setMenuItems([]);
  //     }
  //   }

  //   loadMenuItems();
  // }, []);



  return (
    <>
      <Sider className="w-[100%] h-screen fixed" style={{ overflowY: 'auto' }}>
        <div className="mx-[12px] my-[24px]">
          <div className="w-[208px] h-[90px] pl-10 border-b border-[#ffffff69]">
            <img src="/assets/logo_new.png" height={50} width={100} alt="logo" />
          </div>
          <div className="mt-[15px]">
            <Menu mode="inline"
              defaultSelectedKeys={["/request"]}
              selectedKeys={[location.pathname === "/" ? "/Request" : location.pathname]}
              items={ items} className="" />
          </div>
        </div>
      </Sider>
    </>
  )
}

export default Sidebar;

