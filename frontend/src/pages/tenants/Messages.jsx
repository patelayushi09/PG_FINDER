
import React, { useState, useEffect } from 'react';
import { Send, User } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = "http://localhost:5000";

function Messages() {
  const [landlords, setLandlords] = useState([]);
  const [selectedLandlord, setSelectedLandlord] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState({
    landlords: false,
    messages: false,
    sending: false
  });
  const [error, setError] = useState(null);

  const tenantId = localStorage.getItem("tenantId");

  useEffect(() => {
    fetchLandlords();
  }, []);

  const fetchLandlords = async () => {
    setLoading(prev => ({ ...prev, landlords: true }));
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/landlord/`);
      setLandlords(response.data.data);
    } catch (error) {
      setError("Failed to load landlords. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, landlords: false }));
    }
  };

  const fetchMessages = async (conversationId) => {
    setSelectedLandlord(conversationId);
    setLoading(prev => ({ ...prev, messages: true }));
    setError(null);

    try {
        const response = await axios.get(`${API_BASE_URL}/message/conversations/${conversationId}`);
        setMessages(response.data.data);
    } catch (error) {
        setError("Failed to load messages. Please try again.");
    } finally {
        setLoading(prev => ({ ...prev, messages: false }));
    }
};


  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedLandlord || !tenantId) return;

    setLoading(prev => ({ ...prev, sending: true }));
    setError(null);

    const messageData = {
      senderId: tenantId,
      receiverId: selectedLandlord,
      senderType: "tenant",
      receiverType: "landlord",
      content: newMessage,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/message`, messageData);
      setMessages(prev => [...prev, response.data.data]);
      setNewMessage("");
    } catch (error) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, sending: false }));
    }
  };

  return (
    <div className="min-h-screenspace-y-6 p-8 bg-cream/10 min-h-screen flex-1">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Messages</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline mr-2 h-5 w-5" /> Select Landlord
            </label>
            <select
              value={selectedLandlord}
              onChange={(e) => fetchMessages(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              disabled={loading.landlords}
            >
              <option value="">Choose a landlord</option>
              {landlords.map((landlord) => (
                <option key={landlord._id} value={landlord._id}>{landlord.name}</option>
              ))}
            </select>
          </div>

          {selectedLandlord && (
            <div className="mt-6">
              <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto mb-4">
                {messages.map((msg) => (
                  <div key={msg._id} className={`mb-4 flex ${msg.senderType === "tenant" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] rounded-lg p-3 ${msg.senderType === "tenant" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                      <p>{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                  <Send className="h-5 w-5" /> Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;

