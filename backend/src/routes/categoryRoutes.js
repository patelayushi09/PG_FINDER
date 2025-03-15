const express = require("express")
const router = express.Router()

const categoryController = require('../controllers/categoryController')

router.post("/addcategory", categoryController.addCategory)
router.get("/getallcategories", categoryController.getCategories)


module.exports = router