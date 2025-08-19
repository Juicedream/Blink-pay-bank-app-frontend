"use client";
import CustomAuthButton from "@/components/resusable/CustomAuthButton";
import { axiosClient } from "@/utils/AxiosClient";

import { Formik, Form, ErrorMessage, Field } from "formik";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import * as yup from "yup";
const accountTypes = ["Savings", "Current"];
const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const initialValues = {
    name: "",
    email: "",
    password: "",
    acc_type: "",
  };

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Email must be a valid email")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
    acc_type: yup
      .string()
      .oneOf(
        ["savings", "current"],
        "Account Should a valid Savings or Current Account"
      )
      .required("Account Type is required"),
  });

  const onSubmitHandler = async (values, helpers) => {
    setLoading(true)
    try {
      const response = await axiosClient.post("/auth/register", values);
      const data = await response.data;

      console.log(data);
      toast.success(data.msg);
      helpers.resetForm();
    } catch (error) {
      toast.error(error.response.data.msg);
      console.log(error);
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
              className="rounded-md opacity-.9"
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
                  name="name"
                  placeholder="Enter your Name"
                  className="w-full py-3 px-3 rounded border outline-none"
                />
                <ErrorMessage
                  className="text-red-500"
                  name="name"
                  component={"p"}
                />
              </div>
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
              <div className="mb-3">
                <Field
                  as="select"
                  name="acc_type"
                  className="w-full py-3 px-3 rounded border outline-none"
                  id=""
                >
                  <option value="">Select Account Type</option>
                  {accountTypes.map((accountType) => (
                    <option key={accountType} value={accountType.toLowerCase()}>
                      {accountType}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  className="text-red-500"
                  name="acc_type"
                  component={"p"}
                />
              </div>
              <div className="mb-3">
                <CustomAuthButton text="Register" isLoading={loading} />
              </div>
              <div className="mb-3">
                <p className="text-end font-medium">
                  Already have an account? <Link href="/login" className="text-purple-700">Login</Link>
                </p>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  );
};
export default RegisterPage;
