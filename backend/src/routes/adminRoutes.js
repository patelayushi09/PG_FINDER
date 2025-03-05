const express = require("express")
const router = express.Router()

const adminController = require('../controllers/adminController')

router.post("/login", adminController.adminLogin)
router.post("/send-otp", adminController.sendOTP)
router.post("/resend-otp",adminController.sendOTP)
router.post("/forgot-password/otp", adminController.validateOTP)
router.post("/change-password", adminController.changePassword)


module.exports = router