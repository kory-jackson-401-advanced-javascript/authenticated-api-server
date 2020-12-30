"use strict";

class Model {
  constructor(schema) {
    this.schema = schema;
  }

  post(obj) {
    let newRecord = new this.schema(obj);
    return newRecord.save();
  }

  get(id) {
    if (id) {
      return this.schema.findById(id);
    } else {
      return this.schema.find({});
    }
  }

  put(id, updateContent) {
    return this.schema.findByIdAndUpdate(id, updateContent, { new: true });
  }

  delete(id) {
    return this.schema.findByIdAndDelete(id);
  }
}

module.exports = Model;
