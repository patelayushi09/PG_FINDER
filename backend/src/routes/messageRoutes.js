const express = require("express")
const router = express.Router()

const messageController = require('../controllers/messageController')


router.post("/", messageController.sendMessage)
router.get("/conversations/:conversationId", messageController.getConversationMessages)
router.get("/conversations/:userId/:userType", messageController.getUserConversations)
router.patch("/conversations/:conversationId/:userId/read", messageController.markMessagesAsRead)

module.exports = router



