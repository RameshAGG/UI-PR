import { Modal, Input } from "antd";
import Button from "./Button.tsx";
import React, { useState } from "react";

interface ConfirmationProps {
  label: string;
  message: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmButtonLabel: string; // Dynamic confirm button label
  cancelButtonLabel?: string;
  reason?: string;
  setReason?: (value: string) => void;
}

const Confirmation: React.FC<ConfirmationProps> = ({
  label,
  message,
  isOpen,
  onClose,
  onConfirm,
  confirmButtonLabel = "Submit",
  cancelButtonLabel = "Cancel",
  reason,
  setReason
}) => {
  const [rejectReason, setRejectReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { TextArea } = Input;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await onConfirm();
    setIsSubmitting(false);
  };

  return (
    <Modal
      title={<div className="">{label}</div>}
      style={{ top: 70 }}
      open={isOpen}
      onCancel={onClose}
      zIndex={1050} 
      footer={
        <div className="flex justify-end p-0 gap-[12px] mt-[11px]">
          <Button
            label={cancelButtonLabel}
            onClick={onClose}
            className="w-[83px] h-[44px] text-[#454545] bg-[#FFFFFF] border border-[#D0D5DD] focus-visible:outline-none focus-visible:ring-0 hover:bg-[#F2F2F2] transition-all duration-300 ease-in-out"
          />
          <Button
            label={confirmButtonLabel}
            onClick={handleConfirm}
            className="w-[83px] h-[44px] bg-[#222222] text-[#FCFCFC] focus-visible:outline-none focus-visible:ring-0 hover:bg-[#3A3A3A] transition-all duration-300 ease-in-out"
            disabled={isSubmitting}
          />
        </div>
      }
    >
      {(label.toLowerCase().trim().replace(/\s+/g, '') == "reject" || label.toLowerCase().trim().replace(/\s+/g, '') == "dispatchunavailable" )? (
        <div className="w-full rounded-lg">
          <p className="text-normal text-sm leading-[14px] px-[0] mb-[8px]">
            {message}
          </p>
          <div className="py-[8px] px-[12px]  rounded-lg" style={{padding: '8px 0px'}}>
            <TextArea 
              value={reason} 
              rows={1} 
              onChange={(e) => setReason && setReason(e.target.value)} 
              placeholder="Enter the reason" 
            />
          </div>
        </div>
      ) : (
        <p className="text-normal text-sm leading-[10px] mt-4 px-[0] mb-[20px]">
          {message}
        </p>
      )}
    </Modal>
  );
};

export default Confirmation;
