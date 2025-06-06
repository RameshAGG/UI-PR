import React from 'react';
interface AllocationSummaryProps {
  allocatedQuantity: number;
  allocationError: string | null;
}

const AllocationSummary = ({ allocatedQuantity, allocationError }: AllocationSummaryProps) => {
  return (
    <div className='flex justify-between m-[17.5px]'>
      <div className='flex gap-2'>
        <p className="text-[#0F44BE]"><span>SITE (3)</span></p>
        <p className="text-[#0F44BE]"><span>TOWER (5)</span></p>
      </div>
      <p className='font-montserrat font-medium text-[13px] leading-[20px] relative'>
        Allocated Qty:
        <span className='ml-[2px] min-w-[112px] inline-block border'>
          {allocatedQuantity}
        </span>
      </p>
      {allocationError && (
        <p className="text-red-500 text-sm mt-1 absolute">{allocationError}</p>
      )}
    </div>
  );
};

export default AllocationSummary; 