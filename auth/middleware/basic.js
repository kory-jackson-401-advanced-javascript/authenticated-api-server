"use strict";

const base64 = require("base-64");
const users = require("../models/users-models.js");

const basicAuth = async (req, res, next) => {
  try {
    let authorization = req.headers.authorization;
    let encoded = authorization.split(" ")[1];
    let credentials = base64.decode(encoded);
    let [username, password] = credentials.split(":");

    let userRecord = await users.validateBasicAuth(username, password);

    req.token = userRecord.generateToken();

    req.user = userRecord;

    next();
  } catch (e) {
    next("Invalid Credentials");
  }
};

module.exports = basicAuth;
