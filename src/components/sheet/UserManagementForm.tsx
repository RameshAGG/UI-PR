import React, { useEffect, useState } from "react"
import { Formik, Form } from "formik";
import * as yup from "yup"
import FormInput from "../common/FormInput.tsx";
import RequiredLabel from '../common/RequiredLabel.tsx';
import { AppDispatch, RootState } from '../../store/store.ts';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRole } from "../../slices/MasterSlice.ts";

const UserManagementForm = ({ handleChange, values, touched, errors, setFieldValue, initialValues }) => {
  const [selectedUsermanager, setSelectedUserManager] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { roleMaster } = useSelector((state: RootState) => state.MasterSlice)
  const [roleOptions, setRoleOptions] = useState<{ value: string; label: string }[]>([]);
  interface usermanagementForm {

  }

  useEffect(() => {
    dispatch(getAllRole())
  }, []);

  useEffect(() => {
    if (values && Object.keys(values).length > 0) {
      // Set each field value
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          setFieldValue(key, value);
        }
      });
    }
  }, [values, setFieldValue]);


  return (
    <Form className="w-[750px]">
      <div className="grid grid-cols-2 gap-10">
        <div>

          <RequiredLabel>Name</RequiredLabel>
          <FormInput name="userName"
            type="text"
            placeholder="Enter your name"
            onChange={handleChange}
            value={values.sitename}
            error={touched.sitename && typeof errors.sitename === 'string' ? errors.sitename : undefined} />
        </div>
        <div>

          <RequiredLabel>Email</RequiredLabel>
          <FormInput name="email"
            type="email"
            placeholder="Enter your email"
            onchange={(e) => setFieldValue("email")} />
        </div>
      </div>


      <div className="grid grid-cols-2 gap-10">
        <div>

          <RequiredLabel>Phone Number</RequiredLabel>
          <FormInput name="phoneNumber" type="text" placeholder="Enter your phone number" />
        </div>


        <div>
          <RequiredLabel>Role</RequiredLabel>
          <FormInput
            name="roleId" // Change name to roleId since roleName might not be the best option
            type="select"
            options={roleMaster?.map((role) => ({
              value: role.id,
              label: role.name
            })) ?? []}
            onChange={(selectedValue) => {
              setFieldValue("roleId", selectedValue); // Store roleId instead of roleName
            }}
            value={values.roleId} // Changed from values.name to values.roleId
            error={touched.roleId && typeof errors.roleId === "string" ? errors.roleId : undefined}
          />
        </div>
      </div>

      <div className="mt-2">
        <RequiredLabel>Address</RequiredLabel>
        <FormInput name="address" type="text" placeholder="Enter your address" />
      </div>

      {/* Fourth Row - City & State */}
      <div className="grid grid-cols-2 gap-10">
        <div>

          <RequiredLabel>City</RequiredLabel>
          <FormInput name="city" type="text" placeholder="Enter your City" />
        </div>
        <div>


          <RequiredLabel>State</RequiredLabel>
          <FormInput name="state" type="text" placeholder="Enter your state" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-10">

        <div>

          <RequiredLabel>Country</RequiredLabel>
          <FormInput name="country" type="text" placeholder="Enter your country" />
        </div>
        <div>

          <RequiredLabel>Zip Code</RequiredLabel>
          <FormInput name="zipCode" type="text" placeholder="Enter your zipcode" />
        </div>
      </div>


    </Form>
  );
};

export default UserManagementForm;
