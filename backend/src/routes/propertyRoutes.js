const express = require("express")
const router = express.Router()

const propertyController = require('../controllers/propertyController')

router.post("/addProperty", propertyController.addProperty)
router.get("/getallProperties", propertyController.getProperties)


module.exports = router