

import React from 'react'

const statusColors: Record<string, { name: string, color: string }> = {
    pending: { name: 'Pending', color: "#FFCC00" },
    allocated: { name: 'Allocated', color: "#33CCFF" },
    approved: { name: 'Approved', color: "#4CAF50" },
    rejected: { name: 'Rejected', color: "#FF4D4D" },
    fulfilled: { name: 'Fulfilled', color: "#6666FF" },
    dispatch: { name: 'Dispatch', color: "#0097A7" },
    dispatchavailable: { name: 'Dispatch Available', color: "#B2D732" },
    dispatchunavailable: { name: 'Dispatch Unavailable', color: "#E53935" },
    issued: { name: 'Issued', color: "#FF7043" },
    accepted: { name: 'Accepted', color: "#26A69A" },
    partiallyaccepted: { name: 'Partially Accepted', color: "#7CB342" },
    ebillgenerated: { name: 'Ebill Generated', color: "#673AB7" },
    receivied: { name: 'Received', color: "#00897B" },
    partiallyallocated: { name: 'Partially Allocated', color: "#0288D1" },
    allocatedreject: { name: 'Allocated Reject', color: "#D81B60" },
    approvalReject: { name: 'Approval Reject', color: "#C2185B" },
    intransit: { name: 'In-Transit', color: "#616161" },
    vendoracknowledged: { name: 'Vendor Acknowledged', color: "#FFC107" },
    sendapproval: { name: 'Send Approval', color: "#2196F3" }

}

interface StatusTextProps {
    label: string;
    className?: string;
}

const StatusText = ({ label, className }: StatusTextProps) => {
    const labelName = label?.toLowerCase().trim();
    const status = statusColors[labelName] || { name: label, color: '#000000' };

    return (
        <div
            className={`font-semibold text-[14px] leading-[19.71px] capitalize ${className}`}
            style={{ color: status.color }}
        >
            {status.name}
        </div>
    );
};

export default StatusText;