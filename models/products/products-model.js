"use strict";

const Model = require("../mongo-collection.js");
const schema = require("./products-schema.js");

class Products extends Model {
  constructor() {
    super(schema);
  }
}

module.exports = Products;
