const Category = require('../models/categoryModel')

//add category
const addCategory = async (req, res) => {
    try {

        const savedCategory = await Category.create(req.body);
        res.status(201).json({
            message: "Category added successfully",
            data: savedCategory
        })
    } catch (err) {
        res.status(500).json({ message: err });
    }
};

//get Category
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({
            message: "All Categories fetched successfully",
            data: categories,
        });
    } catch (err) {
        res.status(500).json({ message: err });
    }
};


module.exports = {
    addCategory,
    getCategories,
};