const mongoose = require("mongoose")
const Schema = mongoose.Schema

const BookingSchema = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "tenant",
      required: true,
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    landlordId: {
      type: Schema.Types.ObjectId,
      ref: "landlord",
      required: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed", "active", "upcoming"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded", "failed"],
      default: "pending",
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Booking", BookingSchema)

