import React, { useEffect, useRef, useState } from "react";
import { Switch, Button, Breadcrumb, Divider } from "antd";
import { Layout } from "antd";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CustomTable from "../../components/common/Table.tsx";
import SideSheet from "../../components/common/Sidesheet.tsx";
import SiteManagementForm from "../../components/sheet/sitemanagementForm.tsx";
import { notification } from 'antd';
import { getSitebyId, setOffset, updateSitebyId, updateUserData } from "../../slices/SiteManagementSlice.ts";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import * as yup from "yup";
import { Formik } from "formik";
import { getAllSiteManager } from "../../slices/MasterSlice.ts";
import { ISiteReq, ISiteRes } from "../../types/type.ts";
import { getAllMaterialListMaster } from "../../slices/MaterialListMasterSlice.ts";
import Confirmation from "../../components/common/Confirmation.tsx";
import { SiteType } from "../../types/enum.ts";
import { setBreadcrumbs } from "../../slices/BreadcrumbSlice.ts";
import { LeftOutlined } from "@ant-design/icons";
const { Content } = Layout;

interface TowerData {
  id: string;
  name: string;
  date: string;
  status: string;
}

const SiteManagementPreview = () => {
  const { siteId } = useParams() as { siteId: string };
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSite, towers } = location.state || {};
  const [isSideSheetOpen, setSideSheetOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => Promise<void>) | null>(null);
  const dispatch = useDispatch<AppDispatch>()
  const { getSitebyIdvalue } = useSelector((state: RootState) => state.siteManagement);
  const [activeToggle, setActiveToggle] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("Do you want to submit the form?");
  useEffect(() => {
    setActiveToggle(getSitebyIdvalue?.isActive)
  }, [getSitebyIdvalue?.isActive])

  useEffect(() => {
    // Only set breadcrumbs for the detail page
    dispatch(setBreadcrumbs([
      {
        title: 'Site Management',
        path: '/site-management'
      },
      {
        title: getSitebyIdvalue?.siteName || 'Site Details',
        path: ''
      }
    ]));

  }, [getSitebyIdvalue?.siteName]);

  const handleStatusChange = () => {
    if (getSitebyIdvalue?.id) {
      const siteId = Number(getSitebyIdvalue.id);
      const newStatus = !activeToggle;
      setIsConfirmationOpen(true);
      setConfirmationMessage(`Are you sure want to ${activeToggle ? "deactivate" : "activate"} this site?`);

      setConfirmAction(() => async () => {
        try {
          await dispatch(updateUserData({ 
            siteId, 
            values: { isActive: newStatus }
          })).unwrap();
          dispatch(getSitebyId({ id: Number(siteId) }));
          notification.success({
            message: `Site ${newStatus ? 'activated' : 'deactivated'} successfully`,
            placement: 'top'
          });
        } catch (error) {
          notification.error({
            message: `${error}`,
            placement: 'top'
          });
        } finally {
          setIsConfirmationOpen(false);
        }
      });
    } else {
      notification.error({ 
        message: 'Site ID is missing',
        placement: 'top'
      });
    }
  };

  useEffect(() => {
    dispatch(getSitebyId({ id: Number(siteId) }))
    dispatch(getAllSiteManager())
  }, [siteId])

  const initialValues = {
    sitename: getSitebyIdvalue?.siteName,
    email: getSitebyIdvalue?.emailId,
    operationalSince: getSitebyIdvalue?.operationalSince ? new Date(getSitebyIdvalue.operationalSince).toISOString().split('T')[0] : "",
    siteownername: getSitebyIdvalue?.siteOwnerName,
    sitemanager: getSitebyIdvalue?.userId,
    alternatePhoneNumber: getSitebyIdvalue?.alternatePhoneNumber,
    phoneNumber: getSitebyIdvalue?.phoneNumber,
    isActive: true,
    handOverDate: getSitebyIdvalue?.handOverDate ? new Date(getSitebyIdvalue.handOverDate).toISOString().split('T')[0] : "",
    city: getSitebyIdvalue?.city,
    state: getSitebyIdvalue?.state,
    zipcode: getSitebyIdvalue?.zipcode,
    address: getSitebyIdvalue?.siteAddress,
    latitude: getSitebyIdvalue?.latitude,
    longitude: getSitebyIdvalue?.longitude,
  };

  const columns = [
    { title: <span className="font-Montserrat text-sm text-[#6D6D6D]">Tower Id</span>,
      dataIndex: "id",
      key: "id" },

    { title: <span className="font-Montserrat text-sm text-[#6D6D6D]">Tower Name</span>,
      dataIndex: "towerName",
      key: "name",
      render: (text: string) => (
        <span className="font-Montserrat text-sm text-[#000000] capitalize">{text}</span>
      ),
    },
    {
      title: <span className="font-Montserrat text-sm text-[#6D6D6D]">Date of Creation</span>,
      dataIndex: "originDate",
      key: "originDate", 
      render: (originDate: string) => (
        <span className="font-Montserrat text-sm text-[#000000]">
          {new Date(originDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      title: <span className="font-Montserrat text-sm text-[#6D6D6D]">Status</span>,
      dataIndex: "isActive",
      key: "status",
      render: (text: boolean) => (
        <span className={`font-semibold ${text ? "text-green-600" : "text-red-600"}`}>
          {text ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];
  const navigateToList = () => {
    navigate('/site-management')
  }

  const formikRef = useRef(null);

  const siteManagementSchema = yup.object().shape({
    sitename: yup.string().required("Site Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: yup.string().required("Phone Number is required"),
    alternatePhoneNumber: yup.string().required("Alternate Contact is required"),
    operationalSince: yup.string().required("Operational Since is required"),
    siteownername: yup.string().required("Site Owner Name is required"),
    sitemanager: yup.string().nullable(),
    isActive: yup.boolean().required("Status is required"),
    handoverdate: yup.string().nullable().matches(/^\d{4}-\d{2}-\d{2}$/, "HandOverDate must be a valid ISO 8601 date string"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    zipcode: yup.string().required("zipcode should not be empty"),
    address: yup.string().required("Address is required"),
    latitude: yup.string().nullable(),
    longitude: yup.string().nullable(),
  });

  return (
    <Content className="relative flex flex-col bg-[#EDF1F6] items-center w-full py-4">
      <div className="flex justify-between h-[50px] w-full bg-white items-center px-4 mb-4 rounded-md">
        <div className="flex items-center gap-2">
          {/* <button 
            className="text-gray-500 hover:text-gray-700 font-Montserrat text-sm" 
            onClick={() => navigateToList()}
          >
            &lt; Back
          </button> */}
           <LeftOutlined
              className="cursor-pointer text-[#444444]"
              onClick={() => navigateToList()}            />
              <p className="font-Montserrat text-sm text-[#444444]">Back</p>
        </div>
        
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={siteManagementSchema}
          enableReinitialize={true}
          onSubmit={async (values, { resetForm }) => {}}
        >
          {({ handleSubmit, values, touched, errors, setFieldValue, handleChange, resetForm }) => (
            <SideSheet
              btnLabel="Edit Details"
              width={800}
              title="Edit Details"
              isOpen={isSideSheetOpen}
              setOpen={setSideSheetOpen}
              btnClassName="bg-white text-black border border-gray-200 hover:bg-gray-50"
              onCancel={() => {
                setSideSheetOpen(false);
                resetForm();
              }}
              onSubmit={() => {
                setConfirmationMessage("Do you want to update the form?");
                setIsConfirmationOpen(true);
                setConfirmAction(() => async () => {
                  const data = {
                    id: Number(siteId),
                    siteName: values.sitename,
                    emailId: values.email,
                    operationalSince: values.operationalSince,
                    siteOwnerName: values.siteownername,
                    siteManagerName: values.sitemanager,
                    userId: values.sitemanager,
                    alternatePhoneNumber: values.alternatePhoneNumber,
                    phoneNumber: values.phoneNumber,
                    isActive: values.isActive,
                    handOverDate: values.handOverDate,
                    city: values.city,
                    state: values.state,
                    zipcode: values.zipcode,
                    siteAddress: values.address,
                    latitude: values.latitude,
                    longitude: values.longitude,
                  }
                  dispatch(updateSitebyId(data))
                    .then(() => {
                      setSideSheetOpen(false);
                      resetForm();
                      notification.success({
                        message: 'Site updated successfully',
                        placement: 'top'
                      });
                      dispatch(getSitebyId({ id: Number(siteId) }))
                    })
                    .catch((error) => {
                      notification.error({
                        message: 'Failed to update site',
                        placement: 'top'
                      });
                    });
                  setIsConfirmationOpen(false);
                });
              }}
              submitLabel="Update"
            >
              <SiteManagementForm
                handleChange={handleChange}
                values={values}
                touched={touched}
                errors={errors}
                setFieldValue={setFieldValue}
                initialValues={initialValues}
              />
            </SideSheet>
          )}
        </Formik>
      </div>

      <div className="w-full bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img src="/assets/Icon.svg" alt="siteicon" className="w-12 h-12 bg-gray-200 rounded-full p-1" />
            <div>
              <h2 className="text-2xl font-Montserrat text-[#104E70] capitalize">{getSitebyIdvalue?.siteName}</h2>
              {/* <p className="text-gray-500 text-sm">{getSitebyIdvalue?.id}</p> */}
            </div>
          </div>
          
          {getSitebyIdvalue?.id != SiteType.HO && (
            <div className="flex items-center gap-3">
              <span className={`font-semibold ${getSitebyIdvalue?.isActive ? "text-green-600" : "text-red-600"}`}>
                {getSitebyIdvalue?.isActive ? "Active" : "Inactive"}
              </span>
              <Switch
                checked={activeToggle}
                onChange={handleStatusChange}
                style={{ backgroundColor: activeToggle ? "#008000" : "#E9E9EA" }}
              />
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-[#0F44BE] font-Montserrat text-base font-semibold mb-[5px]">CONTACT DETAILS</h3>
          <Divider className="my-0"  />
          <div className="grid grid-cols-2 gap-6 mt-[15px]">
            <div className="flex items-start">
              <span className="text-gray-500 w-48 font-Montserrat">Contact Person Name</span>
              <span className="font-semibold capitalize">{getSitebyIdvalue?.userName}</span>
            </div>
            <div className="flex items-start">
              <span className="text-gray-500 w-48 font-Montserrat">Email ID</span>
              <span className="font-semibold">{getSitebyIdvalue?.emailId}</span>
            </div>
            <div className="flex items-start">
              <span className="text-gray-500 w-48 font-Montserrat font-Montserrat">Phone Number</span>
              <span className="font-semibold">{getSitebyIdvalue?.phoneNumber}</span>
            </div>
            <div className="flex items-start">
              <span className="text-gray-500 w-48 font-Montserrat">Alternate Contact Number</span>
              <span className="font-semibold">{getSitebyIdvalue?.alternatePhoneNumber}</span>
            </div>
          </div>
        </div>

        <div className="p-6  border-gray-100">
          <h3 className="text-[#0F44BE] font-Montserrat text-base font-semibold mb-[5px] ">ADDRESS DETAILS</h3>
          <Divider className="my-0"  />
          <div className="grid grid-cols-2 gap-6 mt-[15px]">
            <div className="flex items-start">
              <span className="text-gray-500 w-48 font-Montserrat">Registered Address</span>
              <span className="font-semibold break-words mr-2 w-[400px]">{getSitebyIdvalue?.siteAddress}</span>
            </div>
            <div className="flex items-start">
              <span className="text-gray-500 w-48 font-Montserrat">City</span>
              <span className="font-semibold">{getSitebyIdvalue?.city}</span>
            </div>
            <div className="flex items-start">
              <span className="text-gray-500 w-48 font-Montserrat">State</span>
              <span className="font-semibold">{getSitebyIdvalue?.state}</span>
            </div>
            <div className="flex items-start">
              <span className="text-gray-500 w-48 font-Montserrat">Zip Code</span>
              <span className="font-semibold">{getSitebyIdvalue?.zipcode}</span>
            </div>
            <div className="flex items-start">
              <span className="text-gray-500 w-48 font-Montserrat">Latitude</span>
              <span className="font-semibold">{getSitebyIdvalue?.latitude}</span>
            </div>
            <div className="flex items-start">
              <span className="text-gray-500 w-48 font-Montserrat">Longitude</span>
              <span className="font-semibold">{getSitebyIdvalue?.longitude}</span>
            </div>
          </div>
        </div>

        <div className="p-6 border-gray-100">
          <h3 className="text-[#0F44BE] font-Montserrat text-base font-semibold mb-[5px]">TOWER DETAILS</h3>
          <Divider className="my-0"  />
          <div className="mt-[15px]">
            <CustomTable
              columns={columns}
              dataSource={towers}
              loading={false}
              rowKey="id"
              className="cursor-pointer"
              scrollHeight={400}
            />
          </div>
        </div>
      </div>

      <Confirmation
        label="Confirmation"
        message={confirmationMessage}
        isOpen={isConfirmationOpen}
        onClose={() => {
          setIsConfirmationOpen(false);
          setConfirmAction(null);
        }}
        onConfirm={confirmAction || (() => {})}
        confirmButtonLabel="Confirm"
      />
    </Content>
  );
};

export default SiteManagementPreview;
