import React, { useEffect, useState } from "react";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { loginUser } from "../slices/UserRegistrationSlice.ts";
import { useNavigate, Link } from "react-router-dom";
import * as yup from "yup";
import { Formik, Form } from "formik";
import type { AppDispatch, RootState } from "../store/store.tsx";
import FormInput from "../components/common/FormInput.tsx";
import Button from "../components/common/Button.tsx";
import { useAuth } from '../../src/context/AuthContext.tsx';
import { useSelector } from "react-redux";
import { decryptData } from "../storageHelper.ts";

interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = yup.object({
    email: yup.string().email("Invalid Email Id").required("Email is Required"),
    password: yup.string().required("Password is Required"),
  });

  const { roleName } = useSelector((state: RootState) => state.userRegister)
  const initialValues: LoginFormValues = { email: "", password: "" };

  const onSubmit = async (values: LoginFormValues, { setSubmitting }: any) => {
    try {
      await login(values);
      // const {token,roleName}=response.data
      message.success("Successfully Logged In");
    } catch (error: any) {
      if (error.response?.status === 401) {
        message.error("Invalid credentials");
      } else if (error.message === "Invalid token received from server") {
        message.error("Authentication failed");
      } else {
        message.error(error.response?.data?.message || "Something went wrong");
      }
    } finally {
      setSubmitting(false);
    }
  };


  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    // const token = localStorage.getItem("token");
    const encryptedToken = localStorage.getItem('token');
    const token = decryptData(encryptedToken);
    if (token) {
      navigate("/dashboard", { replace: true, state: { roleName: roleName } });
    }
  }, [navigate]);

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="relative flex flex-col items-center justify-center bg-white w-[40%]">
        <img src="/assets/AGGLogo.svg" alt="AGG Technology Pvt Ltd" className="h-[76px] w-[130px]" />
        <div className="absolute top-0 left-0">
          <img src="/assets/side.svg" alt="Background" className="object-cover z-10" />
        </div>

        <div className="flex flex-col items-center shadow-xl rounded-lg space-y-8 w-[500px] p-8">
          <h1 className="text-2xl text-center text-gray-800 font-bold">Login</h1>

          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            validateOnChange={true}
            validateOnBlur={false}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="w-full space-y-6">
                <FormInput 
                  name="email" 
                  type="email" 
                  placeholder="Email" 
                  className="font-montserrat placeholder:font-montserrat" 
                />
                <div className="relative">
                  <FormInput 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    className="font-montserrat placeholder:font-montserrat" 
                  />
                  <span 
                    className="absolute right-3 top-3 cursor-pointer" 
                    onClick={() => setShowPassword(prev => !prev)}
                  >
                    <img src="/assets/eye-icon.svg" alt="Toggle Password Visibility" />
                  </span>
                </div>

                <div className="flex justify-end text-sm text-gray-600">
                  {/* <p>Forgot your password?</p> */}
                  <Link
                    to="/forgetpassword"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Forgot your password
                  </Link>
                </div>

                <Button
                  type="submit"
                  label={isSubmitting ? "Logging in..." : "Login"}
                  className={`w-full py-3 rounded-md transition-colors duration-300 ${
                    isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"
                  }`}
                  disabled={isSubmitting}
                  onClick={() => {}}
                />

                <div className="text-center text-gray-600">
                  {/* <span className="text-sm">Or login with</span> */}
                </div>

                {/* <Button
                  type="button"
                  label="Login With SSO"
                  onClick={() => { }}
                  className="w-full bg-white text-black py-3 border-2 rounded-md transition-colors duration-300"
                /> */}
{/* 
                <div className="text-center text-sm text-gray-600">
                  Don't have an account?{" "}
                  <a href="/register" className="text-blue-600 hover:text-blue-800">
                    Register
                  </a>
                </div> */}
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-[60%] h-screen relative">
        <img src="/assets/bg-img.svg" alt="Background" className="absolute inset-0 w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default Login;
