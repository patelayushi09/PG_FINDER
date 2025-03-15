const Property = require('../models/propertyModel')

//add Property 
const addProperty  = async (req, res) => {
    try {

        const savedProperty  = await Property.create(req.body);
        res.status(201).json({
            message: "Property  added successfully",
            data: savedProperty
        })
    } catch (err) {
        res.status(500).json({ message: err });
    }
};

//get Property 
const getProperties = async (req, res) => {
    try {
        const properties  = await Property.find();
        res.status(200).json({
            message: "All Property fetched successfully",
            data: properties,
        });
    } catch (err) {
        res.status(500).json({ message: err });
    }
};


module.exports = {
    addProperty,
    getProperties,
};