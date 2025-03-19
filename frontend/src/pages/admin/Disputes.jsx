import { Filter } from "lucide-react";

const Disputes = () => {
  return (
    <div className="space-y-6 p-8 bg-cream/10 min-h-screen flex-1 ml-64">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#103538]">Dispute Management</h2>
        <div className="flex gap-4">
        <button className="flex items-center gap-2 px-4 py-2 border border-[#759B87] text-[#759B87] rounded-lg">
          <Filter className="w-4 h-4" /> Filter
        </button>
        </div>  
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#103538] text-white">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Tenant</th>
                <th className="px-6 py-3 text-left">Landlord</th>
                <th className="px-6 py-3 text-left">Issue</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {disputes.map((dispute, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="px-6 py-4 font-medium">{dispute.id}</td>
                  <td className="px-6 py-4">{dispute.tenant}</td>
                  <td className="px-6 py-4">{dispute.landlord}</td>
                  <td className="px-6 py-4">{dispute.issue}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={dispute.status} />
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-[#D96851] hover:text-[#103538]">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Reusable Status Badge Component
const StatusBadge = ({ status }) => {
  const statusColors = {
    Open: "bg-red-100 text-red-600",
    "In Progress": "bg-yellow-100 text-yellow-600",
    Resolved: "bg-green-100 text-green-600",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[status]}`}>
      {status}
    </span>
  );
};

// Disputes Data
const disputes = [
  { id: "#D1234", tenant: "Rachel Green", landlord: "Joey Tribbiani", issue: "Maintenance", status: "Open" },
  { id: "#D1235", tenant: "Ross Geller", landlord: "Monica Geller", issue: "Payment", status: "In Progress" },
  { id: "#D1236", tenant: "Chandler Bing", landlord: "Phoebe Buffay", issue: "Booking", status: "Resolved" },
  { id: "#D1237", tenant: "Mike Ross", landlord: "Harvey Specter", issue: "Amenities", status: "Open" },
];

export default Disputes;
