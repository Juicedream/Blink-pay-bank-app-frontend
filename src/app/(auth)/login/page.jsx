"use client";
import CustomAuthButton from "@/components/resusable/CustomAuthButton";
import { axiosClient } from "@/utils/AxiosClient";
import { useState } from "react";

import { Formik, Form, ErrorMessage, Field } from "formik";
import { toast } from "react-toastify";
import * as yup from "yup";
import Link from "next/link";
import { useMainContext } from "@/context/MainContext";
import { useRouter } from "next/navigation";


const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const {fetchUserProfile} = useMainContext();
  const router = useRouter();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Email must be a valid email")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
  });

 
  const onSubmitHandler = async (values, helpers) => {
    try {
      setLoading(true)
      const response = await axiosClient.post("/auth/login", values);
      const data = response.data;
      toast.success(data.msg);
      // //token
      localStorage.setItem("token", data.token);
      await fetchUserProfile()
      router.push("/")

      helpers.resetForm();
    } catch (error) {
      toast.error(error.response.data.msg);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-full xl:w-[60%] py-10 flex items-start border">
          <div className="hidden lg:block bg-white">
            <img
              src="/blink-pay-logo.png"
              alt="bank-logo"
              className="rounded-md opacity-.9 h-full w-full object-contain"
            />
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmitHandler}
          >
            <Form className="w-full lg:w-1/2 px-10 py-10">
              <div className="mb-3">
                <Field
                  type="text"
                  name="email"
                  placeholder="Enter your Email"
                  className="w-full py-3 px-3 rounded border outline-none"
                />
                <ErrorMessage
                  className="text-red-500"
                  name="email"
                  component={"p"}
                />
              </div>
              <div className="mb-3">
                <Field
                  type="text"
                  name="password"
                  placeholder="Enter your Password"
                  className="w-full py-3 px-3 rounded border outline-none"
                />
                <ErrorMessage
                  className="text-red-500"
                  name="password"
                  component={"p"}
                />
              </div>
              {/* <button className="w-full py-4 text-center text-lg bg-purple-900 rounded text-white">
              Login
            </button> */}
              <div className="mb-3">
                <CustomAuthButton text="Login" isLoading={loading} />
              </div>

              <div className="mb-3">
                <p className="text-end font-medium">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-purple-700">
                    Register
                  </Link>
                </p>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  );
};
export default LoginPage;
