const express = require("express");
const router = express.Router();
const Momo = require("../../models/Momo");
const auth = require("../../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed"));
  },
});

// @route   GET api/momos
// @desc    Get all momos
// @access  Public
router.get("/", async (req, res) => {
  try {
    const momos = await Momo.find().sort({ createdAt: -1 });
    res.json(momos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/momos/featured
// @desc    Get featured momos
// @access  Public
router.get("/featured", async (req, res) => {
  try {
    const momos = await Momo.find({ featured: true, available: true });
    res.json(momos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/momos/type/:type
// @desc    Get momos by type
// @access  Public
router.get("/type/:type", async (req, res) => {
  try {
    const momos = await Momo.find({
      type: req.params.type,
      available: true,
    });
    res.json(momos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/momos/:id
// @desc    Get momo by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const momo = await Momo.findById(req.params.id);

    if (!momo) {
      return res.status(404).json({ msg: "Momo not found" });
    }

    res.json(momo);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Momo not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   POST api/momos
// @desc    Create a momo
// @access  Private (admin only)
router.post("/", [auth, upload.single("image")], async (req, res) => {
  try {
    const { name, description, price, discount, type, ingredients, featured } =
      req.body;

    // Create new momo
    const newMomo = new Momo({
      name,
      description,
      price,
      discount: discount || 0,
      type,
      ingredients:
        ingredients ||
        "Flour, Water, Salt, Vegetable/Meat filling, Spices, Herbs",
      image: req.file
        ? `/uploads/${req.file.filename}`
        : "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?q=80&w=1000&auto=format&fit=crop",
      featured: featured === "true",
    });

    const momo = await newMomo.save();
    res.json(momo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/momos/:id
// @desc    Update a momo
// @access  Private (admin only)
router.put("/:id", [auth, upload.single("image")], async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discount,
      type,
      ingredients,
      featured,
      available,
    } = req.body;

    // Find momo
    const momo = await Momo.findById(req.params.id);

    if (!momo) {
      return res.status(404).json({ msg: "Momo not found" });
    }

    // Update fields
    if (name) momo.name = name;
    if (description) momo.description = description;
    if (price) momo.price = price;
    if (discount !== undefined) momo.discount = discount;
    if (type) momo.type = type;
    if (ingredients) momo.ingredients = ingredients;
    if (featured !== undefined) momo.featured = featured === "true";
    if (available !== undefined) momo.available = available === "true";

    // Update image if provided
    if (req.file) {
      momo.image = `/uploads/${req.file.filename}`;
    }

    await momo.save();
    res.json(momo);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Momo not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/momos/:id
// @desc    Delete a momo
// @access  Private (admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    const momo = await Momo.findById(req.params.id);

    if (!momo) {
      return res.status(404).json({ msg: "Momo not found" });
    }

    // Using deleteOne instead of remove which is deprecated
    await Momo.deleteOne({ _id: req.params.id });
    res.json({ msg: "Momo removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Momo not found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
