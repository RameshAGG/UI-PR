import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import FormInput from '../common/FormInput.tsx';
import MapComponent from '../common/map/GoogleMap.tsx';
import RequiredLabel from '../common/RequiredLabel.tsx';
import { AppDispatch, RootState } from '../../store/store.ts';
import { useDispatch, useSelector } from 'react-redux';
import { createSite } from '../../slices/SiteManagementSlice.ts';
import { map } from 'd3';


const VendorManagementForm = ({ handleChange, values, touched, errors, setFieldValue }) => {
  // const businessTypes = [
  //   { value: 1, label: 'Manufacturer' },
  //   { value: 2, label: 'Supplier' },
  //   { value: 3, label: 'Distributor' },
  //   { value: 4, label: 'Wholesaler' },
  // ];

  return (
    <Form>
      <p className='text-[#0F44BE] mb-2'>VENDOR INFORMATION</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <RequiredLabel>Vendor Name</RequiredLabel>
          <FormInput
            name="vendorName"
            type="text"
            placeholder="Enter Vendor Name"
            onChange={handleChange}
            value={values.vendorName}
            error={touched.vendorName && errors.vendorName}
          />
        </div>
        {/* <div>
          <RequiredLabel>Business Type</RequiredLabel>
          <FormInput
            name="businessTypeId"
            type="select"
            options={businessTypes}
            onChange={(value) => setFieldValue('businessTypeId', value)}
            value={values.businessTypeId || ''}
            error={touched.businessTypeId && errors.businessTypeId}
          />
        </div> */}
          <div>
          <RequiredLabel>PAN Number</RequiredLabel>
          <FormInput
            name="panNumber"
            type="text"
            placeholder="Enter PAN Number"
            onChange={handleChange}
            value={values.panNumber}
            error={touched.panNumber && errors.panNumber}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <RequiredLabel>GST Number / Tax ID</RequiredLabel>
          <FormInput
            name="gstOrTaxNumber"
            type="text"
            placeholder="Enter GST Number"
            onChange={handleChange}
            value={values.gstOrTaxNumber}
            error={touched.gstOrTaxNumber && errors.gstOrTaxNumber}
          />
        </div>
        {/* <div>
          <RequiredLabel>PAN Number</RequiredLabel>
          <FormInput
            name="panNumber"
            type="text"
            placeholder="Enter PAN Number"
            onChange={handleChange}
            value={values.panNumber}
            error={touched.panNumber && errors.panNumber}
          />
        </div> */}
      </div>

      <div className="mt-4">
        <RequiredLabel>Business Registration No.</RequiredLabel>
        <FormInput
          name="businessRegistrationNumber"
          type="text"
          placeholder="Enter Business Registration Number"
          onChange={handleChange}
          value={values.businessRegistrationNumber}
          error={touched.businessRegistrationNumber && errors.businessRegistrationNumber}
        />
      </div>

      <p className='text-[#0F44BE] mb-2 mt-4'>CONTACT DETAILS</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <RequiredLabel>Contact Person Name</RequiredLabel>
          <FormInput
            name="contactPersonName"
            type="text"
            placeholder="Enter Contact Person Name"
            onChange={handleChange}
            value={values.contactPersonName}
            error={touched.contactPersonName && errors.contactPersonName}
          />
        </div>
        <div>
          <RequiredLabel>Email ID</RequiredLabel>
          <FormInput
            name="emailId"
            type="email"
            placeholder="Enter Email"
            onChange={handleChange}
            value={values.emailId}
            error={touched.emailId && errors.emailId}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <RequiredLabel>Phone Number</RequiredLabel>
          <FormInput
            name="phoneNumber"
            type="text"
            placeholder="Enter Phone Number"
            onChange={handleChange}
            value={values.phoneNumber}
            error={touched.phoneNumber && errors.phoneNumber}
          />
        </div>
        <div>
          <label>Alternate Contact Number</label>
          <FormInput
            name="alternatePhoneNumber"
            type="text"
            placeholder="Enter Alternate Number"
            onChange={handleChange}
            value={values.alternatePhoneNumber}
            error={touched.alternatePhoneNumber && errors.alternatePhoneNumber}
          />
        </div>
      </div>

      <p className='text-[#0F44BE] mb-2 mt-4'>ADDRESS DETAILS</p>
      <div>
        <RequiredLabel>Registered Address</RequiredLabel>
        <FormInput
          name="address"
          type="text"
          placeholder="Enter Registered Address"
          onChange={handleChange}
          value={values.address}
          error={touched.address && errors.address}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <RequiredLabel>City</RequiredLabel>
          <FormInput
            name="city"
            type="text"
            placeholder="Enter City"
            onChange={handleChange}
            value={values.city}
            error={touched.city && errors.city}
          />
        </div>
        <div>
          <RequiredLabel>State</RequiredLabel>
          <FormInput
            name="state"
            type="text"
            placeholder="Enter State"
            onChange={handleChange}
            value={values.state}
            error={touched.state && errors.state}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <RequiredLabel>Country</RequiredLabel>
          <FormInput
            name="country"
            type="text"
            placeholder="Enter Country"
            onChange={handleChange}
            value={values.country}
            error={touched.country && errors.country}
          />
        </div>
        <div>
          <RequiredLabel>Zip Code</RequiredLabel>
          <FormInput
            name="pinCode"
            type="text"
            placeholder="Enter Zip Code"
            onChange={handleChange}
            value={values.pinCode}
            error={touched.pinCode && errors.pinCode}
          />
        </div>
      </div>
    </Form>
  );
};

export default VendorManagementForm;
