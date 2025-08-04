import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, MapPin, Package } from 'lucide-react';
import axios from 'axios';

const BrowsePage = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await axios.get("http://localhost:3003/api/donations");
        console.log('Donations response:', res.data);
        setDonations(res.data.donations || []);
      } catch (error) {
        console.log("Error fetching donations:", error);
        setError("Failed to load donations");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const filteredDonations = donations.filter(donation => {
    if (filter === 'all') return true;
    return donation.category === filter;
  });

  const categories = ['all', 'food', 'clothing', 'medical', 'other'];

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Browse Donations</h1>
          <Link to="/" className="btn btn-ghost">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`btn btn-sm ${filter === category ? 'btn-primary' : 'btn-outline'}`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        
        {loading && (
          <div className="text-center text-primary py-10">
            <span className="loading loading-spinner loading-lg"></span>
            <p>Loading donations...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        {filteredDonations.length === 0 && !loading && !error && (
          <div className="text-center py-10">
            <Package className="w-16 h-16 opacity-50 mx-auto mb-4" />
            <p className="text-lg opacity-70">No donations available in this category.</p>
          </div>
        )}

        {filteredDonations.length > 0 && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonations.map((donation) => (
              <div key={donation._id} className="card bg-base-100 shadow-xl">
                {donation.image && (
                  <figure>
                    <img 
                      src={`http://localhost:3003${donation.image}`}
                      alt={donation.title}
                      className="h-48 w-full object-cover"
                    />
                  </figure>
                )}
                
                <div className="card-body">
                  <h2 className="card-title">{donation.title}</h2>
                  
                  <div className="flex gap-2 mb-2">
                    <div className="badge badge-primary">{donation.category}</div>
                    <div className={`badge ${donation.status === 'available' ? 'badge-success' : 'badge-warning'}`}>
                      {donation.status}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-3">{donation.description}</p>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-semibold">
                      {donation.quantity}
                    </span>
                    {donation.location && (
                      <span className="text-sm text-gray-500">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        {donation.location}
                      </span>
                    )}
                  </div>
                  
                  <div className="card-actions justify-between mt-4">
                    <div className="text-xs text-gray-500">
                      By {donation.donorName} ({donation.donorType})
                    </div>
                    <div className="flex gap-2">
                      <button className="btn btn-primary btn-sm">
                        View Details
                      </button>
                      {donation.status === 'available' && (
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => window.location.href = `mailto:contact@ahaar.org?subject=Regarding Donation: ${donation.title}`}
                        >
                          Contact
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;