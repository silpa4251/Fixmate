import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { User, Mail, Phone, MapPin, Camera, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

const Profile = () => {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const queryClient = useQueryClient();
  
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: [{ place: '', district: '', state: '', pincode: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "address"
  });

  // Fetch profile data query
  const { isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await axiosInstance.get('/users/profile');
      const data = response.data.data.profile;
      
      reset({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address?.length ? data.address : [{ place: '', district: '', state: '', pincode: '' }]
      });
      
      setImage(data.image);
      return data;
    },
    onError: (error) => {
      toast.error('Failed to fetch profile data. Please try again later.', {
        position: "bottom-right",
        autoClose: 3000
      });
      console.error('Error fetching profile:', error);
    }
  });

  // Update profile mutation
  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.put('/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Profile updated successfully!', {
        position: "bottom-right",
        autoClose: 3000
      });
      setImageFile(null); // Reset image file after successful upload
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update profile. Please try again.', {
        position: "bottom-right",
        autoClose: 3000
      });
      console.error('Error updating profile:', err);
    }
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB', {
          position: "bottom-right",
          autoClose: 3000
        });
        return;
      }
      
      // Preview the image locally
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
      
      toast.info('Image selected! Click Save Changes to update your profile picture.', {
        position: "bottom-right",
        autoClose: 3000
      });
    }
  };

  const onSubmit = (formData) => {
    const submitData = new FormData();
    
    // Append form data
    Object.keys(formData).forEach(key => {
      if (key === 'address') {
        submitData.append(key, JSON.stringify(formData[key]));
      } else {
        submitData.append(key, formData[key]);
      }
    });

    // Append image if there's a new one
    if (imageFile) {
      submitData.append('image', imageFile);
    }
    
    updateProfile(submitData);
  };

  if (isLoadingProfile && !image) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-pale p-4 md:p-6 lg:p-8">
      
      <div className="max-w-4xl mx-auto bg-white-default rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 mt-20">
          <h1 className="text-2xl font-bold text-gray-900 text-center">Profile Settings</h1>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
          
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <img
                  src={image || '/api/placeholder/150/150'}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                />
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                  <input
                    type="file"
                    id="profile-image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500">Click the camera icon to change your profile picture</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <input
                    {...register('name', {
                      required: 'Name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' }
                    })}
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </label>
                  <input
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                        message: 'Invalid phone number'
                      }
                    })}
                    type="tel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                    <MapPin className="w-5 h-5" />
                    Address
                  </h3>
                  <button
                    type="button"
                    onClick={() => append({ place: '', district: '', state: '', pincode: '' })}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add Address
                  </button>
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-700">Address {index + 1}</h4>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Place</label>
                        <input
                          {...register(`address.${index}.place`, { required: 'Place is required' })}
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        />
                        {errors.address?.[index]?.place && (
                          <p className="text-red-500 text-sm mt-1">{errors.address[index].place.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">District</label>
                        <input
                          {...register(`address.${index}.district`, { required: 'District is required' })}
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        />
                        {errors.address?.[index]?.district && (
                          <p className="text-red-500 text-sm mt-1">{errors.address[index].district.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">State</label>
                        <input
                          {...register(`address.${index}.state`, { required: 'State is required' })}
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        />
                        {errors.address?.[index]?.state && (
                          <p className="text-red-500 text-sm mt-1">{errors.address[index].state.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Pincode</label>
                        <input
                          {...register(`address.${index}.pincode`, {
                            required: 'Pincode is required',
                            pattern: {
                              value: /^[0-9]{5,6}$/,
                              message: 'Invalid pincode'
                            }
                          })}
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        />
                        {errors.address?.[index]?.pincode && (
                          <p className="text-red-500 text-sm mt-1">{errors.address[index].pincode.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-start pt-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full md:w-auto font-semibold px-6 py-2 bg-green-500 text-white-default rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:bg-green-400"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;