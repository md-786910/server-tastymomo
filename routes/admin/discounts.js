const express = require("express");
const {
  getDiscounts,
  getDiscount,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} = require("../../controllers/admin/discountController");

const discountRouter = express.Router();

// Add middleware here if needed
// const { protect, authorize } = require('../../middleware/auth');
// router.use(protect);
// router.use(authorize('admin'));

discountRouter.route("/").get(getDiscounts).post(createDiscount);

discountRouter
  .route("/:id")
  .get(getDiscount)
  .put(updateDiscount)
  .delete(deleteDiscount);

module.exports = discountRouter;
