import axiosInstance from "../../api/axiosInstance";
import { GoogleLogin } from "@react-oauth/google";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { TbEyeClosed } from "react-icons/tb";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const togglePass = () => setShowPass(!showPass);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      services: "",
      certifications: null,
      location: "",
      role: "User",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Full Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(4, "Password must be at least 4 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
      services: Yup.string().optional(),
      certifications: Yup.mixed().nullable().optional(),
      location: Yup.string().optional(),
    }),
    onSubmit: async (values) => {
      try {
        console.log("values",values)
        let dataToSend = {
          name: values.name,
          email: values.email,
          password: values.password,
          ...(values.role === "Provider" && {
            services: values.services,
            location: values.location,
          }),
        };

        let endpoint = values.role === "User"
          ? "/auth/register/user"
          : "/auth/register/provider";

        if (values.certifications && values.role === "Provider") {
          const formData = new FormData();
          for (const key in dataToSend) {
            formData.append(key, dataToSend[key]);
          }
          formData.append("certifications", values.certifications);
          await axiosInstance.post(endpoint, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          await axiosInstance.post(endpoint, dataToSend, {
            headers: { "Content-Type": "application/json" },
          });
        }

        toast.success("Registration successful!");
        navigate("/login");
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Something went wrong. Please try again."
        );
      }
    },
  });

  return (
    <div className="bg-overlay bg-cover bg-center min-h-screen flex flex-col justify-center items-center">
      <div className="bg-grey-light bg-opacity-90 p-8 rounded-lg shadow-md w-96 mt-10">
        <h2 className="text-2xl font-bold text-center mb-6 text-black-default">
          Happy You&apos;re Here!
        </h2>
        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          <input
            type="text"
            placeholder="Full name"
            className="w-full p-2 border border-gray-300 rounded-md"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-500 text-sm">{formik.errors.name}</div>
          )}
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm">{formik.errors.email}</div>
          )}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <span
              onClick={togglePass}
              className="absolute right-3 top-3 cursor-pointer"
            >
              {showPass ? <FaEye /> : <TbEyeClosed />}
            </span>
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm">{formik.errors.password}</div>
            )}
          </div>

          <input
            type="password"
            name="confirmPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            placeholder="Confirm Password"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className="text-red-500 text-sm">
              {formik.errors.confirmPassword}
            </div>
          )}

          <div className="flex items-center space-x-12">
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="User"
                checked={formik.values.role === "User"}
                onChange={formik.handleChange}
                className="mr-2"
              />
              Need a service
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="Provider"
                checked={formik.values.role === "Provider"}
                onChange={formik.handleChange}
                className="mr-2"
              />
              Provide a service
            </label>
          </div>
          
          {formik.values.role === "Provider" && (
            <>
              <div className="flex space-x-4">
                <select
                  name="services"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={formik.values.services}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select a Service</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Ac repair">Ac repair</option>
                  <option value="Mechanic">Mechanic</option>
                  <option value="Painting">Painting</option>
                  <option value="HVAC Maintenance">HVAC Maintenance</option>
                  <option value="Home Appliance Repair">
                    Home Appliance Repair
                  </option>
                  <option value="Cleaning Services">Cleaning Services</option>
                  <option value="Pest Control">Pest Control</option>
                  <option value="IT and Gadget Repairs">
                    IT and Gadget Repairs
                  </option>
                  <option value="Handyman Services">Handyman Services</option>
                  <option value="Security Services">Security Services</option>
                </select>
                {formik.touched.services && formik.errors.services && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.services}
                  </div>
                )}
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {formik.touched.location && formik.errors.location && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.location}
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <label className="mr-2">Upload your certifications</label>
                <input
                  type="file"
                  className="p-2 bg-gray-200 rounded-md w-56 "
                  name="certifications"
                  onChange={(event) => {
                    formik.setFieldValue(
                      "certifications",
                      event.currentTarget.files[0]
                    );
                  }}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-green-button text-black-default  p-2 rounded-md hover:bg-green-700"
          >
            Sign Up
          </button>

          {formik.values.role === "User" && (
           <>
           <div className="my-4 text-center text-gray-600">Or Sign In With</div>
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              const res = await axiosInstance.post(
                "/auth/googleauth",
                { credential: credentialResponse.credential }
              );
              toast.success("Google Login Successful!");
              console.log(res.data, "responsefrontend");
            } catch (error) {
              console.error("Error during Google login:", error);
              toast.error("Google Login Failed");
            }
          }}
          onError={() => {
            console.log("Google Login Failed");
            toast.error("Google Login Failed");
          }}
        />
           </>
          )}
        </form>

        

        <div className="text-center mt-4 text-gray-500">
        Have an account?{" "}
          <Link to="/login" className="text-blue-link hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
