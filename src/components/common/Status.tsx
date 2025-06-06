import React from 'react'

const statusColors: Record<string, { name: string, bg: string, bar: string }> = {
  pending: { name: 'Pending', bg: "#FFF4CC", bar: "#FFCC00" },
  allocated: { name: 'Allocated', bg: "#D9F7FF", bar: "#33CCFF" },
  approved: { name: 'Approved', bg: "#DFFFD6", bar: "#4CAF50" },
  rejected: { name: 'Rejected', bg: "#FFD6D6", bar: "#FF4D4D" },
  fulfilled: { name: 'Fulfilled', bg: "#E6E6FF", bar: "#6666FF" },
  dispatch: { name: 'Dispatch', bg: "#E0F7FA", bar: "#0097A7" },
  dispatchavailable: { name: 'Dispatch Available', bg: "#F2FFCC", bar: "#B2D732" },
  dispatchunavailable: { name: 'Dispatch Unavailable', bg: "#FFE6E6", bar: "#E53935" },
  issued: { name: 'issued', bg: "#FFF0E6", bar: "#FF7043" },
  accepted: { name: 'Accepted', bg: "#CCFFEC", bar: "#26A69A" },
  partiallyaccepted: { name: 'Partially Accepted', bg: "#E6FFCC", bar: "#7CB342" },
  ebillgenerated: { name: 'Ebill Generated', bg: "#E3E3FF", bar: "#673AB7" },
  receivied: { name: 'Received', bg: "#D6FFF5", bar: "#00897B" },
  partiallyallocated: { name: 'Partially Allocated', bg: "#E6F7FF", bar: "#0288D1" },
  allocatedreject: { name: 'Allocated Reject', bg: "#FFD9E6", bar: "#D81B60" },
  approvalReject: { name: 'Approval Reject', bg: "FCE4EC", bar: "#C2185B" },
  intransit: { name: 'In-Transit', bg: "#E0E0E0", bar: "#616161" },
  vendoracknowledged: { name: 'Vendor Acknowledged', bg: "#FFF9C4", bar: "#FFC107" },
  sendapproval: { name: 'Send Approval', bg: "#E3F2FD", bar: "#2196F3" }
  // requested: { bg: "#7EB5FF66", bar: "#2F80ED" },
  // pending: { bg: "#CBE1FF", bar: "#0F44BE" },
  // submitted: { name: 'pending', bg: "#F2F2F2", bar: "#828282" },
  // approved: { bg: "#27AE6029", bar: "#27AE60" },
  // sent: { name: 'pending', bg: "#2F80ED29", bar: "#2F80ED" },
  // dispatch:  { bg: "#DCF2E5", bar: "#008000" },
  // received: { name: 'pending', bg: "#d1defb", bar: "#0F44BE" },
  // inTransit: { bg: "#FADAF2", bar: "#DE1BAD" },
}
interface StatusProps {
  label: string;
  className?: string;
}
const Status = ({ label, className }: StatusProps) => {

  let labelName = label?.toLowerCase().trim();
  const status = statusColors[labelName] || '';
 

  return (
    <>
      <div
        className="w-fit  rounded-[4px]  px-[3px] py-[3px] flex items-center gap-[6px] "
        style={{ backgroundColor: status.bg }}
      >
        {/* <div
          className=" w-[4px] h-fit rounded-sm  "
          style={{ backgroundColor: status.bar }}

        ></div> */}
        <div className={`border-l-4  font-medium text-[13px] leading-[17.5px] capitalize p-[3px]`}
          style={{
            borderLeft: `4px solid ${status.bar}`,
            borderRadius: '4px' // Rounds ALL corners equally
          }}        >{status.name}</div>
      </div>
    </>
  )
}

export default Status