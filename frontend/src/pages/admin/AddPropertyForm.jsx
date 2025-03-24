import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const AddPropertyForm = ({ onClose, onPropertyAdded }) => {
  const { register, handleSubmit, reset } = useForm();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  // Fetch all states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get("http://localhost:5000/state/getallstates");
        setStates(res.data.data || []);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };
    fetchStates();
  }, []);

  // Fetch cities when selectedState changes
  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      return;
    }
    const fetchCities = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/city/getcitybystate/${selectedState}`);
        setCities(res.data.data || []);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, [selectedState]);

  // Fetch areas when selectedCity changes
  useEffect(() => {
    if (!selectedCity) {
      setAreas([]);
      return;
    }
    const fetchAreas = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/area/getareabycityid/${selectedCity}`);
        setAreas(res.data.data || []);
      } catch (error) {
        console.error("Error fetching areas:", error);
      }
    };
    fetchAreas();
  }, [selectedCity]);

  // Handle form submission
  const onSubmit = async (data) => {
    const propertyData = {
      ...data,
      stateId: selectedState,
      cityId: selectedCity,
      areaId: selectedArea,
    };

    console.log("Submitting Property Data:", propertyData); // Debugging

    try {
      const res = await axios.post("http://localhost:5000/admin/properties", propertyData);
      console.log("Property added response:", res.data);

      if (onPropertyAdded && typeof onPropertyAdded === "function") {
        onPropertyAdded(res.data);
      } else {
        console.warn("onPropertyAdded is not defined or is not a function.");
      }

      reset();
      onClose();
    } catch (error) {
      console.error("Error adding property:", error.response?.data || error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Property</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="text" placeholder="Title" className="w-full p-2 border rounded" {...register("title", { required: true })} />
          <input type="text" placeholder="Property Name" className="w-full p-2 border rounded" {...register("propertyName", { required: true })} />
          <input type="text" placeholder="Address" className="w-full p-2 border rounded" {...register("address", { required: true })} />

          {/* State Dropdown */}
          <select className="w-full p-2 border rounded" value={selectedState} onChange={(e) => setSelectedState(e.target.value)} required>
            <option value="">Select State</option>
            {states.map((state) => (<option key={state._id} value={state._id}>{state.name}</option>))}
          </select>

          {/* City Dropdown */}
          <select className="w-full p-2 border rounded" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={!selectedState} required>
            <option value="">Select City</option>
            {cities.map((city) => (<option key={city._id} value={city._id}>{city.name}</option>))}
          </select>

          {/* Area Dropdown */}
          <select className="w-full p-2 border rounded" value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)} disabled={!selectedCity} required>
            <option value="">Select Area</option>
            {areas.map((area) => (<option key={area._id} value={area._id}>{area.name}</option>))}
          </select>

          <input type="number" placeholder="Base Price" className="w-full p-2 border rounded" {...register("basePrice", { required: true })} />
          <input type="number" placeholder="Rating " className="w-full p-2 border rounded" {...register("rating", { required: true })} />
          <input type="number" placeholder="Bedrooms" className="w-full p-2 border rounded" {...register("bedrooms", { required: true })} />
          <input type="number" placeholder="Bathrooms" className="w-full p-2 border rounded" {...register("bathrooms", { required: true })} />
          <textarea placeholder="Description" className="w-full p-2 border rounded" {...register("description", { required: true })}></textarea>

          {/* Furnishing Status Dropdown */}
          <select className="w-full p-2 border rounded" {...register("furnishingStatus", { required: true })}>
            <option value="">Select Furnishing Status</option>
            <option value="Furnished">Furnished</option>
            <option value="Unfurnished">Unfurnished</option>
            <option value="Semi-Furnished">Semi-Furnished</option>
          </select>

          {/* Availability Status Dropdown */}
          <select className="w-full p-2 border rounded" {...register("availabilityStatus", { required: true })}>
            <option value="">Select Status</option>
            <option value="Available">Available</option>
            <option value="Rented">Rented</option>
          </select>

          <div className="flex justify-end space-x-4">
            <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-[#D96851] text-white rounded">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyForm;
