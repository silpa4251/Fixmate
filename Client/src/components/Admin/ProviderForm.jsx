/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const ProviderForm = ({ provider, onClose, isOpen }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      services: "",
      password: "",
      confirmPassword: "",
      availability: true,
    }
  });

  const password = watch("password");

  useEffect(() => {
    if (provider) {
      setValue("name", provider.name || "");
      setValue("email", provider.email || "");
      setValue("services", provider.services || "");
      setValue("availability", provider.availability|| false);
    } else {
      reset();
    }
  }, [provider, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      const endpoint = provider ? `/admin/providers/${provider._id}` : "/admin/providers";
      const method = provider ? "patch" : "post";

      const submitData = {
        name: data.name,
        email: data.email,
        services: data.services,
        availability: data.availability,
      };

      if (!provider || data.password) {
        submitData.password = data.password;
      }

      const response = await axiosInstance[method](endpoint, submitData);

      if (response.data.status === "success") {
        toast.success(
          provider ? "Provider updated successfully" : "Provider created successfully"
        );
        onClose(true);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to save provider";
      toast.error(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black-default bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white-default rounded-lg p-6 w-full max-w-md relative">
        <button onClick={() => onClose(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4">{provider ? "Edit Provider" : "Add New Provider"}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" {...register("name", { required: "Name is required" })} className="w-full px-3 py-2 border rounded-lg text-black-default" placeholder="Enter name" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" {...register("email", { required: "Email is required" })} className="w-full px-3 py-2 border rounded-lg text-black-default" placeholder="Enter email" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
            <input type="text" {...register("services", { required: "Service type is required" })} className="w-full px-3 py-2 border rounded-lg text-black-default" placeholder="Enter service type" />
            {errors.services && <p className="text-red-500 text-xs mt-1">{errors.services.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password {provider && "(Leave blank to keep unchanged)"}</label>
            <input type="password" {...register("password", { minLength: { value: 4, message: "Password must be at least 4 characters" } })} className="w-full px-3 py-2 border rounded-lg text-black-default" placeholder="Enter password" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input type="password" {...register("confirmPassword", { validate: value => !password || value === password || "Passwords do not match" })} className="w-full px-3 py-2 border rounded-lg text-black-default" placeholder="Confirm password" />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register("availability")}
                  value="true"
                  className="form-radio h-4 w-4 text-green-600"
                />
                <span className="ml-2 text-gray-700">Available</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register("availability")}
                  value="false"
                  className="form-radio h-4 w-4 text-red-600"
                />
                <span className="ml-2 text-gray-700">Unavailable</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button type="button" onClick={() => onClose(false)} className="px-4 py-2 bg-gray-400 rounded-lg hover:bg-gray-500">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" disabled={isSubmitting}>{isSubmitting ? "Saving..." : provider ? "Update Provider" : "Create Provider"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProviderForm;