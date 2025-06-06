import React from "react";

import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.tsx";
import AppHeader from "./Header.tsx";
import { Content } from "antd/es/layout/layout";

const LayoutComponent = () => {
  return (
    <Layout className="flex  h-screen">
      <Sidebar />

      {/* Header */}
      <Layout className="flex flex-col w-full ml-[250px]  ">
        <AppHeader />
        <Content className=" mt-[25px] " style={{ background: "#EDF1F6" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default LayoutComponent;
