import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Hero = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <section className="text-center py-40 px-6 ">
      {isAuthenticated && user ? (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Welcome back, {user.name}! 👋
          </h2>
          <p className="text-lg text-gray-600 capitalize">
            Ready to make a difference?
          </p>
        </div>
      ) : null}
      
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">Give More, Waste Less – Empower Communities with Ahaar</h1>
      <p className="py-10 text-lg font-medium font-sans text-neutral-600">
        A platform where restaurants and individuals donate surplus food, clothes, and essentials to NGOs helping those in need.
      </p>
      <div className="flex justify-center gap-6 flex-wrap">
        {isAuthenticated ? (
          <>
            {user?.userType === 'ngo' ? (
              <>
                <Link to="/browse" className="btn btn-primary transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg transform">Browse & Claim Donations</Link>
                <Link to="/claimed-donations" className="btn btn-outline btn-success transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg transform">My Claimed Donations</Link>
                <Link to="/manage-profile" className="btn btn-outline btn-secondary transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg transform">Manage Profile</Link>
              </>
            ) : (
              <>
                <Link to="/create-donation" className="btn btn-success transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg transform">Start Donating</Link>
                <Link to="/browse" className="btn btn-outline btn-success transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg transform">Browse Donations</Link>
                <Link to="/ngo-profiles" className="btn btn-outline btn-info transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg transform">See How You Can Help</Link>
              </>
            )}
          </>
        ) : (
          <>
            <Link to="/signup" className="btn btn-success transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg transform">Get Started</Link>
            <Link to="/ngo-profiles" className="btn btn-outline btn-info transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg transform">See How You Can Help</Link>
          </>
        )}
      </div>
    </section>
  );
};

export default Hero;