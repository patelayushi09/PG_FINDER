import React from 'react';
import { useState, useEffect } from "react"
import { Send, User } from "lucide-react"
import axios from "axios"
import { formatDistanceToNow } from "date-fns"

const API_BASE_URL = "http://localhost:5000"

export default function Messages() {
  const [landlords, setLandlords] = useState([])
  const [selectedLandlord, setSelectedLandlord] = useState(null)
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState({
    landlords: false,
    conversations: false,
    messages: false,
    sending: false,
    properties: false,
  })
  const [error, setError] = useState(null)
  const [properties, setProperties] = useState([])
  const [selectedProperty, setSelectedProperty] = useState(null)

  const tenantId = localStorage.getItem("tenantId")

  // Fetch Landlords from Database
  useEffect(() => {
    const fetchLandlords = async () => {
      setLoading((prev) => ({ ...prev, landlords: true }))
      setError(null)
      try {
        const response = await axios.get(`${API_BASE_URL}/landlord/`)
        setLandlords(response.data.data)
      } catch (error) {
        setError("Failed to load landlords. Please try again.")
      } finally {
        setLoading((prev) => ({ ...prev, landlords: false }))
      }
    }
    fetchLandlords()
  }, [])

  // Fetch tenant conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!tenantId) return

      setLoading((prev) => ({ ...prev, conversations: true }))
      setError(null)

      try {
        const response = await axios.get(`${API_BASE_URL}/message/tenant/${tenantId}/conversations`)
        setConversations(response.data.data)
      } catch (error) {
        setError("Failed to load conversations. Please try again.")
      } finally {
        setLoading((prev) => ({ ...prev, conversations: false }))
      }
    }

    fetchConversations()
  }, [tenantId])

  // Fetch properties when a landlord is selected
  useEffect(() => {
    const fetchProperties = async () => {
      if (!selectedLandlord) return

      setLoading((prev) => ({ ...prev, properties: true }))
      setError(null)

      try {
        const response = await axios.get(`${API_BASE_URL}/landlord/${selectedLandlord._id}/properties`)

        setProperties(response.data.data)

        // If there's only one property, select it automatically
        if (response.data.data.length === 1) {
          setSelectedProperty(response.data.data[0])
        }
      } catch (error) {

        setError("Failed to load properties. Please try again.")
        setProperties([]) // Clear properties on error
      } finally {
        setLoading((prev) => ({ ...prev, properties: false }))
      }
    }

    fetchProperties()
  }, [selectedLandlord])

  // Select a landlord and filter conversations
  const selectLandlord = (landlord) => {
    setSelectedLandlord(landlord)
    setMessages([])
    setSelectedProperty(null) // Reset selected property when changing landlord
    setProperties([]) // Reset properties when changing landlord

    // Filter conversations for this landlord
    const landlordConversations = conversations.filter((conv) => conv.participants.landlord._id === landlord._id)

    // If there's a conversation, select the first one
    if (landlordConversations.length > 0) {
      selectConversation(landlordConversations[0])
    } else {
      setSelectedConversation(null)
    }
  }

  // Select a conversation and load messages
  const selectConversation = async (conversation) => {
    setSelectedConversation(conversation)
    setSelectedProperty(conversation.property)
    setLoading((prev) => ({ ...prev, messages: true }))
    setError(null)

    try {
      const response = await axios.get(`${API_BASE_URL}/message/conversations/${conversation._id}`)
      setMessages(response.data.data)

      // Mark messages as read
      await axios.put(`${API_BASE_URL}/message/read`, {
        conversationId: conversation._id,
        userId: tenantId,
        userType: "tenant",
      })
    } catch (error) {
      setError("Failed to load messages. Please try again.")
    } finally {
      setLoading((prev) => ({ ...prev, messages: false }))
    }
  }

  // Send Message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !tenantId || !selectedLandlord) return
    if (!selectedProperty) {
      setError("Please select a property to send a message about.")
      return
    }

    setLoading((prev) => ({ ...prev, sending: true }))
    setError(null)

    try {
      const messageData = {
        propertyId: selectedProperty._id,
        senderId: tenantId,
        receiverId: selectedLandlord._id,
        senderType: "tenant",
        receiverType: "landlord",
        content: newMessage,
      }

      const response = await axios.post(`${API_BASE_URL}/message`, messageData)

      // If this is a new conversation, refresh conversations
      if (!selectedConversation) {
        const conversationsResponse = await axios.get(`${API_BASE_URL}/message/tenant/${tenantId}/conversations`)
        setConversations(conversationsResponse.data.data)

        // Find the new conversation
        const newConversation = conversationsResponse.data.data.find(
          (conv) =>
            conv.participants.landlord._id === selectedLandlord._id && conv.property._id === selectedProperty._id,
        )

        if (newConversation) {
          setSelectedConversation(newConversation)
        }
      }

      // Add the new message to the messages list
      setMessages((prev) => [...prev, response.data.data])
      setNewMessage("")
    } catch (error) {
      setError("Failed to send message. Please try again.")
    } finally {
      setLoading((prev) => ({ ...prev, sending: false }))
    }
  }

  return (
    <div className="min-h-screen space-y-6 p-8 bg-cream/10 min-h-screen flex-1">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-[#103538] mb-6">Messages</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 h-[70vh]">
            {/* Landlord Selection */}
            <div className="border-r overflow-y-auto">
              <div className="p-4 border-b bg-[#E6F0ED]">
                <h2 className="font-semibold text-[#103538]">Landlords</h2>
              </div>

              {loading.landlords ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#103538]"></div>
                </div>
              ) : landlords.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No landlords available</div>
              ) : (
                landlords.map((landlord) => (
                  <button
                    key={landlord._id}
                    onClick={() => selectLandlord(landlord)}
                    className={`w-full p-4 flex items-center hover:bg-gray-50 border-b ${selectedLandlord?._id === landlord._id ? "bg-gray-100" : ""
                      }`}
                  >
                    <User className="h-8 w-8 text-[#759B87]" />
                    <div className="ml-3 text-left">
                      <h3 className="font-medium text-[#103538]">{landlord.name}</h3>
                      {conversations.some(
                        (conv) => conv.participants.landlord._id === landlord._id && conv.unreadCount > 0,
                      ) && (
                          <span className="inline-block bg-[#103538] text-white text-xs px-2 py-1 rounded-full ml-2">
                            New
                          </span>
                        )}
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Chat Area */}
            <div className="col-span-2 flex flex-col">
              {selectedLandlord ? (
                <>
                  <div className="p-4 border-b bg-[#E6F0ED] flex items-center">
                    <User className="h-10 w-10 text-[#759B87]" />
                    <div className="ml-3">
                      <h2 className="font-semibold text-[#103538]">{selectedLandlord.name}</h2>
                      {selectedConversation?.property ? (
                        <p className="text-sm text-gray-600">Property: {selectedConversation.property.propertyName || selectedConversation.property.name}</p>
                      ) : (
                        <p className="text-sm text-gray-600">No property selected</p>
                      )}
                    </div>

                  </div>

                  {/* Property Selection (only shown when starting a new conversation) */}
                  {!selectedConversation && (
                    <div className="p-3 border-b">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select a property to message about:
                      </label>
                      {loading.properties ? (
                        <div className="flex justify-center items-center h-8">
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#103538]"></div>
                        </div>
                      ) : properties.length === 0 ? (
                        <div className="text-sm text-gray-500">No properties available for this landlord</div>
                      ) : (
                        <select
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#103538] focus:outline-none"
                          value={selectedProperty?._id || ""}
                          onChange={(e) => {
                            const property = properties.find((p) => p._id === e.target.value)
                            setSelectedProperty(property)
                          }}
                        >
                          <option value="">Select a property</option>
                          {properties.map((property) => (
                            <option key={property._id} value={property._id}>
                              {property.propertyName} {/* ✅ Correct field name */}
                            </option>
                          ))}
                        </select>

                      )}
                    </div>
                  )}

                  <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    {loading.messages ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#103538]"></div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No messages yet. Start the conversation!
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message._id}
                          className={`mb-4 flex ${message.senderType === "tenant" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${message.senderType === "tenant" ? "bg-[#103538] text-white" : "bg-gray-200 text-gray-800"
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

                  <div className="p-3 border-t flex items-center">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#103538] focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={loading.sending || (!selectedConversation && !selectedProperty)}
                      className={`ml-2 p-3 rounded-md hover:bg-opacity-90 transition-colors ${!selectedConversation && !selectedProperty
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#103538] text-white"
                        }`}
                    >
                      {loading.sending ? (
                        <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Select a landlord to start messaging
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}