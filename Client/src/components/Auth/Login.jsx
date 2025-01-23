import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { TbEyeClosed } from "react-icons/tb";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/authSlice";
import axiosInstance from "../../api/axiosInstance";
import endpoints from "../../api/endpoints";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
//   const { isAuthenticated } = useSelector((state) => state.user);
  const [showPass, setShowPass] = useState(false);


//   useEffect(() => {
//     if (isAuthenticated) {
//       if(admin) {
//         navigate("/admin/dashboard",{replace: true});
//       } else {
//       navigate('/', { replace: true });
//       }
//     } 
//   }, [isAuthenticated,admin, navigate]);
 


  const togglePass = () => {
    setShowPass(!showPass);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const res = await axiosInstance.post(endpoints.AUTH.LOGIN, values);
        if (res.status === 200) {
          toast.success("Login successful!",{position: "top-center"});
          dispatch(login(res.data));
        }
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("Invalid email or password.");
        } else {
          console.error("Unexpected error during login:", error);
          // toast.error("Something went wrong, please try again.");
        }
      }
    },
  });

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-overlay">
      <div className="relative bg-grey-light bg-opacity-90 rounded-lg shadow-md p-8 w-96 max-w-md">
        <h2 className="text-center text-2xl font-bold mb-6 text-black-default">
          Glad You&apos;re Back!
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="mt-4 w-full p-2 border border-gray-300 rounded-md focus:ring-green-default  focus:border-green-default"
              placeholder="Email address"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            )}
          </div>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-green-default focus:border-green-default"
              placeholder="Password"
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
            <Link to="/forgot-password" className="text-sm text-grey-dark hover:underline">
              Forgot your password?
            </Link>
          
          <button
            type="submit"
            className="w-full bg-green-button text-black-default py-2 px-4 rounded-lg hover:bg-green-700"
          >
            Sign In
          </button>
        </form>

        <div className="text-center mt-5 mb-5 text-gray-500">Or Sign In With</div>

        <GoogleLogin
        onSuccess={async (credentialResponse) => {
          const post = await axiosInstance.post('http://localhost:8000/api/auth/googleauth', credentialResponse)
          console.log(post,"responsefrontend")
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />

        <div className="text-center mt-4 text-gray-500">
          New Member?{" "}
          <Link to="/register" className="text-blue-link hover:underline">
            Sign Up here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
