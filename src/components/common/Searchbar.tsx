import React, { useEffect, useState, useCallback } from "react";
import { Input } from "antd";

interface SearchbarProps {
  search: string;
  onSearch: (value: string) => void;
  value?:string;
}

const Searchbar = ({ search, onSearch ,value}: SearchbarProps) => {
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (debouncedSearch !== search) {
        onSearch(debouncedSearch);
      }
    }, 500); // Reduce delay for better user experience

    return () => clearTimeout(handler);
  }, [debouncedSearch]); // Only depends on inputValue

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDebouncedSearch(e.target.value); //  Updates local state instead of calling API directly
  }, []);

  return (
    <div className="flex py-[13px] items-center w-[280px] h-[44px] rounded-lg bg-[#FFFFFF] border border-[#D0D5DD]">
      <div className="text-[24px]">
        <img
          src="/assets/search.svg"
          alt="search"
          width="18px"
          height="18px"
          className="ml-[8px] mr-[5px] my-[5px]"
        />
      </div>
      <input
        placeholder="Search"
        value={value}
        className="border-none !shadow-none !ring-0 !outline-none focus:!outline-none focus:!ring-0 focus-visible:!outline-none focus-visible:!ring-0"
        onChange={handleChange} // Updates local state instead of calling API directly
      />
    </div>
  );
};

export default Searchbar;
