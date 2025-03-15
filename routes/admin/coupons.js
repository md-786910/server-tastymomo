const express = require("express");
const {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../../controllers/admin/couponController");

const couponRouter = express.Router();

// Add middleware here if needed
// const { protect, authorize } = require('../../middleware/auth');
// router.use(protect);
// router.use(authorize('admin'));

couponRouter.route("/").get(getCoupons).post(createCoupon);

couponRouter
  .route("/:id")
  .get(getCoupon)
  .put(updateCoupon)
  .delete(deleteCoupon);

module.exports = couponRouter;