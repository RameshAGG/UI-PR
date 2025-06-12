import React from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { createPurchaseRequest } from '../slices/RequestSlice';
import { AppDispatch } from '../store';

interface Supplier {
  supplier_id?: number | null;
  name: string;
  email: string;
  mob_num: string;
  tel_num: string;
  is_new_supplier?: boolean;
}

interface RequestItem {
  item_id?: number | null;
  item_name?: string;
  category?: string;
  subcategory?: string;
  item_type: boolean;
  supplier: Supplier[];
}

interface PurchaseRequestForm {
  department: string;
  date_requested: string;
  status: string;
  items: RequestItem[];
}

interface PurchaseRequestFormProps {
  existingItems: Array<{ id: number; name: string }>;
  existingSuppliers: Array<{ id: number; name: string }>;
}

const validationSchema = Yup.object().shape({
  department: Yup.string().required('Department is required'),
  date_requested: Yup.date().required('Date is required'),
  items: Yup.array().of(
    Yup.object().shape({
      item_type: Yup.boolean().required(),
      item_id: Yup.number().when('item_type', {
        is: true,
        then: Yup.number().required('Item ID is required for existing items')
      }),
      item_name: Yup.string().when('item_type', {
        is: false,
        then: Yup.string().required('Item name is required for new items')
      }),
      category: Yup.string().when('item_type', {
        is: false,
        then: Yup.string().required('Category is required for new items')
      }),
      subcategory: Yup.string().when('item_type', {
        is: false,
        then: Yup.string().required('Subcategory is required for new items')
      }),
      supplier: Yup.array().of(
        Yup.object().shape({
          supplier_id: Yup.number().when('is_new_supplier', {
            is: false,
            then: Yup.number().required('Supplier ID is required for existing suppliers')
          }),
          name: Yup.string().when('is_new_supplier', {
            is: true,
            then: Yup.string().required('Supplier name is required')
          }),
          email: Yup.string().when('is_new_supplier', {
            is: true,
            then: Yup.string().email('Invalid email').required('Email is required')
          }),
          mob_num: Yup.string().when('is_new_supplier', {
            is: true,
            then: Yup.string().required('Mobile number is required')
          }),
          tel_num: Yup.string().when('is_new_supplier', {
            is: true,
            then: Yup.string().required('Telephone number is required')
          })
        })
      )
    })
  )
});

