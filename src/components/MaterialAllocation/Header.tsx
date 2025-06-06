import React from 'react';
import { LeftOutlined } from "@ant-design/icons";
import Button from '../common/Button.tsx';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  handleClosePreview: () => void;
  submitRejectBtnEnable: boolean;
  submitApproval: () => void;
  submitReject: () => void;
  approvalScreen?: boolean;
  dispatchScreen?: boolean;
  acceptScreen?: boolean;
  allocationScreen?: boolean;
  showDispatchButton?: boolean;
}
const Header = ({ handleClosePreview, submitRejectBtnEnable, submitApproval, submitReject, approvalScreen, dispatchScreen, acceptScreen, allocationScreen, showDispatchButton }: HeaderProps) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    // // navigate('/ho-material-request');
    // if (approvalScreen) {
    //   navigate('/material-approval')
    // }
    // else if (dispatchScreen) {
    //   navigate('/material-dispatch')
    // }
    // else if (acceptScreen) {
    //   navigate('/material-acknowledgment')
    // }
    handleClosePreview();
  };
  const showRejectButton = acceptScreen || approvalScreen || allocationScreen;
  return (
    <div className="bg-[#FFFFFF] flex items-center p-[6px] px-[16px] mt-[10px]">
      <span onClick={handleBackClick} className="cursor-pointer">
        <LeftOutlined />
      </span>
      <div className="ml-auto flex gap-4">
      {showRejectButton && (
        <Button
          disabled={submitRejectBtnEnable}
          label={acceptScreen ? 'Reject' : (approvalScreen ? 'Reject' : (allocationScreen ? 'Reject Material Request' : ''))}
          onClick={submitReject}
          type="button"
          className={`${dispatchScreen ? 'text-[#222222] border border-[#A1A1A1]' : 'text-[#FF4444] border border-[#FF4444]'} h-[44px] px-[18px] rounded-lg font-medium text-[14px] leading-5`}
        />
      )}
        <Button
          disabled={submitRejectBtnEnable}
          label={acceptScreen ? 'Accept' : (approvalScreen ? 'Approve' : (dispatchScreen&&!showDispatchButton ? 'Dispatch Material' : 'Submit for Approval'))}
          onClick={submitApproval}
          type="button"
          className={`h-[44px] px-[18px] rounded-lg border border-[#222222] font-medium text-[14px] leading-5 ${!submitRejectBtnEnable ? '!bg-[#222222] text-[#FCFCFC]' : '!bg-[#555555] text-[#AAAAAA]'}`}
        />
      </div>
    </div>
  );
};

export default Header; 