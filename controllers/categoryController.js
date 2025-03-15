const Category = require("../models/Category");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/catchasync");

exports.getCategories = asyncHandler(async (req, res, next) => {
  const data = await Category.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    data,
  });
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(
      new AppError(`Category not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: category,
  });
});

exports.createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create(req.body);
  res.status(201).json({
    success: true,
    data: category,
  });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.id);
  if (!category) {
    return next(
      new AppError(`Category not found with id of ${req.params.id}`, 404)
    );
  }

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: category,
  });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(
      new AppError(`Category not found with id of ${req.params.id}`, 404)
    );
  }
  await category.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});
