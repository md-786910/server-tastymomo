const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema(
  {
    couponCode: {
      type: String,
      required: [true, "Please add a coupon code"],
      trim: true,
      uppercase: true,
      maxlength: [20, "Coupon code cannot be more than 20 characters"],
    },
    discountAmount: {
      type: Number,
      min: [0, "Discount amount cannot be negative"],
    },
    maxUsed: {
      type: Number,
      min: [1, "Maximum usage must be at least 1"],
    },
    expiryDate: {
      type: Date,
      required: [true, "Please add an expiry date"],
    },
    remainingUsed: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Set remainingUsed equal to maxUsed when creating a new coupon
CouponSchema.pre("save", function (next) {
  if (this.isNew) {
    this.remainingUsed = this.maxUsed;
  }
  next();
});

// Check if coupon is valid
CouponSchema.methods.isValid = function () {
  const now = new Date();
  return this.isActive && this.remainingUsed > 0 && this.expiryDate > now;
};

const Coupon = mongoose.model("Coupon", CouponSchema);

module.exports = Coupon;
