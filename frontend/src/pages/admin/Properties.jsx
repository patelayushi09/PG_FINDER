import { Plus, Filter, MapPin, Star } from "lucide-react";

const Properties = () => {
  return (
    <div className="space-y-6 p-8 bg-cream/10 min-h-screen flex-1 ml-64">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#103538]">Property Listings</h2>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#D96851] text-white rounded-lg">
            <Plus className="w-4 h-4" /> Add Property
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#759B87] text-[#759B87] rounded-lg">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {properties.map((property, index) => (
          <PropertyCard key={index} property={property} />
        ))}
      </div>
    </div>
  );
};

// Reusable Property Card Component
const PropertyCard = ({ property }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-semibold text-[#103538]">{property.name}</h3>
        <p className="text-[#759B87] flex items-center gap-2">
          <MapPin className="w-4 h-4" /> {property.location}
        </p>
      </div>
      <div className="flex items-center gap-1 text-[#D8B258]">
        <Star className="w-4 h-4 fill-current" />
        <span>{property.rating}</span>
      </div>
    </div>

    <div className="flex justify-between text-sm mb-4">
      <span className="text-[#103538]">{property.price}</span>
      <span className="text-[#759B87]">Occupancy: {property.occupancy}</span>
    </div>

    <button className="w-full py-2 text-center border border-[#D96851] text-[#D96851] rounded-lg hover:bg-[#D96851] hover:text-white transition-colors">
      View Details
    </button>
  </div>
);

// Properties Data
const properties = [
  { name: "Sunset Villa", location: "Manhattan", price: "$1,200/mo", occupancy: "90%", rating: 4.8 },
  { name: "Urban Heights", location: "Brooklyn", price: "$950/mo", occupancy: "75%", rating: 4.5 },
  { name: "Golden Gates PG", location: "San Francisco", price: "$1,500/mo", occupancy: "95%", rating: 4.9 },
  { name: "Lake View House", location: "Chicago", price: "$850/mo", occupancy: "80%", rating: 4.3 },
];

export default Properties;
