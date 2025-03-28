const express = require("express")
const router = express.Router()
const multer = require("multer")

const landlordController = require('../controllers/landlordController')
const { authenticateToken } = require("../utils/utilities")

// Configure multer for file uploads
const storage = multer.memoryStorage()// Use diskStorage if saving files to disk
const upload = multer({ storage })


router.post("/signup",landlordController.landlordSignup)
router.post("/login",landlordController.landlordLogin)

router.post("/send-otp", landlordController.sendOTP)
router.post("/resend-otp",landlordController.sendOTP)
router.post("/forgot-password/otp", landlordController.validateOTP)
router.post("/change-password", landlordController.changePassword)


router.get("/properties", authenticateToken("landlord"), landlordController.getProperties);
router.delete("/properties/:id",landlordController.deleteProperty)
router.put("/properties/:id",landlordController.updateProperty)
router.get("/properties/:id",landlordController.getPropertyById)
router.post("/properties", authenticateToken("landlord"),upload.single("image"), landlordController.addProperty);



router.get('/bookings/:landlordId', landlordController.getLandlordBookings);
router.put('/bookings/:bookingId/status', landlordController.updateBookingStatus);

router.get('/',landlordController.getLandlord)

module.exports = router