"use strict";

const Model = require("../mongo/mongo-collection.js");
const schema = require("./categories-schema.js");

class Categories extends Model {
  constructor() {
    super(schema);
  }
}

module.exports = Categories;
