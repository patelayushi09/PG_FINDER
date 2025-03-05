const mongoose = require("mongoose");
const Schema = mongoose.Schema

const TenantSchema = new Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    phoneno: {
        type: String,
    },
    gender: {
        type: String,
    },
    status: {
        type: String,
    },
    createPassword: {
        type: String,
    },
    confirmPassword: {
        type: String,
    }
});

module.exports = mongoose.model("tenant", TenantSchema)