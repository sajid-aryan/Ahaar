import { useState, useEffect } from "react";
import { Link } from 'react-router';
import { ArrowLeft, MapPin, Package, Calendar, User, Star, Trash2, Edit, X, Save } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { formatDate } from '../../utils/date';
import toast from 'react-hot-toast';

const MyDonationsPage = () => {
  const { user } = useAuthStore();
  const [myDonations, setMyDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    const fetchMyDonations = async () => {
      try {
        const res = await axios.get(`http://localhost:3004/api/donations/my/${user._id}`, {
          withCredentials: true
        });
        console.log('My donations response:', res.data);
        setMyDonations(res.data.donations || []);
      } catch (error) {
        console.log("Error fetching my donations:", error);
        setError("Failed to load your donations");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchMyDonations();
    } else {
      setLoading(false);
      setError("Please log in to view your donations.");
    }
  }, [user]);

  const handleDeleteDonation = async (donationId) => {
    if (!confirm('Are you sure you want to delete this donation? This action cannot be undone.')) {
      return;
    }

    setDeletingId(donationId);
    
    try {
      const response = await axios.delete(`http://localhost:3004/api/donations/${donationId}`, {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success('Donation deleted successfully!');
        // Remove the deleted donation from local state
        setMyDonations(prevDonations => 
          prevDonations.filter(donation => donation._id !== donationId)
        );
      }
    } catch (error) {
      console.error('Error deleting donation:', error);
      toast.error(error.response?.data?.message || 'Failed to delete donation');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditStart = (donation) => {
    setEditingId(donation._id);
    setEditFormData({
      title: donation.title,
      description: donation.description,
      category: donation.category,
      quantity: donation.quantity,
      location: donation.location
    });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleEditSave = async () => {
    if (!editFormData.title || !editFormData.description || !editFormData.category || 
        !editFormData.quantity || !editFormData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3004/api/donations/${editingId}`, 
        editFormData, 
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Donation updated successfully!');
        // Update the donation in local state
        setMyDonations(prevDonations => 
          prevDonations.map(donation => 
            donation._id === editingId 
              ? { ...donation, ...editFormData }
              : donation
          )
        );
        setEditingId(null);
        setEditFormData({});
      }
    } catch (error) {
      console.error('Error updating donation:', error);
      toast.error(error.response?.data?.message || 'Failed to update donation');
    }
  };

  const handleEditChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const canEdit = (donation) => {
    return donation.status === 'available';
  };

  const canDelete = (donation) => {
    return donation.status === 'available';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-slate-100 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 opacity-50 mx-auto mb-4" />
          <p className="text-lg opacity-70 mb-4">Please log in to view your donations.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-slate-100 to-green-50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Donations</h1>
          <Link to="/browse" className="btn btn-ghost">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Browse
          </Link>
        </div>
        
        {loading && (
          <div className="text-center text-primary py-10">
            <span className="loading loading-spinner loading-lg"></span>
            <p>Loading your donations...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        {myDonations.length === 0 && !loading && !error && (
          <div className="text-center py-10">
            <Package className="w-16 h-16 opacity-50 mx-auto mb-4" />
            <p className="text-lg opacity-70 mb-4">You haven't created any donations yet.</p>
            <Link to="/create-donation" className="btn btn-primary">Create Your First Donation</Link>
          </div>
        )}

        {myDonations.length > 0 && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myDonations.map((donation) => (
              <div key={donation._id} className="card bg-base-100 shadow-xl border border-blue-200">
                {donation.image && (
                  <figure>
                    <img 
                      src={`http://localhost:3004${donation.image}`}
                      alt={donation.title}
                      className="h-48 w-full object-cover"
                    />
                  </figure>
                )}
                
                <div className="card-body">
                  {editingId === donation._id ? (
                    // Edit mode
                    <div className="space-y-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Title</span>
                        </label>
                        <input
                          type="text"
                          value={editFormData.title || ''}
                          onChange={(e) => handleEditChange('title', e.target.value)}
                          className="input input-bordered input-sm"
                          placeholder="Donation title"
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Description</span>
                        </label>
                        <textarea
                          value={editFormData.description || ''}
                          onChange={(e) => handleEditChange('description', e.target.value)}
                          className="textarea textarea-bordered textarea-sm h-20"
                          placeholder="Donation description"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-semibold">Category</span>
                          </label>
                          <select
                            value={editFormData.category || ''}
                            onChange={(e) => handleEditChange('category', e.target.value)}
                            className="select select-bordered select-sm"
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
                            <span className="label-text font-semibold">Quantity</span>
                          </label>
                          <input
                            type="text"
                            value={editFormData.quantity || ''}
                            onChange={(e) => handleEditChange('quantity', e.target.value)}
                            className="input input-bordered input-sm"
                            placeholder="e.g., 50 meals"
                          />
                        </div>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Location</span>
                        </label>
                        <input
                          type="text"
                          value={editFormData.location || ''}
                          onChange={(e) => handleEditChange('location', e.target.value)}
                          className="input input-bordered input-sm"
                          placeholder="Pickup location"
                        />
                      </div>

                      <div className="flex gap-2 justify-end">
                        <button 
                          className="btn btn-ghost btn-sm"
                          onClick={handleEditCancel}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={handleEditSave}
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <>
                      <h2 className="card-title">{donation.title}</h2>
                      
                      <div className="flex gap-2 mb-2">
                        <div className="badge badge-primary">{donation.category}</div>
                        <div className={`badge ${
                          donation.status === 'available' ? 'badge-success' : 
                          donation.status === 'claimed' ? 'badge-warning' :
                          donation.status === 'completed' ? 'badge-info' : 'badge-error'
                        }`}>
                          {donation.status}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-3">{donation.description}</p>
                      
                      <div className="space-y-2 mt-4">
                        <div className="flex items-center text-sm">
                          <Package className="w-4 h-4 mr-2 text-primary" />
                          <span className="font-semibold">Quantity:</span>
                          <span className="ml-1">{donation.quantity}</span>
                        </div>
                        
                        {donation.location && (
                          <div className="flex items-center text-sm">
                            <MapPin className="w-4 h-4 mr-2 text-primary" />
                            <span className="font-semibold">Location:</span>
                            <span className="ml-1">{donation.location}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-primary" />
                          <span className="font-semibold">Created:</span>
                          <span className="ml-1">{formatDate(donation.createdAt)}</span>
                        </div>
                        
                        {donation.status === 'claimed' && donation.claimerName && (
                          <div className="flex items-center text-sm">
                            <User className="w-4 h-4 mr-2 text-warning" />
                            <span className="font-semibold">Claimed by:</span>
                            <span className="ml-1">{donation.claimerName}</span>
                          </div>
                        )}

                        {donation.ratings && donation.ratings.length > 0 && (
                          <div className="flex items-center text-sm">
                            <Star className="w-4 h-4 mr-2 text-yellow-500" />
                            <span className="font-semibold">Average Rating:</span>
                            <span className="ml-1">
                              {(donation.ratings.reduce((sum, r) => sum + r.rating, 0) / donation.ratings.length).toFixed(1)}/5
                              ({donation.ratings.length} rating{donation.ratings.length !== 1 ? 's' : ''})
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="card-actions justify-between mt-4">
                        <div className="text-xs text-primary font-medium">
                          ✓ Created by you
                          {!canEdit(donation) && !canDelete(donation) && (
                            <div className="text-gray-500 mt-1">
                              {donation.status === 'claimed' ? 'Cannot edit/delete claimed donations' : 
                               donation.status === 'expired' ? 'Cannot edit/delete expired donations' : 
                               'Cannot edit/delete this donation'}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {canEdit(donation) && (
                            <button 
                              className="btn btn-primary btn-sm"
                              onClick={() => handleEditStart(donation)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </button>
                          )}
                          {canDelete(donation) && (
                            <button 
                              className={`btn btn-error btn-sm ${deletingId === donation._id ? 'loading' : ''}`}
                              onClick={() => handleDeleteDonation(donation._id)}
                              disabled={deletingId === donation._id}
                            >
                              {deletingId === donation._id ? (
                                'Deleting...'
                              ) : (
                                <>
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Delete
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDonationsPage;
