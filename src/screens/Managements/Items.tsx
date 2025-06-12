import React, { useEffect, useState, useRef } from 'react';
import * as yup from "yup";
import CustomTable from '../../components/common/Table.tsx';
import Searchbar from '../../components/common/Searchbar.tsx';
import SideSheet from '../../components/common/Sidesheet.tsx';
import { Formik, FormikProps } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import RequiredLabel from '../../components/common/RequiredLabel.tsx';
import Confirmation from '../../components/common/Confirmation.tsx';
import { notification, Pagination } from 'antd';
import MapComponent from '../../components/common/map/GoogleMap.tsx';
import { createSite, getAllSites, fetchTowers, updateSite, setOffset, setLimit, setSortField, setSortOrder, setSearchInput } from '../../slices/SiteManagementSlice.ts';
import { useNavigate, useLocation } from 'react-router-dom';
import { ISiteAPIPayload, ISiteRes, ISiteResponse, ITowerManagement } from '../../types/type.ts';
import SiteManagementForm from '../../components/sheet/sitemanagementForm.tsx';
import { ISiteReq } from '../../types/type.ts';
import { getAllSiteManager } from '../../slices/MasterSlice.ts';
import { capitalizeFirstLetter } from '../../utils/util.service.ts';
import { setBreadcrumbs } from '../../slices/BreadcrumbSlice.ts';


interface UserFormValues {
  id: number;
  siteName: string;
  operationalSince: string;
  ownershipType?: string;
  siteOwnerName: string;
  siteManagerName: string;
  emailId: string;
  phoneNumber: string;
  alternatePhoneNumber: string;
  siteAddress: string;
  city: string;
  state: string;
  pincode: string;
  latitude: string;
  longitude: string;
}


