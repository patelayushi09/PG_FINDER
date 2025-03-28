// import React from 'react';


// const MessageBox = () => {
//   const messages = [
//     {
//       id: 1,
//       sender: 'Rahul Kumar',
//       message: 'Is the single room still available?',
//       time: '10:30 AM',
//       unread: true,
//     },
//     {
//       id: 2,
//       sender: 'Priya Singh',
//       message: 'When can I schedule a visit?',
//       time: '09:15 AM',
//       unread: false,
//     },
//   ];

//   return (
//     <div className="space-y-6 p-8 bg-cream/10 min-h-screen flex-1 ml-64">
//       <h3 className="text-xl font-bold text-[#103538] mb-6">Messages</h3>
//       <div className="space-y-4">
//         {messages.map((message) => (
//           <div key={message.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50">
//             <div className="flex items-center space-x-4">
//               <div className={`w-2 h-2 rounded-full ${message.unread ? 'bg-[#D96851]' : 'bg-gray-300'}`} />
//               <div>
//                 <h4 className="font-semibold text-[#103538]">{message.sender}</h4>
//                 <p className="text-sm text-gray-600">{message.message}</p>
//               </div>
//             </div>
//             <div className="text-sm text-gray-500">{message.time}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MessageBox;



import { useState, useEffect } from "react";
import { Send, Paperclip } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function MessageBox() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const landlordId = localStorage.getItem("landlordId");

  useEffect(() => {
    const mockConversations = [
      {
        _id: "conv1",
        participant: { _id: "tenant1", name: "Rahul Kumar", type: "tenant" },
        property: { _id: "prop1", name: "Sunset Apartments" },
        lastMessage: { content: "Is the single room still available?", createdAt: new Date(Date.now() - 3600000).toISOString() },
        unreadCount: 1,
      },
    ];
    setConversations(mockConversations);
  }, []);

  useEffect(() => {
    if (!selectedConversation) return;
    const mockMessages = [
      { _id: "msg1", senderId: selectedConversation.participant._id, content: "Hi, I'm interested in the property.", createdAt: new Date(Date.now() - 7200000).toISOString(), read: true },
    ];
    setMessages(mockMessages);
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    const newMsg = {
      _id: `msg${Date.now()}`,
      senderId: landlordId,
      senderType: "landlord",
      content: newMessage,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");
  };

  return (
    <div className="flex min-h-screen p-8 bg-cream/10 flex-1 ml-64">
      <div className="w-1/3 border-r overflow-y-auto bg-white rounded-lg shadow-md">
        <div className="p-4 border-b text-lg font-semibold bg-deep-teal text-white">Tenant Inquiries</div>
        <div>
          {conversations.map((conv) => (
            <button key={conv._id} onClick={() => setSelectedConversation(conv)} className="w-full p-4 flex items-center hover:bg-gray-100">
              <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center text-deep-teal font-bold">{conv.participant.name.substring(0, 2).toUpperCase()}</div>
              <div className="ml-4">
                <h3 className="font-medium">{conv.participant.name}</h3>
                <p className="text-sm text-gray-600">{conv.lastMessage.content}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white rounded-lg shadow-md ml-4">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b flex items-center bg-sage text-white">
              <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center text-deep-teal font-bold">
                {selectedConversation.participant.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold">{selectedConversation.participant.name}</h2>
                <p className="text-xs">{selectedConversation.property.name}</p>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.map((msg) => (
                <div key={msg._id} className={`mb-4 flex ${msg.senderId === landlordId ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] p-3 rounded-lg ${msg.senderId === landlordId ? "bg-blue-500 text-white" : "bg-white border"}`}>
                    <p>{msg.content}</p>
                    <span className="text-xs opacity-70 block mt-1">{formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t flex items-center bg-white">
              <button className="p-2 rounded-full border"><Paperclip className="h-4 w-4" /></button>
              <input type="text" placeholder="Type a message..." className="flex-1 border p-2 mx-2 rounded-lg" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} />
              <button onClick={handleSendMessage} className="bg-blue-500 text-white p-2 rounded-full"><Send className="h-4 w-4" /></button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">Select a conversation to start messaging</div>
        )}
      </div>
    </div>
  );
}
