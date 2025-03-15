const mongoose = require("mongoose");
const Schema = mongoose.Schema

const InquirySchema = new Schema({
    tenantId: {
        type: Schema.Types.ObjectId,
        ref: "Tenant",
    },
    propertyId: {
        type: Schema.Types.ObjectId,
        ref: "Property",
    },
    message:{
        type: String,
    },
    status:{
        type: String,
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Inquiry', InquirySchema)