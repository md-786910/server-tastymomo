const express = require("express");
const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../../controllers/categoryController");
const categoriesRouter = express.Router();

categoriesRouter.route("/").get(getCategories).post(createCategory);

categoriesRouter
  .route("/:id")
  .get(getCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

module.exports = categoriesRouter;
