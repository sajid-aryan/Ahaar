import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Hero = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <section className="text-center py-40 px-6 ">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">Give More, Waste Less – Empower Communities with Ahaar</h1>
      <p className="py-10 text-lg font-medium font-sans text-neutral-600">
        A platform where restaurants and individuals donate surplus food, clothes, and essentials to NGOs helping those in need.
      </p>
      <div className="flex justify-center gap-10">
        {isAuthenticated ? (
          <>
            {user?.userType === 'ngo' ? (
              <>
                <Link to="/browse" className="btn btn-primary transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg transform">Browse & Claim Donations</Link>
                <Link to="/claimed-donations" className="btn btn-outline btn-success transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg transform">My Claimed Donations</Link>
              </>
            ) : (
              <>
                <Link to="/create-donation" className="btn btn-success transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg transform">Start Donating</Link>
                <Link to="/browse" className="btn btn-outline btn-success transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg transform">Browse Donations</Link>
              </>
            )}
          </>
        ) : (
          <>
            <Link to="/signup" className="btn btn-success transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg transform">Get Started</Link>
            {/* <Link to="/browse" className="btn btn-outline btn-accent">Browse Donations</Link> */}
          </>
        )}
      </div>
    </section>
  );
};

export default Hero;