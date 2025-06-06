import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store.ts";
import {
  fetchMaterialCategories,
  addMaterialCategory,
  updateMaterialCategory,
  updateStatus,
} from "../../slices/MaterialCategorySlice.ts";
import Searchbar from "../../components/common/Searchbar.tsx";
import SideSheet from "../../components/common/Sidesheet.tsx";
import CustomTable from "../../components/common/Table.tsx";
import { Pagination, Switch } from "antd";
import * as yup from "yup";
import { Formik, Form, useFormik } from "formik";
import FormInput from "../../components/common/FormInput.tsx";
import { Image } from "antd";
import { ICategory } from "../../types/type.ts";
import Confirmation from "../../components/common/Confirmation.tsx";
import { notification } from "antd";
import { capitalizeFirstLetter } from "../../utils/util.service.ts";
import { setOffset, setLimit, setSortField, setSortOrder } from "../../slices/MaterialCategorySlice.ts";
import RequiredLabel from "../../components/common/RequiredLabel.tsx";
import { setBreadcrumbs } from "../../slices/BreadcrumbSlice.ts";
const MaterialCategoryMaster = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { dataCount, offset, limit, categories, loading } = useSelector((state: RootState) => state.materialCategory);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const [query, setQuery] = useState("");
  const [isSideSheetOpen, setSideSheetOpen] = useState(false);
  const [toggleState, setToggleState] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState("Do you want to submit the form?");
  const [sortedData, setSortedData] = useState<ICategory[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    order: "ascend" | "descend" | null;
  }>({
    key: "",
    order: null,
  });


  useEffect(() => {
    dispatch(setBreadcrumbs([
      {
        title: "Material Category Masters",
        path: '/material-category-master',
        
      }
    ]));

  }, [dispatch]);


  useEffect(() => {
    dispatch(fetchMaterialCategories({ 
      searchInput: query,
       offset:offset, 
       limit:limit, 
       sortField: sortConfig.key ?? null, 
       sortOrder: sortConfig.order && sortConfig.order === 'ascend' ? 1 : sortConfig.order === 'descend' ? -1 : null
      }));
  }, [dispatch, query, offset, limit, sortConfig]);

  const totalPages = Math.ceil(dataCount / limit);
  const showNotification = (type: "success" | "error", message: string) => {
    notification[type]({
      message,
      placement: "top",
    });
  };

  useEffect(() => {
        if (categories.length > 0) {
      setToggleState(
        categories.reduce((acc, item) => {
          acc[item.materialTypeId] = item.isActive;
          return acc;
        }, {} as { [key: number]: boolean })
      );
    }
  }, [categories]);

  const onSwitchClick = (id: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setConfirmationMessage(`Are you sure want to ${newStatus ? "activate" : "deactivate"} this category?`);
    
    setConfirmAction(() => async () => {
      try {
        await dispatch(
          updateStatus({ materialTypeId: id, isActive: newStatus })
        ).unwrap();
        setToggleState((prev) => ({ ...prev, [id]: newStatus }));
        dispatch(fetchMaterialCategories({ 
          searchInput: query,
           offset:offset, 
           limit:limit, 
           sortField: sortConfig.key, 
           sortOrder: sortConfig.order === 'ascend' ? 1 : sortConfig.order === 'descend' ? -1 : 1 
          }));
        showNotification(
          "success",
          `Category ${newStatus ? "activated" : "deactivated"} successfully.`
        );
      } catch (error) {
        showNotification("error",error);
      }
      setIsConfirmationOpen(false);
    });
    
    setIsConfirmationOpen(true);
  };

  const handleEditClick = (category: ICategory) => {
    setSelectedCategory(category);
    setSideSheetOpen(true);
  };

  const handleSearch = (value: string) => {
    setQuery(value);
    dispatch(setOffset(0));
  };

  const handlePaginationChange = (page: number, newPageSize?: number) => {
    
      dispatch(setOffset(page -1));
    if (newPageSize && newPageSize !== limit) {
      dispatch(setLimit(newPageSize));
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

  const columns = [
    {
      title: <span className="font-montserrat font-medium text-[13px] leading-5 tracking-normal text-[#6D6D6D] capitalize">S.No</span>,
      dataIndex: "serialNumber",
      key: "serialNumber",
      render: (_: any, __: any, index: number) =>
        (offset * limit + index + 1).toString().padStart(2, "0"),
      width: 50,
    },

    {
      title: <span className="font-montserrat font-medium text-[13px] leading-5 tracking-normal text-[#6D6D6D] capitalize">Material Category Name</span>,
      dataIndex: "materialtypeName",
      key: "materialtypeName",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      sortOrder:
        sortConfig.key === "materialtypeName" ? sortConfig.order : null,
      render: (materialtypeName: string) =>
        capitalizeFirstLetter(materialtypeName),
    },
    {
      title: <span className="font-montserrat font-medium text-[13px] leading-5 tracking-normal text-[#6D6D6D] capitalize">Date of Creation</span>,
      dataIndex: "createdOn",
      key: "createdOn",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      sortOrder: sortConfig.key === "createdOn" ? sortConfig.order : null,
      render: (createdOn: string) =>
        new Date(createdOn).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },

    {
      title: <span className="font-montserrat font-medium text-[13px] leading-5 tracking-normal text-[#6D6D6D] capitalize">Status</span>,
      dataIndex: "isActive",
      key: "isActive",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      sortOrder: sortConfig.key === "isActive" ? sortConfig.order : null,
      render: (_: any, record: any) => (
        <div className="flex items-center justify-between w-[120px]">
          <span
            className={`transition-colors duration-300 ${
              toggleState[record.materialTypeId] ? "text-[#008000]" : "text-gray-500"
            }`}
          >
            {toggleState[record.materialTypeId] ? "Active" : "Inactive"}
          </span>
          <Switch
            checked={toggleState[record.materialTypeId]}
            onClick={() => onSwitchClick(record.materialTypeId, toggleState[record.materialTypeId])}
            style={{
              backgroundColor: toggleState[record.materialTypeId] ? "#008000" : "#d9d9d9",
              transition: "background-color 0.3s ease-in-out",
            }}
          />
          <div>
            <Image
              width={19}
              height={19}
              src="/EditIcon.svg"
              preview={false}
              className="ml-[45px] cursor-pointer"
              onClick={() => handleEditClick(record)}
            />
          </div>
        </div>
      ),
    },
  ];

  const validationSchema = yup.object({
    materialtypeName: yup
    .string()
    .required("category name is required")
    .min(2, "category name must be at least 2 characters")
    .max(50, "category name must not exceed 50 characters")
    .matches(
      /^(?![0-9]+$)[a-zA-Z0-9 _-]+$/, 
      "Category name can only contain letters, numbers, spaces, underscores (_), hyphens (-), and cannot be empty."),
});

  return (
    <>
      <div className="flex flex-col h-[94vh] overflow-hidden">
      <div className="flex justify-between items-center mb-1 mt-[10px]">

      <p className="font-semibold text[#0A0A0A] text-[20px] pl-2 ">
          Material Category Masters
        </p>
        <div className="flex gap-4 p-4 ">
        <Searchbar search={query} onSearch={handleSearch} />

          <Formik
            enableReinitialize
            initialValues={{
              materialtypeName: capitalizeFirstLetter(selectedCategory?.materialtypeName || ""),
            }}
            validationSchema={validationSchema}
            validateOnChange={true}
            validateOnBlur={false}
            onSubmit={(values, { resetForm }) => {
              setConfirmationMessage(selectedCategory ? "Do you want to Update the form?" : "Do you want to submit the form?");
              setIsConfirmationOpen(true);
              setConfirmAction(() => async () => {
                try {
                  if (selectedCategory) {
                    try{
                      await dispatch(
                        updateMaterialCategory({
                          materialTypeId: selectedCategory.materialTypeId,
                          materialtypeName: values.materialtypeName,
                        })
                      ).unwrap().then((res)=>{
                        showNotification(
                          "success",
                          "Category updated successfully."
                        );
                      })
                    }
                    catch(error){
                      showNotification("error", error);
                    }
                    setSelectedCategory(null);
                  } else {
                    try{
                      await dispatch(addMaterialCategory(values)).unwrap().then((res)=>{
                        showNotification("success", "Category added successfully.");
                      })
                    }
                    catch(error){
                      showNotification("error", error);
                    }
                  }
                  dispatch(fetchMaterialCategories({
                    searchInput: query,
                    offset: offset,
                    limit: limit,
                    sortField: "",
                    sortOrder: null
                  }));
                  resetForm();
                  setSideSheetOpen(false);
                } catch (error) {
                  showNotification("error", "Operation failed.");
                }
                setIsConfirmationOpen(false);
              });
            }}
          >
            {({
              handleSubmit,
              resetForm,
              values,
              errors,
              touched,
              handleChange,
              setFieldTouched, // <-- This comes from Formik
              validateField,
            }) => {
              return (
                <SideSheet
                  btnLabel="Add Category"
                  width={443}
                  title={
                    selectedCategory
                      ? "Edit Material Type"
                      : "Add Material Type"
                  }
                  isOpen={isSideSheetOpen}
                  setOpen={setSideSheetOpen}
                  onSubmit={handleSubmit}
                  submitLabel={selectedCategory ? "update" : "submit"}
                  onCancel={() => {
                    setSideSheetOpen(false);
                    resetForm();
                    setSelectedCategory(null);
                  }}
                >
                  <Form>
                    <div className="mb-8">
                      <RequiredLabel>Category Name</RequiredLabel>
                      <div>
                        <FormInput
                          name="materialtypeName"
                          type="text"
                          placeholder="Enter category name"
                          onChange={(e) => {
                            handleChange(e);
                            setFieldTouched("materialtypeName", true, false);
                            validateField("materialtypeName");
                          }}
                          value={values.materialtypeName}
                          error={
                            touched.materialtypeName && errors.materialtypeName
                              ? errors.materialtypeName
                              : ""
                          }
                        />
                      </div>
                    </div>
                  </Form>
                </SideSheet>
              );
            }}
          </Formik>
        </div>
        </div>
      

      {/* {loading && <div>Loading...</div>} */}

     
        <div className="flex flex-col h-[85vh]">
          <div className="flex-1 ">
            <CustomTable<ICategory>
              columns={columns}
              dataSource={categories}
                loading={loading}
              rowKey="materialTypeId"
              onChange={handleSortChange}
            />
          </div>
          <div className=" sticky bottom-0 flex justify-end py-4">
            <Pagination
              total={dataCount}
              showSizeChanger={false}
              onChange={handlePaginationChange}
            />
          </div>
        </div>

      <Confirmation
        label="Confirmation"
        message={confirmationMessage}
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={confirmAction || (() => {})}
        confirmButtonLabel="Confirm"
      />
      </div>
    </>
  );
};

export default MaterialCategoryMaster;
