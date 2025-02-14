/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Trash2, Upload, Plus, X } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: [{ place: '', district: '', state: '', pincode: '' }],
    services: [],
    charge: '',
    image: '',
    certifications: []
  });
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get('/providers/profile');
      const profileData = response.data.provider;
      setProfile(profileData);
      if (profileData.image) {
        setPreviewImage(profileData.image);
      }
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching profile');
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axiosInstance.post('/providers/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const imageUrl = response.data.image;
      setProfile(prev => ({ ...prev, image: imageUrl }));
      setPreviewImage(imageUrl);
      URL.revokeObjectURL(previewUrl);
      toast.success('Profile picture updated');
    } catch (error) {
      setPreviewImage(profile.image);
      toast.error('Error uploading image');
    }
  };

  const handleCertificateUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    for (const file of files) {
      // if (!file.type.match('application/pdf')) {
      //   toast.error('Please upload PDF files only');
      //   return;
      // }

      const formData = new FormData();
      files.forEach(file => formData.append('certificate', file));

      try {
        const response = await axiosInstance.post('/providers/upload-certificate', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setProfile(prev => ({
          ...prev,
          certifications: [...prev.certifications, response.data.certificateUrl]
        }));
      } catch (error) {
        toast.error('Error uploading certificate');
      }
    }
  };

  const handleAddressChange = (index, field, value) => {
    const newaddress = [...profile.address];
    newaddress[index] = { ...newaddress[index], [field]: value };
    setProfile(prev => ({ ...prev, address: newaddress }));
  };

  const handleServiceChange = (index, field, value) => {
    const newServices = [...profile.services];
    newServices[index] = { ...newServices[index], [field]: value };
    setProfile(prev => ({ ...prev, services: newServices }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put('/providers/profile', profile);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Image */}
          <div className="bg-white-default p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-black-default">Profile Picture</h2>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={previewImage || profile.image || '/placeholder-avatar.png'}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                />
                <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600">
                  <Upload className="w-4 h-4 text-white-default" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white-default p-6 rounded-lg shadow-sm space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-black-default">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border rounded-lg text-black-default"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-2 border rounded-lg text-black-default"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full p-2 border rounded-lg text-black-default"
              />
            </div>
          </div>

          {/* address */}
          <div className="bg-white-default p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-black-default">Address</h2>
              <button
                type="button"
                onClick={() => setProfile(prev => ({
                  ...prev,
                  address: [...prev.address, { place: '', district: '', state: '', pincode: '' }]
                }))}
                className="flex items-center text-blue-500 hover:text-blue-600"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Address
              </button>
            </div>

            {profile.address.map((address, index) => (
              <div key={index} className="p-4 border rounded-lg mb-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Address {index + 1}</h3>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => setProfile(prev => ({
                        ...prev,
                        address: prev.address.filter((_, i) => i !== index)
                      }))}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Place
                    </label>
                    <input
                      type="text"
                      value={address.place}
                      onChange={(e) => handleAddressChange(index, 'place', e.target.value)}
                      className="w-full p-2 border rounded-lg text-black-default"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      District
                    </label>
                    <input
                      type="text"
                      value={address.district}
                      onChange={(e) => handleAddressChange(index, 'district', e.target.value)}
                      className="w-full p-2 border rounded-lg text-black-default"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                      className="w-full p-2 border rounded-lg text-black-default"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={address.pincode}
                      onChange={(e) => handleAddressChange(index, 'pincode', e.target.value)}
                      className="w-full p-2 border rounded-lg text-black-default"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Services */}
          <div className="bg-white-default p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-black-default">Services</h2>
            </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Name
                    </label>
                    <input
                      type="text"
                      value={profile.services[0] || " "}
                      onChange={(e) => setProfile(prev => ({ 
                        ...prev, 
                        services: [e.target.value] // Update as single item array
                      }))}
                      className="w-full p-2 border rounded-lg text-black-default"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Charge (₹)
                    </label>
                    <input
                      type="number"
                      value={profile.charge || " "}
                      onChange={(e) => setProfile(prev => ({ 
                        ...prev, 
                        charge: e.target.value 
                      }))}
                      className="w-full p-2 border rounded-lg text-black-default"
                    />
                  </div>
                </div>
          </div>

          {/* certifications */}
          <div className="bg-white-default p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-black-default">certifications</h2>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                {profile.certifications.map((cert, index) => (
                  <div key={index} className="relative">
                    <a
                      href={cert}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 border rounded-lg hover:bg-gray-50"
                    >
                      Certificate {index + 1}
                    </a>
                    <button
                      type="button"
                      onClick={() => setProfile(prev => ({
                        ...prev,
                        certifications: prev.certifications.filter((_, i) => i !== index)
                      }))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="flex items-center justify-center w-full h-32 px-4 transition bg-white-default border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-gray-400">
                  <div className="flex flex-col items-center space-y-2">
                    <Upload className="w-6 h-6 text-gray-600" />
                    <span className="text-gray-600">Upload certifications (IMG)</span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    multiple
                    onChange={handleCertificateUpload}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-500 text-white-default px-6 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;