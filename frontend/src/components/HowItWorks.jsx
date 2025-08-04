import { Store, MapPin, Truck, Heart } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    { icon: <Store size={28} />, label: "Donors" },
    { icon: <MapPin size={28} />, label: "NGOs" },
    { icon: <Truck size={28} />, label: "Pickup" },
    { icon: <Heart size={28} />, label: "Impact" }
  ];

  return (
    <section className="text-center py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-primary">How It Works</h2>
      <div className="flex justify-center flex-wrap gap-6">
        {steps.map(({ icon, label }) => (
          <div key={label} className="card w-56 bg-base-200 border border-base-300 shadow-md hover:shadow-xl transition">
            <div className="card-body items-center text-center">
              <div className="text-primary">{icon}</div>
              <h3 className="card-title text-accent">{label}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;