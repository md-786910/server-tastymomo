// @desc    Get all discounts
// @route   GET /api/v1/discounts

const Discount = require("../../models/Discount");
const AppError = require("../../utils/AppError");
const asyncHandler = require("../../utils/catchasync");

// @access  Private/Admin
exports.getDiscounts = asyncHandler(async (req, res, next) => {
  const discounts = await Discount.find();

  res.status(200).json({
    success: true,
    count: discounts.length,
    data: discounts,
  });
});

// @desc    Get single discount
// @route   GET /api/v1/discounts/:id
// @access  Private/Admin
exports.getDiscount = asyncHandler(async (req, res, next) => {
  const discount = await Discount.findById(req.params.id);

  if (!discount) {
    return next(
      new AppError(`Discount not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: discount,
  });
});

// @desc    Create new discount
// @route   POST /api/v1/discounts
// @access  Private/Admin
exports.createDiscount = asyncHandler(async (req, res, next) => {
  const discount = await Discount.create(req.body);

  res.status(201).json({
    success: true,
    data: discount,
  });
});

// @desc    Update discount
// @route   PUT /api/v1/discounts/:id
// @access  Private/Admin
exports.updateDiscount = asyncHandler(async (req, res, next) => {
  let discount = await Discount.findById(req.params.id);

  if (!discount) {
    return next(
      new AppError(`Discount not found with id of ${req.params.id}`, 404)
    );
  }

  discount = await Discount.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: discount,
  });
});

// @desc    Delete discount
// @route   DELETE /api/v1/discounts/:id
// @access  Private/Admin
exports.deleteDiscount = asyncHandler(async (req, res, next) => {
  const discount = await Discount.findById(req.params.id);

  if (!discount) {
    return next(
      new AppError(`Discount not found with id of ${req.params.id}`, 404)
    );
  }

  await discount.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