const PurchaseRequestForm: React.FC<PurchaseRequestFormProps> = ({ existingItems, existingSuppliers }) => {
  const dispatch = useDispatch<AppDispatch>();

  const initialValues: PurchaseRequestForm = {
    department: '',
    date_requested: new Date().toISOString().split('T')[0],
    status: 'pending',
    items: [{
      item_type: false,
      item_name: '',
      category: '',
      subcategory: '',
      supplier: [{
        name: '',
        email: '',
        mob_num: '',
        tel_num: '',
        is_new_supplier: true
      }]
    }]
  };

  const handleSubmit = async (values: PurchaseRequestForm) => {
    try {
      // Format the data according to backend expectations
      const payload = {
        ...values,
        items: values.items.map(item => ({
          ...item,
          supplier: item.supplier.map(supplier => ({
            ...supplier,
            supplier_id: supplier.is_new_supplier ? null : supplier.supplier_id
          }))
        }))
      };

      // Dispatch the createPurchaseRequest action
      const resultAction = await dispatch(createPurchaseRequest(payload));
      
      if (createPurchaseRequest.rejected.match(resultAction)) {
        // Handle error
        console.error('Failed to create purchase request:', resultAction.payload);
      } else {
        // Handle success
        console.log('Purchase request created successfully');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched }) => (
        <Form>
          {/* Basic Information */}
          <div>
            <Field name="department" type="text" placeholder="Department" />
            {errors.department && touched.department && (
              <div className="error">{errors.department}</div>
            )}
            <Field name="date_requested" type="date" />
            {errors.date_requested && touched.date_requested && (
              <div className="error">{errors.date_requested}</div>
            )}
          </div>

          {/* Items Array */}
          <FieldArray name="items">
            {({ push, remove }) => (
              <div>
                {values.items.map((item, index) => (
                  <div key={index}>
                    {/* Item Type Selection */}
                    <div>
                      <label>
                        <Field
                          type="radio"
                          name={`items.${index}.item_type`}
                          value="false"
                        />
                        New Item
                      </label>
                      <label>
                        <Field
                          type="radio"
                          name={`items.${index}.item_type`}
                          value="true"
                        />
                        Existing Item
                      </label>
                    </div>

                    {/* Item Fields */}
                    {!item.item_type ? (
                      // New Item Fields
                      <div>
                        <Field
                          name={`items.${index}.item_name`}
                          placeholder="Item Name"
                        />
                        {errors.items?.[index]?.item_name && touched.items?.[index]?.item_name && (
                          <div className="error">{errors.items[index].item_name}</div>
                        )}
                        <Field
                          name={`items.${index}.category`}
                          placeholder="Category"
                        />
                        {errors.items?.[index]?.category && touched.items?.[index]?.category && (
                          <div className="error">{errors.items[index].category}</div>
                        )}
                        <Field
                          name={`items.${index}.subcategory`}
                          placeholder="Subcategory"
                        />
                        {errors.items?.[index]?.subcategory && touched.items?.[index]?.subcategory && (
                          <div className="error">{errors.items[index].subcategory}</div>
                        )}
                      </div>
                    ) : (
                      // Existing Item Selection
                      <div>
                        <Field
                          as="select"
                          name={`items.${index}.item_id`}
                        >
                          <option value="">Select Item</option>
                          {existingItems.map(item => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </Field>
                        {errors.items?.[index]?.item_id && touched.items?.[index]?.item_id && (
                          <div className="error">{errors.items[index].item_id}</div>
                        )}
                      </div>
                    )}

                    {/* Suppliers Array */}
                    <FieldArray name={`items.${index}.supplier`}>
                      {({ push: pushSupplier, remove: removeSupplier }) => (
                        <div>
                          {item.supplier.map((supplier, supplierIndex) => (
                            <div key={supplierIndex}>
                              {/* Supplier Type Selection */}
                              <div>
                                <label>
                                  <Field
                                    type="radio"
                                    name={`items.${index}.supplier.${supplierIndex}.is_new_supplier`}
                                    value="true"
                                  />
                                  New Supplier
                                </label>
                                <label>
                                  <Field
                                    type="radio"
                                    name={`items.${index}.supplier.${supplierIndex}.is_new_supplier`}
                                    value="false"
                                  />
                                  Existing Supplier
                                </label>
                              </div>

                              {supplier.is_new_supplier ? (
                                // New Supplier Fields
                                <div>
                                  <Field
                                    name={`items.${index}.supplier.${supplierIndex}.name`}
                                    placeholder="Supplier Name"
                                  />
                                  {errors.items?.[index]?.supplier?.[supplierIndex]?.name && 
                                   touched.items?.[index]?.supplier?.[supplierIndex]?.name && (
                                    <div className="error">{errors.items[index].supplier[supplierIndex].name}</div>
                                  )}
                                  <Field
                                    name={`items.${index}.supplier.${supplierIndex}.email`}
                                    placeholder="Email"
                                  />
                                  {errors.items?.[index]?.supplier?.[supplierIndex]?.email && 
                                   touched.items?.[index]?.supplier?.[supplierIndex]?.email && (
                                    <div className="error">{errors.items[index].supplier[supplierIndex].email}</div>
                                  )}
                                  <Field
                                    name={`items.${index}.supplier.${supplierIndex}.mob_num`}
                                    placeholder="Mobile Number"
                                  />
                                  {errors.items?.[index]?.supplier?.[supplierIndex]?.mob_num && 
                                   touched.items?.[index]?.supplier?.[supplierIndex]?.mob_num && (
                                    <div className="error">{errors.items[index].supplier[supplierIndex].mob_num}</div>
                                  )}
                                  <Field
                                    name={`items.${index}.supplier.${supplierIndex}.tel_num`}
                                    placeholder="Telephone Number"
                                  />
                                  {errors.items?.[index]?.supplier?.[supplierIndex]?.tel_num && 
                                   touched.items?.[index]?.supplier?.[supplierIndex]?.tel_num && (
                                    <div className="error">{errors.items[index].supplier[supplierIndex].tel_num}</div>
                                  )}
                                </div>
                              ) : (
                                // Existing Supplier Selection
                                <div>
                                  <Field
                                    as="select"
                                    name={`items.${index}.supplier.${supplierIndex}.supplier_id`}
                                  >
                                    <option value="">Select Supplier</option>
                                    {existingSuppliers.map(supplier => (
                                      <option key={supplier.id} value={supplier.id}>
                                        {supplier.name}
                                      </option>
                                    ))}
                                  </Field>
                                  {errors.items?.[index]?.supplier?.[supplierIndex]?.supplier_id && 
                                   touched.items?.[index]?.supplier?.[supplierIndex]?.supplier_id && (
                                    <div className="error">{errors.items[index].supplier[supplierIndex].supplier_id}</div>
                                  )}
                                </div>
                              )}

                              <button
                                type="button"
                                onClick={() => removeSupplier(supplierIndex)}
                              >
                                Remove Supplier
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => pushSupplier({
                              name: '',
                              email: '',
                              mob_num: '',
                              tel_num: '',
                              is_new_supplier: true
                            })}
                          >
                            Add Supplier
                          </button>
                        </div>
                      )}
                    </FieldArray>

                    <button
                      type="button"
                      onClick={() => remove(index)}
                    >
                      Remove Item
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => push({
                    item_type: false,
                    item_name: '',
                    category: '',
                    subcategory: '',
                    supplier: [{
                      name: '',
                      email: '',
                      mob_num: '',
                      tel_num: '',
                      is_new_supplier: true
                    }]
                  })}
                >
                  Add Item
                </button>
              </div>
            )}
          </FieldArray>

          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};

export default PurchaseRequestForm; 