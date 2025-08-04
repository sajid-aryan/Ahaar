import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { ArrowLeft, MapPin, Clock, Package, AlertCircle, Upload, X } from 'lucide-react';
import axios from 'axios';

const CreateDonationPage = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    quantity: '',
    location: '',
    expiryDate: '',
    pickupInstructions: '',
    contactPhone: '',
    // Sample donor info (for demo purposes without user auth)
    donorName: 'Demo Restaurant',
    donorType: 'restaurant'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear expiry date when clothing is selected
    if (name === 'category' && value === 'clothing') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        expiryDate: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }
      
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create FormData for multipart upload
      const formDataToSend = new FormData();
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add hardcoded donor information for demo purposes
      formDataToSend.append('donorId', '65421f8b3c69c28f7acd88b9'); // Demo donor ID
      
      // Add image if selected
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      const response = await axios.post('http://localhost:3003/api/donations', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        navigate('/browse'); // Redirect to browse page instead of dashboard
      }
    } catch (error) {
      console.error('Error creating donation:', error);
      setError(error.response?.data?.message || 'Failed to create donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Create New Donation</h1>
          <Link to="/" className="btn btn-ghost">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
        <div className="max-w-2xl mx-auto">
          {error && (
            <div className="alert alert-error mb-6">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="card bg-base-200 shadow-xl">
            <div className="card-body">
              {/* Title */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Title *</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Fresh vegetables and fruits"
                  className="input input-bordered"
                  required
                />
              </div>

              {/* Description */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Description *</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the items, condition, and any special notes..."
                  className="textarea textarea-bordered h-24"
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    <Upload className="w-4 h-4 inline mr-1" />
                    Donation Image
                  </span>
                </label>
                <div className="border-2 border-dashed border-base-300 rounded-lg p-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 btn btn-circle btn-sm btn-error"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-12 h-12 mx-auto text-base-300 mb-2" />
                      <label htmlFor="image-upload" className="btn btn-outline cursor-pointer">
                        Choose Image
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <p className="text-sm text-base-content/70 mt-2">
                        Upload an image of your donation (Max 5MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Category and Quantity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Category *</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="select select-bordered"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="food">Food</option>
                    <option value="clothing">Clothing</option>
                    <option value="medical">Medical Supplies</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Quantity *</span>
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="e.g., 50 meals, 20 bags"
                    className="input input-bordered"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location *
                  </span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Address or area for pickup"
                  className="input input-bordered"
                  required
                />
              </div>

              {/* Expiry Date */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Expiry/Available Until
                    {formData.category === 'clothing' && (
                      <span className="text-sm text-base-content/60 ml-2">(Not applicable for clothing)</span>
                    )}
                  </span>
                </label>
                <input
                  type="datetime-local"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className={`input input-bordered ${formData.category === 'clothing' ? 'input-disabled bg-base-200' : ''}`}
                  disabled={formData.category === 'clothing'}
                />
              </div>

              {/* Pickup Instructions */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    <Package className="w-4 h-4 inline mr-1" />
                    Pickup Instructions
                  </span>
                </label>
                <textarea
                  name="pickupInstructions"
                  value={formData.pickupInstructions}
                  onChange={handleChange}
                  placeholder="Any special instructions for pickup..."
                  className="textarea textarea-bordered h-20"
                />
              </div>

              {/* Contact Phone */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Contact Phone</span>
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="Phone number for coordination"
                  className="input input-bordered"
                />
              </div>

              {/* Submit Button */}
              <div className="form-control mt-6">
                <button 
                  type="submit" 
                  className={`btn btn-success ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Donation'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDonationPage;
