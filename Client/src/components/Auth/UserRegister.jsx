import { useForm } from "react-hook-form";
import { GoogleLogin } from "@react-oauth/google";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { TbEyeClosed } from "react-icons/tb";
import { toast } from "react-toastify";
import { userRegisterApi } from "../../api/AuthApi";
import { userRegistrationValidationSchema } from "../../utils/validationSchemas";
import { useState } from "react";
import axios from "axios";

const UserRegister = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const togglePass = () => setShowPass(!showPass);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userRegistrationValidationSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      const { name, email, password } = data;
      const dataToSend = { name, email, password };

      await userRegisterApi(dataToSend);

      toast.success("User registration successful!");
      navigate("/user/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="bg-overlay bg-cover bg-center min-h-screen flex flex-col justify-center items-center">
      <div className="bg-grey-light bg-opacity-90 p-8 rounded-lg shadow-md w-96 mt-1">
        <h2 className="text-2xl font-bold text-center mb-6 text-black-default">
          Happy You&apos;re Here!
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              type="text"
              placeholder="Full Name"
              {...register("name")}
              className={`w-full p-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            {errors.name && (
              <div className="text-red-500 text-sm">{errors.name.message}</div>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="E-mail"
              {...register("email")}
              className={`w-full p-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            {errors.email && (
              <div className="text-red-500 text-sm">{errors.email.message}</div>
            )}
          </div>

          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className={`w-full p-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md`}
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

          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword")}
              className={`w-full p-2 border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            {errors.confirmPassword && (
              <div className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-button text-black-default  p-2 rounded-md hover:bg-green-700"
          >
            Sign Up
          </button>

          <div className="my-4 text-center text-gray-600">Or Sign In With</div>
          <GoogleLogin
          onSuccess={async (credentialResponse) => {
            const res = await axios.post(
              "http://localhost:8000/api/auth/googleauth",
              credentialResponse
            );
            toast.success("Google Login Successful!");
            localStorage.setItem('token', res.data.token);
            // localStorage.setItem("role", res.data.user.role);

            if (res.data.user.role === "Admin") navigate("/admin/dashboard");
            else navigate("/home")
          }}
          onError={() => {
            console.log("Login Failed");
            toast.error("Google Login Failed");
          }}
        />
        </form>
          
        <div className="text-center mt-4 text-gray-500">
        Have an account?{" "}
          <Link to="/user/login" className="text-blue-link hover:underline">
            Sign in here
          </Link>
          </div>
      </div>
    </div>
  );
};

export default UserRegister;
