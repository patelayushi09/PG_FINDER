const express = require("express")
const router = express.Router()

const landlordController = require('../controllers/landlordController')

router.post("/signup",landlordController.landlordSignup)
router.post("/login",landlordController.landlordLogin)
router.post("/send-otp", landlordController.sendOTP)
router.post("/resend-otp",landlordController.sendOTP)
router.post("/forgot-password/otp", landlordController.validateOTP)
router.post("/change-password", landlordController.changePassword)


module.exports = router