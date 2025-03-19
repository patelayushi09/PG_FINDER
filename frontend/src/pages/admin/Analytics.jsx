import { Calendar, Filter } from "lucide-react";

const analyticsData = {
  bookings: [65, 75, 70, 90, 85, 95, 100],
  revenue: [4500, 5000, 4800, 6000, 5800, 6500, 7000],
  occupancy: [75, 78, 80, 85, 82, 88, 90],
};

const Analytics = () => {
  return (
    <div className="space-y-6 p-8 bg-cream/10 min-h-screen flex-1 ml-64">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#103538]">Analytics Overview</h2>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#759B87] text-[#759B87] rounded-lg">
            <Calendar className="w-4 h-4" /> Last 7 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#759B87] text-[#759B87] rounded-lg">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsCard title="Bookings" data={analyticsData.bookings} color="#D96851" />
        <AnalyticsCard title="Revenue" data={analyticsData.revenue} color="#D8B258" maxValue={7000} />
        <AnalyticsCard title="Occupancy Rate" data={analyticsData.occupancy} color="#759B87" />
      </div>
    </div>
  );
};

// Reusable Analytics Card Component
const AnalyticsCard = ({ title, data, color, maxValue = 100 }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-[#103538] mb-4">{title}</h3>
      <div className="h-40 flex items-end gap-2">
        {data.map((value, index) => (
          <div
            key={index}
            className="flex-1 rounded-t"
            style={{ height: `${(value / maxValue) * 100}%`, backgroundColor: color }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
