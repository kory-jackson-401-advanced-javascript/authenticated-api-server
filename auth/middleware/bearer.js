"use strict";

const users = require("../models/users-models.js");

const bearer = async (req, res, next) => {
  try {
    if (!req.headers.authorization) next("Invalid Credentials");

    const token = req.headers.authorization.split(" ").pop();
    const validUser = await users.authenticateWithToken(token);
    req.user = validUser;
    req.token = token;
    next();
  } catch (e) {
    next("Invalid Login");
  }
};

module.exports = bearer;
