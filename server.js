"use strict";

require("dotenv").config();

const express = require("express");
const cors = require("cors");

// dependencies
const logger = require("./middleware/logger.js");
const apiRoutes = require("./api/api-v1.js");
const authRoutes = require("./auth/authRoutes.js");
const notFoundHandler = require("./middleware/404.js");
const errorHandler = require("./middleware/500.js");

const app = express();

//Global Variables
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);

//Routes
app.use("/api/v1/", apiRoutes);
app.use(authRoutes);

app.use("*", notFoundHandler);
app.use(errorHandler);

module.exports = {
  app,
  start: (port) => app.listen(port, console.log("Up on ", port)),
};
