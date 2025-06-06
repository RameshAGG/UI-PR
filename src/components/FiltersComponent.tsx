import React, { useState } from "react";

const FilterComponent = ({ setIsFiltersOpen, onChangeMaterialType, selectMaterialType }) => {
  const [activeTab, setActiveTab] = useState("Materials Type");
  const [materialType, setMaterialType] = useState(selectMaterialType);

  const tabs = ["Materials Type"];

  return (
    <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50" style={{ width: '392px' }}>
      <div className="p-4 flex">
        {/* Sidebar Tabs */}
        <div className="w-1/3 border-r pr-2">
          <h3 className="font-semibold text-xs text-gray-600" style={{ marginBottom: '15px' }}>FILTERS</h3>
          <ul className="space-y-2">
            {tabs.map((tab) => (
              <li
                key={tab}
                className={`cursor-pointer text-sm ${activeTab === tab ? "font-semibold text-black" : "text-gray-500"
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-2/3 pl-4">
          {activeTab === "Materials Type" && (
            <div>
              <h4 className="text-sm font-semibold" style={{ marginBottom: '15px' }}>Materials Type</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2" style={{ marginBottom: '15px' }}>
                  <input
                    type="radio"
                    name="material"
                    value="MIVAN materials"
                    checked={materialType === "MIVAN materials"}
                    onChange={() => setMaterialType("MIVAN materials")}
                    className="form-radio text-blue-600"
                  />
                  <span className="text-sm">MIVAN materials</span>
                </label>

                <label className="flex items-center space-x-2" style={{ marginBottom: '15px' }}>
                  <input
                    type="radio"
                    name="material"
                    value="Props and brackets"
                    checked={materialType === "Props and brackets"}
                    onChange={() => setMaterialType("Props and brackets")}
                    className="form-radio text-blue-600"
                  />
                  <span className="text-sm">Props and brackets</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-2 border-t p-4">
        <button
          onClick={() => setIsFiltersOpen(false)}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          style={{ border: '1px solid #ddd', borderRadius: '6px' }}
        >
          Cancel
        </button>
        <button
          onClick={() => onChangeMaterialType(materialType)}
          className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterComponent;
