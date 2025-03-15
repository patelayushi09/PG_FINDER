const express = require("express")
const router = express.Router()

const inquiryController = require('../controllers/inquiryController')

router.post("/addInquiry", inquiryController.addInquiry)
router.get("/getallInquiries", inquiryController.getInquiries)


module.exports = router