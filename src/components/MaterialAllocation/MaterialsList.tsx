import React from "react";
import { Checkbox, Image } from "antd";
import Status from '../common/Status.tsx';

interface MaterialsListProps {
    selectedRow: any;
    checkedList: number[];
    onGroupChange: (list: number[]) => void;
    selectedMaterial: number | null;
    setSelectedMaterial: (id: number | null) => void;
    allocatedMaterials: number[];
    onViewDetails?: (materialId: number) => void;
    approvalScreen?: boolean;
    dispatchScreen?: boolean;
    materialStatus?: (materialId: number, status: boolean) => void;
    type: string;
}

const MaterialsList = ({
    selectedRow,
    checkedList,
    onGroupChange,
    selectedMaterial,
    setSelectedMaterial,
    allocatedMaterials,
    onViewDetails,
    approvalScreen,
    dispatchScreen,
    materialStatus,
    type
}: MaterialsListProps) => {
    const materialIds = selectedRow?.materiallist?.map((mat) => mat.id) || [];
    console.log("materialIds", selectedRow?.materiallist);
    console.log("type", type);

    const materialAlloccationAllowStatusId = (material) => [1, 2, 14].includes(material.statusid);
    const materialApprovalAllowStatusId = (material) => [2, 19, 20].includes(material.statusid);
    const materialDispatchAllowStatusId = (material) => [3].includes(material.statusid);
    const materialAcknowledgementAllowStatusId = (material) => [6, 8].includes(material.statusid);

    // const materialAlloccationAllowStatusId = (material) => [1, 2, 14, 19, 20].includes(material.statusid);
    // const materialApprovalAllowStatusId = (material) => [19, 3, 4, 15].includes(material.statusid);
    // const materialDispatchAllowStatusId = (material) => [3, 6, 8].includes(material.statusid);
    // const materialAcknowledgementAllowStatusId = (material) => [6, 10, 18].includes(material.statusid);

    let allPendingChecked = false;
    let isIndeterminate = false;

    if (type === 'material-allocation') {
        const pendingMaterials = materialIds.filter((id) => {
            const material = selectedRow.materiallist.find(mat => mat.id === id);
            return materialAlloccationAllowStatusId(material);
        });

        allPendingChecked = pendingMaterials.length > 0 && checkedList.length === pendingMaterials.length;
        isIndeterminate = checkedList.length > 0 && checkedList.length < pendingMaterials.length;
    } else if (type === 'material-approval') {
        const pendingMaterials = materialIds.filter((id) => {
            const material = selectedRow.materiallist.find(mat => mat.id === id);
            return materialApprovalAllowStatusId(material);
        });

        allPendingChecked = pendingMaterials.length > 0 && checkedList.length === pendingMaterials.length;
        isIndeterminate = checkedList.length > 0 && checkedList.length < pendingMaterials.length;
    } else if (type === 'material-acknowledgement') {
        const pendingMaterials = materialIds.filter((id) => {
            const material = selectedRow.materiallist.find(mat => mat.id === id);
            return materialAcknowledgementAllowStatusId(material);
        });

        allPendingChecked = pendingMaterials.length > 0 && checkedList.length === pendingMaterials.length;
        isIndeterminate = checkedList.length > 0 && checkedList.length < pendingMaterials.length;
    } else if (type === 'material-dispatch') {
        const pendingMaterials = materialIds.filter((id) => {
            const material = selectedRow.materiallist.find(mat => mat.id === id);
            return materialDispatchAllowStatusId(material);
        });

        allPendingChecked = pendingMaterials.length > 0 && checkedList.length === pendingMaterials.length;
        isIndeterminate = checkedList.length > 0 && checkedList.length < pendingMaterials.length;
    }   

    return (
        <div className="h-auto rounded-lg flex flex-col">
            <div className="flex text-center pl-3 mt-3 mb-3">
                <Checkbox
                    indeterminate={isIndeterminate}
                    checked={allPendingChecked}
                    disabled={(type === 'material-allocation' && !allPendingChecked) || (type === 'material-approval' && !allPendingChecked) || (type === 'material-acknowledgement' && !allPendingChecked) || (type === 'material-dispatch' && !allPendingChecked)}
                    onChange={(e) => {
                        if (type !== 'material-allocation' || allPendingChecked) {
                            onGroupChange(e.target.checked ? materialIds.filter(materialAlloccationAllowStatusId) : []);
                        } else if (type !== 'material-approval' || allPendingChecked) {
                            onGroupChange(e.target.checked ? materialIds.filter(materialApprovalAllowStatusId) : []);
                        } else if (type !== 'material-acknowledgement' || allPendingChecked) {
                            onGroupChange(e.target.checked ? materialIds.filter(materialAcknowledgementAllowStatusId) : []);
                        } else if (type !== 'material-dispatch' || allPendingChecked) {
                            onGroupChange(e.target.checked ? materialIds.filter(materialDispatchAllowStatusId) : []);
                        }
                    }}
                >
                    <span className="font-semibold text-[#444]  uppercase text-[14px]">
                        MATERIALS ({selectedRow?.materiallist?.length || 0})
                    </span>
                </Checkbox>
            </div>

            <div className="bg-[#FFFFFF] p-4 rounded-lg max-h-[calc(100vh-410px)] overflow-y-auto">
                {selectedRow?.materiallist?.map((material, index) => {
                    const isChecked = checkedList.includes(+material.id);
                    const isSelected = selectedMaterial === +material.id;
                    const isMaterialPending = materialAlloccationAllowStatusId(material);
                    const isMaterialApprovalPending = materialApprovalAllowStatusId(material);
                    const isMaterialAcknowledgementPending = materialAcknowledgementAllowStatusId(material);
                    const isMaterialDispatchPending = materialDispatchAllowStatusId(material);

                    return (
                        <div
                            key={material.id}
                            className={`p-4 !border-b-[2px] !border-[#ddd] items-start cursor-pointer mb-2 bg-white ${isSelected ? "!bg-[#E8F4FD]" : "border-transparent"}`}
                            onClick={() => setSelectedMaterial(material.id)}
                        >
                            <div className="flex">
                                <Checkbox
                                    checked={isChecked}
                                    disabled={(type === 'material-allocation' && !isMaterialPending) || (type === 'material-approval' && !isMaterialApprovalPending) || (type === 'material-acknowledgement' && !isMaterialAcknowledgementPending) || (type === 'material-dispatch' && !isMaterialDispatchPending)}
                                    onChange={(e) => {
                                        if (type !== 'material-allocation' || isMaterialPending) {
                                            const newCheckedList = e
                                                ? checkedList.includes(+material.id)
                                                    ? checkedList.filter((id) => id !== +material.id)
                                                    : [...checkedList, +material.id]
                                                : checkedList.filter((id) => id !== +material.id);
                                            onGroupChange(newCheckedList);
                                        } else if (type !== 'material-approval' || isMaterialApprovalPending) {
                                            const newCheckedList = e
                                                ? checkedList.includes(+material.id)
                                                    ? checkedList.filter((id) => id !== +material.id)
                                                    : [...checkedList, +material.id]
                                                    : checkedList.filter((id) => id !== +material.id);
                                            onGroupChange(newCheckedList);
                                        } else if (type !== 'material-acknowledgement' || isMaterialAcknowledgementPending) {
                                            const newCheckedList = e
                                                ? checkedList.includes(+material.id)
                                                    ? checkedList.filter((id) => id !== +material.id)
                                                    : [...checkedList, +material.id]
                                                    : checkedList.filter((id) => id !== +material.id);
                                            onGroupChange(newCheckedList);
                                        } else if (type !== 'material-dispatch' || isMaterialDispatchPending) {
                                            const newCheckedList = e
                                                ? checkedList.includes(+material.id)
                                                    ? checkedList.filter((id) => id !== +material.id)
                                                    : [...checkedList, +material.id]
                                                    : checkedList.filter((id) => id !== +material.id);
                                            onGroupChange(newCheckedList);
                                        }       
                                    }}
                                />
                                <div className="ml-3 flex flex-col w-full">
                                    <p className="font-semibold text-[16px] text-[#222]">
                                        {material.materialName}
                                    </p>

                                    <div className=" text-[13px] text-[#666] mt-1">
                                        {/* <span className="mx-2 text-[#999]">•</span> */}
                                        <span
                                            className={`font-medium capitalize ${material.periorityid === 1
                                                ? "text-[#FF4D4F]"
                                                : "text-[#FFA500]"
                                                }`}
                                        >
                                            {material.perioritytype}
                                        </span>
                                    </div>


                                    <div className="mt-2">
                                        {(material?.statusid !== 2 && material?.statusid !== 14) ? (

                                            <Status label={material?.status} />
                                            
                                        ) : ''}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-2">
                                {+material?.statusid === 2 ? (
                                    <div className="flex items-center justify-between text-sm font-medium">
                                        <div className="flex items-center ">
                                            <Image src="/assets/allocatedIcon.svg" alt="allocated_icon" preview={false} />
                                            <p className="text-green-700 ml-[6px]">Allocated</p>
                                        </div>
                                        {
                                            (approvalScreen || dispatchScreen) ? '' : <button
                                                type="button"
                                                className="text-[14px] px-[18px] py-[8px] border border-[#A1A1A1] rounded-[8px] text-[#222222] font-normal"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onViewDetails(material.id);
                                                }}
                                            >
                                                view details
                                            </button>
                                        }

                                    </div>
                                ) : (material?.statusid === 14 ? (
                                    <div className="flex items-center justify-between text-sm font-medium">
                                        <div className="flex items-center">
                                            <Image src="/assets/partialy_allocated.svg" alt="allocated_icon" preview={false} />
                                            <p className="text-[#F2994A] ml-[6px]">Partial Allocation</p>
                                        </div>
                                        {
                                            (approvalScreen || dispatchScreen) ? '' : <button
                                                type="button"
                                                className="text-[14px] px-[18px] py-[8px] border border-[#A1A1A1] rounded-[8px] text-[#222222] font-normal"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onViewDetails(material.id);
                                                }}
                                            >
                                                view details
                                            </button>
                                        }

                                    </div>
                                ) : '')}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MaterialsList;
