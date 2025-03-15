const Favorite = require('../models/favoriteModel')

//add Favorite
const addFavorite = async (req, res) => {
    try {

        const savedFavorite = await Favorite.create(req.body);
        res.status(201).json({
            message: "Favorite added successfully",
            data: savedFavorite
        })
    } catch (err) {
        res.status(500).json({ message: err });
    }
};

//get Favorite
const getFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find();
        res.status(200).json({
            message: "All Favorites fetched successfully",
            data: favorites,
        });
    } catch (err) {
        res.status(500).json({ message: err });
    }
};


module.exports = {
    addFavorite,
    getFavorites,
};