const mongoose = require("mongoose");
const Schema = mongoose.Schema

const PropertySchema = new Schema({
    title: {
        type: String,
    },
    propertyName: {
        type: String,
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category",
    },
    address: {
        type: String,
    },
    cityId: {
        type: Schema.Types.ObjectId,
        ref: "City",
    },
    stateId: {
        type: Schema.Types.ObjectId,
        ref: "State",
    },
    zipcode: {
        type: String,
    },
    areaId: {
        type: Schema.Types.ObjectId,
        ref: "Area",
    },
    tenantId: {
        type: Schema.Types.ObjectId,
        ref: "Tenant",
    },
    description: {
        type: String,
    },
    basePrice: {
        type: String,
    },
    otherPriceDescription: {
        type: String,
    },
    bedrooms: {
        type: Number,
    },
    bathrooms: {
        type: Number,
    },
    furnishingStatus: {
        type: String,
    },
    yearBuilt: {
        type: Number,
    },
    availabilityStatus: {
        type: String,
    }
});

module.exports = mongoose.model('Property', PropertySchema)