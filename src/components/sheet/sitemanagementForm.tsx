import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import FormInput from '../common/FormInput.tsx';
import MapComponent from '../common/map/GoogleMap.tsx';
import RequiredLabel from '../common/RequiredLabel.tsx';
import { AppDispatch, RootState } from '../../store/store.ts';
import { useDispatch, useSelector } from 'react-redux';
import { createSite } from '../../slices/SiteManagementSlice.ts';
import dayjs from 'dayjs';





const SiteManagementForm = ( {handleChange, values, touched, errors, setFieldValue,initialValues} ) => {
  // const [siteManagerMaster, setSiteManagerMaster] = useState<any[]>([]);
  const [selectedSiteManager, setSelectedSiteManager] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();

  const { siteManagerMaster } = useSelector((state: RootState) => state.MasterSlice);

  const siteManagerOptions = siteManagerMaster
    ?.filter(manager => manager.id !== null) // Filter out any managers with null id
    .map((manager) => ({
      value: manager.id,  // Assuming `id` is the unique identifier
      label: manager.managerName, // Assuming `managerName` is the field to display
      key: manager.id // Ensure this is unique
    })) ?? [];

  // Add this to handle form population in edit mode
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
    <Form>
      <p className='text-[#0F44BE] mb-3'>SITE INFORMATION</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <RequiredLabel>Site Name</RequiredLabel>
          <FormInput
            name="sitename"
            type="text"
            placeholder="Enter Site Name"
            onChange={handleChange}
            value={values?.sitename || ''}
            error={touched?.sitename && errors?.sitename}
          />
        </div>
        <div>
          <RequiredLabel>Operational Since</RequiredLabel>
          <FormInput
              name="operationalSince"
              type="date"
              placeholder="Select Operational Since"
              onChange={(e) => {
                const selectedDate = e.target.value; // Get the selected date
                // Ensure the date is in ISO format
                setFieldValue("operationalSince", selectedDate);
              }}
              value={values.operationalSince}
              error={touched.operationalSince && typeof errors.operationalSince === 'string' ? errors.operationalSince : undefined}
            />
    
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <RequiredLabel>Site Owner Name</RequiredLabel>
          <FormInput
            name="siteownername"
            type="text"
            placeholder="Enter Owner Name"
            onChange={handleChange}
            value={values.siteownername}
            error={touched.siteownername && typeof errors.siteownername === 'string' ? errors.siteownername : undefined}
          />
        </div>
        <div>
        <RequiredLabel>Handover Date</RequiredLabel>
        <FormInput
            name="handOverDate"
            type="date"
            placeholder="Select Handover Date"
            onChange={(e) => {
              const selectedDate = e.target.value; // Get the selected date
              // Ensure the date is in ISO format
              setFieldValue("handOverDate", selectedDate);
            }}
            value={values.handOverDate}
            error={touched.handOverDate && typeof errors.handOverDate === 'string' ? errors.handOverDate : undefined}
            disabledDate={(current) => current && current < dayjs(values.operationalSince)}
          />

        </div>
      </div>

      <p className='text-[#0F44BE] mb-3 mt-4'>CONTACT DETAILS</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <RequiredLabel>Site Manager Name</RequiredLabel>
          <FormInput
            name="sitemanager"
            type="select"
            options={siteManagerMaster?.map((manager) => ({
              value: manager.userId,
              label: manager.managerName
            })) ?? []}
            onChange={(selectedValue) => {
              setFieldValue('sitemanager', selectedValue);
            }}
            value={values.sitemanager}
            error={touched.sitemanager && typeof errors.sitemanager === 'string' ? errors.sitemanager : undefined}
          />
        </div>
        <div>
          <RequiredLabel>Email ID</RequiredLabel>
          <FormInput
            name="email"
            type="email"
            placeholder="Enter Email"
            onChange={handleChange}
            value={values.email}
            error={touched.email && typeof errors.email === 'string' ? errors.email : undefined}
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
            error={touched.phoneNumber && typeof errors.phoneNumber === 'string' ? errors.phoneNumber : undefined}
          />
        </div>
        <div>
        <label className='font-Montserrat text-[#000000] text-base font-Montserrat weight-500'>Alternate Phone Number</label>
          <FormInput
            name="alternatePhoneNumber"
            type="text"
            placeholder="Enter Alternate Number"
            onChange={handleChange}
            value={values.alternatePhoneNumber}
            error={touched.alternatePhoneNumber && typeof errors.alternatePhoneNumber === 'string' ? errors.alternatePhoneNumber : undefined}
          />
        </div>
      </div>

      <p className='text-[#0F44BE] mb-3 mt-4'>ADDRESS DETAILS</p>
      <div className='mt-4'>
        <div className="mt-4">
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <RequiredLabel>Selected Address</RequiredLabel>
              <FormInput
                name="address"
                type="text"
                placeholder="Enter Address"
                onChange={handleChange}
                value={values.address}
                error={touched.address && typeof errors.address === 'string' ? errors.address : undefined}
              />
            </div>
            <div>
              <RequiredLabel>City</RequiredLabel>
              <FormInput
                name="city"
                type="text"
                placeholder="Enter City"
                onChange={handleChange}
                value={values.city}
                error={touched.city && typeof errors.city === 'string' ? errors.city : undefined}
              />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4 mt-4'>
            <div>
              <RequiredLabel>State</RequiredLabel>
              <FormInput
                name="state"
                type="text"
                placeholder="Enter State"
                onChange={handleChange}
                value={values.state}
                error={touched.state && typeof errors.state === 'string' ? errors.state : undefined}
              />
            </div>
            <div>
              <RequiredLabel>zipcode</RequiredLabel>
              <FormInput
                name="zipcode"
                type="text"
                placeholder="Enter zipcode"
                onChange={handleChange}
                value={values.zipcode}
                error={touched.zipcode && typeof errors.zipcode === 'string' ? errors.zipcode : undefined}
              />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4 mt-4'>
            <div>
              <RequiredLabel>Latitude</RequiredLabel>
              <FormInput
                name="latitude"
                type="text"
                placeholder="Enter Latitude"
                onChange={handleChange}
                value={values.latitude}
                error={touched.latitude && typeof errors.latitude === 'string' ? errors.latitude : undefined}
                disabled={true}
              />
            </div>
            <div> 
              <RequiredLabel>Longitude</RequiredLabel>
              <FormInput
                name="longitude"
                type="text"
                placeholder="Enter Longitude"
                onChange={handleChange}
                value={values.longitude}
                error={touched.longitude && typeof errors.longitude === 'string' ? errors.longitude : undefined}
                disabled={true}
              />
            </div>
          </div>
        </div>
        <div className='mt-4'>
          <MapComponent
            onLocationSelect={(location) => {
              setFieldValue("address", location.address);
              setFieldValue("city", location.city);
              setFieldValue("state", location.state);
              setFieldValue("zipcode", location.zipcode);
              setFieldValue("latitude", location.lat.toString());
              setFieldValue("longitude", location.lng.toString());
            }}
            initialLat={Number(values.latitude) || undefined}
            initialLng={Number(values.longitude) || undefined}
          />
        </div>
      </div>

    </Form>
  );
};

export default SiteManagementForm;