const Items: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [isSideSheetOpen, setSideSheetOpen] = useState(false);
  const { sites, loading, dataCount, offset, limit } = useSelector((state: RootState) => state.siteManagement);
  const [sortedData, setSortedData] = useState<UserFormValues[]>([]);
  const [selectedSite, setSelectedSite] = useState<number | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState("Do you want to submit the form?");
  const { getSitebyIdvalue } = useSelector((state: RootState) => state.siteManagement);

  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<UserFormValues | null>(
    null
  );
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    order: "ascend" | "descend" | null;
  }>({
    key: "",
    order: null,
  });



  const initialValues: ISiteReq = {
    sitename: "",
    email: "",
    // sitecontact: "",
    operationalSince: "",
    siteownername: "",
    sitemanager: "",
    phoneNumber: "",
    alternatePhoneNumber: "",
    handOverDate: "",
    city: "",
    state: "",
    zipcode: null,
    address: "",
    latitude: "",
    longitude: "",
  };

  const showNotification = (type: "success" | "error", message: string) => {
    notification[type]({
      message,
      placement: "top",
    });
  };
  const handleSearch = (value: string) => {
    setQuery(value);
    dispatch(setOffset(0));
  };

  const handlePaginationChange = (page: number, newPageSize?: number) => {

    dispatch(setOffset(page - 1));
    if (newPageSize && newPageSize !== limit) {
      dispatch(setLimit(newPageSize));
    }
  };

  const handleRowClick = (site: ISiteRes) => {
    try {
      setSelectedSite(site.siteId);
      // setSideSheetOpen(true);

      // First fetch the towers
      dispatch(fetchTowers({ siteId: site.siteId }))
        .then((response) => {
          if (response.payload && typeof response.payload !== 'string') {
            const towerData = response.payload.data || [];

            // Only navigate after towers are fetched successfully
            navigate(`/site-management-preview/${site.siteId}`, {
              state: {
                selectedSite: site,
                towers: towerData
              },
              replace: true
            });
          } else {
            console.error('Invalid tower data response:', response);
            showNotification("error", "Failed to fetch tower data");
          }
        })
        .catch((error) => {
          console.error('Error fetching towers:', error);
          showNotification("error", "Failed to fetch tower data");
        });
    } catch (error) {
      showNotification("error", "Navigation failed");
    }
  };

  const handleSortChange = (_: any, __: any, sorter: any) => {
    if (Array.isArray(sorter)) {
      sorter = sorter[0];
    }

    const { field, order } = sorter || {};

    const sortOrder = order === 'ascend' ? 1 : -1;

    setSortConfig({
      key: field || null,
      order: order || null
    });

    dispatch(setSortField(field));
    dispatch(setSortOrder(sortOrder));

    dispatch(setOffset(offset));
  };


  useEffect(() => {
    dispatch(getAllSiteManager());
    dispatch(getAllSites({
      offset: offset,
      limit: limit,
      sortField: sortConfig.key ?? null,
      sortOrder: sortConfig.order && sortConfig.order === 'ascend' ? 1 : sortConfig.order === 'descend' ? -1 : null,
      searchInput: query
    }));
  }, [dispatch, offset, limit, sortConfig, query]);

  useEffect(() => {
    dispatch(getAllSiteManager());
  }, []);

  useEffect(() => {
    if (selectedSite) {
      dispatch(fetchTowers({ siteId: selectedSite }));
    }
  }, [dispatch, selectedSite]);

  useEffect(() => {
    if (location.state?.editMode && location.state?.siteData) {
      const siteData = location.state.siteData;
      setSelectedSite(siteData.siteId);
      setSideSheetOpen(true);

      setTimeout(() => {
        if (formikRef.current) {
          formikRef.current.setValues({
            sitename: siteData.sitename || '',
            email: siteData.email || '',
            // sitecontact: siteData.sitecontact || '',
            operationalSince: siteData.operationalsince || '',
            siteownername: siteData.siteownername || '',
            sitemanager: siteData.sitemanager || '',
            phoneNumber: siteData.phoneNumber || '',
            alternatePhoneNumber: siteData.alternatePhoneNumber || '',
            handOverDate: siteData.handOverDate || '',
            city: siteData.city || '',
            state: siteData.state || '',
            zipcode: +siteData.zipcode || null,
            address: siteData.address || '',
            latitude: siteData.latitude || '',
            longitude: siteData.longitude || '',
          });
        }
      }, 0);
    }
  }, [location.state]);

  useEffect(() => {
    dispatch(setBreadcrumbs([
      {
        title: "Items Management",
        path: '/items'
      }
    ]));
  }, []);

  const columns = [
    {
      title: <span className="text-[#6D6D6D]">S.No</span>,
      dataIndex: 'siteId',
      key: 'siteId',
      render: (_: any, __: any, index: number) =>
        (offset * limit + index + 1).toString().padStart(2, "0"),
      width: 80,
    },
    {
      title: <span className="text-[#6D6D6D]">Site Name</span>,
      dataIndex: 'siteName',
      key: 'siteName',
      sorter: true,
      sortDirections: ["ascend", "descend"],
      sortOrder: sortConfig.key === "siteName" ? sortConfig.order : null,
      render: (siteName: string) => <span className="text-[#0A0A0A] font-medium text-sm">{capitalizeFirstLetter(siteName)}</span>,
    },
    {
      title: <span className="text-[#6D6D6D]">Site Manager</span>,
      dataIndex: 'siteManager',
      key: 'siteManager',
      sorter: true,
      sortDirections: ["ascend", "descend"],
      sortOrder: sortConfig.key === "siteManager" ? sortConfig.order : null,
      render: (siteManager: string | null) =>
        siteManager ? <span className="text-[#0A0A0A] font-medium text-sm">{capitalizeFirstLetter(siteManager)}</span> : '-'
    },
    {
      title: <span className="text-[#6D6D6D]">Contact Number</span>,
      dataIndex: 'siteContact',
      key: 'siteContact',
      sorter: true,
      sortDirections: ["ascend", "descend"],
      sortOrder: sortConfig.key === "siteContact" ? sortConfig.order : null,
      render: (siteContact: string | null) =>
        siteContact ? <span className="text-[#0A0A0A] font-medium text-sm">{siteContact}</span> : '-'
    },
    {
      title: <span className="text-[#6D6D6D]">City</span>,
      dataIndex: 'city',
      key: 'city',
      sorter: true,
      sortDirections: ["ascend", "descend"],
      sortOrder: sortConfig.key === "city" ? sortConfig.order : null,
      render: (city: string | null) =>
        city ? <span className="text-[#0A0A0A] font-medium text-sm">{capitalizeFirstLetter(city)}</span> : '-'
    },
    {
      title: <span className="text-[#6D6D6D]">Status</span>,
      dataIndex: 'isActive',
      key: 'isActive',
      sorter: true,
      sortDirections: ["ascend", "descend"],
      sortOrder: sortConfig.key === "isActive" ? sortConfig.order : null,
      // render: (record: ISiteRes) => (
      //   <span className={`font-semibold ${ record.isActive ? "text-green-600" : "text-red-600"}`}>
      //   {record.isActive ? "Active" : "Inactive"}
      // </span>
      // ),
      render: (text, record) => {
        return (
          <span className={`font-semibold ${record.isActive ? "text-green-600" : "text-red-600"}`}>
            {record.isActive ? "Active" : "Inactive"}
          </span>
        )
      }
    },
  ];

  const siteManagementSchema = yup.object().shape({
    sitename: yup.string()
      .required("Site Name is required")
      .min(3, "Site Name must be at least 3 characters long")
      .max(30, "Site Name must be less than 30 characters long")
      .matches(/^[a-zA-Z0-9 _-]+$/, "Site Name can only contain letters, spaces, and the special characters: _,-,.,spaces"),

    email: yup.string()
      .email("Invalid email")
      .required("Email is required")
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
      .max(50, "Email must be less than 50 characters long"),

    // sitecontact: yup.string()
    //   .required("Site Contact is required")
    //   .matches(/^\d{10}$/, "Invalid phone number"),
    
    operationalSince: yup.date()
      .required("Operational Since is required")
      .typeError("Invalid date format"),

    handOverDate: yup.date()
      .required("Handover Date is required")
      .min(yup.ref('operationalSince'), "Handover Date cannot be before Operational Since date")
      .typeError("Invalid date format"),


    siteownername: yup.string()
      .required("Site Owner Name is required")
      .min(3, "Site Owner Name must be at least 3 characters long")
      .max(30, "Site Owner Name must be less than 30 characters long")
      .matches(/^[a-zA-Z0-9 _-]+$/, "Site Owner Name can only contain letters, numbers, spaces, underscores (_), hyphens (-), and cannot be empty."),

    sitemanager: yup.string()
      .required("Site Manager is required"),

    // status: yup.boolean().required("Status is required"),
    // handoverdate: yup.string()
    //   .nullable()
    //   .matches(/^\d{4}-\d{2}-\d{2}$/, "HandOverDate must be a valid ISO 8601 date string"),

    phoneNumber: yup.string()
      .required("Phone Number is required")
      .matches(/^\d{10}$/, "Invalid phone number"),

    alternatePhoneNumber: yup.string()
      // .required("Alternate Phone Number is required")
      .matches(/^\d{10}$/, "Invalid phone number"),

    city: yup
      .string()
      .required("City is required")
      .min(3, "City must be at least 3 characters long")
      .max(30, "City must be less than 30 characters long")
      .matches(/^[a-zA-Z\s]+$/, "City can only contain letters and spaces"),

    state: yup
      .string()
      .required("State is required")
      .min(3, "State must be at least 3 characters long")
      .max(30, "State must be less than 30 characters long")
      .matches(/^[a-zA-Z\s]+$/, "State can only contain letters and spaces"),

    zipcode: yup
      .string()
      .required("zipcode is required")
      .matches(/^\d{6}$/, "zipcode must be exactly 6 digits"),

    address: yup
      .string()
      .required("Address is required")
      .min(3, "Address must be at least 3 characters long")
      .max(255, "Address must be less than 255 characters long")
      // .matches(
      //   /^[a-zA-Z0-9\s.,_@-]+$/,
      //   "Address can only contain letters, numbers, spaces, and (_, ., @, -, ,)"
      // )
      ,
    latitude: yup.string().required("Latitude is required"),
    longitude: yup.string().required("Longitude is required"),
  });

  const formikRef = useRef<FormikProps<ISiteReq>>(null);

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={siteManagementSchema}
      enableReinitialize={true}
      onSubmit={async (values, { resetForm }) => {
        const data = {
          siteName: values.sitename,
          emailId: values.email,
          operationalSince: values.operationalSince,
          siteOwnerName: values.siteownername,
          siteManagerName: values.sitemanager,
          userId: values.sitemanager,
          alternatePhoneNumber: values.alternatePhoneNumber,
          phoneNumber: values.phoneNumber,
          handOverDate: values.handOverDate,
          city: values.city,
          state: values.state,
          zipcode: values.zipcode,
          siteAddress: values.address,
          latitude: values.latitude,
          longitude: values.longitude,
        }
        setConfirmationMessage("Do you want to submit the form?");
        setIsConfirmationOpen(true);
        setConfirmAction(() => async () => {
          try{

            setSideSheetOpen(false);
            try {
              await dispatch(createSite(data)).unwrap().then((res)=>{

                setSideSheetOpen(false);
                resetForm();
                showNotification("success", "Site created successfully");
              }); // Await the dispatch for better error handling
            } catch (error) {
              showNotification("error", error.message);
              resetForm();
            }

            await dispatch(getAllSites({
              offset: offset,
              limit: limit,
              sortField: "",
              sortOrder: null,
              searchInput: query
            }));
            resetForm();
            setSideSheetOpen(false);
          } catch (error) {
            showNotification("error", error);
          }
          setIsConfirmationOpen(false);
        });
      }}

    >
      {({ handleSubmit, values, touched, errors, setFieldValue, handleChange, resetForm, setFieldTouched, validateField }) => (
        <>
          <div className="bg-[#EDF1F6] h-[76px] mt-[10px] flex justify-between items-center px-[20px]">
            <p className="font-Montserrat font-semibold text-[20px] leading-[24.38px] text-[#0A0A0A] ">Request Management</p>
            <div className="flex justify-end gap-3 ">
              <div className="flex justify-end ">
                <Searchbar search={query} onSearch={handleSearch} />
               
              </div>

              <SideSheet
                btnLabel={selectedSite ? "Edit Site" : "Add New Site"}
                width={800}
                title={selectedSite ? "Edit Site" : "Add New Site"}
                isOpen={isSideSheetOpen}
                setOpen={setSideSheetOpen}
                onCancel={() => {
                  setSideSheetOpen(false);
                  resetForm();
                  setSelectedSite(null);
                }}
                onSubmit={handleSubmit}
                submitLabel={selectedSite ? "Update" : "Submit"}
              >
                 {/* {JSON.stringify(formikRef)} */}
                <SiteManagementForm
                  handleChange={handleChange}
                  values={values}
                  touched={touched} 
                  errors={errors}
                  // setFieldTouched={setFieldTouched}
                  // validateField={validateField}
                  setFieldValue={setFieldValue}
                  initialValues={initialValues}
                />
              </SideSheet>
            </div>
          </div>
          <div>
            <CustomTable
              columns={columns}
              dataSource={sites}
              loading={loading}
              rowKey="siteId"
              onChange={handleSortChange}
              onRowClick={(record) => {
                handleRowClick(record);
              }}
              scrollHeight={800}
            />
          </div>
          <div className=" sticky bottom-0 flex justify-end py-4">
            <Pagination
              total={dataCount}
              showSizeChanger={false}
              onChange={handlePaginationChange}
            />
          </div>
          <Confirmation
            label="Confirmation"
            message="Do you want to submit the form?"
            isOpen={isConfirmationOpen}
            onClose={() => setIsConfirmationOpen(false)}
            onConfirm={confirmAction || (() => { })}
            confirmButtonLabel="Confirm"
          />
        </>

      )}
    </Formik>

  );
};
export default Items;