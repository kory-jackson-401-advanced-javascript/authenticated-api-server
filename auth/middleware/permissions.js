"use strict";

module.exports = (capable) => {
  return (req, res, next) => {
    if (req.user.permissions(capable)) {
      next();
    } else {
      next(
        `You do not have the correct permissions for this action as a(n) ${req.user.role}.`
      );
    }
  };
};
