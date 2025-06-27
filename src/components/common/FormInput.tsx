import React from "react";
import { Input, Select, DatePicker } from "antd";
import { FieldHookConfig, useField } from "formik";
import dayjs from "dayjs";

const { Option } = Select;

interface FormInputProps {
  label?: string;
  name: string;
  type: "text" | "password" | "email" | "select" | "date" | "number" | "checkbox";
  placeholder?: string;
  options?: { label: string; value: string | number }[];
  // onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabledDate?: (current: dayjs.Dayjs) => boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  checked?: boolean;
  suffix?: React.ReactNode;
  // value?: string;


}

const FormInput: React.FC<FormInputProps & FieldHookConfig<string>> = ({
  label,
  type,
  options,
  error,
  onChange,
  disabledDate,
  disabled,
  checked,
  suffix,

  ...props
}) => {
  const [field, meta, helpers] = useField(props);

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={props.name}
          className="block text-sm font-Montserrat font-semibold text-gray-700"
        >
          {label}
        </label>
      )}

      {["text", "password", "email", "number"].includes(type) && (
        <Input
          {...field}
          id={props.name}
          type={type}
          placeholder={props.placeholder}
          disabled={disabled}
          onChange={(e) => {
            helpers.setValue(e?.target?.value);
            props.onChange?.(e?.target?.value);
          }}
          className={`w-full bg-[#EDF1F6] p-2 border rounded-lg h-[40px] shadow-sm focus:outline-none focus:ring-2 mt-2 `} //{`${props.error ? "error" : ""}`}
        />
      )}

      {type === "select" && (
        <Select 
          className={`w-full bg-[#EDF1F6] p-2 border rounded-lg h-[40px] shadow-sm focus:outline-none focus:ring-2 mt-2 `} // 
          id={props.name}
          value={field.value || ""}
          onChange={(value) => {
            helpers.setValue(value);
            props.onChange?.(value);
          }}
          onBlur={() => helpers.setTouched(true)}
          placeholder={props.placeholder}
          disabled={disabled}
        >
          <Option value="" disabled className="text-gray-500">{props.placeholder || "Select"}</Option>
          {options?.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      )}

      {type === "date" && (
        <DatePicker
          id={props.name}
          value={field.value ? dayjs(field.value) : null}
          onChange={(date) =>
            helpers.setValue(date ? dayjs(date).format("YYYY-MM-DD") : "")
          }
          onBlur={() => helpers.setTouched(true)}
          placeholder={props.placeholder}
          className="w-full h-10 mt-2"
          disabledDate={disabledDate ? (current) => disabledDate(current) : undefined}
        />
      )}

      {meta.touched && meta.error && (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      )}
    </div>
  );
};

export default FormInput;
