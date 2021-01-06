"use strict";

const Model = require("../mongo-collection.js");
const schema = require("./todo-schema.js");

class ToDo extends Model {
  constructor() {
    super(schema);
  }
}

module.exports = ToDo;
