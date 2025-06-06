import React, { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/common/FormInput.tsx';
import Button from '../components/common/Button.tsx';
import { message } from 'antd';
import axios from 'axios';
import { sendResetLink } from '../slices/UserRegistrationSlice.ts';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store.ts';
import { decryptData } from '../storageHelper.ts';
interface ForgetPasswordValues {
  email: string;
}

interface ForgetPasswordResponse {
  success: boolean;
  message?: string;
}   

const ForgetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues: ForgetPasswordValues = {
    email: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });

  const handleSubmit = async (values: ForgetPasswordValues) => {
    try {
      setIsLoading(true);
      const response = await dispatch(sendResetLink(values.email));
      
      // Check if the response is fulfilled
      if (sendResetLink.fulfilled.match(response)) {
        // Now you can safely access response.payload
        if (response.payload.success) {
          message.success('Password reset link sent to your email');
          navigate('/login');
        } else {
          message.error(response.payload.message || 'Failed to send reset link');
        }
      } else {
        // Handle the case where the thunk was rejected
        message.error(response.error.message || 'Failed to send reset link');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    // const token = localStorage.getItem("token"); 
    const encryptedToken = localStorage.getItem('token');
    const token = decryptData(encryptedToken);
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Forgot Your Password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter your email to receive a password reset link
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {formik => (
            <Form className="space-y-6">
              <FormInput name="email" type="email" label="Email" />
              <Button label={isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
                onClick={() => handleSubmit(formik.values)}
                disabled={!formik.isValid || formik.isSubmitting}
                className='w-full h-10 bg-black text-white hover:bg-gray-800'
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ForgetPassword;
