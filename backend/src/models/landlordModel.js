const mongoose = require("mongoose");
const Schema = mongoose.Schema

const LandlordSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    phoneno: {
        type: String,
    },
    propertyName: {
        type: String,
    },
    propertyAddress: {
        type: String,
    },
    propertyState: {
        type: String,
    },
    propertyId: {
        type: String,
    },
    createPassword: {
        type: String,
    },
    confirmPassword: {
        type: String,
    }
});

module.exports = mongoose.model("landlord", LandlordSchema)