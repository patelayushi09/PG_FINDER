import React from 'react';


const MessageBox = () => {
  const messages = [
    {
      id: 1,
      sender: 'Rahul Kumar',
      message: 'Is the single room still available?',
      time: '10:30 AM',
      unread: true,
    },
    {
      id: 2,
      sender: 'Priya Singh',
      message: 'When can I schedule a visit?',
      time: '09:15 AM',
      unread: false,
    },
  ];

  return (
    <div className="space-y-6 p-8 bg-cream/10 min-h-screen flex-1 ml-64">
      <h3 className="text-xl font-bold text-[#103538] mb-6">Messages</h3>
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50">
            <div className="flex items-center space-x-4">
              <div className={`w-2 h-2 rounded-full ${message.unread ? 'bg-[#D96851]' : 'bg-gray-300'}`} />
              <div>
                <h4 className="font-semibold text-[#103538]">{message.sender}</h4>
                <p className="text-sm text-gray-600">{message.message}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">{message.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageBox;
