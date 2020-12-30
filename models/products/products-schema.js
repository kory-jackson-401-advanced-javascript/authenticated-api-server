"use strict";

const mongoose = require("mongoose");

const products = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  inStock: { type: Number, required: true },
});

module.exports = mongoose.model("products", products);
