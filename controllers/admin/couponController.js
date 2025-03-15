const Coupon = require("../../models/Coupon");
const AppError = require("../../utils/AppError");
const asyncHandler = require("../../utils/catchasync");

// @desc    Get all coupons
// @route   GET /api/v1/coupons
// @access  Private/Admin
exports.getCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await Coupon.find();

  res.status(200).json({
    success: true,
    count: coupons.length,
    data: coupons,
  });
});

// @desc    Get single coupon
// @route   GET /api/v1/coupons/:id
// @access  Private/Admin
exports.getCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(
      new AppError(`Coupon not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: coupon,
  });
});

// @desc    Create new coupon
// @route   POST /api/v1/coupons
// @access  Private/Admin
exports.createCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.create(req.body);

  res.status(201).json({
    success: true,
    data: coupon,
  });
});

// @desc    Update coupon
// @route   PUT /api/v1/coupons/:id
// @access  Private/Admin
exports.updateCoupon = asyncHandler(async (req, res, next) => {
  let coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(
      new AppError(`Coupon not found with id of ${req.params.id}`, 404)
    );
  }

  coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: coupon,
  });
});

// @desc    Delete coupon
// @route   DELETE /api/v1/coupons/:id
// @access  Private/Admin
exports.deleteCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(
      new AppError(`Coupon not found with id of ${req.params.id}`, 404)
    );
  }

  await coupon.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
