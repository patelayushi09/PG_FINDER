

// import React, { useState, useEffect } from "react";
// import { Send } from "lucide-react";
// import { useChat } from "../../context/ChatContext";
// import { formatDistanceToNow } from "date-fns";

// export default function LandlordMessages() {
//   const {
//     conversations = [],
//     messages = [],
//     selectedConversation,
//     isLoading = {},
//     onlineUsers = [],
//     unreadCounts = {},
//     selectConversation,
//     sendMessage,
//   } = useChat();

//   const [newMessage, setNewMessage] = useState("");

//   useEffect(() => {
//     if (Notification.permission !== "granted") {
//       Notification.requestPermission();
//     }
//   }, []);

//   const handleSendMessage = () => {
//     if (!newMessage.trim()) return;
//     sendMessage(newMessage);
//     setNewMessage("");
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="flex min-h-screen p-8 bg-cream/10 flex-1 ml-64">
//       <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
//         {/* Sidebar */}
//         <div className="md:col-span-1 bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="p-4 border-b text-lg font-semibold bg-[#103538] text-white">
//             Tenant Inquiries
//           </div>

//           {isLoading.conversations ? (
//             <div className="flex justify-center items-center h-32">
//               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#103538]"></div>
//             </div>
//           ) : conversations.length === 0 ? (
//             <div className="p-4 text-center text-gray-500">No inquiries yet</div>
//           ) : (
//             <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">
//               {conversations.map((conversation) => (
//                 <button
//                   key={conversation._id}
//                   onClick={() => selectConversation(conversation)}
//                   className={`w-full p-4 flex items-center hover:bg-gray-50 border-b ${
//                     selectedConversation?._id === conversation._id ? "bg-gray-100" : ""
//                   }`}
//                 >
//                   <div className="h-12 w-12 bg-[#759B87] rounded-full flex items-center justify-center text-white font-bold">
//                     {`${conversation.participants?.tenant?.firstName?.charAt(0) ?? ""}${conversation.participants?.tenant?.lastName?.charAt(0) ?? ""}`}
//                   </div>
//                   <div className="ml-4 text-left flex-1">
//                     <div className="flex items-center justify-between">
//                       <h3 className="font-medium">
//                         {`${conversation.participants?.tenant?.firstName ?? ""} ${conversation.participants?.tenant?.lastName ?? ""}`}
//                       </h3>
//                       {unreadCounts[conversation._id] > 0 && (
//                         <span className="bg-[#D96851] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                           {unreadCounts[conversation._id]}
//                         </span>
//                       )}
//                     </div>
//                     <div className="flex items-center">
//                       <p className="text-sm text-gray-600 truncate max-w-[150px]">
//                         {conversation.lastMessage?.content || "No messages yet"}
//                       </p>
//                       {onlineUsers.includes(conversation.participants?.tenant?._id) && (
//                         <span className="ml-2 h-2 w-2 bg-green-500 rounded-full"></span>
//                       )}
//                     </div>
//                     <p className="text-xs text-gray-500 mt-1">
//                       {conversation.property?.name ?? ""}
//                     </p>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Chat Area */}
//         <div className="md:col-span-3 bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
//           {selectedConversation ? (
//             <>
//               {/* Chat Header */}
//               <div className="p-4 border-b flex items-center bg-[#759B87] text-white">
//                 <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-[#103538] font-bold">
//                   {`${selectedConversation.participants?.tenant?.firstName?.charAt(0) ?? ""}${selectedConversation.participants?.tenant?.lastName?.charAt(0) ?? ""}`}
//                 </div>
//                 <div className="ml-4">
//                   <h2 className="text-lg font-semibold">
//                     {`${selectedConversation.participants?.tenant?.firstName ?? ""} ${selectedConversation.participants?.tenant?.lastName ?? ""}`}
//                   </h2>
//                   <p className="text-xs">{selectedConversation.property?.name ?? ""}</p>
//                 </div>
//               </div>

//               {/* Messages */}
//               <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
//                 {isLoading.messages ? (
//                   <div className="flex justify-center items-center h-full">
//                     <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
//                   </div>
//                 ) : messages.length === 0 ? (
//                   <div className="flex items-center justify-center h-full text-gray-500">
//                     No messages yet
//                   </div>
//                 ) : (
//                   messages.map((message) => (
//                     <div
//                       key={message._id}
//                       className={`mb-4 flex ${message.senderType === "landlord" ? "justify-end" : "justify-start"}`}
//                     >
//                       <div
//                         className={`max-w-[70%] p-3 rounded-lg ${
//                           message.senderType === "landlord"
//                             ? "bg-[#103538] text-white"
//                             : "bg-white border border-gray-200"
//                         }`}
//                       >
//                         <p>{message.content}</p>
//                         <span className="text-xs opacity-70 block mt-1">
//                           {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
//                         </span>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>

//               {/* Message Input */}
//               <div className="p-4 border-t flex items-center bg-white">
//                 <textarea
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   placeholder="Type a message..."
//                   className="flex-1 border p-2 mx-2 rounded-lg focus:ring-2 focus:ring-[#103538] focus:outline-none resize-none"
//                   rows={1}
//                 />
//                 <button
//                   onClick={handleSendMessage}
//                   disabled={isLoading.sending}
//                   className="bg-[#103538] text-white p-2 rounded-full hover:bg-opacity-90 transition-colors"
//                 >
//                   {isLoading.sending ? (
//                     <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
//                   ) : (
//                     <Send className="h-5 w-5" />
//                   )}
//                 </button>
//               </div>
//             </>
//           ) : (
//             <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
//               Select a conversation to start messaging
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

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
  console.log("Selected Conversation:", selectedConversation);

  return (
    <div className="flex min-h-screen p-8 bg-cream/10 flex-1 ml-64">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sidebar */}
        <div className="md:col-span-1 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b text-lg font-semibold bg-[#103538] text-white">
            Tenant Inquiries
          </div>

          {isLoading.conversations ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#103538]"></div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No inquiries yet</div>
          ) : (
            <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">
              {conversations.map((conversation) => (
                <button
                  key={conversation._id}
                  onClick={() => selectConversation(conversation)}
                  className={`w-full p-4 flex items-center hover:bg-gray-50 border-b ${selectedConversation?._id === conversation._id ? "bg-gray-100" : ""
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

        {/* Chat Area */}
        <div className="md:col-span-3 bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
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
                    {/* 👇 This line shows the property name clearly */}
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
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No messages yet
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message._id}
                      className={`mb-4 flex ${message.senderType === "landlord" ? "justify-end" : "justify-start"
                        }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${message.senderType === "landlord"
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
                  ))
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
