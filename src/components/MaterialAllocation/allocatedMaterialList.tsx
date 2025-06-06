import React, { useState, useRef } from "react";
import { Button, Image, notification, Input } from "antd";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface MaterialAllocationUIProps {
    initialData: MaterialItem[];
    materialRequest: MaterialRequest;
    onClose?: () => void;
    onReallocate?: (data: MaterialItem[]) => void;
}

interface MaterialItem {
    uniqueId: number;
    inventoryId?: number;
    inventoryName?: string;
    siteId?: number;
    siteName?: string;
    siteSEQId?: string;
    towerId?: number;
    towerName?: string;
    location: string;
    quantityAvailable: number;
    allocatedQuantity: number;
    type?: "inventory" | "site";
}

interface MaterialRequest {
    id: number;
    materialRequestId: string;
    requestDate: string;
    towerId: number;
    towerName: string;
    towerSeqId: string;
    materialName: string;
    materialSeqId: string;
    QtyRequiredValue: number;
    materialDate: string;
    allocatedQty: number;
}

const MaterialAllocationUI: React.FC<MaterialAllocationUIProps> = ({ initialData: initialDataProp, materialRequest, onClose, onReallocate }) => {
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const [editEnable, setEditEnable] = useState<number>(1);
    const formRef = useRef<any>(null);

    const [quantities, setQuantities] = useState(
        initialDataProp.map((item) => ({
            uniqueId: item.uniqueId,
            value: item.allocatedquantity || 0
        }))
    );

    const initialValues = {
        enteredQuantities: quantities
    };

    const handleEdit = (index: number) => {
        setEditingRow(index);
        setEditEnable(2)
    };

    const handleSaveEdit = () => {
        const totalAllocatedQuantity = quantities.reduce((sum, item) => sum + item.value, 0);

        if (totalAllocatedQuantity <= materialRequest.qtyrequiredvalue) {
            setEditEnable(3);
            setEditingRow(null);
        } else {
            notification.error({
                message: "Total allocated quantity cannot exceed the required quantity!",
                placement: "top",
            });
        }
    };

    const handleReallocate = () => {
    //     if (editEnable === 2) {
    //         showNotification("error", "The save button will be work only when the user clicks on the tick icon.");
    //     } else {
    //         if (formRef.current) {
    //             formRef.current.submitForm().then(() => {
    //                 let sumOfQuantityValue = 0;
    //                 let quantityAllocatedCheckField = initialData.map((e) => {
    //                     if ((+e.allocatedQuantity) > (+e.quantityAvailable)) {
    //                         return false
    //                     } else {
    //                         return true
    //                     }
    //                 })

    //                 if (quantityAllocatedCheckField.includes(false)) {
    //                     showNotification("error", "Allocated quantity cannot exceed the available quantity.");
    //                 } else {
    //                     initialData.map((e) => {
    //                         sumOfQuantityValue = sumOfQuantityValue + e.allocatedQuantity;
    //                     })
    //                     if (sumOfQuantityValue <= materialRequest.QtyRequiredValue) {
    //                         onReallocate?.(initialData);
    //                     } else {
    //                         showNotification("error", "Total allocated quantity cannot exceed the required quantity!");
    //                     }
    //                 }
    //             });
    //         }
    //     }

    };

    const handleChange = (uniqueId: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
        const updatedQuantities = quantities.map(item => 
            item.uniqueId === uniqueId 
                ? { ...item, value: newValue }
                : item
        );
        setQuantities(updatedQuantities);
    };

    const handleDelete = (uniqueId: number) => {
        const updatedQuantities = quantities.filter(item => item.uniqueId !== uniqueId);
        setQuantities(updatedQuantities);
        notification.success({
            message: "Quantity deleted successfully!",
            placement: "top",
        });
    };

    return (
        <div className="h-full">
            <div className="bg-white h-full">
                <div className="flex justify-between items-start p-[16px] m-0 border-b border-[#ddd] mb-[16px]">
                    <h2 className="text-lg font-semibold">View Details</h2>
                    <Image
                        className="cursor-pointer"
                        src="/assets/close.svg"
                        alt="preview icon"
                        onClick={onClose}
                        preview={false}
                    />
                </div>

                <div className="bg-[#FDF7E6] border border-yellow-400 rounded-md p-4 mb-4 m-4 flex justify-between items-center">
                    <div className="w-[55%]">
                        <p className="font-semibold text-sm">{materialRequest.materialname}</p>
                        <div className="flex justify-between text-xs mt-2">
                            <p>Required For: <span className="font-medium">{materialRequest.towername}</span></p>
                            <p>Required On: <span className="font-medium">{new Date(materialRequest.requestdate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span></p>
                        </div>
                    </div>
                    <div>
                        <p className="text-[#4F4F4F] text-[13px]">Qty required</p>
                        <p className="mt-2 text-[#000000] text-[16px] font-[600]">{materialRequest.qtyrequiredvalue}</p>
                    </div>
                    <div>
                        <p className="text-[#4F4F4F] text-[13px]">Allocated Qty</p>
                        <p className="mt-2 text-[#008000] text-[16px] font-[600]">{materialRequest?.totalAllocatedQuantity}</p>
                    </div>
                </div>

                <p className="text-sm font-semibold m-[16px]">SITE ({initialDataProp?.length})</p>

                <Formik
                    initialValues={initialValues}
                    innerRef={formRef}
                    onSubmit={(values) => {
                    }}
                >
                    {({ }) => {
                        return <Form className="m-4">
                            {initialDataProp.map((item, index) => {
                                const valueObj = (quantities || []).find(v => v.uniqueId === item.uniqueId);
                                return <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                            <Image src="/assets/allocate2.svg" alt="site icon" preview={false} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">{item.siteName}</p>
                                            <div className="flex space-x-2 text-xs text-gray-600">
                                                <p>{item.siteId}</p>
                                                <ul className="list-disc list-inside">
                                                    <li>{item.towerName}</li>
                                                </ul>
                                                <p>{item.location}</p>
                                            </div>
                                            <p className="text-xs text-gray-600">Qty Available: <span className="font-medium">{item.quantityavailable}</span></p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-20">
                                            <Input
                                                type="number"
                                                name={`allocatedQuantities.${item.uniqueId}`}
                                                value={valueObj?.value ?? ''}
                                                onChange={(e) => handleChange(item.uniqueId, e)}
                                                disabled={editingRow !== index}
                                                className={`w-full text-right`}
                                            />
                                        </div>
                                        <div className="flex space-x-2">
                                            {editingRow !== index ? (
                                                <Image
                                                    className="cursor-pointer"
                                                    src="/assets/edit_icon.svg"
                                                    alt="preview icon"
                                                    onClick={() => handleEdit(index)}
                                                    preview={false}
                                                />
                                            ) : (
                                                <Image
                                                    className="cursor-pointer"
                                                    src="/assets/save_icon.svg"
                                                    alt="preview icon"
                                                    onClick={() => handleSaveEdit()}
                                                    preview={false}
                                                />
                                            )}
                                            {/* <Image
                                                className="cursor-pointer"
                                                src="/assets/delete_icon.svg"
                                                alt="preview icon"
                                                onClick={() => handleDelete(index, item)}
                                                preview={false}
                                            /> */}
                                        </div>
                                    </div>
                                </div>
                            })}
                            <div className="flex justify-end space-x-4" style={{ position: 'absolute', bottom: 0, right: 0, width: '100%', margin: 0, borderTop: '1px solid #ddd', padding: '16px' }}>
                                <Button disabled={editEnable === 1} onClick={handleReallocate} style={{ backgroundColor: '#222222', color: '#FCFCFC', fontSize: '14px', fontFamily: 'Montserrat', fontWeight: 400 }}>Save</Button>
                            </div>
                        </Form>
                    }}
                </Formik>
            </div>
        </div>
    );
};

export default MaterialAllocationUI;