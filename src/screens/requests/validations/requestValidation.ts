import * as yup from "yup";


interface RequestFormValues {
    department: string;
    date_requested: string;
    status: string;
    items: {
      item: {
        id: number;
        name: string;
      };
      itemName: string;
      category: string;
      subcategory: string;
      quantity: number;
      suppliers: {
        supplierId: number;
        supplierName: string;
        supplierEmail: string;
        supplierContact: string;
        supplierTel: string;
        isNewSupplier: boolean;
        selected: boolean;
      }[];
    }[];
    suggestion_items: any[];
  }
  
  export const requestSchema = yup.object().shape({
    department: yup.string()
      .required("Department is required")
      .min(2, "Department must be at least 2 characters")
      .max(50, "Department cannot exceed 50 characters")
      .trim(),
      
    date_requested: yup.date()
      .required("Requested Date is required")
      .typeError("Invalid date format")
      .min(new Date(), "Requested date cannot be in the past"),
      
    status: yup.string()
      .required("Status is required")
      .oneOf(['pending', 'approved', 'rejected', 'in-progress', 'completed'], 
             "Invalid status value"),
      
    items: yup.array()
      .of(
        yup.object().shape({
          item: yup.object().shape({
            id: yup.number().nullable(),
            name: yup.string()
              .required("Item name is required")
              .min(2, "Item name must be at least 2 characters")
              .max(100, "Item name cannot exceed 100 characters")
              .trim()
          }),
          
          itemName: yup.string()
            .required("Item name is required")
            .min(2, "Item name must be at least 2 characters")
            .max(100, "Item name cannot exceed 100 characters")
            .trim(),
            
          category: yup.string()
            .required("Category is required")
            .min(2, "Category must be at least 2 characters")
            .max(50, "Category cannot exceed 50 characters")
            .trim(),
            
          subcategory: yup.string()
            .required("Subcategory is required")
            .min(2, "Subcategory must be at least 2 characters")
            .max(50, "Subcategory cannot exceed 50 characters")
            .trim(),
            
          quantity: yup.number()
            .required("Quantity is required")
            .min(1, "Quantity must be at least 1")
            .max(10000, "Quantity cannot exceed 10,000")
            .integer("Quantity must be a whole number")
            .typeError("Quantity must be a valid number"),
            
          suppliers: yup.array()
            .of(
              yup.object().shape({
                supplierId: yup.number().nullable(),
                  
                supplierName: yup.string()
                  .required("Supplier name is required")
                  .min(2, "Supplier name must be at least 2 characters")
                  .max(100, "Supplier name cannot exceed 100 characters")
                  .trim(),
                  
                supplierEmail: yup.string()
                  .when('selected', {
                    is: true,
                    then: (schema) => schema
                      .required("Email is required for selected suppliers")
                      .email("Invalid email format")
                      .max(100, "Email cannot exceed 100 characters"),
                    otherwise: (schema) => schema.email("Invalid email format").nullable()
                  }),
                  
                supplierContact: yup.string()
                  .when('selected', {
                    is: true,
                    then: (schema) => schema
                      .required("Contact number is required for selected suppliers")
                      .matches(/^[0-9+\-\s()]+$/, "Invalid contact number format")
                      .min(10, "Contact number must be at least 10 digits")
                      .max(15, "Contact number cannot exceed 15 digits"),
                    otherwise: (schema) => schema
                      .matches(/^[0-9+\-\s()]*$/, "Invalid contact number format")
                      .nullable()
                  }),
                  
                supplierTel: yup.string()
                  .matches(/^[0-9+\-\s()]*$/, "Invalid telephone number format")
                  .max(15, "Telephone number cannot exceed 15 digits")
                  .nullable(),
                  
                isNewSupplier: yup.boolean().required(),
                
                selected: yup.boolean().required()
              })
            )
            .min(1, "At least one supplier is required")
            .test('at-least-one-selected', 'At least one supplier must be selected', function(suppliers) {
              if (!suppliers || suppliers.length === 0) return false;
              return suppliers.some(supplier => supplier.selected === true);
            })
        })
      )
      .min(1, "At least one item is required")
      .max(50, "Cannot exceed 50 items per request"),
      
    suggestion_items: yup.array().nullable()
  });
  

// Additional custom validation function for complex business rules
export const validatePurchaseRequest = async (values: RequestFormValues) => {
  const errors: any = {};
  
  // Check for duplicate items
  const itemNames = values.items.map(item => item.itemName.toLowerCase().trim());
  const duplicateItems = itemNames.filter((name, index) => itemNames.indexOf(name) !== index);
  
  if (duplicateItems.length > 0) {
    errors.items = "Duplicate items are not allowed";
  }
  
  // Check if date is not too far in the future (e.g., not more than 1 year)
  if (values.date_requested) {
    const requestedDate = new Date(values.date_requested);
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    
    if (requestedDate > oneYearFromNow) {
      errors.date_requested = "Requested date cannot be more than 1 year in the future";
    }
  }
  
  // Validate total quantity doesn't exceed business limits
  const totalQuantity = values.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  if (totalQuantity > 1000) {
    errors.totalQuantity = "Total quantity across all items cannot exceed 1,000";
  }
  
  return errors;
};

// Helper function to validate individual fields on blur
export const validateField = async (fieldName: string, value: any, allValues: RequestFormValues) => {
  try {
    await yup.reach(requestSchema, fieldName).validate(value);
    return null;
  } catch (error: any) {
    return error.message;
  }
};

export default requestSchema;