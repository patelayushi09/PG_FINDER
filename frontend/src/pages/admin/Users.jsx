import { Plus, Filter, MoreVertical } from "lucide-react";

const Users = () => {
  return (
    <div className="space-y-6 p-8 bg-cream/10 min-h-screen flex-1 ml-64">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#103538]">User Management</h2>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#D96851] text-white rounded-lg">
            <Plus className="w-4 h-4" /> Add User
          </button>
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
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Location</th>
                <th className="px-6 py-3 text-left">Joined</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <UserRow key={index} user={user} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Reusable User Row Component
const UserRow = ({ user }) => (
  <tr className="border-b border-gray-100">
    <td className="px-6 py-4">{user.name}</td>
    <td className="px-6 py-4">{user.role}</td>
    <td className="px-6 py-4">
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          user.status === "Active" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
        }`}
      >
        {user.status}
      </span>
    </td>
    <td className="px-6 py-4">{user.location}</td>
    <td className="px-6 py-4">{user.joined}</td>
    <td className="px-6 py-4">
      <button className="text-[#759B87] hover:text-[#103538]">
        <MoreVertical className="w-4 h-4" />
      </button>
    </td>
  </tr>
);

// Users Data
const users = [
  { name: "Emma Wilson", role: "Tenant", status: "Active", location: "New York", joined: "2024-02-15" },
  { name: "James Chen", role: "Landlord", status: "Active", location: "San Francisco", joined: "2024-01-20" },
  { name: "Sofia Garcia", role: "Tenant", status: "Pending", location: "Miami", joined: "2024-02-28" },
  { name: "Michael Kim", role: "Landlord", status: "Active", location: "Chicago", joined: "2024-02-01" },
];

export default Users;
