import React from "react";
import { Card, Image } from "antd";
import { ISitesTower } from "../../types/type";

interface CustomCardProps {
  site: ISitesTower;
  onClick: () => void;
}

const CustomCard: React.FC<CustomCardProps> = ({ site, onClick }) => {
  return (
    <Card
      className="w-[270.5px] rounded-lg border-[1.5px] border-[#E0E0E0] px-[14px] py-[12px] cursor-pointer 
      hover:border-[#0F44BE] relative group"
      onClick={onClick}
    >
      <p className="font-montserrat text-[16px] leading-[20px] text-[#333333] capitalize">
        {site.siteName}
      </p>
      {/* <p className="text-[#666] text-[13px]">Site ID: {site.id}</p> */}
      
      {/* Tower count that only shows on hover */}
      <p className="text-[#666] text-[13px] font-montserrat">
        Tower Count: {site.towerCount || 0}
      </p>

      <hr className="border-t border-[#E0E0E0] my-1" />
      <div className="font-montserrat font-normal text-[13px] leading-[20px] text-[#444444] flex">
        <Image width={20} height={20} src="location.svg" preview={false} />
        {site.city}
      </div>
    </Card>
  );
};

export default CustomCard;
