// CreateRequestPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import RequestForm from './RequestForm';


export default function CreateRequestPage() {
  const navigate = useNavigate();
  
  return (
    <div className="p-6">
      <RequestForm
        mode="create" 
        onCancel={() => navigate('/requests')}
        onSubmit={(data) => {
          // Handle submission
          navigate('/requests');
        }}
      />
    </div>
  );
}