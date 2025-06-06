import React, { useEffect, useRef, useState } from 'react'
import { Formik, Form } from 'formik';
import { Image } from 'antd';
import * as Yup from 'yup';
import FormInput from '../common/FormInput.tsx';
import RequiredLabel from '../common/RequiredLabel.tsx';

interface AllocationFormProps {
    data: any[];
    formRef: any;
    setAllocatedInitialValue: (values: any[]) => void;
}

const AllocationForm = ({ data, formRef, setAllocatedInitialValue }: AllocationFormProps) => {
    // Group data
    const inventoryData = data.filter(item => item.type === "inventory");
    const siteData = data.filter(item => item.type === "site");
    const inventoryLength = inventoryData.length;

    // Add state to track all quantity changes
    const [quantities, setQuantities] = useState(
        data.map((item) => ({
            uniqueId: item.uniqueId,
            value: 0
        }))
    );

    const initialValues = {
        enteredQuantities: quantities
    };

    return (
        <div >
            <div>
                <Formik
                    innerRef={formRef}
                    initialValues={initialValues}
                    validateOnMount={true}
                    validateOnChange={true}
                    validateOnBlur={true}
                    onSubmit={() => { }}
                >
                    {({ }) => {
                        const handleQuantityChange = (
                            e: React.ChangeEvent<HTMLInputElement>,
                            uniqueId: string
                        ) => {
                            const newValue = e === '' ? 0 : parseFloat(e) || 0;
                            // Update quantities state while preserving previous values
                                const updatedQuantities = quantities.map(item => 
                                    item.uniqueId === uniqueId 
                                        ? { ...item, value: newValue }
                                        : item
                                );
                                
                                setQuantities(updatedQuantities);
                                setAllocatedInitialValue(updatedQuantities);
                        };

                        return (
                            <Form>
                                {inventoryData.length !== 0 && (
                                    <div>
                                        <div className='flex items-center justify-between mr-[16px]'>
                                            <h2 className="text-sm font-Montserrat mt-3 mb-1 text-blue-700">INVENTORY</h2>
                                            <p>Allocated Qty: <span>{quantities.reduce((sum, item) => sum + item.value, 0)}</span></p>
                                        </div>
                                        <div className="w-full bg-white rounded-lg p-4">
                                            {inventoryData.map((item, index) => {
                                                const valueObj = (quantities || []).find(v => v.uniqueId === item.uniqueId);
                                                return <div key={index} className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                                                    <div className="flex gap-4 items-center">
                                                        <div className="w-12 h-12 flex justify-center items-center rounded-full border border-gray-300">
                                                            <Image
                                                                src="/assets/allocate2.svg"
                                                                alt="preview icon"
                                                                preview={false}
                                                            />
                                                        </div>
                                                        <div className="flex flex-col space-y-1">
                                                            <p className="font-semibold text-black text-sm">{item?.siteName}</p>
                                                            <p className="text-gray-600 text-xs">{item.towerName}</p>
                                                            <p className="text-gray-600 text-xs">
                                                                Qty Available: <span className="font-medium text-black">{item.quantityavailable}</span>
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col items-end">
                                                        <RequiredLabel className="mb-1 font-Montserrat ">Quantity</RequiredLabel>
                                                        <div className="flex flex-col items-end">
                                                            <FormInput
                                                                name={`enteredQuantities[${index}]`}
                                                                type="number"
                                                                placeholder="Enter"
                                                                value={valueObj ? valueObj?.value : ''}
                                                                onChange={(e) => handleQuantityChange(e, item.uniqueId)}
                                                                className="w-24 h-9 px-2 border border-gray-300 rounded-md text-right text-sm"
                                                                min="0"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Site Section */}
                                <h2 className="text-sm font-Montserrat mt-3 mb-1 text-blue-700">SITE ({siteData.length})</h2>
                                <div className="w-full bg-white rounded-lg p-4 max-h-[calc(100vh-440px)] overflow-y-auto">
                                    {siteData.length > 0 ? (
                                        siteData.map((site, index) => {
                                            const siteIndex = index + inventoryLength;
                                            const valueObj = (quantities || []).find(v => v.uniqueId === site.uniqueId);
                                            return <div key={index} className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                                                <div className="flex gap-4 items-center">
                                                    <div className="w-12 h-12 flex justify-center items-center rounded-full border border-gray-300">
                                                        <Image
                                                            src="/assets/allocate2.svg"
                                                            alt="preview icon"
                                                            preview={false}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col space-y-1">
                                                        <p className="font-semibold text-black text-sm capitalize">{site?.siteName}</p>
                                                        <div className="flex gap-4 text-gray-600 text-xs">
                                                            {/* <p>{site.siteId}</p> */}
                                                            <p className=' flex '>
                                                                <span className='mr-[5px] capitalize'>{site.towerName}</span>
                                                                <span>-</span>
                                                                <span className='ml-[5px] capitalize'>{site.location ? site.location : "-"}</span>
                                                            </p>

                                                        </div>
                                                        <p className="text-gray-600 text-xs">
                                                            Qty Available: <span className="font-Montserrat text-black">{site.quantityavailable}</span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end">
                                                    <RequiredLabel className="mb-1 fond-Montserrat text-gray-300">Quantity</RequiredLabel>
                                                    <div className="flex flex-col items-end">
                                                        <FormInput
                                                            name={`enteredQuantities[${siteIndex}]`}
                                                            type="number"
                                                            placeholder="Enter"
                                                            value={valueObj ? valueObj?.value : ''}
                                                            onChange={(e) => handleQuantityChange(e, site.uniqueId)}
                                                            className="w-24 h-9 px-2 border border-gray-300 rounded-md text-right text-sm"
                                                            min="0"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        })
                                    ) : (
                                        <div className="flex justify-center items-center py-8 text-gray-500">
                                            No data available for allocation
                                        </div>
                                    )}
                                </div>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </div>
    );
};

export default AllocationForm;