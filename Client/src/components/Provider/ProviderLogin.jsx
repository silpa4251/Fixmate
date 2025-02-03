import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { TbEyeClosed } from "react-icons/tb";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../../redux/authSlice";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { providerLoginApi } from "../../api/AuthApi";
import { userLoginValidationSchema } from "../../utils/validationSchemas";


const ProviderLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPass, setShowPass] = useState(false);

  const togglePass = () => {
    setShowPass(!showPass);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userLoginValidationSchema),
    mode: "onBlur",
  });

  const onSubmit = async (values) => {
    try {
      const res = await providerLoginApi(values);
      if (res.status === 200) {
        toast.success("Login successful!", { position: "top-center" });
        dispatch(login(res.data.data));
        navigate("/provider/dashboard");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "An error occurred");
      } else {
        toast.error("Server error. Please try again.");
      }
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-overlay">
      <div className="relative bg-grey-light bg-opacity-90 rounded-lg shadow-md p-8 w-96 max-w-md">
        <h2 className="text-center text-2xl font-bold mb-6 text-black-default">
        Glad You&apos;re Back!
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              {...register("email")}
              className={`mt-4 w-full p-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:ring-green-default focus:border-green-default`}
              placeholder="Email address"
            />
            {errors.email && (
              <div className="text-red-500 text-sm">{errors.email.message}</div>
            )}
          </div>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              {...register("password")}
              className={`mt-1 block w-full p-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md focus:ring-green-default focus:border-green-default`}
              placeholder="Password"
            />
            <span
              onClick={togglePass}
              className="absolute right-3 top-3 cursor-pointer"
            >
              {showPass ? <FaEye /> : <TbEyeClosed />}
            </span>
            {errors.password && (
              <div className="text-red-500 text-sm">{errors.password.message}</div>
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
            const res = await axios.post("http://localhost:8000/api/auth/googleauth/provider", credentialResponse);
            toast.success("Google Login Successful!");
            localStorage.setItem("isAuth", true);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.user.role);

            navigate("/provider/dashboard");
          }}
          onError={() => {
            toast.error("Google Login Failed");
          }}
        />

        <div className="text-center mt-4 text-gray-500">
          New Provider?{" "}
          <Link to="/provider/register" className="text-blue-link hover:underline">
            Sign Up here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProviderLogin;
