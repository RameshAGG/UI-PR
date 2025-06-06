import React from 'react';
import { Image } from "antd";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import Status from '../common/Status.tsx';

interface SiteDetailsProps {
  selectedRow: any;
}

const SiteDetails = ({ selectedRow }: SiteDetailsProps) => {
  return (
    <div className="p-[16px] bg-[#ffffff] rounded-sm shadow-md">
      <div className="flex pb-[16px] border-b border-[#E0E0E0]">
        <div className="w-[50px] h-[50px] bg-[#E6E6E6] flex justify-center items-center rounded-full">
          <Image src="/assets/allocationicon.svg" alt="preview icon" preview={false} />
        </div>
        <div className="flex flex-col justify-center ml-[14px]">
          <p className="font-montserrat font-semibold text-[20px] text-[#222222] leading-[24px]">
            {selectedRow?.sitename}
          </p>
          <p className="font-montserrat font-medium text-[14px] mt-[4px] text-[#777777]">
            {selectedRow?.towerseqid}
          </p>
        </div>
      </div>

      {/* Request Details Section */}
      <div className="mt-4 ">
        <div className="flex ">
          <p className="font-Montserrat font-normal text-[13px] leading-[18px] text-[#4F4F4F] w-[200px]">Request ID</p>
          <p className='font-Montserrat font-medium text-[14px] leading-5 text-[#0A0A0A]'>{selectedRow?.materialrequestid}</p>
        </div>
        <div className="flex  mt-2">
          <p className="font-Montserrat font-normal text-[13px] leading-[18px] text-[#4F4F4F]  w-[200px]">Status</p>
          <Status label={selectedRow?.status} className='font-Montserrat font-medium text-[14px] leading-5 text-[#0A0A0A]' />
        </div>
        <div className="flex  mt-2">
          <p className="font-Montserrat font-normal text-[13px] leading-[18px] text-[#4F4F4F]  w-[200px]">Requested Date</p>
          <p className='font-Montserrat font-medium text-[14px] leading-5 text-[#0A0A0A]'>{selectedRow?.requestdate}</p>
        </div>
      </div>

      {/* Expand/Collapse Section */}
      <div>
        <div className="text-[#444444] text-[14px]">
          <div className="flex  mt-2">
            <p className="font-Montserrat font-normal text-[13px] leading-[18px] text-[#4F4F4F]  w-[200px]">Admin Name</p>
            <p className='font-Montserrat font-medium text-[14px] leading-5 text-[#0A0A0A]'>{selectedRow?.siteownername ? selectedRow?.siteownername : '-'}</p>
          </div>
          <div className="flex  mt-2">
            <p className="font-Montserrat font-normal text-[13px] leading-[18px] text-[#4F4F4F]  w-[200px]">Contact Number</p>
            <p className='font-Montserrat font-medium text-[14px] leading-5 text-[#0A0A0A]'>{selectedRow?.phonenumber ? selectedRow?.phonenumber : '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteDetails;