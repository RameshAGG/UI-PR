import { Drawer } from "antd";
import React from "react";
import Button from "./Button.tsx";
import { CloseOutlined } from "@ant-design/icons";

interface SideSheetProps {
  btnLabel?: string;
  width: number;
  title: string;
  isOpen: boolean;
  setOpen?: (open: boolean) => void;
  children: React.ReactNode;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
  slideOpenButton?: boolean;
  cancelLabel?: string;
  cancelClassName?: string;
  disabled?: boolean;
  btnClassName?: string;
}

const SideSheet = ({ width, title, btnLabel, isOpen, setOpen, children, onSubmit, onCancel, submitLabel, slideOpenButton, cancelLabel = "Cancel", cancelClassName, disabled, btnClassName }: SideSheetProps) => {
  return (
    <>
      {
        slideOpenButton != false ? <Button
          label={btnLabel || ''}
          onClick={() => setOpen && setOpen(true)}
          className={`font-Montserrat text-[14px] leading-5 mr-3 rounded-lg bg-[#222222] text-[#FCFCFC] py-[10px] px-[18px] ${btnClassName}`}
        /> : ''
      }

      <Drawer
        title={title}
        onClose={onCancel}
        open={isOpen}
        width={width}
        closeIcon={false}
        maskClosable={false}
        keyboard={false}
        extra={
          <CloseOutlined
            className="w-[14px] h-[14px] text-[#828282] hover:text-gray-700 cursor-pointer"
            onClick={onCancel}
          />
        }
        footer={
          <div className="flex  justify-end gap-[16px]">
            <Button
              label={cancelLabel}
              type="button"
              onClick={onCancel}
              className={
                cancelClassName ||
                "px-4 py-2 w-[86px] h-[36px]  text-[#454545] bg-[#FFFFFF] border border-[#D0D5DD] hover:bg-[#F2F2F2] transition-all duration-300"
              } />
            <Button
              label={submitLabel}
              type="button"
              onClick={(event) => {
                event.preventDefault(); // Ensure it prevents default form submission behavior
                onSubmit(); // ✅ This triggers Formik's `onSubmit`
              }}
              className="px-4 py-2 w-[86px] h-[36px] text-[#FCFCFC] bg-[#222222] hover:bg-[#3A3A3A] transition-all duration-300"
            />
          </div>
        }
      >
        {children}
      </Drawer>
    </>
  );
};

export default SideSheet;
