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
    agencyName: {
        type: String,
    },
    licenseNo: {
        type: String,
    },
    experienceYears: {
        type: Number,
    },
    rating: {
        type: Number,
    },
    address: {
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