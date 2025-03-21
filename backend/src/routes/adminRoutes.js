const express = require("express")
const router = express.Router()

const adminController = require('../controllers/adminController')

router.post("/login", adminController.adminLogin)

router.post("/send-otp", adminController.sendOTP)
router.post("/resend-otp",adminController.sendOTP)
router.post("/forgot-password/otp", adminController.validateOTP)
router.post("/change-password", adminController.changePassword)

router.get("/users",adminController.getUsers)
router.delete("/users/:id",adminController.deleteUser)
router.put("/users/:id",adminController.updateUser)
router.get("/users/:id",adminController.getUserById)
router.post("/users",adminController.addUser)

module.exports = router