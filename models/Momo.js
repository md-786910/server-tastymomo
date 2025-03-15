const mongoose = require('mongoose');

const momoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    enum: ['steam', 'fry', 'kurkure'],
    required: true
  },
  image: {
    type: String,
    required: true
  },
  ingredients: {
    type: String,
    default: 'Flour, Water, Salt, Vegetable/Meat filling, Spices, Herbs'
  },
  featured: {
    type: Boolean,
    default: false
  },
  available: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Momo', momoSchema);