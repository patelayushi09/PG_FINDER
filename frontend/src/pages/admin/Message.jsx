import { Mail } from "lucide-react";

const Message = () => {
  return (
    <div className="space-y-6 p-8 bg-cream/10 min-h-screen flex-1 ml-64">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#103538]">Messages</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#D96851] text-white rounded-lg">
          <Mail className="w-4 h-4" /> Compose
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        {messages.map((message, index) => (
          <MessageItem key={index} message={message} />
        ))}
      </div>
    </div>
  );
};

// Reusable Message Item Component
const MessageItem = ({ message }) => (
  <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
    <div className="flex justify-between items-start mb-2">
      <h3 className="font-semibold text-[#103538]">{message.from}</h3>
      <span className="text-sm text-[#759B87]">{message.time}</span>
    </div>
    <p className="text-[#103538] font-medium">{message.subject}</p>
    <p className="text-[#759B87] text-sm">{message.preview}</p>
  </div>
);

// Messages Data
const messages = [
  { from: "David Lee", subject: "Booking Inquiry", preview: "I'm interested in room 304...", time: "10:30 AM" },
  { from: "Sarah Miller", subject: "Payment Confirmation", preview: "Thank you for processing...", time: "09:15 AM" },
  { from: "Tom Wilson", subject: "Maintenance Request", preview: "The AC in room 205...", time: "Yesterday" },
  { from: "Anna Brown", subject: "Viewing Schedule", preview: "Can we arrange a viewing...", time: "Yesterday" },
];

export default Message;
