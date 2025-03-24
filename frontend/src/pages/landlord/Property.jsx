import { useState, useEffect } from "react";
import axios from "axios";
import { Search, PlusCircle, Home } from "lucide-react";
import AddPropertyForm from "./AddPropertyForm";
import UpdatePropertyForm from "./UpdatePropertyForm";
import PropertyCard from "./PropertyCard";
import PropertyDetails from "./PropertyDetails";

const API_URL = "http://localhost:5000/landlord/properties";

const Property = () => {
  const [properties, setProperties] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false); // Track details modal
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL);
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePropertyAdded = async (newProperty) => {
    setProperties((prev) => [...prev, newProperty]);
    await fetchProperties();
    setShowAddForm(false);
  };

  const handlePropertyUpdated = (updatedProperty) => {
    setProperties((prevProperties) =>
      prevProperties.map((property) =>
        property._id === updatedProperty._id ? updatedProperty : property
      )
    );
  };

  const deleteProperty = async (propertyId) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await axios.delete(`${API_URL}/${propertyId}`);
        setProperties((prev) => prev.filter((property) => property._id !== propertyId));
      } catch (error) {
        console.error("Error deleting property:", error.response?.data || error.message);
      }
    }
  };

  // Open details modal
  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setShowDetails(true);
  };

  const filteredProperties = properties.filter(
    (property) =>
      property.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (property.stateId?.name &&
        property.stateId.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );


  return (
    <div className="space-y-6 p-8 bg-cream/10 min-h-screen flex-1 ml-64">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[#103538]">Property Management</h3>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, address, or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96851]"
            />


            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-[#D96851] text-white px-4 py-2 rounded-lg hover:bg-[#D96851]/90"
          >
            <PlusCircle size={20} />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Property List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D96851]"></div>
        </div>
      ) : filteredProperties.length > 0 ? (
        <div className="space-y-4">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
              onClick={() => handleViewDetails(property)} // Open details on click
              onEdit={() => {
                setSelectedProperty(property);
                setShowUpdateForm(true);
              }}
              onDelete={() => deleteProperty(property._id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <Home size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No properties found. Add your first property!</p>
        </div>
      )}

      {/* Modals */}
      {showAddForm && <AddPropertyForm onClose={() => setShowAddForm(false)} onPropertyAdded={handlePropertyAdded} />}
      {showUpdateForm && selectedProperty && (
        <UpdatePropertyForm property={selectedProperty} onClose={() => setShowUpdateForm(false)} onPropertyUpdated={handlePropertyUpdated} />
      )}
      {showDetails && selectedProperty && (
        <PropertyDetails property={selectedProperty} onClose={() => setShowDetails(false)} />
      )}
    </div>
  );
};

export default Property;
