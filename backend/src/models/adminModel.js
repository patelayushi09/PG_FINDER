const mongoose = require("mongoose");
const Schema = mongoose.Schema

const AdminSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Admin', AdminSchema)