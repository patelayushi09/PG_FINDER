const Message = require('../models/messageModel')

// Send a new message
const  sendMessage = async (req, res) => {
    try {
      const { senderId, receiverId, senderType, receiverType, content, propertyId } = req.body
  
      // Validate required fields
      if (!senderId || !receiverId || !senderType || !receiverType || !content || !propertyId) {
        return res.status(400).json({ success: false, message: "Missing required fields" })
      }
  
      // Create new message
      const newMessage = new Message({
        senderId,
        receiverId,
        senderType,
        receiverType,
        content,
        propertyId,
        read: false,
      })
  
      await newMessage.save()
  
      return res.status(201).json({ success: true, data: newMessage })
    } catch (error) {
      console.error("Error sending message:", error)
      return res.status(500).json({ success: false, message: "Server error" })
    }
  }
  
  // Get messages for a conversation
  const getConversationMessages = async (req, res) => {
    try {
      const { conversationId } = req.params
  
    
      const messages = await Message.find({ conversationId })
  
      return res.status(200).json({ success: true, data: messages })
    } catch (error) {
      console.error("Error getting conversation messages:", error)
      return res.status(500).json({ success: false, message: "Server error" })
    }
  }

  // Get user conversations
 const getUserConversations = async (req, res) => {
    try {
      const { userId, userType } = req.params
  
      // Get all conversations for this user
      const conversations = await Message.getUserConversations(userId, userType)
  
      return res.status(200).json({ success: true, data: conversations })
    } catch (error) {
      console.error("Error getting user conversations:", error)
      return res.status(500).json({ success: false, message: "Server error" })
    }
  }
  
  // Mark messages as read
  const markMessagesAsRead = async (req, res) => {
    try {
      const { conversationId, userId } = req.params
  
      // Update all unread messages where the user is the receiver
      await Message.updateMany({ conversationId, receiverId: userId, read: false }, { $set: { read: true } })
  
      return res.status(200).json({ success: true })
    } catch (error) {
      console.error("Error marking messages as read:", error)
      return res.status(500).json({ success: false, message: "Server error" })
    }
  }

  module.exports ={
    sendMessage,
    getConversationMessages,
    getUserConversations,
    markMessagesAsRead
  }



