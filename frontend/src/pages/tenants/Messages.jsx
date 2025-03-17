

import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import axios from 'axios';

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // TODO: Replace with actual tenant ID from auth context
        const userId = "dummy-tenant-id";
        const response = await axios.get(`http://localhost:5000/messages/conversations/${userId}/tenant`);
        setConversations(response.data.data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedConversation) {
        try {
          const response = await axios.get(`http://localhost:5000/messages/conversations/${selectedConversation._id}`);
          setMessages(response.data.data);
          
          // Mark messages as read
          await axios.patch(
            `http://localhost:5000/messages/conversations/${selectedConversation._id}/dummy-tenant-id/read`
          );
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedConversation) return;

    try {
      const messageData = {
        senderId: 'dummy-tenant-id',
        receiverId: selectedConversation.participant._id,
        senderType: 'tenant',
        receiverType: selectedConversation.participant.type,
        content: message,
        propertyId: selectedConversation.property._id
      };

      await axios.post('http://localhost:5000/messages', messageData);
      setMessage('');
      
      // Refresh messages
      const response = await axios.get(`http://localhost:5000/messages/conversations/${selectedConversation._id}`);
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-white rounded-lg shadow-sm">
      {/* Conversations List */}
      <div className="w-1/3 border-r">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-[#103538]">Messages</h2>
        </div>
        <div className="overflow-y-auto h-full">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={`w-full p-4 flex items-center space-x-4 hover:bg-gray-50 ${
                selectedConversation?.id === conv.id ? 'bg-gray-50' : ''
              }`}
            >
              <img
                src={conv.avatar}
                alt={conv.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1 text-left">
                <div className="flex justify-between">
                  <h3 className="font-medium text-[#103538]">{conv.name}</h3>
                  <span className="text-sm text-gray-500">{conv.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && (
                <span className="bg-[#D96851] text-white text-xs px-2 py-1 rounded-full">
                  {conv.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedConversation.avatar}
                  alt={selectedConversation.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <h2 className="text-lg font-semibold text-[#103538]">
                  {selectedConversation.name}
                </h2>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${
                    msg.senderId === 'dummy-tenant-id' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.senderId === 'dummy-tenant-id'
                        ? 'bg-[#103538] text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <span className="text-xs opacity-70">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t">
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D8B258]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-[#103538] text-white rounded-lg hover:bg-opacity-90"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;