const express = require("express")
const router = express.Router()

const favoriteController = require('../controllers/favoriteController')

router.post("/addfavorite", favoriteController.addFavorite)
router.get("/getallfavorites", favoriteController.getFavorites)


module.exports = router