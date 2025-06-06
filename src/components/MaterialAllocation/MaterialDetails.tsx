import React from "react";
import { notification } from 'antd';

interface MaterialData {
  id: number;
  materialName: string;
  materialSeqId: string;
  status: string;
  periorityType: string;
  statusId: number;
  periorityId: number;
  originalrequiredquantity: number;
  materialDate: string;
}

interface MaterialAllocationProps {
  selectedMaterialData?: MaterialData;
  isFormValid?: any;
  onAllocate?: () => void;
  isAllocation?:boolean
}



const MaterialAllocation: React.FC<MaterialAllocationProps> = ({
  selectedMaterialData,
  isFormValid,
  onAllocate,
  isAllocation

}) => {
  const showNotification = (type: "success" | "error", message: string) => {
    notification[type]({
      message,
      placement: "top",
    });
  };

  const handleAllocate = () => {
    let allocatedQuantity = isFormValid.reduce((total, item) => total + item.value, 0);
    if (isFormValid.length && selectedMaterialData?.originalrequiredquantity && allocatedQuantity > selectedMaterialData?.originalrequiredquantity) {
      showNotification("error", "Allocated quantity cannot exceed the required quantity");
      return;
    }
    onAllocate();
  };
  // Check if material is fully allocated
  const isFullyAllocated = selectedMaterialData?.originalrequiredquantity === selectedMaterialData?.totalallocatedquantity;
  const hasEnteredQuantity = isFormValid?.some(item => item.value > 0);
  return (
    <div className="h-[112px] border border-[#F2C94C] rounded-lg  bg-[#FDF7E6] flex justify-between p-[14px] items-center">
      {/* Left Section */}
      <div className="w-full">
        <p className="font-montserrat font-semibold text-[16px] leading-[20px] text-[#222222] capitalize">
          {selectedMaterialData?.materialName}
        </p>

        {/* Grid Layout for Required Info */}
        <div className="grid grid-cols-2 gap-[10px] mt-[10px]">
          {/* Required For */}
          <p className="flex">
            <span className="min-w-[100px] font-montserrat font-medium text-[13px] text-[#4F4F4F]">
              Required for :
            </span>
            <span className="font-montserrat font-medium text-[13px] text-[#0A0A0A] capitalize">
              {selectedMaterialData?.towername}
            </span>
          </p>

          {/* Required On */}
          <p className="flex">
            <span className="min-w-[100px] font-montserrat font-medium text-[13px] text-[#4F4F4F]">
              Required on :
            </span>
            <span className="font-montserrat font-medium text-[13px] text-[#0A0A0A]">
              {selectedMaterialData?.materialdate}
            </span>
          </p>

          {/* Quantity Required */}
          <p className="flex">
            <span className="min-w-[100px] font-montserrat font-medium text-[13px] text-[#4F4F4F]">
              Qty required :
            </span>
            <span className="font-montserrat font-semibold text-[13px] text-[#008000]">
              {selectedMaterialData?.originalrequiredquantity}
            </span>
            <span className="min-w-[100px] font-montserrat font-medium text-[13px] text-[#4F4F4F]" style={{ marginLeft: '10px' }}>
              Qty allocated :
            </span>
            <span className="font-montserrat font-semibold text-[13px] text-[#008000]">
              {selectedMaterialData?.totalallocatedquantity ? selectedMaterialData?.totalallocatedquantity : '-'}
            </span>
          </p>

          {/* Dimension */}
          <p className="flex">
            <span className="min-w-[100px] font-montserrat font-medium text-[13px] text-[#4F4F4F]">
              Dimension :
            </span>
            <span className="font-montserrat font-medium text-[13px] text-[#0A0A0A]">
              Height = {selectedMaterialData?.height}, Width = {selectedMaterialData?.width}
            </span>
          </p>
        </div>
      </div>

      {
        <div className="flex gap-[12px]">
          {/* Allocate Button */}
          {isAllocation && !isFullyAllocated && hasEnteredQuantity &&
          <button
            type="button"
            onClick={handleAllocate}
            className={`border border-[#008000] text-[#008000] bg-[#FFFFFF] w-auto h-[36px] px-[18px] flex items-center justify-center rounded-md`}
          >
            Allocate
          </button>
}
        </div>
      }
    </div>
  );
};

export default MaterialAllocation;
