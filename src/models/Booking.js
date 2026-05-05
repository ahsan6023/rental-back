const mongoose = require("mongoose");

const bookingItemSchema = new mongoose.Schema(
  {
    equipmentId: { type: String, required: true, trim: true },
    equipmentName: { type: String, required: true, trim: true },
    pricePerDay: { type: Number, required: true, min: 1 },
    quantity: { type: Number, required: true, min: 1 },
    days: { type: Number, required: true, min: 1 },
    itemTotal: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    items: { type: [bookingItemSchema], required: true, validate: [(items) => items.length > 0, "At least one item is required."] },
    totalCost: { type: Number, required: true, min: 1 },
    email: { type: String, required: true, trim: true, lowercase: true },
    address: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
