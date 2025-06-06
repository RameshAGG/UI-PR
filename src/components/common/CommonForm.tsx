import React from "react";
import { Formik, Form, Field, FormikHelpers, FormikValues } from "formik";
import { Button, Input, Select, DatePicker } from "antd";
import * as Yup from "yup";
import dayjs from "dayjs";
import RequiredLabel from './RequiredLabel';

const { Option } = Select;

interface FormField {
  name: string;
  label: string;
  type: "text" | "password" | "email" | "select" | "date";
  placeholder?: string;
  selectOptions?: { label: string; value: string | number }[]; // Dropdown options
  required?: boolean;
}

interface CommonFormProps<T extends FormikValues> {
  initialValues: T;
  validationSchema: Yup.ObjectSchema<T>;
  fields: FormField[];
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void;
}

const CommonForm = <T extends FormikValues>({
  initialValues,
  validationSchema,
  fields,
  onSubmit,
}: CommonFormProps<T>) => {
  return (
    <Formik<T> initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ errors, touched, handleChange, handleBlur, values, setFieldValue, isSubmitting }) => (
        <Form>
          {fields.map((field) => (
            <div key={field.name} style={{ marginBottom: "1rem" }}>
              {field.required ? (
                <RequiredLabel>{field.label}</RequiredLabel>
              ) : (
                <label>{field.label}</label>
              )}

              {/* Text, Password, Email Fields */}
              {["text", "password", "email"].includes(field.type) && (
                <Field
                  as={Input}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  onChange={handleChange} 
                  onBlur={handleBlur}
                  value={values[field.name]}
                  className="font-montserrat"
                />
              )}
                  {/* Dropdown Field */}
                  {field.type === "select" && (
                      <Select
                          onChange={(value) => setFieldValue(field.name, value)}
                          onBlur={handleBlur}
                          value={values[field.name]}
                          placeholder={field.placeholder}
                          style={{ width: "100%" }}
                          className="font-montserrat"
                      >
                          {field.selectOptions?.map((option) => (
                              <Option key={option.value} value={option.value}>
                                  {option.label}
                              </Option>
                          ))}
                      </Select>
                  )}

              {/* Date Picker Field */}
              {field.type === "date" && (
                <DatePicker
                  name={field.name}
                  onChange={(date) => setFieldValue(field.name, date ? dayjs(date).format("YYYY-MM-DD") : "")}
                  onBlur={handleBlur}
                  value={values[field.name] ? dayjs(values[field.name]) : null}
                  placeholder={field.placeholder}
                  style={{ width: "100%" }}
                  className="font-montserrat"
                />
              )}

              {/* Error Handling */}
              {touched[field.name] && errors[field.name] && (
                <div style={{ color: "red", fontSize: "0.8rem" }}>{errors[field.name] as string}</div>
              )}
            </div>
          ))}

        
        </Form>
      )}
    </Formik>
  );
};

export default CommonForm;
