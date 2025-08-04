import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Hero = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="text-center py-40 px-6 bg-base-100">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Give More, Waste Less – Empower Communities with Ahaar</h1>
      <p className="py-10 text-lg font-medium font-sans text-neutral-600">
        A platform where restaurants and individuals donate surplus food, clothes, and essentials to NGOs helping those in need.
      </p>
      <div className="flex justify-center gap-10">
        {isAuthenticated ? (
          <>
            <Link to="/create-donation" className="btn btn-success">Start Donating</Link>
            <Link to="/browse" className="btn btn-outline btn-accent">Browse Donations</Link>
          </>
        ) : (
          <>
            <Link to="/signup" className="btn btn-success">Get Started</Link>
            <Link to="/browse" className="btn btn-outline btn-accent">Browse Donations</Link>
          </>
        )}
      </div>
    </section>
  );
};

export default Hero;