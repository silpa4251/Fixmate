import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { TbEyeClosed } from "react-icons/tb";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { providerRegisterApi } from "../../api/AuthApi";
import { providerRegisterValidationSchema } from "../../utils/validationSchemas";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const ProviderRegister = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  // const [selectedFile, setSelectedFile] = useState(null);

  const togglePass = () => setShowPass(!showPass);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(providerRegisterValidationSchema),
    mode: "onBlur",
  });

  const onSubmit = async (values) => {
    try {
      const address = [
        {
        place: values.place,
        district: values.district,
        state: values.state,
        pincode: values.pincode,
    }];
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, place, district, state, pincode, ...dataToSend } = values;
      dataToSend.address = address;
      await providerRegisterApi(dataToSend);

      toast.success("Registration successful!");
      navigate("/provider/login");
    } catch (error) {
      console.error(error.response?.data || "Registration failed.");
      toast.error("Something went wrong. Please try again.");
    }
  };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setSelectedFile(file);
  //   }
  // };

  return (
    <div className="bg-overlay bg-cover bg-center min-h-screen flex flex-col justify-center items-center p-28">
    <div className="bg-grey-light bg-opacity-90 p-8 rounded-lg shadow-md w-96 mt-1">
      <h2 className="text-2xl font-bold text-center mb-6 text-black-default">Join with us</h2>
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        {...register("name")}
        placeholder="Full Name"
        className={`w-full p-2 border ${
          errors.name ? "border-red-500" : "border-gray-300"
        } rounded-md`}
      />
      {errors.name && <div className="text-red-500 text-sm">{errors.name.message}</div>}

      <input
        type="email"
        {...register("email")}
        placeholder="Email"
        className={`w-full p-2 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-md`}
      />
      {errors.email && <div className="text-red-500 text-sm">{errors.email.message}</div>}

      <div className="relative">
        <input
          type={showPass ? "text" : "password"}
          {...register("password")}
          placeholder="Password"
          className={`w-full p-2 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md`}
        />
        <span onClick={togglePass} className="absolute right-3 top-3 cursor-pointer">
          {showPass ? <FaEye /> : <TbEyeClosed />}
        </span>
      </div>
      {errors.password && <div className="text-red-500 text-sm">{errors.password.message}</div>}

      <input
        type="password"
        {...register("confirmPassword")}
        placeholder="Confirm Password"
        className={`w-full p-2 border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} rounded-md`}
      />
      {errors.confirmPassword && <div className="text-red-500 text-sm">{errors.confirmPassword.message}</div>}

      {/* Aligning street and city fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
        <input
          type="text"
          {...register("place")}
          placeholder="Place"
          className={`w-full p-2 border ${errors.place ? "border-red-500" : "border-gray-300"} rounded-md`}
        />
        {errors.place && <div className="text-red-500 text-sm">{errors.place.message}</div>}
        </div>
        <div>
        <input
          type="text"
          {...register("district")}
          placeholder="District"
          className={`w-full p-2 border ${errors.district ? "border-red-500" : "border-gray-300"} rounded-md`}
        />
        {errors.district && <div className="text-red-500 text-sm">{errors.district.message}</div>}
        </div>
      </div>

      {/* Aligning state and pincode fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
        <input
          type="text"
          {...register("state")}
          placeholder="State"
          className={`w-full p-2 border ${errors.state ? "border-red-500" : "border-gray-300"} rounded-md`}
        />
        {errors.state && <div className="text-red-500 text-sm">{errors.state.message}</div>}
        </div>
        <div>
        <input
          type="text"
          {...register("pincode")}
          placeholder="Pincode"
          className={`w-full p-2 border ${errors.pincode ? "border-red-500" : "border-gray-300"} rounded-md`}
        />
        {errors.pincode && <div className="text-red-500 text-sm">{errors.pincode.message}</div>}
        </div>
      </div>

      <select
        {...register("services")}
        className={`w-full p-2 border ${errors.services ? "border-red-500" : "border-gray-300"} rounded-md`}
      >
        <option value="">Select a Service</option>
        <option value="Electrician">Electrician</option>
        <option value="Plumber">Plumber</option>
        <option value="Carpenter">Carpenter</option>
        <option value="HVAC Maintenance">HVAC Maintenance</option>
        <option value="Cleaning Services">Cleaning Services</option>
        <option value="Home Appliance Repair">Home Appliance Repair</option>
        <option value="Ac repair">Ac repair</option>
        <option value="Mechanic">Mechanic</option>
        <option value="Painting">Painting</option>
        <option value="Pest Control">Pest Control</option>
        <option value="IT and Gadget Repairs">IT and Gadget Repairs</option>
        <option value="Handyman Services">Handyman Services</option>
        <option value="Security Services">Security Services</option>
       
      </select>
      {errors.services && <div className="text-red-500 text-sm">{errors.services.message}</div>}

      {/* <div className="flex items-center">
        <label className="mr-2">Upload Certifications</label>
        <input
          type="file"
          name="certifications"
          className="p-2 w-56 bg-gray-200 border border-gray-300 rounded-md"
          onChange={handleFileChange}
        />
      </div> */}
      {/* {errors.certifications && <div className="text-red-500 text-sm">{errors.certifications.message}</div>} */}

      <button
            type="submit"
            className="w-full bg-green-button text-black-default  p-2 rounded-md hover:bg-green-700"
          >
            Sign Up
          </button>

          <div className="text-center mt-5 mb-5 text-gray-500">Or Sign In With</div>

        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            const res = await axios.post("http://localhost:8000/api/auth/googleauth/provider", credentialResponse);
            toast.success("Google Login Successful!");
            navigate("/provider/dashboard");
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.user.role);

            
          }}
          onError={() => {
            toast.error("Google Login Failed");
          }}
        />
      </form>
      <div className="text-center mt-4 text-gray-500">
        Have an account?{" "}
          <Link to="/login/provider" className="text-blue-link hover:underline">
            Sign in here
          </Link>
          </div>
  </div>
</div>

  );
};

export default ProviderRegister;
