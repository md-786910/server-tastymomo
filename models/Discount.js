const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a category name"],
      trim: true,
    },
    percentage: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Discount = mongoose.model("Discount", DiscountSchema);
module.exports = Discount;
