const express = require("express")
const router = express.Router()

const tenantController = require('../controllers/tenantController')

router.post("/signup",tenantController.tenantSignup)
router.post("/login",tenantController.tenantLogin)

router.post("/send-otp", tenantController.sendOTP)
router.post("/resend-otp",tenantController.sendOTP)
router.post("/forgot-password/otp", tenantController.validateOTP)
router.post("/change-password", tenantController.changePassword)

router.get("/properties",tenantController.getProperty)


module.exports = router