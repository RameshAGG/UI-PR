import React from 'react'

const priorityColors: Record<string, { bar: string }> = {
    low: { bar: "#008000" },
    medium: { bar: "#F2C94C" },
    high: { bar: "#FF4444" }
}
interface PriorityProps {
    label: string;
}

const Priority = ({ label }: PriorityProps) => {
    const priority = priorityColors[label?.toLowerCase() ?? ''] || { bar: "#9E9E9E", }
    return (
        <>
            <div
                className="w-fit h-[24px] rounded-[4px] px-[6px] py-[2px] flex items-center gap-[6px] border border-[#E0E0E0]"
            >
                <div
                    className=" w-[8px] h-[8px] rounded-sm  "
                    style={{ backgroundColor: priority.bar }}

                ></div>
                <div className="font-medium text-[13px] leading-[17.5px] capitalize">{label}</div>
            </div>
        </>
    )
}

export default Priority;