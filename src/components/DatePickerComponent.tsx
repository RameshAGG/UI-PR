import React, { useState } from "react";
import { format, addMonths, subMonths, isSameDay, isBefore, isAfter } from "date-fns";

const CustomDatePicker = ({ onClose, onApply }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });

  const handleDateClick = (date) => {
    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      setSelectedRange({ start: date, end: null });
    } else if (isBefore(date, selectedRange.start)) {
      setSelectedRange({ start: date, end: selectedRange.start });
    } else {
      setSelectedRange({ start: selectedRange.start, end: date });
    }
  };

  const renderDays = (month) => {
    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const days: Date[] = [];
    let day = new Date(startOfMonth);
    
    while (day <= endOfMonth) {
      days.push(new Date(day));
      day.setDate(day.getDate() + 1);
    }

    return days.map((day) => (
      <button
        key={day.toISOString()}
        onClick={() => handleDateClick(day)}
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          (selectedRange.start && isSameDay(day, selectedRange.start)) || 
          (selectedRange.end && isSameDay(day, selectedRange.end))
            ? "bg-black text-white font-bold"
            : selectedRange.start &&
              selectedRange.end &&
              isAfter(day, selectedRange.start) &&
              isBefore(day, selectedRange.end)
            ? "bg-gray-300 text-black"
            : "hover:bg-gray-200"
        }`}
      >
        {day.getDate()}
      </button>
    ));
  };

  return (
    <div className="absolute right-0 mt-2 w-[500px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
      <div className="flex justify-between mb-2">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>◀</button>
        <h3 className="text-lg font-semibold">
          {format(currentMonth, "MMM yyyy")} - {format(addMonths(currentMonth, 1), "MMM yyyy")}
        </h3>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>▶</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[currentMonth, addMonths(currentMonth, 1)].map((month, index) => (
          <div key={index}>
            <h4 className="text-center font-medium mb-2">{format(month, "MMM yyyy")}</h4>
            <div className="grid grid-cols-7 gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="text-center text-sm text-gray-500">
                  {day}
                </div>
              ))}
              {renderDays(month)}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="text-gray-700">
          {selectedRange.start ? format(selectedRange.start, "MMM d, yyyy") : "Select Start Date"}{" "}
          -{" "}
          {selectedRange.end ? format(selectedRange.end, "MMM d, yyyy") : "Select End Date"}
        </p>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
          Cancel
        </button>
        <button
          onClick={() => onApply(selectedRange)}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default CustomDatePicker;
