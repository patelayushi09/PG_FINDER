import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { FileUploaderRegular } from '@uploadcare/react-uploader';
import '@uploadcare/react-uploader/core.css';

const AddPropertyForm = ({ onClose, onPropertyAdded }) => {
  const { register, handleSubmit, reset } = useForm();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [occupancy, setOccupancy] = useState(0);
  const [key, setKey] = useState('');
  const [image, setImage] = useState('');
  const [imageError, setImageError] = useState('');



  // Fetch all states
  useEffect(() => {
    axios
      .get("http://localhost:5000/state/getallstates")
      .then((res) => setStates(res.data.data || []))
      .catch((error) => console.error("Error fetching states:", error));
  }, []);

  // Fetch cities when selectedState changes
  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      return;
    }
    axios
      .get(`http://localhost:5000/city/getcitybystate/${selectedState}`)
      .then((res) => setCities(res.data.data || []))
      .catch((error) => console.error("Error fetching cities:", error));
  }, [selectedState]);

  // Fetch areas when selectedCity changes
  useEffect(() => {
    if (!selectedCity) {
      setAreas([]);
      return;
    }
    axios
      .get(`http://localhost:5000/area/getareabycityid/${selectedCity}`)
      .then((res) => setAreas(res.data.data || []))
      .catch((error) => console.error("Error fetching areas:", error));
  }, [selectedCity]);



  const handleFileChange = (fileList) => {
    if (fileList && fileList.allEntries.length > 0) {
      const fileInfo = fileList.allEntries[0];
      setImage(fileInfo.cdnUrl);
      setImageError(''); // Clear image error if a file is uploaded
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const formData = new FormData();

    Object.keys(data).forEach((key) => formData.append(key, data[key]));

    formData.append("stateId", selectedState);
    formData.append("cityId", selectedCity);
    formData.append("areaId", selectedArea);
    formData.append("occupancy", occupancy.toString());

    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await axios.post("http://localhost:5000/landlord/properties", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onPropertyAdded && onPropertyAdded(res.data);
      reset();
      onClose();
    } catch (error) {
      console.error("Error adding property:", error.response?.data || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add Property</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Basic Info */}
          <input type="text" placeholder="Title" className="w-full p-2 border rounded" {...register("title", { required: true })} />
          <input type="text" placeholder="Property Name" className="w-full p-2 border rounded" {...register("propertyName", { required: true })} />
          <input type="text" placeholder="Address" className="w-full p-2 border rounded" {...register("address", { required: true })} />


          {/* Location Dropdowns */}
          <select className="w-full p-2 border rounded" value={selectedState} onChange={(e) => setSelectedState(e.target.value)} required>
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state._id} value={state._id}>
                {state.name}
              </option>
            ))}
          </select>

          <select className="w-full p-2 border rounded" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={!selectedState} required>
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city._id} value={city._id}>
                {city.name}
              </option>
            ))}
          </select>

          <select className="w-full p-2 border rounded" value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)} disabled={!selectedCity} required>
            <option value="">Select Area</option>
            {areas.map((area) => (
              <option key={area._id} value={area._id}>
                {area.name}
              </option>
            ))}
          </select>

          {/* Property Details */}
          <input type="number" placeholder="Base Price" className="w-full p-2 border rounded" {...register("basePrice", { required: true })} />
          <input type="number" placeholder="Rating " className="w-full p-2 border rounded" {...register("rating", { required: true })} />
          <input type="number" placeholder="Bedrooms" className="w-full p-2 border rounded" {...register("bedrooms", { required: true })} />
          <input type="number" placeholder="Bathrooms" className="w-full p-2 border rounded" {...register("bathrooms", { required: true })} />
          <textarea placeholder="Description" className="w-full p-2 border rounded" {...register("description", { required: true })}></textarea>

          {/* Occupancy */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Occupancy (%)</label>
            <input
              type="number"
              placeholder="Occupancy"
              className="w-full p-2 border rounded"
              value={occupancy}
              onChange={(e) => setOccupancy(Number.parseInt(e.target.value) || 0)}
              min="0"
              max="100"
            />
          </div>

          {/* Furnishing & Availability */}
          <select className="w-full p-2 border rounded" {...register("furnishingStatus", { required: true })}>
            <option value="">Select Furnishing Status</option>
            <option value="Furnished">Furnished</option>
            <option value="Unfurnished">Unfurnished</option>
            <option value="Semi-Furnished">Semi-Furnished</option>
          </select>

          <select className="w-full p-2 border rounded" {...register("availabilityStatus", { required: true })}>
            <option value="">Select Status</option>
            <option value="Available">Available</option>
            <option value="Rented">Rented</option>
          </select>

          {/* File Upload */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Property Image
            </label>
            <FileUploaderRegular
              onChange={handleFileChange}
              pubkey={import.meta.env.VITE_UPLOAD_CARE_PUBLIC_KEY}
              accept="image/*"
              className="file-uploader"
            />

          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-[#D96851] text-white rounded" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyForm;
