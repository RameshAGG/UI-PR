import React, { useState } from 'react';
import Axios from '../../axios-config/axiosInstance.ts';

const BulkUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<string>('item');

  const handleUpload = async () => {
    if (!selectedFile || !uploadType) {
      alert("Please choose a file and upload type");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await Axios.post(`/upload/${uploadType}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert(`${uploadType} upload success`);
    } catch (e) {
      console.error(e);
      alert(`${uploadType} upload failed`);
    }
  };

  return (
    <div className='p-4 bg-white rounded-lg shadow-md h-full flex flex-col gap-4'>
      <h2 className='text-2xl font-bold text-center'>Bulk Upload</h2>

      <div className='flex flex-col gap-2'>
        <label className='text-sm font-medium'>Choose Upload Type:</label>
        <select
          className='border border-gray-300 rounded-md px-2 py-1'
          value={uploadType}
          onChange={(e) => setUploadType(e.target.value)}
        >
          <option value="item">Item</option>
          <option value="item-price">Item Price</option>
          <option value="supplier">Supplier</option>
        </select>
      </div>

      <div className='flex flex-col gap-2'>
        <label className='text-sm font-medium'>Choose File:</label>
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        />
      </div>

      <button
        className='bg-blue-500 text-white px-4 py-2 rounded-md mt-2'
        onClick={handleUpload}
      >
        Upload
      </button>
    </div>
  );
};

export default BulkUpload;
