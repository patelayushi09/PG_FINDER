const mongoose = require("mongoose");
const Schema = mongoose.Schema

const CategorySchema = new Schema({
    categoryName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true
      },
      active: {
        type: Boolean,
        default: true
      }
    
}, { timestamps: true }
);


module.exports = mongoose.model('Category', CategorySchema)