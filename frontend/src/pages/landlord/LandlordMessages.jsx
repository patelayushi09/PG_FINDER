import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { useChat } from "../../context/ChatContext";
import { formatDistanceToNow } from "date-fns";

export default function LandlordMessages() {
  const {
    conversations = [],
    messages = [],
    selectedConversation,
    isLoading = {},
    onlineUsers = [],
    unreadCounts = {},
    selectConversation,
    sendMessage,
  } = useChat();

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom on new messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    sendMessage(newMessage);
    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-cream/10 ml-64 p-6">
      <div className="w-full max-w-7xl mx-auto flex gap-4">
        {/* Sidebar - fixed width */}
        <div className="w-[300px] bg-white rounded-lg shadow-md flex flex-col">
          <div className="p-4 border-b text-lg font-semibold bg-[#103538] text-white">
            Tenant Inquiries
          </div>

          {isLoading.conversations ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-[#103538] rounded-full"></div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No inquiries yet</div>
          ) : (
            <div className="overflow-y-auto flex-1">
              {conversations.map((conversation) => (
                <button
                  key={conversation._id}
                  onClick={() => selectConversation(conversation)}
                  className={`w-full p-4 flex items-center hover:bg-gray-50 border-b ${
                    selectedConversation?._id === conversation._id ? "bg-gray-100" : ""
                  }`}
                >
                  <div className="h-12 w-12 bg-[#759B87] rounded-full flex items-center justify-center text-white font-bold">
                    {`${conversation.participants?.tenant?.firstName?.charAt(0) ?? ""}${conversation.participants?.tenant?.lastName?.charAt(0) ?? ""}`}
                  </div>
                  <div className="ml-4 text-left flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">
                        {`${conversation.participants?.tenant?.firstName ?? ""} ${conversation.participants?.tenant?.lastName ?? ""}`}
                      </h3>
                      {unreadCounts[conversation._id] > 0 && (
                        <span className="bg-[#D96851] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCounts[conversation._id]}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <p className="text-sm text-gray-600 truncate max-w-[150px]">
                        {conversation.lastMessage?.content || "No messages yet"}
                      </p>
                      {onlineUsers.includes(conversation.participants?.tenant?._id) && (
                        <span className="ml-2 h-2 w-2 bg-green-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {conversation.property?.name ?? ""}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat Area - flexible width */}
        <div className="flex-1 bg-white rounded-lg shadow-md flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between bg-[#759B87] text-white">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-[#103538] font-bold">
                    {`${selectedConversation.participants?.tenant?.firstName?.charAt(0) ?? ""}${selectedConversation.participants?.tenant?.lastName?.charAt(0) ?? ""}`}
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold">
                      {`${selectedConversation.participants?.tenant?.firstName ?? ""} ${selectedConversation.participants?.tenant?.lastName ?? ""}`}
                    </h2>
                    <p className="text-sm font-medium text-cream">
                      Property: {selectedConversation.property?.name ?? "Unknown"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {isLoading.messages ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-white rounded-full"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No messages yet
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <div
                        key={message._id}
                        className={`mb-4 flex ${message.senderType === "landlord" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.senderType === "landlord"
                              ? "bg-[#103538] text-white"
                              : "bg-white border border-gray-200"
                          }`}
                        >
                          <p>{message.content}</p>
                          <span className="text-xs opacity-70 block mt-1">
                            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t flex items-center bg-white">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 border p-2 mx-2 rounded-lg focus:ring-2 focus:ring-[#103538] focus:outline-none resize-none"
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading.sending}
                  className="bg-[#103538] text-white p-2 rounded-full hover:bg-opacity-90 transition-colors"
                >
                  {isLoading.sending ? (
                    <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
