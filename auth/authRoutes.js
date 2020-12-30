"use strict";

const basicAuth = require("./middleware/basic.js");
const bearer = require("./middleware/bearer.js");
const express = require("express");
const permissions = require("./middleware/permissions.js");
const users = require("./models/users-models.js");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  try {
    let userObj = {
      username: req.body.username,
      password: req.body.password,
      role: req.body.role,
    };

    let record = new users(userObj);

    let newUser = await record.save();
    let token = await record.generateToken();

    res.set("auth", token);
    let userObject = {
      token: token,
      user: newUser,
    };
    res.status(201).send(userObject);
  } catch (e) {
    next(e.message);
  }
});

router.post("/signin", basicAuth, (req, res, next) => {
  res.set("auth", req.token);
  let output = {
    token: req.token,
    user: req.username,
  };
  res.status(200).json(output);
});

router.get("/secret", bearer, (req, res) => {
  res.status(200).send(`Welcome, ${req.user.username}`);
});

router.get("/article", bearer, permissions("read"), (req, res) => {
  res.status(200).send("You have permission to READ");
});

router.post("/article", bearer, permissions("create"), (req, res) => {
  res.status(200).send("You have permission to CREATE");
});

router.put("/article", bearer, permissions("update"), (req, res) => {
  res.status(200).send("You have permission to UPDATE");
});

router.delete("/article", bearer, permissions("delete"), (req, res) => {
  res.status(200).send("You have permission to DELETE");
});

module.exports = router;
