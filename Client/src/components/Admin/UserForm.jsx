import { useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const UserForm = ({ user, onClose, isOpen }) => {
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
      password: "",
      confirmPassword: ""
    }
  });

  const password = watch("password");

  useEffect(() => {
    if (user) {
      // Set form values when editing a user
      setValue("name", user.name || "");
      setValue("email", user.email || "");
    } else {
      // Reset form when adding a new user
      reset();
    }
  }, [user, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      const endpoint = user ? `/admin/users/${user._id}` : "/admin/users";
      const method = user ? "patch" : "post";
      
      // Prepare submit data
      const submitData = {
        name: data.name,
        email: data.email
      };

      // Only include password if it's a new user or if password is being updated
      if (!user || data.password) {
        submitData.password = data.password;
      }

      const response = await axiosInstance[method](endpoint, submitData);

      if (response.data.status === "success") {
        toast.success(
          user
            ? "User updated successfully"
            : "User created successfully"
        );
        onClose(true); // true indicates that we need to refresh the list
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to save user";
      toast.error(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black-default bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white-default rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={() => onClose(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4">
          {user ? "Edit User" : "Add New User"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 text-black-default border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.name ? "border-red-500" : ""
              }`}
              placeholder="Enter name"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters"
                }
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className={`w-full px-3 text-black-default py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.email ? "border-red-500" : ""
              }`}
              placeholder="Enter email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password {user && "(Leave blank to keep unchanged)"}
            </label>
            <input
              type="password"
              className={`w-full px-3 py-2 border text-black-default rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.password ? "border-red-500" : ""
              }`}
              placeholder="Enter password"
              {...register("password", {
                minLength: {
                  value: 4,
                  message: "Password must be at least 4 characters"
                },
                required: !user ? "Password is required" : false
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              className={`w-full px-3 py-2 text-black-default border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
              placeholder="Confirm password"
              {...register("confirmPassword", {
                validate: value =>
                  !password || value === password || "Passwords do not match"
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-400 rounded-lg hover:bg-gray-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : user ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;