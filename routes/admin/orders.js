const express = require("express");
const router = express.Router();
const Order = require("../../models/Order");
const auth = require("../../middleware/auth");

// @route   POST api/orders
// @desc    Create a new order
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { items, total } = req.body;

    // Get the latest queue number
    const latestOrder = await Order.findOne().sort({ queueNo: -1 });
    const queueNo = latestOrder ? latestOrder.queueNo + 1 : 1;

    // Create new order
    const newOrder = new Order({
      user: req.user.user.id,
      items,
      total,
      queueNo,
      status: "waiting",
    });

    const order = await newOrder.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/orders
// @desc    Get all orders for the logged in user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.user.id }).sort({
      date: -1,
    });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    // Check if order exists
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/orders/:id
// @desc    Update order status
// @access  Private (admin only in a real app)
router.put("/:id", auth, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Update status
    order.status = status;

    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   GET api/orders/status/:status
// @desc    Get orders by status
// @access  Private
router.get("/status/:status", auth, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.user.id,
      status: req.params.status,
    }).sort({ date: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
